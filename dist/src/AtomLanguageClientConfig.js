"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var _ = require('lodash');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var constants_1 = require('./constants');
var AtomConfig_1 = require('./atom/AtomConfig');
var AtomLanguageClientConfig = (function (_super) {
    __extends(AtomLanguageClientConfig, _super);
    function AtomLanguageClientConfig(atomConfig) {
        var _this = this;
        _super.call(this);
        this._settings = new Map();
        this._sections = new Map();
        this._services = new Map();
        this._configure = new Map();
        this._schema = {};
        this._update = _.debounce(function () {
            _this._configure.forEach(function (value, name) {
                var disposable = null;
                var feature = value();
                if (!feature.onEnabled) {
                    _this._services.delete(name.split('.')[1]);
                    return;
                }
                _this._disposable.add(_this._atomConfig.observe(name)
                    .subscribe(function (enabled) {
                    if (enabled && !disposable) {
                        disposable = feature.onEnabled();
                    }
                    else if (!enabled && disposable) {
                        disposable.dispose();
                        disposable = null;
                    }
                }));
            });
            _this._configure.clear();
            var properties = {};
            _this._settings.forEach(function (setting, key) {
                properties[key] = setting;
            });
            var serviceProperties = {};
            _this._services.forEach(function (setting, key) {
                serviceProperties[key] = setting;
            });
            _this._sections.forEach(function (setting, key) {
                properties[key] = setting;
            });
            properties['services'] = {
                type: 'object',
                properties: serviceProperties
            };
            _this._schema = properties;
            _this._atomConfig.setSchema(constants_1.packageName, {
                type: 'object',
                properties: properties
            });
        }, 1000);
        this._atomConfig = atomConfig;
        this.add('developerMode', {
            title: 'Developer Mode',
            description: 'Outputs detailed server calls in console.log',
            type: 'boolean',
            default: false
        });
    }
    AtomLanguageClientConfig.prototype.add = function (name, setting) {
        this._settings.set(name, setting);
        this._update();
    };
    AtomLanguageClientConfig.prototype.addSection = function (name, setting) {
        if (name === 'services') {
            throw new Error();
        }
        this._sections.set(name, setting);
        this._update();
    };
    AtomLanguageClientConfig.prototype.addService = function (name, setting, service) {
        this._services.set(name, setting);
        this._configure.set("services." + name, service);
        this._update();
    };
    Object.defineProperty(AtomLanguageClientConfig.prototype, "schema", {
        get: function () { return this._schema; },
        enumerable: true,
        configurable: true
    });
    AtomLanguageClientConfig = __decorate([
        decorators_1.injectable, 
        __metadata('design:paramtypes', [AtomConfig_1.AtomConfig])
    ], AtomLanguageClientConfig);
    return AtomLanguageClientConfig;
}(ts_disposables_1.DisposableBase));
exports.AtomLanguageClientConfig = AtomLanguageClientConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUxhbmd1YWdlQ2xpZW50Q29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0F0b21MYW5ndWFnZUNsaWVudENvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFNUIsMkJBQTJCLGtDQUFrQyxDQUFDLENBQUE7QUFDOUQsK0JBQTRDLGdCQUFnQixDQUFDLENBQUE7QUFDN0QsMEJBQTRCLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLDJCQUEyQixtQkFBbUIsQ0FBQyxDQUFBO0FBRy9DO0lBQThDLDRDQUFjO0lBUXhELGtDQUFZLFVBQXNCO1FBUnRDLGlCQXdGQztRQS9FTyxpQkFBTyxDQUFDO1FBUEosY0FBUyxHQUFHLElBQUksR0FBRyxFQUErQixDQUFDO1FBQ25ELGNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBc0MsQ0FBQztRQUMxRCxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQStCLENBQUM7UUFDbkQsZUFBVSxHQUFHLElBQUksR0FBRyxFQUFnRCxDQUFDO1FBQ3JFLFlBQU8sR0FBOEMsRUFBRSxDQUFDO1FBb0N4RCxZQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUN6QixLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxJQUFJO2dCQUNoQyxJQUFJLFVBQVUsR0FBdUIsSUFBSSxDQUFDO2dCQUMxQyxJQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDckIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxNQUFNLENBQUM7Z0JBQ1gsQ0FB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QUMsR0FBRyxDQUFDLGNBQVksSUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsc0JBQVcsNENBQU07YUFBakIsY0FBc0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQXpDaEQ7UUFBQyx1QkFBVTs7Z0NBQUE7SUF5RlgsK0JBQUM7QUFBRCxDQUFDLEFBeEZELENBQThDLCtCQUFjLEdBd0YzRDtBQXhGWSxnQ0FBd0IsMkJBd0ZwQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBJQXRvbUNvbmZpZyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlLCBJRGlzcG9zYWJsZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IEF0b21Db25maWcgfSBmcm9tICcuL2F0b20vQXRvbUNvbmZpZyc7XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5leHBvcnQgY2xhc3MgQXRvbUxhbmd1YWdlQ2xpZW50Q29uZmlnIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfYXRvbUNvbmZpZzogQXRvbUNvbmZpZztcclxuICAgIHByaXZhdGUgX3NldHRpbmdzID0gbmV3IE1hcDxzdHJpbmcsIElBdG9tQ29uZmlnLlNldHRpbmc+KCk7XHJcbiAgICBwcml2YXRlIF9zZWN0aW9ucyA9IG5ldyBNYXA8c3RyaW5nLCBJQXRvbUNvbmZpZy5JT2JqZWN0U2V0dGluZz4oKTtcclxuICAgIHByaXZhdGUgX3NlcnZpY2VzID0gbmV3IE1hcDxzdHJpbmcsIElBdG9tQ29uZmlnLlNldHRpbmc+KCk7XHJcbiAgICBwcml2YXRlIF9jb25maWd1cmUgPSBuZXcgTWFwPHN0cmluZywgKCkgPT4geyBvbkVuYWJsZWQ/KCk6IElEaXNwb3NhYmxlOyB9PigpO1xyXG4gICAgcHJpdmF0ZSBfc2NoZW1hOiB7IFtpbmRleDogc3RyaW5nXTogSUF0b21Db25maWcuU2V0dGluZzsgfSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGF0b21Db25maWc6IEF0b21Db25maWcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2F0b21Db25maWcgPSBhdG9tQ29uZmlnO1xyXG5cclxuICAgICAgICB0aGlzLmFkZCgnZGV2ZWxvcGVyTW9kZScsIHtcclxuICAgICAgICAgICAgdGl0bGU6ICdEZXZlbG9wZXIgTW9kZScsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnT3V0cHV0cyBkZXRhaWxlZCBzZXJ2ZXIgY2FsbHMgaW4gY29uc29sZS5sb2cnLFxyXG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZChuYW1lOiBzdHJpbmcsIHNldHRpbmc6IElBdG9tQ29uZmlnLlNldHRpbmcpIHtcclxuICAgICAgICB0aGlzLl9zZXR0aW5ncy5zZXQobmFtZSwgc2V0dGluZyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRTZWN0aW9uKG5hbWU6IHN0cmluZywgc2V0dGluZzogSUF0b21Db25maWcuSU9iamVjdFNldHRpbmcpIHtcclxuICAgICAgICBpZiAobmFtZSA9PT0gJ3NlcnZpY2VzJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2VjdGlvbnMuc2V0KG5hbWUsIHNldHRpbmcpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRTZXJ2aWNlKG5hbWU6IHN0cmluZywgc2V0dGluZzogSUF0b21Db25maWcuU2V0dGluZywgc2VydmljZTogKCkgPT4geyBvbkVuYWJsZWQ/KCk6IElEaXNwb3NhYmxlOyB9KSB7XHJcbiAgICAgICAgdGhpcy5fc2VydmljZXMuc2V0KG5hbWUsIHNldHRpbmcpO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyZS5zZXQoYHNlcnZpY2VzLiR7bmFtZX1gLCBzZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLl91cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjaGVtYSgpIHsgcmV0dXJuIHRoaXMuX3NjaGVtYTsgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZSA9IF8uZGVib3VuY2UoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyZS5mb3JFYWNoKCh2YWx1ZSwgbmFtZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZGlzcG9zYWJsZTogSURpc3Bvc2FibGUgfCBudWxsID0gbnVsbDtcclxuICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9IHZhbHVlKCk7XHJcbiAgICAgICAgICAgIGlmICghZmVhdHVyZS5vbkVuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NlcnZpY2VzLmRlbGV0ZShuYW1lLnNwbGl0KCcuJylbMV0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXRvbUNvbmZpZy5vYnNlcnZlPGJvb2xlYW4+KG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShlbmFibGVkID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuYWJsZWQgJiYgIWRpc3Bvc2FibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3Bvc2FibGUgPSBmZWF0dXJlLm9uRW5hYmxlZCEoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghZW5hYmxlZCAmJiBkaXNwb3NhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3Bvc2FibGUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb25maWd1cmUuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvcGVydGllczogYW55ID0ge307XHJcbiAgICAgICAgdGhpcy5fc2V0dGluZ3MuZm9yRWFjaCgoc2V0dGluZywga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNba2V5XSA9IHNldHRpbmc7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcnZpY2VQcm9wZXJ0aWVzOiBhbnkgPSB7fTtcclxuICAgICAgICB0aGlzLl9zZXJ2aWNlcy5mb3JFYWNoKChzZXR0aW5nLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgc2VydmljZVByb3BlcnRpZXNba2V5XSA9IHNldHRpbmc7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3NlY3Rpb25zLmZvckVhY2goKHNldHRpbmcsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzW2tleV0gPSBzZXR0aW5nO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcm9wZXJ0aWVzWydzZXJ2aWNlcyddID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgICAgICAgcHJvcGVydGllczogc2VydmljZVByb3BlcnRpZXNcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3NjaGVtYSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgdGhpcy5fYXRvbUNvbmZpZy5zZXRTY2hlbWEocGFja2FnZU5hbWUsIHtcclxuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNcclxuICAgICAgICB9KTtcclxuICAgIH0sIDEwMDApO1xyXG59XHJcbiJdfQ==