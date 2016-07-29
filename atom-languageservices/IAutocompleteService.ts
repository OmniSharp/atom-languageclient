/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';
import { CompletionItem } from 'vscode-languageserver-types';
/* tslint:disable:variable-name no-any interface-name */

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
    request(params: Autocomplete.RequestOptions): Promise<AutocompleteSuggestion[]> | undefined;
}

export namespace AutocompleteKind {
    export const Alias = 'alias';
    export const ArrayType = 'arraytype';
    export const Assembly = 'assembly';
    export const DynamicType = 'dynamictype';
    export const ErrorType = 'errortype';
    export const Event = 'event';
    export const Field = 'field';
    export const Label = 'label';
    export const Local = 'local';
    export const Method = 'method';
    export const NetModule = 'netmodule';
    export const NamedType = 'namedtype';
    export const Namespace = 'namespace';
    export const Parameter = 'parameter';
    export const PointerType = 'pointertype';
    export const Property = 'property';
    export const RangeVariable = 'rangevariable';
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
    export const TypeParameter = 'typeparameter';
    export const Submission = 'submission';
}

export namespace Autocomplete {
    export type SuggestionType = 'attribute' | 'builtin' | 'class' | 'constant' | 'function' | 'import' | 'keyword' | 'method' | 'module' | 'mixin' | 'package' | 'property' | 'require' | 'snippet' | 'tag' | 'type' | 'value' | 'variable' | 'selector' | 'pseudo-selector' | 'interface' | 'enum';
    export interface SuggestionBase {
        displayText?: string;
        replacementPrefix?: string;
        type: SuggestionType;
        leftLabel?: string;
        leftLabelHTML?: string;
        rightLabel?: string;
        rightLabelHTML?: string;
        iconHTML?: string;
        description?: string;
        descriptionMoreURL?: string;
        className?: string;
        onDidInsertSuggestion?: (context: { editor: Atom.TextEditor, suggestion: Suggestion, triggerPosition: TextBuffer.Point; }) => void;
    }
    export interface TextSuggestion extends SuggestionBase { text: string; }
    export interface SnippetSuggestion extends SuggestionBase { snippet: string; }
    export type Suggestion = TextSuggestion | SnippetSuggestion;

    export interface RequestOptions {
        editor: Atom.TextEditor;
        bufferPosition: TextBuffer.Point; // the position of the cursor
        prefix: string;
        scopeDescriptor: { scopes: string[] };
        activatedManually: boolean;
    }
}
