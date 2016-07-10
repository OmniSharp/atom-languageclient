/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { DisposableBase } from 'ts-disposables';
import { className } from '../strings';
import { ILanguageClientTextEditor } from './ILanguageClientTextEditor';
import { LanguageClientTextEditorChanges } from './LanguageClientTextEditorChanges';

export class LanguageClientTextEditorContext extends DisposableBase {
    private _editor: ILanguageClientTextEditor;
    private _project: Object;
    private _solution: Object;
    private _loaded = false;
    private _temporary: boolean;
    private _metadata: boolean;
    private _changes = new LanguageClientTextEditorChanges();

    constructor(editor: Atom.TextEditor, solution: Object) {
        super();
        if ((<any>editor).omni) {
            return;
        }

        this._editor = <any>editor;
        this._editor.languageclient = this;
        // this._solution = solution;
        // this._project = new EmptyProjectViewModel(null, solution.path);

        const view: HTMLElement = <any>atom.views.getView(editor);
        view.classList.add(className);

        this._disposable.add(
            () => {
                this._editor.languageclient = null;
                view.classList.remove(className);
            }
        );
    }

    public get solution() {
        return this._solution;
    }

    public get project() {
        return this._project;
    }

    public get loaded() {
        return this._loaded;
    }

    public get temporary() {
        return this._temporary || false;
    }

    public set temporary(value: boolean) {
        this._temporary = value;
    }

    public get metadata() {
        return this._metadata;
    }
    public set metadata(value) {
        this._metadata = value;
    }

    public get changes() { return this._changes; }
}
