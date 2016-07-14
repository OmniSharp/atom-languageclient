/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export interface IAtomLanguageJsonSettings {
    deserializer?: string;
}

export class AtomLanguageJsonSettings {
    public static get empty() { return new AtomLanguageJsonSettings({}); }

    constructor(state: IAtomLanguageJsonSettings) { /* */ }

    public serialize(fn: Function): IAtomLanguageJsonSettings {
        return {
            deserializer: fn.name
        };
    }
}
