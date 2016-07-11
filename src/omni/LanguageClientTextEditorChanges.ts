/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
export type AtomTextChange = { oldRange: TextBuffer.Range; newRange: TextBuffer.Range; oldText: string; newText: string; };

export class LanguageClientTextEditorChanges {
    private _changes: AtomTextChange[] = [];

    public push(change: AtomTextChange) {
        this._changes.push(change);
    }

    public pop() {
        if (!this._changes.length) {
            return [];
        }
        return this._changes.splice(0, this._changes.length);
    }

    public get any() { return !!this._changes.length; }
}
