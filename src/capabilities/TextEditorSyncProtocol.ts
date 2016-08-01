/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { IAtomViewFinder, IDocumentDelayer, ILanguageProtocolClient, ISyncExpression, IWaitService } from 'atom-languageservices';
import { DidChangeTextDocumentNotification, DidCloseTextDocumentNotification, DidOpenTextDocumentNotification, DidSaveTextDocumentNotification } from 'atom-languageservices/protocol';
import { DidCloseTextDocumentParams, DidOpenTextDocumentParams, DidSaveTextDocumentParams, TextDocumentSyncKind } from 'atom-languageservices/types';
import { DisposableBase } from 'ts-disposables';
import { className } from '../constants';
import { getLanguageId, toRange, toTextDocumentIdentifier, toUri } from './utils/convert';
import { AtomTextChange, LanguageClientTextEditorChanges } from '../omni/LanguageClientTextEditorChanges';

export class TextEditorSyncProtocol extends DisposableBase {
    private _client: ILanguageProtocolClient;
    private _version = 0;
    private _editor: Atom.TextEditor;
    private _syncExpression: ISyncExpression;
    private _documentDelayer: IDocumentDelayer;
    private _atomViewFinder: IAtomViewFinder;
    private _waitService: IWaitService;
    private _changes = new LanguageClientTextEditorChanges();
    private _fullText: boolean;
    private _pausedEvents: (() => void)[] = [];

    constructor(
        client: ILanguageProtocolClient,
        syncExpression: ISyncExpression,
        documentDelayer: IDocumentDelayer,
        atomViewFinder: IAtomViewFinder,
        waitService: IWaitService,
        editor: Atom.TextEditor) {
        super();
        this._client = client;
        this._fullText = this._client.capabilities.textDocumentSync === TextDocumentSyncKind.Full;
        this._waitService = waitService;
        this._editor = editor;
        this._atomViewFinder = atomViewFinder;
        this._syncExpression = syncExpression;
        this._documentDelayer = documentDelayer;

        this._disposable.add(waitService.waiting$.subscribe(paused => {
            if (!paused && this._pausedEvents.length) {
                _.each(this._pausedEvents, event => {
                    event();
                });
            }
        }));

        this._configure();
    }

    private _configure() {
        const editor = this._editor;

        this._open();
        this._disposable.add(
            editor.onDidDestroy(_.bind(this._close, this)),
            editor.onDidSave(_.bind(this._save, this))
        );
        if (this._fullText) {
            this._disposable.add(
                editor.buffer.onDidChange(_.bind(this._fullTextChange, this))
            );
        } else {
            this._disposable.add(
                editor.buffer.onDidChange(_.bind(this._incrementalChange, this))
            );
        }
    }

    private _fullTextChange() {
        this._version += 1;
        if (this._waitService.waiting) {
            this._pausedEvents.push(() => this._fullTextChange());
            return;
        }

        this._documentDelayer.trigger(
            this._editor,
            () => {
                this._client.sendNotification(DidChangeTextDocumentNotification.type, {
                    textDocument: {
                        uri: toUri(this._editor),
                        version: this._version
                    },
                    contentChanges: [{ text: this._editor.getText() }]
                });
            });
    }

    private _incrementalChange(change?: AtomTextChange) {
        this._version += 1;
        if (change) {
            this._changes.push(change);
        }

        if (this._waitService.waiting) {
            this._pausedEvents.push(() => this._incrementalChange());
            return;
        }

        this._documentDelayer.trigger(
            this._editor,
            () => {
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

    private _open() {
        if (this._waitService.waiting) {
            this._pausedEvents.push(() => this._open());
            return;
        }

        const view = this._atomViewFinder.getView(this._editor);
        if (view && !view.classList.contains(className)) {
            view.classList.add(className);
        }

        this._client.sendNotification<DidOpenTextDocumentParams>(DidOpenTextDocumentNotification.type, {
            textDocument: {
                uri: toUri(this._editor),
                languageId: getLanguageId(this._editor),
                version: this._version,
                text: this._editor.getText()
            }
        });
    }

    private _close() {
        if (this._waitService.waiting) {
            this._pausedEvents.push(() => this._close());
            return;
        }

        this._client.sendNotification<DidCloseTextDocumentParams>(DidCloseTextDocumentNotification.type, {
            textDocument: toTextDocumentIdentifier(this._editor)
        });
    }

    private _save() {
        if (this._waitService.waiting) {
            this._pausedEvents.push(() => this._save());
            return;
        }

        this._client.sendNotification<DidSaveTextDocumentParams>(DidSaveTextDocumentNotification.type, {
            textDocument: toTextDocumentIdentifier(this._editor)
        });

        this._fullTextChange();
    }
}
