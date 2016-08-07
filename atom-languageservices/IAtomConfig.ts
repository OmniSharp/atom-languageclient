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
    export type Setting =
        IStringSetting | IStringEnumSetting | IStringArraySetting |
        IIntegerSetting | IIntegerEnumSetting | IIntegerArraySetting |
        INumberSetting | INumberEnumSetting | INumberArraySetting |
        IBooleanSetting | IBooleanEnumSetting | IBooleanArraySetting |
        IColorSetting | IColorEnumSetting | IColorArraySetting |
        IObjectSetting;

    interface ISettingBase {
        title?: string;
        description?: string;
    }

    type EnumDefinition<T> = { value: T; description: string; }[];

    export interface IObjectSetting extends ISettingBase { type: 'object'; properties: { [index: string]: Setting; }; }
    export interface IArraySettingBase extends ISettingBase { type: 'array'; }

    export interface IStringSetting extends ISettingBase { type: 'string'; default?: string; }
    export interface IStringEnumSetting extends ISettingBase { type: 'string'; default?: string; enum: EnumDefinition<string>; }
    export interface IStringArraySetting extends IArraySettingBase { items: { type: 'string'; }; default: string[]; }

    export interface IIntegerSetting extends ISettingBase { type: 'integer'; default?: number; minimum?: number; maximum?: number; }
    export interface IIntegerEnumSetting extends ISettingBase { type: 'integer'; default?: number; enum: EnumDefinition<string>; }
    export interface IIntegerArraySetting extends IArraySettingBase { items: { type: 'integer'; minimum?: number; maximum?: number; }; default: number[]; }

    export interface INumberSetting extends ISettingBase { type: 'number'; default?: number; minimum?: number; maximum?: number; }
    export interface INumberEnumSetting extends ISettingBase { type: 'number'; default?: number; enum: EnumDefinition<string>; }
    export interface INumberArraySetting extends IArraySettingBase { items: { type: 'integer'; minimum?: number; maximum?: number; }; default: number[]; }

    export interface IBooleanSetting extends ISettingBase { type: 'boolean'; default?: boolean; }
    export interface IBooleanEnumSetting extends ISettingBase { type: 'boolean'; default?: boolean; enum: EnumDefinition<string>; }
    export interface IBooleanArraySetting extends IArraySettingBase { items: { type: 'boolean'; }; default: boolean[]; }

    export interface IColorSetting extends ISettingBase { type: 'color'; default?: string; }
    export interface IColorEnumSetting extends ISettingBase { type: 'color'; default?: string; enum: EnumDefinition<string>; }
    export interface IColorArraySetting extends IArraySettingBase { items: { type: 'color'; }; default: string[]; }
}
