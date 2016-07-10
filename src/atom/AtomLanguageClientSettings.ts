/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export interface IAtomLanguageClientSettings {
    deserializer: string;
}

export class AtomLanguageClientSettings {
    constructor(state: IAtomLanguageClientSettings) { /* */ }

    public serialize(fn: Function): IAtomLanguageClientSettings {
        return {
            deserializer: fn.name
        };
    }
}
