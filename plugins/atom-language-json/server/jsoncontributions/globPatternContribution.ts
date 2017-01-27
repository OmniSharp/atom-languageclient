/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { MarkedString, CompletionItemKind, CompletionItem, InsertTextFormat } from 'vscode-languageserver';
import Strings = require('../utils/strings');
import { JSONWorkerContribution, JSONPath, CompletionsCollector } from 'vscode-json-languageservice';

import * as nls from 'vscode-nls';
const localize = nls.loadMessageBundle();

let globProperties: CompletionItem[] = [
    { kind: CompletionItemKind.Value, label: "Files by Extension", insertText: '"**/*.${1:extension}": true', insertTextFormat: InsertTextFormat.Snippet, documentation: "Match all files of a specific file extension." },
    { kind: CompletionItemKind.Value, label: "Files with Multiple Extensions", insertText: '"**/*.{ext1,ext2,ext3}": true', documentation: "Match all files with any of the file extensions." },
    { kind: CompletionItemKind.Value, label: "Files with Siblings by Name", insertText: '"**/*.${1:source-extension}": { "when": "$(basename).${2:target-extension}" }', insertTextFormat: InsertTextFormat.Snippet, documentation: "Match files that have siblings with the same name but a different extension." },
    { kind: CompletionItemKind.Value, label: "Folder by Name (Top Level)", insertText: '"${1:name}": true', insertTextFormat: InsertTextFormat.Snippet, documentation: "Match a top level folder with a specific name."},
    { kind: CompletionItemKind.Value, label: "Folders with Multiple Names (Top Level)", insertText: '"{folder1,folder2,folder3}": true', documentation: "Match multiple top level folders."},
    { kind: CompletionItemKind.Value, label: "Folder by Name (Any Location)", insertText: '"**/${1:name}": true', insertTextFormat: InsertTextFormat.Snippet, documentation: "Match a folder with a specific name in any location."},
];

let globValues: CompletionItem[] = [
    { kind: CompletionItemKind.Value, label: "true", filterText: 'true', insertText: 'true', documentation: "Enable the pattern."},
    { kind: CompletionItemKind.Value, label: "false", filterText: 'false', insertText: 'false', documentation: "Disable the pattern."},
    { kind: CompletionItemKind.Value, label: "Files with Siblings by Name", insertText: '{ "when": "$(basename).${1:extension}" }', insertTextFormat: InsertTextFormat.Snippet, documentation: "Match files that have siblings with the same name but a different extension."}
];

export class GlobPatternContribution implements JSONWorkerContribution {

    constructor() {
    }

    private isSettingsFile(resource: string): boolean {
        return _.endsWith(resource, '/settings.json');
    }

    public collectDefaultCompletions(resource: string, result: CompletionsCollector): Thenable<any> {
        return null!;
    }

    public collectPropertyCompletions(resource: string, location: JSONPath, currentWord: string, addValue: boolean, isLast: boolean, result: CompletionsCollector): Thenable<any> {
        if (this.isSettingsFile(resource) && location.length === 1 && ((location[0] === 'files.exclude') || (location[0] === 'search.exclude'))) {
            globProperties.forEach(e => {
                result.add(e);
            });
        }

        return null!;
    }

    public collectValueCompletions(resource: string, location: JSONPath, currentKey: string, result: CompletionsCollector): Thenable<any> {
        if (this.isSettingsFile(resource) && location.length === 1 && ((location[0] === 'files.exclude') || (location[0] === 'search.exclude'))) {
            globValues.forEach(e => {
                result.add(e);
            });
        }

        return null!;
    }

    public getInfoContribution(resource: string, location: JSONPath): Thenable<MarkedString[]> {
        return null!;
    }
}