/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { Highlight, IAtomNavigation, IHighlightService } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { readFile } from 'fs';
import { CompositeDisposable, DisposableBase } from 'ts-disposables';
import { atomConfig } from '../decorators';
import { AtomCommands } from './AtomCommands';
import { AtomConfig } from './AtomConfig';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { AtomViewFinder } from './AtomViewFinder';
import { CommandsService } from './CommandsService';
type Location = IAtomNavigation.Location;

const readFile$ = Observable.bindNodeCallback(readFile);
@injectable
@alias(IHighlightService)
@atomConfig({
    default: true,
    description: 'Adds support for highlighting important names'
})
export class HighlightService extends DisposableBase implements IHighlightService {
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _source: AtomTextEditorSource;
    private _config: AtomConfig;
    private _viewFinder: AtomViewFinder;
    private _highlighters = new Set<Highlight.Highlighter>();

    constructor(config: AtomConfig, viewFinder: AtomViewFinder, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._config = config;
        this._viewFinder = viewFinder;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;

        this._disposable.add(() => {
            this._highlighters.forEach(item => {
                item.dispose();
            });
        });
    }

    public onEnabled() {
        // return this._commands.add(CommandType.TextEditor, 'go-to-definition', 'f12', () => this.open());
        return { dispose() { } };
    }

    public getHighlighter() {
        const highlighter = new Highlighter(this._config.for('editor'), this._viewFinder, this._source);
        this._highlighters.add(highlighter);
        return highlighter;
    }
}

class Highlighter extends DisposableBase implements Highlight.Highlighter {
    private _highlighters = new Map<Atom.TextEditor, EditorHighlighter>();
    private _config: AtomConfig;
    private _viewFinder: AtomViewFinder;
    private _source: AtomTextEditorSource;

    constructor(config: AtomConfig, viewFinder: AtomViewFinder, source: AtomTextEditorSource) {
        super();
        this._config = config;
        this._viewFinder = viewFinder;
        this._source = source;
        this._disposable.add(() => {
            this._highlighters.clear();
        });
    }

    public setHighlights(editor: Atom.TextEditor, highlights: Highlight.Item[]) {
        if (!this._highlighters.has(editor)) {
            const cd = new CompositeDisposable();
            this._disposable.add(cd);
            const highlighter = new EditorHighlighter(this._config, this._viewFinder, this._source, editor);
            cd.add(
                highlighter,
                () => {
                    this._highlighters.delete(editor);
                },
                editor.onDidDestroy(() => {
                    cd.dispose();
                })
            );

            this._highlighters.set(editor, highlighter);
        }

        this._highlighters.get(editor) !.setHighlights(highlights);
    }
}

class EditorHighlighter extends DisposableBase {
    private _editor: Atom.TextEditor;
    private _marks: TextBuffer.DisplayMarker[] = [];
    private _highlightsObserver: Observer<Highlight.Item[]>;
    private _decoratorObserver: Observer<[TextBuffer.DisplayMarker, Highlight.Item]>;
    private _config: AtomConfig;
    private _viewFinder: AtomViewFinder;
    private _source: AtomTextEditorSource;
    private _elements: { line: number; item: HTMLElement }[] = [];

    constructor(config: AtomConfig, viewFinder: AtomViewFinder, source: AtomTextEditorSource, editor: Atom.TextEditor) {
        super();
        this._config = config;
        this._viewFinder = viewFinder;
        this._editor = editor;
        this._source = source;
        const highlights = this._highlightsObserver = new Subject<Highlight.Item[]>();
        const decorator = this._decoratorObserver = new Subject<[TextBuffer.DisplayMarker, Highlight.Item]>();

        this._disposable.add(
            editor.onDidChangeScrollTop(_.debounce(() => {
                const element: any = this._viewFinder.getView(this._editor);
                const top = element.getFirstVisibleScreenRow();
                const bottom = element.getLastVisibleScreenRow() - 2;

                _.each(this._elements, ({ line, item }) => {
                    if (line <= top || line >= bottom) {
                        item.style.display = 'none';
                    } else {
                        item.style.display = '';
                    }
                });
            }, 100, { leading: true, trailing: true, maxWait: 200 })),
            highlights
                .asObservable()
                .subscribe(highlghts => {
                    const newAndCurrentMarkers = _.map(_.filter(highlghts, h => h.kind !== 'identifier'), highlight => {
                        let mark = _.find(this._marks, marker => marker.getBufferRange().isEqual(highlight.range));
                        if (!mark) {
                            mark = this._editor.markBufferRange(highlight.range);
                            decorator.next([mark, highlight]);
                        }
                        return mark;
                    });

                    const removedMarkers = _.difference(this._marks, newAndCurrentMarkers);
                    _.pull(this._marks, ...removedMarkers);
                    _.each(removedMarkers, marker => {
                        marker.destroy();
                    });

                    this._marks.push(..._.difference(newAndCurrentMarkers, this._marks));
                }),
            decorator
                .bufferToggle(decorator.throttleTime(500), () => Observable.timer(500))
                .subscribe(items => {
                    _.each(items, ([marker, highlight]) => {
                        this._decorateMarker(marker, highlight);
                    });
                })
        );
    }

    private _decorateMarker(marker: TextBuffer.DisplayMarker, highlight: Highlight.Item) {
        if (marker.isDestroyed()) { return; }

        const item = document.createElement('div');
        const text = this._editor.getTextInBufferRange(highlight.range);
        item.classList.add(...this._getClassForKind(highlight.kind));
        item.innerText = text;
        // item.style.fontWeight = 'bold';
        item.style.pointerEvents = 'none';

        this._elements.push({ line: highlight.range.start.row, item });

        if (this._editor === this._source.activeTextEditor) {
            this._positionElement(marker, highlight.range.start.row, item);
        } else {
            this._source
                .observeActiveTextEditor
                .filter(x => x === this._editor)
                .take(1)
                .subscribe(() => {
                    this._positionElement(marker, highlight.range.start.row, item);
                });
        }
    }

    private _positionElement(marker: TextBuffer.DisplayMarker, line: number, item: HTMLElement) {
        const style = window.getComputedStyle(this._viewFinder.getView(this._editor));
        // item.style.backgroundColor = style.backgroundColor;
        item.style.fontSize = style.fontSize;
        item.style.marginTop = `-${style.lineHeight}`;

        const decoration = this._editor.decorateMarker(marker, { type: 'overlay', item, position: 'tail' });

        this._disposable.add(
            decoration.onDidDestroy(() => {
                _.remove(this._elements, (x) => x.item === item);
            }),
            () => decoration.destroy()
        );


        const element: any = this._viewFinder.getView(this._editor);
        const top = element.getFirstVisibleScreenRow();
        const bottom = element.getLastVisibleScreenRow() - 2;

        if (line <= top || line >= bottom) {
            item.style.display = 'none';
        } else {
            item.style.display = '';
        }
    }

    private _getClassForKind(kind: string) {
        switch (kind) {
            case 'number':
                return ['constant', 'numeric'];
            case 'struct name':
                return ['support', 'constant', 'numeric', 'identifier', 'struct'];
            case 'enum name':
                return ['support', 'constant', 'numeric', 'identifier', 'enum'];
            case 'identifier':
                return ['identifier'];
            case 'class name':
                return ['support', 'class', 'type', 'identifier'];
            case 'delegate name':
                return ['support', 'class', 'type', 'identifier', 'delegate'];
            case 'interface name':
                return ['support', 'class', 'type', 'identifier', 'interface'];
            case 'preprocessor keyword':
                return ['constant', 'other', 'symbol'];
            case 'excluded code':
                return ['comment', 'block'];
            case 'unused code':
                return ['unused'];
            default:
                console.log('unhandled Kind ' + kind);
        }
        return [];
    }

    public setHighlights(highlights: Highlight.Item[]) {
        this._highlightsObserver.next(highlights);
    }
}
