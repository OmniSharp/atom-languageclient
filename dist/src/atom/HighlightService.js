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
var ts_disposables_1 = require('ts-disposables');
var decorators_2 = require('../decorators');
var AtomCommands_1 = require('./AtomCommands');
var AtomConfig_1 = require('./AtomConfig');
var AtomLanguageClientConfig_1 = require('../AtomLanguageClientConfig');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var AtomViewFinder_1 = require('./AtomViewFinder');
var CommandsService_1 = require('./CommandsService');
var HighlightService = (function (_super) {
    __extends(HighlightService, _super);
    function HighlightService(config, atomLanguageClientConfig, viewFinder, commands, atomCommands, source) {
        var _this = this;
        _super.call(this);
        this._highlighters = new Set();
        this._config = config;
        this._viewFinder = viewFinder;
        this._commands = commands;
        this._source = source;
        this._atomCommands = atomCommands;
        this._disposable.add(function () {
            _this._highlighters.forEach(function (item) {
                item.dispose();
            });
        });
        atomLanguageClientConfig.addSection('highlight', {
            type: 'object',
            properties: {
                'mode': {
                    title: 'Highlighting Mode',
                    description: 'Overlays look better, highlights are faster',
                    type: 'string',
                    default: 'highlight',
                    enum: [
                        { value: 'overlay', description: 'Overlays' },
                        { value: 'highlight', description: 'Highlights' },
                    ]
                }
            }
        });
        this._disposable.add(config.onDidChange('highlight.mode')
            .subscribe(function (_a) {
            var newValue = _a.newValue, oldValue = _a.oldValue;
            if (oldValue !== newValue) {
                _this._highlighters.forEach(function (x) { return x.mode(newValue); });
            }
        }));
    }
    HighlightService.prototype.onEnabled = function () {
        // return this._commands.add(CommandType.TextEditor, 'go-to-definition', 'f12', () => this.open());
        return { dispose: function () { } };
    };
    HighlightService.prototype.getHighlighter = function () {
        var highlighter = new Highlighter(this._config.for('editor'), this._config.get('highlight.mode'), this._viewFinder, this._source);
        this._highlighters.add(highlighter);
        return highlighter;
    };
    HighlightService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IHighlightService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for highlighting important names'
        }), 
        __metadata('design:paramtypes', [AtomConfig_1.AtomConfig, AtomLanguageClientConfig_1.AtomLanguageClientConfig, AtomViewFinder_1.AtomViewFinder, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource])
    ], HighlightService);
    return HighlightService;
}(ts_disposables_1.DisposableBase));
exports.HighlightService = HighlightService;
var Highlighter = (function (_super) {
    __extends(Highlighter, _super);
    function Highlighter(config, mode, viewFinder, source) {
        var _this = this;
        _super.call(this);
        this._highlighters = new Map();
        this._config = config;
        this._viewFinder = viewFinder;
        this._source = source;
        this._disposable.add(function () {
            _this._highlighters.clear();
        });
        this._mode = mode;
    }
    Highlighter.prototype.mode = function (mode) {
        if (this._highlighters.size) {
            this._highlighters.forEach(function (x) { return x.dispose(); });
            this._highlighters.clear();
        }
        this._mode = mode;
    };
    Highlighter.prototype.updateHighlights = function (editor, added, removed) {
        var _this = this;
        if (!this._highlighters.has(editor)) {
            var cd_1 = new ts_disposables_1.CompositeDisposable();
            this._disposable.add(cd_1);
            var highlighter = void 0;
            if (this._mode === 'overlay') {
                highlighter = new OverlayEditorHighlighter(this._config, this._viewFinder, this._source, editor);
            }
            else {
                highlighter = new HighlightEditorHighlighter(this._config, this._viewFinder, editor);
            }
            cd_1.add(highlighter, function () {
                _this._highlighters.delete(editor);
            }, editor.onDidDestroy(function () {
                cd_1.dispose();
            }));
            this._highlighters.set(editor, highlighter);
        }
        this._highlighters.get(editor).setHighlights(added, removed);
    };
    return Highlighter;
}(ts_disposables_1.DisposableBase));
var EditorHighlighter = (function (_super) {
    __extends(EditorHighlighter, _super);
    function EditorHighlighter() {
        _super.apply(this, arguments);
    }
    EditorHighlighter.prototype.getClassForKind = function (kind) {
        switch (kind) {
            case 'number':
                return ['constant', 'numeric'];
            case 'struct name':
                return ['support', 'constant', 'numeric', 'identifier', 'struct'];
            case 'enum name':
                return ['support', 'constant', 'numeric', 'identifier', 'enum'];
            case 'identifier':
                return ['identifier'];
            case 'class name':
                return ['support', 'class', 'type', 'identifier'];
            case 'delegate name':
                return ['support', 'class', 'type', 'identifier', 'delegate'];
            case 'interface name':
                return ['support', 'class', 'type', 'identifier', 'interface'];
            case 'preprocessor keyword':
                return ['constant', 'other', 'symbol'];
            case 'excluded code':
                return ['comment', 'block'];
            case 'unused code':
                return ['unused'];
            default:
                console.log('unhandled Kind ' + kind);
        }
        return [];
    };
    return EditorHighlighter;
}(ts_disposables_1.DisposableBase));
var OverlayEditorHighlighter = (function (_super) {
    __extends(OverlayEditorHighlighter, _super);
    function OverlayEditorHighlighter(config, viewFinder, source, editor) {
        var _this = this;
        _super.call(this);
        this._marks = new Map();
        this._elements = [];
        this._colors = new Map();
        this._style = document.createElement('style');
        this._config = config;
        this._viewFinder = viewFinder;
        this._editor = editor;
        this._source = source;
        // const highlights = this._highlightsObserver = new Subject<[Highlight.Item[], number[]]>();
        var decorator = this._decoratorObserver = new rxjs_1.Subject();
        this._disposable.add(function () {
            _this._marks.forEach(function (x) { return x.destroy(); });
            _this._marks.clear();
        }, editor.onDidChangeScrollTop(_.debounce(function () {
            _.each(_this._elements, function (_a) {
                var line = _a.line, item = _a.item;
                item.style.display = 'none';
            });
        }, 200, { leading: true })), editor.onDidChangeScrollTop(_.debounce(function () {
            var element = _this._viewFinder.getView(_this._editor);
            var top = element.getFirstVisibleScreenRow();
            var bottom = element.getLastVisibleScreenRow() - 2;
            _.each(_this._elements, function (_a) {
                var line = _a.line, item = _a.item;
                if (!(line <= top || line >= bottom)) {
                    item.style.display = '';
                }
            });
        }, 200, { trailing: true })), decorator
            .bufferToggle(decorator.throttleTime(500), function () { return rxjs_1.Observable.timer(500); })
            .subscribe(function (items) {
            _.each(items, function (_a) {
                var marker = _a[0], highlight = _a[1];
                _this._decorateMarker(marker, highlight);
            });
        }));
    }
    OverlayEditorHighlighter.prototype._decorateMarker = function (marker, highlight) {
        var _this = this;
        if (marker.isDestroyed()) {
            return;
        }
        var item = document.createElement('div');
        var text = this._editor.getTextInBufferRange(highlight.range);
        (_a = item.classList).add.apply(_a, this.getClassForKind(highlight.kind));
        item.innerText = text;
        // item.style.fontWeight = 'bold';
        item.style.pointerEvents = 'none';
        this._computeColor(this.getClassForKind(highlight.kind));
        this._elements.push({ line: highlight.range.start.row, item: item });
        if (this._editor === this._source.activeTextEditor) {
            this._positionElement(marker, highlight.range.start.row, item, highlight);
        }
        else {
            this._source
                .observeActiveTextEditor
                .filter(function (x) { return x === _this._editor; })
                .take(1)
                .subscribe(function () {
                _this._positionElement(marker, highlight.range.start.row, item, highlight);
            });
        }
        var _a;
    };
    OverlayEditorHighlighter.prototype._positionElement = function (marker, line, item, highlight) {
        var _this = this;
        var style = window.getComputedStyle(this._viewFinder.getView(this._editor));
        // item.style.backgroundColor = style.backgroundColor;
        item.style.fontSize = style.fontSize;
        item.style.marginTop = "-" + style.lineHeight;
        var decoration = this._editor.decorateMarker(marker, { type: 'overlay', item: item, position: 'tail' });
        this._disposable.add(decoration.onDidDestroy(function () {
            _.remove(_this._elements, function (x) { return x.item === item; });
        }));
        var element = this._viewFinder.getView(this._editor);
        var top = element.getFirstVisibleScreenRow();
        var bottom = element.getLastVisibleScreenRow() - 2;
        if (line <= top || line >= bottom) {
            item.style.display = 'none';
        }
        else {
            item.style.display = '';
        }
    };
    OverlayEditorHighlighter.prototype.setHighlights = function (added, removed) {
        var _this = this;
        var currentMarks = _.toArray(this._marks.entries());
        _.each(added, function (highlight) {
            if (highlight.kind === 'identifier') {
                return;
            }
            var item = _.find(currentMarks, function (_a) {
                var marker = _a[1];
                return marker.getBufferRange().isEqual(highlight.range);
            });
            var mark;
            if (!item) {
                mark = _this._editor.markBufferRange(highlight.range);
                _this._decoratorObserver.next([mark, highlight]);
                _this._marks.set(highlight.id, mark);
            }
            else {
                _.pull(removed, item[0]);
            }
        });
        _.each(removed, function (id) {
            if (_this._marks.has(id)) {
                var mark = _this._marks.get(id);
                mark.destroy();
                _this._marks.delete(id);
            }
        });
    };
    OverlayEditorHighlighter.prototype._computeColor = function (classes) {
        if (this._style.parentElement == null) {
            document.head.appendChild(this._style);
            this._style.appendChild(document.createTextNode(''));
        }
        var id = classes.join('.');
        if (this._colors.has(id)) {
            return this._colors.get(id);
        }
        var editor = document.querySelector('atom-text-editor');
        var d = document.createElement('div');
        (_a = d.classList).add.apply(_a, classes);
        editor.appendChild(d);
        var style = window.getComputedStyle(d);
        this._colors.set(id, style.color);
        if (style.color) {
            var content = "atom-text-editor::shadow .highlight." + id + " .region, atom-text-editor .highlight." + id + " .region {\n                border: 1px solid " + style.color + ";\n                border-radius: 4px;\n                border-top-width: 0;\n                border-bottom-width: 0;\n                margin-left: -2px;\n                padding-right: 1px;\n                box-sizing: content-box !important;\n            }\n";
            this._style.firstChild.textContent += content;
        }
        d.remove();
        return style.color;
        var _a;
    };
    return OverlayEditorHighlighter;
}(EditorHighlighter));
var HighlightEditorHighlighter = (function (_super) {
    __extends(HighlightEditorHighlighter, _super);
    function HighlightEditorHighlighter(config, viewFinder, editor) {
        var _this = this;
        _super.call(this);
        this._marks = new Map();
        this._colors = new Map();
        this._style = document.createElement('style');
        this._config = config;
        this._viewFinder = viewFinder;
        this._editor = editor;
        // const highlights = this._highlightsObserver = new Subject<[Highlight.Item[], number[]]>();
        var decorator = this._decoratorObserver = new rxjs_1.Subject();
        this._disposable.add(function () {
            _this._marks.forEach(function (x) { return x.destroy(); });
            _this._marks.clear();
        }, decorator
            .bufferToggle(decorator.throttleTime(500), function () { return rxjs_1.Observable.timer(500); })
            .subscribe(function (items) {
            _.each(items, function (_a) {
                var marker = _a[0], highlight = _a[1];
                _this._decorateMarker(marker, highlight);
            });
        }));
    }
    HighlightEditorHighlighter.prototype._decorateMarker = function (marker, highlight) {
        if (marker.isDestroyed()) {
            return;
        }
        this._computeColor(this.getClassForKind(highlight.kind));
        var decoration = this._editor.decorateMarker(marker, { type: 'highlight', class: this.getClassForKind(highlight.kind).join(' ') });
        this._disposable.add(function () { return decoration.destroy(); });
    };
    HighlightEditorHighlighter.prototype.setHighlights = function (added, removed) {
        var _this = this;
        var currentMarks = _.toArray(this._marks.entries());
        _.each(added, function (highlight) {
            if (highlight.kind === 'identifier') {
                return;
            }
            var item = _.find(currentMarks, function (_a) {
                var marker = _a[1];
                return marker.getBufferRange().isEqual(highlight.range);
            });
            var mark;
            if (!item) {
                mark = _this._editor.markBufferRange(highlight.range);
                _this._decoratorObserver.next([mark, highlight]);
                _this._marks.set(highlight.id, mark);
            }
            else {
                _.pull(removed, item[0]);
            }
        });
        _.each(removed, function (id) {
            if (_this._marks.has(id)) {
                var mark = _this._marks.get(id);
                mark.destroy();
                _this._marks.delete(id);
            }
        });
    };
    HighlightEditorHighlighter.prototype._computeColor = function (classes) {
        if (this._style.parentElement == null) {
            document.head.appendChild(this._style);
            this._style.appendChild(document.createTextNode(''));
        }
        var id = classes.join('.');
        if (this._colors.has(id)) {
            return this._colors.get(id);
        }
        var editor = document.querySelector('atom-text-editor');
        var d = document.createElement('div');
        (_a = d.classList).add.apply(_a, classes);
        editor.appendChild(d);
        var style = window.getComputedStyle(d);
        this._colors.set(id, style.color);
        if (style.color) {
            var content = "atom-text-editor::shadow .highlight." + id + " .region, atom-text-editor .highlight." + id + " .region {\n                border: 1px solid " + style.color + ";\n                border-radius: 4px;\n                border-top-width: 0;\n                border-bottom-width: 0;\n                margin-left: -2px;\n                padding-right: 1px;\n                box-sizing: content-box !important;\n            }\n";
            this._style.firstChild.textContent += content;
        }
        d.remove();
        return style.color;
        var _a;
    };
    return HighlightEditorHighlighter;
}(EditorHighlighter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGlnaGxpZ2h0U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL0hpZ2hsaWdodFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUE4QyxNQUFNLENBQUMsQ0FBQTtBQUNyRCxzQ0FBOEQsdUJBQXVCLENBQUMsQ0FBQTtBQUN0RiwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUVyRSwrQkFBb0QsZ0JBQWdCLENBQUMsQ0FBQTtBQUNyRSwyQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsNkJBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFDOUMsMkJBQTJCLGNBQWMsQ0FBQyxDQUFBO0FBQzFDLHlDQUF5Qyw2QkFBNkIsQ0FBQyxDQUFBO0FBQ3ZFLHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELGdDQUFnQyxtQkFBbUIsQ0FBQyxDQUFBO0FBU3BEO0lBQXNDLG9DQUFjO0lBUWhELDBCQUFZLE1BQWtCLEVBQUUsd0JBQWtELEVBQUUsVUFBMEIsRUFBRSxRQUF5QixFQUFFLFlBQTBCLEVBQUUsTUFBNEI7UUFSdk0saUJBMERDO1FBakRPLGlCQUFPLENBQUM7UUFISixrQkFBYSxHQUFHLElBQUksR0FBRyxFQUFlLENBQUM7UUFJM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFFbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDakIs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QUFDLENBQUM7UUFFbkMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFNLE9BQU8sR0FBRyx5Q0FBdUMsRUFBRSw4Q0FBeUMsRUFBRSxzREFDNUUsS0FBSyxDQUFDLEtBQUsseVFBTy9CLENBQUM7WUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDO1FBQ2xELENBQUM7UUFFRCxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzs7SUFDdkIsQ0FBQztJQUNMLGlDQUFDO0FBQUQsQ0FBQyxBQTFHRCxDQUF5QyxpQkFBaUIsR0EwR3pEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBPYnNlcnZlciwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBIaWdobGlnaHQsIElBdG9tTmF2aWdhdGlvbiwgSUhpZ2hsaWdodFNlcnZpY2UgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdmcyc7XHJcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBhdG9tQ29uZmlnIH0gZnJvbSAnLi4vZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEF0b21Db21tYW5kcyB9IGZyb20gJy4vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgQXRvbUNvbmZpZyB9IGZyb20gJy4vQXRvbUNvbmZpZyc7XHJcbmltcG9ydCB7IEF0b21MYW5ndWFnZUNsaWVudENvbmZpZyB9IGZyb20gJy4uL0F0b21MYW5ndWFnZUNsaWVudENvbmZpZyc7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IEF0b21WaWV3RmluZGVyIH0gZnJvbSAnLi9BdG9tVmlld0ZpbmRlcic7XHJcbmltcG9ydCB7IENvbW1hbmRzU2VydmljZSB9IGZyb20gJy4vQ29tbWFuZHNTZXJ2aWNlJztcclxudHlwZSBMb2NhdGlvbiA9IElBdG9tTmF2aWdhdGlvbi5Mb2NhdGlvbjtcclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhJSGlnaGxpZ2h0U2VydmljZSlcclxuQGF0b21Db25maWcoe1xyXG4gICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBzdXBwb3J0IGZvciBoaWdobGlnaHRpbmcgaW1wb3J0YW50IG5hbWVzJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0U2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSUhpZ2hsaWdodFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IENvbW1hbmRzU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21Db21tYW5kczogQXRvbUNvbW1hbmRzO1xyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogQXRvbUNvbmZpZztcclxuICAgIHByaXZhdGUgX3ZpZXdGaW5kZXI6IEF0b21WaWV3RmluZGVyO1xyXG4gICAgcHJpdmF0ZSBfaGlnaGxpZ2h0ZXJzID0gbmV3IFNldDxIaWdobGlnaHRlcj4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IEF0b21Db25maWcsIGF0b21MYW5ndWFnZUNsaWVudENvbmZpZzogQXRvbUxhbmd1YWdlQ2xpZW50Q29uZmlnLCB2aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlciwgY29tbWFuZHM6IENvbW1hbmRzU2VydmljZSwgYXRvbUNvbW1hbmRzOiBBdG9tQ29tbWFuZHMsIHNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2UpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLl92aWV3RmluZGVyID0gdmlld0ZpbmRlcjtcclxuICAgICAgICB0aGlzLl9jb21tYW5kcyA9IGNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICB0aGlzLl9hdG9tQ29tbWFuZHMgPSBhdG9tQ29tbWFuZHM7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0ZXJzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGF0b21MYW5ndWFnZUNsaWVudENvbmZpZy5hZGRTZWN0aW9uKCdoaWdobGlnaHQnLCB7XHJcbiAgICAgICAgICAgIHR5cGU6IDwnb2JqZWN0Jz4nb2JqZWN0JyxcclxuICAgICAgICAgICAgcHJvcGVydGllczoge1xyXG4gICAgICAgICAgICAgICAgJ21vZGUnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdIaWdobGlnaHRpbmcgTW9kZScsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdPdmVybGF5cyBsb29rIGJldHRlciwgaGlnaGxpZ2h0cyBhcmUgZmFzdGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiAnaGlnaGxpZ2h0JyxcclxuICAgICAgICAgICAgICAgICAgICBlbnVtOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdmFsdWU6ICdvdmVybGF5JywgZGVzY3JpcHRpb246ICdPdmVybGF5cycgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogJ2hpZ2hsaWdodCcsIGRlc2NyaXB0aW9uOiAnSGlnaGxpZ2h0cycgfSxcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIGNvbmZpZy5vbkRpZENoYW5nZTwnb3ZlcmxheScgfCAnaGlnaGxpZ2h0Jz4oJ2hpZ2hsaWdodC5tb2RlJylcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHsgbmV3VmFsdWUsIG9sZFZhbHVlIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgIT09IG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hsaWdodGVycy5mb3JFYWNoKHggPT4geC5tb2RlKG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuX2NvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5UZXh0RWRpdG9yLCAnZ28tdG8tZGVmaW5pdGlvbicsICdmMTInLCAoKSA9PiB0aGlzLm9wZW4oKSk7XHJcbiAgICAgICAgcmV0dXJuIHsgZGlzcG9zZSgpIHsgfSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRIaWdobGlnaHRlcigpIHtcclxuICAgICAgICBjb25zdCBoaWdobGlnaHRlciA9IG5ldyBIaWdobGlnaHRlcih0aGlzLl9jb25maWcuZm9yKCdlZGl0b3InKSwgdGhpcy5fY29uZmlnLmdldDwnb3ZlcmxheScgfCAnaGlnaGxpZ2h0Jz4oJ2hpZ2hsaWdodC5tb2RlJyksIHRoaXMuX3ZpZXdGaW5kZXIsIHRoaXMuX3NvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5faGlnaGxpZ2h0ZXJzLmFkZChoaWdobGlnaHRlcik7XHJcbiAgICAgICAgcmV0dXJuIGhpZ2hsaWdodGVyO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIaWdobGlnaHRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSGlnaGxpZ2h0LkhpZ2hsaWdodGVyIHtcclxuICAgIHByaXZhdGUgX2hpZ2hsaWdodGVycyA9IG5ldyBNYXA8QXRvbS5UZXh0RWRpdG9yLCBFZGl0b3JIaWdobGlnaHRlcj4oKTtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogQXRvbUNvbmZpZztcclxuICAgIHByaXZhdGUgX3ZpZXdGaW5kZXI6IEF0b21WaWV3RmluZGVyO1xyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuICAgIHByaXZhdGUgX21vZGU6ICdvdmVybGF5JyB8ICdoaWdobGlnaHQnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQXRvbUNvbmZpZywgbW9kZTogJ292ZXJsYXknIHwgJ2hpZ2hsaWdodCcsIHZpZXdGaW5kZXI6IEF0b21WaWV3RmluZGVyLCBzb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5fdmlld0ZpbmRlciA9IHZpZXdGaW5kZXI7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0ZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fbW9kZSA9IG1vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1vZGUobW9kZTogJ292ZXJsYXknIHwgJ2hpZ2hsaWdodCcpIHtcclxuICAgICAgICBpZiAodGhpcy5faGlnaGxpZ2h0ZXJzLnNpemUpIHtcclxuICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0ZXJzLmZvckVhY2goeCA9PiB4LmRpc3Bvc2UoKSlcclxuICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0ZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX21vZGUgPSBtb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVIaWdobGlnaHRzKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yLCBhZGRlZDogSGlnaGxpZ2h0Lkl0ZW1bXSwgcmVtb3ZlZDogc3RyaW5nW10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2hpZ2hsaWdodGVycy5oYXMoZWRpdG9yKSkge1xyXG4gICAgICAgICAgICBjb25zdCBjZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKGNkKTtcclxuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodGVyOiBFZGl0b3JIaWdobGlnaHRlcjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX21vZGUgPT09ICdvdmVybGF5Jykge1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZXIgPSBuZXcgT3ZlcmxheUVkaXRvckhpZ2hsaWdodGVyKHRoaXMuX2NvbmZpZywgdGhpcy5fdmlld0ZpbmRlciwgdGhpcy5fc291cmNlLCBlZGl0b3IpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0ZXIgPSBuZXcgSGlnaGxpZ2h0RWRpdG9ySGlnaGxpZ2h0ZXIodGhpcy5fY29uZmlnLCB0aGlzLl92aWV3RmluZGVyLCBlZGl0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNkLmFkZChcclxuICAgICAgICAgICAgICAgIGhpZ2hsaWdodGVyLFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hpZ2hsaWdodGVycy5kZWxldGUoZWRpdG9yKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjZC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5faGlnaGxpZ2h0ZXJzLnNldChlZGl0b3IsIGhpZ2hsaWdodGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2hpZ2hsaWdodGVycy5nZXQoZWRpdG9yKSAhLnNldEhpZ2hsaWdodHMoYWRkZWQsIHJlbW92ZWQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBFZGl0b3JIaWdobGlnaHRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRIaWdobGlnaHRzKGFkZGVkOiBIaWdobGlnaHQuSXRlbVtdLCByZW1vdmVkOiBzdHJpbmdbXSk6IHZvaWQ7XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q2xhc3NGb3JLaW5kKGtpbmQ6IHN0cmluZykge1xyXG4gICAgICAgIHN3aXRjaCAoa2luZCkge1xyXG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsnY29uc3RhbnQnLCAnbnVtZXJpYyddO1xyXG4gICAgICAgICAgICBjYXNlICdzdHJ1Y3QgbmFtZSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWydzdXBwb3J0JywgJ2NvbnN0YW50JywgJ251bWVyaWMnLCAnaWRlbnRpZmllcicsICdzdHJ1Y3QnXTtcclxuICAgICAgICAgICAgY2FzZSAnZW51bSBuYW1lJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiBbJ3N1cHBvcnQnLCAnY29uc3RhbnQnLCAnbnVtZXJpYycsICdpZGVudGlmaWVyJywgJ2VudW0nXTtcclxuICAgICAgICAgICAgY2FzZSAnaWRlbnRpZmllcic6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWydpZGVudGlmaWVyJ107XHJcbiAgICAgICAgICAgIGNhc2UgJ2NsYXNzIG5hbWUnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsnc3VwcG9ydCcsICdjbGFzcycsICd0eXBlJywgJ2lkZW50aWZpZXInXTtcclxuICAgICAgICAgICAgY2FzZSAnZGVsZWdhdGUgbmFtZSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWydzdXBwb3J0JywgJ2NsYXNzJywgJ3R5cGUnLCAnaWRlbnRpZmllcicsICdkZWxlZ2F0ZSddO1xyXG4gICAgICAgICAgICBjYXNlICdpbnRlcmZhY2UgbmFtZSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWydzdXBwb3J0JywgJ2NsYXNzJywgJ3R5cGUnLCAnaWRlbnRpZmllcicsICdpbnRlcmZhY2UnXTtcclxuICAgICAgICAgICAgY2FzZSAncHJlcHJvY2Vzc29yIGtleXdvcmQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsnY29uc3RhbnQnLCAnb3RoZXInLCAnc3ltYm9sJ107XHJcbiAgICAgICAgICAgIGNhc2UgJ2V4Y2x1ZGVkIGNvZGUnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsnY29tbWVudCcsICdibG9jayddO1xyXG4gICAgICAgICAgICBjYXNlICd1bnVzZWQgY29kZSc6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWyd1bnVzZWQnXTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1bmhhbmRsZWQgS2luZCAnICsga2luZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgT3ZlcmxheUVkaXRvckhpZ2hsaWdodGVyIGV4dGVuZHMgRWRpdG9ySGlnaGxpZ2h0ZXIge1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yOiBBdG9tLlRleHRFZGl0b3I7XHJcbiAgICBwcml2YXRlIF9tYXJrcyA9IG5ldyBNYXA8c3RyaW5nLCBUZXh0QnVmZmVyLkRpc3BsYXlNYXJrZXI+KCk7XHJcbiAgICAvLyBwcml2YXRlIF9oaWdobGlnaHRzT2JzZXJ2ZXI6IE9ic2VydmVyPFtIaWdobGlnaHQuSXRlbVtdLCBudW1iZXJbXV0+O1xyXG4gICAgcHJpdmF0ZSBfZGVjb3JhdG9yT2JzZXJ2ZXI6IE9ic2VydmVyPFtUZXh0QnVmZmVyLkRpc3BsYXlNYXJrZXIsIEhpZ2hsaWdodC5JdGVtXT47XHJcbiAgICBwcml2YXRlIF9jb25maWc6IEF0b21Db25maWc7XHJcbiAgICBwcml2YXRlIF92aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlcjtcclxuICAgIHByaXZhdGUgX3NvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2U7XHJcbiAgICBwcml2YXRlIF9lbGVtZW50czogeyBsaW5lOiBudW1iZXI7IGl0ZW06IEhUTUxFbGVtZW50IH1bXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogQXRvbUNvbmZpZywgdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXIsIHNvdXJjZTogQXRvbVRleHRFZGl0b3JTb3VyY2UsIGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgdGhpcy5fdmlld0ZpbmRlciA9IHZpZXdGaW5kZXI7XHJcbiAgICAgICAgdGhpcy5fZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgICAgIHRoaXMuX3NvdXJjZSA9IHNvdXJjZTtcclxuICAgICAgICAvLyBjb25zdCBoaWdobGlnaHRzID0gdGhpcy5faGlnaGxpZ2h0c09ic2VydmVyID0gbmV3IFN1YmplY3Q8W0hpZ2hsaWdodC5JdGVtW10sIG51bWJlcltdXT4oKTtcclxuICAgICAgICBjb25zdCBkZWNvcmF0b3IgPSB0aGlzLl9kZWNvcmF0b3JPYnNlcnZlciA9IG5ldyBTdWJqZWN0PFtUZXh0QnVmZmVyLkRpc3BsYXlNYXJrZXIsIEhpZ2hsaWdodC5JdGVtXT4oKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtzLmZvckVhY2goeCA9PiB4LmRlc3Ryb3koKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrcy5jbGVhcigpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VTY3JvbGxUb3AoXy5kZWJvdW5jZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5fZWxlbWVudHMsICh7IGxpbmUsIGl0ZW0gfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCAyMDAsIHsgbGVhZGluZzogdHJ1ZSB9KSksXHJcbiAgICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZVNjcm9sbFRvcChfLmRlYm91bmNlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IGFueSA9IHRoaXMuX3ZpZXdGaW5kZXIuZ2V0Vmlldyh0aGlzLl9lZGl0b3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9wID0gZWxlbWVudC5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IGVsZW1lbnQuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSAtIDI7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMuX2VsZW1lbnRzLCAoeyBsaW5lLCBpdGVtIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIShsaW5lIDw9IHRvcCB8fCBsaW5lID49IGJvdHRvbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIDIwMCwgeyB0cmFpbGluZzogdHJ1ZSB9KSksXHJcbiAgICAgICAgICAgIGRlY29yYXRvclxyXG4gICAgICAgICAgICAgICAgLmJ1ZmZlclRvZ2dsZShkZWNvcmF0b3IudGhyb3R0bGVUaW1lKDUwMCksICgpID0+IE9ic2VydmFibGUudGltZXIoNTAwKSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoaXRlbXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtcywgKFttYXJrZXIsIGhpZ2hsaWdodF0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVjb3JhdGVNYXJrZXIobWFya2VyLCBoaWdobGlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2RlY29yYXRlTWFya2VyKG1hcmtlcjogVGV4dEJ1ZmZlci5EaXNwbGF5TWFya2VyLCBoaWdobGlnaHQ6IEhpZ2hsaWdodC5JdGVtKSB7XHJcbiAgICAgICAgaWYgKG1hcmtlci5pc0Rlc3Ryb3llZCgpKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuX2VkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShoaWdobGlnaHQucmFuZ2UpO1xyXG4gICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCguLi50aGlzLmdldENsYXNzRm9yS2luZChoaWdobGlnaHQua2luZCkpO1xyXG4gICAgICAgIGl0ZW0uaW5uZXJUZXh0ID0gdGV4dDtcclxuICAgICAgICAvLyBpdGVtLnN0eWxlLmZvbnRXZWlnaHQgPSAnYm9sZCc7XHJcbiAgICAgICAgaXRlbS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21wdXRlQ29sb3IodGhpcy5nZXRDbGFzc0ZvcktpbmQoaGlnaGxpZ2h0LmtpbmQpKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZWxlbWVudHMucHVzaCh7IGxpbmU6IGhpZ2hsaWdodC5yYW5nZS5zdGFydC5yb3csIGl0ZW0gfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9lZGl0b3IgPT09IHRoaXMuX3NvdXJjZS5hY3RpdmVUZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uRWxlbWVudChtYXJrZXIsIGhpZ2hsaWdodC5yYW5nZS5zdGFydC5yb3csIGl0ZW0sIGhpZ2hsaWdodCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fc291cmNlXHJcbiAgICAgICAgICAgICAgICAub2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3JcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4ID09PSB0aGlzLl9lZGl0b3IpXHJcbiAgICAgICAgICAgICAgICAudGFrZSgxKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25FbGVtZW50KG1hcmtlciwgaGlnaGxpZ2h0LnJhbmdlLnN0YXJ0LnJvdywgaXRlbSwgaGlnaGxpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wb3NpdGlvbkVsZW1lbnQobWFya2VyOiBUZXh0QnVmZmVyLkRpc3BsYXlNYXJrZXIsIGxpbmU6IG51bWJlciwgaXRlbTogSFRNTEVsZW1lbnQsIGhpZ2hsaWdodDogSGlnaGxpZ2h0Lkl0ZW0pIHtcclxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuX3ZpZXdGaW5kZXIuZ2V0Vmlldyh0aGlzLl9lZGl0b3IpKTtcclxuICAgICAgICAvLyBpdGVtLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICBpdGVtLnN0eWxlLmZvbnRTaXplID0gc3R5bGUuZm9udFNpemU7XHJcbiAgICAgICAgaXRlbS5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7c3R5bGUubGluZUhlaWdodH1gO1xyXG5cclxuICAgICAgICBjb25zdCBkZWNvcmF0aW9uID0gdGhpcy5fZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwgeyB0eXBlOiAnb3ZlcmxheScsIGl0ZW0sIHBvc2l0aW9uOiAndGFpbCcgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICBkZWNvcmF0aW9uLm9uRGlkRGVzdHJveSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBfLnJlbW92ZSh0aGlzLl9lbGVtZW50cywgKHgpID0+IHguaXRlbSA9PT0gaXRlbSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgZWxlbWVudDogYW55ID0gdGhpcy5fdmlld0ZpbmRlci5nZXRWaWV3KHRoaXMuX2VkaXRvcik7XHJcbiAgICAgICAgY29uc3QgdG9wID0gZWxlbWVudC5nZXRGaXJzdFZpc2libGVTY3JlZW5Sb3coKTtcclxuICAgICAgICBjb25zdCBib3R0b20gPSBlbGVtZW50LmdldExhc3RWaXNpYmxlU2NyZWVuUm93KCkgLSAyO1xyXG5cclxuICAgICAgICBpZiAobGluZSA8PSB0b3AgfHwgbGluZSA+PSBib3R0b20pIHtcclxuICAgICAgICAgICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SGlnaGxpZ2h0cyhhZGRlZDogSGlnaGxpZ2h0Lkl0ZW1bXSwgcmVtb3ZlZDogc3RyaW5nW10pIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50TWFya3MgPSBfLnRvQXJyYXkodGhpcy5fbWFya3MuZW50cmllcygpKTtcclxuXHJcbiAgICAgICAgXy5lYWNoKGFkZGVkLCBoaWdobGlnaHQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0LmtpbmQgPT09ICdpZGVudGlmaWVyJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gXy5maW5kKGN1cnJlbnRNYXJrcywgKFssIG1hcmtlcl0pID0+IG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLmlzRXF1YWwoaGlnaGxpZ2h0LnJhbmdlKSk7XHJcbiAgICAgICAgICAgIGxldCBtYXJrOiBUZXh0QnVmZmVyLkRpc3BsYXlNYXJrZXI7XHJcbiAgICAgICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgbWFyayA9IHRoaXMuX2VkaXRvci5tYXJrQnVmZmVyUmFuZ2UoaGlnaGxpZ2h0LnJhbmdlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlY29yYXRvck9ic2VydmVyLm5leHQoW21hcmssIGhpZ2hsaWdodF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya3Muc2V0KGhpZ2hsaWdodC5pZCwgbWFyayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLnB1bGwocmVtb3ZlZCwgaXRlbVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy5lYWNoKHJlbW92ZWQsIGlkID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtzLmhhcyhpZCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcmsgPSB0aGlzLl9tYXJrcy5nZXQoaWQpICE7XHJcbiAgICAgICAgICAgICAgICBtYXJrLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtzLmRlbGV0ZShpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jb2xvcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgcHJpdmF0ZSBfc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgcHJpdmF0ZSBfY29tcHV0ZUNvbG9yKGNsYXNzZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0eWxlLnBhcmVudEVsZW1lbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuX3N0eWxlKTtcclxuICAgICAgICAgICAgdGhpcy5fc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlkID0gY2xhc3Nlcy5qb2luKCcuJyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbG9ycy5oYXMoaWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcnMuZ2V0KGlkKSAhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZWRpdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvcicpO1xyXG4gICAgICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgZWRpdG9yLmFwcGVuZENoaWxkKGQpO1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZCk7XHJcbiAgICAgICAgdGhpcy5fY29sb3JzLnNldChpZCwgc3R5bGUuY29sb3IhKTtcclxuXHJcbiAgICAgICAgaWYgKHN0eWxlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBgYXRvbS10ZXh0LWVkaXRvcjo6c2hhZG93IC5oaWdobGlnaHQuJHtpZH0gLnJlZ2lvbiwgYXRvbS10ZXh0LWVkaXRvciAuaGlnaGxpZ2h0LiR7aWR9IC5yZWdpb24ge1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtzdHlsZS5jb2xvcn07XHJcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLXdpZHRoOiAwO1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS13aWR0aDogMDtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAtMnB4O1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMXB4O1xyXG4gICAgICAgICAgICAgICAgYm94LXNpemluZzogY29udGVudC1ib3ggIWltcG9ydGFudDtcclxuICAgICAgICAgICAgfVxcbmA7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0eWxlLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgKz0gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGQucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlLmNvbG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIaWdobGlnaHRFZGl0b3JIaWdobGlnaHRlciBleHRlbmRzIEVkaXRvckhpZ2hsaWdodGVyIHtcclxuICAgIHByaXZhdGUgX2VkaXRvcjogQXRvbS5UZXh0RWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBfbWFya3MgPSBuZXcgTWFwPHN0cmluZywgVGV4dEJ1ZmZlci5EaXNwbGF5TWFya2VyPigpO1xyXG4gICAgLy8gcHJpdmF0ZSBfaGlnaGxpZ2h0c09ic2VydmVyOiBPYnNlcnZlcjxbSGlnaGxpZ2h0Lkl0ZW1bXSwgbnVtYmVyW11dPjtcclxuICAgIHByaXZhdGUgX2RlY29yYXRvck9ic2VydmVyOiBPYnNlcnZlcjxbVGV4dEJ1ZmZlci5EaXNwbGF5TWFya2VyLCBIaWdobGlnaHQuSXRlbV0+O1xyXG4gICAgcHJpdmF0ZSBfY29uZmlnOiBBdG9tQ29uZmlnO1xyXG4gICAgcHJpdmF0ZSBfdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBBdG9tQ29uZmlnLCB2aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlciwgZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLl92aWV3RmluZGVyID0gdmlld0ZpbmRlcjtcclxuICAgICAgICB0aGlzLl9lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgLy8gY29uc3QgaGlnaGxpZ2h0cyA9IHRoaXMuX2hpZ2hsaWdodHNPYnNlcnZlciA9IG5ldyBTdWJqZWN0PFtIaWdobGlnaHQuSXRlbVtdLCBudW1iZXJbXV0+KCk7XHJcbiAgICAgICAgY29uc3QgZGVjb3JhdG9yID0gdGhpcy5fZGVjb3JhdG9yT2JzZXJ2ZXIgPSBuZXcgU3ViamVjdDxbVGV4dEJ1ZmZlci5EaXNwbGF5TWFya2VyLCBIaWdobGlnaHQuSXRlbV0+KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXJrcy5mb3JFYWNoKHggPT4geC5kZXN0cm95KCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya3MuY2xlYXIoKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVjb3JhdG9yXHJcbiAgICAgICAgICAgICAgICAuYnVmZmVyVG9nZ2xlKGRlY29yYXRvci50aHJvdHRsZVRpbWUoNTAwKSwgKCkgPT4gT2JzZXJ2YWJsZS50aW1lcig1MDApKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShpdGVtcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGl0ZW1zLCAoW21hcmtlciwgaGlnaGxpZ2h0XSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIGhpZ2hsaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGVjb3JhdGVNYXJrZXIobWFya2VyOiBUZXh0QnVmZmVyLkRpc3BsYXlNYXJrZXIsIGhpZ2hsaWdodDogSGlnaGxpZ2h0Lkl0ZW0pIHtcclxuICAgICAgICBpZiAobWFya2VyLmlzRGVzdHJveWVkKCkpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXB1dGVDb2xvcih0aGlzLmdldENsYXNzRm9yS2luZChoaWdobGlnaHQua2luZCkpO1xyXG4gICAgICAgIGNvbnN0IGRlY29yYXRpb24gPSB0aGlzLl9lZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7IHR5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogdGhpcy5nZXRDbGFzc0ZvcktpbmQoaGlnaGxpZ2h0LmtpbmQpLmpvaW4oJyAnKSB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgICgpID0+IGRlY29yYXRpb24uZGVzdHJveSgpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0SGlnaGxpZ2h0cyhhZGRlZDogSGlnaGxpZ2h0Lkl0ZW1bXSwgcmVtb3ZlZDogc3RyaW5nW10pIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50TWFya3MgPSBfLnRvQXJyYXkodGhpcy5fbWFya3MuZW50cmllcygpKTtcclxuXHJcbiAgICAgICAgXy5lYWNoKGFkZGVkLCBoaWdobGlnaHQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaGlnaGxpZ2h0LmtpbmQgPT09ICdpZGVudGlmaWVyJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gXy5maW5kKGN1cnJlbnRNYXJrcywgKFssIG1hcmtlcl0pID0+IG1hcmtlci5nZXRCdWZmZXJSYW5nZSgpLmlzRXF1YWwoaGlnaGxpZ2h0LnJhbmdlKSk7XHJcbiAgICAgICAgICAgIGxldCBtYXJrOiBUZXh0QnVmZmVyLkRpc3BsYXlNYXJrZXI7XHJcbiAgICAgICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgbWFyayA9IHRoaXMuX2VkaXRvci5tYXJrQnVmZmVyUmFuZ2UoaGlnaGxpZ2h0LnJhbmdlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlY29yYXRvck9ic2VydmVyLm5leHQoW21hcmssIGhpZ2hsaWdodF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFya3Muc2V0KGhpZ2hsaWdodC5pZCwgbWFyayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLnB1bGwocmVtb3ZlZCwgaXRlbVswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy5lYWNoKHJlbW92ZWQsIGlkID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX21hcmtzLmhhcyhpZCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcmsgPSB0aGlzLl9tYXJrcy5nZXQoaWQpICE7XHJcbiAgICAgICAgICAgICAgICBtYXJrLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcmtzLmRlbGV0ZShpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jb2xvcnMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xyXG4gICAgcHJpdmF0ZSBfc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgcHJpdmF0ZSBfY29tcHV0ZUNvbG9yKGNsYXNzZXM6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0eWxlLnBhcmVudEVsZW1lbnQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuX3N0eWxlKTtcclxuICAgICAgICAgICAgdGhpcy5fc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlkID0gY2xhc3Nlcy5qb2luKCcuJyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbG9ycy5oYXMoaWQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcnMuZ2V0KGlkKSAhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZWRpdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvcicpO1xyXG4gICAgICAgIGNvbnN0IGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XHJcbiAgICAgICAgZWRpdG9yLmFwcGVuZENoaWxkKGQpO1xyXG4gICAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZCk7XHJcbiAgICAgICAgdGhpcy5fY29sb3JzLnNldChpZCwgc3R5bGUuY29sb3IhKTtcclxuXHJcbiAgICAgICAgaWYgKHN0eWxlLmNvbG9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBgYXRvbS10ZXh0LWVkaXRvcjo6c2hhZG93IC5oaWdobGlnaHQuJHtpZH0gLnJlZ2lvbiwgYXRvbS10ZXh0LWVkaXRvciAuaGlnaGxpZ2h0LiR7aWR9IC5yZWdpb24ge1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgJHtzdHlsZS5jb2xvcn07XHJcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XHJcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLXdpZHRoOiAwO1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS13aWR0aDogMDtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAtMnB4O1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMXB4O1xyXG4gICAgICAgICAgICAgICAgYm94LXNpemluZzogY29udGVudC1ib3ggIWltcG9ydGFudDtcclxuICAgICAgICAgICAgfVxcbmA7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0eWxlLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgKz0gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGQucmVtb3ZlKCk7XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlLmNvbG9yO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==