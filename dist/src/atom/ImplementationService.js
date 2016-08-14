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
var ImplementationService = (function (_super) {
    __extends(ImplementationService, _super);
    function ImplementationService(navigation, commands, atomCommands, source) {
        _super.call(this);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
    }
    ImplementationService.prototype.onEnabled = function () {
        var _this = this;
        return this._commands.add(atom_languageservices_1.CommandType.TextEditor, 'go-to-implementation', 'ctrl-f12', function () { return _this.open(); });
    };
    ImplementationService.prototype.createInvoke = function (callbacks) {
        return (function (options) {
            var requests = _.over(callbacks)(options);
            return rxjs_1.Observable.from(requests)
                .mergeMap(_.identity)
                .scan(function (acc, value) { acc.push.apply(acc, value); return acc; }, [])
                .debounceTime(200);
        });
    };
    ImplementationService.prototype.open = function () {
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
    ImplementationService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IImplementationService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for navigate to implementation or implementations'
        }), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], ImplementationService);
    return ImplementationService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.ImplementationService = ImplementationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wbGVtZW50YXRpb25TZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vSW1wbGVtZW50YXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBeUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsc0NBQTZJLHVCQUF1QixDQUFDLENBQUE7QUFDckssMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUsbUJBQXlCLElBQUksQ0FBQyxDQUFBO0FBQzlCLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzdELDJCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUMzQyw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5QywrQkFBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCxnQ0FBZ0MsbUJBQW1CLENBQUMsQ0FBQTtBQUNwRCw4QkFBOEIsdUJBQXVCLENBQUMsQ0FBQTtBQUd0RCxJQUFNLFNBQVMsR0FBRyxpQkFBVSxDQUFDLGdCQUFnQixDQUFDLGFBQVEsQ0FBQyxDQUFDO0FBT3hEO0lBQ1kseUNBQXFIO0lBTzdILCtCQUFZLFVBQTBCLEVBQUUsUUFBeUIsRUFBRSxZQUEwQixFQUFFLE1BQTRCO1FBQ3ZILGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztJQUN0QyxDQUFDO0lBRU0seUNBQVMsR0FBaEI7UUFBQSxpQkFFQztRQURHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FB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QUM3Qix1QkFBVSxDQUFDO1lBQ1IsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsZ0VBQWdFO1NBQ2hGLENBQUM7OzZCQUFBO0lBb0ZGLDRCQUFDO0FBQUQsQ0FBQyxBQW5GRCxDQUNZLDBDQUFtQixHQWtGOUI7QUFuRlksNkJBQXFCLHdCQW1GakMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENvbW1hbmRUeXBlLCBJQXRvbU5hdmlnYXRpb24sIElJbXBsZW1lbnRhdGlvblByb3ZpZGVyLCBJSW1wbGVtZW50YXRpb25TZXJ2aWNlLCBJbXBsZW1lbnRhdGlvbiwgUmVmZXJlbmNlLCBuYXZpZ2F0aW9uSGFzUmFuZ2UgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgYXRvbUNvbmZpZyB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21OYXZpZ2F0aW9uIH0gZnJvbSAnLi9BdG9tTmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IENvbW1hbmRzU2VydmljZSB9IGZyb20gJy4vQ29tbWFuZHNTZXJ2aWNlJztcclxuaW1wb3J0IHsgUmVmZXJlbmNlVmlldyB9IGZyb20gJy4vdmlld3MvUmVmZXJlbmNlVmlldyc7XHJcbnR5cGUgTG9jYXRpb24gPSBJQXRvbU5hdmlnYXRpb24uTG9jYXRpb247XHJcblxyXG5jb25zdCByZWFkRmlsZSQgPSBPYnNlcnZhYmxlLmJpbmROb2RlQ2FsbGJhY2socmVhZEZpbGUpO1xyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSUltcGxlbWVudGF0aW9uU2VydmljZSlcclxuQGF0b21Db25maWcoe1xyXG4gICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBzdXBwb3J0IGZvciBuYXZpZ2F0ZSB0byBpbXBsZW1lbnRhdGlvbiBvciBpbXBsZW1lbnRhdGlvbnMnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBJbXBsZW1lbnRhdGlvblNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxJSW1wbGVtZW50YXRpb25Qcm92aWRlciwgSW1wbGVtZW50YXRpb24uSVJlcXVlc3QsIE9ic2VydmFibGU8TG9jYXRpb25bXT4sIE9ic2VydmFibGU8TG9jYXRpb25bXT4+XHJcbiAgICBpbXBsZW1lbnRzIElJbXBsZW1lbnRhdGlvblNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb247XHJcbiAgICBwcml2YXRlIF9jb21tYW5kczogQ29tbWFuZHNTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfYXRvbUNvbW1hbmRzOiBBdG9tQ29tbWFuZHM7XHJcbiAgICBwcml2YXRlIF9zb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uLCBjb21tYW5kczogQ29tbWFuZHNTZXJ2aWNlLCBhdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcywgc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbiA9IG5hdmlnYXRpb247XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fYXRvbUNvbW1hbmRzID0gYXRvbUNvbW1hbmRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5UZXh0RWRpdG9yLCAnZ28tdG8taW1wbGVtZW50YXRpb24nLCAnY3RybC1mMTInLCAoKSA9PiB0aGlzLm9wZW4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgob3B0aW9uczogSW1wbGVtZW50YXRpb24uSVJlcXVlc3QpID0+IE9ic2VydmFibGU8TG9jYXRpb25bXT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKChvcHRpb25zOiBJbXBsZW1lbnRhdGlvbi5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0cyA9IF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKHJlcXVlc3RzKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAuc2NhbigoYWNjLCB2YWx1ZSkgPT4geyBhY2MucHVzaCguLi52YWx1ZSk7IHJldHVybiBhY2M7IH0sIFtdKVxyXG4gICAgICAgICAgICAgICAgLmRlYm91bmNlVGltZSgyMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCkge1xyXG4gICAgICAgIGxldCB2aWV3OiBSZWZlcmVuY2VWaWV3O1xyXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICAgICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLl9zb3VyY2UuYWN0aXZlVGV4dEVkaXRvcjtcclxuICAgICAgICBpZiAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IHRoaXMuaW52b2tlKHtcclxuICAgICAgICAgICAgICAgIGVkaXRvcjogZWRpdG9yLFxyXG4gICAgICAgICAgICAgICAgbG9jYXRpb246IGVkaXRvciEuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxyXG4gICAgICAgICAgICB9KS5kbyhyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25hdmlnYXRpb24ubmF2aWdhdGVUbyhyZXN1bHRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIocmVzdWx0cyA9PiByZXN1bHRzLmxlbmd0aCA+IDEpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoXHJcbiAgICAgICAgICAgICAgICByZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlcyA9IF8ocmVzdWx0cylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChyZXN1bHQgPT4gcmVzdWx0LmZpbGVQYXRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29tcGFjdCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC51bmlxKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChmaWxlUGF0aCA9PiByZWFkRmlsZSQoZmlsZVBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGNvbnRlbnQgPT4gKHsgZmlsZVBhdGgsIGNvbnRlbnQ6IGNvbnRlbnQudG9TdHJpbmcoKS5zcGxpdCgvKD86XFxufFxcclxcbnxcXHIpL2cpIH0pKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnZhbHVlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZvcmtKb2luKGZpbGVzKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAocmVzdWx0cywgZmlsZXMpID0+ICh7IHJlc3VsdHMsIGZpbGVzIH0pKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoe3Jlc3VsdHMsIGZpbGVzfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1zOiBSZWZlcmVuY2UuSVJlc3BvbnNlW10gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcmVzdWx0LmZpbGVQYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gXy5maW5kKGZpbGVzLCBmaWxlID0+IGZpbGUuZmlsZVBhdGggPT09IHJlc3VsdC5maWxlUGF0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmF2aWdhdGlvbkhhc1JhbmdlKHJlc3VsdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gcmVzdWx0LnJhbmdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBfLm1hcChfLnJhbmdlKHJhbmdlLnN0YXJ0LnJvdywgcmFuZ2UuZW5kLnJvdyArIDEpLCBsaW5lID0+IGZpbGUuY29udGVudFtsaW5lXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3ID0gbmV3IFJlZmVyZW5jZVZpZXcodGhpcy5fYXRvbUNvbW1hbmRzLCB0aGlzLl9uYXZpZ2F0aW9uLCBpdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5zZXRJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==