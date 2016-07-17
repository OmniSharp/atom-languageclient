/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';
import { className } from '../../constants';
import { capability, inject } from '../../services/_decorators';
import { IAtomViewFinder, IDocumentDelayer, ILanguageProtocolClient, ISyncExpression } from '../../services/_public';
import { getLanguageId, getUri, toRange, toTextDocumentIdentifier } from './utils/convert';
import { Methods, TextDocumentSyncKind } from '../../vscode-languageserver-types';
import {
    DidChangeTextDocumentNotification,
    DidChangeTextDocumentParams,
    DidCloseTextDocumentNotification,
    DidCloseTextDocumentParams,
    DidOpenTextDocumentNotification,
    DidOpenTextDocumentParams,
    DidSaveTextDocumentNotification,
    DidSaveTextDocumentParams
} from '../../vscode-protocol';
import { AtomTextEditorSource } from '../../atom/AtomTextEditorSource';
import { AtomTextChange, LanguageClientTextEditorChanges } from '../../omni/LanguageClientTextEditorChanges';

export class EditorSync extends DisposableBase {
    private _version = 0;
    private _editor: Atom.TextEditor;
    private _client: ILanguageProtocolClient;
    private _syncExpression: ISyncExpression;
    private _documentDelayer: IDocumentDelayer;
    private _atomViewFinder: IAtomViewFinder;
    private _changes = new LanguageClientTextEditorChanges();
    private _fullText: boolean;

    constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression,
        documentDelayer: IDocumentDelayer,
        atomViewFinder: IAtomViewFinder,
        editor: Atom.TextEditor) {
        super();
        this._client = client;
        this._editor = editor;
        this._syncExpression = syncExpression;
        this._documentDelayer = documentDelayer;
        this._atomViewFinder = atomViewFinder;
        this._fullText = this._client.capabilities.textDocumentSync === TextDocumentSyncKind.Full;

        this._configure();
    }

    private _configure() {
        const editor = this._editor;

        this._open();
        editor.onDidDestroy(_.bind(this._close, this));
        editor.onDidDestroy(_.bind(this._save, this));
        if (this._fullText) {
            editor.buffer.onDidChange(_.bind(this._fullTextChange, this));
        } else {
            editor.buffer.onDidChange(_.bind(this._incrementalChange, this));
        }
    }

    private _fullTextChange(change: AtomTextChange) {
        this._version += 1;
        this._documentDelayer.trigger(() => {
            this._client.sendNotification(DidChangeTextDocumentNotification.type, {
                textDocument: {
                    uri: getUri(this._editor),
                    version: this._version
                },
                contentChanges: [{ text: this._editor.getText() }]
            });
        });
    }

    private _incrementalChange(change: AtomTextChange) {
        this._version += 1;
        this._changes.push(change);
        this._documentDelayer.trigger(() => {
            this._client.sendNotification(DidChangeTextDocumentNotification.type, {
                textDocument: {
                    uri: getUri(this._editor),
                    version: this._version
                },
                contentChanges: _.map(this._changes.pop(), (c) => {
                    return {
                        range: toRange(c.oldRange),
                        rangeLength: undefined,
                        text: c.newText
                    };
                })
            });
        });
    }

    private _open() {
        const view = this._atomViewFinder.getView(this._editor);
        if (view && !view.classList.contains(className)) {
            view.classList.add(className);
        }

        this._client.sendNotification<DidOpenTextDocumentParams>(DidOpenTextDocumentNotification.type, {
            textDocument: {
                uri: getUri(this._editor),
                languageId: getLanguageId(this._editor),
                version: this._version,
                text: this._editor.getText()
            }
        });
    }

    private _close() {
        this._client.sendNotification<DidCloseTextDocumentParams>(DidCloseTextDocumentNotification.type, {
            textDocument: toTextDocumentIdentifier(this._editor)
        });
    }

    private _save() {
        this._client.sendNotification<DidSaveTextDocumentParams>(DidSaveTextDocumentNotification.type, {
            textDocument: toTextDocumentIdentifier(this._editor)
        });
    }
}

@capability
export class DocumentSync extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _atomTextEditorSource: AtomTextEditorSource;
    private _syncExpression: ISyncExpression;
    private _documentDelayer: IDocumentDelayer;
    private _atomViewFinder: IAtomViewFinder;
    private _editors = new WeakMap<Atom.TextEditor, EditorSync>();

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
    }

    private _configure() {
        this._atomTextEditorSource.observeTextEditors
            .filter(editor => this._syncExpression.evaluate(editor))
            .subscribe(_.bind(this._configureEditor, this));
    }

    private _configureEditor(editor: Atom.TextEditor) {
        if (!this._editors.has(editor)) {
            const sync = new EditorSync(this._client, this._syncExpression, this._documentDelayer, this._atomViewFinder, editor);
            this._editors.set(editor, sync);
            this._disposable.add(sync);
        }
    }
}
