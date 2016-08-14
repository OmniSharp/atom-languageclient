"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-require-imports no-any */
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var symbols = require('atom-languageservices/symbols');
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var aurelia_metadata_1 = require('aurelia-metadata');
var aurelia_pal_1 = require('aurelia-pal');
var fs_1 = require('fs');
var path_1 = require('path');
var ts_disposables_1 = require('ts-disposables');
var constants_1 = require('../constants');
var interfaceRegex = /^I((?:[A-Z^I]))/;
var $readdir = rxjs_1.Observable.bindNodeCallback(fs_1.readdir);
var $exists = rxjs_1.Observable.bindCallback(fs_1.exists);
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(config, container) {
        var _this = this;
        _super.call(this);
        this._capabilities = [];
        this._classNames = new Map();
        this._interfaceSymbols = new Map();
        this._config = config;
        this._container = container || new aurelia_dependency_injection_1.Container();
        this._disposable.add(function () {
            _this._container._resolvers.clear();
            _this._container._resolvers = null;
            _this._container._configuration = null;
            _this._container.parent = null;
            _this._container.root = null;
        });
    }
    Container._child = function (container) {
        var childAureliaContainer = container._container.createChild();
        var childContainer = new Container(container._config, childAureliaContainer);
        childContainer._capabilities = container._capabilities;
        return childContainer;
    };
    Container.prototype.registerFolder = function () {
        var _this = this;
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i - 0] = arguments[_i];
        }
        var path = path_1.join.apply(void 0, paths);
        return $exists(path)
            .filter(function (x) { return x; })
            .mergeMap(function () { return $readdir(path)
            .map(function (files) { return _this._registerServices(path, files); }); })
            .toPromise();
    };
    Container.prototype.registerInstance = function (key, instance) {
        this._container.registerInstance(key, instance);
        return this;
    };
    Container.prototype.registerSingleton = function (key, fn) {
        this._container.registerSingleton(key, fn);
        return this;
    };
    Container.prototype.registerTransient = function (key, fn) {
        this._container.registerTransient(key, fn);
        return this;
    };
    Container.prototype.registerAlias = function (originalKey, aliasKey) {
        if (originalKey.name && this._interfaceSymbols.has(originalKey.name)) {
            if (this._interfaceSymbols.get(originalKey.name) !== aliasKey) {
                this._interfaceSymbols.delete(originalKey.name);
            }
        }
        this._container.registerAlias(originalKey, aliasKey);
        return this;
    };
    Container.prototype.autoRegister = function (key, fn) {
        var _this = this;
        if (fn === undefined) {
            fn = key;
            key = fn;
        }
        var decoCapability = aurelia_metadata_1.metadata.get(symbols.capability, fn);
        if (decoCapability) {
            var isCompatible = aurelia_metadata_1.metadata.get(symbols.isCompatible, fn) || (function () { return true; });
            // Capabilities aren't registered now...
            this._capabilities.push({
                ctor: fn,
                isCompatible: isCompatible,
                params: fn.inject || aurelia_metadata_1.metadata.get(aurelia_metadata_1.metadata.paramTypes, fn)
            });
            return this;
        }
        if (this._config) {
            var configData = aurelia_metadata_1.metadata.get(constants_1.atomConfig, fn);
            if (configData) {
                configData.title = configData.title.replace(/\sService$/, '');
                configData.name = configData.name.replace(/Service$/, '');
                this._config.addService(configData.name, configData, function () { return _this.resolve(fn); });
            }
        }
        var aliasKey = aurelia_metadata_1.metadata.get(symbols.alias, fn);
        var decoKey = aurelia_metadata_1.metadata.get(symbols.key, fn);
        if (decoKey) {
            this._container.autoRegister(decoKey, fn);
            if (aliasKey) {
                this.registerAlias(decoKey, aliasKey);
            }
            return this;
        }
        this._container.autoRegister(key, fn);
        if (aliasKey) {
            this.registerAlias(key, aliasKey);
        }
        return this;
    };
    Container.prototype.autoRegisterAll = function (fns, key) {
        var _this = this;
        if (key) {
            _.each(fns, function (fn) { return _this.autoRegister(fn, key); });
        }
        else {
            _.each(fns, function (fn) { return _this.autoRegister(fn); });
        }
        return this;
    };
    Container.prototype.resolve = function (key) {
        return this._container.get(key);
    };
    Container.prototype.resolveAll = function (key) {
        return this._container.getAll(key);
    };
    Container.prototype.resolveEach = function (items) {
        var _this = this;
        return _.map(items, function (item) {
            try {
                return _this.resolve(item);
            }
            catch (e) {
                return aurelia_pal_1.AggregateError("Could not resolve " + (item.name ? item.name : item), e);
            }
        });
    };
    Container.prototype.createChild = function () {
        return Container._child(this);
    };
    Container.prototype.registerCapabilities = function (key) {
        var _this = this;
        var capabilities = _(this._capabilities)
            .filter(function (x) { return _.includes(x.params, key); })
            .value();
        _.each(capabilities, function (capability) {
            _this.registerTransient(capability.ctor);
        });
        return capabilities;
    };
    Container.prototype.registerInterfaceSymbols = function () {
        var _this = this;
        this._classNames.forEach(function (value, key) {
            if (_this._interfaceSymbols.has(key)) {
                _this.registerAlias(value, _this._interfaceSymbols.get(key));
            }
        });
    };
    Container.prototype._registerServices = function (fromPath, files) {
        var _this = this;
        var services = _.chain(files)
            .filter(function (file) { return _.endsWith(file, '.js'); })
            .filter(function (file) { return !_.startsWith(file, '_'); })
            .map(function (file) { return (fromPath + "/" + file); })
            .map(function (path) { return require(path); })
            .flatMap(function (obj) { return _.map(obj, function (value, key) { return ({ key: key, value: value }); }); })
            .commit();
        var _a = services
            .filter(function (x) { return !x.key.match(interfaceRegex); })
            .map(function (x) { return x.value; })
            .each(function (fn) {
            if (fn.name) {
                _this._classNames.set(fn.name, fn);
            }
        })
            .partition(function (fn) { return !!aurelia_metadata_1.metadata.get(symbols.key, fn); })
            .value(), specialKeys = _a[0], normalKeys = _a[1];
        for (var _i = 0, _b = services.filter(function (x) { return !!x.key.match(interfaceRegex); }).value(); _i < _b.length; _i++) {
            var x = _b[_i];
            this._interfaceSymbols.set(x.key.replace(interfaceRegex, '$1'), x.value);
        }
        _.each(specialKeys, function (fn) {
            _this.autoRegister(aurelia_metadata_1.metadata.get(symbols.key, fn), fn);
        });
        _.each(normalKeys, function (fn) { return _this.autoRegister(fn); });
        return this;
    };
    return Container;
}(ts_disposables_1.DisposableBase));
exports.Container = Container;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RpL0NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsOENBQThDO0FBQzlDLElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUVsQyxJQUFZLE9BQU8sV0FBTSwrQkFBK0IsQ0FBQyxDQUFBO0FBRXpELDZDQUE4Qyw4QkFBOEIsQ0FBQyxDQUFBO0FBQzdFLGlDQUF5QixrQkFBa0IsQ0FBQyxDQUFBO0FBQzVDLDRCQUErQixhQUFhLENBQUMsQ0FBQTtBQUM3QyxtQkFBZ0MsSUFBSSxDQUFDLENBQUE7QUFDckMscUJBQXFCLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELDBCQUEyQixjQUFjLENBQUMsQ0FBQTtBQUcxQyxJQUFNLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQztBQUN6QyxJQUFNLFFBQVEsR0FBRyxpQkFBVSxDQUFDLGdCQUFnQixDQUFDLFlBQU8sQ0FBQyxDQUFDO0FBQ3RELElBQU0sT0FBTyxHQUFHLGlCQUFVLENBQUMsWUFBWSxDQUFDLFdBQU0sQ0FBQyxDQUFDO0FBUWhEO0lBQStCLDZCQUFjO0lBT3pDLG1CQUFtQixNQUFpQyxFQUFFLFNBQTRCO1FBUHRGLGlCQXNNQztRQTlMTyxpQkFBTyxDQUFDO1FBTkosa0JBQWEsR0FBa0IsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztRQUNyQyxzQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQUtsRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsSUFBSSxJQUFJLHdDQUFnQixFQUFFLENBQUM7UUFFdEQsSUFBSSxDQUFDLFdBQVcsQ0FB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Q0FBQyxDQUFDO1FBQ3pELENBQUMsQ0FBQyxDQUFDO1FBRUgsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLEFBdE1ELENBQStCLCtCQUFjLEdBc001QztBQXRNWSxpQkFBUyxZQXNNckIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbi8qIHRzbGludDpkaXNhYmxlOm5vLXJlcXVpcmUtaW1wb3J0cyBuby1hbnkgKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElSZXNvbHZlciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCAqIGFzIHN5bWJvbHMgZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3N5bWJvbHMnO1xyXG5pbXBvcnQgeyBTZXJ2ZXJDYXBhYmlsaXRpZXMgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMtZXh0ZW5kZWQnO1xyXG5pbXBvcnQgeyBDb250YWluZXIgYXMgQXVyZWxpYUNvbnRhaW5lciB9IGZyb20gJ2F1cmVsaWEtZGVwZW5kZW5jeS1pbmplY3Rpb24nO1xyXG5pbXBvcnQgeyBtZXRhZGF0YSB9IGZyb20gJ2F1cmVsaWEtbWV0YWRhdGEnO1xyXG5pbXBvcnQgeyBBZ2dyZWdhdGVFcnJvciB9IGZyb20gJ2F1cmVsaWEtcGFsJztcclxuaW1wb3J0IHsgZXhpc3RzLCByZWFkZGlyIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBhdG9tQ29uZmlnIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgQXRvbUxhbmd1YWdlQ2xpZW50Q29uZmlnIH0gZnJvbSAnLi4vQXRvbUxhbmd1YWdlQ2xpZW50Q29uZmlnJztcclxuXHJcbmNvbnN0IGludGVyZmFjZVJlZ2V4ID0gL15JKCg/OltBLVpeSV0pKS87XHJcbmNvbnN0ICRyZWFkZGlyID0gT2JzZXJ2YWJsZS5iaW5kTm9kZUNhbGxiYWNrKHJlYWRkaXIpO1xyXG5jb25zdCAkZXhpc3RzID0gT2JzZXJ2YWJsZS5iaW5kQ2FsbGJhY2soZXhpc3RzKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNhcGFiaWxpdHkge1xyXG4gICAgY3RvcjogYW55O1xyXG4gICAgaXNDb21wYXRpYmxlOiAoc2VydmVyQ2FwYWJpbGl0aWVzOiBTZXJ2ZXJDYXBhYmlsaXRpZXMpID0+IGJvb2xlYW47XHJcbiAgICBwYXJhbXM6IGFueVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJUmVzb2x2ZXIge1xyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVyOiBBdXJlbGlhQ29udGFpbmVyO1xyXG4gICAgcHJpdmF0ZSBfY2FwYWJpbGl0aWVzOiBJQ2FwYWJpbGl0eVtdID0gW107XHJcbiAgICBwcml2YXRlIF9jbGFzc05hbWVzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuICAgIHByaXZhdGUgX2ludGVyZmFjZVN5bWJvbHMgPSBuZXcgTWFwPHN0cmluZywgc3ltYm9sPigpO1xyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBBdG9tTGFuZ3VhZ2VDbGllbnRDb25maWcgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZz86IEF0b21MYW5ndWFnZUNsaWVudENvbmZpZywgY29udGFpbmVyPzogQXVyZWxpYUNvbnRhaW5lcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lciB8fCBuZXcgQXVyZWxpYUNvbnRhaW5lcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICAgICg8YW55PnRoaXMuX2NvbnRhaW5lcikuX3Jlc29sdmVycy5jbGVhcigpO1xyXG4gICAgICAgICAgICAoPGFueT50aGlzLl9jb250YWluZXIpLl9yZXNvbHZlcnMgPSBudWxsO1xyXG4gICAgICAgICAgICAoPGFueT50aGlzLl9jb250YWluZXIpLl9jb25maWd1cmF0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgKDxhbnk+dGhpcy5fY29udGFpbmVyKS5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAoPGFueT50aGlzLl9jb250YWluZXIpLnJvb3QgPSBudWxsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIF9jaGlsZChjb250YWluZXI6IENvbnRhaW5lcikge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkQXVyZWxpYUNvbnRhaW5lciA9IGNvbnRhaW5lci5fY29udGFpbmVyLmNyZWF0ZUNoaWxkKCk7XHJcbiAgICAgICAgY29uc3QgY2hpbGRDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKGNvbnRhaW5lci5fY29uZmlnLCBjaGlsZEF1cmVsaWFDb250YWluZXIpO1xyXG4gICAgICAgIGNoaWxkQ29udGFpbmVyLl9jYXBhYmlsaXRpZXMgPSBjb250YWluZXIuX2NhcGFiaWxpdGllcztcclxuICAgICAgICByZXR1cm4gY2hpbGRDb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyRm9sZGVyKC4uLnBhdGhzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBqb2luKC4uLnBhdGhzKTtcclxuICAgICAgICByZXR1cm4gJGV4aXN0cyhwYXRoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geClcclxuICAgICAgICAgICAgLm1lcmdlTWFwKCgpID0+ICRyZWFkZGlyKHBhdGgpXHJcbiAgICAgICAgICAgICAgICAubWFwKGZpbGVzID0+IHRoaXMuX3JlZ2lzdGVyU2VydmljZXMocGF0aCwgZmlsZXMpKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC50b1Byb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJJbnN0YW5jZShrZXk6IGFueSwgaW5zdGFuY2U6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKGtleSwgaW5zdGFuY2UpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlclNpbmdsZXRvbihmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyU2luZ2xldG9uKGtleTogYW55LCBmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyU2luZ2xldG9uKGtleTogYW55LCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVyU2luZ2xldG9uKGtleSwgZm4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlclRyYW5zaWVudChmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyVHJhbnNpZW50KGtleTogYW55LCBmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyVHJhbnNpZW50KGtleTogYW55LCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVyVHJhbnNpZW50KGtleSwgZm4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckFsaWFzKG9yaWdpbmFsS2V5OiBhbnksIGFsaWFzS2V5OiBhbnkpIHtcclxuICAgICAgICBpZiAob3JpZ2luYWxLZXkubmFtZSAmJiB0aGlzLl9pbnRlcmZhY2VTeW1ib2xzLmhhcyhvcmlnaW5hbEtleS5uYW1lKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faW50ZXJmYWNlU3ltYm9scy5nZXQob3JpZ2luYWxLZXkubmFtZSkgIT09IGFsaWFzS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcmZhY2VTeW1ib2xzLmRlbGV0ZShvcmlnaW5hbEtleS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJBbGlhcyhvcmlnaW5hbEtleSwgYWxpYXNLZXkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhdXRvUmVnaXN0ZXIoZm46IEZ1bmN0aW9uKTogdGhpcztcclxuICAgIHB1YmxpYyBhdXRvUmVnaXN0ZXIoa2V5OiBzdHJpbmcgfCBzeW1ib2wgfCBPYmplY3QsIGZuOiBGdW5jdGlvbik6IHRoaXM7XHJcbiAgICBwdWJsaWMgYXV0b1JlZ2lzdGVyKGtleTogYW55LCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGZuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm4gPSBrZXk7XHJcbiAgICAgICAgICAgIGtleSA9IGZuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGVjb0NhcGFiaWxpdHkgPSBtZXRhZGF0YS5nZXQoc3ltYm9scy5jYXBhYmlsaXR5LCBmbiEpO1xyXG4gICAgICAgIGlmIChkZWNvQ2FwYWJpbGl0eSkge1xyXG4gICAgICAgICAgICBjb25zdCBpc0NvbXBhdGlibGUgPSA8YW55Pm1ldGFkYXRhLmdldChzeW1ib2xzLmlzQ29tcGF0aWJsZSwgZm4hKSB8fCAoKCkgPT4gdHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIENhcGFiaWxpdGllcyBhcmVuJ3QgcmVnaXN0ZXJlZCBub3cuLi5cclxuICAgICAgICAgICAgdGhpcy5fY2FwYWJpbGl0aWVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgY3RvcjogZm4sXHJcbiAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IDxhbnlbXT4oPGFueT5mbikuaW5qZWN0IHx8IDxhbnk+bWV0YWRhdGEuZ2V0KG1ldGFkYXRhLnBhcmFtVHlwZXMsIGZuISlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbmZpZykge1xyXG4gICAgICAgICAgICBjb25zdCBjb25maWdEYXRhOiB7IGRlc2NyaXB0aW9uOiBzdHJpbmc7IGRlZmF1bHQ6IGJvb2xlYW47IHRpdGxlOiBzdHJpbmc7IHR5cGU6ICdib29sZWFuJzsgbmFtZTogc3RyaW5nOyB9ID0gPGFueT5tZXRhZGF0YS5nZXQoYXRvbUNvbmZpZywgZm4hKTtcclxuICAgICAgICAgICAgaWYgKGNvbmZpZ0RhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ0RhdGEudGl0bGUgPSBjb25maWdEYXRhLnRpdGxlLnJlcGxhY2UoL1xcc1NlcnZpY2UkLywgJycpO1xyXG4gICAgICAgICAgICAgICAgY29uZmlnRGF0YS5uYW1lID0gY29uZmlnRGF0YS5uYW1lLnJlcGxhY2UoL1NlcnZpY2UkLywgJycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29uZmlnLmFkZFNlcnZpY2UoY29uZmlnRGF0YS5uYW1lLCBjb25maWdEYXRhLCAoKSA9PiB0aGlzLnJlc29sdmUoZm4hKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFsaWFzS2V5ID0gbWV0YWRhdGEuZ2V0KHN5bWJvbHMuYWxpYXMsIGZuISk7XHJcbiAgICAgICAgY29uc3QgZGVjb0tleSA9IG1ldGFkYXRhLmdldChzeW1ib2xzLmtleSwgZm4hKTtcclxuICAgICAgICBpZiAoZGVjb0tleSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuYXV0b1JlZ2lzdGVyKGRlY29LZXksIGZuKTtcclxuICAgICAgICAgICAgaWYgKGFsaWFzS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyQWxpYXMoZGVjb0tleSwgYWxpYXNLZXkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hdXRvUmVnaXN0ZXIoa2V5LCBmbik7XHJcbiAgICAgICAgaWYgKGFsaWFzS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJBbGlhcyhrZXksIGFsaWFzS2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF1dG9SZWdpc3RlckFsbChmbnM6IGFueVtdLCBrZXk/OiBhbnkpIHtcclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIF8uZWFjaChmbnMsIGZuID0+IHRoaXMuYXV0b1JlZ2lzdGVyKGZuLCBrZXkpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLmVhY2goZm5zLCBmbiA9PiB0aGlzLmF1dG9SZWdpc3RlcihmbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzb2x2ZTxUPihrZXk6IHsgbmV3ICguLi5hcmdzOiBhbnlbXSk6IFQ7IH0pOiBUO1xyXG4gICAgcHVibGljIHJlc29sdmU8VD4oa2V5OiBhbnkpOiBUO1xyXG4gICAgcHVibGljIHJlc29sdmU8VD4oa2V5OiB7IG5ldyAoLi4uYXJnczogYW55W10pOiBUOyB9KTogVCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5nZXQoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzb2x2ZUFsbDxUPihrZXk6IGFueSk6IFRbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5nZXRBbGwoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzb2x2ZUVhY2goaXRlbXM6IGFueVtdKTogYW55W10ge1xyXG4gICAgICAgIHJldHVybiBfLm1hcChpdGVtcywgaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQWdncmVnYXRlRXJyb3IoYENvdWxkIG5vdCByZXNvbHZlICR7aXRlbS5uYW1lID8gaXRlbS5uYW1lIDogaXRlbX1gLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDaGlsZCgpIHtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyLl9jaGlsZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJDYXBhYmlsaXRpZXMoa2V5OiBhbnkpOiB7IGN0b3I6IEZ1bmN0aW9uOyBpc0NvbXBhdGlibGU6IChzZXJ2ZXJDYXBhYmlsaXRpZXM6IFNlcnZlckNhcGFiaWxpdGllcykgPT4gYm9vbGVhbjsgfVtdIHtcclxuICAgICAgICBjb25zdCBjYXBhYmlsaXRpZXMgPSBfKHRoaXMuX2NhcGFiaWxpdGllcylcclxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IF8uaW5jbHVkZXMoeC5wYXJhbXMsIGtleSkpXHJcbiAgICAgICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgICBfLmVhY2goY2FwYWJpbGl0aWVzLCBjYXBhYmlsaXR5ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlclRyYW5zaWVudChjYXBhYmlsaXR5LmN0b3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gY2FwYWJpbGl0aWVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckludGVyZmFjZVN5bWJvbHMoKSB7XHJcbiAgICAgICAgdGhpcy5fY2xhc3NOYW1lcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbnRlcmZhY2VTeW1ib2xzLmhhcyhrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyQWxpYXModmFsdWUsIHRoaXMuX2ludGVyZmFjZVN5bWJvbHMuZ2V0KGtleSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVnaXN0ZXJTZXJ2aWNlcyhmcm9tUGF0aDogc3RyaW5nLCBmaWxlczogc3RyaW5nW10pIHtcclxuICAgICAgICBjb25zdCBzZXJ2aWNlcyA9IF8uY2hhaW4oZmlsZXMpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZmlsZSA9PiBfLmVuZHNXaXRoKGZpbGUsICcuanMnKSlcclxuICAgICAgICAgICAgLmZpbHRlcihmaWxlID0+ICFfLnN0YXJ0c1dpdGgoZmlsZSwgJ18nKSlcclxuICAgICAgICAgICAgLm1hcChmaWxlID0+IGAke2Zyb21QYXRofS8ke2ZpbGV9YClcclxuICAgICAgICAgICAgLm1hcChwYXRoID0+IHJlcXVpcmUocGF0aCkpXHJcbiAgICAgICAgICAgIC5mbGF0TWFwKG9iaiA9PiBfLm1hcChvYmosICh2YWx1ZTogYW55LCBrZXk6IHN0cmluZykgPT4gKHsga2V5LCB2YWx1ZSB9KSkpXHJcbiAgICAgICAgICAgIC5jb21taXQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgW3NwZWNpYWxLZXlzLCBub3JtYWxLZXlzXSA9IHNlcnZpY2VzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiAheC5rZXkubWF0Y2goaW50ZXJmYWNlUmVnZXgpKVxyXG4gICAgICAgICAgICAubWFwKHggPT4geC52YWx1ZSlcclxuICAgICAgICAgICAgLmVhY2goZm4gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGZuLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbGFzc05hbWVzLnNldChmbi5uYW1lLCBmbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5wYXJ0aXRpb24oZm4gPT4gISFtZXRhZGF0YS5nZXQoc3ltYm9scy5rZXksIGZuKSlcclxuICAgICAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgeCBvZiBzZXJ2aWNlcy5maWx0ZXIoeCA9PiAhIXgua2V5Lm1hdGNoKGludGVyZmFjZVJlZ2V4KSkudmFsdWUoKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcmZhY2VTeW1ib2xzLnNldCh4LmtleS5yZXBsYWNlKGludGVyZmFjZVJlZ2V4LCAnJDEnKSwgeC52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmVhY2goc3BlY2lhbEtleXMsIGZuID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hdXRvUmVnaXN0ZXIobWV0YWRhdGEuZ2V0KHN5bWJvbHMua2V5LCBmbiksIGZuKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy5lYWNoKG5vcm1hbEtleXMsIGZuID0+IHRoaXMuYXV0b1JlZ2lzdGVyKGZuKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuIl19