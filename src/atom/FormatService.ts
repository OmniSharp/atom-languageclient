/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommandType, Format, IFormatProvider, IFormatService, Text } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { CompositeDisposable } from 'ts-disposables';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { atomConfig } from '../decorators';
import { AtomChanges } from './AtomChanges';
import { AtomCommands } from './AtomCommands';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { CommandsService } from './CommandsService';

@injectable()
@alias(IFormatService)
@atomConfig({
    default: true,
    description: 'Adds support for formating documents'
})
export class FormatService
    extends ProviderServiceBase<IFormatProvider, Format.IRequest, Observable<Text.IFileChange[]>, Observable<Text.IFileChange[]>>
    implements IFormatService {
    private _changes: AtomChanges;
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _source: AtomTextEditorSource;

    public constructor(changes: AtomChanges, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._changes = changes;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;

        this._disposable.add(
            this._commands.add(CommandType.TextEditor, `code-format`, 'ctrl-k ctrl-d', () => this.format(source.activeTextEditor)),
            this._atomCommands.add(CommandType.TextEditor, `format-document`, () => this.formatDocument(source.activeTextEditor)),
            this._atomCommands.add(CommandType.TextEditor, `format-range`, () => this.formatRange(source.activeTextEditor))
        );
    }

    public onEnabled() {
        return new CompositeDisposable(
            this._commands.add(CommandType.TextEditor, `code-format`, 'ctrl-k ctrl-d', () => this.format(this._source.activeTextEditor)),
            this._atomCommands.add(CommandType.TextEditor, `format-document`, () => this.formatDocument(this._source.activeTextEditor)),
            this._atomCommands.add(CommandType.TextEditor, `format-range`, () => this.formatRange(this._source.activeTextEditor))
        );
    }

    protected createInvoke(callbacks: (((options: Format.IRequest) => Observable<Text.IFileChange[]>)[])) {
        return (options: Format.IRequest) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce((acc, results) => _.compact(acc.concat(results)), []);
        };
    }

    public format(editor: Atom.TextEditor) {
        if (!editor) {
            return;
        }

        const ranges = editor.getSelectedBufferRanges();
        if (ranges.length) {
            this._formatRange(editor, ranges);
            return;
        }
        this.formatDocument(editor);
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

    private _formatRange(editor: Atom.TextEditor, ranges: TextBuffer.Range[]) {
        Observable.from(ranges)
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

    public formatRange(editor: Atom.TextEditor) {
        if (!editor) {
            return;
        }
        this._formatRange(editor, editor.getSelectedBufferRanges());
    }

}
