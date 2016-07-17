/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export interface IAtomLanguageCsharpSettings {
    deserializer?: string;
}

export class AtomLanguageCsharpSettings {
    public static get empty() { return new AtomLanguageCsharpSettings({}); }

    constructor(state: IAtomLanguageCsharpSettings) { /* */ }

    public serialize(fn: Function): IAtomLanguageCsharpSettings {
        return {
            deserializer: fn.name
        };
    }
}
