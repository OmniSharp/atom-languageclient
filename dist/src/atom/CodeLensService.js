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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var atom_1 = require('atom');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var decorators_2 = require('../decorators');
var index_1 = require('../helpers/index');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var AtomViewFinder_1 = require('./AtomViewFinder');
var CommandsService_1 = require('./CommandsService');
var CodeLensService = (function (_super) {
    __extends(CodeLensService, _super);
    function CodeLensService(navigation, commands, atomCommands, source, viewFinder, referencesService) {
        var _this = this;
        _super.call(this);
        this._editors = new Set();
        this._refresh = _.debounce(function () {
            _this._editors.forEach(function (x) { return x.refresh(); });
        }, 1000);
        this._navigation = navigation;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
        this._viewFinder = viewFinder;
        this._referencesService = referencesService;
        this._configure();
        this._disposable.add(function () {
            _this._editors.forEach(function (x) { return x.dispose(); });
            _this._editors.clear();
        });
    }
    CodeLensService.prototype._configure = function () {
        this._source.observeTextEditors
            .subscribe(_.bind(this._configureEditor, this));
    };
    CodeLensService.prototype.onEnabled = function () {
        return ts_disposables_1.Disposable.empty;
    };
    CodeLensService.prototype.registerProvider = function (provider) {
        this._refresh();
        return _super.prototype.registerProvider.call(this, provider);
    };
    CodeLensService.prototype.createInvoke = function (callbacks) {
        return (function (options) {
            var requests = _.over(callbacks)(options);
            return rxjs_1.Observable.from(requests)
                .mergeMap(function (x) { return x; })
                .scan(function (acc, value) { acc.push.apply(acc, value); return acc; }, [])
                .debounceTime(200);
        });
    };
    CodeLensService.prototype._configureEditor = function (editor) {
        var _this = this;
        var service = new EditorCodeLensService(editor, function (editor) { return _this.invoke({ editor: editor }); }, this._viewFinder, this._referencesService);
        this._editors.add(service);
    };
    CodeLensService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.ICodeLensService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for codeLens'
        }),
        __param(5, decorators_1.inject(atom_languageservices_1.IReferencesService)), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource, AtomViewFinder_1.AtomViewFinder, Object])
    ], CodeLensService);
    return CodeLensService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.CodeLensService = CodeLensService;
var EditorCodeLensService = (function (_super) {
    __extends(EditorCodeLensService, _super);
    function EditorCodeLensService(editor, request, viewFinder, referencesService) {
        var _this = this;
        _super.call(this);
        this._lenses = [];
        this._editor = editor;
        this._request = request;
        this._viewFinder = viewFinder;
        this._referencesService = referencesService;
        var kick = this._kick = new rxjs_1.Subject();
        this._disposable.add(editor.onDidChangeScrollTop(_.throttle(function () {
            var element = _this._viewFinder.getView(_this._editor);
            var top = element.getFirstVisibleScreenRow();
            var bottom = element.getLastVisibleScreenRow() - 2;
            _.each(_this._lenses, function (lens) {
                if (!lens.resolved) {
                    _this._resolveMarker(lens, [top, bottom]);
                }
            });
        }, 200, { leading: true, trailing: true })), editor.onDidDestroy(function () {
            _this.dispose();
        }), function () {
            _this._lenses.forEach(function (_a) {
                var marker = _a.marker;
                marker.destroy();
            });
        }, rxjs_1.Observable.merge(rxjs_1.Observable.of(null), kick, index_1.observeCallback(editor.onDidStopChanging, editor))
            .startWith(null)
            .switchMap(function () {
            return _this._request(editor);
        })
            .subscribe(function (results) {
            var element = _this._viewFinder.getView(_this._editor);
            var top = element.getFirstVisibleScreenRow();
            var bottom = element.getLastVisibleScreenRow() - 2;
            _.each(results, function (result) {
                _this._setMarker(result, [top, bottom]);
            });
        }));
    }
    EditorCodeLensService.prototype.refresh = function () {
        this._kick.next(void 0);
    };
    EditorCodeLensService.prototype._resolveMarker = function (lens, _a) {
        var top = _a[0], bottom = _a[1];
        if (lens.codeLens.range.start.row > top && lens.codeLens.range.start.row < bottom) {
            lens.resolved = true;
            lens.codeLens.resolve()
                .subscribe(function () {
                lens.item.innerHTML = lens.codeLens.command.title;
            });
        }
    };
    EditorCodeLensService.prototype._setMarker = function (codeLens, _a) {
        var _this = this;
        var top = _a[0], bottom = _a[1];
        var context = _.find(this._lenses, function (x) { return x.marker.getBufferRange().isEqual(codeLens.range); });
        if (!context) {
            var marker = this._editor.markBufferRange(codeLens.range);
            var indentation = this._editor.indentationForBufferRow(codeLens.range.start.row) * this._editor.getTabLength();
            var width = this._editor.getDefaultCharWidth();
            var item = document.createElement('a');
            item.onclick = function () {
                if (codeLens.command.command === 'references') {
                    var location_1 = codeLens.data.location;
                    _this._referencesService.open({
                        editor: _this._editor,
                        position: new atom_1.Point(location_1.range.start.line, location_1.range.start.character),
                        filePath: _this._editor.getURI()
                    });
                }
            };
            item.style.marginLeft = indentation * width + "px";
            this._editor.decorateMarker(marker, {
                type: 'block',
                position: 'before',
                item: item
            });
            context = { item: item, codeLens: codeLens, marker: marker, resolved: false };
            this._lenses.push(context);
            if (codeLens.range.start.row > top && codeLens.range.start.row < bottom) {
                this._resolveMarker(context, [top, bottom]);
            }
        }
        context.item.innerHTML = 'Loading...';
    };
    return EditorCodeLensService;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUxlbnNTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vQ29kZUxlbnNTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBOEMsTUFBTSxDQUFDLENBQUE7QUFDckQscUJBQXNCLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLHNDQUErSSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3ZLLDJCQUEwQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBRzdFLCtCQUFnRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2pGLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBRTdELDJCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUMzQyxzQkFBZ0Msa0JBQWtCLENBQUMsQ0FBQTtBQUNuRCw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5QywrQkFBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCwrQkFBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCxnQ0FBZ0MsbUJBQW1CLENBQUMsQ0FBQTtBQVNwRDtJQUNZLG1DQUE2SDtJQVVySSx5QkFDSSxVQUEwQixFQUMxQixRQUF5QixFQUN6QixZQUEwQixFQUMxQixNQUE0QixFQUM1QixVQUEwQixFQUNFLGlCQUFxQztRQWpCekUsaUJBa0VDO1FBL0NPLGlCQUFPLENBQUM7UUFaSixhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQXlCLENBQUM7UUFtRDVDLGFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzFCLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFYLENBQVcsQ0FBQyxDQUFDO1FBQzVDLENBQUMsRUFBRSxJQUFJLENB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LElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNMLENBQUM7UUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7SUFDMUMsQ0FBQztJQUNMLDRCQUFDO0FBQUQsQ0FBQyxBQXpHRCxDQUFvQywrQkFBYyxHQXlHakQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnYXRvbSc7XHJcbmltcG9ydCB7IENvZGVMZW5zLCBDb21tYW5kVHlwZSwgSUF0b21OYXZpZ2F0aW9uLCBJQ29kZUxlbnNQcm92aWRlciwgSUNvZGVMZW5zU2VydmljZSwgSVJlZmVyZW5jZXNTZXJ2aWNlLCBSZWZlcmVuY2UsIG5hdmlnYXRpb25IYXNSYW5nZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3QsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IExvY2F0aW9uIGFzIFRMb2NhdGlvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMnO1xyXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBmcm9tVXJpIH0gZnJvbSAnLi8uLi9jYXBhYmlsaXRpZXMvdXRpbHMvY29udmVydCc7XHJcbmltcG9ydCB7IGF0b21Db25maWcgfSBmcm9tICcuLi9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgb2JzZXJ2ZUNhbGxiYWNrIH0gZnJvbSAnLi4vaGVscGVycy9pbmRleCc7XHJcbmltcG9ydCB7IEF0b21Db21tYW5kcyB9IGZyb20gJy4vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgQXRvbU5hdmlnYXRpb24gfSBmcm9tICcuL0F0b21OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgQXRvbVRleHRFZGl0b3JTb3VyY2UgfSBmcm9tICcuL0F0b21UZXh0RWRpdG9yU291cmNlJztcclxuaW1wb3J0IHsgQXRvbVZpZXdGaW5kZXIgfSBmcm9tICcuL0F0b21WaWV3RmluZGVyJztcclxuaW1wb3J0IHsgQ29tbWFuZHNTZXJ2aWNlIH0gZnJvbSAnLi9Db21tYW5kc1NlcnZpY2UnO1xyXG50eXBlIExvY2F0aW9uID0gSUF0b21OYXZpZ2F0aW9uLkxvY2F0aW9uO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElDb2RlTGVuc1NlcnZpY2UpXHJcbkBhdG9tQ29uZmlnKHtcclxuICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc3VwcG9ydCBmb3IgY29kZUxlbnMnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb2RlTGVuc1NlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxJQ29kZUxlbnNQcm92aWRlciwgQ29kZUxlbnMuSVJlcXVlc3QsIE9ic2VydmFibGU8Q29kZUxlbnMuSVJlc3BvbnNlW10+LCBPYnNlcnZhYmxlPENvZGVMZW5zLklSZXNwb25zZVtdPj5cclxuICAgIGltcGxlbWVudHMgSUNvZGVMZW5zU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbjtcclxuICAgIHByaXZhdGUgX2NvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9hdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JzID0gbmV3IFNldDxFZGl0b3JDb2RlTGVuc1NlcnZpY2U+KCk7XHJcbiAgICBwcml2YXRlIF92aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlcjtcclxuICAgIHByaXZhdGUgX3JlZmVyZW5jZXNTZXJ2aWNlOiBJUmVmZXJlbmNlc1NlcnZpY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb24sXHJcbiAgICAgICAgY29tbWFuZHM6IENvbW1hbmRzU2VydmljZSxcclxuICAgICAgICBhdG9tQ29tbWFuZHM6IEF0b21Db21tYW5kcyxcclxuICAgICAgICBzb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlLFxyXG4gICAgICAgIHZpZXdGaW5kZXI6IEF0b21WaWV3RmluZGVyLFxyXG4gICAgICAgIEBpbmplY3QoSVJlZmVyZW5jZXNTZXJ2aWNlKSByZWZlcmVuY2VzU2VydmljZTogSVJlZmVyZW5jZXNTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX2F0b21Db21tYW5kcyA9IGF0b21Db21tYW5kcztcclxuICAgICAgICB0aGlzLl92aWV3RmluZGVyID0gdmlld0ZpbmRlcjtcclxuICAgICAgICB0aGlzLl9yZWZlcmVuY2VzU2VydmljZSA9IHJlZmVyZW5jZXNTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZ3VyZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvcnMuZm9yRWFjaCh4ID0+IHguZGlzcG9zZSgpKTtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9ycy5jbGVhcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NvbmZpZ3VyZSgpIHtcclxuICAgICAgICB0aGlzLl9zb3VyY2Uub2JzZXJ2ZVRleHRFZGl0b3JzXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoXy5iaW5kKHRoaXMuX2NvbmZpZ3VyZUVkaXRvciwgdGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIERpc3Bvc2FibGUuZW1wdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyUHJvdmlkZXIocHJvdmlkZXI6IElDb2RlTGVuc1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgdGhpcy5fcmVmcmVzaCgpO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5yZWdpc3RlclByb3ZpZGVyKHByb3ZpZGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlSW52b2tlKGNhbGxiYWNrczogKChvcHRpb25zOiBDb2RlTGVucy5JUmVxdWVzdCkgPT4gT2JzZXJ2YWJsZTxDb2RlTGVucy5JUmVzcG9uc2VbXT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKChvcHRpb25zOiBDb2RlTGVucy5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0cyA9IF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKHJlcXVlc3RzKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKHggPT4geClcclxuICAgICAgICAgICAgICAgIC5zY2FuKChhY2MsIHZhbHVlKSA9PiB7IGFjYy5wdXNoKC4uLnZhbHVlKTsgcmV0dXJuIGFjYzsgfSwgW10pXHJcbiAgICAgICAgICAgICAgICAuZGVib3VuY2VUaW1lKDIwMCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVmcmVzaCA9IF8uZGVib3VuY2UoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2VkaXRvcnMuZm9yRWFjaCh4ID0+IHgucmVmcmVzaCgpKTtcclxuICAgIH0sIDEwMDApO1xyXG5cclxuICAgIHByaXZhdGUgX2NvbmZpZ3VyZUVkaXRvcihlZGl0b3I6IEF0b20uVGV4dEVkaXRvcikge1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgRWRpdG9yQ29kZUxlbnNTZXJ2aWNlKGVkaXRvciwgKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSA9PiB0aGlzLmludm9rZSh7IGVkaXRvciB9KSwgdGhpcy5fdmlld0ZpbmRlciwgdGhpcy5fcmVmZXJlbmNlc1NlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2VkaXRvcnMuYWRkKHNlcnZpY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgRWRpdG9yQ29kZUxlbnNJdGVtIHtcclxuICAgIG1hcmtlcjogVGV4dEJ1ZmZlci5EaXNwbGF5TWFya2VyO1xyXG4gICAgY29kZUxlbnM6IENvZGVMZW5zLklSZXNwb25zZTtcclxuICAgIGl0ZW06IEhUTUxBbmNob3JFbGVtZW50O1xyXG4gICAgcmVzb2x2ZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIEVkaXRvckNvZGVMZW5zU2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2VkaXRvcjogQXRvbS5UZXh0RWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBfcmVxdWVzdDogKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSA9PiBPYnNlcnZhYmxlPENvZGVMZW5zLklSZXNwb25zZVtdPjtcclxuICAgIHByaXZhdGUgX2xlbnNlczogRWRpdG9yQ29kZUxlbnNJdGVtW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2tpY2s6IE9ic2VydmVyPHZvaWQ+O1xyXG4gICAgcHJpdmF0ZSBfdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXI7XHJcbiAgICBwcml2YXRlIF9yZWZlcmVuY2VzU2VydmljZTogSVJlZmVyZW5jZXNTZXJ2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yLCByZXF1ZXN0OiAoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpID0+IE9ic2VydmFibGU8Q29kZUxlbnMuSVJlc3BvbnNlW10+LCB2aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlciwgcmVmZXJlbmNlc1NlcnZpY2U6IElSZWZlcmVuY2VzU2VydmljZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgICAgIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xyXG4gICAgICAgIHRoaXMuX3ZpZXdGaW5kZXIgPSB2aWV3RmluZGVyO1xyXG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZXNTZXJ2aWNlID0gcmVmZXJlbmNlc1NlcnZpY2U7XHJcbiAgICAgICAgY29uc3Qga2ljayA9IHRoaXMuX2tpY2sgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKF8udGhyb3R0bGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudDogYW55ID0gdGhpcy5fdmlld0ZpbmRlci5nZXRWaWV3KHRoaXMuX2VkaXRvcik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b3AgPSBlbGVtZW50LmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYm90dG9tID0gZWxlbWVudC5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdygpIC0gMjtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5fbGVuc2VzLCBsZW5zID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWxlbnMucmVzb2x2ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZU1hcmtlcihsZW5zLCBbdG9wLCBib3R0b21dKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgMjAwLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlIH0pKSxcclxuICAgICAgICAgICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xlbnNlcy5mb3JFYWNoKCh7bWFya2VyfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgT2JzZXJ2YWJsZS5tZXJnZShcclxuICAgICAgICAgICAgICAgIE9ic2VydmFibGUub2YobnVsbCksXHJcbiAgICAgICAgICAgICAgICBraWNrLFxyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZUNhbGxiYWNrPGFueT4oZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nLCBlZGl0b3IpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIC5zdGFydFdpdGgobnVsbClcclxuICAgICAgICAgICAgICAgIC5zd2l0Y2hNYXAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZXF1ZXN0KGVkaXRvcik7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50OiBhbnkgPSB0aGlzLl92aWV3RmluZGVyLmdldFZpZXcodGhpcy5fZWRpdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b3AgPSBlbGVtZW50LmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IGVsZW1lbnQuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSAtIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHJlc3VsdHMsIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldE1hcmtlcihyZXN1bHQsIFt0b3AsIGJvdHRvbV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWZyZXNoKCkge1xyXG4gICAgICAgIHRoaXMuX2tpY2submV4dCh2b2lkIDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Jlc29sdmVNYXJrZXIobGVuczogRWRpdG9yQ29kZUxlbnNJdGVtLCBbdG9wLCBib3R0b21dOiBbbnVtYmVyLCBudW1iZXJdKSB7XHJcbiAgICAgICAgaWYgKGxlbnMuY29kZUxlbnMucmFuZ2Uuc3RhcnQucm93ID4gdG9wICYmIGxlbnMuY29kZUxlbnMucmFuZ2Uuc3RhcnQucm93IDwgYm90dG9tKSB7XHJcbiAgICAgICAgICAgIGxlbnMucmVzb2x2ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZW5zLmNvZGVMZW5zLnJlc29sdmUoKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVucy5pdGVtLmlubmVySFRNTCA9IGxlbnMuY29kZUxlbnMuY29tbWFuZCEudGl0bGU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0TWFya2VyKGNvZGVMZW5zOiBDb2RlTGVucy5JUmVzcG9uc2UsIFt0b3AsIGJvdHRvbV06IFtudW1iZXIsIG51bWJlcl0pIHtcclxuICAgICAgICBsZXQgY29udGV4dCA9IF8uZmluZCh0aGlzLl9sZW5zZXMsIHggPT4geC5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKS5pc0VxdWFsKGNvZGVMZW5zLnJhbmdlKSk7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcmtlciA9IHRoaXMuX2VkaXRvci5tYXJrQnVmZmVyUmFuZ2UoY29kZUxlbnMucmFuZ2UpO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRlbnRhdGlvbiA9IHRoaXMuX2VkaXRvci5pbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhjb2RlTGVucy5yYW5nZS5zdGFydC5yb3cpICogdGhpcy5fZWRpdG9yLmdldFRhYkxlbmd0aCgpO1xyXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2VkaXRvci5nZXREZWZhdWx0Q2hhcldpZHRoKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICAgIGl0ZW0ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjb2RlTGVucy5jb21tYW5kIS5jb21tYW5kID09PSAncmVmZXJlbmNlcycpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2NhdGlvbjogVExvY2F0aW9uID0gY29kZUxlbnMuZGF0YS5sb2NhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZlcmVuY2VzU2VydmljZS5vcGVuKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yOiB0aGlzLl9lZGl0b3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgUG9pbnQobG9jYXRpb24ucmFuZ2Uuc3RhcnQubGluZSwgbG9jYXRpb24ucmFuZ2Uuc3RhcnQuY2hhcmFjdGVyKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IHRoaXMuX2VkaXRvci5nZXRVUkkoKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaXRlbS5zdHlsZS5tYXJnaW5MZWZ0ID0gYCR7aW5kZW50YXRpb24gKiB3aWR0aH1weGA7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2snLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdiZWZvcmUnLFxyXG4gICAgICAgICAgICAgICAgaXRlbVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY29udGV4dCA9IHsgaXRlbSwgY29kZUxlbnMsIG1hcmtlciwgcmVzb2x2ZWQ6IGZhbHNlIH07XHJcbiAgICAgICAgICAgIHRoaXMuX2xlbnNlcy5wdXNoKGNvbnRleHQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvZGVMZW5zLnJhbmdlLnN0YXJ0LnJvdyA+IHRvcCAmJiBjb2RlTGVucy5yYW5nZS5zdGFydC5yb3cgPCBib3R0b20pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc29sdmVNYXJrZXIoY29udGV4dCwgW3RvcCwgYm90dG9tXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRleHQuaXRlbS5pbm5lckhUTUwgPSAnTG9hZGluZy4uLic7XHJcbiAgICB9XHJcbn1cclxuIl19