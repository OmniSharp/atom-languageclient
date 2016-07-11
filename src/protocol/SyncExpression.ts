/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { ILanguageClientTextEditor } from '../omni/ILanguageClientTextEditor';

export interface ISyncExpression {
    evaluate(editor: ILanguageClientTextEditor): boolean;
}

export class FalseSyncExpression implements ISyncExpression {
    public evaluate(editor: ILanguageClientTextEditor): boolean {
        return false;
    }
}

export class LanguageIdExpression implements ISyncExpression {
    private _id: string;
    constructor(id: string) {
        this._id = id;
    }
    public evaluate(editor: ILanguageClientTextEditor): boolean {
        return this._id === editor.languageclient.languageId;
    }
}

export class FunctionSyncExpression implements ISyncExpression {
    private _func: (editor: ILanguageClientTextEditor) => boolean;
    constructor(func: (editor: ILanguageClientTextEditor) => boolean) {
        this._func = func;
    }
    public evaluate(editor: ILanguageClientTextEditor): boolean {
        return this._func(editor);
    }
}

export class CompositeSyncExpression implements ISyncExpression {
    private _expression: ISyncExpression[];
    constructor(values: string[], func?: (editor: ILanguageClientTextEditor) => boolean) {
        this._expression = values.map(value => new LanguageIdExpression(value));
        if (func) {
            this._expression.push(new FunctionSyncExpression(func));
        }
    }
    public evaluate(editor: ILanguageClientTextEditor): boolean {
        return this._expression.some(exp => exp.evaluate(editor));
    }
}
