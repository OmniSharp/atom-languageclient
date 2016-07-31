/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Finder, IDocumentFinderProvider, IDocumentFinderService } from 'atom-languageservices';
import { alias, injectable } from 'atom-languageservices/decorators';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { AtomTextEditorSource } from './AtomTextEditorSource';
import { DocumentFinderView } from './views/DocumentFinderView';

@injectable
@alias(IDocumentFinderService)
export class DocumentFinderService
    extends ProviderServiceBase<IDocumentFinderProvider, Atom.TextEditor, Observable<Finder.IResponse[]>, Observable<Finder.IResponse[]>>
    implements IDocumentFinderService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _source: AtomTextEditorSource;

    constructor(navigation: AtomNavigation, commands: AtomCommands, source: AtomTextEditorSource) {
        super();
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
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
            this._disposable.add(new DocumentFinderView(this._commands, this._navigation, this.invoke(activeEditor)));
        }
    }
}
