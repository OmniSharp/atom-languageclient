/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';
import { CompletionItem, CompletionList, TextDocumentPositionParams } from '../vscode-languageserver-types';
/* tslint:disable:variable-name no-any */

/**
 * Symbol for the AutocompleteService
 */
export const IAutocompleteService = Symbol.for('IAutocompleteService');
/**
 * This serivce lets you register a provider with atom's autocomplete-plus service
 */
export interface IAutocompleteService {
    registerProvider(provider: IAutocompleteProvider): IDisposable;
}

export type AutocompleteSuggestion = Autocomplete.Suggestion & {
     filterText: string;
     completionItem?: CompletionItem;
}

export interface IAutocompleteProvider extends IDisposable {
    request(params: Autocomplete.RequestOptions): Promise<AutocompleteSuggestion[]> | null;
    dispose(): void;
}
