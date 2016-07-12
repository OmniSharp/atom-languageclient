/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';

export interface IGrammarService {
    isValid(grammar: FirstMate.Grammar): boolean;
}

@autoinject
export class GrammarService extends DisposableBase implements IGrammarService {
    private _supportedExtensions = ['project.json', '.cs', '.csx', /*".cake"*/];

    public get grammars() {
        return _.filter(
            atom.grammars.getGrammars(),
            grammar => _.some(
                this._supportedExtensions,
                ext => _.some(
                    (<any>grammar).fileTypes,
                    ft => _.trimStart(ext, '.') === ft)));
    }

    public isValid(grammar: FirstMate.Grammar) {
        return _.some(this.grammars, { scopeName: (<any>grammar).scopeName });
    }
}
