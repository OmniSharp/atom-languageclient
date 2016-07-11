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
import { AtomTextChange } from '../../omni/LanguageClientTextEditorChanges';

export function fromDiagnostics(diagnostics: ls.Diagnostic[]): Linter.Message[] {
    return diagnostics.map(fromDiagnostic);
}

export function fromDiagnostic(diagnostic: ls.Diagnostic): Linter.TextMessage {
    return {
        type: fromDiagnosticSeverity(diagnostic.severity),
        text: diagnostic.message,
        range: fromRange(diagnostic.range),
        severity: fromDiagnosticSeverity(diagnostic.severity),
        code: diagnostic.code,
        name: diagnostic.source
    };
}

export function fromRange(value: ls.Range): TextBuffer.Range {
    return new TextBuffer.Range(fromPosition(value.start), fromPosition(value.end));
}

export function fromPosition(value: ls.Position): TextBuffer.Point {
    return new TextBuffer.Point(value.line, value.character);
}

export function fromDiagnosticSeverity(value: number | undefined): 'error' | 'warning' | 'info' {
    switch (value) {
        case ls.DiagnosticSeverity.Error:
            return 'error';
        case ls.DiagnosticSeverity.Warning:
            return 'warning';
        case ls.DiagnosticSeverity.Information:
        case ls.DiagnosticSeverity.Hint:
            return 'info';
        default:
            return 'error';
    }
}

// export function fromHover(hover: ls.Hover): code.Hover {
//     if (_.isUndefined(hover)) {
//         return undefined;
//     }
//     if (_.isNull(hover)) {
//         return null;
//     }
//     return new code.Hover(hover.contents, c.isDefined(hover.range) ? fromRange(hover.range) : undefined);
// }

// export function fromCompletionResult(result: ls.CompletionItem[] | ls.CompletionList): code.CompletionItem[] | code.CompletionList {
//     if (Array.isArray(result)) {
//         let items = <ls.CompletionItem[]>result;
//         return items.map(fromCompletionItem);
//     }
//     let list = <code.CompletionList>result;
//     return new code.CompletionList(list.items.map(fromCompletionItem), list.isIncomplete);
// }

// export function fromCompletionItem(item: ls.CompletionItem): ProtocolSuggestionItem {
//     const result = new ProtocolSuggestionItem(item.label);
//     c.setIfDefined(item.detail, () => result.detail = item.detail);
//     c.setIfDefined(item.documentation, () => result.documentation = item.documentation);
//     c.setIfDefined(item.filterText, () => result.filterText = item.filterText);
//     c.setIfDefined(item.insertText, () => result.insertText = item.insertText);
//     // Protocol item kind is 1 based, codes item kind is zero based.
//     c.setIfDefined(item.kind, () => result.kind = item.kind - 1);
//     c.setIfDefined(item.sortText, () => result.sortText = item.sortText);
//     c.setIfDefined(item.textEdit, () => result.textEdit = fromTextEdit(item.textEdit));
//     c.setIfDefined(item.data, () => result.data = item.data);
//     return result;
// }

// export function fromTextEdit(edit: ls.TextEdit): AtomTextChange {
//     return new AtomTextChange(fromRange(edit.range), edit.newText);
// }

// export function fromTextEdits(items: ls.TextEdit[]): AtomTextChange[] {
//     return items.map(fromTextEdit);
// }

// export function fromSignatureHelp(item: ls.SignatureHelp): code.SignatureHelp {
//     const result = new code.SignatureHelp();
//     c.setIfDefined(item.activeParameter, () => result.activeParameter = item.activeParameter);
//     c.setIfDefined(item.activeSignature, () => result.activeSignature = item.activeSignature);
//     c.setIfDefined(item.signatures, () => result.signatures = fromSignatureInformations(item.signatures));
//     return result;
// }

// export function fromSignatureInformations(items: ls.SignatureInformation[]): code.SignatureInformation[] {
//     return items.map(fromSignatureInformation);
// }

// export function fromSignatureInformation(item: ls.SignatureInformation): code.SignatureInformation {
//     let result = new code.SignatureInformation(item.label);
//     c.setIfDefined(item.documentation, () => result.documentation = item.documentation);
//     c.setIfDefined(item.parameters, () => result.parameters = fromParameterInformations(item.parameters));
//     return result;
// }

// export function fromParameterInformations(item: ls.ParameterInformation[]): code.ParameterInformation[] {
//     return item.map(fromParameterInformation);
// }

// export function fromParameterInformation(item: ls.ParameterInformation): code.ParameterInformation {
//     let result = new code.ParameterInformation(item.label);
//     c.setIfDefined(item.documentation, () => result.documentation = item.documentation);
//     return result;
// }

// export function fromDefinitionResult(item: ls.Definition): code.Definition {
//     if (is.array(item)) {
//         return item.map(fromLocation);
//     } else {
//         return fromLocation(item);
//     }
// }

// export function fromLocation(item: ls.Location): code.Location {
//     if (_.isUndefined(item)) {
//         return undefined;
//     }
//     if (_.isNull(item)) {
//         return null;
//     }
//     return new code.Location(code.Uri.parse(item.uri), fromRange(item.range));
// }

// export function fromReferences(values: ls.Location[]): code.Location[] {
//     return values.map(fromLocation);
// }

// export function fromDocumentHighlights(values: ls.DocumentHighlight[]): code.DocumentHighlight[] {
//     return values.map(fromDocumentHighlight);
// }

// export function fromDocumentHighlight(item: ls.DocumentHighlight): code.DocumentHighlight {
//     let result = new code.DocumentHighlight(fromRange(item.range));
//     c.setIfDefined(item.kind, () => result.kind = fromDocumentHighlightKind(item.kind));
//     return result;
// }

// export function fromDocumentHighlightKind(item: ls.DocumentHighlightKind): code.DocumentHighlightKind {
//     switch (item) {
//         case ls.DocumentHighlightKind.Text:
//             return code.DocumentHighlightKind.Text;
//         case ls.DocumentHighlightKind.Read:
//             return code.DocumentHighlightKind.Read;
//         case ls.DocumentHighlightKind.Write:
//             return code.DocumentHighlightKind.Write;
//     }
//     return code.DocumentHighlightKind.Text;
// }

// export function fromSymbolInformations(values: ls.SymbolInformation[], uri?: code.Uri): code.SymbolInformation[] {
//     return values.map(information => fromSymbolInformation(information, uri));
// }

// export function fromSymbolInformation(item: ls.SymbolInformation, uri?: code.Uri): code.SymbolInformation {
//     // Symbol kind is one based in the protocol and zero based in code.
//     let result = new code.SymbolInformation(
//         item.name, item.kind - 1,
//         fromRange(item.location.range),
//         item.location.uri ? code.Uri.parse(item.location.uri) : uri);
//     c.setIfDefined(item.containerName, () => result.containerName = item.containerName);
//     return result;
// }

// export function fromCommand(item: ls.Command): code.Command {
//     let result: code.Command = { title: item.title, command: item.command };
//     c.setIfDefined(item.arguments, () => result.arguments = item.arguments);
//     return result;
// }

// export function fromCommands(items: ls.Command[]): code.Command[] {
//     return items.map(fromCommand);
// }

// export function fromCodeLens(item: ls.CodeLens): code.CodeLens {
//     const result: ProtocolCodeLens = new ProtocolCodeLens(fromRange(item.range));
//     if (c.isDefined(item.command)) {
//         result.command = fromCommand(item.command);
//     }
//     if (c.isDefined(item.data)) {
//         result.data = item.data;
//     }
//     return result;
// }

// export function fromCodeLenses(items: ls.CodeLens[]): code.CodeLens[] {
//     return items.map(fromCodeLens);
// }

// export function fromWorkspaceEdit(item: ls.WorkspaceEdit): code.WorkspaceEdit {
//     const result = new code.WorkspaceEdit();
//     const keys = Object.keys(item.changes);
//     keys.forEach(key => result.set(code.Uri.parse(key), fromTextEdits(item.changes[key])));
//     return result;
// }
