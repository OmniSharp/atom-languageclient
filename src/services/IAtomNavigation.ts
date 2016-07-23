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

export const IAtomNavigation = Symbol.for('IAtomNavigation');
export interface IAtomNavigation {
    navigateTo(context: AtomNavigationLocation): void;
}
