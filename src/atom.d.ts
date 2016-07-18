// http://flight-manual.atom.io/behind-atom/sections/serialization-in-atom/
interface IAtomPackage<TSettings> {
    serialize(): any;
    activate(state: TSettings): void;
    deactivate(): void;
}
declare namespace Linter {
    export interface MessageBase {
        type: string;
        filePath: string;
        range: TextBuffer.Range;
        name?: string;
        trace?: Array<Message>;
        severity: 'error' | 'warning' | 'info';
        selected?: ((message: Message) => void);
        code?: string | number;
    }
    export interface TextMessage extends MessageBase { text: string; }
    export interface HtmlMessage extends MessageBase { html: string; }
    export type Message = TextMessage | HtmlMessage;

    export interface IndieRegistry {
        register(options: { name: string; }): IndieLinter;
    }

    export interface IndieLinter {
        setMessages(messages: Message[]);
        deleteMessages(): void;
        dispose(): void;
    }
}
declare namespace Autocomplete {
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
declare type Thenable<T> = Promise<T>;
declare module 'fuzzaldrin-plus' {
    export interface FilterOptions {
        key?: string;
        maxResults?: number;
    }
    export function filter<T>(candidates: T[], query: string, options: FilterOptions): T[];

    export function score(str: string, query: string): number;
    export function match(str: string, query: string): string[][];
}
declare module 'file-url' {
    var method: (str: string) => string;
    export = method;
}

declare interface HTMLElement {
    scrollBottom: number;
    readonly isHidden: boolean;
    readonly isVisible: boolean;
    readonly isDisabled: boolean;
    readonly hasFocus: boolean;
    scrollDown(): void;
    scrollUp(this: HTMLElement): void;
    scrollToTop(this: HTMLElement): void;
    scrollToBottom(this: HTMLElement): void;
    pageUp(this: HTMLElement): void;
    pageDown(this: HTMLElement): void;
    enable(): void;
    disable(): void;
    show(): void;
    hide(): void;
    empty(): void;
}
