/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

export namespace CodeAction {
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
