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
var ReferencesService = (function (_super) {
    __extends(ReferencesService, _super);
    function ReferencesService(navigation, commands, source) {
        var _this = this;
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._commands.add(Services.AtomCommands.CommandType.TextEditor, 'references', function () { return _this.open(); });
    }
    ReferencesService.prototype.createInvoke = function (callbacks) {
        return (function (options) {
            var requests = _.over(callbacks)(options);
            return rxjs_1.Observable.from(requests)
                .mergeMap(_.identity)
                .scan(function (acc, value) { acc.push.apply(acc, value); return acc; }, [])
                .debounceTime(200);
        });
    };
    ReferencesService.prototype.open = function () {
        var _this = this;
        var view;
        this.invoke(this._source.activeTextEditor)
            .switchMap(function (results) {
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
    };
    ReferencesService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(Services.IReferencesService), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], ReferencesService);
    return ReferencesService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.ReferencesService = ReferencesService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVmZXJlbmNlc1NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9SZWZlcmVuY2VzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLElBQVksUUFBUSxXQUFNLHVCQUF1QixDQUFDLENBQUE7QUFDbEQsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUsbUJBQXlCLElBQUksQ0FBQyxDQUFBO0FBQzlCLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzdELDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELDhCQUE4Qix1QkFBdUIsQ0FBQyxDQUFBO0FBQy9DLG1FQUFrQixDQUE0QjtBQUVyRCxJQUFNLFNBQVMsR0FBRyxpQkFBVSxDQUFDLGdCQUFnQixDQUFDLGFBQVEsQ0FBQyxDQUFDO0FBSXhEO0lBQ1kscUNBQWtLO0lBTTFLLDJCQUFZLFVBQTBCLEVBQUUsUUFBc0IsRUFBRSxNQUE0QjtRQVBoRyxpQkFrRUM7UUExRE8saUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBRXRCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxJQUFJLEVBQUUsRUFBWCxDQUFXLENBQUMsQ0FBQztJQUN0RyxDQUFDO0lBRVMsd0NB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LE1BQU0sZ0JBQUE7O2FBY2hCO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNSLElBQUksR0FBRyxJQUFJLDZCQUFhLENBQUMsS0FBSSxDQUFDLFNBQVMsRUFBRSxLQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFuRUw7UUFBQyx1QkFBVTtRQUNWLGtCQUFLLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDOzt5QkFBQTtJQW1FbkMsd0JBQUM7QUFBRCxDQUFDLEFBbEVELENBQ1ksMENBQW1CLEdBaUU5QjtBQWxFWSx5QkFBaUIsb0JBa0U3QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCAqIGFzIFNlcnZpY2VzIGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyByZWFkRmlsZSB9IGZyb20gJ2ZzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21OYXZpZ2F0aW9uIH0gZnJvbSAnLi9BdG9tTmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IFJlZmVyZW5jZVZpZXcgfSBmcm9tICcuL3ZpZXdzL1JlZmVyZW5jZVZpZXcnO1xyXG5jb25zdCB7bmF2aWdhdGlvbkhhc1JhbmdlfSA9IFNlcnZpY2VzLkF0b21OYXZpZ2F0aW9uO1xyXG5cclxuY29uc3QgcmVhZEZpbGUkID0gT2JzZXJ2YWJsZS5iaW5kTm9kZUNhbGxiYWNrKHJlYWRGaWxlKTtcclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhTZXJ2aWNlcy5JUmVmZXJlbmNlc1NlcnZpY2UpXHJcbmV4cG9ydCBjbGFzcyBSZWZlcmVuY2VzU2VydmljZVxyXG4gICAgZXh0ZW5kcyBQcm92aWRlclNlcnZpY2VCYXNlPFNlcnZpY2VzLklSZWZlcmVuY2VzUHJvdmlkZXIsIEF0b20uVGV4dEVkaXRvciwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5BdG9tTmF2aWdhdGlvbi5Mb2NhdGlvbltdPiwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5BdG9tTmF2aWdhdGlvbi5Mb2NhdGlvbltdPj5cclxuICAgIGltcGxlbWVudHMgU2VydmljZXMuSVJlZmVyZW5jZXNTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX25hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IobmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb24sIGNvbW1hbmRzOiBBdG9tQ29tbWFuZHMsIHNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21tYW5kcy5hZGQoU2VydmljZXMuQXRvbUNvbW1hbmRzLkNvbW1hbmRUeXBlLlRleHRFZGl0b3IsICdyZWZlcmVuY2VzJywgKCkgPT4gdGhpcy5vcGVuKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IEF0b20uVGV4dEVkaXRvcikgPT4gT2JzZXJ2YWJsZTxTZXJ2aWNlcy5BdG9tTmF2aWdhdGlvbi5Mb2NhdGlvbltdPilbXSkge1xyXG4gICAgICAgIHJldHVybiAoKG9wdGlvbnM6IEF0b20uVGV4dEVkaXRvcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0cyA9IF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKHJlcXVlc3RzKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAuc2NhbigoYWNjLCB2YWx1ZSkgPT4geyBhY2MucHVzaCguLi52YWx1ZSk7IHJldHVybiBhY2M7IH0sIFtdKVxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlVGltZSgyMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCkge1xyXG4gICAgICAgIGxldCB2aWV3OiBSZWZlcmVuY2VWaWV3O1xyXG4gICAgICAgIHRoaXMuaW52b2tlKHRoaXMuX3NvdXJjZS5hY3RpdmVUZXh0RWRpdG9yKVxyXG4gICAgICAgICAgICAuc3dpdGNoTWFwKFxyXG4gICAgICAgICAgICByZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gXyhyZXN1bHRzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAocmVzdWx0ID0+IHJlc3VsdC5maWxlUGF0aClcclxuICAgICAgICAgICAgICAgICAgICAuY29tcGFjdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnVuaXEoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZmlsZVBhdGggPT4gcmVhZEZpbGUkKGZpbGVQYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGNvbnRlbnQgPT4gKHsgZmlsZVBhdGgsIGNvbnRlbnQ6IGNvbnRlbnQudG9TdHJpbmcoKS5zcGxpdCgvKD86XFxufFxcclxcbnxcXHIpL2cpIH0pKSlcclxuICAgICAgICAgICAgICAgICAgICAudmFsdWUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mb3JrSm9pbihmaWxlcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIChyZXN1bHRzLCBmaWxlcykgPT4gKHsgcmVzdWx0cywgZmlsZXMgfSkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKHtyZXN1bHRzLCBmaWxlc30pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zOiBTZXJ2aWNlcy5SZWZlcmVuY2UuSVJlc3BvbnNlW10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHJlc3VsdC5maWxlUGF0aDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gXy5maW5kKGZpbGVzLCBmaWxlID0+IGZpbGUuZmlsZVBhdGggPT09IHJlc3VsdC5maWxlUGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuYXZpZ2F0aW9uSGFzUmFuZ2UocmVzdWx0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IHJlc3VsdC5yYW5nZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBfLm1hcChfLnJhbmdlKHJhbmdlLnN0YXJ0LnJvdywgcmFuZ2UuZW5kLnJvdyArIDEpLCBsaW5lID0+IGZpbGUuY29udGVudFtsaW5lXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3ID0gbmV3IFJlZmVyZW5jZVZpZXcodGhpcy5fY29tbWFuZHMsIHRoaXMuX25hdmlnYXRpb24sIGl0ZW1zKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5zZXRJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==