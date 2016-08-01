/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
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
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var Services = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var AtomChanges_1 = require('./AtomChanges');
var AtomCommands_1 = require('./AtomCommands');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var ATOM_COMMANDS = Services.AtomCommands;
var FormatService = (function (_super) {
    __extends(FormatService, _super);
    function FormatService(changes, commands, source) {
        var _this = this;
        _super.call(this);
        this._changes = changes;
        this._commands = commands;
        this._source = source;
        this._disposable.add(this._commands.add(ATOM_COMMANDS.CommandType.TextEditor, "format-document", function () { return _this.formatDocument(source.activeTextEditor); }), this._commands.add(ATOM_COMMANDS.CommandType.TextEditor, "format-range", function () { return _this.formatRange(source.activeTextEditor); }));
    }
    FormatService.prototype.createInvoke = function (callbacks) {
        return function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce(function (acc, results) { return _.compact(acc.concat(results)); }, []);
        };
    };
    FormatService.prototype.formatDocument = function (editor) {
        var _this = this;
        if (!editor) {
            return;
        }
        this.invoke({
            editor: editor,
            insertSpaces: editor.usesSoftTabs(),
            tabSize: editor.getTabLength()
        }).subscribe(function (changes) {
            _this._changes.applyChanges(editor, changes);
        });
    };
    FormatService.prototype.formatRange = function (editor) {
        var _this = this;
        rxjs_1.Observable.from(editor.getSelectedScreenRanges())
            .concatMap(function (range) {
            return _this.invoke({
                editor: editor, range: range,
                insertSpaces: editor.usesSoftTabs(),
                tabSize: editor.getTabLength()
            }).do(function (changes) {
                _this._changes.applyChanges(editor, changes);
            });
        })
            .subscribe();
    };
    FormatService = __decorate([
        decorators_1.injectable(),
        decorators_1.alias(Services.IFormatService), 
        __metadata('design:paramtypes', [AtomChanges_1.AtomChanges, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], FormatService);
    return FormatService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.FormatService = FormatService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybWF0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL0Zvcm1hdFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRzs7Ozs7Ozs7Ozs7Ozs7OztBQUVILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxJQUFZLFFBQVEsV0FBTSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xELDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JFLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzdELDRCQUE0QixlQUFlLENBQUMsQ0FBQTtBQUM1Qyw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5QyxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCxJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO0FBSTVDO0lBQ1ksaUNBQXlKO0lBTWpLLHVCQUFtQixPQUFvQixFQUFFLFFBQXNCLEVBQUUsTUFBNEI7UUFQakcsaUJBdURDO1FBL0NPLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQTVDLENBQTRDLENBQUMsRUFDL0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUF6QyxDQUF5QyxDQUFDLENBQzVILENBQUM7SUFDTixDQUFDO0lBRVMsb0NBQVksR0FBdEIsVUFBdUIsU0FBK0Y7UUFDbEgsTUFBTSxDQUFDLFVBQUMsT0FBaUM7WUFDckMsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsT0FBTyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTlCLENBQThCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVNLHNDQUFjLEdBQXJCLFVBQXNCLE1BQXVCO1FBQTdDLGlCQVlDO1FBWEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLENBQUM7WUFDUixjQUFNO1lBQ04sWUFBWSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDbkMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUU7U0FDakMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE9BQU87WUFDaEIsS0FBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLG1DQUFXLEdBQWxCLFVBQW1CLE1BQXVCO1FBQTFDLGlCQVlDO1FBWEcsaUJBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUM7YUFDNUMsU0FBUyxDQUFDLFVBQUEsS0FBSztZQUNaLE1BQU0sQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNmLGNBQU0sRUFBRSxZQUFLO2dCQUNiLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFO2dCQUNuQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRTthQUNqQyxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQUEsT0FBTztnQkFDVCxLQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBdkRMO1FBQUMsdUJBQVUsRUFBRTtRQUNaLGtCQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQzs7cUJBQUE7SUF3RC9CLG9CQUFDO0FBQUQsQ0FBQyxBQXZERCxDQUNZLDBDQUFtQixHQXNEOUI7QUF2RFkscUJBQWEsZ0JBdUR6QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgKiBhcyBTZXJ2aWNlcyBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBBdG9tQ2hhbmdlcyB9IGZyb20gJy4vQXRvbUNoYW5nZXMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmNvbnN0IEFUT01fQ09NTUFORFMgPSBTZXJ2aWNlcy5BdG9tQ29tbWFuZHM7XHJcblxyXG5AaW5qZWN0YWJsZSgpXHJcbkBhbGlhcyhTZXJ2aWNlcy5JRm9ybWF0U2VydmljZSlcclxuZXhwb3J0IGNsYXNzIEZvcm1hdFNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxTZXJ2aWNlcy5JRm9ybWF0UHJvdmlkZXIsIFNlcnZpY2VzLkZvcm1hdC5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5UZXh0LklGaWxlQ2hhbmdlW10+LCBPYnNlcnZhYmxlPFNlcnZpY2VzLlRleHQuSUZpbGVDaGFuZ2VbXT4+XHJcbiAgICBpbXBsZW1lbnRzIFNlcnZpY2VzLklGb3JtYXRTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX2NoYW5nZXM6IEF0b21DaGFuZ2VzO1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNoYW5nZXM6IEF0b21DaGFuZ2VzLCBjb21tYW5kczogQXRvbUNvbW1hbmRzLCBzb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jaGFuZ2VzID0gY2hhbmdlcztcclxuICAgICAgICB0aGlzLl9jb21tYW5kcyA9IGNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRzLmFkZChBVE9NX0NPTU1BTkRTLkNvbW1hbmRUeXBlLlRleHRFZGl0b3IsIGBmb3JtYXQtZG9jdW1lbnRgLCAoKSA9PiB0aGlzLmZvcm1hdERvY3VtZW50KHNvdXJjZS5hY3RpdmVUZXh0RWRpdG9yKSksXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRzLmFkZChBVE9NX0NPTU1BTkRTLkNvbW1hbmRUeXBlLlRleHRFZGl0b3IsIGBmb3JtYXQtcmFuZ2VgLCAoKSA9PiB0aGlzLmZvcm1hdFJhbmdlKHNvdXJjZS5hY3RpdmVUZXh0RWRpdG9yKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKChvcHRpb25zOiBTZXJ2aWNlcy5Gb3JtYXQuSVJlcXVlc3QpID0+IE9ic2VydmFibGU8U2VydmljZXMuVGV4dC5JRmlsZUNoYW5nZVtdPilbXSkpIHtcclxuICAgICAgICByZXR1cm4gKG9wdGlvbnM6IFNlcnZpY2VzLkZvcm1hdC5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAucmVkdWNlKChhY2MsIHJlc3VsdHMpID0+IF8uY29tcGFjdChhY2MuY29uY2F0KHJlc3VsdHMpKSwgW10pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZvcm1hdERvY3VtZW50KGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgaWYgKCFlZGl0b3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnZva2Uoe1xyXG4gICAgICAgICAgICBlZGl0b3IsXHJcbiAgICAgICAgICAgIGluc2VydFNwYWNlczogZWRpdG9yLnVzZXNTb2Z0VGFicygpLFxyXG4gICAgICAgICAgICB0YWJTaXplOiBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcclxuICAgICAgICB9KS5zdWJzY3JpYmUoY2hhbmdlcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYW5nZXMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgY2hhbmdlcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZvcm1hdFJhbmdlKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgT2JzZXJ2YWJsZS5mcm9tKGVkaXRvci5nZXRTZWxlY3RlZFNjcmVlblJhbmdlcygpKVxyXG4gICAgICAgICAgICAuY29uY2F0TWFwKHJhbmdlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmludm9rZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLCByYW5nZSxcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRTcGFjZXM6IGVkaXRvci51c2VzU29mdFRhYnMoKSxcclxuICAgICAgICAgICAgICAgICAgICB0YWJTaXplOiBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcclxuICAgICAgICAgICAgICAgIH0pLmRvKGNoYW5nZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZXMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgY2hhbmdlcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxufVxyXG4iXX0=