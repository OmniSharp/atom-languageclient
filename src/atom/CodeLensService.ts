/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { Point } from 'atom';
import { CodeLens, CommandType, IAtomNavigation, ICodeLensProvider, ICodeLensService, IReferencesService, Reference, navigationHasRange } from 'atom-languageservices';
import { alias, inject, injectable } from 'atom-languageservices/decorators';
import { Location as TLocation } from 'vscode-languageserver-types';
import { readFile } from 'fs';
import { CompositeDisposable, Disposable, DisposableBase } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { fromUri } from './../capabilities/utils/convert';
import { atomConfig } from '../decorators';
import { observeCallback } from '../helpers/index';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { AtomViewFinder } from './AtomViewFinder';
import { CommandsService } from './CommandsService';
type Location = IAtomNavigation.Location;

@injectable
@alias(ICodeLensService)
@atomConfig({
    default: true,
    description: 'Adds support for codeLens'
})
export class CodeLensService
    extends ProviderServiceBase<ICodeLensProvider, CodeLens.IRequest, Observable<CodeLens.IResponse[]>, Observable<CodeLens.IResponse[]>>
    implements ICodeLensService {
    private _navigation: AtomNavigation;
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _source: AtomTextEditorSource;
    private _editors = new Set<EditorCodeLensService>();
    private _viewFinder: AtomViewFinder;
    private _referencesService: IReferencesService;

    constructor(
        navigation: AtomNavigation,
        commands: CommandsService,
        atomCommands: AtomCommands,
        source: AtomTextEditorSource,
        viewFinder: AtomViewFinder,
        @inject(IReferencesService) referencesService: IReferencesService
    ) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
        this._viewFinder = viewFinder;
        this._referencesService = referencesService;
        this._configure();

        this._disposable.add(() => {
            this._editors.forEach(x => x.dispose());
            this._editors.clear();
        });
    }

    private _configure() {
        this._source.observeTextEditors
            .subscribe(_.bind(this._configureEditor, this));
    }

    public onEnabled() {
        return Disposable.empty;
    }

    public registerProvider(provider: ICodeLensProvider) {
        this._refresh();
        return super.registerProvider(provider);
    }

    protected createInvoke(callbacks: ((options: CodeLens.IRequest) => Observable<CodeLens.IResponse[]>)[]) {
        return ((options: CodeLens.IRequest) => {
            const requests = _.over(callbacks)(options);
            return Observable.from(requests)
                .mergeMap(x => x)
                .scan((acc, value) => { acc.push(...value); return acc; }, [])
                .debounceTime(200);
        });
    }

    private _refresh = _.debounce(() => {
        this._editors.forEach(x => x.refresh());
    }, 1000);

    private _configureEditor(editor: Atom.TextEditor) {
        const service = new EditorCodeLensService(editor, (editor: Atom.TextEditor) => this.invoke({ editor }), this._viewFinder, this._referencesService);
        this._editors.add(service);
    }
}

interface EditorCodeLensItem {
    marker: TextBuffer.DisplayMarker;
    codeLens: CodeLens.IResponse;
    item: HTMLAnchorElement;
    resolved: boolean;
}

class EditorCodeLensService extends DisposableBase {
    private _editor: Atom.TextEditor;
    private _request: (editor: Atom.TextEditor) => Observable<CodeLens.IResponse[]>;
    private _lenses: EditorCodeLensItem[] = [];
    private _kick: Observer<void>;
    private _viewFinder: AtomViewFinder;
    private _referencesService: IReferencesService;

    constructor(editor: Atom.TextEditor, request: (editor: Atom.TextEditor) => Observable<CodeLens.IResponse[]>, viewFinder: AtomViewFinder, referencesService: IReferencesService) {
        super();
        this._editor = editor;
        this._request = request;
        this._viewFinder = viewFinder;
        this._referencesService = referencesService;
        const kick = this._kick = new Subject<void>();

        this._disposable.add(
            editor.onDidChangeScrollTop(_.throttle(() => {
                const element: any = this._viewFinder.getView(this._editor);
                const top = element.getFirstVisibleScreenRow();
                const bottom = element.getLastVisibleScreenRow() - 2;

                _.each(this._lenses, lens => {
                    if (!lens.resolved) {
                        this._resolveMarker(lens, [top, bottom]);
                    }
                });
            }, 200, { leading: true, trailing: true })),
            editor.onDidDestroy(() => {
                this.dispose();
            }),
            () => {
                this._lenses.forEach(({marker}) => {
                    marker.destroy();
                });
            },
            Observable.merge(
                Observable.of(null),
                kick,
                observeCallback<any>(editor.onDidStopChanging, editor)
            )
                .startWith(null)
                .switchMap(() => {
                    return this._request(editor);
                })
                .subscribe(results => {
                    const element: any = this._viewFinder.getView(this._editor);
                    const top = element.getFirstVisibleScreenRow();
                    const bottom = element.getLastVisibleScreenRow() - 2;
                    _.each(results, result => {
                        this._setMarker(result, [top, bottom]);
                    });
                })
        );
    }

    public refresh() {
        this._kick.next(void 0);
    }

    private _resolveMarker(lens: EditorCodeLensItem, [top, bottom]: [number, number]) {
        if (lens.codeLens.range.start.row > top && lens.codeLens.range.start.row < bottom) {
            lens.resolved = true;
            lens.codeLens.resolve()
                .subscribe(() => {
                    lens.item.innerHTML = lens.codeLens.command!.title;
                });
        }
    }

    private _setMarker(codeLens: CodeLens.IResponse, [top, bottom]: [number, number]) {
        let context = _.find(this._lenses, x => x.marker.getBufferRange().isEqual(codeLens.range));
        if (!context) {
            const marker = this._editor.markBufferRange(codeLens.range);
            const indentation = this._editor.indentationForBufferRow(codeLens.range.start.row) * this._editor.getTabLength();
            const width = this._editor.getDefaultCharWidth();
            const item = document.createElement('a');
            item.onclick = () => {
                if (codeLens.command!.command === 'references') {
                    const location: TLocation = codeLens.data.location;
                    this._referencesService.open({
                        editor: this._editor,
                        position: new Point(location.range.start.line, location.range.start.character),
                        filePath: this._editor.getURI()
                    });
                }
            };

            item.style.marginLeft = `${indentation * width}px`;

            this._editor.decorateMarker(marker, {
                type: 'block',
                position: 'before',
                item
            });
            context = { item, codeLens, marker, resolved: false };
            this._lenses.push(context);

            if (codeLens.range.start.row > top && codeLens.range.start.row < bottom) {
                this._resolveMarker(context, [top, bottom]);
            }
        }

        context.item.innerHTML = 'Loading...';
    }
}
