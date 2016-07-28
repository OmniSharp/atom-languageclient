/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { IAtomViewFinder, IDocumentDelayer, ILanguageProtocolClient, ISyncExpression } from '../services/_public';
import { getLanguageId, toRange, toTextDocumentIdentifier, toUri } from './utils/convert';
import { TextDocumentSyncKind } from '../vscode-languageserver-types';
import {
    DidChangeTextDocumentNotification,
    DidCloseTextDocumentNotification,
    DidCloseTextDocumentParams,
    DidOpenTextDocumentNotification,
    DidOpenTextDocumentParams,
    DidSaveTextDocumentNotification,
    DidSaveTextDocumentParams
} from '../vscode-protocol';
import { AtomTextChange } from '../omni/LanguageClientTextEditorChanges';
import { TextEditorSync } from './TextEditorSync';

export class TextEditorSyncProtocol extends TextEditorSync {
    private _client: ILanguageProtocolClient;

    constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression,
        documentDelayer: IDocumentDelayer,
        atomViewFinder: IAtomViewFinder,
        editor: Atom.TextEditor) {
        super(syncExpression, documentDelayer, atomViewFinder, editor);
        this._client = client;
        this._fullText = this._client.capabilities.textDocumentSync === TextDocumentSyncKind.Full;

        this._configure();
    }

    protected fullTextChange(change: AtomTextChange) {
        super.fullTextChange(change);

        this._documentDelayer.trigger(() => {
            this._client.sendNotification(DidChangeTextDocumentNotification.type, {
                textDocument: {
                    uri: toUri(this._editor),
                    version: this._version
                },
                contentChanges: [{ text: this._editor.getText() }]
            });
        });
    }

    protected incrementalChange(change: AtomTextChange) {
        super.incrementalChange(change);

        this._documentDelayer.trigger(() => {
            this._client.sendNotification(DidChangeTextDocumentNotification.type, {
                textDocument: {
                    uri: toUri(this._editor),
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

    protected open() {
        super.open();

        this._client.sendNotification<DidOpenTextDocumentParams>(DidOpenTextDocumentNotification.type, {
            textDocument: {
                uri: toUri(this._editor),
                languageId: getLanguageId(this._editor),
                version: this._version,
                text: this._editor.getText()
            }
        });
    }

    protected close() {
        this._client.sendNotification<DidCloseTextDocumentParams>(DidCloseTextDocumentNotification.type, {
            textDocument: toTextDocumentIdentifier(this._editor)
        });
    }

    protected save() {
        this._client.sendNotification<DidSaveTextDocumentParams>(DidSaveTextDocumentNotification.type, {
            textDocument: toTextDocumentIdentifier(this._editor)
        });
    }
}
