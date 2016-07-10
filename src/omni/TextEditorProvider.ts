/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CompositeDisposable, DisposableBase, IDisposable } from 'ts-disposables';
import { ensureEditor, subscribeAsync } from './helpers';
import { ILanguageClientTextEditor } from './ILanguageClientTextEditor';
import { TextEditorSource } from './TextEditorSource';

export interface ITextEditorProvider {
    readonly get$: Observable<ILanguageClientTextEditor>;
    forEach(callback: (editor: ILanguageClientTextEditor, cd: CompositeDisposable) => void): IDisposable;
}

@inject
export class TextEditorProvider extends DisposableBase implements ITextEditorProvider {
    private _editorsSet = new Set<ILanguageClientTextEditor>();
    private _editors$: Observable<ILanguageClientTextEditor>;
    private _textEditorSource: TextEditorSource;

    constructor(textEditorSource: TextEditorSource) {
        super();
        this._textEditorSource = textEditorSource;
    }

    public get get$() {
        if (!this._editors$) {
            this._editors$ = this._createEditor$();
        }
        return this._editors$;
    }

    public forEach(callback: (editor: ILanguageClientTextEditor, cd: CompositeDisposable) => void): IDisposable {
        const outerCd = new CompositeDisposable();

        this._disposable.add(outerCd);
        outerCd.add(
            () => this._disposable.remove(outerCd),
            this._editors$
                .subscribe(editor => {
                    const innerCd = new CompositeDisposable();
                    outerCd.add(innerCd);

                    innerCd.add(editor.onDidDestroy((() => {
                        outerCd.remove(innerCd);
                        innerCd.dispose();
                    })));

                    callback(editor, innerCd);
                })
        );

        return outerCd;
    }

    private _createEditor$() {
        const observable$ = Observable.merge(
            Observable.defer(() => Observable.from<ILanguageClientTextEditor>(<any>this._editorsSet)),
            this._textEditorSource.observeTextEditor().share()
        );

        return _.flow(subscribeAsync, ensureEditor)(observable$);
    }
}
