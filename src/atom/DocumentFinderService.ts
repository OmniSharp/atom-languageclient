/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommandType, Finder, IDocumentFinderProvider, IDocumentFinderService, KeymapPlatform, KeymapType } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { atomConfig } from '../decorators';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { CommandsService } from './CommandsService';
import { DocumentFinderView } from './views/DocumentFinderView';

@injectable
@alias(IDocumentFinderService)
@atomConfig({
    default: true,
    description: 'Adds support for showing document symbols'
})
export class DocumentFinderService
    extends ProviderServiceBase<IDocumentFinderProvider, Atom.TextEditor, Observable<Finder.IResponse[]>, Observable<Finder.IResponse[]>>
    implements IDocumentFinderService {
    private _navigation: AtomNavigation;
    private _commands: CommandsService;
    private _atomCommands: AtomCommands;
    private _source: AtomTextEditorSource;

    constructor(navigation: AtomNavigation, commands: CommandsService, atomCommands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._source = source;
    }

    public onEnabled() {
        return this._commands.add(CommandType.TextEditor, 'document-symbols', 'ctrl-shift-,', () => this.open());
    }

    protected createInvoke(callbacks: ((options: Atom.TextEditor) => Observable<Finder.IResponse[]>)[]) {
        return (options: Atom.TextEditor) => {
            return Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .scan(
                (acc, results) => {
                    _.each(results, result => {
                        result.filePath = atom.project.relativizePath(result.filePath)[1];
                    });
                    return acc.concat(results);
                },
                []);
        };
    }

    public open() {
        const activeEditor = this._source.activeTextEditor;
        if (activeEditor) {
            this._disposable.add(new DocumentFinderView(this._atomCommands, this._navigation, this.invoke(activeEditor)));
        }
    }
}
