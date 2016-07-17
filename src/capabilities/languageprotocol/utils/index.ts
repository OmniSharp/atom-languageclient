// /**
//  *  @license   MIT
//  *  @copyright OmniSharp Team
//  *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
//  */
// /* tslint:disable:no-any */
// import * as _ from 'lodash';
// import { DiagnosticSeverity, TextDocumentIdentifier } from 'vscode-languageserver-types';
// import { getLanguageId, getUri, isDefined } from './convert';
// import {
//     DidChangeTextDocumentParams,
//     DidCloseTextDocumentParams,
//     DidOpenTextDocumentParams,
//     DidSaveTextDocumentParams,
//     TextDocumentPositionParams
// } from '../../../vscode-protocol';
// // import * as c from './convert';
// // import * as proto from './protocol';
// // import { isProtocolCodeLensItem } from './protocol-codelens';
// // import { isProtocolSuggestionItem } from './protocol-completion-item';
// import { AtomTextChange } from '../../../omni/LanguageClientTextEditorChanges';

// export function toOpenTextDocumentParams(editor: Atom.TextEditor): DidOpenTextDocumentParams {
//     return {
//         textDocument: {
//             uri: getUri(editor),
//             languageId: getLanguageId(editor),
//             version: getVersion(editor),
//             text: editor.getText()
//         }
//     };
// }

// function isTextDocumentChangeEvent(value: any): value is AtomTextChange {
//     const candidate = <AtomTextChange>value;
//     return isDefined(candidate.newText) && isDefined(candidate.oldText);
// }

// export function toChangeFullTextDocumentParams(editor: Atom.TextEditor): DidChangeTextDocumentParams {
//     return {
//         textDocument: {
//             uri: getUri(editor),
//             version: getVersion(editor)
//         },
//         contentChanges: [{ text: editor.getText() }]
//     };
// }

// export function toChangeIncrementalTextDocumentParams(editor: Atom.TextEditor): DidChangeTextDocumentParams {
//     const document = editor;
//     return {
//         textDocument: {
//             uri: document.getURI(),
//             version: document.languageclient.version
//         },
//         contentChanges: editor.languageclient.changes.pop().map((change): TextDocumentContentChangeEvent => {
//             return {
//                 range: toRange(change.oldRange),
//                 text: change.newText
//             };
//         })
//     };
// }

// export function toCloseTextDocumentParams(editor: Atom.TextEditor): DidCloseTextDocumentParams {
//     return {
//         textDocument: toTextDocumentIdentifier(editor)
//     };
// }

// export function toSaveTextDocumentParams(editor: Atom.TextEditor): DidSaveTextDocumentParams {
//     return {
//         textDocument: toTextDocumentIdentifier(editor)
//     }
// }

// export function toTextDocumentPositionParams(editor: Atom.TextEditor, position: TextBuffer.Point): TextDocumentPositionParams {
//     return {
//         textDocument: toTextDocumentIdentifier(editor),
//         position: toWorkerPosition(position)
//     };
// }

// export function toWorkerPosition(position: TextBuffer.Point): Position {
//     return { line: position.row, character: position.column };
// }

// export function toDiagnosticSeverity(value: 'error' | 'warning' | 'info'): DiagnosticSeverity {
//     switch (value) {
//         case 'error':
//             return DiagnosticSeverity.Error;
//         case 'warning':
//             return DiagnosticSeverity.Warning;
//         case 'info':
//         default:
//             return DiagnosticSeverity.Information;
//     }
// }

// export function toDiagnostic(item: Linter.Message): Diagnostic {
//     const result: Diagnostic = Diagnosticreate(toRange(item.range), getLinterText(item));
//     setIfDefined(item.severity, () => result.severity = toDiagnosticSeverity(item.severity));
//     setIfDefined(item.code, () => result.code = item.code);
//     setIfDefined(item.name, () => result.source = item.name);
//     return result;
// }

// export function toDiagnostics(items: Linter.Message[]): Diagnostic[] {
//     if (_.isUndefined(items) || _.isNull(items)) {
//         return [];
//     }
//     return _.map(items, toDiagnostic);
// }

// export function toCompletionItem(item: Autocomplete.Suggestion): CompletionItem {
//     const result: CompletionItem = { label: getCompletionText(item) };
//     setIfDefined(item.description, () => result.detail = item.description);
//     setIfDefined(item.descriptionMoreURL, () => result.documentation = item.descriptionMoreURL);
//     result.filterText = getCompletionReplacementText(item);
//     result.sortText = getCompletionReplacementText(item);
//     result.insertText = getCompletionReplacementText(item);
//     // Protocol item kind is 1 based, codes item kind is zero based.
//     switch (item.type) {
//         case 'attribute':
//         case 'builtin':
//             result.kind = CompletionItemKind.Unit;
//             break;
//         case 'class':
//             result.kind = CompletionItemKind.Class;
//             break;
//         case 'variable':
//         case 'constant':
//             result.kind = CompletionItemKind.Variable;
//             break;
//         case 'function':
//             result.kind = CompletionItemKind.Function;
//             break;
//         case 'keyword':
//             result.kind = CompletionItemKind.Keyword;
//             break;
//         case 'method':
//             result.kind = CompletionItemKind.Method;
//             break;
//         case 'mixin':
//         case 'import':
//         case 'require':
//         case 'module':
//         case 'package':
//             result.kind = CompletionItemKind.Module;
//             break;
//         case 'property':
//             result.kind = CompletionItemKind.Property;
//             break;
//         case 'snippet':
//             result.kind = CompletionItemKind.Snippet;
//             break;
//         case 'tag':
//             result.kind = CompletionItemKind.Unit;
//             break;
//         case 'type':
//             result.kind = CompletionItemKind.Reference;
//             break;
//         case 'value':
//             result.kind = CompletionItemKind.Value;
//             break;
//         case 'selector':
//         case 'pseudo-selector':
//         default:
//             result.kind = CompletionItemKind.Text;
//             break;
//     }
//     if (isProtocolSuggestionItem(item)) {
//         result.data = item.data;
//     }
//     return result;
// }

// export function toTextEdit(edit: AtomTextChange): TextEdit {
//     return { range: toRange(edit.oldRange), newText: edit.newText };
// }

// export function toReferenceParams(editor: Atom.TextEditor, position: TextBuffer.Point, options: { includeDeclaration: boolean; }): ReferenceParams {
//     return {
//         textDocument: toTextDocumentIdentifier(editor),
//         position: toWorkerPosition(position),
//         context: { includeDeclaration: options.includeDeclaration }
//     };
// }

// // export function toCodeActionContext(context: code.CodeActionContext): CodeActionContext {
// //     if (_.isUndefined(context) || _.isNull(context)) {
// //         return context;
// //     }
// //     return CodeActionContext.create(toDiagnostics(context.diagnostics));
// // }

// // export function toCommand(item: code.Command): Command {
// //     const result = Command.create(item.title, item.command);
// //     if (isDefined(item.arguments)) {
// //         result.arguments = item.arguments;
// //     }
// //     return result;
// // }

// // export function toCodeLens(item: code.CodeLens): CodeLens {
// //     const result = CodeLens.create(toRange(item.range));
// //     if (isDefined(item.command)) {
// //         result.command = toCommand(item.command);
// //     }
// //     if (isProtocolCodeLensItem(item)) {
// //         if (isDefined(item.data)) {
// //             result.data = item.data;
// //         }
// //     }
// //     return result;
// // }

// // export function toFormattingOptions(item: code.FormattingOptions): FormattingOptions {
// //     return { tabSize: item.tabSize, insertSpaces: item.insertSpaces };
// // }

// export function toDocumentSymbolParams(editor: Atom.TextEditor): DocumentSymbolParams {
//     return {
//         textDocument: toTextDocumentIdentifier(editor)
//     }
// }

// export function toCodeLensParams(editor: Atom.TextEditor): CodeLensParams {
//     return {
//         textDocument: toTextDocumentIdentifier(editor)
//     };
// }
