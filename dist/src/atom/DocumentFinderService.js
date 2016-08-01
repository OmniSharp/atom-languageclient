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
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var DocumentFinderView_1 = require('./views/DocumentFinderView');
var DocumentFinderService = (function (_super) {
    __extends(DocumentFinderService, _super);
    function DocumentFinderService(navigation, commands, source) {
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
    }
    DocumentFinderService.prototype.createInvoke = function (callbacks) {
        return function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .scan(function (acc, results) {
                _.each(results, function (result) {
                    result.filePath = atom.project.relativizePath(result.filePath)[1];
                });
                return acc.concat(results);
            }, []);
        };
    };
    DocumentFinderService.prototype.open = function () {
        var activeEditor = this._source.activeTextEditor;
        if (activeEditor) {
            this._disposable.add(new DocumentFinderView_1.DocumentFinderView(this._commands, this._navigation, this.invoke(activeEditor)));
        }
    };
    DocumentFinderService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IDocumentFinderService), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], DocumentFinderService);
    return DocumentFinderService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.DocumentFinderService = DocumentFinderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRGaW5kZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vRG9jdW1lbnRGaW5kZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQXdFLHVCQUF1QixDQUFDLENBQUE7QUFDaEcsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUscUNBQW9DLHdCQUF3QixDQUFDLENBQUE7QUFDN0QsNkJBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFDOUMsK0JBQStCLGtCQUFrQixDQUFDLENBQUE7QUFDbEQscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFDOUQsbUNBQW1DLDRCQUE0QixDQUFDLENBQUE7QUFJaEU7SUFDWSx5Q0FBNkg7SUFNckksK0JBQVksVUFBMEIsRUFBRSxRQUFzQixFQUFFLE1BQTRCO1FBQ3hGLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRVMsNENBQVksR0FBdEIsVUFBdUIsU0FBMkU7UUFDOUYsTUFBTSxDQUFDLFVBQUMsT0FBd0I7WUFDNUIsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixJQUFJLENBQ0wsVUFBQyxHQUFHLEVBQUUsT0FBTztnQkFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFBLE1BQU07b0JBQ2xCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixDQUFDLEVBQ0QsRUFBRSxDQUFDLENBQUM7UUFDWixDQUFDLENBQUM7SUFDTixDQUFDO0lBRU0sb0NBQUksR0FBWDtRQUNJLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksdUNBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlHLENBQUM7SUFDTCxDQUFDO0lBcENMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLDhDQUFzQixDQUFDOzs2QkFBQTtJQW9DOUIsNEJBQUM7QUFBRCxDQUFDLEFBbkNELENBQ1ksMENBQW1CLEdBa0M5QjtBQW5DWSw2QkFBcUIsd0JBbUNqQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEZpbmRlciwgSURvY3VtZW50RmluZGVyUHJvdmlkZXIsIElEb2N1bWVudEZpbmRlclNlcnZpY2UgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21OYXZpZ2F0aW9uIH0gZnJvbSAnLi9BdG9tTmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IERvY3VtZW50RmluZGVyVmlldyB9IGZyb20gJy4vdmlld3MvRG9jdW1lbnRGaW5kZXJWaWV3JztcclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhJRG9jdW1lbnRGaW5kZXJTZXJ2aWNlKVxyXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRGaW5kZXJTZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8SURvY3VtZW50RmluZGVyUHJvdmlkZXIsIEF0b20uVGV4dEVkaXRvciwgT2JzZXJ2YWJsZTxGaW5kZXIuSVJlc3BvbnNlW10+LCBPYnNlcnZhYmxlPEZpbmRlci5JUmVzcG9uc2VbXT4+XHJcbiAgICBpbXBsZW1lbnRzIElEb2N1bWVudEZpbmRlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb247XHJcbiAgICBwcml2YXRlIF9jb21tYW5kczogQXRvbUNvbW1hbmRzO1xyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbiwgY29tbWFuZHM6IEF0b21Db21tYW5kcywgc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbiA9IG5hdmlnYXRpb247XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgob3B0aW9uczogQXRvbS5UZXh0RWRpdG9yKSA9PiBPYnNlcnZhYmxlPEZpbmRlci5JUmVzcG9uc2VbXT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKG9wdGlvbnM6IEF0b20uVGV4dEVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAuc2NhbihcclxuICAgICAgICAgICAgICAgIChhY2MsIHJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBfLmVhY2gocmVzdWx0cywgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmZpbGVQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKHJlc3VsdC5maWxlUGF0aClbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYy5jb25jYXQocmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW10pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gdGhpcy5fc291cmNlLmFjdGl2ZVRleHRFZGl0b3I7XHJcbiAgICAgICAgaWYgKGFjdGl2ZUVkaXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChuZXcgRG9jdW1lbnRGaW5kZXJWaWV3KHRoaXMuX2NvbW1hbmRzLCB0aGlzLl9uYXZpZ2F0aW9uLCB0aGlzLmludm9rZShhY3RpdmVFZGl0b3IpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==