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
var fs_1 = require('fs');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var ReferenceView_1 = require('./views/ReferenceView');
var navigationHasRange = Services.AtomNavigation.navigationHasRange;
var readFile$ = rxjs_1.Observable.bindNodeCallback(fs_1.readFile);
var DefinitionService = (function (_super) {
    __extends(DefinitionService, _super);
    function DefinitionService(navigation, commands, source) {
        var _this = this;
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._commands.add(Services.AtomCommands.CommandType.TextEditor, 'definition', function () { return _this.open(); });
    }
    DefinitionService.prototype.createInvoke = function (callbacks) {
        return (function (options) {
            var requests = _.over(callbacks)(options);
            return rxjs_1.Observable.from(requests)
                .mergeMap(_.identity)
                .scan(function (acc, value) { acc.push.apply(acc, value); return acc; }, [])
                .debounceTime(200);
        });
    };
    DefinitionService.prototype.open = function () {
        var _this = this;
        var view;
        var subscription;
        var editor = this._source.activeTextEditor;
        if (editor) {
            subscription = this.invoke({
                editor: editor,
                location: editor.getCursorBufferPosition()
            }).do(function (results) {
                if (results.length === 1) {
                    _this._navigation.navigateTo(results[0]);
                    subscription.unsubscribe();
                }
            })
                .filter(function (results) { return results.length > 1; })
                .mergeMap(function (results) {
                var files = _(results)
                    .map(function (result) { return result.filePath; })
                    .compact()
                    .uniq()
                    .map(function (filePath) { return readFile$(filePath)
                    .map(function (content) { return ({ filePath: filePath, content: content.toString().split(/(?:\n|\r\n|\r)/g) }); }); })
                    .value();
                return rxjs_1.Observable.forkJoin(files);
            }, function (results, files) { return ({ results: results, files: files }); })
                .subscribe(function (_a) {
                var results = _a.results, files = _a.files;
                var items = [];
                var _loop_1 = function(result) {
                    var filePath = result.filePath;
                    var file = _.find(files, function (file) { return file.filePath === result.filePath; });
                    if (navigationHasRange(result)) {
                        var range = result.range;
                        var lines = _.map(_.range(range.start.row, range.end.row + 1), function (line) { return file.content[line]; });
                        items.push({
                            filePath: filePath,
                            lines: lines,
                            range: range
                        });
                    }
                };
                for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                    var result = results_1[_i];
                    _loop_1(result);
                }
                if (!view) {
                    view = new ReferenceView_1.ReferenceView(_this._commands, _this._navigation, items);
                }
                else {
                    view.setItems(items);
                }
            });
        }
    };
    DefinitionService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(Services.IDefinitionService), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], DefinitionService);
    return DefinitionService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.DefinitionService = DefinitionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVmaW5pdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9EZWZpbml0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQXlDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hELElBQVksUUFBUSxXQUFNLHVCQUF1QixDQUFDLENBQUE7QUFDbEQsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUsbUJBQXlCLElBQUksQ0FBQyxDQUFBO0FBQzlCLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzdELDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELDhCQUE4Qix1QkFBdUIsQ0FBQyxDQUFBO0FBQzlDLG1FQUFrQixDQUE2QjtBQUV2RCxJQUFNLFNBQVMsR0FBRyxpQkFBVSxDQUFDLGdCQUFnQixDQUFDLGFBQVEsQ0FBQyxDQUFDO0FBR3hEO0lBQ1kscUNBQStLO0lBTXZMLDJCQUFZLFVBQTBCLEVBQUUsUUFBc0IsRUFBRSxNQUE0QjtRQVBoRyxpQkErRUM7UUF2RU8saUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQztJQUN0RyxDQUFDO0lBRVMsd0NB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clxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgKiBhcyBTZXJ2aWNlcyBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgQXRvbUNvbW1hbmRzIH0gZnJvbSAnLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tTmF2aWdhdGlvbiB9IGZyb20gJy4vQXRvbU5hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBBdG9tVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4vQXRvbVRleHRFZGl0b3JTb3VyY2UnO1xyXG5pbXBvcnQgeyBSZWZlcmVuY2VWaWV3IH0gZnJvbSAnLi92aWV3cy9SZWZlcmVuY2VWaWV3JztcclxuY29uc3QgeyBuYXZpZ2F0aW9uSGFzUmFuZ2UgfSA9IFNlcnZpY2VzLkF0b21OYXZpZ2F0aW9uO1xyXG5cclxuY29uc3QgcmVhZEZpbGUkID0gT2JzZXJ2YWJsZS5iaW5kTm9kZUNhbGxiYWNrKHJlYWRGaWxlKTtcclxuQGluamVjdGFibGVcclxuQGFsaWFzKFNlcnZpY2VzLklEZWZpbml0aW9uU2VydmljZSlcclxuZXhwb3J0IGNsYXNzIERlZmluaXRpb25TZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8U2VydmljZXMuSURlZmluaXRpb25Qcm92aWRlciwgU2VydmljZXMuRGVmaW5pdGlvbi5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5BdG9tTmF2aWdhdGlvbi5Mb2NhdGlvbltdPiwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5BdG9tTmF2aWdhdGlvbi5Mb2NhdGlvbltdPj5cclxuICAgIGltcGxlbWVudHMgU2VydmljZXMuSURlZmluaXRpb25TZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX25hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb24sIGNvbW1hbmRzOiBBdG9tQ29tbWFuZHMsIHNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21tYW5kcy5hZGQoU2VydmljZXMuQXRvbUNvbW1hbmRzLkNvbW1hbmRUeXBlLlRleHRFZGl0b3IsICdkZWZpbml0aW9uJywgKCkgPT4gdGhpcy5vcGVuKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IFNlcnZpY2VzLkRlZmluaXRpb24uSVJlcXVlc3QpID0+IE9ic2VydmFibGU8U2VydmljZXMuQXRvbU5hdmlnYXRpb24uTG9jYXRpb25bXT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKChvcHRpb25zOiBTZXJ2aWNlcy5EZWZpbml0aW9uLklSZXF1ZXN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RzID0gXy5vdmVyKGNhbGxiYWNrcykob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20ocmVxdWVzdHMpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoXy5pZGVudGl0eSlcclxuICAgICAgICAgICAgICAgIC5zY2FuKChhY2MsIHZhbHVlKSA9PiB7IGFjYy5wdXNoKC4uLnZhbHVlKTsgcmV0dXJuIGFjYzsgfSwgW10pXHJcbiAgICAgICAgICAgICAgICAuZGVib3VuY2VUaW1lKDIwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oKSB7XHJcbiAgICAgICAgbGV0IHZpZXc6IFJlZmVyZW5jZVZpZXc7XHJcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuX3NvdXJjZS5hY3RpdmVUZXh0RWRpdG9yO1xyXG4gICAgICAgIGlmIChlZGl0b3IpIHtcclxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uID0gdGhpcy5pbnZva2Uoe1xyXG4gICAgICAgICAgICAgICAgZWRpdG9yOiBlZGl0b3IsXHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogZWRpdG9yIS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXHJcbiAgICAgICAgICAgIH0pLmRvKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdGlvbi5uYXZpZ2F0ZVRvKHJlc3VsdHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihyZXN1bHRzID0+IHJlc3VsdHMubGVuZ3RoID4gMSlcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcChcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gXyhyZXN1bHRzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHJlc3VsdCA9PiByZXN1bHQuZmlsZVBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb21wYWN0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnVuaXEoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZpbGVQYXRoID0+IHJlYWRGaWxlJChmaWxlUGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoY29udGVudCA9PiAoeyBmaWxlUGF0aCwgY29udGVudDogY29udGVudC50b1N0cmluZygpLnNwbGl0KC8oPzpcXG58XFxyXFxufFxccikvZykgfSkpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZm9ya0pvaW4oZmlsZXMpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIChyZXN1bHRzLCBmaWxlcykgPT4gKHsgcmVzdWx0cywgZmlsZXMgfSkpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCh7cmVzdWx0cywgZmlsZXN9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbXM6IFNlcnZpY2VzLlJlZmVyZW5jZS5JUmVzcG9uc2VbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVBhdGggPSByZXN1bHQuZmlsZVBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSBfLmZpbmQoZmlsZXMsIGZpbGUgPT4gZmlsZS5maWxlUGF0aCA9PT0gcmVzdWx0LmZpbGVQYXRoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0aW9uSGFzUmFuZ2UocmVzdWx0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSByZXN1bHQucmFuZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lcyA9IF8ubWFwKF8ucmFuZ2UocmFuZ2Uuc3RhcnQucm93LCByYW5nZS5lbmQucm93ICsgMSksIGxpbmUgPT4gZmlsZS5jb250ZW50W2xpbmVdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcgPSBuZXcgUmVmZXJlbmNlVmlldyh0aGlzLl9jb21tYW5kcywgdGhpcy5fbmF2aWdhdGlvbiwgaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0SXRlbXMoaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=