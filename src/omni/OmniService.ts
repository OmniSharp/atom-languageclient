/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { DisposableBase } from 'ts-disposables';
import { injectable } from '../services/_decorators';
import { ActiveTextEditorProvider, IActiveTextEditorProvider } from './ActiveTextEditorProvider';
import { ITextEditorProvider, TextEditorProvider } from './TextEditorProvider';

export interface IOmniService {
    readonly active: IActiveTextEditorProvider;
    readonly editors: ITextEditorProvider;
}

@injectable
export class OmniService extends DisposableBase implements IOmniService {
    private _activeEditorsProvider: ActiveTextEditorProvider;
    private _editorsProvider: TextEditorProvider;

    constructor(
        activeEditorProvider: ActiveTextEditorProvider,
        editorsProvider: TextEditorProvider
    ) {
        super();
        this._activeEditorsProvider = activeEditorProvider;
        this._editorsProvider = editorsProvider;
    }

    public get active() { return this._activeEditorsProvider; }
    public get editors() { return this._editorsProvider; }
}
