/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

/**
 * Position in a text document expressed as zero-based line and character offset.
 */
export interface Position {
    /**
     * Line position in a document (zero-based).
     */
    line: number;

    /**
     * Character offset on a line in a document (zero-based).
     */
    character: number;
}

/**
 * The Position namespace provides helper functions to work with
 * [Position](#Position) literals.
 */
export namespace Position {
    /**
     * Creates a new Position literal from the given line and character.
     * @param line The position's line.
     * @param character The position's character.
     */
    export function create(line: number, character: number): Position {
        return { line, character };
    }
    /**
     * Checks whether the given liternal conforms to the [Position](#Position) interface.
     */
    export function is(value: any): value is Position {
        let candidate = value as Position;
        return Is.defined(candidate) && Is.number(candidate.line) && Is.number(candidate.character);
    }
}

/**
 * A range in a text document expressed as (zero-based) start and end positions.
 */
export interface Range {
    /**
     * The range's start position
     */
    start: Position;

    /**
     * The range's end position
     */
    end: Position;
}

/**
 * The Range namespace provides helper functions to work with
 * [Range](#Range) literals.
 */
export namespace Range {
    /**
     * Create a new Range liternal.
     * @param start The range's start position.
     * @param end The range's end position.
     */
    export function create(start: Position, end: Position): Range;
    /**
     * Create a new Range liternal.
     * @param startLine The start line number.
     * @param startCharacter The start character.
     * @param endLine The end line number.
     * @param endCharacter The end character.
     */
    export function create(startLine: number, startCharacter: number, endLine: number, endCharacter: number): Range;
    export function create(one: Position | number, two: Position | number, three?: number, four?: number): Range {
        if (Is.number(one) && Is.number(two) && Is.number(three) && Is.number(four)) {
            return { start: Position.create(one, two), end: Position.create(three, four) };
        } else if (Position.is(one) && Position.is(two)) {
            return { start: one, end: two };
        } else {
            throw new Error(`Range#create called with invalid arguments[${one}, ${two}, ${three}, ${four}]`);
        }
    }
    /**
     * Checks whether the given literal conforms to the [Range](#Range) interface.
     */
    export function is(value: any): value is Range {
        let candidate = value as Range;
        return Is.defined(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
    }
}

/**
 * Represents a location inside a resource, such as a line
 * inside a text file.
 */
export interface Location {
    uri: string;
    range: Range;
}

/**
 * The Location namespace provides helper functions to work with
 * [Location](#Location) literals.
 */
export namespace Location {
    /**
     * Creates a Location literal.
     * @param uri The location's uri.
     * @param range The location's range.
     */
    export function create(uri: string, range: Range): Location {
        return { uri, range };
    }
    /**
     * Checks whether the given literal conforms to the [Location](#Location) interface.
     */
    export function is(value: any): value is Location {
        let candidate = value as Location;
        return Is.defined(candidate) && Range.is(candidate) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
    }
}

/**
 * The diagnostic's serverity.
 */
export const enum DiagnosticSeverity {
    /**
     * Reports an error.
     */
    Error = 1,
    /**
     * Reports a warning.
     */
    Warning = 2,
    /**
     * Reports an information.
     */
    Information = 3,
    /**
     * Reports a hint.
     */
    Hint = 4
}

/**
 * Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
 * are only valid in the scope of a resource.
 */
export interface Diagnostic {
    /**
     * The range at which the message applies
     */
    range: Range;

    /**
     * The diagnostic's severity. Can be omitted. If omitted it is up to the
     * client to interpret diagnostics as error, warning, info or hint.
     */
    severity?: number;

    /**
     * The diagnostic's code. Can be omitted.
     */
    code?: number | string;

    /**
     * A human-readable string describing the source of this
     * diagnostic, e.g. 'typescript' or 'super lint'.
     */
    source?: string;

    /**
     * The diagnostic's message.
     */
    message: string;
}

/**
 * The Diagnostic namespace provides helper functions to work with
 * [Diagnostic](#Diagnostic) literals.
 */
export namespace Diagnostic {
    /**
     * Creates a new Diagnostic literal.
     */
    export function create(range: Range, message: string, severity?: number, code?: number | string, source?: string): Diagnostic {
        let result: Diagnostic = { range, message };
        if (Is.defined(severity)) {
            result.severity = severity;
        }
        if (Is.defined(code)) {
            result.code = code;
        }
        if (Is.defined(source)) {
            result.source = source;
        }
        return result;
    }
    /**
     * Checks whether the given literal conforms to the [Diagnostic](#Diagnostic) interface.
     */
    export function is(value: any): value is Diagnostic {
        let candidate = value as Diagnostic;
        return Is.defined(candidate)
            && Range.is(candidate.range)
            && Is.string(candidate.message)
            && (Is.number(candidate.severity) || Is.undefined(candidate.severity))
            && (Is.number(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code))
            && (Is.string(candidate.source) || Is.undefined(candidate.source));
    }
}


/**
 * Represents a reference to a command. Provides a title which
 * will be used to represent a command in the UI and, optionally,
 * an array of arguments which will be passed to the command handler
 * function when invoked.
 */
export interface Command {
    /**
     * Title of the command, like `save`.
     */
    title: string;
    /**
     * The identifier of the actual command handler.
     */
    command: string;
    /**
     * Arguments that the command handler should be
     * invoked with.
     */
    arguments?: any[];
}


/**
 * The Command namespace provides helper functions to work with
 * [Command](#Command) literals.
 */
export namespace Command {
    /**
     * Creates a new Command literal.
     */
    export function create(title: string, command: string, ...args: any[]): Command {
        let result: Command = { title, command };
        if (Is.defined(args) && args.length > 0) {
            result.arguments = args;
        }
        return result;
    }
    /**
     * Checks whether the given literal conforms to the [Command](#Command) interface.
     */
    export function is(value: any): value is Command {
        let candidate = value as Command;
        return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.title);
    }
}

/**
 * A text edit applicable to a text document.
 */
export interface TextEdit {
    /**
     * The range of the text document to be manipulated. To insert
     * text into a document create a range where start === end.
     */
    range: Range;

    /**
     * The string to be inserted. For delete operations use an
     * empty string.
     */
    newText: string;
}

/**
 * The TextEdit namespace provides helper function to create replace,
 * insert and delete edits more easily.
 */
export namespace TextEdit {
    /**
     * Creates a replace text edit.
     * @param range The range of text to be replaced.
     * @param newText The new text.
     */
    export function replace(range: Range, newText: string): TextEdit {
        return { range, newText };
    }
    /**
     * Creates a insert text edit.
     * @param psotion The position to insert the text at.
     * @param newText The text to be inserted.
     */
    export function insert(position: Position, newText: string): TextEdit {
        return { range: { start: position, end: position }, newText };
    }
    /**
     * Creates a delete text edit.
     * @param range The range of text to be deleted.
     */
    export function del(range: Range): TextEdit {
        return { range, newText: '' };
    }
}

/**
 * A workspace edit represents changes to many resources managed
 * in the workspace.
 */
export interface WorkspaceEdit {
    // creates: { [uri: string]: string; };
    /**
     * Holds changes to existing resources.
     */
    changes: { [uri: string]: TextEdit[]; };
    // deletes: string[];
}

/**
 * A change to capture text edits for existing resources.
 */
export interface TextEditChange {
    /**
     * Gets all text edits for this change.
     *
     * @return An array of text edits.
     */
    all(): TextEdit[];

    /**
     * Clears the edits for this change.
     */
    clear(): void;

    /**
     * Insert the given text at the given position.
     *
     * @param position A position.
     * @param newText A string.
     */
    insert(position: Position, newText: string): void;

    /**
     * Replace the given range with given text for the given resource.
     *
     * @param range A range.
     * @param newText A string.
     */
    replace(range: Range, newText: string): void;

    /**
     * Delete the text at the given range.
     *
     * @param range A range.
     */
    delete(range: Range): void;
}

/**
 * A workspace change helps constructing changes to a workspace.
 */
export class WorkspaceChange {
    private workspaceEdit: WorkspaceEdit;
    private textEditChanges: { [uri: string]: TextEditChange };

    constructor() {
        this.workspaceEdit = {
            changes: Object.create(null)
        };
        this.textEditChanges = Object.create(null);
    }

    /**
     * Returns the underlying [WorkspaceEdit](#WorkspaceEdit) literal
     * use to be returned from a workspace edit operation like rename.
     */
    public get edit(): WorkspaceEdit {
        return this.workspaceEdit;
    }

    /**
     * Returns the [TextEditChange](#TextEditChange) to manage text edits
     * for resources.
     */
    public getTextEditChange(uri: string): TextEditChange {
        class TextEditChangeImpl implements TextEditChange {
            private edits: TextEdit[];
            constructor(edits: TextEdit[]) {
                this.edits = edits;
            }
            insert(position: Position, newText: string): void {
                this.edits.push(TextEdit.insert(position, newText));
            }
            replace(range: Range, newText: string): void {
                this.edits.push(TextEdit.replace(range, newText));
            }
            delete(range: Range): void {
                this.edits.push(TextEdit.del(range));
            }
            all(): TextEdit[] {
                return this.edits;
            }
            clear(): void {
                this.edits.splice(0, this.edits.length);
            }
        }
        let result = this.textEditChanges[uri];
        if (!result) {
            let edits: TextEdit[] = [];
            this.workspaceEdit.changes[uri] = edits;
            result = new TextEditChangeImpl(edits);
            this.textEditChanges[uri] = result;
        }
        return result;
    }
}

/**
 * A literal to identify a text document in the client.
 */
export interface TextDocumentIdentifier {
    /**
     * The text document's uri.
     */
    uri: string;
}

/**
 * The TextDocumentIdentifier namespace provides helper functions to work with
 * [TextDocumentIdentifier](#TextDocumentIdentifier) literals.
 */
export namespace TextDocumentIdentifier {
    /**
     * Creates a new TextDocumentIdentifier literal.
     * @param uri The document's uri.
     */
    export function create(uri: string): TextDocumentIdentifier {
        return { uri };
    }
    /**
     * Checks whether the given literal conforms to the [TextDocumentIdentifier](#TextDocumentIdentifier) interface.
     */
    export function is(value: any): value is TextDocumentIdentifier {
        let candidate = value as TextDocumentIdentifier;
        return Is.defined(candidate) && Is.string(candidate.uri);
    }
}

/**
 * An identifier to denote a specific version of a text document.
 */
export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
    /**
     * The version number of this document.
     */
    version: number;
}

/**
 * The VersionedTextDocumentIdentifier namespace provides helper functions to work with
 * [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) literals.
 */
export namespace VersionedTextDocumentIdentifier {
    /**
     * Creates a new VersionedTextDocumentIdentifier literal.
     * @param uri The document's uri.
     * @param uri The document's text.
     */
    export function create(uri: string, version: number): VersionedTextDocumentIdentifier {
        return { uri, version };
    }

    /**
     * Checks whether the given literal conforms to the [VersionedTextDocumentIdentifier](#VersionedTextDocumentIdentifier) interface.
     */
    export function is(value: any): value is VersionedTextDocumentIdentifier {
        let candidate = value as VersionedTextDocumentIdentifier;
        return Is.defined(candidate) && Is.string(candidate.uri) && Is.number(candidate.version);
    }
}


/**
 * An item to transfer a text document from the client to the
 * server.
 */
export interface TextDocumentItem {
    /**
     * The text document's uri.
     */
    uri: string;

    /**
     * The text document's language identifier
     */
    languageId: string;

    /**
     * The version number of this document (it will strictly increase after each
     * change, including undo/redo).
     */
    version: number;

    /**
     * The content of the opened text document.
     */
    text: string;
}

/**
 * The TextDocumentItem namespace provides helper functions to work with
 * [TextDocumentItem](#TextDocumentItem) literals.
 */
export namespace TextDocumentItem {
    /**
     * Creates a new TextDocumentItem literal.
     * @param uri The document's uri.
     * @param uri The document's language identifier.
     * @param uri The document's version number.
     * @param uri The document's text.
     */
    export function create(uri: string, languageId: string, version: number, text: string): TextDocumentItem {
        return { uri, languageId, version, text };
    }

    /**
     * Checks whether the given literal conforms to the [TextDocumentItem](#TextDocumentItem) interface.
     */
    export function is(value: any): value is TextDocumentItem {
        let candidate = value as TextDocumentItem;
        return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.number(candidate.version) && Is.string(candidate.text);
    }
}

/**
 * The kind of a completion entry.
 */
export const enum CompletionItemKind {
    Text = 1,
    Method = 2,
    Function = 3,
    Constructor = 4,
    Field = 5,
    Variable = 6,
    Class = 7,
    Interface = 8,
    Module = 9,
    Property = 10,
    Unit = 11,
    Value = 12,
    Enum = 13,
    Keyword = 14,
    Snippet = 15,
    Color = 16,
    File = 17,
    Reference = 18
}

/**
 * A completion item represents a text snippet that is
 * proposed to complete text that is being typed.
 */
export interface CompletionItem {
    /**
     * The label of this completion item. By default
     * also the text that is inserted when selecting
     * this completion.
     */
    label: string;

    /**
     * The kind of this completion item. Based of the kind
     * an icon is chosen by the editor.
     */
    kind?: number;

    /**
     * A human-readable string with additional information
     * about this item, like type or symbol information.
     */
    detail?: string;

    /**
     * A human-readable string that represents a doc-comment.
     */
    documentation?: string;

    /**
     * A string that shoud be used when comparing this item
     * with other items. When `falsy` the [label](#CompletionItem.label)
     * is used.
     */
    sortText?: string;

    /**
     * A string that should be used when filtering a set of
     * completion items. When `falsy` the [label](#CompletionItem.label)
     * is used.
     */
    filterText?: string;

    /**
     * A string that should be inserted a document when selecting
     * this completion. When `falsy` the [label](#CompletionItem.label)
     * is used.
     */
    insertText?: string;

    /**
     * An [edit](#TextEdit) which is applied to a document when selecting
     * this completion. When an edit is provided the value of
     * [insertText](#CompletionItem.insertText) is ignored.
     */
    textEdit?: TextEdit;

    /**
     * An data entry field that is preserved on a completion item between
     * a [CompletionRequest](#CompletionRequest) and a [CompletionResolveRequest]
     * (#CompletionResolveRequest)
     */
    data?: any
}

/**
 * The CompletionItem namespace provides functions to deal with
 * completion items.
 */
export namespace CompletionItem {
    /**
     * Create a completion item and seed it with a label.
     * @param label The completion item's label
     */
    export function create(label: string): CompletionItem {
        return { label };
    }
}

/**
 * Represents a collection of [completion items](#CompletionItem) to be presented
 * in the editor.
 */
export interface CompletionList {
    /**
     * This list it not complete. Further typing should result in recomputing
     * this list.
     */
    isIncomplete: boolean;

    /**
     * The completion items.
     */
    items: CompletionItem[];
}

/**
 * The CompletionList namespace provides functions to deal with
 * completion lists.
 */
export namespace CompletionList {
    /**
     * Creates a new completion list.
     *
     * @param items The completion items.
     * @param isIncomplete The list is not complete.
     */
    export function create(items?: CompletionItem[], isIncomplete?: boolean): CompletionList {
        return { items: items ? items : [], isIncomplete: !!isIncomplete };
    }
}

/**
 * The result of a hove request.
 */
export interface Hover {
    /**
     * The hover's content
     */
    contents: MarkedString | MarkedString[];

    /**
     * An optional range
     */
    range?: Range;
}

/**
 * Represents a parameter of a callable-signature. A parameter can
 * have a label and a doc-comment.
 */
export interface ParameterInformation {
    /**
     * The label of this signature. Will be shown in
     * the UI.
     */
    label: string;

    /**
     * The human-readable doc-comment of this signature. Will be shown
     * in the UI but can be omitted.
     */
    documentation?: string;
}

/**
 * The ParameterInformation namespace provides helper functions to work with
 * [ParameterInformation](#ParameterInformation) literals.
 */
export namespace ParameterInformation {
    /**
     * Creates a new parameter information literal.
     *
     * @param label A label string.
     * @param documentation A doc string.
     */
    export function create(label: string, documentation?: string): ParameterInformation {
        return documentation ? { label, documentation } : { label };
    };
}

/**
 * Represents the signature of something callable. A signature
 * can have a label, like a function-name, a doc-comment, and
 * a set of parameters.
 */
export interface SignatureInformation {
    /**
     * The label of this signature. Will be shown in
     * the UI.
     */
    label: string;

    /**
     * The human-readable doc-comment of this signature. Will be shown
     * in the UI but can be omitted.
     */
    documentation?: string;

    /**
     * The parameters of this signature.
     */
    parameters?: ParameterInformation[];
}

/**
 * The SignatureInformation namespace provides helper functions to work with
 * [SignatureInformation](#SignatureInformation) literals.
 */
export namespace SignatureInformation {
    export function create(label: string, documentation?: string, ...parameters: ParameterInformation[]): SignatureInformation {
        let result: SignatureInformation = { label };
        if (Is.defined(documentation)) {
            result.documentation = documentation;
        }
        if (Is.defined(parameters)) {
            result.parameters = parameters;
        } else {
            result.parameters = [];
        }
        return result;
    }
}

/**
 * Signature help represents the signature of something
 * callable. There can be multiple signature but only one
 * active and only one active parameter.
 */
export interface SignatureHelp {
    /**
     * One or more signatures.
     */
    signatures: SignatureInformation[];

    /**
     * The active signature.
     */
    activeSignature?: number;

    /**
     * The active parameter of the active signature.
     */
    activeParameter?: number;
}

/**
 * The definition of a symbol represented as one or many [locations](#Location).
 * For most programming languages there is only one location at which a symbol is
 * defined.
 */
export type Definition = Location | Location[];

/**
 * Value-object that contains additional information when
 * requesting references.
 */
export interface ReferenceContext {
    /**
     * Include the declaration of the current symbol.
     */
    includeDeclaration: boolean;
}


/**
 * A document highlight kind.
 */
export const enum DocumentHighlightKind {
    /**
     * A textual occurrance.
     */
    Text = 1,

    /**
     * Read-access of a symbol, like reading a variable.
     */
    Read = 2,

    /**
     * Write-access of a symbol, like writing to a variable.
     */
    Write = 3
}

/**
 * A document highlight is a range inside a text document which deserves
 * special attention. Usually a document highlight is visualized by changing
 * the background color of its range.
 */
export interface DocumentHighlight {
    /**
     * The range this highlight applies to.
     */
    range: Range;

    /**
     * The highlight kind, default is [text](#DocumentHighlightKind.Text).
     */
    kind?: number;
}

/**
 * DocumentHighlight namespace to provide helper functions to work with
 * [DocumentHighlight](#DocumentHighlight) literals.
 */
export namespace DocumentHighlight {
    /**
     * Create a DocumentHighlight object.
     * @param range The range the highlight applies to.
     */
    export function create(range: Range, kind?: number): DocumentHighlight {
        let result: DocumentHighlight = { range };
        if (Is.number(kind)) {
            result.kind = kind;
        }
        return result;
    }
}

/**
 * A symbol kind.
 */
export const enum SymbolKind {
    File = 1,
    Module = 2,
    Namespace = 3,
    Package = 4,
    Class = 5,
    Method = 6,
    Property = 7,
    Field = 8,
    Constructor = 9,
    Enum = 10,
    Interface = 11,
    Function = 12,
    Variable = 13,
    Constant = 14,
    String = 15,
    Number = 16,
    Boolean = 17,
    Array = 18,
}

/**
 * Represents information about programming constructs like variables, classes,
 * interfaces etc.
 */
export interface SymbolInformation {
    /**
     * The name of this symbol.
     */
    name: string;

    /**
     * The kind of this symbol.
     */
    kind: number;

    /**
     * The location of this symbol.
     */
    location: Location;

    /**
     * The name of the symbol containing this symbol.
     */
    containerName?: string;
}

export namespace SymbolInformation {
    /**
     * Creates a new symbol information literal.
     *
     * @param name The name of the symbol.
     * @param kind The kind of the symbol.
     * @param range The range of the location of the symbol.
     * @param uri The resource of the location of symbol, defaults to the current document.
     * @param containerName The name of the symbol containg the symbol.
     */
    export function create(name: string, kind: SymbolKind, range: Range, uri: string, containerName?: string): SymbolInformation {
        const result: SymbolInformation = {
            name,
            kind,
            location: { uri, range }
        };
        if (containerName) {
            result.containerName = containerName;
        }
        return result;
    }
}

/**
 * Parameters for a [DocumentSymbolRequest](#DocumentSymbolRequest).
 */
export interface DocumentSymbolParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * The parameters of a [WorkspaceSymbolRequest](#WorkspaceSymbolRequest).
 */
export interface WorkspaceSymbolParams {
    /**
     * A non-empty query string
     */
    query: string;
}

/**
 * Contains additional diagnostic information about the context in which
 * a [code action](#CodeActionProvider.provideCodeActions) is run.
 */
export interface CodeActionContext {
    /**
     * An array of diagnostics.
     */
    diagnostics: Diagnostic[];
}

/**
 * The CodeActionContext namespace provides helper functions to work with
 * [CodeActionContext](#CodeActionContext) literals.
 */
export namespace CodeActionContext {
    /**
     * Creates a new CodeActionContext literal.
     */
    export function create(diagnostics: Diagnostic[]): CodeActionContext {
        return { diagnostics };
    }
    /**
     * Checks whether the given literal conforms to the [CodeActionContext](#CodeActionContext) interface.
     */
    export function is(value: any): value is CodeActionContext {
        let candidate = value as CodeActionContext;
        return Is.defined(candidate) && Is.typedArray<Diagnostic[]>(candidate.diagnostics, Diagnostic.is);
    }
}

/**
 * A code lens represents a [command](#Command) that should be shown along with
 * source text, like the number of references, a way to run tests, etc.
 *
 * A code lens is _unresolved_ when no command is associated to it. For performance
 * reasons the creation of a code lens and resolving should be done to two stages.
 */
export interface CodeLens {
    /**
     * The range in which this code lens is valid. Should only span a single line.
     */
    range: Range;

    /**
     * The command this code lens represents.
     */
    command?: Command;

    /**
     * An data entry field that is preserved on a code lens item between
     * a [CodeLensRequest](#CodeLensRequest) and a [CodeLensResolveRequest]
     * (#CodeLensResolveRequest)
     */
    data?: any
}

/**
 * The CodeLens namespace provides helper functions to work with
 * [CodeLens](#CodeLens) literals.
 */
export namespace CodeLens {
    /**
     * Creates a new CodeLens literal.
     */
    export function create(range: Range, data?: any): CodeLens {
        let result: CodeLens = { range };
        if (Is.defined(data)) result.data = data;
        return result;
    }
    /**
     * Checks whether the given literal conforms to the [CodeLens](#CodeLens) interface.
     */
    export function is(value: any): value is CodeLens {
        let candidate = value as CodeLens;
        return Is.defined(candidate) && Range.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
    }
}

/**
 * Value-object describing what options formatting should use.
 */
export interface FormattingOptions {
    /**
     * Size of a tab in spaces.
     */
    tabSize: number;

    /**
     * Prefer spaces over tabs.
     */
    insertSpaces: boolean;

    /**
     * Signature for further properties.
     */
    [key: string]: boolean | number | string;
}

/**
 * The FormattingOptions namespace provides helper functions to work with
 * [FormattingOptions](#FormattingOptions) literals.
 */
export namespace FormattingOptions {
    /**
     * Creates a new FormattingOptions literal.
     */
    export function create(tabSize: number, insertSpaces: boolean): FormattingOptions {
        return { tabSize, insertSpaces };
    }
    /**
     * Checks whether the given literal conforms to the [FormattingOptions](#FormattingOptions) interface.
     */
    export function is(value: any): value is FormattingOptions {
        let candidate = value as FormattingOptions;
        return Is.defined(candidate) && Is.number(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
    }
}

/**
 * A simple text document. Not to be implemenented.
 */
export interface TextDocument {

    /**
     * The associated URI for this document. Most documents have the __file__-scheme, indicating that they
     * represent files on disk. However, some documents may have other schemes indicating that they are not
     * available on disk.
     *
     * @readonly
     */
    uri: string;

    /**
     * The identifier of the language associated with this document.
     *
     * @readonly
     */
    languageId: string;

    /**
     * The version number of this document (it will strictly increase after each
     * change, including undo/redo).
     *
     * @readonly
     */
    version: number;

    /**
     * Get the text of this document.
     *
     * @return The text of this document.
     */
    getText(): string;

    /**
     * Converts a zero-based offset to a position.
     *
     * @param offset A zero-based offset.
     * @return A valid [position](#Position).
     */
    positionAt(offset: number): Position;

    /**
     * Converts the position to a zero-based offset.
     *
     * The position will be [adjusted](#TextDocument.validatePosition).
     *
     * @param position A position.
     * @return A valid zero-based offset.
     */
    offsetAt(position: Position): number;

    /**
     * The number of lines in this document.
     *
     * @readonly
     */
    lineCount: number;
}

export namespace TextDocument {
    /**
     * Creates a new ITextDocument literal from the given uri and content.
     * @param uri The document's uri.
     * @param languageId  The document's language Id.
     * @param content The document's content.
     */
    export function create(uri: string, languageId: string, version: number, content: string): TextDocument {
        return new FullTextDocument(uri, languageId, version, content);
    }
    /**
     * Checks whether the given literal conforms to the [ITextDocument](#ITextDocument) interface.
     */
    export function is(value: any): value is TextDocument {
        let candidate = value as TextDocument;
        return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.number(candidate.lineCount)
            && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
    }
}

/**
 * Event to signal changes to a simple text document.
 */
export interface TextDocumentChangeEvent {
    /**
     * The document that has changed.
     */
    document: TextDocument;
}

/**
 * An event describing a change to a text document. If range and rangeLength are omitted
 * the new text is considered to be the full content of the document.
 */
export interface TextDocumentContentChangeEvent {
    /**
     * The range of the document that changed.
     */
    range?: Range;

    /**
     * The length of the range that got replaced.
     */
    rangeLength?: number;

    /**
     * The new text of the document.
     */
    text: string;
}

class FullTextDocument implements TextDocument {

    private _uri: string;
    private _languageId: string;
    private _version: number;
    private _content: string;
    private _lineOffsets: number[] | null;

    public constructor(uri: string, languageId: string, version: number, content: string) {
        this._uri = uri;
        this._languageId = languageId;
        this._version = version;
        this._content = content;
        this._lineOffsets = null;
    }

    public get uri(): string {
        return this._uri;
    }

    public get languageId(): string {
        return this._languageId;
    }

    public get version(): number {
        return this._version;
    }

    public getText(): string {
        return this._content;
    }

    public update(event: TextDocumentContentChangeEvent, version: number): void {
        this._content = event.text;
        this._version = version;
        this._lineOffsets = null;
    }

    private getLineOffsets(): number[] {
        if (this._lineOffsets === null) {
            let lineOffsets: number[] = [];
            let text = this._content;
            let isLineStart = true;
            for (let i = 0; i < text.length; i++) {
                if (isLineStart) {
                    lineOffsets.push(i);
                    isLineStart = false;
                }
                let ch = text.charAt(i);
                isLineStart = (ch === '\r' || ch === '\n');
                if (ch === '\r' && i + 1 < text.length && text.charAt(i + 1) === '\n') {
                    i++;
                }
            }
            if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
            }
            this._lineOffsets = lineOffsets;
        }
        return this._lineOffsets;
    }

    public positionAt(offset: number) {
        offset = Math.max(Math.min(offset, this._content.length), 0);

        let lineOffsets = this.getLineOffsets();
        let low = 0, high = lineOffsets.length;
        if (high === 0) {
            return Position.create(0, offset);
        }
        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            if (lineOffsets[mid] > offset) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        // low is the least x for which the line offset is larger than the current offset
        // or array.length if no line offset is larger than the current offset
        let line = low - 1;
        return Position.create(line, offset - lineOffsets[line]);
    }

    public offsetAt(position: Position) {
        let lineOffsets = this.getLineOffsets();
        if (position.line >= lineOffsets.length) {
            return this._content.length;
        } else if (position.line < 0) {
            return 0;
        }
        let lineOffset = lineOffsets[position.line];
        let nextLineOffset = (position.line + 1 < lineOffsets.length) ? lineOffsets[position.line + 1] : this._content.length;
        return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
    }

    public get lineCount() {
        return this.getLineOffsets().length;
    }
}

namespace Is {

    const toString = Object.prototype.toString;

    export function defined(value: any): boolean {
        return typeof value !== 'undefined';
    }

    export function undefined(value: any): boolean {
        return typeof value === 'undefined';
    }

    export function boolean(value: any): value is boolean {
        return value === true || value === false;
    }

    export function string(value: any): value is string {
        return toString.call(value) === '[object String]';
    }

    export function number(value: any): value is number {
        return toString.call(value) === '[object Number]';
    }

    export function func(value: any): value is Function {
        return toString.call(value) === '[object Function]';
    }

    export function typedArray<T>(value: any, check: (value: any) => boolean): value is T[] {
        return Array.isArray(value) && (<any[]>value).every(check);
    }

}

/**
 * A parameter literal used in requests to pass a text document and a position inside that
 * document.
 */
export interface TextDocumentPositionParams {
    /**
     * The text document.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The position inside the text document.
     */
    position: Position;
}


//---- Initialize Method ----

/**
 * Defines the capabilities provided by the client.
 */
export interface ClientCapabilities {
}

/**
 * Defines how the host (editor) should sync
 * document changes to the language server.
 */
export enum TextDocumentSyncKind {
    /**
     * Documents should not be synced at all.
     */
    None = 0,

    /**
     * Documents are synced by always sending the full content
     * of the document.
     */
    Full = 1,

    /**
     * Documents are synced by sending the full content on open.
     * After that only incremental updates to the document are
     * send.
     */
    Incremental = 2
}

/**
 * Completion options.
 */
export interface CompletionOptions {
    /**
     * The server provides support to resolve additional
     * information for a completion item.
     */
    resolveProvider?: boolean;

    /**
     * The characters that trigger completion automatically.
     */
    triggerCharacters?: string[];
}

/**
 * Signature help options.
 */
export interface SignatureHelpOptions {
    /**
     * The characters that trigger signature help
     * automatically.
     */
    triggerCharacters?: string[];
}

/**
 * Code Lens options.
 */
export interface CodeLensOptions {
    /**
     * Code lens has a resolve provider as well.
     */
    resolveProvider?: boolean;
}

/**
 * Format document on type options
 */
export interface DocumentOnTypeFormattingOptions {
    /**
     * A character on which formatting should be triggered, like `}`.
     */
    firstTriggerCharacter: string;
    /**
     * More trigger characters.
     */
    moreTriggerCharacter?: string[]
}

/**
 * Defines the capabilities provided by a language
 * server.
 */
export interface ServerCapabilities {
    /**
     * Defines how text documents are synced.
     */
    textDocumentSync?: number;
    /**
     * The server provides hover support.
     */
    hoverProvider?: boolean;
    /**
     * The server provides completion support.
     */
    completionProvider?: CompletionOptions;
    /**
     * The server provides signature help support.
     */
    signatureHelpProvider?: SignatureHelpOptions;
    /**
     * The server provides goto definition support.
     */
    definitionProvider?: boolean;
    /**
     * The server provides find references support.
     */
    referencesProvider?: boolean;
    /**
     * The server provides document highlight support.
     */
    documentHighlightProvider?: boolean;
    /**
     * The server provides document symbol support.
     */
    documentSymbolProvider?: boolean;
    /**
     * The server provides workspace symbol support.
     */
    workspaceSymbolProvider?: boolean;
    /**
     * The server provides code actions.
     */
    codeActionProvider?: boolean;
    /**
     * The server provides code lens.
     */
    codeLensProvider?: CodeLensOptions;
    /**
     * The server provides document formatting.
     */
    documentFormattingProvider?: boolean;
    /**
     * The server provides document range formatting.
     */
    documentRangeFormattingProvider?: boolean;
    /**
     * The server provides document formatting on typing.
     */
    documentOnTypeFormattingProvider?: DocumentOnTypeFormattingOptions;
    /**
     * The server provides rename support.
     */
    renameProvider?: boolean;
}
/**
 * The initialize parameters
 */
export interface InitializeParams {
    /**
     * The process Id of the parent process that started
     * the server.
     */
    processId: number;

    /**
     * The rootPath of the workspace. Is null
     * if no folder is open.
     */
    rootPath: string;

    /**
     * The capabilities provided by the client (editor)
     */
    capabilities: ClientCapabilities;

    /**
     * User provided initialization options.
     */
    initializationOptions: any;
}

/**
 * The result returned from an initilize request.
 */
export interface InitializeResult {
    /**
     * The capabilities the language server provides.
     */
    capabilities: ServerCapabilities;
}

/**
 * The error returned if the initilize request fails.
 */
export interface InitializeError {
    /**
     * Indicates whether the client should retry to send the
     * initilize request after showing the message provided
     * in the {@link ResponseError}
     */
    retry: boolean;
}

/**
 * The parameters of a change configuration notification.
 */
export interface DidChangeConfigurationParams {
    /**
     * The actual changed settings
     */
    settings: any;
}

//---- Message show and log notifications ----

/**
 * The message type
 */
export enum MessageType {
    /**
     * An error message.
     */
    Error = 1,
    /**
     * A warning message.
     */
    Warning = 2,
    /**
     * An information message.
     */
    Info = 3,
    /**
     * A log message.
     */
    Log = 4
}

/**
 * The parameters of a notification message.
 */
export interface ShowMessageParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: number;

    /**
     * The actual message
     */
    message: string;
}

export interface MessageActionItem {
    /**
     * A short title like 'Retry', 'Open Log' etc.
     */
    title: string;
}

export interface ShowMessageRequestParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: number;

    /**
     * The actual message
     */
    message: string;

    /**
     * The message action items to present.
     */
    actions?: MessageActionItem[];
}

/**
 * The log message parameters.
 */
export interface LogMessageParams {
    /**
     * The message type. See {@link MessageType}
     */
    type: number;

    /**
     * The actual message
     */
    message: string;
}

//---- Text document notifications ----

/**
 * The parameters send in a open text document notification
 */
export interface DidOpenTextDocumentParams {
    /**
     * The document that was opened.
     */
    textDocument: TextDocumentItem;
}

/**
 * The change text document notification's parameters.
 */
export interface DidChangeTextDocumentParams {
    /**
     * The document that did change. The version number points
     * to the version after all provided content changes have
     * been applied.
     */
    textDocument: VersionedTextDocumentIdentifier;

    /**
     * The actual content changes.
     */
    contentChanges: TextDocumentContentChangeEvent[];
}

/**
 * The parameters send in a close text document notification
 */
export interface DidCloseTextDocumentParams {
    /**
     * The document that was closed.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * The parameters send in a save text document notification
 */
export interface DidSaveTextDocumentParams {
    /**
     * The document that was closed.
     */
    textDocument: TextDocumentIdentifier;
}

/**
 * The watched files change notification's parameters.
 */
export interface DidChangeWatchedFilesParams {
    /**
     * The actual file events.
     */
    changes: FileEvent[];
}

/**
 * The file event type
 */
export enum FileChangeType {
    /**
     * The file got created.
     */
    Created = 1,
    /**
     * The file got changed.
     */
    Changed = 2,
    /**
     * The file got deleted.
     */
    Deleted = 3
}

/**
 * An event describing a file change.
 */
export interface FileEvent {
    /**
     * The file's uri.
     */
    uri: string;
    /**
     * The change type.
     */
    type: number;
}

/**
 * The publish diagnostic notification's parameters.
 */
export interface PublishDiagnosticsParams {
    /**
     * The URI for which diagnostic information is reported.
     */
    uri: string;

    /**
     * An array of diagnostic information items.
     */
    diagnostics: Diagnostic[];
}

//---- Hover Support -------------------------------

export type MarkedString = string | { language: string; value: string };

//---- Reference Provider ----------------------------------

/**
 * Parameters for a [ReferencesRequest](#ReferencesRequest).
 */
export interface ReferenceParams extends TextDocumentPositionParams {
    context: ReferenceContext
}

//---- Code Action Provider ----------------------------------

/**
 * Params for the CodeActionRequest
 */
export interface CodeActionParams {
    /**
     * The document in which the command was invoked.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The range for which the command was invoked.
     */
    range: Range;

    /**
     * Context carrying additional information.
     */
    context: CodeActionContext;
}

//---- Code Lens Provider -------------------------------------------

/**
 * Params for the Code Lens request.
 */
export interface CodeLensParams {
    /**
     * The document to request code lens for.
     */
    textDocument: TextDocumentIdentifier;
}

//---- Formatting ----------------------------------------------

export interface DocumentFormattingParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The format options
     */
    options: FormattingOptions;
}

export interface DocumentRangeFormattingParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The range to format
     */
    range: Range;

    /**
     * The format options
     */
    options: FormattingOptions;
}

export interface DocumentOnTypeFormattingParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The position at which this request was send.
     */
    position: Position;

    /**
     * The character that has been typed.
     */
    ch: string;

    /**
     * The format options.
     */
    options: FormattingOptions;
}

//---- Rename ----------------------------------------------

export interface RenameParams {
    /**
     * The document to format.
     */
    textDocument: TextDocumentIdentifier;

    /**
     * The position at which this request was send.
     */
    position: Position;

    /**
     * The new name of the symbol. If the given name is not valid the
     * request must return a [ResponseError](#ResponseError) with an
     * appropriate message set.
     */
    newName: string;
}

export namespace Methods {
    /**
     * The initialize method is sent from the client to the server.
     * It is send once as the first method after starting up the
     * worker. The requests parameter is of type [InitializeParams](#InitializeParams)
     * the response if of type [InitializeResult](#InitializeResult) of a Thenable that
     * resolves to such.
     */
    export const InitializeRequest = 'initialize';

    //---- Shutdown Method ----

    /**
     * A shutdown request is sent from the client to the server.
     * It is send once when the client descides to shutdown the
     * server. The only notification that is sent after a shudown request
     * is the exit event.
     */
    export const ShutdownRequest = 'shutdown';

    //---- Exit Notification ----

    /**
     * The exit event is sent from the client to the server to
     * ask the server to exit its process.
     */
    export const ExitNotification = 'exit';

    //---- Configuration notification ----

    /**
     * The configuration change notification is sent from the client to the server
     * when the client's configuration has changed. The notification contains
     * the changed configuration as defined by the language client.
     */
    export const DidChangeConfigurationNotification = 'workspace/didChangeConfiguration';

    /**
     * The show message notification is sent from a server to a client to ask
     * the client to display a particular message in the user interface.
     */
    export const ShowMessageNotification = 'window/showMessage';

    /**
     * The show message request is send from the server to the clinet to show a message
     * and a set of options actions to the user.
     */
    export const ShowMessageRequest = 'window/showMessageRequest';

    /**
     * The log message notification is send from the server to the client to ask
     * the client to log a particular message.
     */
    export const LogMessageNotification = 'window/logMessage';

    //---- Telemetry notification

    /**
     * The telemetry event notification is send from the server to the client to ask
     * the client to log telemetry data.
     */
    export const TelemetryEventNotification = 'telemetry/event';

    /**
     * The document open notification is sent from the client to the server to signal
     * newly opened text documents. The document's truth is now managed by the client
     * and the server must not try to read the document's truth using the document's
     * uri.
     */
    export const DidOpenTextDocumentNotification = 'textDocument/didOpen';

    /**
     * The document change notification is sent from the client to the server to signal
     * changes to a text document.
     */
    export const DidChangeTextDocumentNotification = 'textDocument/didChange';

    /**
     * The document close notification is sent from the client to the server when
     * the document got closed in the client. The document's truth now exists
     * where the document's uri points to (e.g. if the document's uri is a file uri
     * the truth now exists on disk).
     */
    export const DidCloseTextDocumentNotification = 'textDocument/didClose';

    /**
     * The document save notification is sent from the client to the server when
     * the document got saved in the client.
     */
    export const DidSaveTextDocumentNotification = 'textDocument/didSave';

    //---- File eventing ----

    /**
     * The watched files notification is sent from the client to the server when
     * the client detects changes to file watched by the lanaguage client.
     */
    export const DidChangeWatchedFilesNotification = 'workspace/didChangeWatchedFiles';

    //---- Diagnostic notification ----

    /**
     * Diagnostics notification are sent from the server to the client to signal
     * results of validation runs.
     */
    export const PublishDiagnosticsNotification = 'textDocument/publishDiagnostics';

    //---- Completion Support --------------------------

    /**
     * Request to request completion at a given text document position. The request's
     * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response
     * is of type [CompletionItem[]](#CompletionItem) or [CompletionList](#CompletionList)
     * or a Thenable that resolves to such.
     */
    export const CompletionRequest = 'textDocument/completion';

    /**
     * Request to resolve additional information for a given completion item.The request's
     * parameter is of type [CompletionItem](#CompletionItem) the response
     * is of type [CompletionItem](#CompletionItem) or a Thenable that resolves to such.
     */
    export const CompletionResolveRequest = 'completionItem/resolve';

    /**
     * Request to request hover information at a given text document position. The request's
     * parameter is of type [TextDocumentPosition](#TextDocumentPosition) the response is of
     * type [Hover](#Hover) or a Thenable that resolves to such.
     */
    export const HoverRequest = 'textDocument/hover';

    //---- SignatureHelp ----------------------------------

    export const SignatureHelpRequest = 'textDocument/signatureHelp';

    //---- Goto Definition -------------------------------------

    /**
     * A request to resolve the defintion location of a symbol at a given text
     * document position. The request's parameter is of type [TextDocumentPosition]
     * (#TextDocumentPosition) the response is of type [Definition](#Definition) or a
     * Thenable that resolves to such.
     */
    export const DefinitionRequest = 'textDocument/definition';

    /**
     * A request to resolve project-wide references for the symbol denoted
     * by the given text document position. The request's parameter is of
     * type [ReferenceParams](#ReferenceParams) the response is of type
     * [Location[]](#Location) or a Thenable that resolves to such.
     */
    export const ReferencesRequest = 'textDocument/references';

    //---- Document Highlight ----------------------------------

    /**
     * Request to resolve a [DocumentHighlight](#DocumentHighlight) for a given
     * text document position. The request's parameter is of type [TextDocumentPosition]
     * (#TextDocumentPosition) the request reponse is of type [DocumentHighlight[]]
     * (#DocumentHighlight) or a Thenable that resolves to such.
     */
    export const DocumentHighlightRequest = 'textDocument/documentHighlight';

    //---- Document Symbol Provider ---------------------------

    /**
     * A request to list all symbols found in a given text document. The request's
     * parameter is of type [TextDocumentIdentifier](#TextDocumentIdentifier) the
     * response is of type [SymbolInformation[]](#SymbolInformation) or a Thenable
     * that resolves to such.
     */
    export const DocumentSymbolRequest = 'textDocument/documentSymbol';

    //---- Workspace Symbol Provider ---------------------------

    /**
     * A request to list project-wide symbols matching the query string given
     * by the [WorkspaceSymbolParams](#WorkspaceSymbolParams). The response is
     * of type [SymbolInformation[]](#SymbolInformation) or a Thenable that
     * resolves to such.
     */
    export const WorkspaceSymbolRequest = 'workspace/symbol';

    /**
     * A request to provide commands for the given text document and range.
     */
    export const CodeActionRequest = 'textDocument/codeAction';

    /**
     * A request to provide code lens for the given text document.
     */
    export const CodeLensRequest = 'textDocument/codeLens';

    /**
     * A request to resolve a command for a given code lens.
     */
    export const CodeLensResolveRequest = 'codeLens/resolve';

    /**
     * A request to to format a whole document.
     */
    export const DocumentFormattingRequest = 'textDocument/formatting';

    /**
     * A request to to format a range in a document.
     */
    export const DocumentRangeFormattingRequest = 'textDocument/rangeFormatting';

    /**
     * A request to format a document on type.
     */
    export const DocumentOnTypeFormattingRequest = 'textDocument/onTypeFormatting';

    /**
     * A request to rename a symbol.
     */
    export const RenameRequest = 'textDocument/rename';
}
