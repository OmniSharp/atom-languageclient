/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
import * as _ from 'lodash';
import * as ls from 'vscode-languageserver-types';
import * as c from './convert';
import * as proto from './protocol';
import { isProtocolCodeLensItem } from './protocol-codelens';
import { isProtocolSuggestionItem } from './protocol-completion-item';
import { ILanguageClientTextEditor, isLanguageClientTextEditor } from '../../omni/ILanguageClientTextEditor';
import { AtomTextChange } from '../../omni/LanguageClientTextEditorChanges';

export function toTextDocumentIdentifier(editor: ILanguageClientTextEditor): ls.TextDocumentIdentifier {
    return {
        uri: c.getUri(editor)
    };
}

export function toOpenTextDocumentParams(editor: ILanguageClientTextEditor): proto.DidOpenTextDocumentParams {
    return {
        textDocument: {
            uri: c.getUri(editor),
            languageId: c.getLanguageId(editor),
            version: c.getVersion(editor),
            text: editor.getText()
        }
    };
}

function isTextDocumentChangeEvent(value: any): value is AtomTextChange {
    const candidate = <AtomTextChange>value;
    return c.isDefined(candidate.newText) && c.isDefined(candidate.oldText);
}

export function toChangeFullTextDocumentParams(editor: ILanguageClientTextEditor): proto.DidChangeTextDocumentParams {
    return {
        textDocument: {
            uri: c.getUri(editor),
            version: c.getVersion(editor)
        },
        contentChanges: [{ text: editor.getText() }]
    };
}

export function toChangeIncrementalTextDocumentParams(editor: ILanguageClientTextEditor): proto.DidChangeTextDocumentParams {
    const document = editor;
    return {
        textDocument: {
            uri: document.getURI(),
            version: document.languageclient.version
        },
        contentChanges: editor.languageclient.changes.pop().map((change): proto.TextDocumentContentChangeEvent => {
            return {
                range: toRange(change.oldRange),
                text: change.newText
            };
        })
    };
}

export function toCloseTextDocumentParams(editor: ILanguageClientTextEditor): proto.DidCloseTextDocumentParams {
    return {
        textDocument: toTextDocumentIdentifier(editor)
    };
}

export function toSaveTextDocumentParams(editor: ILanguageClientTextEditor): proto.DidSaveTextDocumentParams {
    return {
        textDocument: toTextDocumentIdentifier(editor)
    }
}

export function toTextDocumentPositionParams(editor: ILanguageClientTextEditor, position: TextBuffer.Point): proto.TextDocumentPositionParams {
    return {
        textDocument: toTextDocumentIdentifier(editor),
        position: toWorkerPosition(position)
    };
}

export function toWorkerPosition(position: TextBuffer.Point): ls.Position {
    return { line: position.row, character: position.column };
}

export function toRange(value: TextBuffer.Range): ls.Range {
    return { start: toPosition(value.start), end: toPosition(value.end) };
}

export function toPosition(value: TextBuffer.Point): ls.Position {
    return { line: value.row, character: value.column };
}

export function toDiagnosticSeverity(value: 'error' | 'warning' | 'info'): ls.DiagnosticSeverity {
    switch (value) {
        case 'error':
            return ls.DiagnosticSeverity.Error;
        case 'warning':
            return ls.DiagnosticSeverity.Warning;
        case 'info':
        default:
            return ls.DiagnosticSeverity.Information;
    }
}

export function toDiagnostic(item: Linter.Message): ls.Diagnostic {
    const result: ls.Diagnostic = ls.Diagnostic.create(toRange(item.range), c.getLinterText(item));
    c.setIfDefined(item.severity, () => result.severity = toDiagnosticSeverity(item.severity));
    c.setIfDefined(item.code, () => result.code = item.code);
    c.setIfDefined(item.name, () => result.source = item.name);
    return result;
}

export function toDiagnostics(items: Linter.Message[]): ls.Diagnostic[] {
    if (_.isUndefined(items) || _.isNull(items)) {
        return [];
    }
    return _.map(items, toDiagnostic);
}

export function toCompletionItem(item: Autocomplete.Suggestion): ls.CompletionItem {
    const result: ls.CompletionItem = { label: c.getCompletionText(item) };
    c.setIfDefined(item.description, () => result.detail = item.description);
    c.setIfDefined(item.descriptionMoreURL, () => result.documentation = item.descriptionMoreURL);
    result.filterText = c.getCompletionReplacementText(item);
    result.sortText = c.getCompletionReplacementText(item);
    result.insertText = c.getCompletionReplacementText(item);
    // Protocol item kind is 1 based, codes item kind is zero based.
    switch (item.type) {
        case 'attribute':
        case 'builtin':
            result.kind = ls.CompletionItemKind.Unit;
            break;
        case 'class':
            result.kind = ls.CompletionItemKind.Class;
            break;
        case 'variable':
        case 'constant':
            result.kind = ls.CompletionItemKind.Variable;
            break;
        case 'function':
            result.kind = ls.CompletionItemKind.Function;
            break;
        case 'keyword':
            result.kind = ls.CompletionItemKind.Keyword;
            break;
        case 'method':
            result.kind = ls.CompletionItemKind.Method;
            break;
        case 'mixin':
        case 'import':
        case 'require':
        case 'module':
        case 'package':
            result.kind = ls.CompletionItemKind.Module;
            break;
        case 'property':
            result.kind = ls.CompletionItemKind.Property;
            break;
        case 'snippet':
            result.kind = ls.CompletionItemKind.Snippet;
            break;
        case 'tag':
            result.kind = ls.CompletionItemKind.Unit;
            break;
        case 'type':
            result.kind = ls.CompletionItemKind.Reference;
            break;
        case 'value':
            result.kind = ls.CompletionItemKind.Value;
            break;
        case 'selector':
        case 'pseudo-selector':
        default:
            result.kind = ls.CompletionItemKind.Text;
            break;
    }
    if (isProtocolSuggestionItem(item)) {
        result.data = item.data;
    }
    return result;
}

export function toTextEdit(edit: AtomTextChange): ls.TextEdit {
    return { range: toRange(edit.oldRange), newText: edit.newText };
}

export function toReferenceParams(editor: ILanguageClientTextEditor, position: TextBuffer.Point, options: { includeDeclaration: boolean; }): proto.ReferenceParams {
    return {
        textDocument: toTextDocumentIdentifier(editor),
        position: toWorkerPosition(position),
        context: { includeDeclaration: options.includeDeclaration }
    };
}

// export function toCodeActionContext(context: code.CodeActionContext): ls.CodeActionContext {
//     if (_.isUndefined(context) || _.isNull(context)) {
//         return context;
//     }
//     return ls.CodeActionContext.create(toDiagnostics(context.diagnostics));
// }

// export function toCommand(item: code.Command): ls.Command {
//     const result = ls.Command.create(item.title, item.command);
//     if (c.isDefined(item.arguments)) {
//         result.arguments = item.arguments;
//     }
//     return result;
// }

// export function toCodeLens(item: code.CodeLens): ls.CodeLens {
//     const result = ls.CodeLens.create(toRange(item.range));
//     if (c.isDefined(item.command)) {
//         result.command = toCommand(item.command);
//     }
//     if (isProtocolCodeLensItem(item)) {
//         if (c.isDefined(item.data)) {
//             result.data = item.data;
//         }
//     }
//     return result;
// }

// export function toFormattingOptions(item: code.FormattingOptions): ls.FormattingOptions {
//     return { tabSize: item.tabSize, insertSpaces: item.insertSpaces };
// }

export function toDocumentSymbolParams(editor: ILanguageClientTextEditor): proto.DocumentSymbolParams {
    return {
        textDocument: toTextDocumentIdentifier(editor)
    }
}

export function toCodeLensParams(editor: ILanguageClientTextEditor): proto.CodeLensParams {
    return {
        textDocument: toTextDocumentIdentifier(editor)
    };
}
