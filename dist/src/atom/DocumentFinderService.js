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
var decorators_2 = require('../decorators');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var CommandsService_1 = require('./CommandsService');
var DocumentFinderView_1 = require('./views/DocumentFinderView');
var DocumentFinderService = (function (_super) {
    __extends(DocumentFinderService, _super);
    function DocumentFinderService(navigation, commands, atomCommands, source) {
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._source = source;
    }
    DocumentFinderService.prototype.onEnabled = function () {
        var _this = this;
        return this._commands.add(atom_languageservices_1.CommandType.TextEditor, 'document-symbols', 'ctrl-shift-,', function () { return _this.open(); });
    };
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
            this._disposable.add(new DocumentFinderView_1.DocumentFinderView(this._atomCommands, this._navigation, this.invoke(activeEditor)));
        }
    };
    DocumentFinderService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IDocumentFinderService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for showing document symbols'
        }), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], DocumentFinderService);
    return DocumentFinderService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.DocumentFinderService = DocumentFinderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRGaW5kZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vRG9jdW1lbnRGaW5kZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQWlILHVCQUF1QixDQUFDLENBQUE7QUFDekksMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUscUNBQW9DLHdCQUF3QixDQUFDLENBQUE7QUFDN0QsMkJBQTJCLGVBQWUsQ0FBQyxDQUFBO0FBQzNDLDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELGdDQUFnQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3BELG1DQUFtQyw0QkFBNEIsQ0FBQyxDQUFBO0FBUWhFO0lBQ1kseUNBQTZIO0lBT3JJLCtCQUFZLFVBQTBCLEVBQUUsUUFBeUIsRUFBRSxZQUEwQixFQUFFLE1BQTRCO1FBQ3ZILGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRU0seUNBQVMsR0FBaEI7UUFBQSxpQkFFQztRQURHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQ0FBVyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxjQUFjLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQztJQUM3RyxDQUFDO0lBRVMsNENBQVksR0FBdEIsVUFBdUIsU0FBMkU7UUFDOUYsTUFBTSxDQUFDLFVBQUMsT0FBd0I7WUFDNUIsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixJQUFJLENBQ0wsVUFBQyxHQUFHLEVBQUUsT0FBTztnQkFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFBLE1BQU07b0JBQ2xCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixDQUFDLEVBQ0QsRUFBRSxDQUFDLENBQUM7UUFDWixDQUFDLENBQUM7SUFDTixDQUFDO0lBRU0sb0NBQUksR0FBWDtRQUNJLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksdUNBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xILENBQUM7SUFDTCxDQUFDO0lBOUNMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLDhDQUFzQixDQUFDO1FBQzdCLHVCQUFVLENBQUM7WUFDUixPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSwyQ0FBMkM7U0FDM0QsQ0FBQzs7NkJBQUE7SUEwQ0YsNEJBQUM7QUFBRCxDQUFDLEFBekNELENBQ1ksMENBQW1CLEdBd0M5QjtBQXpDWSw2QkFBcUIsd0JBeUNqQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENvbW1hbmRUeXBlLCBGaW5kZXIsIElEb2N1bWVudEZpbmRlclByb3ZpZGVyLCBJRG9jdW1lbnRGaW5kZXJTZXJ2aWNlLCBLZXltYXBQbGF0Zm9ybSwgS2V5bWFwVHlwZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBQcm92aWRlclNlcnZpY2VCYXNlIH0gZnJvbSAnLi9fUHJvdmlkZXJTZXJ2aWNlQmFzZSc7XHJcbmltcG9ydCB7IGF0b21Db25maWcgfSBmcm9tICcuLi9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgQXRvbUNvbW1hbmRzIH0gZnJvbSAnLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tTmF2aWdhdGlvbiB9IGZyb20gJy4vQXRvbU5hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBBdG9tVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4vQXRvbVRleHRFZGl0b3JTb3VyY2UnO1xyXG5pbXBvcnQgeyBDb21tYW5kc1NlcnZpY2UgfSBmcm9tICcuL0NvbW1hbmRzU2VydmljZSc7XHJcbmltcG9ydCB7IERvY3VtZW50RmluZGVyVmlldyB9IGZyb20gJy4vdmlld3MvRG9jdW1lbnRGaW5kZXJWaWV3JztcclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhJRG9jdW1lbnRGaW5kZXJTZXJ2aWNlKVxyXG5AYXRvbUNvbmZpZyh7XHJcbiAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgZGVzY3JpcHRpb246ICdBZGRzIHN1cHBvcnQgZm9yIHNob3dpbmcgZG9jdW1lbnQgc3ltYm9scydcclxufSlcclxuZXhwb3J0IGNsYXNzIERvY3VtZW50RmluZGVyU2VydmljZVxyXG4gICAgZXh0ZW5kcyBQcm92aWRlclNlcnZpY2VCYXNlPElEb2N1bWVudEZpbmRlclByb3ZpZGVyLCBBdG9tLlRleHRFZGl0b3IsIE9ic2VydmFibGU8RmluZGVyLklSZXNwb25zZVtdPiwgT2JzZXJ2YWJsZTxGaW5kZXIuSVJlc3BvbnNlW10+PlxyXG4gICAgaW1wbGVtZW50cyBJRG9jdW1lbnRGaW5kZXJTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX25hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IENvbW1hbmRzU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21Db21tYW5kczogQXRvbUNvbW1hbmRzO1xyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbiwgY29tbWFuZHM6IENvbW1hbmRzU2VydmljZSwgYXRvbUNvbW1hbmRzOiBBdG9tQ29tbWFuZHMsIHNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fYXRvbUNvbW1hbmRzID0gYXRvbUNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21tYW5kcy5hZGQoQ29tbWFuZFR5cGUuVGV4dEVkaXRvciwgJ2RvY3VtZW50LXN5bWJvbHMnLCAnY3RybC1zaGlmdC0sJywgKCkgPT4gdGhpcy5vcGVuKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IEF0b20uVGV4dEVkaXRvcikgPT4gT2JzZXJ2YWJsZTxGaW5kZXIuSVJlc3BvbnNlW10+KVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIChvcHRpb25zOiBBdG9tLlRleHRFZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbShfLm92ZXIoY2FsbGJhY2tzKShvcHRpb25zKSlcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcChfLmlkZW50aXR5KVxyXG4gICAgICAgICAgICAgICAgLnNjYW4oXHJcbiAgICAgICAgICAgICAgICAoYWNjLCByZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHJlc3VsdHMsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5maWxlUGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChyZXN1bHQuZmlsZVBhdGgpWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2MuY29uY2F0KHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUVkaXRvciA9IHRoaXMuX3NvdXJjZS5hY3RpdmVUZXh0RWRpdG9yO1xyXG4gICAgICAgIGlmIChhY3RpdmVFZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQobmV3IERvY3VtZW50RmluZGVyVmlldyh0aGlzLl9hdG9tQ29tbWFuZHMsIHRoaXMuX25hdmlnYXRpb24sIHRoaXMuaW52b2tlKGFjdGl2ZUVkaXRvcikpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19