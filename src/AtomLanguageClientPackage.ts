/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { CommandType, IAtomConfig, IAutocompleteService, ILanguageProvider, ILanguageService, ILinterService, IResolver, IStatusBarService, KeymapType, Linter, StatusBar } from 'atom-languageservices';
import { readdir } from 'fs';
import { join, resolve } from 'path';
import { CompositeDisposable, isDisposable } from 'ts-disposables';
import { AutocompleteService, LinterService, StatusBarService } from './atom/index';
import { packageName } from './constants';
import { LanguageProvider, LanguageService } from './language/index';
import { AtomCommands } from './atom/AtomCommands';
import { AtomConfig } from './atom/AtomConfig';
// import { AtomKeymaps } from './atom/AtomKeymaps';
import { AtomLanguageClientConfig } from './AtomLanguageClientConfig';
import { AtomLanguageClientSettings, IAtomLanguageClientSettings } from './AtomLanguageClientSettings';
import { Container } from './di/Container';
const atomPackageDeps: { install: (name: string) => Promise<void>; } = require('atom-package-deps');

const $readdir = Observable.bindNodeCallback(readdir);

export class AtomLanguageClientPackage implements IAtomPackage<AtomLanguageClientSettings> {
    private _container: Container;
    private _disposable: CompositeDisposable;
    private _packageConfig: AtomLanguageClientConfig;
    private _settings: AtomLanguageClientSettings;
    private _atomLanguageProvider: LanguageProvider;
    private _atomLanguageService: LanguageService;
    private _atomAutocompleteProvider: AutocompleteService;
    private _atomLinterProvider: LinterService;
    private _atomStatusBarService: StatusBarService;
    public activated: Promise<void>;

    constructor() {
        const atomConfig = new AtomConfig();
        this._packageConfig = new AtomLanguageClientConfig(atomConfig);
    }

    /* tslint:disable:no-any */
    public activate(settings: IAtomLanguageClientSettings) {
        this._container = new Container();
        this._disposable = new CompositeDisposable();
        this._settings = settings instanceof AtomLanguageClientSettings ? settings : new AtomLanguageClientSettings(settings);
        let resolveActivate: () => void;
        /* tslint:disable-next-line */
        const activated = new Promise<void>((resolve) => {
            resolveActivate = resolve;
        });

        this._atomLanguageProvider = new LanguageProvider(this._container, activated);
        this._atomLanguageService = new LanguageService(this._container);
        this._atomAutocompleteProvider = new AutocompleteService(this._packageConfig);
        this._atomLinterProvider = new LinterService();
        this._atomStatusBarService = new StatusBarService();

        this._container.registerInstance(AtomLanguageClientConfig, this._packageConfig);

        this._container.registerInstance(LanguageProvider, this._atomLanguageProvider);
        this._container.registerAlias(LanguageProvider, ILanguageProvider);

        this._container.registerInstance(LanguageService, this._atomLanguageService);
        this._container.registerAlias(LanguageService, ILanguageService);

        this._container.registerInstance(AutocompleteService, this._atomAutocompleteProvider);
        this._container.registerAlias(AutocompleteService, IAutocompleteService);

        this._container.registerInstance(LinterService, this._atomLinterProvider);
        this._container.registerAlias(LinterService, ILinterService);

        this._container.registerInstance(StatusBarService, this._atomStatusBarService);
        this._container.registerAlias(StatusBarService, IStatusBarService);

        this._container.registerInstance(IResolver, this._container);

        this._disposable.add(
            this._container,
            this._atomLanguageProvider,
            this._atomLanguageService
        );

        const activateServices =
            atomPackageDeps.install(packageName)
                .then(() =>
                    Observable.merge(
                        this._container.registerFolder(__dirname, 'atom'),
                        this._container.registerFolder(__dirname, 'capabilities'),
                        this._container.registerFolder(__dirname, 'services'),
                        this._container.registerFolder(__dirname, 'ui')
                    ).toPromise()
                )
                .then(() => {
                    this._container.registerInterfaceSymbols();
                })
                .then(() => resolveActivate());

        this.activated = activateServices;

        /* We're going to pretend to load these packages, as if they were real */
        this.activated.then(() => {
            const pathToPlugins = resolve(__dirname, '../', 'plugins');
            return $readdir(pathToPlugins)
                .mergeMap(folders => {
                    return Observable.from(folders)
                        .mergeMap(folder => $readdir(join(pathToPlugins, folder))
                            .mergeMap(files => files)
                            .filter(x => _.endsWith(x, 'Package.ts'))
                            .map(x => join(pathToPlugins, folder, _.trimEnd(x, '.ts'))))
                        /* tslint:disable-next-line:no-require-imports */
                        .map(path => require(path))
                        .map(module => {
                            const cls: { new (): any } = _.find(module, _.isFunction);
                            return new cls();
                        })
                        .map(instance => {
                            if (instance['consume-atom-language-client']) {
                                instance['consume-atom-language-client'](this._atomLanguageService);
                            }
                            if (instance['provide-atom-language']) {
                                this['consume-atom-language'](instance['provide-atom-language']());
                            }
                        });

                })
                .toPromise();
        });

        this.activated.then(() => {
            const commands = this._container.resolve(AtomCommands);
            commands.add(CommandType.Workspace, 'settings', () => {
                atom.workspace.open('atom://config/packages')
                    .then(tab => {
                        if (tab && tab.getURI && tab.getURI() !== `atom://config/packages/${packageName}`) {
                            atom.workspace.open(`atom://config/packages/${packageName}`);
                        }
                    });
            });
            // this._container.resolve(AtomKeymaps).add(KeymapType.Autocomplete, 'enter', 'autocomplete-plus:confirm');
            /* tslint:disable-next-line:no-require-imports */
            this._container.resolveEach(_.values(require('./ui/UserInterface')));
        });
    }

    /* tslint:disable-next-line:function-name */
    public ['provide-atom-language-client']() {
        return this._atomLanguageService;
    }

    /* tslint:disable-next-line:function-name */
    public ['provide-atom-autocomplete']() {
        return [this._atomAutocompleteProvider];
    }

    /* tslint:disable-next-line:function-name */
    public ['consume-atom-language'](services: ILanguageProvider | ILanguageProvider[]) {
        if (_.isArray(services)) {
            _.each(services, service => {
                this._atomLanguageProvider.add(service);
                if (isDisposable(service)) {
                    this._disposable.add(service);
                }
            });
        } else {
            this._atomLanguageProvider.add(services);
            if (isDisposable(services)) {
                this._disposable.add(services);
            }
        }
    }

    /* tslint:disable-next-line:function-name */
    public ['consume-atom-linter'](service: Linter.IndieRegistry) {
        this._atomLinterProvider.registry = service;
    }

    /* tslint:disable-next-line:function-name */
    public ['consume-status-bar'](service: StatusBar.Api) {
        this._atomStatusBarService.api = service;
    }

    public get config() {
        return this._packageConfig.schema;
    }

    /* tslint:disable-next-line:no-any */
    public static deserialize(state: IAtomLanguageClientSettings) {
        return new AtomLanguageClientSettings(state);
    }

    public serialize() {
        return this._settings.serialize(AtomLanguageClientPackage);
    }

    public deactivate() {
        this._disposable.dispose();
    }

    public static get version() { return 1; }
}

atom.deserializers.add(AtomLanguageClientPackage);
