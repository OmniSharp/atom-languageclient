/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { Observable } from 'rxjs';

/* tslint:disable:variable-name */
export const IAtomConfig = Symbol.for('IAtomConfig');
export interface IAtomConfig {
    observe<T>(path: string): Observable<T>;
    onDidChange<T>(path: string): Observable<{ keyPath: string; oldValue: T; newValue: T; }>;
    get<T>(path: string): T;
    setSchema(packageName: string, schema: IAtomConfig.IObjectSetting): void;
    for(packageName: string): IAtomConfig;
}

export namespace IAtomConfig {
    export type Setting = IStringSetting | INumberSetting | IBooleanSetting | IArrayNumberSetting | IArrayStringSetting | IObjectSetting;

    interface ISettingBase {
        title?: string;
        description?: string;
    }

    export interface IStringSetting extends ISettingBase {
        type: 'string';
        default?: string;
    }
    export interface INumberSetting extends ISettingBase {
        type: 'integer';
        default?: number;
        minimum?: number;
        maximum?: number;
    }
    export interface IBooleanSetting extends ISettingBase {
        type: 'boolean';
        default?: boolean;
    }
    export interface IArrayStringSetting extends ISettingBase {
        type: 'array';
        items: { type: 'string'; };
        default?: string[];
    }
    export interface IArrayNumberSetting extends ISettingBase {
        type: 'array';
        items: { type: 'number'; };
        default?: number[];
    }
    export interface IObjectSetting extends ISettingBase {
        type: 'object';
        properties: { [index: string]: Setting; };
    }
}
