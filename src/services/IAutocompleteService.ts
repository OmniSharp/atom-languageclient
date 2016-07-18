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

export namespace AutocompleteKind {
    export const Alias = 'alias';
    export const ArrayType = 'arrayType';
    export const Assembly = 'assembly';
    export const DynamicType = 'dynamicType';
    export const ErrorType = 'errorType';
    export const Event = 'event';
    export const Field = 'field';
    export const Label = 'label';
    export const Local = 'local';
    export const Method = 'method';
    export const NetModule = 'netModule';
    export const NamedType = 'namedType';
    export const Namespace = 'namespace';
    export const Parameter = 'parameter';
    export const PointerType = 'pointerType';
    export const Property = 'property';
    export const RangeVariable = 'rangeVariable';
    export const TypeParameter = 'typeParameter';
    export const Preprocessing = 'preprocessing';
    export const Unknown = 'unknown';
    export const Array = 'array';
    export const Class = 'class';
    export const Delegate = 'delegate';
    export const Dynamic = 'dynamic';
    export const Enum = 'enum';
    export const Error = 'error';
    export const Interface = 'interface';
    export const Module = 'module';
    export const Pointer = 'pointer';
    export const Struct = 'struct';
    export const Structure = 'structure';
    export const TypeParameter = 'typeParameter';
    export const Submission = 'submission';
}
