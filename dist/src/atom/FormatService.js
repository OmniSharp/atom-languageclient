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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var decorators_2 = require('../decorators');
var AtomChanges_1 = require('./AtomChanges');
var AtomCommands_1 = require('./AtomCommands');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var CommandsService_1 = require('./CommandsService');
var FormatService = (function (_super) {
    __extends(FormatService, _super);
    function FormatService(changes, commands, atomCommands, source) {
        var _this = this;
        _super.call(this);
        this._changes = changes;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
        this._disposable.add(this._commands.add(atom_languageservices_1.CommandType.TextEditor, "code-format", 'ctrl-k ctrl-d', function () { return _this.format(source.activeTextEditor); }), this._atomCommands.add(atom_languageservices_1.CommandType.TextEditor, "format-document", function () { return _this.formatDocument(source.activeTextEditor); }), this._atomCommands.add(atom_languageservices_1.CommandType.TextEditor, "format-range", function () { return _this.formatRange(source.activeTextEditor); }));
    }
    FormatService.prototype.onEnabled = function () {
        var _this = this;
        return new ts_disposables_1.CompositeDisposable(this._commands.add(atom_languageservices_1.CommandType.TextEditor, "code-format", 'ctrl-k ctrl-d', function () { return _this.format(_this._source.activeTextEditor); }), this._atomCommands.add(atom_languageservices_1.CommandType.TextEditor, "format-document", function () { return _this.formatDocument(_this._source.activeTextEditor); }), this._atomCommands.add(atom_languageservices_1.CommandType.TextEditor, "format-range", function () { return _this.formatRange(_this._source.activeTextEditor); }));
    };
    FormatService.prototype.createInvoke = function (callbacks) {
        return function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce(function (acc, results) { return _.compact(acc.concat(results)); }, []);
        };
    };
    FormatService.prototype.format = function (editor) {
        if (!editor) {
            return;
        }
        var ranges = editor.getSelectedBufferRanges();
        if (ranges.length) {
            this._formatRange(editor, ranges);
            return;
        }
        this.formatDocument(editor);
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
    FormatService.prototype._formatRange = function (editor, ranges) {
        var _this = this;
        rxjs_1.Observable.from(ranges)
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
    FormatService.prototype.formatRange = function (editor) {
        if (!editor) {
            return;
        }
        this._formatRange(editor, editor.getSelectedBufferRanges());
    };
    FormatService = __decorate([
        decorators_1.injectable(),
        decorators_1.alias(atom_languageservices_1.IFormatService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for formating documents'
        }), 
        __metadata('design:paramtypes', [AtomChanges_1.AtomChanges, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], FormatService);
    return FormatService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.FormatService = FormatService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybWF0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL0Zvcm1hdFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRzs7Ozs7Ozs7Ozs7Ozs7OztBQUVILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBMkUsdUJBQXVCLENBQUMsQ0FBQTtBQUNuRywyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBb0MsZ0JBQWdCLENBQUMsQ0FBQTtBQUNyRCxxQ0FBb0Msd0JBQXdCLENBQUMsQ0FBQTtBQUM3RCwyQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsNEJBQTRCLGVBQWUsQ0FBQyxDQUFBO0FBQzVDLDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELGdDQUFnQyxtQkFBbUIsQ0FBQyxDQUFBO0FBUXBEO0lBQ1ksaUNBQXFIO0lBTzdILHVCQUFtQixPQUFvQixFQUFFLFFBQXlCLEVBQUUsWUFBMEIsRUFBRSxNQUE0QjtRQVJoSSxpQkFzRkM7UUE3RU8saUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBRWxDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQ0FBVyxDQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFwQyxDQUFvQyxD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QUM7UUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sb0NBQVksR0FBcEIsVUFBcUIsTUFBdUIsRUFBRSxNQUEwQjtRQUF4RSxpQkFZQztRQVhHLGlCQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUNsQixTQUFTLENBQUMsVUFBQSxLQUFLO1lBQ1osTUFBTSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsY0FBTSxFQUFFLFlBQUs7Z0JBQ2IsWUFBWSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUU7Z0JBQ25DLE9BQU8sRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFO2FBQ2pDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBQSxPQUFPO2dCQUNULEtBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQzthQUNELFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxtQ0FBVyxHQUFsQixVQUFtQixNQUF1QjtRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBMUZMO1FBQUMsdUJBQVUsRUFBRTtRQUNaLGtCQUFLLENBQUMsc0NBQWMsQ0FBQztRQUNyQix1QkFBVSxDQUFDO1lBQ1IsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsc0NBQXNDO1NBQ3RELENBQUM7O3FCQUFBO0lBdUZGLG9CQUFDO0FBQUQsQ0FBQyxBQXRGRCxDQUNZLDBDQUFtQixHQXFGOUI7QUF0RlkscUJBQWEsZ0JBc0Z6QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDb21tYW5kVHlwZSwgRm9ybWF0LCBJRm9ybWF0UHJvdmlkZXIsIElGb3JtYXRTZXJ2aWNlLCBUZXh0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgYXRvbUNvbmZpZyB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBBdG9tQ2hhbmdlcyB9IGZyb20gJy4vQXRvbUNoYW5nZXMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IENvbW1hbmRzU2VydmljZSB9IGZyb20gJy4vQ29tbWFuZHNTZXJ2aWNlJztcclxuXHJcbkBpbmplY3RhYmxlKClcclxuQGFsaWFzKElGb3JtYXRTZXJ2aWNlKVxyXG5AYXRvbUNvbmZpZyh7XHJcbiAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgZGVzY3JpcHRpb246ICdBZGRzIHN1cHBvcnQgZm9yIGZvcm1hdGluZyBkb2N1bWVudHMnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGb3JtYXRTZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8SUZvcm1hdFByb3ZpZGVyLCBGb3JtYXQuSVJlcXVlc3QsIE9ic2VydmFibGU8VGV4dC5JRmlsZUNoYW5nZVtdPiwgT2JzZXJ2YWJsZTxUZXh0LklGaWxlQ2hhbmdlW10+PlxyXG4gICAgaW1wbGVtZW50cyBJRm9ybWF0U2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9jaGFuZ2VzOiBBdG9tQ2hhbmdlcztcclxuICAgIHByaXZhdGUgX2NvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9hdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNoYW5nZXM6IEF0b21DaGFuZ2VzLCBjb21tYW5kczogQ29tbWFuZHNTZXJ2aWNlLCBhdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcywgc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2hhbmdlcyA9IGNoYW5nZXM7XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl9zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fYXRvbUNvbW1hbmRzID0gYXRvbUNvbW1hbmRzO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgdGhpcy5fY29tbWFuZHMuYWRkKENvbW1hbmRUeXBlLlRleHRFZGl0b3IsIGBjb2RlLWZvcm1hdGAsICdjdHJsLWsgY3RybC1kJywgKCkgPT4gdGhpcy5mb3JtYXQoc291cmNlLmFjdGl2ZVRleHRFZGl0b3IpKSxcclxuICAgICAgICAgICAgdGhpcy5fYXRvbUNvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5UZXh0RWRpdG9yLCBgZm9ybWF0LWRvY3VtZW50YCwgKCkgPT4gdGhpcy5mb3JtYXREb2N1bWVudChzb3VyY2UuYWN0aXZlVGV4dEVkaXRvcikpLFxyXG4gICAgICAgICAgICB0aGlzLl9hdG9tQ29tbWFuZHMuYWRkKENvbW1hbmRUeXBlLlRleHRFZGl0b3IsIGBmb3JtYXQtcmFuZ2VgLCAoKSA9PiB0aGlzLmZvcm1hdFJhbmdlKHNvdXJjZS5hY3RpdmVUZXh0RWRpdG9yKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxyXG4gICAgICAgICAgICB0aGlzLl9jb21tYW5kcy5hZGQoQ29tbWFuZFR5cGUuVGV4dEVkaXRvciwgYGNvZGUtZm9ybWF0YCwgJ2N0cmwtayBjdHJsLWQnLCAoKSA9PiB0aGlzLmZvcm1hdCh0aGlzLl9zb3VyY2UuYWN0aXZlVGV4dEVkaXRvcikpLFxyXG4gICAgICAgICAgICB0aGlzLl9hdG9tQ29tbWFuZHMuYWRkKENvbW1hbmRUeXBlLlRleHRFZGl0b3IsIGBmb3JtYXQtZG9jdW1lbnRgLCAoKSA9PiB0aGlzLmZvcm1hdERvY3VtZW50KHRoaXMuX3NvdXJjZS5hY3RpdmVUZXh0RWRpdG9yKSksXHJcbiAgICAgICAgICAgIHRoaXMuX2F0b21Db21tYW5kcy5hZGQoQ29tbWFuZFR5cGUuVGV4dEVkaXRvciwgYGZvcm1hdC1yYW5nZWAsICgpID0+IHRoaXMuZm9ybWF0UmFuZ2UodGhpcy5fc291cmNlLmFjdGl2ZVRleHRFZGl0b3IpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgoKG9wdGlvbnM6IEZvcm1hdC5JUmVxdWVzdCkgPT4gT2JzZXJ2YWJsZTxUZXh0LklGaWxlQ2hhbmdlW10+KVtdKSkge1xyXG4gICAgICAgIHJldHVybiAob3B0aW9uczogRm9ybWF0LklSZXF1ZXN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20oXy5vdmVyKGNhbGxiYWNrcykob3B0aW9ucykpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoXy5pZGVudGl0eSlcclxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcmVzdWx0cykgPT4gXy5jb21wYWN0KGFjYy5jb25jYXQocmVzdWx0cykpLCBbXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9ybWF0KGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgaWYgKCFlZGl0b3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmFuZ2VzID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCk7XHJcbiAgICAgICAgaWYgKHJhbmdlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZm9ybWF0UmFuZ2UoZWRpdG9yLCByYW5nZXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZm9ybWF0RG9jdW1lbnQoZWRpdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZm9ybWF0RG9jdW1lbnQoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBpZiAoIWVkaXRvcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmludm9rZSh7XHJcbiAgICAgICAgICAgIGVkaXRvcixcclxuICAgICAgICAgICAgaW5zZXJ0U3BhY2VzOiBlZGl0b3IudXNlc1NvZnRUYWJzKCksXHJcbiAgICAgICAgICAgIHRhYlNpemU6IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxyXG4gICAgICAgIH0pLnN1YnNjcmliZShjaGFuZ2VzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY2hhbmdlcy5hcHBseUNoYW5nZXMoZWRpdG9yLCBjaGFuZ2VzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9mb3JtYXRSYW5nZShlZGl0b3I6IEF0b20uVGV4dEVkaXRvciwgcmFuZ2VzOiBUZXh0QnVmZmVyLlJhbmdlW10pIHtcclxuICAgICAgICBPYnNlcnZhYmxlLmZyb20ocmFuZ2VzKVxyXG4gICAgICAgICAgICAuY29uY2F0TWFwKHJhbmdlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmludm9rZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLCByYW5nZSxcclxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRTcGFjZXM6IGVkaXRvci51c2VzU29mdFRhYnMoKSxcclxuICAgICAgICAgICAgICAgICAgICB0YWJTaXplOiBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcclxuICAgICAgICAgICAgICAgIH0pLmRvKGNoYW5nZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZXMuYXBwbHlDaGFuZ2VzKGVkaXRvciwgY2hhbmdlcyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb3JtYXRSYW5nZShlZGl0b3I6IEF0b20uVGV4dEVkaXRvcikge1xyXG4gICAgICAgIGlmICghZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZm9ybWF0UmFuZ2UoZWRpdG9yLCBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoKSk7XHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ==