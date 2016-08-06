/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { IAtomViewFinder, IDocumentDelayer, ILanguageProtocolClient, ISyncExpression, IWaitService } from 'atom-languageservices';
import { capability, inject } from 'atom-languageservices/decorators';
import { TextDocumentSyncKind } from 'atom-languageservices/types';
import { DisposableBase } from 'ts-disposables';
import { AtomTextEditorSource } from '../atom/AtomTextEditorSource';
import { TextEditorSyncProtocol } from './TextEditorSyncProtocol';

@capability((capabilities) => capabilities.textDocumentSync !== TextDocumentSyncKind.None)
export class DocumentSyncProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _atomTextEditorSource: AtomTextEditorSource;
    private _syncExpression: ISyncExpression;
    private _documentDelayer: IDocumentDelayer;
    private _atomViewFinder: IAtomViewFinder;
    private _waitService: IWaitService;
    private _editors = new WeakMap<Atom.TextEditor, TextEditorSyncProtocol>();

    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(ISyncExpression) syncExpression: ISyncExpression,
        @inject(IDocumentDelayer) documentDelayer: IDocumentDelayer,
        @inject(IAtomViewFinder) atomViewFinder: IAtomViewFinder,
        @inject(IWaitService) waitService: IWaitService,
        atomTextEditorSource: AtomTextEditorSource
    ) {
        super();
        this._client = client;
        this._syncExpression = syncExpression;
        this._documentDelayer = documentDelayer;
        this._atomTextEditorSource = atomTextEditorSource;
        this._atomViewFinder = atomViewFinder;
        this._waitService = waitService;

        this._configure();

        this._disposable.add(() => this._editors.clear());
    }

    private _configure() {
        this._atomTextEditorSource.observeTextEditors
            .filter(editor => this._syncExpression.evaluate(editor))
            .subscribe(_.bind(this._configureEditor, this));
    }

    private _configureEditor(editor: Atom.TextEditor) {
        if (!this._editors.has(editor)) {
            const sync = new TextEditorSyncProtocol(this._client, this._syncExpression, this._documentDelayer, this._atomViewFinder, this._waitService, editor);

            this._editors.set(editor, sync);
            this._disposable.add(sync);
            this._disposable.add(editor.onDidDestroy(() => {
                this._editors.delete(editor);
                this._disposable.remove(sync);
                sync.dispose();
            }));
        }
    }
}
