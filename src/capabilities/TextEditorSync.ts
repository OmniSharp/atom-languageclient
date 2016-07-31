/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { IAtomViewFinder, IDocumentDelayer, ISyncExpression } from 'atom-languageservices';
import { DisposableBase } from 'ts-disposables';
import { className } from '../constants';
import { AtomTextChange, LanguageClientTextEditorChanges } from '../omni/LanguageClientTextEditorChanges';

export abstract class TextEditorSync extends DisposableBase {
    protected _version = 0;
    protected _editor: Atom.TextEditor;
    protected _syncExpression: ISyncExpression;
    protected _documentDelayer: IDocumentDelayer;
    protected _atomViewFinder: IAtomViewFinder;
    protected _changes = new LanguageClientTextEditorChanges();
    protected _fullText: boolean;

    constructor(
        syncExpression: ISyncExpression,
        documentDelayer: IDocumentDelayer,
        atomViewFinder: IAtomViewFinder,
        editor: Atom.TextEditor) {
        super();
        this._editor = editor;
        this._syncExpression = syncExpression;
        this._documentDelayer = documentDelayer;
        this._atomViewFinder = atomViewFinder;
    }

    protected configure() {
        const editor = this._editor;

        this.open();
        editor.onDidDestroy(_.bind(this.close, this));
        editor.onDidDestroy(_.bind(this.save, this));
        if (this._fullText) {
            editor.buffer.onDidChange(_.bind(this.fullTextChange, this));
        } else {
            editor.buffer.onDidChange(_.bind(this.incrementalChange, this));
        }
    }

    protected fullTextChange(change: AtomTextChange) {
        this._version += 1;
    }

    protected incrementalChange(change: AtomTextChange) {
        this._version += 1;
        this._changes.push(change);
    }

    protected open() {
        const view = this._atomViewFinder.getView(this._editor);
        if (view && !view.classList.contains(className)) {
            view.classList.add(className);
        }
    }

    protected abstract close(): void;

    protected abstract save(): void;
}
