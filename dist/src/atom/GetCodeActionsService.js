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
var Services = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var AtomCommands_1 = require('./AtomCommands');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var AtomViewFinder_1 = require('./AtomViewFinder');
var CodeActionView_1 = require('./views/CodeActionView');
var RunCodeActionService_1 = require('./RunCodeActionService');
var GetCodeActionsService = (function (_super) {
    __extends(GetCodeActionsService, _super);
    function GetCodeActionsService(commands, textEditorSource, viewFinder, runCodeActionService) {
        var _this = this;
        _super.call(this);
        this._commands = commands;
        this._textEditorSource = textEditorSource;
        this._viewFinder = viewFinder;
        this._runCodeActionService = runCodeActionService;
        // this._view = new CodeActionView(commands, viewFinder, editor);
        this._disposable.add(this._commands.add(Services.AtomCommands.CommandType.TextEditor, "get-code-actions", function () { return _this.show(); }));
    }
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
                _this._view = new CodeActionView_1.CodeActionView(_this._commands, _this._viewFinder, editor);
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
        decorators_1.alias(Services.IGetCodeActionsService), 
        __metadata('design:paramtypes', [AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource, AtomViewFinder_1.AtomViewFinder, RunCodeActionService_1.RunCodeActionService])
    ], GetCodeActionsService);
    return GetCodeActionsService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.GetCodeActionsService = GetCodeActionsService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0Q29kZUFjdGlvbnNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vR2V0Q29kZUFjdGlvbnNTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsSUFBWSxRQUFRLFdBQU0sdUJBQXVCLENBQUMsQ0FBQTtBQUNsRCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUVyRSxxQ0FBb0Msd0JBQXdCLENBQUMsQ0FBQTtBQUM3RCw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5QyxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCwrQkFBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCwrQkFBK0Isd0JBQXdCLENBQUMsQ0FBQTtBQUN4RCxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUk5RDtJQUNZLHlDQUF5TDtJQVFqTSwrQkFBWSxRQUFzQixFQUFFLGdCQUFzQyxFQUFFLFVBQTBCLEVBQUUsb0JBQTBDO1FBVHRKLGlCQXlEQztRQS9DTyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUVsRCxpRUFBaUU7UUFFakUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLElBQUksRUFBRSxFQUFYLENBQVcsQ0FBQyxDQUMxRyxDQUFDO0lBQ04sQ0FBQztJQUVTLDRDQUFZLEdBQXRCLFVBQXVCLFNBQTZHO1FBQ2hJLE1BQU0sQ0FBQyxVQUFDLE9BQXlDO1lBQzdDLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM3QyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztpQkFDcEIsSUFBSSxDQUFDLFVBQUMsR0FBRyxFQUFFLE9BQU8sSUFBSyxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUE5QixDQUE4QixFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFTSxvQ0FBSSxHQUFYO1FBQUEsaUJBeUJDO1FBeEJHLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN2RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBTSxPQUFLLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDOUMsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGNBQU0sRUFBRSxjQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO2lCQUN0RCxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU87aUJBQ0YsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDUCxTQUFTLENBQUM7Z0JBQ1AsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLCtCQUFjLENBQUMsS0FBSSxDQUFDLFNBQVMsRUFBRSxLQUFJLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRSxLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVc7cUJBQ2pCLFNBQVMsQ0FBQyxVQUFBLFFBQVE7b0JBQ2YsS0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDckIsS0FBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQzt3QkFDL0IsY0FBTSxFQUFFLGNBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRTtxQkFDdEQsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7WUFFUCxPQUFPO2lCQUNGLElBQUksQ0FBQyxVQUFDLEdBQUcsRUFBRSxPQUFPLElBQUssT0FBQSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFuQixDQUFtQixFQUFFLEVBQUUsQ0FBQztpQkFDL0MsU0FBUyxDQUFDLFVBQUEsSUFBSTtnQkFDWCxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7SUFDTCxDQUFDO0lBMURMO1FBQUMsdUJBQVUsRUFBRTtRQUNaLGtCQUFLLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDOzs2QkFBQTtJQTBEdkMsNEJBQUM7QUFBRCxDQUFDLEFBekRELENBQ1ksMENBQW1CLEdBd0Q5QjtBQXpEWSw2QkFBcUIsd0JBeURqQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCAqIGFzIFNlcnZpY2VzIGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBJRGlzcG9zYWJsZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IEF0b21WaWV3RmluZGVyIH0gZnJvbSAnLi9BdG9tVmlld0ZpbmRlcic7XHJcbmltcG9ydCB7IENvZGVBY3Rpb25WaWV3IH0gZnJvbSAnLi92aWV3cy9Db2RlQWN0aW9uVmlldyc7XHJcbmltcG9ydCB7IFJ1bkNvZGVBY3Rpb25TZXJ2aWNlIH0gZnJvbSAnLi9SdW5Db2RlQWN0aW9uU2VydmljZSc7XHJcblxyXG5AaW5qZWN0YWJsZSgpXHJcbkBhbGlhcyhTZXJ2aWNlcy5JR2V0Q29kZUFjdGlvbnNTZXJ2aWNlKVxyXG5leHBvcnQgY2xhc3MgR2V0Q29kZUFjdGlvbnNTZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8U2VydmljZXMuSUdldENvZGVBY3Rpb25zUHJvdmlkZXIsIFNlcnZpY2VzLkdldENvZGVBY3Rpb25zLklSZXF1ZXN0LCBPYnNlcnZhYmxlPFNlcnZpY2VzLkdldENvZGVBY3Rpb25zLklSZXNwb25zZVtdPiwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5HZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2VbXT4+XHJcbiAgICBpbXBsZW1lbnRzIFNlcnZpY2VzLklHZXRDb2RlQWN0aW9uc1NlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3RleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlO1xyXG4gICAgcHJpdmF0ZSBfdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXI7XHJcbiAgICBwcml2YXRlIF9ydW5Db2RlQWN0aW9uU2VydmljZTogUnVuQ29kZUFjdGlvblNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF92aWV3OiBDb2RlQWN0aW9uVmlldztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kczogQXRvbUNvbW1hbmRzLCB0ZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZSwgdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXIsIHJ1bkNvZGVBY3Rpb25TZXJ2aWNlOiBSdW5Db2RlQWN0aW9uU2VydmljZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl90ZXh0RWRpdG9yU291cmNlID0gdGV4dEVkaXRvclNvdXJjZTtcclxuICAgICAgICB0aGlzLl92aWV3RmluZGVyID0gdmlld0ZpbmRlcjtcclxuICAgICAgICB0aGlzLl9ydW5Db2RlQWN0aW9uU2VydmljZSA9IHJ1bkNvZGVBY3Rpb25TZXJ2aWNlO1xyXG5cclxuICAgICAgICAvLyB0aGlzLl92aWV3ID0gbmV3IENvZGVBY3Rpb25WaWV3KGNvbW1hbmRzLCB2aWV3RmluZGVyLCBlZGl0b3IpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgdGhpcy5fY29tbWFuZHMuYWRkKFNlcnZpY2VzLkF0b21Db21tYW5kcy5Db21tYW5kVHlwZS5UZXh0RWRpdG9yLCBgZ2V0LWNvZGUtYWN0aW9uc2AsICgpID0+IHRoaXMuc2hvdygpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgob3B0aW9uczogU2VydmljZXMuR2V0Q29kZUFjdGlvbnMuSVJlcXVlc3QpID0+IE9ic2VydmFibGU8U2VydmljZXMuR2V0Q29kZUFjdGlvbnMuSVJlc3BvbnNlW10+KVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIChvcHRpb25zOiBTZXJ2aWNlcy5HZXRDb2RlQWN0aW9ucy5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAuc2NhbigoYWNjLCByZXN1bHRzKSA9PiBfLmNvbXBhY3QoYWNjLmNvbmNhdChyZXN1bHRzKSksIFtdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuX3RleHRFZGl0b3JTb3VyY2UuYWN0aXZlVGV4dEVkaXRvcjtcclxuICAgICAgICBpZiAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKTtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IHRoaXMuaW52b2tlKHsgZWRpdG9yLCByYW5nZSwgY29udGV4dDoge30gfSlcclxuICAgICAgICAgICAgICAgIC5zaGFyZSgpO1xyXG4gICAgICAgICAgICByZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICAudGFrZSgxKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldyA9IG5ldyBDb2RlQWN0aW9uVmlldyh0aGlzLl9jb21tYW5kcywgdGhpcy5fdmlld0ZpbmRlciwgZWRpdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3LmNvZGVhY3Rpb24kXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoc2VsZWN0ZWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ydW5Db2RlQWN0aW9uU2VydmljZS5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZGl0b3IsIHJhbmdlLCBpZGVudGlmaWVyOiBzZWxlY3RlZC5pZCwgY29udGV4dDoge31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgLnNjYW4oKGFjYywgcmVzdWx0cykgPT4gYWNjLmNvbmNhdChyZXN1bHRzKSwgW10pXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKHJvd3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcuc2V0SXRlbXMocm93cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19