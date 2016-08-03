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
var ts_disposables_1 = require('ts-disposables');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var AtomCommands_1 = require('./AtomCommands');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var AtomViewFinder_1 = require('./AtomViewFinder');
var HoverView_1 = require('./views/HoverView');
var HoverService = (function (_super) {
    __extends(HoverService, _super);
    function HoverService(commands, textEditorSource, viewFinder) {
        var _this = this;
        _super.call(this);
        this._commands = commands;
        this._textEditorSource = textEditorSource;
        this._viewFinder = viewFinder;
        this._view = new HoverView_1.HoverView();
        this._disposable.add(this._commands.add(Services.AtomCommands.CommandType.TextEditor, "hover", function () { return _this.showOnCommand(); }), this._textEditorSource.observeActiveTextEditor
            .subscribe(_.bind(this._setupView, this)));
    }
    HoverService.prototype.createInvoke = function (callbacks) {
        return function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .scan(function (acc, results) { return _.compact(acc.concat(results)); }, []);
        };
    };
    HoverService.prototype._setupView = function (editor) {
        this._hide();
        if (this._editorDisposable) {
            this._editorDisposable.dispose();
        }
        if (editor) {
            this._editor = editor;
            /* tslint:disable-next-line:no-any */
            this._editorView = this._viewFinder.getView(editor);
            this._editorShadow = this._getFromShadowDom(this._editorView, '.scroll-view');
            this._setupMouse(editor);
        }
        else {
            this._editor = undefined;
            this._editorView = undefined;
            this._editorShadow = undefined;
        }
    };
    HoverService.prototype._setupMouse = function (editor) {
        var _this = this;
        var cd = new ts_disposables_1.CompositeDisposable();
        var mousemove = rxjs_1.Observable.fromEvent(this._editorShadow, 'mousemove');
        var mouseout = rxjs_1.Observable.fromEvent(this._editorShadow, 'mouseout');
        this._keydown = rxjs_1.Observable.fromEvent(this._editorShadow, 'keydown');
        cd.add(mousemove
            .map(function (event) {
            return { pixelPt: _this._pixelPositionFromMouseEvent(event), event: event };
        })
            .filter(function (context) { return !!context.pixelPt; })
            .distinctUntilChanged(function (a, b) {
            return a.pixelPt.left === b.pixelPt.left && a.pixelPt.top === b.pixelPt.top;
        })
            .map(function (_a) {
            var pixelPt = _a.pixelPt, event = _a.event;
            var screenPt = editor.screenPositionForPixelPosition(pixelPt);
            var bufferPt = editor.bufferPositionForScreenPosition(screenPt);
            return { bufferPt: bufferPt, event: event };
        })
            .do(function () { return _this._hide(); })
            .auditTime(200)
            .filter(function (x) {
            return _this._checkPosition(x.bufferPt);
        })
            .do(function () { return _this._subcribeKeyDown(); })
            .subscribe(function (_a) {
            var bufferPt = _a.bufferPt, event = _a.event;
            _this._showOnMouseOver(event, bufferPt);
        }), mouseout
            .subscribe(function (e) { return _this._hide(); }), function () { _this._hide(); });
    };
    HoverService.prototype._subcribeKeyDown = function () {
        var _this = this;
        this._keydownSubscription = this._keydown.subscribe(function (e) { return _this._hide(); });
        this._disposable.add(this._keydownSubscription);
    };
    HoverService.prototype.showOnCommand = function () {
        if (this._editor.cursors.length < 1) {
            return;
        }
        var bufferPt = this._editor.getCursorBufferPosition();
        if (!this._checkPosition(bufferPt)) {
            return;
        }
        // find out show position
        var shadow = this._getFromShadowDom(this._editorView, '.cursor-line');
        if (!shadow) {
            return;
        }
        var offset = (this._editorView.component.getFontSize() * bufferPt.column) * 0.7;
        var rect = shadow.getBoundingClientRect();
        var tooltipRect = {
            left: rect.left - offset,
            right: rect.left + offset,
            top: rect.bottom,
            bottom: rect.bottom
        };
        this._hide();
        this._subcribeKeyDown();
        this._showToolTip(bufferPt, tooltipRect);
    };
    HoverService.prototype._showOnMouseOver = function (e, bufferPt) {
        // find out show position
        var offset = this._editor.getLineHeightInPixels() * 0.7;
        var tooltipRect = {
            left: e.clientX,
            right: e.clientX,
            top: e.clientY - offset,
            bottom: e.clientY + offset
        };
        this._showToolTip(bufferPt, tooltipRect);
    };
    HoverService.prototype._checkPosition = function (bufferPt) {
        var curCharPixelPt = this._editor.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column]);
        var nextCharPixelPt = this._editor.pixelPositionForBufferPosition([bufferPt.row, bufferPt.column + 1]);
        if (curCharPixelPt.left >= nextCharPixelPt.left) {
            return false;
        }
        else {
            return true;
        }
    };
    HoverService.prototype._showToolTip = function (bufferPt, rect) {
        var _this = this;
        this._view.updatePosition(rect, this._editorView);
        this.invoke({ editor: this._editor, location: bufferPt })
            .scan(function (acc, result) { return acc.concat(result); }, [])
            .map(function (rows) { return _.filter(rows, function (row) { return !!row.text; }); })
            .subscribe(function (rows) {
            var lines = _.map(rows, function (row) {
                return row.text + "<br/>" + row.description;
            });
            _this._view.show();
            _this._view.updateText(lines.join('<br/>'));
        });
    };
    HoverService.prototype._getFromShadowDom = function (element, selector) {
        return element.rootElement.querySelector(selector);
    };
    HoverService.prototype._hide = function () {
        this._view.hide();
        if (this._keydownSubscription) {
            this._disposable.remove(this._keydownSubscription);
            this._keydownSubscription.unsubscribe();
            this._keydownSubscription = undefined;
        }
    };
    HoverService.prototype._pixelPositionFromMouseEvent = function (event) {
        var shadow = this._editorShadow;
        if (!shadow) {
            return;
        }
        var clientX = event.clientX;
        var clientY = event.clientY;
        var linesClientRect = shadow.getBoundingClientRect();
        var top = clientY - linesClientRect.top + this._editor.getScrollTop();
        var left = clientX - linesClientRect.left + this._editor.getScrollLeft();
        return { top: top, left: left };
    };
    HoverService = __decorate([
        decorators_1.injectable(),
        decorators_1.alias(Services.IHoverService), 
        __metadata('design:paramtypes', [AtomCommands_1.AtomCommands, AtomTextEditorSource_1.AtomTextEditorSource, AtomViewFinder_1.AtomViewFinder])
    ], HoverService);
    return HoverService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.HoverService = HoverService;
// class EditorTooltipProvider
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG92ZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vSG92ZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBeUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsSUFBWSxRQUFRLFdBQU0sdUJBQXVCLENBQUMsQ0FBQTtBQUNsRCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBaUQsZ0JBQWdCLENBQUMsQ0FBQTtBQUNsRSxxQ0FBb0Msd0JBQXdCLENBQUMsQ0FBQTtBQUM3RCw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5QyxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCwrQkFBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCwwQkFBMEMsbUJBQW1CLENBQUMsQ0FBQTtBQUk5RDtJQUNZLGdDQUFtSjtJQWUzSixzQkFBWSxRQUFzQixFQUFFLGdCQUFzQyxFQUFFLFVBQTBCO1FBaEIxRyxpQkFvTUM7UUFuTE8saUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUU5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBRTdCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsYUFBYSxFQUFFLEVBQXBCLENBQW9CLENBQUMsRUFDckcsSUFBSSxDQUFDLGlCQUFpQixD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dCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0ICogYXMgU2VydmljZXMgZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIElEaXNwb3NhYmxlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBQcm92aWRlclNlcnZpY2VCYXNlIH0gZnJvbSAnLi9fUHJvdmlkZXJTZXJ2aWNlQmFzZSc7XHJcbmltcG9ydCB7IEF0b21Db21tYW5kcyB9IGZyb20gJy4vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgQXRvbVRleHRFZGl0b3JTb3VyY2UgfSBmcm9tICcuL0F0b21UZXh0RWRpdG9yU291cmNlJztcclxuaW1wb3J0IHsgQXRvbVZpZXdGaW5kZXIgfSBmcm9tICcuL0F0b21WaWV3RmluZGVyJztcclxuaW1wb3J0IHsgSG92ZXJWaWV3LCBJSG92ZXJQb3NpdGlvbiB9IGZyb20gJy4vdmlld3MvSG92ZXJWaWV3JztcclxuXHJcbkBpbmplY3RhYmxlKClcclxuQGFsaWFzKFNlcnZpY2VzLklIb3ZlclNlcnZpY2UpXHJcbmV4cG9ydCBjbGFzcyBIb3ZlclNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxTZXJ2aWNlcy5JSG92ZXJQcm92aWRlciwgU2VydmljZXMuSG92ZXIuSVJlcXVlc3QsIE9ic2VydmFibGU8U2VydmljZXMuSG92ZXIuSVJlc3BvbnNlPiwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5Ib3Zlci5JUmVzcG9uc2VbXT4+XHJcbiAgICBpbXBsZW1lbnRzIFNlcnZpY2VzLklIb3ZlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IEF0b21Db21tYW5kcztcclxuICAgIHByaXZhdGUgX3RleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlO1xyXG4gICAgcHJpdmF0ZSBfdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JWaWV3OiBBdG9tLlRleHRFZGl0b3JQcmVzZW50ZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JTaGFkb3c6IEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JEaXNwb3NhYmxlOiBJRGlzcG9zYWJsZTtcclxuXHJcbiAgICBwcml2YXRlIF92aWV3OiBIb3ZlclZpZXc7XHJcbiAgICBwcml2YXRlIF9rZXlkb3duOiBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+O1xyXG4gICAgcHJpdmF0ZSBfa2V5ZG93blN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbW1hbmRzOiBBdG9tQ29tbWFuZHMsIHRleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlLCB2aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl90ZXh0RWRpdG9yU291cmNlID0gdGV4dEVkaXRvclNvdXJjZTtcclxuICAgICAgICB0aGlzLl92aWV3RmluZGVyID0gdmlld0ZpbmRlcjtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlldyA9IG5ldyBIb3ZlclZpZXcoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRzLmFkZChTZXJ2aWNlcy5BdG9tQ29tbWFuZHMuQ29tbWFuZFR5cGUuVGV4dEVkaXRvciwgYGhvdmVyYCwgKCkgPT4gdGhpcy5zaG93T25Db21tYW5kKCkpLFxyXG4gICAgICAgICAgICB0aGlzLl90ZXh0RWRpdG9yU291cmNlLm9ic2VydmVBY3RpdmVUZXh0RWRpdG9yXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKF8uYmluZCh0aGlzLl9zZXR1cFZpZXcsIHRoaXMpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgob3B0aW9uczogU2VydmljZXMuSG92ZXIuSVJlcXVlc3QpID0+IE9ic2VydmFibGU8U2VydmljZXMuSG92ZXIuSVJlc3BvbnNlPilbXSkge1xyXG4gICAgICAgIHJldHVybiAob3B0aW9uczogU2VydmljZXMuSG92ZXIuSVJlcXVlc3QpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbShfLm92ZXIoY2FsbGJhY2tzKShvcHRpb25zKSlcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcChfLmlkZW50aXR5KVxyXG4gICAgICAgICAgICAgICAgLnNjYW4oKGFjYywgcmVzdWx0cykgPT4gXy5jb21wYWN0KGFjYy5jb25jYXQocmVzdWx0cykpLCBbXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zZXR1cFZpZXcoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICB0aGlzLl9oaWRlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VkaXRvckRpc3Bvc2FibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yRGlzcG9zYWJsZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvciA9IGVkaXRvcjtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JWaWV3ID0gPGFueT50aGlzLl92aWV3RmluZGVyLmdldFZpZXcoZWRpdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yU2hhZG93ID0gdGhpcy5fZ2V0RnJvbVNoYWRvd0RvbSh0aGlzLl9lZGl0b3JWaWV3ISwgJy5zY3JvbGwtdmlldycpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXR1cE1vdXNlKGVkaXRvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JWaWV3ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JTaGFkb3cgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldHVwTW91c2UoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBjb25zdCBjZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XHJcbiAgICAgICAgY29uc3QgbW91c2Vtb3ZlID0gT2JzZXJ2YWJsZS5mcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5fZWRpdG9yU2hhZG93ISwgJ21vdXNlbW92ZScpO1xyXG4gICAgICAgIGNvbnN0IG1vdXNlb3V0ID0gT2JzZXJ2YWJsZS5mcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5fZWRpdG9yU2hhZG93ISwgJ21vdXNlb3V0Jyk7XHJcbiAgICAgICAgdGhpcy5fa2V5ZG93biA9IE9ic2VydmFibGUuZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KHRoaXMuX2VkaXRvclNoYWRvdyEsICdrZXlkb3duJyk7XHJcblxyXG4gICAgICAgIGNkLmFkZChcclxuICAgICAgICAgICAgbW91c2Vtb3ZlXHJcbiAgICAgICAgICAgICAgICAubWFwKGV2ZW50ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBwaXhlbFB0OiB0aGlzLl9waXhlbFBvc2l0aW9uRnJvbU1vdXNlRXZlbnQoZXZlbnQpICEsIGV2ZW50IH07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihjb250ZXh0ID0+ICEhY29udGV4dC5waXhlbFB0KVxyXG4gICAgICAgICAgICAgICAgLmRpc3RpbmN0VW50aWxDaGFuZ2VkKChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEucGl4ZWxQdC5sZWZ0ID09PSBiLnBpeGVsUHQubGVmdCAmJiBhLnBpeGVsUHQudG9wID09PSBiLnBpeGVsUHQudG9wO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5tYXAoKHtwaXhlbFB0LCBldmVudH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzY3JlZW5QdCA9IGVkaXRvci5zY3JlZW5Qb3NpdGlvbkZvclBpeGVsUG9zaXRpb24ocGl4ZWxQdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyUHQgPSBlZGl0b3IuYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihzY3JlZW5QdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGJ1ZmZlclB0LCBldmVudCB9O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5kbygoKSA9PiB0aGlzLl9oaWRlKCkpXHJcbiAgICAgICAgICAgICAgICAuYXVkaXRUaW1lKDIwMClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoZWNrUG9zaXRpb24oeC5idWZmZXJQdCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmRvKCgpID0+IHRoaXMuX3N1YmNyaWJlS2V5RG93bigpKVxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoe2J1ZmZlclB0LCBldmVudH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaG93T25Nb3VzZU92ZXIoZXZlbnQsIGJ1ZmZlclB0KTtcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBtb3VzZW91dFxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoZSkgPT4gdGhpcy5faGlkZSgpKSxcclxuICAgICAgICAgICAgKCkgPT4geyB0aGlzLl9oaWRlKCk7IH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3N1YmNyaWJlS2V5RG93bigpIHtcclxuICAgICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uID0gdGhpcy5fa2V5ZG93bi5zdWJzY3JpYmUoKGUpID0+IHRoaXMuX2hpZGUoKSk7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQodGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dPbkNvbW1hbmQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VkaXRvciEuY3Vyc29ycy5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJ1ZmZlclB0ID0gdGhpcy5fZWRpdG9yIS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpO1xyXG4gICAgICAgIGlmICghdGhpcy5fY2hlY2tQb3NpdGlvbihidWZmZXJQdCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmluZCBvdXQgc2hvdyBwb3NpdGlvblxyXG4gICAgICAgIGNvbnN0IHNoYWRvdyA9IHRoaXMuX2dldEZyb21TaGFkb3dEb20odGhpcy5fZWRpdG9yVmlldyEsICcuY3Vyc29yLWxpbmUnKTtcclxuICAgICAgICBpZiAoIXNoYWRvdykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvZmZzZXQgPSAodGhpcy5fZWRpdG9yVmlldyEuY29tcG9uZW50LmdldEZvbnRTaXplKCkgKiBidWZmZXJQdC5jb2x1bW4pICogMC43O1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBzaGFkb3cuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvb2x0aXBSZWN0ID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQgLSBvZmZzZXQsXHJcbiAgICAgICAgICAgIHJpZ2h0OiByZWN0LmxlZnQgKyBvZmZzZXQsXHJcbiAgICAgICAgICAgIHRvcDogcmVjdC5ib3R0b20sXHJcbiAgICAgICAgICAgIGJvdHRvbTogcmVjdC5ib3R0b21cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5fc3ViY3JpYmVLZXlEb3duKCk7XHJcbiAgICAgICAgdGhpcy5fc2hvd1Rvb2xUaXAoYnVmZmVyUHQsIHRvb2x0aXBSZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaG93T25Nb3VzZU92ZXIoZTogTW91c2VFdmVudCwgYnVmZmVyUHQ6IFRleHRCdWZmZXIuUG9pbnQpIHtcclxuICAgICAgICAvLyBmaW5kIG91dCBzaG93IHBvc2l0aW9uXHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gdGhpcy5fZWRpdG9yIS5nZXRMaW5lSGVpZ2h0SW5QaXhlbHMoKSAqIDAuNztcclxuICAgICAgICBjb25zdCB0b29sdGlwUmVjdCA9IHtcclxuICAgICAgICAgICAgbGVmdDogZS5jbGllbnRYLFxyXG4gICAgICAgICAgICByaWdodDogZS5jbGllbnRYLFxyXG4gICAgICAgICAgICB0b3A6IGUuY2xpZW50WSAtIG9mZnNldCxcclxuICAgICAgICAgICAgYm90dG9tOiBlLmNsaWVudFkgKyBvZmZzZXRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLl9zaG93VG9vbFRpcChidWZmZXJQdCwgdG9vbHRpcFJlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NoZWNrUG9zaXRpb24oYnVmZmVyUHQ6IFRleHRCdWZmZXIuUG9pbnQpIHtcclxuICAgICAgICBjb25zdCBjdXJDaGFyUGl4ZWxQdCA9IHRoaXMuX2VkaXRvciEucGl4ZWxQb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJQdC5yb3csIGJ1ZmZlclB0LmNvbHVtbl0pO1xyXG4gICAgICAgIGNvbnN0IG5leHRDaGFyUGl4ZWxQdCA9IHRoaXMuX2VkaXRvciEucGl4ZWxQb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJQdC5yb3csIGJ1ZmZlclB0LmNvbHVtbiArIDFdKTtcclxuXHJcbiAgICAgICAgaWYgKGN1ckNoYXJQaXhlbFB0LmxlZnQgPj0gbmV4dENoYXJQaXhlbFB0LmxlZnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaG93VG9vbFRpcChidWZmZXJQdDogVGV4dEJ1ZmZlci5Qb2ludCwgcmVjdDogSUhvdmVyUG9zaXRpb24pIHtcclxuICAgICAgICB0aGlzLl92aWV3LnVwZGF0ZVBvc2l0aW9uKHJlY3QsIHRoaXMuX2VkaXRvclZpZXcpO1xyXG4gICAgICAgIHRoaXMuaW52b2tlKHsgZWRpdG9yOiB0aGlzLl9lZGl0b3IhLCBsb2NhdGlvbjogYnVmZmVyUHQgfSlcclxuICAgICAgICAgICAgLnNjYW4oKGFjYywgcmVzdWx0KSA9PiBhY2MuY29uY2F0KHJlc3VsdCksIFtdKVxyXG4gICAgICAgICAgICAubWFwKHJvd3MgPT4gXy5maWx0ZXIocm93cywgcm93ID0+ICEhcm93LnRleHQpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHJvd3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBfLm1hcChyb3dzLCByb3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtyb3cudGV4dH08YnIvPiR7cm93LmRlc2NyaXB0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3LnNob3coKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcudXBkYXRlVGV4dChsaW5lcy5qb2luKCc8YnIvPicpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0RnJvbVNoYWRvd0RvbShlbGVtZW50OiBBdG9tLlRleHRFZGl0b3JQcmVzZW50ZXIsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudC5yb290RWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9oaWRlKCkge1xyXG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLnJlbW92ZSh0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9waXhlbFBvc2l0aW9uRnJvbU1vdXNlRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zdCBzaGFkb3cgPSB0aGlzLl9lZGl0b3JTaGFkb3c7XHJcbiAgICAgICAgaWYgKCFzaGFkb3cpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xpZW50WCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgY29uc3QgY2xpZW50WSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICAgICAgY29uc3QgbGluZXNDbGllbnRSZWN0ID0gc2hhZG93LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IHRvcCA9IGNsaWVudFkgLSBsaW5lc0NsaWVudFJlY3QudG9wICsgdGhpcy5fZWRpdG9yIS5nZXRTY3JvbGxUb3AoKTtcclxuICAgICAgICBjb25zdCBsZWZ0ID0gY2xpZW50WCAtIGxpbmVzQ2xpZW50UmVjdC5sZWZ0ICsgdGhpcy5fZWRpdG9yIS5nZXRTY3JvbGxMZWZ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHsgdG9wLCBsZWZ0IH07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGNsYXNzIEVkaXRvclRvb2x0aXBQcm92aWRlclxyXG4iXX0=