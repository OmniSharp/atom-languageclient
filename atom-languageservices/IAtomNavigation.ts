/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

export function navigationHasRange(value: any): value is { filePath: string; range: TextBuffer.Range; } {
    return value.range;
}

export function navigationHasLocation(value: any): value is { filePath: string; location: TextBuffer.Point; } {
    return value.location;
}

/* tslint:disable:variable-name */
export const IAtomNavigation = Symbol.for('IAtomNavigation');
export interface IAtomNavigation {
    navigateTo(context: IAtomNavigation.Location): void;
}

/* tslint:disable:no-any */
export namespace IAtomNavigation {
    /* tslint:disable:variable-name */
    export type Location = ({ filePath: string; } | { filePath: string; range: TextBuffer.Range; } | { filePath: string; location: TextBuffer.Point; });
}