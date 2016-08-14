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
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var decorators_2 = require('../decorators');
var AtomTextEditorSource_1 = require('./AtomTextEditorSource');
var AtomViewFinder_1 = require('./AtomViewFinder');
var CommandsService_1 = require('./CommandsService');
var HoverView_1 = require('./views/HoverView');
var HoverService = (function (_super) {
    __extends(HoverService, _super);
    function HoverService(commands, textEditorSource, viewFinder) {
        _super.call(this);
        this._commands = commands;
        this._textEditorSource = textEditorSource;
        this._viewFinder = viewFinder;
        this._view = new HoverView_1.HoverView();
    }
    HoverService.prototype.onEnabled = function () {
        var _this = this;
        return new ts_disposables_1.CompositeDisposable(this._commands.add(atom_languageservices_1.CommandType.TextEditor, "lookup", 'f1', function () { return _this.showOnCommand(); }), this._textEditorSource.observeActiveTextEditor
            .subscribe(_.bind(this._setupView, this)));
    };
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
        if (!this._editor) {
            return false;
        }
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
        decorators_1.alias(atom_languageservices_1.IHoverService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for getting lookup info on hover / key press'
        }), 
        __metadata('design:paramtypes', [CommandsService_1.CommandsService, AtomTextEditorSource_1.AtomTextEditorSource, AtomViewFinder_1.AtomViewFinder])
    ], HoverService);
    return HoverService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.HoverService = HoverService;
// class EditorTooltipProvider
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG92ZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vSG92ZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBeUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsc0NBQWtFLHVCQUF1QixDQUFDLENBQUE7QUFDMUYsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUsK0JBQWlELGdCQUFnQixDQUFDLENBQUE7QUFDbEUscUNBQW9DLHdCQUF3QixDQUFDLENBQUE7QUFDN0QsMkJBQTJCLGVBQWUsQ0FBQyxDQUFBO0FBQzNDLHFDQUFxQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzlELCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELGdDQUFnQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3BELDBCQUEwQyxtQkFBbUIsQ0FBQyxDQUFBO0FBUTlEO0lBQ1ksZ0NBQStHO0lBZXZILHNCQUFZLFFBQXlCLEVBQUUsZ0JBQXNDLEVBQUUsVUFBMEI7UUFDckcsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUU5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxnQ0FBUyxHQUFoQjtRQUFBLGlCQU1DO1FBTEcsTUFBTSxDQUFDLElBQUksb0NBQW1CLENBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1DQUFXLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxhQUFhLEVBQUUsRUFBcEIsQ0FB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QUNiLFdBQVcsRUFBRSwyREFBMkQ7U0FDM0UsQ0FBQzs7b0JBQUE7SUEyTUYsbUJBQUM7QUFBRCxDQUFDLEFBMU1ELENBQ1ksMENBQW1CLEdBeU05QjtBQTFNWSxvQkFBWSxlQTBNeEIsQ0FBQTtBQUVELDhCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENvbW1hbmRUeXBlLCBIb3ZlciwgSUhvdmVyUHJvdmlkZXIsIElIb3ZlclNlcnZpY2UgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgSURpc3Bvc2FibGUgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgYXRvbUNvbmZpZyB9IGZyb20gJy4uL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBBdG9tVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4vQXRvbVRleHRFZGl0b3JTb3VyY2UnO1xyXG5pbXBvcnQgeyBBdG9tVmlld0ZpbmRlciB9IGZyb20gJy4vQXRvbVZpZXdGaW5kZXInO1xyXG5pbXBvcnQgeyBDb21tYW5kc1NlcnZpY2UgfSBmcm9tICcuL0NvbW1hbmRzU2VydmljZSc7XHJcbmltcG9ydCB7IEhvdmVyVmlldywgSUhvdmVyUG9zaXRpb24gfSBmcm9tICcuL3ZpZXdzL0hvdmVyVmlldyc7XHJcblxyXG5AaW5qZWN0YWJsZSgpXHJcbkBhbGlhcyhJSG92ZXJTZXJ2aWNlKVxyXG5AYXRvbUNvbmZpZyh7XHJcbiAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgZGVzY3JpcHRpb246ICdBZGRzIHN1cHBvcnQgZm9yIGdldHRpbmcgbG9va3VwIGluZm8gb24gaG92ZXIgLyBrZXkgcHJlc3MnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIb3ZlclNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxJSG92ZXJQcm92aWRlciwgSG92ZXIuSVJlcXVlc3QsIE9ic2VydmFibGU8SG92ZXIuSVJlc3BvbnNlPiwgT2JzZXJ2YWJsZTxIb3Zlci5JUmVzcG9uc2VbXT4+XHJcbiAgICBpbXBsZW1lbnRzIElIb3ZlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IENvbW1hbmRzU2VydmljZTtcclxuICAgIHByaXZhdGUgX3RleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlO1xyXG4gICAgcHJpdmF0ZSBfdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JWaWV3OiBBdG9tLlRleHRFZGl0b3JQcmVzZW50ZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JTaGFkb3c6IEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JEaXNwb3NhYmxlOiBJRGlzcG9zYWJsZTtcclxuXHJcbiAgICBwcml2YXRlIF92aWV3OiBIb3ZlclZpZXc7XHJcbiAgICBwcml2YXRlIF9rZXlkb3duOiBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+O1xyXG4gICAgcHJpdmF0ZSBfa2V5ZG93blN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbW1hbmRzOiBDb21tYW5kc1NlcnZpY2UsIHRleHRFZGl0b3JTb3VyY2U6IEF0b21UZXh0RWRpdG9yU291cmNlLCB2aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl90ZXh0RWRpdG9yU291cmNlID0gdGV4dEVkaXRvclNvdXJjZTtcclxuICAgICAgICB0aGlzLl92aWV3RmluZGVyID0gdmlld0ZpbmRlcjtcclxuXHJcbiAgICAgICAgdGhpcy5fdmlldyA9IG5ldyBIb3ZlclZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGVkKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcclxuICAgICAgICAgICAgdGhpcy5fY29tbWFuZHMuYWRkKENvbW1hbmRUeXBlLlRleHRFZGl0b3IsIGBsb29rdXBgLCAnZjEnLCAoKSA9PiB0aGlzLnNob3dPbkNvbW1hbmQoKSksXHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRFZGl0b3JTb3VyY2Uub2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3JcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoXy5iaW5kKHRoaXMuX3NldHVwVmlldywgdGhpcykpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlSW52b2tlKGNhbGxiYWNrczogKChvcHRpb25zOiBIb3Zlci5JUmVxdWVzdCkgPT4gT2JzZXJ2YWJsZTxIb3Zlci5JUmVzcG9uc2U+KVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIChvcHRpb25zOiBIb3Zlci5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5mcm9tKF8ub3ZlcihjYWxsYmFja3MpKG9wdGlvbnMpKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKF8uaWRlbnRpdHkpXHJcbiAgICAgICAgICAgICAgICAuc2NhbigoYWNjLCByZXN1bHRzKSA9PiBfLmNvbXBhY3QoYWNjLmNvbmNhdChyZXN1bHRzKSksIFtdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldHVwVmlldyhlZGl0b3I6IEF0b20uVGV4dEVkaXRvcikge1xyXG4gICAgICAgIHRoaXMuX2hpZGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fZWRpdG9yRGlzcG9zYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JEaXNwb3NhYmxlLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55ICovXHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvclZpZXcgPSA8YW55PnRoaXMuX3ZpZXdGaW5kZXIuZ2V0VmlldyhlZGl0b3IpO1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JTaGFkb3cgPSB0aGlzLl9nZXRGcm9tU2hhZG93RG9tKHRoaXMuX2VkaXRvclZpZXchLCAnLnNjcm9sbC12aWV3Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldHVwTW91c2UoZWRpdG9yKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3IgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvclZpZXcgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvclNoYWRvdyA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0dXBNb3VzZShlZGl0b3I6IEF0b20uVGV4dEVkaXRvcikge1xyXG4gICAgICAgIGNvbnN0IGNkID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuICAgICAgICBjb25zdCBtb3VzZW1vdmUgPSBPYnNlcnZhYmxlLmZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLl9lZGl0b3JTaGFkb3chLCAnbW91c2Vtb3ZlJyk7XHJcbiAgICAgICAgY29uc3QgbW91c2VvdXQgPSBPYnNlcnZhYmxlLmZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLl9lZGl0b3JTaGFkb3chLCAnbW91c2VvdXQnKTtcclxuICAgICAgICB0aGlzLl9rZXlkb3duID0gT2JzZXJ2YWJsZS5mcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4odGhpcy5fZWRpdG9yU2hhZG93ISwgJ2tleWRvd24nKTtcclxuXHJcbiAgICAgICAgY2QuYWRkKFxyXG4gICAgICAgICAgICBtb3VzZW1vdmVcclxuICAgICAgICAgICAgICAgIC5tYXAoZXZlbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHBpeGVsUHQ6IHRoaXMuX3BpeGVsUG9zaXRpb25Gcm9tTW91c2VFdmVudChldmVudCkgISwgZXZlbnQgfTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGNvbnRleHQgPT4gISFjb250ZXh0LnBpeGVsUHQpXHJcbiAgICAgICAgICAgICAgICAuZGlzdGluY3RVbnRpbENoYW5nZWQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5waXhlbFB0LmxlZnQgPT09IGIucGl4ZWxQdC5sZWZ0ICYmIGEucGl4ZWxQdC50b3AgPT09IGIucGl4ZWxQdC50b3A7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm1hcCgoe3BpeGVsUHQsIGV2ZW50fSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjcmVlblB0ID0gZWRpdG9yLnNjcmVlblBvc2l0aW9uRm9yUGl4ZWxQb3NpdGlvbihwaXhlbFB0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBidWZmZXJQdCA9IGVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHNjcmVlblB0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgYnVmZmVyUHQsIGV2ZW50IH07XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmRvKCgpID0+IHRoaXMuX2hpZGUoKSlcclxuICAgICAgICAgICAgICAgIC5hdWRpdFRpbWUoMjAwKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hlY2tQb3NpdGlvbih4LmJ1ZmZlclB0KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZG8oKCkgPT4gdGhpcy5fc3ViY3JpYmVLZXlEb3duKCkpXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCh7YnVmZmVyUHQsIGV2ZW50fSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nob3dPbk1vdXNlT3ZlcihldmVudCwgYnVmZmVyUHQpO1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIG1vdXNlb3V0XHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKChlKSA9PiB0aGlzLl9oaWRlKCkpLFxyXG4gICAgICAgICAgICAoKSA9PiB7IHRoaXMuX2hpZGUoKTsgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc3ViY3JpYmVLZXlEb3duKCkge1xyXG4gICAgICAgIHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24gPSB0aGlzLl9rZXlkb3duLnN1YnNjcmliZSgoZSkgPT4gdGhpcy5faGlkZSgpKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZCh0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd09uQ29tbWFuZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZWRpdG9yIS5jdXJzb3JzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYnVmZmVyUHQgPSB0aGlzLl9lZGl0b3IhLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jaGVja1Bvc2l0aW9uKGJ1ZmZlclB0KSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaW5kIG91dCBzaG93IHBvc2l0aW9uXHJcbiAgICAgICAgY29uc3Qgc2hhZG93ID0gdGhpcy5fZ2V0RnJvbVNoYWRvd0RvbSh0aGlzLl9lZGl0b3JWaWV3ISwgJy5jdXJzb3ItbGluZScpO1xyXG4gICAgICAgIGlmICghc2hhZG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9ICh0aGlzLl9lZGl0b3JWaWV3IS5jb21wb25lbnQuZ2V0Rm9udFNpemUoKSAqIGJ1ZmZlclB0LmNvbHVtbikgKiAwLjc7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IHNoYWRvdy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9vbHRpcFJlY3QgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCAtIG9mZnNldCxcclxuICAgICAgICAgICAgcmlnaHQ6IHJlY3QubGVmdCArIG9mZnNldCxcclxuICAgICAgICAgICAgdG9wOiByZWN0LmJvdHRvbSxcclxuICAgICAgICAgICAgYm90dG9tOiByZWN0LmJvdHRvbVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX2hpZGUoKTtcclxuICAgICAgICB0aGlzLl9zdWJjcmliZUtleURvd24oKTtcclxuICAgICAgICB0aGlzLl9zaG93VG9vbFRpcChidWZmZXJQdCwgdG9vbHRpcFJlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Nob3dPbk1vdXNlT3ZlcihlOiBNb3VzZUV2ZW50LCBidWZmZXJQdDogVGV4dEJ1ZmZlci5Qb2ludCkge1xyXG4gICAgICAgIC8vIGZpbmQgb3V0IHNob3cgcG9zaXRpb25cclxuICAgICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLl9lZGl0b3IhLmdldExpbmVIZWlnaHRJblBpeGVscygpICogMC43O1xyXG4gICAgICAgIGNvbnN0IHRvb2x0aXBSZWN0ID0ge1xyXG4gICAgICAgICAgICBsZWZ0OiBlLmNsaWVudFgsXHJcbiAgICAgICAgICAgIHJpZ2h0OiBlLmNsaWVudFgsXHJcbiAgICAgICAgICAgIHRvcDogZS5jbGllbnRZIC0gb2Zmc2V0LFxyXG4gICAgICAgICAgICBib3R0b206IGUuY2xpZW50WSArIG9mZnNldFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuX3Nob3dUb29sVGlwKGJ1ZmZlclB0LCB0b29sdGlwUmVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2hlY2tQb3NpdGlvbihidWZmZXJQdDogVGV4dEJ1ZmZlci5Qb2ludCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGN1ckNoYXJQaXhlbFB0ID0gdGhpcy5fZWRpdG9yLnBpeGVsUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUHQucm93LCBidWZmZXJQdC5jb2x1bW5dKTtcclxuICAgICAgICBjb25zdCBuZXh0Q2hhclBpeGVsUHQgPSB0aGlzLl9lZGl0b3IucGl4ZWxQb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJQdC5yb3csIGJ1ZmZlclB0LmNvbHVtbiArIDFdKTtcclxuXHJcbiAgICAgICAgaWYgKGN1ckNoYXJQaXhlbFB0LmxlZnQgPj0gbmV4dENoYXJQaXhlbFB0LmxlZnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaG93VG9vbFRpcChidWZmZXJQdDogVGV4dEJ1ZmZlci5Qb2ludCwgcmVjdDogSUhvdmVyUG9zaXRpb24pIHtcclxuICAgICAgICB0aGlzLl92aWV3LnVwZGF0ZVBvc2l0aW9uKHJlY3QsIHRoaXMuX2VkaXRvclZpZXcpO1xyXG4gICAgICAgIHRoaXMuaW52b2tlKHsgZWRpdG9yOiB0aGlzLl9lZGl0b3IhLCBsb2NhdGlvbjogYnVmZmVyUHQgfSlcclxuICAgICAgICAgICAgLnNjYW4oKGFjYywgcmVzdWx0KSA9PiBhY2MuY29uY2F0KHJlc3VsdCksIFtdKVxyXG4gICAgICAgICAgICAubWFwKHJvd3MgPT4gXy5maWx0ZXIocm93cywgcm93ID0+ICEhcm93LnRleHQpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHJvd3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZXMgPSBfLm1hcChyb3dzLCByb3cgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHtyb3cudGV4dH08YnIvPiR7cm93LmRlc2NyaXB0aW9ufWA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3LnNob3coKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcudXBkYXRlVGV4dChsaW5lcy5qb2luKCc8YnIvPicpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0RnJvbVNoYWRvd0RvbShlbGVtZW50OiBBdG9tLlRleHRFZGl0b3JQcmVzZW50ZXIsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudC5yb290RWxlbWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9oaWRlKCkge1xyXG4gICAgICAgIHRoaXMuX3ZpZXcuaGlkZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLnJlbW92ZSh0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9rZXlkb3duU3Vic2NyaXB0aW9uID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9waXhlbFBvc2l0aW9uRnJvbU1vdXNlRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgICAgICBjb25zdCBzaGFkb3cgPSB0aGlzLl9lZGl0b3JTaGFkb3c7XHJcbiAgICAgICAgaWYgKCFzaGFkb3cpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY2xpZW50WCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgY29uc3QgY2xpZW50WSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICAgICAgY29uc3QgbGluZXNDbGllbnRSZWN0ID0gc2hhZG93LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IHRvcCA9IGNsaWVudFkgLSBsaW5lc0NsaWVudFJlY3QudG9wICsgdGhpcy5fZWRpdG9yIS5nZXRTY3JvbGxUb3AoKTtcclxuICAgICAgICBjb25zdCBsZWZ0ID0gY2xpZW50WCAtIGxpbmVzQ2xpZW50UmVjdC5sZWZ0ICsgdGhpcy5fZWRpdG9yIS5nZXRTY3JvbGxMZWZ0KCk7XHJcbiAgICAgICAgcmV0dXJuIHsgdG9wLCBsZWZ0IH07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGNsYXNzIEVkaXRvclRvb2x0aXBQcm92aWRlclxyXG4iXX0=