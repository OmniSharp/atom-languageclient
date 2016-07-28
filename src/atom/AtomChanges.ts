/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { alias, injectable } from '../services/_decorators';
import { IAtomChanges } from '../services/_public';

@injectable
@alias(IAtomChanges)
export class AtomChanges implements IAtomChanges {
    public applyChanges(editor: Atom.TextEditor, buffer: string): void;
    public applyChanges(editor: Atom.TextEditor, changes: Text.FileChange[]): void;
    public applyChanges(editor: Atom.TextEditor, changes: string | Text.FileChange[]) {
        if (_.isString(changes)) {
            editor.setText(changes);
        } else {
            const changesArray = this._orderInReverse(changes);
            editor.transact(() => {
                const buffer = editor.getBuffer();
                _.each(changesArray, change => {
                    buffer.setTextInRange(change.range, change.text);
                });
            });
        }
    }

    public applyWorkspaceChanges(textChanges: Text.WorkspaceChange[]): Observable<void> {
        return Observable.from(textChanges)
            .concatMap(
            change => {
                return atom.workspace.open(change.filePath);
            },
            ({changes}, editor) => ({ changes, editor })
            )
            .do(({changes, editor}) => {
                this._resetPreviewTab(editor);
                this.applyChanges(editor, changes);
            })
            .reduce(_.noop, void 0);
    }

    private _resetPreviewTab(editor: Atom.TextEditor) {
        const pane: Atom.TextEditorPresenter = atom.views.getView(editor);
        if (pane) {
            const title = pane.querySelector('.title.temp');
            if (title) {
                title.classList.remove('temp');
            }

            const tab = pane.querySelector('.preview-tab.active');
            if (tab) {
                tab.classList.remove('preview-tab');
                /* tslint:disable-next-line:no-any */
                (<any>tab).isPreviewTab = false;
            }
        }
    }

    private _orderInReverse<T extends Text.FileChange>(changes: T[]) {
        return _.orderBy(changes, [result => result.range.start.row, result => result.range.start.column], ['desc', 'desc']);
    }
}
