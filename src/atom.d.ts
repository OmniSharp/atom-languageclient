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
declare namespace Finder {
    export interface Symbol {
        name: string;
        containerName?: string;
        type: Autocomplete.SuggestionType;
        filePath: string;
        iconHTML?: string;
        location?: TextBuffer.Point;
        filterText: string;
        className?: string;
    }
}
declare type Thenable<T> = Promise<T>;
declare module 'file-url' {
    var method: (str: string) => string;
    export = method;
}
