/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

export namespace Text {
    export interface IFileChange {
        range: TextBuffer.Range;
        text: string;
    }
    export interface WorkspaceChange {
        filePath: string;
        changes: IFileChange[];
    }
}
