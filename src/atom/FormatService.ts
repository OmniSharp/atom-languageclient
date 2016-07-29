/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ATOM_COMMANDS, IFormatProvider, IFormatService, alias, injectable } from 'atom-languageservices';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomChanges } from './AtomChanges';
import { AtomCommands } from './AtomCommands';
import { AtomTextEditorSource } from './AtomTextEditorSource';

@injectable()
@alias(IFormatService)
export class FormatService
    extends ProviderServiceBase<IFormatProvider, (Format.DocumentOptions | Format.RangeOptions), Observable<Text.FileChange[]>, Observable<Text.FileChange[]>>
    implements IFormatService {
    private _changes: AtomChanges;
    private _commands: AtomCommands;
    private _source: AtomTextEditorSource;

    public constructor(changes: AtomChanges, commands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._changes = changes;
        this._commands = commands;
        this._source = source;

        this._disposable.add(
            this._commands.add(ATOM_COMMANDS.CommandType.TextEditor, `format-document`, () => this.formatDocument(source.activeTextEditor)),
            this._commands.add(ATOM_COMMANDS.CommandType.TextEditor, `format-range`, () => this.formatRange(source.activeTextEditor))
        );
    }

    protected createInvoke(callbacks: (((options: (Format.DocumentOptions | Format.RangeOptions)) => Observable<Text.FileChange[]>)[])) {
        return (options: (Format.DocumentOptions | Format.RangeOptions)) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce((acc, results) => _.compact(acc.concat(results)), []);
        };
    }

    public formatDocument(editor: Atom.TextEditor) {
        if (!editor) {
            return;
        }

        this.invoke({
            editor,
            insertSpaces: editor.usesSoftTabs(),
            tabSize: editor.getTabLength()
        }).subscribe(changes => {
            this._changes.applyChanges(editor, changes);
        });
    }

    public formatRange(editor: Atom.TextEditor) {
        Observable.from(editor.getSelectedScreenRanges())
            .concatMap(range => {
                return this.invoke({
                    editor, range,
                    insertSpaces: editor.usesSoftTabs(),
                    tabSize: editor.getTabLength()
                }).do(changes => {
                    this._changes.applyChanges(editor, changes);
                });
            })
            .subscribe();
    }

}
