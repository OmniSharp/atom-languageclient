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
var ts_disposables_1 = require('ts-disposables');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var decorators_2 = require('../decorators');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var CommandsService_1 = require('./CommandsService');
var NavigateService = (function (_super) {
    __extends(NavigateService, _super);
    function NavigateService(navigation, commands, atomCommands, source) {
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
    }
    NavigateService.prototype.onEnabled = function () {
        var _this = this;
        return new ts_disposables_1.CompositeDisposable(this._commands.add(atom_languageservices_1.CommandType.TextEditor, 'navigate-down', 'ctrl-alt-down', function () { return _this.navigateDown(); }), this._commands.add(atom_languageservices_1.CommandType.TextEditor, 'navigate-up', 'ctrl-alt-up', function () { return _this.navigateUp(); }));
    };
    NavigateService.prototype.createInvoke = function (callbacks) {
        return (function (options) {
            var requests = _.over(callbacks)(options);
            return rxjs_1.Observable.from(requests)
                .mergeMap(_.identity)
                .take(1);
        });
    };
    NavigateService.prototype.navigateUp = function () {
        var _this = this;
        var editor = this._source.activeTextEditor;
        if (editor) {
            this.invoke({
                editor: editor,
                location: editor.getCursorBufferPosition(),
                direction: 'up'
            }).subscribe(function (location) {
                _this._navigation.navigateTo({
                    filePath: editor.getPath(),
                    location: location
                });
            });
        }
    };
    NavigateService.prototype.navigateDown = function () {
        var _this = this;
        var editor = this._source.activeTextEditor;
        if (editor) {
            this.invoke({
                editor: editor,
                location: editor.getCursorBufferPosition(),
                direction: 'down'
            }).subscribe(function (location) {
                _this._navigation.navigateTo({
                    filePath: editor.getPath(),
                    location: location
                });
            });
        }
    };
    NavigateService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.INavigateService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for navigation'
        }), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], NavigateService);
    return NavigateService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.NavigateService = NavigateService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmF2aWdhdGVTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vTmF2aWdhdGVTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQTRGLHVCQUF1QixDQUFDLENBQUE7QUFDcEgsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUsK0JBQW9DLGdCQUFnQixDQUFDLENBQUE7QUFDckQscUNBQW9DLHdCQUF3QixDQUFDLENBQUE7QUFDN0QsMkJBQTJCLGVBQWUsQ0FBQyxDQUFBO0FBQzNDLDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELGdDQUFnQyxtQkFBbUIsQ0FBQyxDQUFBO0FBU3BEO0lBQ1ksbUNBQXFIO0lBTzdILHlCQUFZLFVBQTBCLEVBQUUsUUFBeUIsRUFBRSxZQUEwQixFQUFFLE1BQTRCO1FBQ3ZILGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztJQUN0QyxDQUFDO0lBRU0sbUNBQVMsR0FBaEI7UUFBQSxpQkFLQztRQUpHLE1BQU0sQ0FBQyxJQUFJLG9DQUFtQixDQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQ0FBVyxDQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsWUFBWSxFQUFFLEVBQW5CLENBQW1CLENBQUMsRUFDdkcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUNBQVcsQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLFVBQVUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQ3BHLENBQUM7SUFDTixDQUFDO0lBRVMsc0NBQVksR0FBdEIsVUFBdUIsU0FBMkU7UUFDOUYsTUFBTSxDQUFDLENBQUMsVUFBQyxPQUEwQjtZQUMvQixJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7aUJBQzNCLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sb0NBQVUsR0FBakI7UUFBQSxpQkFjQztRQWJHLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ1IsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsUUFBUSxFQUFFLE1BQU8sQ0FBQyx1QkFBdUIsRUFBRTtnQkFDM0MsU0FBUyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLFFBQVE7Z0JBQ2pCLEtBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO29CQUN4QixRQUFRLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtvQkFDMUIsa0JBQVE7aUJBQ1gsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVNLHNDQUFZLEdBQW5CO1FBQUEsaUJBY0M7UUFiRyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFFBQVEsRUFBRSxNQUFPLENBQUMsdUJBQXVCLEVBQUU7Z0JBQzNDLFNBQVMsRUFBRSxNQUFNO2FBQ3BCLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxRQUFRO2dCQUNqQixLQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztvQkFDeEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUU7b0JBQzFCLGtCQUFRO2lCQUNYLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztJQUNMLENBQUM7SUFwRUw7UUFBQyx1QkFBVTtRQUNWLGtCQUFLLENBQUMsd0NBQWdCLENBQUM7UUFDdkIsdUJBQVUsQ0FBQztZQUNSLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLDZCQUE2QjtTQUM3QyxDQUFDOzt1QkFBQTtJQWdFRixzQkFBQztBQUFELENBQUMsQUEvREQsQ0FDWSwwQ0FBbUIsR0E4RDlCO0FBL0RZLHVCQUFlLGtCQStEM0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDb21tYW5kVHlwZSwgSUF0b21OYXZpZ2F0aW9uLCBJTmF2aWdhdGVQcm92aWRlciwgSU5hdmlnYXRlU2VydmljZSwgTmF2aWdhdGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBhdG9tQ29uZmlnIH0gZnJvbSAnLi4vZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEF0b21Db21tYW5kcyB9IGZyb20gJy4vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgQXRvbU5hdmlnYXRpb24gfSBmcm9tICcuL0F0b21OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgQXRvbVRleHRFZGl0b3JTb3VyY2UgfSBmcm9tICcuL0F0b21UZXh0RWRpdG9yU291cmNlJztcclxuaW1wb3J0IHsgQ29tbWFuZHNTZXJ2aWNlIH0gZnJvbSAnLi9Db21tYW5kc1NlcnZpY2UnO1xyXG50eXBlIExvY2F0aW9uID0gSUF0b21OYXZpZ2F0aW9uLkxvY2F0aW9uO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElOYXZpZ2F0ZVNlcnZpY2UpXHJcbkBhdG9tQ29uZmlnKHtcclxuICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc3VwcG9ydCBmb3IgbmF2aWdhdGlvbidcclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdmlnYXRlU2VydmljZVxyXG4gICAgZXh0ZW5kcyBQcm92aWRlclNlcnZpY2VCYXNlPElOYXZpZ2F0ZVByb3ZpZGVyLCBOYXZpZ2F0ZS5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxUZXh0QnVmZmVyLlBvaW50PiwgT2JzZXJ2YWJsZTxUZXh0QnVmZmVyLlBvaW50Pj5cclxuICAgIGltcGxlbWVudHMgSU5hdmlnYXRlU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbjtcclxuICAgIHByaXZhdGUgX2NvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9hdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb24sIGNvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2UsIGF0b21Db21tYW5kczogQXRvbUNvbW1hbmRzLCBzb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9uYXZpZ2F0aW9uID0gbmF2aWdhdGlvbjtcclxuICAgICAgICB0aGlzLl9jb21tYW5kcyA9IGNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLl9hdG9tQ29tbWFuZHMgPSBhdG9tQ29tbWFuZHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlZCgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5UZXh0RWRpdG9yLCAnbmF2aWdhdGUtZG93bicsICdjdHJsLWFsdC1kb3duJywgKCkgPT4gdGhpcy5uYXZpZ2F0ZURvd24oKSksXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5UZXh0RWRpdG9yLCAnbmF2aWdhdGUtdXAnLCAnY3RybC1hbHQtdXAnLCAoKSA9PiB0aGlzLm5hdmlnYXRlVXAoKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IE5hdmlnYXRlLklSZXF1ZXN0KSA9PiBPYnNlcnZhYmxlPFRleHRCdWZmZXIuUG9pbnQ+KVtdKSB7XHJcbiAgICAgICAgcmV0dXJuICgob3B0aW9uczogTmF2aWdhdGUuSVJlcXVlc3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdHMgPSBfLm92ZXIoY2FsbGJhY2tzKShvcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbShyZXF1ZXN0cylcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcChfLmlkZW50aXR5KVxyXG4gICAgICAgICAgICAgICAgLnRha2UoMSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5hdmlnYXRlVXAoKSB7XHJcbiAgICAgICAgY29uc3QgZWRpdG9yID0gdGhpcy5fc291cmNlLmFjdGl2ZVRleHRFZGl0b3I7XHJcbiAgICAgICAgaWYgKGVkaXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLmludm9rZSh7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3I6IGVkaXRvcixcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBlZGl0b3IhLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCksXHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICd1cCdcclxuICAgICAgICAgICAgfSkuc3Vic2NyaWJlKGxvY2F0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25hdmlnYXRpb24ubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IGVkaXRvci5nZXRQYXRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5hdmlnYXRlRG93bigpIHtcclxuICAgICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLl9zb3VyY2UuYWN0aXZlVGV4dEVkaXRvcjtcclxuICAgICAgICBpZiAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52b2tlKHtcclxuICAgICAgICAgICAgICAgIGVkaXRvcjogZWRpdG9yLFxyXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IGVkaXRvciEuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogJ2Rvd24nXHJcbiAgICAgICAgICAgIH0pLnN1YnNjcmliZShsb2NhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9uYXZpZ2F0aW9uLm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBlZGl0b3IuZ2V0UGF0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==