/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import { DisposableBase } from 'ts-disposables';
import { ActiveTextEditorProvider, IActiveTextEditorProvider } from './ActiveTextEditorProvider';
import { GrammarService, IGrammarService } from '../atom/GrammarService';
import { ITextEditorProvider, TextEditorProvider } from './TextEditorProvider';

export interface IOmniService {
    readonly active: IActiveTextEditorProvider;
    readonly editors: ITextEditorProvider;
    readonly grammar: IGrammarService;
}

@injectable
export class OmniService extends DisposableBase implements IOmniService {
    private _activeEditorsProvider: ActiveTextEditorProvider;
    private _editorsProvider: TextEditorProvider;
    private _grammarValidator: GrammarService;

    constructor(
        activeEditorProvider: ActiveTextEditorProvider,
        editorsProvider: TextEditorProvider,
        grammarValidator: GrammarService,

    ) {
        super();
        this._activeEditorsProvider = activeEditorProvider;
        this._editorsProvider = editorsProvider;
        this._grammarValidator = grammarValidator;
    }

    public get active() { return this._activeEditorsProvider; }
    public get editors() { return this._editorsProvider; }
    public get grammar() { return this._grammarValidator; }
}
