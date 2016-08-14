/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable, Observer, Subject } from 'rxjs';
import { CodeLens, CommandType, IAtomNavigation, ICodeLensProvider, ICodeLensService, Reference, navigationHasRange } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { readFile } from 'fs';
import { CompositeDisposable, Disposable, DisposableBase } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { atomConfig } from '../decorators';
import { observeCallback } from '../helpers/index';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { CommandsService } from './CommandsService';
import { ReferenceView } from './views/ReferenceView';
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

    constructor(navigation: AtomNavigation, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
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
        const service = new EditorCodeLensService(editor, (editor: Atom.TextEditor) => this.invoke({ editor }));
        this._editors.add(service);
    }
}

class EditorCodeLensService extends DisposableBase {
    private _editor: Atom.TextEditor;
    private _request: (editor: Atom.TextEditor) => Observable<CodeLens.IResponse[]>;
    private _markers: { marker: TextBuffer.DisplayMarker, item: HTMLDivElement; }[] = [];
    private _kick: Observer<void>;

    constructor(editor: Atom.TextEditor, request: (editor: Atom.TextEditor) => Observable<CodeLens.IResponse[]>) {
        super();
        this._editor = editor;
        this._request = request;
        const kick = this._kick = new Subject<void>();

        this._disposable.add(
            editor.onDidDestroy(() => {
                this.dispose();
            }),
            () => {
                this._markers.forEach(({marker}) => {
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
                .mergeMap(_.identity)
                .subscribe(_.bind(this._setMarker, this))
        );
    }

    public refresh() {
        this._kick.next(void 0);
    }

    private _setMarker(codeLens: CodeLens.IResponse) {
        let context = _.find(this._markers, x => x.marker.getBufferRange().isEqual(codeLens.range));
        if (!context) {
            const marker = this._editor.markBufferRange(codeLens.range);

            const item = document.createElement('div');

            this._editor.decorateMarker(marker, {
                type: 'block',
                position: 'before',
                item
            });
            context = { item, marker };
            this._markers.push(context);
        }

        context.item.innerHTML = codeLens.command!.title;
    }
}
