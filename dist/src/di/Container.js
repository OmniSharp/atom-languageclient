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
var interfaceRegex = /^I((?:[A-Z^I]))/;
var $readdir = rxjs_1.Observable.bindNodeCallback(fs_1.readdir);
var $exists = rxjs_1.Observable.bindCallback(fs_1.exists);
var Container = (function (_super) {
    __extends(Container, _super);
    function Container(container) {
        var _this = this;
        _super.call(this);
        this._capabilities = [];
        this._classNames = new Map();
        this._interfaceSymbols = new Map();
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
        var childContainer = new Container(childAureliaContainer);
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
        if (fn === undefined) {
            fn = key;
            key = fn;
        }
        var decoCapability = aurelia_metadata_1.metadata.get(symbols.capability, fn);
        if (decoCapability) {
            // Capabilities aren't registered now...
            this._capabilities.push({
                item: fn,
                params: fn.inject || aurelia_metadata_1.metadata.get(aurelia_metadata_1.metadata.paramTypes, fn)
            });
            return this;
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
            .map(function (x) { return x.item; })
            .value();
        _.each(capabilities, function (capability) {
            _this.registerTransient(capability);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGFpbmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RpL0NvbnRhaW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsOENBQThDO0FBQzlDLElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUVsQyxJQUFZLE9BQU8sV0FBTywrQkFBK0IsQ0FBQyxDQUFBO0FBQzFELDZDQUE4Qyw4QkFBOEIsQ0FBQyxDQUFBO0FBQzdFLGlDQUF5QixrQkFBa0IsQ0FBQyxDQUFBO0FBQzVDLDRCQUErQixhQUFhLENBQUMsQ0FBQTtBQUM3QyxtQkFBZ0MsSUFBSSxDQUFDLENBQUE7QUFDckMscUJBQXFCLE1BQU0sQ0FBQyxDQUFBO0FBQzVCLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBRWhELElBQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDO0FBQ3pDLElBQU0sUUFBUSxHQUFHLGlCQUFVLENBQUMsZ0JBQWdCLENBQUMsWUFBTyxDQUFDLENBQUM7QUFDdEQsSUFBTSxPQUFPLEdBQUcsaUJBQVUsQ0FBQyxZQUFZLENBQUMsV0FBTSxDQUFDLENBQUM7QUFPaEQ7SUFBK0IsNkJBQWM7SUFNekMsbUJBQW1CLFNBQTRCO1FBTm5ELGlCQTBMQztRQW5MTyxpQkFBTyxDQUFDO1FBTEosa0JBQWEsR0FBa0IsRUFBRSxDQUFDO1FBQ2xDLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQWUsQ0FBQztRQUNyQyxzQkFBaUIsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztRQUlsRCxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsSUFBSSxJQUFJLHdDQUFnQixFQUFFLENBQUM7UUFFdEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDWCxLQUFJLENBQUMsVUFBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQyxLQUFJLENBQUMsVUFBVyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDbkMsS0FBSSxDQUFDLFVBQVcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQ3ZDLEtBQUksQ0FBQyxVQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUMvQixLQUFJLENBQUMsVUFBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRWMsZ0JBQU0sR0FBckIsVUFBc0IsU0FBb0I7UUFDdEMsSUFBTSxxQkFBcUIsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pFLElBQU0sY0FBYyxHQUFHLElBQUksU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUQsY0FBYyxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUVNLGtDQUFjLEdBQXJCO1FBQUEsaUJBUUM7UUFScUIsZUFBa0I7YUFBbEIsV0FBa0IsQ0FBbEIsc0JBQWtCLENBQWxCLElBQWtCO1lBQWxCLDhCQUFrQjs7UUFDcEMsSUFBTSxJQUFJLEdBQUcsV0FBSSxlQUFJLEtBQUssQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2FBQ2YsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxFQUFELENBQUMsQ0FBQzthQUNkLFFBQVEsQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQzthQUN6QixHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLEVBRHRDLENBQ3NDLENBQ3JEO2FBQ0EsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVNLG9DQUFnQixHQUF2QixVQUF3QixHQUFRLEVBQUUsUUFBYTtRQUMzQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFJTSxxQ0FBaUIsR0FBeEIsVUFBeUIsR0FBUSxFQUFFLEVBQWE7UUFDNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBSU0scUNBQWlCLEdBQXhCLFVBQXlCLEdBQVEsRUFBRSxFQUFhO1FBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLGlDQUFhLEdBQXBCLFVBQXFCLFdBQWdCLEVBQUUsUUFBYTtRQUNoRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFJTSxnQ0FBWSxHQUFuQixVQUFvQixHQUFRLEVBQUUsRUFBYTtRQUN2QyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNuQixFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQ1QsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLENBQUM7UUFFRCxJQUFNLGNBQWMsR0FBRywyQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUcsQ0FBQyxDQUFDO1FBQzdELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakIsd0NBQXdDO1lBQ3hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO2dCQUNwQixJQUFJLEVBQUUsRUFBRTtnQkFDUixNQUFNLEVBQWUsRUFBRyxDQUFDLE1BQU0sSUFBUywyQkFBUSxDQUFDLEdBQUcsQ0FBQywyQkFBUSxDQUFDLFVBQVUsRUFBRSxFQUFHLENBQUM7YUFDakYsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBTSxRQUFRLEdBQUcsMkJBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFHLENBQUMsQ0FBQztRQUNsRCxJQUFNLE9BQU8sR0FBRywyQkFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUcsQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sbUNBQWUsR0FBdEIsVUFBdUIsR0FBVSxFQUFFLEdBQVM7UUFBNUMsaUJBT0M7UUFORyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFJTSwyQkFBTyxHQUFkLFVBQWtCLEdBQWlDO1FBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0sOEJBQVUsR0FBakIsVUFBcUIsR0FBUTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLCtCQUFXLEdBQWxCLFVBQW1CLEtBQVk7UUFBL0IsaUJBUUM7UUFQRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBQSxJQUFJO1lBQ3BCLElBQUksQ0FBQztnQkFDRCxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFFO1lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsNEJBQWMsQ0FBQyx3QkFBcUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSwrQkFBVyxHQUFsQjtRQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSx3Q0FBb0IsR0FBM0IsVUFBNEIsR0FBUTtRQUFwQyxpQkFXQztRQVZHLElBQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO2FBQ3JDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBekIsQ0FBeUIsQ0FBQzthQUN0QyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsSUFBSSxFQUFOLENBQU0sQ0FBQzthQUNoQixLQUFLLEVBQUUsQ0FBQztRQUViLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQUEsVUFBVTtZQUMzQixLQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFTSw0Q0FBd0IsR0FBL0I7UUFBQSxpQkFNQztRQUxHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUc7WUFDaEMsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8scUNBQWlCLEdBQXpCLFVBQTBCLFFBQWdCLEVBQUUsS0FBZTtRQUEzRCxpQkE4QkM7UUE3QkcsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7YUFDMUIsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQXZCLENBQXVCLENBQUM7YUFDdkMsTUFBTSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQzthQUN4QyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFHLFFBQVEsU0FBSSxJQUFJLENBQUUsRUFBckIsQ0FBcUIsQ0FBQzthQUNsQyxHQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQWIsQ0FBYSxDQUFDO2FBQzFCLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQUMsS0FBVSxFQUFFLEdBQVcsSUFBSyxPQUFBLENBQUMsRUFBRSxRQUFHLEVBQUUsWUFBSyxFQUFFLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxFQUF6RCxDQUF5RCxDQUFDO2FBQ3pFLE1BQU0sRUFBRSxDQUFDO1FBRWQsSUFBQTs7Ozs7Ozs7O29CQVNZLEVBVEwsbUJBQVcsRUFBRSxrQkFBVSxDQVNqQjtRQUViLEdBQUcsQ0FBQyxDQUFZLFVBQTJELEVBQTNELEtBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUEzRCxjQUEyRCxFQUEzRCxJQUEyRCxDQUFDO1lBQXZFLElBQU0sQ0FBQyxTQUFBO1lBQ1IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzVFO1FBRUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBQSxFQUFFO1lBQ2xCLEtBQUksQ0FBQyxZQUFZLENBQUMsMkJBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztRQUVILENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQUEsRUFBRSxJQUFJLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNMLGdCQUFDO0FBQUQsQ0FBQyxBQTFMRCxDQUErQiwrQkFBYyxHQTBMNUM7QUExTFksaUJBQVMsWUEwTHJCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1yZXF1aXJlLWltcG9ydHMgbm8tYW55ICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJUmVzb2x2ZXIgfSAgZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0ICogYXMgc3ltYm9scyAgZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3N5bWJvbHMnO1xyXG5pbXBvcnQgeyBDb250YWluZXIgYXMgQXVyZWxpYUNvbnRhaW5lciB9IGZyb20gJ2F1cmVsaWEtZGVwZW5kZW5jeS1pbmplY3Rpb24nO1xyXG5pbXBvcnQgeyBtZXRhZGF0YSB9IGZyb20gJ2F1cmVsaWEtbWV0YWRhdGEnO1xyXG5pbXBvcnQgeyBBZ2dyZWdhdGVFcnJvciB9IGZyb20gJ2F1cmVsaWEtcGFsJztcclxuaW1wb3J0IHsgZXhpc3RzLCByZWFkZGlyIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5cclxuY29uc3QgaW50ZXJmYWNlUmVnZXggPSAvXkkoKD86W0EtWl5JXSkpLztcclxuY29uc3QgJHJlYWRkaXIgPSBPYnNlcnZhYmxlLmJpbmROb2RlQ2FsbGJhY2socmVhZGRpcik7XHJcbmNvbnN0ICRleGlzdHMgPSBPYnNlcnZhYmxlLmJpbmRDYWxsYmFjayhleGlzdHMpO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2FwYWJpbGl0eSB7XHJcbiAgICBpdGVtOiBhbnk7XHJcbiAgICBwYXJhbXM6IGFueVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJUmVzb2x2ZXIge1xyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVyOiBBdXJlbGlhQ29udGFpbmVyO1xyXG4gICAgcHJpdmF0ZSBfY2FwYWJpbGl0aWVzOiBJQ2FwYWJpbGl0eVtdID0gW107XHJcbiAgICBwcml2YXRlIF9jbGFzc05hbWVzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuICAgIHByaXZhdGUgX2ludGVyZmFjZVN5bWJvbHMgPSBuZXcgTWFwPHN0cmluZywgc3ltYm9sPigpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb250YWluZXI/OiBBdXJlbGlhQ29udGFpbmVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXIgfHwgbmV3IEF1cmVsaWFDb250YWluZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoKCkgPT4ge1xyXG4gICAgICAgICAgICAoPGFueT50aGlzLl9jb250YWluZXIpLl9yZXNvbHZlcnMuY2xlYXIoKTtcclxuICAgICAgICAgICAgKDxhbnk+dGhpcy5fY29udGFpbmVyKS5fcmVzb2x2ZXJzID0gbnVsbDtcclxuICAgICAgICAgICAgKDxhbnk+dGhpcy5fY29udGFpbmVyKS5fY29uZmlndXJhdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgICg8YW55PnRoaXMuX2NvbnRhaW5lcikucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgKDxhbnk+dGhpcy5fY29udGFpbmVyKS5yb290ID0gbnVsbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfY2hpbGQoY29udGFpbmVyOiBDb250YWluZXIpIHtcclxuICAgICAgICBjb25zdCBjaGlsZEF1cmVsaWFDb250YWluZXIgPSBjb250YWluZXIuX2NvbnRhaW5lci5jcmVhdGVDaGlsZCgpO1xyXG4gICAgICAgIGNvbnN0IGNoaWxkQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcihjaGlsZEF1cmVsaWFDb250YWluZXIpO1xyXG4gICAgICAgIGNoaWxkQ29udGFpbmVyLl9jYXBhYmlsaXRpZXMgPSBjb250YWluZXIuX2NhcGFiaWxpdGllcztcclxuICAgICAgICByZXR1cm4gY2hpbGRDb250YWluZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyRm9sZGVyKC4uLnBhdGhzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGNvbnN0IHBhdGggPSBqb2luKC4uLnBhdGhzKTtcclxuICAgICAgICByZXR1cm4gJGV4aXN0cyhwYXRoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geClcclxuICAgICAgICAgICAgLm1lcmdlTWFwKCgpID0+ICRyZWFkZGlyKHBhdGgpXHJcbiAgICAgICAgICAgICAgICAubWFwKGZpbGVzID0+IHRoaXMuX3JlZ2lzdGVyU2VydmljZXMocGF0aCwgZmlsZXMpKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC50b1Byb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJJbnN0YW5jZShrZXk6IGFueSwgaW5zdGFuY2U6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZWdpc3Rlckluc3RhbmNlKGtleSwgaW5zdGFuY2UpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlclNpbmdsZXRvbihmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyU2luZ2xldG9uKGtleTogYW55LCBmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyU2luZ2xldG9uKGtleTogYW55LCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVyU2luZ2xldG9uKGtleSwgZm4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlclRyYW5zaWVudChmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyVHJhbnNpZW50KGtleTogYW55LCBmbjogRnVuY3Rpb24pOiB0aGlzO1xyXG4gICAgcHVibGljIHJlZ2lzdGVyVHJhbnNpZW50KGtleTogYW55LCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlZ2lzdGVyVHJhbnNpZW50KGtleSwgZm4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlckFsaWFzKG9yaWdpbmFsS2V5OiBhbnksIGFsaWFzS2V5OiBhbnkpIHtcclxuICAgICAgICBpZiAob3JpZ2luYWxLZXkubmFtZSAmJiB0aGlzLl9pbnRlcmZhY2VTeW1ib2xzLmhhcyhvcmlnaW5hbEtleS5uYW1lKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faW50ZXJmYWNlU3ltYm9scy5nZXQob3JpZ2luYWxLZXkubmFtZSkgIT09IGFsaWFzS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcmZhY2VTeW1ib2xzLmRlbGV0ZShvcmlnaW5hbEtleS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb250YWluZXIucmVnaXN0ZXJBbGlhcyhvcmlnaW5hbEtleSwgYWxpYXNLZXkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhdXRvUmVnaXN0ZXIoZm46IEZ1bmN0aW9uKTogdGhpcztcclxuICAgIHB1YmxpYyBhdXRvUmVnaXN0ZXIoa2V5OiBzdHJpbmcgfCBzeW1ib2wgfCBPYmplY3QsIGZuOiBGdW5jdGlvbik6IHRoaXM7XHJcbiAgICBwdWJsaWMgYXV0b1JlZ2lzdGVyKGtleTogYW55LCBmbj86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGZuID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm4gPSBrZXk7XHJcbiAgICAgICAgICAgIGtleSA9IGZuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGVjb0NhcGFiaWxpdHkgPSBtZXRhZGF0YS5nZXQoc3ltYm9scy5jYXBhYmlsaXR5LCBmbiEpO1xyXG4gICAgICAgIGlmIChkZWNvQ2FwYWJpbGl0eSkge1xyXG4gICAgICAgICAgICAvLyBDYXBhYmlsaXRpZXMgYXJlbid0IHJlZ2lzdGVyZWQgbm93Li4uXHJcbiAgICAgICAgICAgIHRoaXMuX2NhcGFiaWxpdGllcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGl0ZW06IGZuLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiA8YW55W10+KDxhbnk+Zm4pLmluamVjdCB8fCA8YW55Pm1ldGFkYXRhLmdldChtZXRhZGF0YS5wYXJhbVR5cGVzLCBmbiEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFsaWFzS2V5ID0gbWV0YWRhdGEuZ2V0KHN5bWJvbHMuYWxpYXMsIGZuISk7XHJcbiAgICAgICAgY29uc3QgZGVjb0tleSA9IG1ldGFkYXRhLmdldChzeW1ib2xzLmtleSwgZm4hKTtcclxuICAgICAgICBpZiAoZGVjb0tleSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuYXV0b1JlZ2lzdGVyKGRlY29LZXksIGZuKTtcclxuICAgICAgICAgICAgaWYgKGFsaWFzS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZ2lzdGVyQWxpYXMoZGVjb0tleSwgYWxpYXNLZXkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hdXRvUmVnaXN0ZXIoa2V5LCBmbik7XHJcbiAgICAgICAgaWYgKGFsaWFzS2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJBbGlhcyhrZXksIGFsaWFzS2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF1dG9SZWdpc3RlckFsbChmbnM6IGFueVtdLCBrZXk/OiBhbnkpIHtcclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIF8uZWFjaChmbnMsIGZuID0+IHRoaXMuYXV0b1JlZ2lzdGVyKGZuLCBrZXkpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLmVhY2goZm5zLCBmbiA9PiB0aGlzLmF1dG9SZWdpc3RlcihmbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzb2x2ZTxUPihrZXk6IHsgbmV3ICguLi5hcmdzOiBhbnlbXSk6IFQ7IH0pOiBUO1xyXG4gICAgcHVibGljIHJlc29sdmU8VD4oa2V5OiBhbnkpOiBUO1xyXG4gICAgcHVibGljIHJlc29sdmU8VD4oa2V5OiB7IG5ldyAoLi4uYXJnczogYW55W10pOiBUOyB9KTogVCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5nZXQoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzb2x2ZUFsbDxUPihrZXk6IGFueSk6IFRbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5nZXRBbGwoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzb2x2ZUVhY2goaXRlbXM6IGFueVtdKTogYW55W10ge1xyXG4gICAgICAgIHJldHVybiBfLm1hcChpdGVtcywgaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQWdncmVnYXRlRXJyb3IoYENvdWxkIG5vdCByZXNvbHZlICR7aXRlbS5uYW1lID8gaXRlbS5uYW1lIDogaXRlbX1gLCBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDaGlsZCgpIHtcclxuICAgICAgICByZXR1cm4gQ29udGFpbmVyLl9jaGlsZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJDYXBhYmlsaXRpZXMoa2V5OiBhbnkpOiBhbnlbXSB7XHJcbiAgICAgICAgY29uc3QgY2FwYWJpbGl0aWVzID0gXyh0aGlzLl9jYXBhYmlsaXRpZXMpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiBfLmluY2x1ZGVzKHgucGFyYW1zLCBrZXkpKVxyXG4gICAgICAgICAgICAubWFwKHggPT4geC5pdGVtKVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuXHJcbiAgICAgICAgXy5lYWNoKGNhcGFiaWxpdGllcywgY2FwYWJpbGl0eSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJUcmFuc2llbnQoY2FwYWJpbGl0eSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBjYXBhYmlsaXRpZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVySW50ZXJmYWNlU3ltYm9scygpIHtcclxuICAgICAgICB0aGlzLl9jbGFzc05hbWVzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ludGVyZmFjZVN5bWJvbHMuaGFzKGtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJBbGlhcyh2YWx1ZSwgdGhpcy5faW50ZXJmYWNlU3ltYm9scy5nZXQoa2V5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZWdpc3RlclNlcnZpY2VzKGZyb21QYXRoOiBzdHJpbmcsIGZpbGVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2VzID0gXy5jaGFpbihmaWxlcylcclxuICAgICAgICAgICAgLmZpbHRlcihmaWxlID0+IF8uZW5kc1dpdGgoZmlsZSwgJy5qcycpKVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZpbGUgPT4gIV8uc3RhcnRzV2l0aChmaWxlLCAnXycpKVxyXG4gICAgICAgICAgICAubWFwKGZpbGUgPT4gYCR7ZnJvbVBhdGh9LyR7ZmlsZX1gKVxyXG4gICAgICAgICAgICAubWFwKHBhdGggPT4gcmVxdWlyZShwYXRoKSlcclxuICAgICAgICAgICAgLmZsYXRNYXAob2JqID0+IF8ubWFwKG9iaiwgKHZhbHVlOiBhbnksIGtleTogc3RyaW5nKSA9PiAoeyBrZXksIHZhbHVlIH0pKSlcclxuICAgICAgICAgICAgLmNvbW1pdCgpO1xyXG5cclxuICAgICAgICBjb25zdCBbc3BlY2lhbEtleXMsIG5vcm1hbEtleXNdID0gc2VydmljZXNcclxuICAgICAgICAgICAgLmZpbHRlcih4ID0+ICF4LmtleS5tYXRjaChpbnRlcmZhY2VSZWdleCkpXHJcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4LnZhbHVlKVxyXG4gICAgICAgICAgICAuZWFjaChmbiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm4ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NsYXNzTmFtZXMuc2V0KGZuLm5hbWUsIGZuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnBhcnRpdGlvbihmbiA9PiAhIW1ldGFkYXRhLmdldChzeW1ib2xzLmtleSwgZm4pKVxyXG4gICAgICAgICAgICAudmFsdWUoKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCB4IG9mIHNlcnZpY2VzLmZpbHRlcih4ID0+ICEheC5rZXkubWF0Y2goaW50ZXJmYWNlUmVnZXgpKS52YWx1ZSgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ludGVyZmFjZVN5bWJvbHMuc2V0KHgua2V5LnJlcGxhY2UoaW50ZXJmYWNlUmVnZXgsICckMScpLCB4LnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uZWFjaChzcGVjaWFsS2V5cywgZm4gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9SZWdpc3RlcihtZXRhZGF0YS5nZXQoc3ltYm9scy5rZXksIGZuKSwgZm4pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfLmVhY2gobm9ybWFsS2V5cywgZm4gPT4gdGhpcy5hdXRvUmVnaXN0ZXIoZm4pKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iXX0=