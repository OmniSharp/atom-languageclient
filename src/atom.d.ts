// http://flight-manual.atom.io/behind-atom/sections/serialization-in-atom/
interface IAtomPackage<TSettings> {
    serialize(): any;
    activate(state: TSettings): void;
    deactivate(): void;
}
declare namespace Linter {
    interface MessageBase {
        type: string;
        name?: string;
        range: TextBuffer.Range;
        trace?: Array<Message>;
        severity: 'error' | 'warning' | 'info';
        filePath?: string;
        selected?: ((message: Message) => void);
        code?: string | number;
    }
    export type TextMessage = { text: string; } & MessageBase;
    export type HtmlMessage = { html: string; } & MessageBase;
    export type Message = TextMessage | HtmlMessage;
}
declare namespace Autocomplete {
    interface SuggestionBase {
        displayText?: string;
        replacementPrefix?: string;
        type: 'attribute' | 'builtin' | 'class' | 'constant' | 'function' | 'import' | 'keyword' | 'method' | 'module' | 'mixin' | 'package' | 'property' | 'require' | 'snippet' | 'tag' | 'type' | 'value' | 'variable' | 'selector' | 'pseudo-selector';
        leftLabel?: string;
        leftLabelHTML?: string;
        rightLabel?: string;
        rightLabelHTML?: string;
        iconHTML?: string;
        description?: string;
        descriptionMoreURL?: string;
        className?: string;
    }
    export type TextSuggestion = { text: string; } & SuggestionBase;
    export type SnippetSuggestion = { snippet: string; } & SuggestionBase;
    export type Suggestion = TextSuggestion | SnippetSuggestion;

    interface RequestOptions {
        editor: Atom.TextEditor;
        bufferPosition: TextBuffer.Point; // the position of the cursor
        prefix: string;
        scopeDescriptor: { scopes: string[] };
        activatedManually: boolean;
    }
}
declare type Thenable<T> = Promise<T>;
declare module 'fuzzaldrin' {
    export interface FilterOptions {
        key?: string;
        maxResults?: number;
    }
    export function filter(candidates: string[], query: string, options: FilterOptions): string[];

    export function score(str: string, query: string): number;
    export function match(str: string, query: string): string[][];
}
