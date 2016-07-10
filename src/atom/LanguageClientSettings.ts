/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export interface ILanguageClientSettings {
    deserializer?: string;
}

export class LanguageClientSettings {
    public static get empty() { return new LanguageClientSettings({}); }

    constructor(state: ILanguageClientSettings) { /* */ }

    public serialize(fn: Function): ILanguageClientSettings {
        return {
            deserializer: fn.name
        };
    }
}
