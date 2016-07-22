/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { DisposableBase } from 'ts-disposables';
import { injectable } from '../di/decorators';
import { IDefinitionProvider, IDefinitionService } from '../services/_public';
import { AtomCommands, CommandType } from './AtomCommands';
import { AtomNavigation } from './AtomNavigation';

@injectable
export class DefinitionService extends DisposableBase implements IDefinitionService {
    private _navigation: AtomNavigation;
    private _commands: AtomCommands;
    private _providers = new Set<IDefinitionProvider>();

    constructor(navigation: AtomNavigation, commands: AtomCommands) {
        super();
        this._navigation = navigation;
        this._commands = commands;

        this._commands.add(CommandType.TextEditor, 'definition', () => this.open());
    }

    public registerProvider(provider: IDefinitionProvider) {
        this._providers.add(provider);
        this._disposable.add(provider);
    }

    public open() {
        const providers = _.toArray(this._providers);
        Promise.race(_.map(providers, provider => {
            return provider.response.take(1).toPromise();
        }))
        .then(location => {
            this._navigation.navigateTo(location);
        });
        _.each(providers, provider => provider.locate.next(atom.workspace.getActiveTextEditor()));
    }
}
