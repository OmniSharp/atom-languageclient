"use strict";
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var fs_1 = require('fs');
var path_1 = require('path');
var ts_disposables_1 = require('ts-disposables');
var index_1 = require('./atom/index');
var constants_1 = require('./constants');
var index_2 = require('./language/index');
var AtomCommands_1 = require('./atom/AtomCommands');
var AtomConfig_1 = require('./atom/AtomConfig');
// import { AtomKeymaps } from './atom/AtomKeymaps';
var AtomLanguageClientConfig_1 = require('./AtomLanguageClientConfig');
var AtomLanguageClientSettings_1 = require('./AtomLanguageClientSettings');
var Container_1 = require('./di/Container');
var atomPackageDeps = require('atom-package-deps');
var $readdir = rxjs_1.Observable.bindNodeCallback(fs_1.readdir);
var AtomLanguageClientPackage = (function () {
    function AtomLanguageClientPackage() {
        var atomConfig = new AtomConfig_1.AtomConfig();
        this._packageConfig = new AtomLanguageClientConfig_1.AtomLanguageClientConfig(atomConfig);
    }
    /* tslint:disable:no-any */
    AtomLanguageClientPackage.prototype.activate = function (settings) {
        var _this = this;
        this._container = new Container_1.Container(this._packageConfig);
        this._disposable = new ts_disposables_1.CompositeDisposable();
        this._settings = settings instanceof AtomLanguageClientSettings_1.AtomLanguageClientSettings ? settings : new AtomLanguageClientSettings_1.AtomLanguageClientSettings(settings);
        var resolveActivate;
        /* tslint:disable-next-line */
        var activated = new Promise(function (resolve) {
            resolveActivate = resolve;
        });
        this._atomLanguageProvider = new index_2.LanguageProvider(this._container, activated);
        this._atomLanguageService = new index_2.LanguageService(this._container);
        this._atomAutocompleteProvider = new index_1.AutocompleteService();
        this._atomLinterProvider = new index_1.LinterService();
        this._atomStatusBarService = new index_1.StatusBarService();
        this._container.registerInstance(AtomLanguageClientConfig_1.AtomLanguageClientConfig, this._packageConfig);
        this._container.registerInstance(index_2.LanguageProvider, this._atomLanguageProvider);
        this._container.registerAlias(index_2.LanguageProvider, atom_languageservices_1.ILanguageProvider);
        this._container.registerInstance(index_2.LanguageService, this._atomLanguageService);
        this._container.registerAlias(index_2.LanguageService, atom_languageservices_1.ILanguageService);
        this._container.registerInstance(index_1.AutocompleteService, this._atomAutocompleteProvider);
        this._container.registerAlias(index_1.AutocompleteService, atom_languageservices_1.IAutocompleteService);
        this._container.registerInstance(index_1.LinterService, this._atomLinterProvider);
        this._container.registerAlias(index_1.LinterService, atom_languageservices_1.ILinterService);
        this._container.registerInstance(index_1.StatusBarService, this._atomStatusBarService);
        this._container.registerAlias(index_1.StatusBarService, atom_languageservices_1.IStatusBarService);
        this._container.registerInstance(atom_languageservices_1.IResolver, this._container);
        this._disposable.add(this._container, this._atomLanguageProvider, this._atomLanguageService);
        var activateServices = atomPackageDeps.install(constants_1.packageName)
            .then(function () {
            return rxjs_1.Observable.merge(_this._container.registerFolder(__dirname, 'atom'), _this._container.registerFolder(__dirname, 'capabilities'), _this._container.registerFolder(__dirname, 'services'), _this._container.registerFolder(__dirname, 'ui')).toPromise();
        })
            .then(function () {
            _this._container.registerInterfaceSymbols();
        })
            .then(function () { return resolveActivate(); });
        this.activated = activateServices;
        /* We're going to pretend to load these packages, as if they were real */
        this.activated.then(function () {
            var pathToPlugins = path_1.resolve(__dirname, '../', 'plugins');
            return $readdir(pathToPlugins)
                .mergeMap(function (folders) {
                return rxjs_1.Observable.from(folders)
                    .mergeMap(function (folder) { return $readdir(path_1.join(pathToPlugins, folder))
                    .mergeMap(function (files) { return files; })
                    .filter(function (x) { return _.endsWith(x, 'Package.ts'); })
                    .map(function (x) { return path_1.join(pathToPlugins, folder, _.trimEnd(x, '.ts')); }); })
                    .map(function (path) { return require(path); })
                    .map(function (module) {
                    var cls = _.find(module, _.isFunction);
                    return new cls();
                })
                    .map(function (instance) {
                    if (instance['consume-atom-language-client']) {
                        instance['consume-atom-language-client'](_this._atomLanguageService);
                    }
                    if (instance['provide-atom-language']) {
                        _this['consume-atom-language'](instance['provide-atom-language']());
                    }
                });
            })
                .toPromise();
        });
        this.activated.then(function () {
            var commands = _this._container.resolve(AtomCommands_1.AtomCommands);
            commands.add(atom_languageservices_1.CommandType.Workspace, 'settings', function () {
                atom.workspace.open('atom://config/packages')
                    .then(function (tab) {
                    if (tab && tab.getURI && tab.getURI() !== "atom://config/packages/" + constants_1.packageName) {
                        atom.workspace.open("atom://config/packages/" + constants_1.packageName);
                    }
                });
            });
            // this._container.resolve(AtomKeymaps).add(KeymapType.Autocomplete, 'enter', 'autocomplete-plus:confirm');
            /* tslint:disable-next-line:no-require-imports */
            _this._container.resolveEach(_.values(require('./ui/UserInterface')));
        });
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageClientPackage.prototype['provide-atom-language-client'] = function () {
        return this._atomLanguageService;
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageClientPackage.prototype['provide-atom-autocomplete'] = function () {
        return [this._atomAutocompleteProvider];
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageClientPackage.prototype['consume-atom-language'] = function (services) {
        var _this = this;
        if (_.isArray(services)) {
            _.each(services, function (service) {
                _this._atomLanguageProvider.add(service);
                if (ts_disposables_1.isDisposable(service)) {
                    _this._disposable.add(service);
                }
            });
        }
        else {
            this._atomLanguageProvider.add(services);
            if (ts_disposables_1.isDisposable(services)) {
                this._disposable.add(services);
            }
        }
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageClientPackage.prototype['consume-atom-linter'] = function (service) {
        this._atomLinterProvider.registry = service;
    };
    /* tslint:disable-next-line:function-name */
    AtomLanguageClientPackage.prototype['consume-status-bar'] = function (service) {
        this._atomStatusBarService.api = service;
    };
    Object.defineProperty(AtomLanguageClientPackage.prototype, "config", {
        get: function () {
            return this._packageConfig.schema;
        },
        enumerable: true,
        configurable: true
    });
    /* tslint:disable-next-line:no-any */
    AtomLanguageClientPackage.deserialize = function (state) {
        return new AtomLanguageClientSettings_1.AtomLanguageClientSettings(state);
    };
    AtomLanguageClientPackage.prototype.serialize = function () {
        return this._settings.serialize(AtomLanguageClientPackage);
    };
    AtomLanguageClientPackage.prototype.deactivate = function () {
        this._disposable.dispose();
    };
    Object.defineProperty(AtomLanguageClientPackage, "version", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    return AtomLanguageClientPackage;
}());
exports.AtomLanguageClientPackage = AtomLanguageClientPackage;
atom.deserializers.add(AtomLanguageClientPackage);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUxhbmd1YWdlQ2xpZW50UGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9BdG9tTGFuZ3VhZ2VDbGllbnRQYWNrYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUFpTCx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3pNLG1CQUF3QixJQUFJLENBQUMsQ0FBQTtBQUM3QixxQkFBOEIsTUFBTSxDQUFDLENBQUE7QUFDckMsK0JBQWtELGdCQUFnQixDQUFDLENBQUE7QUFDbkUsc0JBQXFFLGNBQWMsQ0FBQyxDQUFBO0FBQ3BGLDBCQUE0QixhQUFhLENBQUMsQ0FBQTtBQUMxQyxzQkFBa0Qsa0JBQWtCLENBQUMsQ0FBQTtBQUNyRSw2QkFBNkIscUJBQXFCLENBQUMsQ0FBQTtBQUNuRCwyQkFBMkIsbUJBQW1CLENBQUMsQ0FBQTtBQUMvQyxvREFBb0Q7QUFDcEQseUNBQXlDLDRCQUE0QixDQUFDLENBQUE7QUFDdEUsMkNBQXdFLDhCQUE4QixDQUFDLENBQUE7QUFDdkcsMEJBQTBCLGdCQUFnQixDQUFDLENBQUE7QUFDM0MsSUFBTSxlQUFlLEdBQWtELE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBRXBHLElBQU0sUUFBUSxHQUFHLGlCQUFVLENBQUMsZ0JBQWdCLENBQUMsWUFBTyxDQUFDLENBQUM7QUFFdEQ7SUFZSTtRQUNJLElBQU0sVUFBVSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtREFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsMkJBQTJCO0lBQ3BCLDRDQUFRLEdBQWYsVUFBZ0IsUUFBcUM7UUFBckQsaUJBcUdDO1FBcEdHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxx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QUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ29tbWFuZFR5cGUsIElBdG9tQ29uZmlnLCBJQXV0b2NvbXBsZXRlU2VydmljZSwgSUxhbmd1YWdlUHJvdmlkZXIsIElMYW5ndWFnZVNlcnZpY2UsIElMaW50ZXJTZXJ2aWNlLCBJUmVzb2x2ZXIsIElTdGF0dXNCYXJTZXJ2aWNlLCBLZXltYXBUeXBlLCBMaW50ZXIsIFN0YXR1c0JhciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IHJlYWRkaXIgfSBmcm9tICdmcyc7XHJcbmltcG9ydCB7IGpvaW4sIHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgaXNEaXNwb3NhYmxlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBBdXRvY29tcGxldGVTZXJ2aWNlLCBMaW50ZXJTZXJ2aWNlLCBTdGF0dXNCYXJTZXJ2aWNlIH0gZnJvbSAnLi9hdG9tL2luZGV4JztcclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IExhbmd1YWdlUHJvdmlkZXIsIExhbmd1YWdlU2VydmljZSB9IGZyb20gJy4vbGFuZ3VhZ2UvaW5kZXgnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL2F0b20vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgQXRvbUNvbmZpZyB9IGZyb20gJy4vYXRvbS9BdG9tQ29uZmlnJztcclxuLy8gaW1wb3J0IHsgQXRvbUtleW1hcHMgfSBmcm9tICcuL2F0b20vQXRvbUtleW1hcHMnO1xyXG5pbXBvcnQgeyBBdG9tTGFuZ3VhZ2VDbGllbnRDb25maWcgfSBmcm9tICcuL0F0b21MYW5ndWFnZUNsaWVudENvbmZpZyc7XHJcbmltcG9ydCB7IEF0b21MYW5ndWFnZUNsaWVudFNldHRpbmdzLCBJQXRvbUxhbmd1YWdlQ2xpZW50U2V0dGluZ3MgfSBmcm9tICcuL0F0b21MYW5ndWFnZUNsaWVudFNldHRpbmdzJztcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAnLi9kaS9Db250YWluZXInO1xyXG5jb25zdCBhdG9tUGFja2FnZURlcHM6IHsgaW5zdGFsbDogKG5hbWU6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjsgfSA9IHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJyk7XHJcblxyXG5jb25zdCAkcmVhZGRpciA9IE9ic2VydmFibGUuYmluZE5vZGVDYWxsYmFjayhyZWFkZGlyKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBdG9tTGFuZ3VhZ2VDbGllbnRQYWNrYWdlIGltcGxlbWVudHMgSUF0b21QYWNrYWdlPEF0b21MYW5ndWFnZUNsaWVudFNldHRpbmdzPiB7XHJcbiAgICBwcml2YXRlIF9jb250YWluZXI6IENvbnRhaW5lcjtcclxuICAgIHByaXZhdGUgX2Rpc3Bvc2FibGU6IENvbXBvc2l0ZURpc3Bvc2FibGU7XHJcbiAgICBwcml2YXRlIF9wYWNrYWdlQ29uZmlnOiBBdG9tTGFuZ3VhZ2VDbGllbnRDb25maWc7XHJcbiAgICBwcml2YXRlIF9zZXR0aW5nczogQXRvbUxhbmd1YWdlQ2xpZW50U2V0dGluZ3M7XHJcbiAgICBwcml2YXRlIF9hdG9tTGFuZ3VhZ2VQcm92aWRlcjogTGFuZ3VhZ2VQcm92aWRlcjtcclxuICAgIHByaXZhdGUgX2F0b21MYW5ndWFnZVNlcnZpY2U6IExhbmd1YWdlU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21BdXRvY29tcGxldGVQcm92aWRlcjogQXV0b2NvbXBsZXRlU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21MaW50ZXJQcm92aWRlcjogTGludGVyU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21TdGF0dXNCYXJTZXJ2aWNlOiBTdGF0dXNCYXJTZXJ2aWNlO1xyXG4gICAgcHVibGljIGFjdGl2YXRlZDogUHJvbWlzZTx2b2lkPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBjb25zdCBhdG9tQ29uZmlnID0gbmV3IEF0b21Db25maWcoKTtcclxuICAgICAgICB0aGlzLl9wYWNrYWdlQ29uZmlnID0gbmV3IEF0b21MYW5ndWFnZUNsaWVudENvbmZpZyhhdG9tQ29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cclxuICAgIHB1YmxpYyBhY3RpdmF0ZShzZXR0aW5nczogSUF0b21MYW5ndWFnZUNsaWVudFNldHRpbmdzKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gbmV3IENvbnRhaW5lcih0aGlzLl9wYWNrYWdlQ29uZmlnKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuICAgICAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzIGluc3RhbmNlb2YgQXRvbUxhbmd1YWdlQ2xpZW50U2V0dGluZ3MgPyBzZXR0aW5ncyA6IG5ldyBBdG9tTGFuZ3VhZ2VDbGllbnRTZXR0aW5ncyhzZXR0aW5ncyk7XHJcbiAgICAgICAgbGV0IHJlc29sdmVBY3RpdmF0ZTogKCkgPT4gdm9pZDtcclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgKi9cclxuICAgICAgICBjb25zdCBhY3RpdmF0ZWQgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICByZXNvbHZlQWN0aXZhdGUgPSByZXNvbHZlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9hdG9tTGFuZ3VhZ2VQcm92aWRlciA9IG5ldyBMYW5ndWFnZVByb3ZpZGVyKHRoaXMuX2NvbnRhaW5lciwgYWN0aXZhdGVkKTtcclxuICAgICAgICB0aGlzLl9hdG9tTGFuZ3VhZ2VTZXJ2aWNlID0gbmV3IExhbmd1YWdlU2VydmljZSh0aGlzLl9jb250YWluZXIpO1xyXG4gICAgICAgIHRoaXMuX2F0b21BdXRvY29tcGxldGVQcm92aWRlciA9IG5ldyBBdXRvY29tcGxldGVTZXJ2aWNlKCk7XHJcbiAgICAgICAgdGhpcy5fYXRvbUxpbnRlclByb3ZpZGVyID0gbmV3IExpbnRlclNlcnZpY2UoKTtcclxuICAgICAgICB0aGlzLl9hdG9tU3RhdHVzQmFyU2VydmljZSA9IG5ldyBTdGF0dXNCYXJTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKEF0b21MYW5ndWFnZUNsaWVudENvbmZpZywgdGhpcy5fcGFja2FnZUNvbmZpZyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKExhbmd1YWdlUHJvdmlkZXIsIHRoaXMuX2F0b21MYW5ndWFnZVByb3ZpZGVyKTtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJBbGlhcyhMYW5ndWFnZVByb3ZpZGVyLCBJTGFuZ3VhZ2VQcm92aWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKExhbmd1YWdlU2VydmljZSwgdGhpcy5fYXRvbUxhbmd1YWdlU2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVyQWxpYXMoTGFuZ3VhZ2VTZXJ2aWNlLCBJTGFuZ3VhZ2VTZXJ2aWNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVySW5zdGFuY2UoQXV0b2NvbXBsZXRlU2VydmljZSwgdGhpcy5fYXRvbUF1dG9jb21wbGV0ZVByb3ZpZGVyKTtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJBbGlhcyhBdXRvY29tcGxldGVTZXJ2aWNlLCBJQXV0b2NvbXBsZXRlU2VydmljZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKExpbnRlclNlcnZpY2UsIHRoaXMuX2F0b21MaW50ZXJQcm92aWRlcik7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVyQWxpYXMoTGludGVyU2VydmljZSwgSUxpbnRlclNlcnZpY2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJJbnN0YW5jZShTdGF0dXNCYXJTZXJ2aWNlLCB0aGlzLl9hdG9tU3RhdHVzQmFyU2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVyQWxpYXMoU3RhdHVzQmFyU2VydmljZSwgSVN0YXR1c0JhclNlcnZpY2UpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJJbnN0YW5jZShJUmVzb2x2ZXIsIHRoaXMuX2NvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIsXHJcbiAgICAgICAgICAgIHRoaXMuX2F0b21MYW5ndWFnZVByb3ZpZGVyLFxyXG4gICAgICAgICAgICB0aGlzLl9hdG9tTGFuZ3VhZ2VTZXJ2aWNlXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgYWN0aXZhdGVTZXJ2aWNlcyA9XHJcbiAgICAgICAgICAgIGF0b21QYWNrYWdlRGVwcy5pbnN0YWxsKHBhY2thZ2VOYW1lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT5cclxuICAgICAgICAgICAgICAgICAgICBPYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJGb2xkZXIoX19kaXJuYW1lLCAnYXRvbScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJGb2xkZXIoX19kaXJuYW1lLCAnY2FwYWJpbGl0aWVzJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZWdpc3RlckZvbGRlcihfX2Rpcm5hbWUsICdzZXJ2aWNlcycpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJGb2xkZXIoX19kaXJuYW1lLCAndWknKVxyXG4gICAgICAgICAgICAgICAgICAgICkudG9Qcm9taXNlKClcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJJbnRlcmZhY2VTeW1ib2xzKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZUFjdGl2YXRlKCkpO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2YXRlZCA9IGFjdGl2YXRlU2VydmljZXM7XHJcblxyXG4gICAgICAgIC8qIFdlJ3JlIGdvaW5nIHRvIHByZXRlbmQgdG8gbG9hZCB0aGVzZSBwYWNrYWdlcywgYXMgaWYgdGhleSB3ZXJlIHJlYWwgKi9cclxuICAgICAgICB0aGlzLmFjdGl2YXRlZC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGF0aFRvUGx1Z2lucyA9IHJlc29sdmUoX19kaXJuYW1lLCAnLi4vJywgJ3BsdWdpbnMnKTtcclxuICAgICAgICAgICAgcmV0dXJuICRyZWFkZGlyKHBhdGhUb1BsdWdpbnMpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoZm9sZGVycyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbShmb2xkZXJzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWVyZ2VNYXAoZm9sZGVyID0+ICRyZWFkZGlyKGpvaW4ocGF0aFRvUGx1Z2lucywgZm9sZGVyKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tZXJnZU1hcChmaWxlcyA9PiBmaWxlcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiBfLmVuZHNXaXRoKHgsICdQYWNrYWdlLnRzJykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKHggPT4gam9pbihwYXRoVG9QbHVnaW5zLCBmb2xkZXIsIF8udHJpbUVuZCh4LCAnLnRzJykpKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXJlcXVpcmUtaW1wb3J0cyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHBhdGggPT4gcmVxdWlyZShwYXRoKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChtb2R1bGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xzOiB7IG5ldyAoKTogYW55IH0gPSBfLmZpbmQobW9kdWxlLCBfLmlzRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBjbHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChpbnN0YW5jZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2VbJ2NvbnN1bWUtYXRvbS1sYW5ndWFnZS1jbGllbnQnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlWydjb25zdW1lLWF0b20tbGFuZ3VhZ2UtY2xpZW50J10odGhpcy5fYXRvbUxhbmd1YWdlU2VydmljZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2VbJ3Byb3ZpZGUtYXRvbS1sYW5ndWFnZSddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1snY29uc3VtZS1hdG9tLWxhbmd1YWdlJ10oaW5zdGFuY2VbJ3Byb3ZpZGUtYXRvbS1sYW5ndWFnZSddKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRvUHJvbWlzZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFjdGl2YXRlZC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29tbWFuZHMgPSB0aGlzLl9jb250YWluZXIucmVzb2x2ZShBdG9tQ29tbWFuZHMpO1xyXG4gICAgICAgICAgICBjb21tYW5kcy5hZGQoQ29tbWFuZFR5cGUuV29ya3NwYWNlLCAnc2V0dGluZ3MnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vY29uZmlnL3BhY2thZ2VzJylcclxuICAgICAgICAgICAgICAgICAgICAudGhlbih0YWIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFiICYmIHRhYi5nZXRVUkkgJiYgdGFiLmdldFVSSSgpICE9PSBgYXRvbTovL2NvbmZpZy9wYWNrYWdlcy8ke3BhY2thZ2VOYW1lfWApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oYGF0b206Ly9jb25maWcvcGFja2FnZXMvJHtwYWNrYWdlTmFtZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gdGhpcy5fY29udGFpbmVyLnJlc29sdmUoQXRvbUtleW1hcHMpLmFkZChLZXltYXBUeXBlLkF1dG9jb21wbGV0ZSwgJ2VudGVyJywgJ2F1dG9jb21wbGV0ZS1wbHVzOmNvbmZpcm0nKTtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXJlcXVpcmUtaW1wb3J0cyAqL1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVzb2x2ZUVhY2goXy52YWx1ZXMocmVxdWlyZSgnLi91aS9Vc2VySW50ZXJmYWNlJykpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZnVuY3Rpb24tbmFtZSAqL1xyXG4gICAgcHVibGljIFsncHJvdmlkZS1hdG9tLWxhbmd1YWdlLWNsaWVudCddKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdG9tTGFuZ3VhZ2VTZXJ2aWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmdW5jdGlvbi1uYW1lICovXHJcbiAgICBwdWJsaWMgWydwcm92aWRlLWF0b20tYXV0b2NvbXBsZXRlJ10oKSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLl9hdG9tQXV0b2NvbXBsZXRlUHJvdmlkZXJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpmdW5jdGlvbi1uYW1lICovXHJcbiAgICBwdWJsaWMgWydjb25zdW1lLWF0b20tbGFuZ3VhZ2UnXShzZXJ2aWNlczogSUxhbmd1YWdlUHJvdmlkZXIgfCBJTGFuZ3VhZ2VQcm92aWRlcltdKSB7XHJcbiAgICAgICAgaWYgKF8uaXNBcnJheShzZXJ2aWNlcykpIHtcclxuICAgICAgICAgICAgXy5lYWNoKHNlcnZpY2VzLCBzZXJ2aWNlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2F0b21MYW5ndWFnZVByb3ZpZGVyLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0Rpc3Bvc2FibGUoc2VydmljZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYXRvbUxhbmd1YWdlUHJvdmlkZXIuYWRkKHNlcnZpY2VzKTtcclxuICAgICAgICAgICAgaWYgKGlzRGlzcG9zYWJsZShzZXJ2aWNlcykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2VzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZnVuY3Rpb24tbmFtZSAqL1xyXG4gICAgcHVibGljIFsnY29uc3VtZS1hdG9tLWxpbnRlciddKHNlcnZpY2U6IExpbnRlci5JbmRpZVJlZ2lzdHJ5KSB7XHJcbiAgICAgICAgdGhpcy5fYXRvbUxpbnRlclByb3ZpZGVyLnJlZ2lzdHJ5ID0gc2VydmljZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZnVuY3Rpb24tbmFtZSAqL1xyXG4gICAgcHVibGljIFsnY29uc3VtZS1zdGF0dXMtYmFyJ10oc2VydmljZTogU3RhdHVzQmFyLkFwaSkge1xyXG4gICAgICAgIHRoaXMuX2F0b21TdGF0dXNCYXJTZXJ2aWNlLmFwaSA9IHNlcnZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb25maWcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhY2thZ2VDb25maWcuc2NoZW1hO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVzZXJpYWxpemUoc3RhdGU6IElBdG9tTGFuZ3VhZ2VDbGllbnRTZXR0aW5ncykge1xyXG4gICAgICAgIHJldHVybiBuZXcgQXRvbUxhbmd1YWdlQ2xpZW50U2V0dGluZ3Moc3RhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXJpYWxpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzLnNlcmlhbGl6ZShBdG9tTGFuZ3VhZ2VDbGllbnRQYWNrYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpIHtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmRpc3Bvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCB2ZXJzaW9uKCkgeyByZXR1cm4gMTsgfVxyXG59XHJcblxyXG5hdG9tLmRlc2VyaWFsaXplcnMuYWRkKEF0b21MYW5ndWFnZUNsaWVudFBhY2thZ2UpO1xyXG4iXX0=