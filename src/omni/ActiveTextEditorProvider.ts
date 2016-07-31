/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { injectable } from 'atom-languageservices/decorators';
import { CompositeDisposable, DisposableBase, IDisposable } from 'ts-disposables';
import { cacheEditor, ensureEditor, subscribeAsync } from './helpers';
import { ILanguageClientTextEditor } from './ILanguageClientTextEditor';
import { TextEditorSource } from './TextEditorSource';

export interface IActiveTextEditorProvider {
    readonly editor$: Observable<ILanguageClientTextEditor>;
    switch(callback: (editor: ILanguageClientTextEditor, cd: CompositeDisposable) => void): IDisposable;
}

@injectable
export class ActiveTextEditorProvider extends DisposableBase implements IActiveTextEditorProvider {
    private _editor$: Observable<ILanguageClientTextEditor>;
    private _source: TextEditorSource;

    constructor(source: TextEditorSource) {
        super();
        this._source = source;
    }

    public get editor$() {
        if (!this._editor$) {
            this._editor$ = _.flow(subscribeAsync, ensureEditor, cacheEditor)(this._source.observeActiveTextEditor());
        }
        return this._editor$;
    }

    public switch(callback: (editor: ILanguageClientTextEditor, cd: CompositeDisposable) => void): IDisposable {
        const outerCd = new CompositeDisposable();

        this._disposable.add(outerCd);
        outerCd.add(
            () => this._disposable.remove(outerCd),
            this.editor$
                .filter(z => !!z)
                .subscribe(editor => {
                    const innerCd = new CompositeDisposable();

                    outerCd.add(
                        innerCd,
                        this.editor$
                            .filter(active => active !== editor)
                            .subscribe(() => {
                                outerCd.remove(innerCd);
                                innerCd.dispose();
                            })
                    );

                    callback(editor, innerCd);
                })
        );

        return outerCd;
    }
}
