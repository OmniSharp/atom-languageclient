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
var fs_1 = require('fs');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var decorators_2 = require('../decorators');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var CommandsService_1 = require('./CommandsService');
var ReferenceView_1 = require('./views/ReferenceView');
var readFile$ = rxjs_1.Observable.bindNodeCallback(fs_1.readFile);
var ReferencesService = (function (_super) {
    __extends(ReferencesService, _super);
    function ReferencesService(navigation, commands, atomCommands, source) {
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
    }
    ReferencesService.prototype.onEnabled = function () {
        var _this = this;
        return this._commands.add(atom_languageservices_1.CommandType.TextEditor, 'find-usages', 'shift-f12', function () {
            var editor = _this._source.activeTextEditor;
            _this.open({
                editor: editor,
                position: editor.getCursorScreenPosition(),
                filePath: editor.getURI()
            });
        });
    };
    ReferencesService.prototype.createInvoke = function (callbacks) {
        return (function (options) {
            var requests = _.over(callbacks)(options);
            return rxjs_1.Observable.from(requests)
                .mergeMap(_.identity)
                .scan(function (acc, value) { acc.push.apply(acc, value); return acc; }, [])
                .debounceTime(200);
        });
    };
    ReferencesService.prototype.open = function (options) {
        var _this = this;
        var view;
        this.invoke(options)
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
                if (atom_languageservices_1.navigationHasRange(result)) {
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
                view = new ReferenceView_1.ReferenceView(_this._atomCommands, _this._navigation, items);
            }
            else {
                view.setItems(items);
            }
        });
    };
    ReferencesService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IReferencesService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support to find references.'
        }), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], ReferencesService);
    return ReferencesService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.ReferencesService = ReferencesService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVmZXJlbmNlc1NlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9SZWZlcmVuY2VzU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUFxSCx1QkFBdUIsQ0FBQyxDQUFBO0FBQzdJLDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JFLG1CQUF5QixJQUFJLENBQUMsQ0FBQTtBQUM5QixxQ0FBb0Msd0JBQXdCLENBQUMsQ0FBQTtBQUM3RCwyQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsNkJBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFDOUMsK0JBQStCLGtCQUFrQixDQUFDLENBQUE7QUFDbEQscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFDOUQsZ0NBQWdDLG1CQUFtQixDQUFDLENBQUE7QUFDcEQsOEJBQThCLHVCQUF1QixDQUFDLENBQUE7QUFHdEQsSUFBTSxTQUFTLEdBQUcsaUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFRLENBQUMsQ0FBQztBQVF4RDtJQUNZLHFDQUE0RztJQU9wSCwyQkFBWSxVQUEwQixFQUFFLFFBQXlCLEVBQUUsWUFBMEIsRUFBRSxNQUE0QjtRQUN2SCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7SUFDdEMsQ0FBQztJQUVNLHFDQUFTLEdBQWhCO1FBQUEsaUJBU0M7UUFSRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUNBQVcs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QUcsQ0FBQyxDQUFDLEVBQUUsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUM7b0JBRTdGLEtBQUssQ0FBQyxJQUFJLENBQUM7d0JBQ1Asa0JBQVE7d0JBQ1IsWUFBSzt3QkFDTCxZQUFLO3FCQUNSLENBQUMsQ0FBQztnQkFDUCxDQUFDOztZQWJMLEdBQUcsQ0FBQyxDQUFpQixVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sQ0FBQztnQkFBeEIsSUFBTSxNQUFNLGdCQUFBOzthQWNoQjtZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLEdBQUcsSUFBSSw2QkFBYSxDQUFDLEtBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxRSxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QixDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBbEZMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLDBDQUFrQixDQUFDO1FBQ3pCLHVCQUFVLENBQUM7WUFDUixPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxrQ0FBa0M7U0FDbEQsQ0FBQzs7eUJBQUE7SUE4RUYsd0JBQUM7QUFBRCxDQUFDLEFBN0VELENBQ1ksMENBQW1CLEdBNEU5QjtBQTdFWSx5QkFBaUIsb0JBNkU3QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENvbW1hbmRUeXBlLCBJQXRvbU5hdmlnYXRpb24sIElSZWZlcmVuY2VzUHJvdmlkZXIsIElSZWZlcmVuY2VzU2VydmljZSwgUmVmZXJlbmNlLCBuYXZpZ2F0aW9uSGFzUmFuZ2UgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgYXRvbUNvbmZpZyB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21OYXZpZ2F0aW9uIH0gZnJvbSAnLi9BdG9tTmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IENvbW1hbmRzU2VydmljZSB9IGZyb20gJy4vQ29tbWFuZHNTZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVmZXJlbmNlVmlldyB9IGZyb20gJy4vdmlld3MvUmVmZXJlbmNlVmlldyc7XHJcbnR5cGUgTG9jYXRpb24gPSBJQXRvbU5hdmlnYXRpb24uTG9jYXRpb247XHJcblxyXG5jb25zdCByZWFkRmlsZSQgPSBPYnNlcnZhYmxlLmJpbmROb2RlQ2FsbGJhY2socmVhZEZpbGUpO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElSZWZlcmVuY2VzU2VydmljZSlcclxuQGF0b21Db25maWcoe1xyXG4gICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBzdXBwb3J0IHRvIGZpbmQgcmVmZXJlbmNlcy4nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSZWZlcmVuY2VzU2VydmljZVxyXG4gICAgZXh0ZW5kcyBQcm92aWRlclNlcnZpY2VCYXNlPElSZWZlcmVuY2VzUHJvdmlkZXIsIFJlZmVyZW5jZS5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxMb2NhdGlvbltdPiwgT2JzZXJ2YWJsZTxMb2NhdGlvbltdPj5cclxuICAgIGltcGxlbWVudHMgSVJlZmVyZW5jZXNTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX25hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IENvbW1hbmRzU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21Db21tYW5kczogQXRvbUNvbW1hbmRzO1xyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbiwgY29tbWFuZHM6IENvbW1hbmRzU2VydmljZSwgYXRvbUNvbW1hbmRzOiBBdG9tQ29tbWFuZHMsIHNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX2F0b21Db21tYW5kcyA9IGF0b21Db21tYW5kcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21tYW5kcy5hZGQoQ29tbWFuZFR5cGUuVGV4dEVkaXRvciwgJ2ZpbmQtdXNhZ2VzJywgJ3NoaWZ0LWYxMicsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZWRpdG9yID0gdGhpcy5fc291cmNlLmFjdGl2ZVRleHRFZGl0b3I7XHJcbiAgICAgICAgICAgIHRoaXMub3Blbih7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3I6IGVkaXRvcixcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSxcclxuICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBlZGl0b3IuZ2V0VVJJKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgoY29udGV4dDogUmVmZXJlbmNlLklSZXF1ZXN0KSA9PiBPYnNlcnZhYmxlPExvY2F0aW9uW10+KVtdKSB7XHJcbiAgICAgICAgcmV0dXJuICgob3B0aW9uczogUmVmZXJlbmNlLklSZXF1ZXN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RzID0gXy5vdmVyKGNhbGxiYWNrcykob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20ocmVxdWVzdHMpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoXy5pZGVudGl0eSlcclxuICAgICAgICAgICAgICAgIC5zY2FuKChhY2MsIHZhbHVlKSA9PiB7IGFjYy5wdXNoKC4uLnZhbHVlKTsgcmV0dXJuIGFjYzsgfSwgW10pXHJcbiAgICAgICAgICAgICAgICAuZGVib3VuY2VUaW1lKDIwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4ob3B0aW9uczogUmVmZXJlbmNlLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgbGV0IHZpZXc6IFJlZmVyZW5jZVZpZXc7XHJcbiAgICAgICAgdGhpcy5pbnZva2Uob3B0aW9ucylcclxuICAgICAgICAgICAgLnN3aXRjaE1hcChcclxuICAgICAgICAgICAgcmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IF8ocmVzdWx0cylcclxuICAgICAgICAgICAgICAgICAgICAubWFwKHJlc3VsdCA9PiByZXN1bHQuZmlsZVBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbXBhY3QoKVxyXG4gICAgICAgICAgICAgICAgICAgIC51bmlxKClcclxuICAgICAgICAgICAgICAgICAgICAubWFwKGZpbGVQYXRoID0+IHJlYWRGaWxlJChmaWxlUGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChjb250ZW50ID0+ICh7IGZpbGVQYXRoLCBjb250ZW50OiBjb250ZW50LnRvU3RyaW5nKCkuc3BsaXQoLyg/OlxcbnxcXHJcXG58XFxyKS9nKSB9KSkpXHJcbiAgICAgICAgICAgICAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZm9ya0pvaW4oZmlsZXMpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAocmVzdWx0cywgZmlsZXMpID0+ICh7IHJlc3VsdHMsIGZpbGVzIH0pKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCh7cmVzdWx0cywgZmlsZXN9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtczogUmVmZXJlbmNlLklSZXNwb25zZVtdID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZVBhdGggPSByZXN1bHQuZmlsZVBhdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IF8uZmluZChmaWxlcywgZmlsZSA9PiBmaWxlLmZpbGVQYXRoID09PSByZXN1bHQuZmlsZVBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobmF2aWdhdGlvbkhhc1JhbmdlKHJlc3VsdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZ2UgPSByZXN1bHQucmFuZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gXy5tYXAoXy5yYW5nZShyYW5nZS5zdGFydC5yb3csIHJhbmdlLmVuZC5yb3cgKyAxKSwgbGluZSA9PiBmaWxlLmNvbnRlbnRbbGluZV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCF2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldyA9IG5ldyBSZWZlcmVuY2VWaWV3KHRoaXMuX2F0b21Db21tYW5kcywgdGhpcy5fbmF2aWdhdGlvbiwgaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3LnNldEl0ZW1zKGl0ZW1zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19