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

/* tslint:disable:variable-name */
declare type AtomNavigationLocation = ({ filePath: string; } | { filePath: string; range: TextBuffer.Range; } | { filePath: string; location: TextBuffer.Point; });

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
declare namespace Definition {
    export interface RequestOptions {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
    }
}
declare namespace Reference {
    export interface Symbol {
        lines: string[];
        filePath: string;
        range: TextBuffer.Range;
    }
}
declare namespace Hover {
    export interface Symbol {
        text: string;
        description?: string;
    }

    export interface RequestOptions {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
    }
}
declare namespace Format {
    export interface Base {
        insertSpaces: boolean;
        tabSize: number;
    }
    export interface DocumentOptions extends Base {
        editor: Atom.TextEditor;
    }
    export interface RangeOptions extends Base {
        editor: Atom.TextEditor;
        range: TextBuffer.Range;
    }
    export type FormatOptions  = DocumentType | RangeOptions;
}
declare namespace Rename {
    export interface RequestOptions {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
        word: string;
    }
}
declare namespace CodeAction {
    export interface RequestOptions {
        editor: Atom.TextEditor;
        location: TextBuffer.Point;
    }

    export interface Item {
        id: string;
        name: string;
        title: string;
    }
}
declare namespace Text {
    export interface FileChange {
        range: TextBuffer.Range;
        text: string;
    }
    export interface WorkspaceChange {
        filePath: string;
        changes: FileChange[];
    }
}
declare type Thenable<T> = Promise<T>;
declare module 'file-url' {
    var method: (str: string) => string;
    export = method;
}
