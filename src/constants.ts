/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export const packageName = 'atom-languageclient';
export const className = 'languageclient-editor';
export const languageprotocol = Symbol.for('languageclient-languageprotocol-client');
export const omniclient = Symbol.for('languageclient-omniclient-client');
