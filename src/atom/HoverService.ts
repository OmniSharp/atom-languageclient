/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { CommandType, Hover, IHoverProvider, IHoverService } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { CompositeDisposable, IDisposable } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomLanguageClientConfig } from '../AtomLanguageClientConfig';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { AtomViewFinder } from './AtomViewFinder';
import { CommandsService } from './CommandsService';
import { HoverView, IHoverPosition } from './views/HoverView';

@injectable()
@alias(IHoverService)
export class HoverService
    extends ProviderServiceBase<IHoverProvider, Hover.IRequest, Observable<Hover.IResponse>, Observable<Hover.IResponse[]>>
    implements IHoverService {
    private _commands: CommandsService;
    private _textEditorSource: AtomTextEditorSource;
    private _viewFinder: AtomViewFinder;

    private _editor: Atom.TextEditor | undefined;
    private _editorView: Atom.TextEditorPresenter | undefined;
    private _editorShadow: Element | undefined;
    private _editorDisposable: IDisposable;

    private _view: HoverView;
    private _keydown: Observable<KeyboardEvent>;
    private _keydownSubscription: Subscription | undefined;

    constructor(packageConfig: AtomLanguageClientConfig, commands: CommandsService, textEditorSource: AtomTextEditorSource, viewFinder: AtomViewFinder) {
        super(HoverService, packageConfig, {
            default: true,
            description: 'Adds support for getting lookup info on hover / key press'
        });
        this._commands = commands;
        this._textEditorSource = textEditorSource;
        this._viewFinder = viewFinder;

        this._view = new HoverView();
    }

    protected onEnabled() {
        return new CompositeDisposable(
            this._commands.add(CommandType.TextEditor, `lookup`, 'f1', () => this.showOnCommand()),
            this._textEditorSource.observeActiveTextEditor
                .subscribe(_.bind(this._setupView, this))
        );
    }

    protected createInvoke(callbacks: ((options: Hover.IRequest) => Observable<Hover.IResponse>)[]) {
        return (options: Hover.IRequest) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .scan((acc, results) => _.compact(acc.concat(results)), []);
        };
    }

    private _setupView(editor: Atom.TextEditor) {
        this._hide();
        if (this._editorDisposable) {
            this._editorDisposable.dispose();
        }

        if (editor) {
            this._editor = editor;
            /* tslint:disable-next-line:no-any */
            this._editorView = <any>this._viewFinder.getView(editor);
            this._editorShadow = this._getFromShadowDom(this._editorView!, '.scroll-view');
            this._setupMouse(editor);
        } else {
            this._editor = undefined;
            this._editorView = undefined;
            this._editorShadow = undefined;
        }
    }

    private _setupMouse(editor: Atom.TextEditor) {
        const cd = new CompositeDisposable();
        const mousemove = Observable.fromEvent<MouseEvent>(this._editorShadow!, 'mousemove');
        const mouseout = Observable.fromEvent<MouseEvent>(this._editorShadow!, 'mouseout');
        this._keydown = Observable.fromEvent<KeyboardEvent>(this._editorShadow!, 'keydown');

        cd.add(
            mousemove
                .map(event => {
                    return { pixelPt: this._pixelPositionFromMouseEvent(event) !, event };
                })
                .filter(context => !!context.pixelPt)
                .distinctUntilChanged((a, b) => {
                    return a.pixelPt.left === b.pixelPt.left && a.pixelPt.top === b.pixelPt.top;
                })
                .map(({pixelPt, event}) => {
                    const screenPt = editor.screenPositionForPixelPosition(pixelPt);
                    const bufferPt = editor.bufferPositionForScreenPosition(screenPt);

                    return { bufferPt, event };
                })
                .do(() => this._hide())
                .auditTime(200)
                .filter(x => {
                    return this._checkPosition(x.bufferPt);
                })
                .do(() => this._subcribeKeyDown())
                .subscribe(({bufferPt, event}) => {
                    this._showOnMouseOver(event, bufferPt);
                }),
            mouseout
                .subscribe((e) => this._hide()),
            () => { this._hide(); }
        );
    }

    private _subcribeKeyDown() {
        this._keydownSubscription = this._keydown.subscribe((e) => this._hide());
        this._disposable.add(this._keydownSubscription);
    }

    public showOnCommand() {
        if (this._editor!.cursors.length < 1) {
            return;
        }

        const bufferPt = this._editor!.getCursorBufferPosition();
        if (!this._checkPosition(bufferPt)) {
            return;
        }

        // find out show position
        const shadow = this._getFromShadowDom(this._editorView!, '.cursor-line');
        if (!shadow) {
            return;
        }

        const offset = (this._editorView!.component.getFontSize() * bufferPt.column) * 0.7;
        const rect = shadow.getBoundingClientRect();

        const tooltipRect = {
            left: rect.left - offset,
            right: rect.left + offset,
            top: rect.bottom,
            bottom: rect.bottom
        };

        this._hide();
        this._subcribeKeyDown();
        this._showToolTip(bufferPt, tooltipRect);
    }

    private _showOnMouseOver(e: MouseEvent, bufferPt: TextBuffer.Point) {
        // find out show position
        const offset = this._editor!.getLineHeightInPixels() * 0.7;
        const tooltipRect = {
            left: e.clientX,
            right: e.clientX,
            top: e.clientY - offset,
            bottom: e.clientY + offset
        };

        this._showToolTip(bufferPt, tooltipRect);
    }

    private _checkPosition(bufferPt: TextBuffer.Point) {
        const curCharPixelPt = this._editor!.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column]);
        const nextCharPixelPt = this._editor!.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column + 1]);

        if (curCharPixelPt.left >= nextCharPixelPt.left) {
            return false;
        } else {
            return true;
        }
    }

    private _showToolTip(bufferPt: TextBuffer.Point, rect: IHoverPosition) {
        this._view.updatePosition(rect, this._editorView);
        this.invoke({ editor: this._editor!, location: bufferPt })
            .scan((acc, result) => acc.concat(result), [])
            .map(rows => _.filter(rows, row => !!row.text))
            .subscribe(rows => {
                const lines = _.map(rows, row => {
                    return `${row.text}<br/>${row.description}`;
                });

                this._view.show();
                this._view.updateText(lines.join('<br/>'));
            });
    }

    private _getFromShadowDom(element: Atom.TextEditorPresenter, selector: string) {
        return element.rootElement.querySelector(selector);
    }

    private _hide() {
        this._view.hide();

        if (this._keydownSubscription) {
            this._disposable.remove(this._keydownSubscription);
            this._keydownSubscription.unsubscribe();
            this._keydownSubscription = undefined;
        }
    }

    private _pixelPositionFromMouseEvent(event: MouseEvent) {
        const shadow = this._editorShadow;
        if (!shadow) {
            return;
        }

        const clientX = event.clientX;
        const clientY = event.clientY;
        const linesClientRect = shadow.getBoundingClientRect();
        const top = clientY - linesClientRect.top + this._editor!.getScrollTop();
        const left = clientX - linesClientRect.left + this._editor!.getScrollLeft();
        return { top, left };
    }
}

// class EditorTooltipProvider
