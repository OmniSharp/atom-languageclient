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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var constants_1 = require('../constants');
var createObservable_1 = require('../helpers/createObservable');
var PrefixAtomConfig = (function (_super) {
    __extends(PrefixAtomConfig, _super);
    function PrefixAtomConfig(prefix) {
        _super.call(this);
        this._prefix = prefix;
    }
    PrefixAtomConfig.prototype.observe = function (path) {
        var _this = this;
        return createObservable_1.createObservable(function (observer) {
            var disposer = atom.config.observe(_this._getPath(path), function (value) {
                observer.next(value);
            });
            return function () { return disposer.dispose(); };
        }).publishReplay(1).refCount();
    };
    PrefixAtomConfig.prototype.onDidChange = function (path) {
        var _this = this;
        return createObservable_1.createObservable(function (observer) {
            var disposer = atom.config.onDidChange(_this._getPath(path), function (value) {
                observer.next(value);
            });
            return function () { return disposer.dispose(); };
        }).publishReplay(1).refCount()
            .startWith({ keyPath: this._getPath(path), oldValue: undefined, newValue: atom.config.get(this._getPath(path)) });
    };
    PrefixAtomConfig.prototype.get = function (path) {
        return atom.config.get(this._getPath(path));
    };
    PrefixAtomConfig.prototype.setSchema = function (packageName, schema) {
        atom.config.setSchema(packageName, schema);
    };
    PrefixAtomConfig.prototype.for = function (packageName) {
        var result = new PrefixAtomConfig(packageName);
        this._disposable.add(result);
        return result;
    };
    PrefixAtomConfig.prototype._getPath = function (key) {
        if (this._prefix) {
            return this._prefix + "." + key;
        }
        return key;
    };
    return PrefixAtomConfig;
}(ts_disposables_1.DisposableBase));
var AtomConfig = (function (_super) {
    __extends(AtomConfig, _super);
    function AtomConfig() {
        _super.call(this, constants_1.packageName);
    }
    AtomConfig = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomConfig), 
        __metadata('design:paramtypes', [])
    ], AtomConfig);
    return AtomConfig;
}(PrefixAtomConfig));
exports.AtomConfig = AtomConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL0F0b21Db25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILHNDQUE0Qix1QkFBdUIsQ0FBQyxDQUFBO0FBQ3BELDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JFLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELDBCQUE0QixjQUFjLENBQUMsQ0FBQTtBQUMzQyxpQ0FBaUMsNkJBQTZCLENBQUMsQ0FBQTtBQUUvRDtJQUErQixvQ0FBYztJQUV6QywwQkFBWSxNQUFjO1FBQ3RCLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRU0sa0NBQU8sR0FBZCxVQUFrQixJQUFZO1FBQTlCLGlCQVFDO1FBUEcsTUFBTSxDQUFDLG1DQUFnQixDQUFJLFVBQUEsUUFBUTtZQUMvQixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBSSxLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFVBQUMsS0FBSztnQkFDL0QsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFsQixDQUFrQixDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBR00sc0NBQVcsR0FBbEIsVUFBc0IsSUFBWTtRQUFsQyxpQkFTQztRQVJHLE1BQU0sQ0FBQyxtQ0FBZ0IsQ0FBaUQsVUFBQSxRQUFRO1lBQzVFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsVUFBQyxLQUFLO2dCQUNuRSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGNBQU0sT0FBQSxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQWxCLENBQWtCLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRTthQUM3QixTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQU8sU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlILENBQUM7SUFFTSw4QkFBRyxHQUFWLFVBQWMsSUFBWTtRQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFTSxvQ0FBUyxHQUFoQixVQUFpQixXQUFtQixFQUFFLE1BQWtDO1FBQzlELElBQUksQ0FBQyxNQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU0sOEJBQUcsR0FBVixVQUFXLFdBQW1CO1FBQzFCLElBQU0sTUFBTSxHQUFHLElBQUksZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU8sbUNBQVEsR0FBaEIsVUFBaUIsR0FBVztRQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sQ0FBSSxJQUFJLENBQUMsT0FBTyxTQUFJLEdBQUssQ0FBQztRQUNwQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFqREQsQ0FBK0IsK0JBQWMsR0FpRDVDO0FBSUQ7SUFBZ0MsOEJBQWdCO0lBQzVDO1FBQ0ksa0JBQU0sdUJBQVcsQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFMTDtRQUFDLHVCQUFVO1FBQ1Ysa0JBQUssQ0FBQyxtQ0FBVyxDQUFDOztrQkFBQTtJQUtuQixpQkFBQztBQUFELENBQUMsQUFKRCxDQUFnQyxnQkFBZ0IsR0FJL0M7QUFKWSxrQkFBVSxhQUl0QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgSUF0b21Db25maWcgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IHBhY2thZ2VOYW1lIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgY3JlYXRlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL2hlbHBlcnMvY3JlYXRlT2JzZXJ2YWJsZSc7XHJcblxyXG5jbGFzcyBQcmVmaXhBdG9tQ29uZmlnIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJQXRvbUNvbmZpZyB7XHJcbiAgICBwcml2YXRlIF9wcmVmaXg6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHByZWZpeDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9wcmVmaXggPSBwcmVmaXg7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ic2VydmU8VD4ocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0ZU9ic2VydmFibGU8VD4ob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkaXNwb3NlciA9IGF0b20uY29uZmlnLm9ic2VydmU8VD4odGhpcy5fZ2V0UGF0aChwYXRoKSwgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gZGlzcG9zZXIuZGlzcG9zZSgpO1xyXG4gICAgICAgIH0pLnB1Ymxpc2hSZXBsYXkoMSkucmVmQ291bnQoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIG9uRGlkQ2hhbmdlPFQ+KHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVPYnNlcnZhYmxlPHsga2V5UGF0aDogc3RyaW5nOyBvbGRWYWx1ZTogVDsgbmV3VmFsdWU6IFQ7IH0+KG9ic2VydmVyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZGlzcG9zZXIgPSBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZTxUPih0aGlzLl9nZXRQYXRoKHBhdGgpLCAodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiBkaXNwb3Nlci5kaXNwb3NlKCk7XHJcbiAgICAgICAgfSkucHVibGlzaFJlcGxheSgxKS5yZWZDb3VudCgpXHJcbiAgICAgICAgLnN0YXJ0V2l0aCh7IGtleVBhdGg6IHRoaXMuX2dldFBhdGgocGF0aCksIG9sZFZhbHVlOiA8YW55PnVuZGVmaW5lZCwgbmV3VmFsdWU6IGF0b20uY29uZmlnLmdldDxUPih0aGlzLl9nZXRQYXRoKHBhdGgpKSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0PFQ+KHBhdGg6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQ8VD4odGhpcy5fZ2V0UGF0aChwYXRoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFNjaGVtYShwYWNrYWdlTmFtZTogc3RyaW5nLCBzY2hlbWE6IElBdG9tQ29uZmlnLklPYmplY3RTZXR0aW5nKSB7XHJcbiAgICAgICAgKDxhbnk+YXRvbS5jb25maWcpLnNldFNjaGVtYShwYWNrYWdlTmFtZSwgc2NoZW1hKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9yKHBhY2thZ2VOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBuZXcgUHJlZml4QXRvbUNvbmZpZyhwYWNrYWdlTmFtZSk7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQocmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFBhdGgoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5fcHJlZml4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLl9wcmVmaXh9LiR7a2V5fWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhJQXRvbUNvbmZpZylcclxuZXhwb3J0IGNsYXNzIEF0b21Db25maWcgZXh0ZW5kcyBQcmVmaXhBdG9tQ29uZmlnIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKHBhY2thZ2VOYW1lKTtcclxuICAgIH1cclxufVxyXG4iXX0=