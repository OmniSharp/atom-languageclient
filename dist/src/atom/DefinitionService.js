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
var DefinitionService = (function (_super) {
    __extends(DefinitionService, _super);
    function DefinitionService(navigation, commands, atomCommands, source) {
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
    }
    DefinitionService.prototype.onEnabled = function () {
        var _this = this;
        return this._commands.add(atom_languageservices_1.CommandType.TextEditor, 'go-to-definition', 'f12', function () { return _this.open(); });
    };
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
        }
    };
    DefinitionService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IDefinitionService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for navigate to definition or definitions'
        }), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], DefinitionService);
    return DefinitionService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.DefinitionService = DefinitionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVmaW5pdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9EZWZpbml0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQXlDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hELHNDQUFpSSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3pKLDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JFLG1CQUF5QixJQUFJLENBQUMsQ0FBQTtBQUM5QixxQ0FBb0Msd0JBQXdCLENBQUMsQ0FBQTtBQUM3RCwyQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsNkJBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFDOUMsK0JBQStCLGtCQUFrQixDQUFDLENBQUE7QUFDbEQscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFDOUQsZ0NBQWdDLG1CQUFtQixDQUFDLENBQUE7QUFDcEQsOEJBQThCLHVCQUF1QixDQUFDLENBQUE7QUFHdEQsSUFBTSxTQUFTLEdBQUcsaUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFRLENBQUMsQ0FBQztBQU94RDtJQUNZLHFDQUE2RztJQU9ySCwyQkFBWSxVQUEwQixFQUFFLFFBQXlCLEVBQUUsWUFBMEIsRUFBRSxNQUE0QjtRQUN2SCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7SUFDdEMsQ0FBQztJQUVNLHFDQUFTLEdBQWhCO1FBQUEsaUJBRUM7UUFERyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUNBQVcs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QVUsQ0FBQztZQUNSLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLHdEQUF3RDtTQUN4RSxDQUFDOzt5QkFBQTtJQW9GRix3QkFBQztBQUFELENBQUMsQUFuRkQsQ0FDWSwwQ0FBbUIsR0FrRjlCO0FBbkZZLHlCQUFpQixvQkFtRjdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDb21tYW5kVHlwZSwgRGVmaW5pdGlvbiwgSUF0b21OYXZpZ2F0aW9uLCBJRGVmaW5pdGlvblByb3ZpZGVyLCBJRGVmaW5pdGlvblNlcnZpY2UsIFJlZmVyZW5jZSwgbmF2aWdhdGlvbkhhc1JhbmdlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBQcm92aWRlclNlcnZpY2VCYXNlIH0gZnJvbSAnLi9fUHJvdmlkZXJTZXJ2aWNlQmFzZSc7XHJcbmltcG9ydCB7IGF0b21Db25maWcgfSBmcm9tICcuLi9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgQXRvbUNvbW1hbmRzIH0gZnJvbSAnLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tTmF2aWdhdGlvbiB9IGZyb20gJy4vQXRvbU5hdmlnYXRpb24nO1xyXG5pbXBvcnQgeyBBdG9tVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4vQXRvbVRleHRFZGl0b3JTb3VyY2UnO1xyXG5pbXBvcnQgeyBDb21tYW5kc1NlcnZpY2UgfSBmcm9tICcuL0NvbW1hbmRzU2VydmljZSc7XHJcbmltcG9ydCB7IFJlZmVyZW5jZVZpZXcgfSBmcm9tICcuL3ZpZXdzL1JlZmVyZW5jZVZpZXcnO1xyXG50eXBlIExvY2F0aW9uID0gSUF0b21OYXZpZ2F0aW9uLkxvY2F0aW9uO1xyXG5cclxuY29uc3QgcmVhZEZpbGUkID0gT2JzZXJ2YWJsZS5iaW5kTm9kZUNhbGxiYWNrKHJlYWRGaWxlKTtcclxuQGluamVjdGFibGVcclxuQGFsaWFzKElEZWZpbml0aW9uU2VydmljZSlcclxuQGF0b21Db25maWcoe1xyXG4gICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBzdXBwb3J0IGZvciBuYXZpZ2F0ZSB0byBkZWZpbml0aW9uIG9yIGRlZmluaXRpb25zJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgRGVmaW5pdGlvblNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxJRGVmaW5pdGlvblByb3ZpZGVyLCBEZWZpbml0aW9uLklSZXF1ZXN0LCBPYnNlcnZhYmxlPExvY2F0aW9uW10+LCBPYnNlcnZhYmxlPExvY2F0aW9uW10+PlxyXG4gICAgaW1wbGVtZW50cyBJRGVmaW5pdGlvblNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb247XHJcbiAgICBwcml2YXRlIF9jb21tYW5kczogQ29tbWFuZHNTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfYXRvbUNvbW1hbmRzOiBBdG9tQ29tbWFuZHM7XHJcbiAgICBwcml2YXRlIF9zb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uLCBjb21tYW5kczogQ29tbWFuZHNTZXJ2aWNlLCBhdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcywgc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbiA9IG5hdmlnYXRpb247XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fYXRvbUNvbW1hbmRzID0gYXRvbUNvbW1hbmRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5UZXh0RWRpdG9yLCAnZ28tdG8tZGVmaW5pdGlvbicsICdmMTInLCAoKSA9PiB0aGlzLm9wZW4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgob3B0aW9uczogRGVmaW5pdGlvbi5JUmVxdWVzdCkgPT4gT2JzZXJ2YWJsZTxMb2NhdGlvbltdPilbXSkge1xyXG4gICAgICAgIHJldHVybiAoKG9wdGlvbnM6IERlZmluaXRpb24uSVJlcXVlc3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdHMgPSBfLm92ZXIoY2FsbGJhY2tzKShvcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbShyZXF1ZXN0cylcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcChfLmlkZW50aXR5KVxyXG4gICAgICAgICAgICAgICAgLnNjYW4oKGFjYywgdmFsdWUpID0+IHsgYWNjLnB1c2goLi4udmFsdWUpOyByZXR1cm4gYWNjOyB9LCBbXSlcclxuICAgICAgICAgICAgICAgIC5kZWJvdW5jZVRpbWUoMjAwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3BlbigpIHtcclxuICAgICAgICBsZXQgdmlldzogUmVmZXJlbmNlVmlldztcclxuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgICAgICAgY29uc3QgZWRpdG9yID0gdGhpcy5fc291cmNlLmFjdGl2ZVRleHRFZGl0b3I7XHJcbiAgICAgICAgaWYgKGVkaXRvcikge1xyXG4gICAgICAgICAgICBzdWJzY3JpcHRpb24gPSB0aGlzLmludm9rZSh7XHJcbiAgICAgICAgICAgICAgICBlZGl0b3I6IGVkaXRvcixcclxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBlZGl0b3IhLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcclxuICAgICAgICAgICAgfSkuZG8ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYXZpZ2F0aW9uLm5hdmlnYXRlVG8ocmVzdWx0c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHJlc3VsdHMgPT4gcmVzdWx0cy5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZXMgPSBfKHJlc3VsdHMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocmVzdWx0ID0+IHJlc3VsdC5maWxlUGF0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbXBhY3QoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudW5pcSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZmlsZVBhdGggPT4gcmVhZEZpbGUkKGZpbGVQYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChjb250ZW50ID0+ICh7IGZpbGVQYXRoLCBjb250ZW50OiBjb250ZW50LnRvU3RyaW5nKCkuc3BsaXQoLyg/OlxcbnxcXHJcXG58XFxyKS9nKSB9KSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mb3JrSm9pbihmaWxlcyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKHJlc3VsdHMsIGZpbGVzKSA9PiAoeyByZXN1bHRzLCBmaWxlcyB9KSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHtyZXN1bHRzLCBmaWxlc30pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtczogUmVmZXJlbmNlLklSZXNwb25zZVtdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCByZXN1bHQgb2YgcmVzdWx0cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHJlc3VsdC5maWxlUGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IF8uZmluZChmaWxlcywgZmlsZSA9PiBmaWxlLmZpbGVQYXRoID09PSByZXN1bHQuZmlsZVBhdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hdmlnYXRpb25IYXNSYW5nZShyZXN1bHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9IHJlc3VsdC5yYW5nZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gXy5tYXAoXy5yYW5nZShyYW5nZS5zdGFydC5yb3csIHJhbmdlLmVuZC5yb3cgKyAxKSwgbGluZSA9PiBmaWxlLmNvbnRlbnRbbGluZV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldyA9IG5ldyBSZWZlcmVuY2VWaWV3KHRoaXMuX2F0b21Db21tYW5kcywgdGhpcy5fbmF2aWdhdGlvbiwgaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZXcuc2V0SXRlbXMoaXRlbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=