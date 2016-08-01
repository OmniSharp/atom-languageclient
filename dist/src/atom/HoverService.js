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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG92ZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2F0b20vSG92ZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBeUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsSUFBWSxRQUFRLFdBQU0sdUJBQXVCLENBQUMsQ0FBQTtBQUNsRCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBaUQsZ0JBQWdCLENBQUMsQ0FBQTtBQUNsRSxxQ0FBb0Msd0JBQXdCLENBQUMsQ0FBQTtBQUM3RCw2QkFBNkIsZ0JBQWdCLENBQUMsQ0FBQTtBQUM5QyxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUM5RCwrQkFBK0Isa0JBQWtCLENBQUMsQ0FBQTtBQUNsRCwwQkFBMEMsbUJBQW1CLENBQUMsQ0FBQTtBQUk5RDtJQUNZLGdDQUFtSjtJQWUzSixzQkFBWSxRQUFzQixFQUFFLGdCQUFzQyxFQUFFLFVBQTBCO1FBaEIxRyxpQkFtTUM7UUFsTE8saUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUU5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1FBRTdCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsYUFBYSxFQUFFLEVBQXBCLENBQW9CLENBQUMsRUFDckcsSUFBSSxDQUFDLGlCQUFpQixD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QUMsb0JBQW9CLEdBQUcsU0FBUyxDQUFDO1FBQzFDLENBQUM7SUFDTCxDQUFDO0lBRU8sbURBQTRCLEdBQXBDLFVBQXFDLEtBQWlCO1FBQ2xELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1YsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN2RCxJQUFNLEdBQUcsR0FBRyxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBUSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pFLElBQU0sSUFBSSxHQUFHLE9BQU8sR0FBRyxlQUFlLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDNUUsTUFBTSxDQUFDLEVBQUUsUUFBRyxFQUFFLFVBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFwTUw7UUFBQyx1QkFBVSxFQUFFO1FBQ1osa0JBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDOztvQkFBQTtJQW9NOUIsbUJBQUM7QUFBRCxDQUFDLEFBbk1ELENBQ1ksMENBQW1CLEdBa005QjtBQW5NWSxvQkFBWSxlQW1NeEIsQ0FBQTtBQUVELDhCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCAqIGFzIFNlcnZpY2VzIGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBJRGlzcG9zYWJsZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21UZXh0RWRpdG9yU291cmNlIH0gZnJvbSAnLi9BdG9tVGV4dEVkaXRvclNvdXJjZSc7XHJcbmltcG9ydCB7IEF0b21WaWV3RmluZGVyIH0gZnJvbSAnLi9BdG9tVmlld0ZpbmRlcic7XHJcbmltcG9ydCB7IEhvdmVyVmlldywgSUhvdmVyUG9zaXRpb24gfSBmcm9tICcuL3ZpZXdzL0hvdmVyVmlldyc7XHJcblxyXG5AaW5qZWN0YWJsZSgpXHJcbkBhbGlhcyhTZXJ2aWNlcy5JSG92ZXJTZXJ2aWNlKVxyXG5leHBvcnQgY2xhc3MgSG92ZXJTZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8U2VydmljZXMuSUhvdmVyUHJvdmlkZXIsIFNlcnZpY2VzLkhvdmVyLklSZXF1ZXN0LCBPYnNlcnZhYmxlPFNlcnZpY2VzLkhvdmVyLklSZXNwb25zZT4sIE9ic2VydmFibGU8U2VydmljZXMuSG92ZXIuSVJlc3BvbnNlW10+PlxyXG4gICAgaW1wbGVtZW50cyBTZXJ2aWNlcy5JSG92ZXJTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX2NvbW1hbmRzOiBBdG9tQ29tbWFuZHM7XHJcbiAgICBwcml2YXRlIF90ZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZTtcclxuICAgIHByaXZhdGUgX3ZpZXdGaW5kZXI6IEF0b21WaWV3RmluZGVyO1xyXG5cclxuICAgIHByaXZhdGUgX2VkaXRvcjogQXRvbS5UZXh0RWRpdG9yIHwgdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yVmlldzogQXRvbS5UZXh0RWRpdG9yUHJlc2VudGVyIHwgdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yU2hhZG93OiBFbGVtZW50IHwgdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yRGlzcG9zYWJsZTogSURpc3Bvc2FibGU7XHJcblxyXG4gICAgcHJpdmF0ZSBfdmlldzogSG92ZXJWaWV3O1xyXG4gICAgcHJpdmF0ZSBfa2V5ZG93bjogT2JzZXJ2YWJsZTxLZXlib2FyZEV2ZW50PjtcclxuICAgIHByaXZhdGUgX2tleWRvd25TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kczogQXRvbUNvbW1hbmRzLCB0ZXh0RWRpdG9yU291cmNlOiBBdG9tVGV4dEVkaXRvclNvdXJjZSwgdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fdGV4dEVkaXRvclNvdXJjZSA9IHRleHRFZGl0b3JTb3VyY2U7XHJcbiAgICAgICAgdGhpcy5fdmlld0ZpbmRlciA9IHZpZXdGaW5kZXI7XHJcblxyXG4gICAgICAgIHRoaXMuX3ZpZXcgPSBuZXcgSG92ZXJWaWV3KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICB0aGlzLl9jb21tYW5kcy5hZGQoU2VydmljZXMuQXRvbUNvbW1hbmRzLkNvbW1hbmRUeXBlLlRleHRFZGl0b3IsIGBob3ZlcmAsICgpID0+IHRoaXMuc2hvd09uQ29tbWFuZCgpKSxcclxuICAgICAgICAgICAgdGhpcy5fdGV4dEVkaXRvclNvdXJjZS5vYnNlcnZlQWN0aXZlVGV4dEVkaXRvclxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShfLmJpbmQodGhpcy5fc2V0dXBWaWV3LCB0aGlzKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IFNlcnZpY2VzLkhvdmVyLklSZXF1ZXN0KSA9PiBPYnNlcnZhYmxlPFNlcnZpY2VzLkhvdmVyLklSZXNwb25zZT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKG9wdGlvbnM6IFNlcnZpY2VzLkhvdmVyLklSZXF1ZXN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20oXy5vdmVyKGNhbGxiYWNrcykob3B0aW9ucykpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoXy5pZGVudGl0eSlcclxuICAgICAgICAgICAgICAgIC5zY2FuKChhY2MsIHJlc3VsdHMpID0+IF8uY29tcGFjdChhY2MuY29uY2F0KHJlc3VsdHMpKSwgW10pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0dXBWaWV3KGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgdGhpcy5faGlkZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9lZGl0b3JEaXNwb3NhYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvckRpc3Bvc2FibGUuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVkaXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yVmlldyA9IDxhbnk+dGhpcy5fdmlld0ZpbmRlci5nZXRWaWV3KGVkaXRvcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvclNoYWRvdyA9IHRoaXMuX2dldEZyb21TaGFkb3dEb20odGhpcy5fZWRpdG9yVmlldyEsICcuc2Nyb2xsLXZpZXcnKTtcclxuICAgICAgICAgICAgdGhpcy5fc2V0dXBNb3VzZShlZGl0b3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yVmlldyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yU2hhZG93ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zZXR1cE1vdXNlKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgY29uc3QgY2QgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xyXG4gICAgICAgIGNvbnN0IG1vdXNlbW92ZSA9IE9ic2VydmFibGUuZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2VkaXRvclNoYWRvdyEsICdtb3VzZW1vdmUnKTtcclxuICAgICAgICBjb25zdCBtb3VzZW91dCA9IE9ic2VydmFibGUuZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2VkaXRvclNoYWRvdyEsICdtb3VzZW91dCcpO1xyXG4gICAgICAgIHRoaXMuX2tleWRvd24gPSBPYnNlcnZhYmxlLmZyb21FdmVudDxLZXlib2FyZEV2ZW50Pih0aGlzLl9lZGl0b3JTaGFkb3chLCAna2V5ZG93bicpO1xyXG5cclxuICAgICAgICBjZC5hZGQoXHJcbiAgICAgICAgICAgIG1vdXNlbW92ZVxyXG4gICAgICAgICAgICAgICAgLm1hcChldmVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcGl4ZWxQdDogdGhpcy5fcGl4ZWxQb3NpdGlvbkZyb21Nb3VzZUV2ZW50KGV2ZW50KSAhLCBldmVudCB9O1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoY29udGV4dCA9PiAhIWNvbnRleHQucGl4ZWxQdClcclxuICAgICAgICAgICAgICAgIC5kaXN0aW5jdFVudGlsQ2hhbmdlZCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnBpeGVsUHQubGVmdCA9PT0gYi5waXhlbFB0LmxlZnQgJiYgYS5waXhlbFB0LnRvcCA9PT0gYi5waXhlbFB0LnRvcDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAubWFwKCh7cGl4ZWxQdCwgZXZlbnR9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2NyZWVuUHQgPSBlZGl0b3Iuc2NyZWVuUG9zaXRpb25Gb3JQaXhlbFBvc2l0aW9uKHBpeGVsUHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlclB0ID0gZWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBidWZmZXJQdCwgZXZlbnQgfTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZG8oKCkgPT4gdGhpcy5faGlkZSgpKVxyXG4gICAgICAgICAgICAgICAgLmF1ZGl0VGltZSgyMDApXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGVja1Bvc2l0aW9uKHguYnVmZmVyUHQpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5kbygoKSA9PiB0aGlzLl9zdWJjcmliZUtleURvd24oKSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKHtidWZmZXJQdCwgZXZlbnR9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hvd09uTW91c2VPdmVyKGV2ZW50LCBidWZmZXJQdCk7XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbW91c2VvdXRcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKGUpID0+IHRoaXMuX2hpZGUoKSksXHJcbiAgICAgICAgICAgICgpID0+IHsgdGhpcy5faGlkZSgpOyB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zdWJjcmliZUtleURvd24oKSB7XHJcbiAgICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbiA9IHRoaXMuX2tleWRvd24uc3Vic2NyaWJlKChlKSA9PiB0aGlzLl9oaWRlKCkpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93T25Db21tYW5kKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lZGl0b3IhLmN1cnNvcnMubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBidWZmZXJQdCA9IHRoaXMuX2VkaXRvciEuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrUG9zaXRpb24oYnVmZmVyUHQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZpbmQgb3V0IHNob3cgcG9zaXRpb25cclxuICAgICAgICBjb25zdCBzaGFkb3cgPSB0aGlzLl9nZXRGcm9tU2hhZG93RG9tKHRoaXMuX2VkaXRvclZpZXchLCAnLmN1cnNvci1saW5lJyk7XHJcbiAgICAgICAgaWYgKCFzaGFkb3cpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0ID0gKHRoaXMuX2VkaXRvclZpZXchLmNvbXBvbmVudC5nZXRGb250U2l6ZSgpICogYnVmZmVyUHQuY29sdW1uKSAqIDAuNztcclxuICAgICAgICBjb25zdCByZWN0ID0gc2hhZG93LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICBjb25zdCB0b29sdGlwUmVjdCA9IHtcclxuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0IC0gb2Zmc2V0LFxyXG4gICAgICAgICAgICByaWdodDogcmVjdC5sZWZ0ICsgb2Zmc2V0LFxyXG4gICAgICAgICAgICB0b3A6IHJlY3QuYm90dG9tLFxyXG4gICAgICAgICAgICBib3R0b206IHJlY3QuYm90dG9tXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5faGlkZSgpO1xyXG4gICAgICAgIHRoaXMuX3N1YmNyaWJlS2V5RG93bigpO1xyXG4gICAgICAgIHRoaXMuX3Nob3dUb29sVGlwKGJ1ZmZlclB0LCB0b29sdGlwUmVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hvd09uTW91c2VPdmVyKGU6IE1vdXNlRXZlbnQsIGJ1ZmZlclB0OiBUZXh0QnVmZmVyLlBvaW50KSB7XHJcbiAgICAgICAgLy8gZmluZCBvdXQgc2hvdyBwb3NpdGlvblxyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMuX2VkaXRvciEuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkgKiAwLjc7XHJcbiAgICAgICAgY29uc3QgdG9vbHRpcFJlY3QgPSB7XHJcbiAgICAgICAgICAgIGxlZnQ6IGUuY2xpZW50WCxcclxuICAgICAgICAgICAgcmlnaHQ6IGUuY2xpZW50WCxcclxuICAgICAgICAgICAgdG9wOiBlLmNsaWVudFkgLSBvZmZzZXQsXHJcbiAgICAgICAgICAgIGJvdHRvbTogZS5jbGllbnRZICsgb2Zmc2V0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2hvd1Rvb2xUaXAoYnVmZmVyUHQsIHRvb2x0aXBSZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jaGVja1Bvc2l0aW9uKGJ1ZmZlclB0OiBUZXh0QnVmZmVyLlBvaW50KSB7XHJcbiAgICAgICAgY29uc3QgY3VyQ2hhclBpeGVsUHQgPSB0aGlzLl9lZGl0b3IhLnBpeGVsUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUHQucm93LCBidWZmZXJQdC5jb2x1bW5dKTtcclxuICAgICAgICBjb25zdCBuZXh0Q2hhclBpeGVsUHQgPSB0aGlzLl9lZGl0b3IhLnBpeGVsUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUHQucm93LCBidWZmZXJQdC5jb2x1bW4gKyAxXSk7XHJcblxyXG4gICAgICAgIGlmIChjdXJDaGFyUGl4ZWxQdC5sZWZ0ID49IG5leHRDaGFyUGl4ZWxQdC5sZWZ0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hvd1Rvb2xUaXAoYnVmZmVyUHQ6IFRleHRCdWZmZXIuUG9pbnQsIHJlY3Q6IElIb3ZlclBvc2l0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5fdmlldy51cGRhdGVQb3NpdGlvbihyZWN0LCB0aGlzLl9lZGl0b3JWaWV3KTtcclxuICAgICAgICB0aGlzLmludm9rZSh7IGVkaXRvcjogdGhpcy5fZWRpdG9yISwgbG9jYXRpb246IGJ1ZmZlclB0IH0pXHJcbiAgICAgICAgICAgIC5zY2FuKChhY2MsIHJlc3VsdCkgPT4gYWNjLmNvbmNhdChyZXN1bHQpLCBbXSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZShyb3dzID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVzID0gXy5tYXAocm93cywgcm93ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7cm93LnRleHR9PGJyLz4ke3Jvdy5kZXNjcmlwdGlvbn1gO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmlldy5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92aWV3LnVwZGF0ZVRleHQobGluZXMuam9pbignPGJyLz4nKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEZyb21TaGFkb3dEb20oZWxlbWVudDogQXRvbS5UZXh0RWRpdG9yUHJlc2VudGVyLCBzZWxlY3Rvcjogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQucm9vdEVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGlkZSgpIHtcclxuICAgICAgICB0aGlzLl92aWV3LmhpZGUoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5yZW1vdmUodGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX2tleWRvd25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fa2V5ZG93blN1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcGl4ZWxQb3NpdGlvbkZyb21Nb3VzZUV2ZW50KGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgICAgY29uc3Qgc2hhZG93ID0gdGhpcy5fZWRpdG9yU2hhZG93O1xyXG4gICAgICAgIGlmICghc2hhZG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNsaWVudFggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgIGNvbnN0IGNsaWVudFkgPSBldmVudC5jbGllbnRZO1xyXG4gICAgICAgIGNvbnN0IGxpbmVzQ2xpZW50UmVjdCA9IHNoYWRvdy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCB0b3AgPSBjbGllbnRZIC0gbGluZXNDbGllbnRSZWN0LnRvcCArIHRoaXMuX2VkaXRvciEuZ2V0U2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGNsaWVudFggLSBsaW5lc0NsaWVudFJlY3QubGVmdCArIHRoaXMuX2VkaXRvciEuZ2V0U2Nyb2xsTGVmdCgpO1xyXG4gICAgICAgIHJldHVybiB7IHRvcCwgbGVmdCB9O1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBjbGFzcyBFZGl0b3JUb29sdGlwUHJvdmlkZXJcclxuIl19