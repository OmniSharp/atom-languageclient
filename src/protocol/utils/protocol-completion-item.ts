/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
export type ProtocolSuggestionItem = Autocomplete.Suggestion & { data: any; };
export function isProtocolSuggestionItem(item: any): item is { data: any; } {
    return !!item.data;
}
