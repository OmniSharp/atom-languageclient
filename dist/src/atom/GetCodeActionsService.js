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
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var AtomViewFinder_1 = require('./AtomViewFinder');
var CodeActionView_1 = require('./views/CodeActionView');
var CommandsService_1 = require('./CommandsService');
var RunCodeActionService_1 = require('./RunCodeActionService');
var GetCodeActionsService = (function (_super) {
    __extends(GetCodeActionsService, _super);
    function GetCodeActionsService(commands, atomCommands, textEditorSource, viewFinder, runCodeActionService) {
        _super.call(this);
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._textEditorSource = textEditorSource;
        this._viewFinder = viewFinder;
        this._runCodeActionService = runCodeActionService;
        // this._view = new CodeActionView(commands, viewFinder, editor);
    }
    GetCodeActionsService.prototype.onEnabled = function () {
        var _this = this;
        return this._commands.add(atom_languageservices_1.CommandType.TextEditor, "get-code-actions", ['ctrl-.', 'alt-enter'], function () { return _this.show(); });
    };
    GetCodeActionsService.prototype.createInvoke = function (callbacks) {
        return function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .scan(function (acc, results) { return _.compact(acc.concat(results)); }, []);
        };
    };
    GetCodeActionsService.prototype.show = function () {
        var _this = this;
        var editor = this._textEditorSource.activeTextEditor;
        if (editor) {
            var range_1 = editor.getSelectedBufferRange();
            var request = this.invoke({ editor: editor, range: range_1, context: {} })
                .share();
            request
                .take(1)
                .subscribe(function () {
                _this._view = new CodeActionView_1.CodeActionView(_this._atomCommands, _this._viewFinder, editor);
                _this._view.codeaction$
                    .subscribe(function (selected) {
                    _this._view.dispose();
                    _this._runCodeActionService.request({
                        editor: editor, range: range_1, identifier: selected.id, context: {}
                    });
                });
            });
            request
                .scan(function (acc, results) { return acc.concat(results); }, [])
                .subscribe(function (rows) {
                _this._view.setItems(rows);
            });
        }
    };
    GetCodeActionsService = __decorate([
        decorators_1.injectable(),
        decorators_1.alias(atom_languageservices_1.IGetCodeActionsService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for code actions'
        }), 
        __metadata('design:paramtypes', [CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource, AtomViewFinder_1.AtomViewFinder, RunCodeActionService_1.RunCodeActionService])
    ], GetCodeActionsService);
    return GetCodeActionsService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.GetCodeActionsService = GetCodeActionsService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0Q29kZUFjdGlvbnNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vR2V0Q29kZUFjdGlvbnNTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQTZGLHVCQUF1QixDQUFDLENBQUE7QUFDckgsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUscUNBQW9DLHdCQUF3QixDQUFDLENBQUE7QUFDN0QsMkJBQTJCLGVBQWUsQ0FBQyxDQUFBO0FBQzNDLDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELCtCQUErQix3QkFBd0IsQ0FBQyxDQUFBO0FBQ3hELGdDQUFnQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3BELHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBUTlEO0lBQ1kseUNBQXFKO0lBUzdKLCtCQUFZLFFBQXlCLEVBQUUsWUFBMEIsRUFBRSxnQkFBc0MsRUFBRSxVQUEwQixFQUFFLG9CQUEwQztRQUM3SyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDbEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUVsRCxpRUFBaUU7SUFDckUsQ0FBQztJQUVNLHlDQUFTLEdBQWhCO1FBQUEsaUJBRUM7UUFERyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUNBQVcsQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQztJQUN0SCxDQUFDO0lBRVMsNENBQVksR0FBdEIsVUFBdUIsU0FBMkY7UUFDOUcsTUFBTSxDQUFDLFVBQUMsT0FBZ0M7WUFDcEMsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixJQUFJLENBQUMsVUFBQyxHQUFHLEVBQUUsT0FBTyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTlCLENBQThCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVNLG9DQUFJLEdBQVg7UUFBQSxpQkF5QkM7UUF4QkcsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVCxJQUFNLE9BQUssR0FBRyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsY0FBTSxFQUFFLGNBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7aUJBQ3RELEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTztpQkFDRixJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNQLFNBQVMsQ0FBQztnQkFDUCxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksK0JBQWMsQ0FBQyxLQUFJLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzlFLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVztxQkFDakIsU0FBUyxDQUFDLFVBQUEsUUFBUTtvQkFDZixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNyQixLQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO3dCQUMvQixjQUFNLEVBQUUsY0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFO3FCQUN0RCxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztZQUVQLE9BQU87aUJBQ0YsSUFBSSxDQUFDLFVBQUMsR0FBRyxFQUFFLE9BQU8sSUFBSyxPQUFBLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQW5CLENBQW1CLEVBQUUsRUFBRSxDQUFDO2lCQUMvQyxTQUFTLENBQUMsVUFBQSxJQUFJO2dCQUNYLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztJQUNMLENBQUM7SUFoRUw7UUFBQyx1QkFBVSxFQUFFO1FBQ1osa0JBQUssQ0FBQyw4Q0FBc0IsQ0FBQztRQUM3Qix1QkFBVSxDQUFDO1lBQ1IsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsK0JBQStCO1NBQy9DLENBQUM7OzZCQUFBO0lBNERGLDRCQUFDO0FBQUQsQ0FBQyxBQTNERCxDQUNZLDBDQUFtQixHQTBEOUI7QUEzRFksNkJBQXFCLHdCQTJEakMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDb21tYW5kVHlwZSwgR2V0Q29kZUFjdGlvbnMsIElHZXRDb2RlQWN0aW9uc1Byb3ZpZGVyLCBJR2V0Q29kZUFjdGlvbnNTZXJ2aWNlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgYXRvbUNvbmZpZyB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IEF0b21WaWV3RmluZGVyIH0gZnJvbSAnLi9BdG9tVmlld0ZpbmRlcic7XHJcbmltcG9ydCB7IENvZGVBY3Rpb25WaWV3IH0gZnJvbSAnLi92aWV3cy9Db2RlQWN0aW9uVmlldyc7XHJcbmltcG9ydCB7IENvbW1hbmRzU2VydmljZSB9IGZyb20gJy4vQ29tbWFuZHNTZXJ2aWNlJztcclxuaW1wb3J0IHsgUnVuQ29kZUFjdGlvblNlcnZpY2UgfSBmcm9tICcuL1J1bkNvZGVBY3Rpb25TZXJ2aWNlJztcclxuXHJcbkBpbmplY3RhYmxlKClcclxuQGFsaWFzKElHZXRDb2RlQWN0aW9uc1NlcnZpY2UpXHJcbkBhdG9tQ29uZmlnKHtcclxuICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc3VwcG9ydCBmb3IgY29kZSBhY3Rpb25zJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgR2V0Q29kZUFjdGlvbnNTZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8SUdldENvZGVBY3Rpb25zUHJvdmlkZXIsIEdldENvZGVBY3Rpb25zLklSZXF1ZXN0LCBPYnNlcnZhYmxlPEdldENvZGVBY3Rpb25zLklSZXNwb25zZVtdPiwgT2JzZXJ2YWJsZTxHZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2VbXT4+XHJcbiAgICBpbXBsZW1lbnRzIElHZXRDb2RlQWN0aW9uc1NlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IENvbW1hbmRzU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21Db21tYW5kczogQXRvbUNvbW1hbmRzO1xyXG4gICAgcHJpdmF0ZSBfdGV4dEVkaXRvclNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcbiAgICBwcml2YXRlIF92aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlcjtcclxuICAgIHByaXZhdGUgX3J1bkNvZGVBY3Rpb25TZXJ2aWNlOiBSdW5Db2RlQWN0aW9uU2VydmljZTtcclxuICAgIHByaXZhdGUgX3ZpZXc6IENvZGVBY3Rpb25WaWV3O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2UsIGF0b21Db21tYW5kczogQXRvbUNvbW1hbmRzLCB0ZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZSwgdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXIsIHJ1bkNvZGVBY3Rpb25TZXJ2aWNlOiBSdW5Db2RlQWN0aW9uU2VydmljZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl9hdG9tQ29tbWFuZHMgPSBhdG9tQ29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fdGV4dEVkaXRvclNvdXJjZSA9IHRleHRFZGl0b3JTb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fdmlld0ZpbmRlciA9IHZpZXdGaW5kZXI7XHJcbiAgICAgICAgdGhpcy5fcnVuQ29kZUFjdGlvblNlcnZpY2UgPSBydW5Db2RlQWN0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5fdmlldyA9IG5ldyBDb2RlQWN0aW9uVmlldyhjb21tYW5kcywgdmlld0ZpbmRlciwgZWRpdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21tYW5kcy5hZGQoQ29tbWFuZFR5cGUuVGV4dEVkaXRvciwgYGdldC1jb2RlLWFjdGlvbnNgLCBbJ2N0cmwtLicsICdhbHQtZW50ZXInXSwgKCkgPT4gdGhpcy5zaG93KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IEdldENvZGVBY3Rpb25zLklSZXF1ZXN0KSA9PiBPYnNlcnZhYmxlPEdldENvZGVBY3Rpb25zLklSZXNwb25zZVtdPilbXSkge1xyXG4gICAgICAgIHJldHVybiAob3B0aW9uczogR2V0Q29kZUFjdGlvbnMuSVJlcXVlc3QpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbShfLm92ZXIoY2FsbGJhY2tzKShvcHRpb25zKSlcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcChfLmlkZW50aXR5KVxyXG4gICAgICAgICAgICAgICAgLnNjYW4oKGFjYywgcmVzdWx0cykgPT4gXy5jb21wYWN0KGFjYy5jb25jYXQocmVzdWx0cykpLCBbXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvdygpIHtcclxuICAgICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLl90ZXh0RWRpdG9yU291cmNlLmFjdGl2ZVRleHRFZGl0b3I7XHJcbiAgICAgICAgaWYgKGVkaXRvcikge1xyXG4gICAgICAgICAgICBjb25zdCByYW5nZSA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSB0aGlzLmludm9rZSh7IGVkaXRvciwgcmFuZ2UsIGNvbnRleHQ6IHt9IH0pXHJcbiAgICAgICAgICAgICAgICAuc2hhcmUoKTtcclxuICAgICAgICAgICAgcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgLnRha2UoMSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcgPSBuZXcgQ29kZUFjdGlvblZpZXcodGhpcy5fYXRvbUNvbW1hbmRzLCB0aGlzLl92aWV3RmluZGVyLCBlZGl0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcuY29kZWFjdGlvbiRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZShzZWxlY3RlZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3LmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3J1bkNvZGVBY3Rpb25TZXJ2aWNlLnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvciwgcmFuZ2UsIGlkZW50aWZpZXI6IHNlbGVjdGVkLmlkLCBjb250ZXh0OiB7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICAuc2NhbigoYWNjLCByZXN1bHRzKSA9PiBhY2MuY29uY2F0KHJlc3VsdHMpLCBbXSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUocm93cyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5zZXRJdGVtcyhyb3dzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=