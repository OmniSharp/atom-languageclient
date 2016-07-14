/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export const packageName = 'atom-languageclient';
export const className = 'languageclient-editor';
export const languageprotocol = Symbol.for('languageclient-languageprotocol-client');
export const omniclient = Symbol.for('languageclient-omniclient-client');
export const languageProvider = Symbol.for('languageclient-language-provider');
export const languageService = Symbol.for('languageclient-language-service');
export const autocompleteService = Symbol.for('languageclient-autocomplete-service');
export const linterService = Symbol.for('languageclient-linter-service');
