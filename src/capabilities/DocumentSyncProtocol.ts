/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';
import { capability, inject } from '../services/_decorators';
import { IAtomViewFinder, IDocumentDelayer, ILanguageProtocolClient, ISyncExpression } from '../services/_public';
import { TextDocumentSyncKind } from '../vscode-languageserver-types';
import { AtomTextEditorSource } from '../atom/AtomTextEditorSource';
import { TextEditorSyncProtocol } from './TextEditorSyncProtocol';

@capability
export class DocumentSyncProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _atomTextEditorSource: AtomTextEditorSource;
    private _syncExpression: ISyncExpression;
    private _documentDelayer: IDocumentDelayer;
    private _atomViewFinder: IAtomViewFinder;
    private _editors = new WeakMap<Atom.TextEditor, TextEditorSyncProtocol>();

    constructor(
        @inject(ILanguageProtocolClient) client: ILanguageProtocolClient,
        @inject(ISyncExpression) syncExpression: ISyncExpression,
        @inject(IDocumentDelayer) documentDelayer: IDocumentDelayer,
        @inject(IAtomViewFinder) atomViewFinder: IAtomViewFinder,
        atomTextEditorSource: AtomTextEditorSource
    ) {
        super();
        if (client.capabilities.textDocumentSync === TextDocumentSyncKind.None) { return; }
        this._client = client;
        this._syncExpression = syncExpression;
        this._documentDelayer = documentDelayer;
        this._atomTextEditorSource = atomTextEditorSource;
        this._atomViewFinder = atomViewFinder;

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
            const sync = new TextEditorSyncProtocol(this._client, this._syncExpression, this._documentDelayer, this._atomViewFinder, editor);
            this._editors.set(editor, sync);
            this._disposable.add(sync);
        }
    }
}
