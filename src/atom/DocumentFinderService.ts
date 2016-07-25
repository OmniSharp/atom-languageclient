/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { alias, injectable } from '../services/_decorators';
import { ProviderServiceBase } from './_ProviderServiceBase';
import { IDocumentFinderProvider, IDocumentFinderService } from '../services/_public';
import { AtomCommands } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';
import { DocumentFinderView } from './views/DocumentFinderView';

@injectable
@alias(IDocumentFinderService)
export class DocumentFinderService
    extends ProviderServiceBase<IDocumentFinderProvider, Atom.TextEditor, Observable<Finder.Symbol[]>, Observable<Finder.Symbol[]>>
    implements IDocumentFinderService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;
    }

    protected createInvoke(callbacks: ((options: Atom.TextEditor) => Observable<Finder.Symbol[]>)[]) {
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
        const activeEditor = atom.workspace.getActiveTextEditor();
        if (activeEditor) {
            const view = new DocumentFinderView(this._navigation, this.invoke(activeEditor));
        }
    }
}
