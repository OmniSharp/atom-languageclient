/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import { IDisposable } from 'ts-disposables';
import { CompletionItem, CompletionItemKind, SymbolKind } from './types';
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

export interface IAutocompleteProvider extends IDisposable {
    request(params: Autocomplete.IRequest): Promise<Autocomplete.Suggestion[]> | undefined;
}

export namespace Autocomplete {
    export type SuggestionType = 'attribute' | 'builtin' | 'class' | 'constant' | 'function' | 'import' | 'keyword' | 'method' | 'module' | 'mixin' | 'package' | 'property' | 'require' | 'snippet' | 'tag' | 'type' | 'value' | 'variable' | 'selector' | 'pseudo-selector' | 'interface' | 'enum';
    export interface ISuggestionBase {
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
        filterText: string;
        completionItem?: CompletionItem;
        onDidInsertSuggestion?: (context: { editor: Atom.TextEditor, suggestion: Suggestion, triggerPosition: TextBuffer.Point; }) => void;
    }
    export interface ITextSuggestion extends ISuggestionBase { text: string; }
    export interface ISnippetSuggestion extends ISuggestionBase { snippet: string; }
    export type Suggestion = ITextSuggestion | ISnippetSuggestion;

    export interface IRequest {
        editor: Atom.TextEditor;
        bufferPosition: TextBuffer.Point; // the position of the cursor
        prefix: string;
        scopeDescriptor: { scopes: string[] };
        activatedManually: boolean;
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

    export function getIconFromSuggestionType(kind: SuggestionType) {
        switch (kind) {
            case 'class':
            case 'type':
                return Autocomplete.AutocompleteKind.Class;
            case 'mixin':
                return 'union';
            case 'constant':
                return 'constant';
            case 'import':
                return 'reference';
            case 'keyword':
                return 'keyword';
            case 'function':
            case 'method':
                return Autocomplete.AutocompleteKind.Method;
            case 'module':
            case 'require':
            case 'package':
                return Autocomplete.AutocompleteKind.Module;
            case 'property':
                return Autocomplete.AutocompleteKind.Property;
            case 'snippet':
                return 'snippet';
            case 'tag':
                return Autocomplete.AutocompleteKind.Class;
            case 'selector':
            case 'pseudo-selector':
            case 'variable':
                return Autocomplete.AutocompleteKind.Field;
            case 'interface':
                return Autocomplete.AutocompleteKind.Interface;
            case 'enum':
                return Autocomplete.AutocompleteKind.Enum;
            case 'value':
            case 'attribute':
            case 'builtin':
            default:
                return 'valuetype';
        }
    }

    export function getIconFromSymbolKind(kind: SymbolKind): string {
        switch (kind) {
            case SymbolKind.Method:
            case SymbolKind.Function:
                return AutocompleteKind.Method;
            case SymbolKind.Constructor:
                return AutocompleteKind.Class;
            case SymbolKind.Property:
                return AutocompleteKind.Property;
            case SymbolKind.Field:
            case SymbolKind.Variable:
                return AutocompleteKind.Field;
            case SymbolKind.Class:
                return AutocompleteKind.Class;
            case SymbolKind.Interface:
                return AutocompleteKind.Interface;
            case SymbolKind.Module:
                return AutocompleteKind.Module;
            case SymbolKind.Enum:
                return AutocompleteKind.Enum;
            case SymbolKind.File:
                return 'file';
            default:
                return 'valuetype';
        }
    }

    export function getIconFromCompletionItemKind(kind: CompletionItemKind): string {
        switch (kind) {
            case CompletionItemKind.Method:
            case CompletionItemKind.Function:
                return AutocompleteKind.Method;
            case CompletionItemKind.Constructor:
                return AutocompleteKind.Class;
            case CompletionItemKind.Property:
                return AutocompleteKind.Property;
            case CompletionItemKind.Field:
            case CompletionItemKind.Variable:
                return AutocompleteKind.Field;
            case CompletionItemKind.Class:
                return AutocompleteKind.Class;
            case CompletionItemKind.Interface:
                return AutocompleteKind.Interface;
            case CompletionItemKind.Module:
                return AutocompleteKind.Module;
            case CompletionItemKind.Unit:
                return 'unit';
            case CompletionItemKind.Enum:
                return AutocompleteKind.Enum;
            case CompletionItemKind.Keyword:
                return 'keyword';
            case CompletionItemKind.Snippet:
                return 'snippet';
            case CompletionItemKind.File:
                return 'file';
            case CompletionItemKind.Reference:
                return 'reference';
            case CompletionItemKind.Color:
                return 'color';
            case CompletionItemKind.Text:
                return 'text';
            case CompletionItemKind.Value:
            default:
                return 'valuetype';
        }
    }

    export function getTypeFromCompletionItemKind(kind: CompletionItemKind | number): Autocomplete.SuggestionType {
        switch (kind) {
            case CompletionItemKind.Method:
                return 'method';
            case CompletionItemKind.Function:
            case CompletionItemKind.Constructor:
                return 'function';
            case CompletionItemKind.Field:
            case CompletionItemKind.Property:
                return 'property';
            case CompletionItemKind.Variable:
                return 'variable';
            case CompletionItemKind.Class:
                return 'class';
            case CompletionItemKind.Interface:
                return 'interface';
            case CompletionItemKind.Module:
                return 'module';
            case CompletionItemKind.Unit:
                return 'builtin';
            case CompletionItemKind.Enum:
                return 'enum';
            case CompletionItemKind.Keyword:
                return 'keyword';
            case CompletionItemKind.Snippet:
                return 'snippet';
            case CompletionItemKind.File:
                return 'import';
            case CompletionItemKind.Reference:
                return 'require';
            case CompletionItemKind.Color:
            case CompletionItemKind.Text:
            case CompletionItemKind.Value:
            default:
                return 'value';
        }
    }

    export function getTypeFromSymbolKind(kind: SymbolKind): Autocomplete.SuggestionType {
        switch (kind) {
            case SymbolKind.Method:
                return 'method';
            case SymbolKind.Function:
            case SymbolKind.Constructor:
                return 'function';
            case SymbolKind.Field:
            case SymbolKind.Property:
                return 'property';
            case SymbolKind.Variable:
                return 'variable';
            case SymbolKind.Class:
                return 'class';
            case SymbolKind.Interface:
                return 'interface';
            case SymbolKind.Module:
                return 'module';
            case SymbolKind.Enum:
                return 'enum';
            case SymbolKind.File:
                return 'import';
            default:
                return 'value';
        }
    }
}
