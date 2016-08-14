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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var protocol_1 = require('atom-languageservices/protocol');
var types_1 = require('atom-languageservices/types');
var toUri = require('file-url');
var ts_disposables_1 = require('ts-disposables');
var HoverProtocol = (function (_super) {
    __extends(HoverProtocol, _super);
    function HoverProtocol(client, finderService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._hoverService = finderService;
        this._syncExpression = syncExpression;
        // TODO: Handle trigger characters
        var service = new HoverProvider(client, syncExpression);
        this._disposable.add(service);
        this._hoverService.registerProvider(service);
    }
    HoverProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.hoverProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IHoverService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], HoverProtocol);
    return HoverProtocol;
}(ts_disposables_1.DisposableBase));
exports.HoverProtocol = HoverProtocol;
var HoverProvider = (function (_super) {
    __extends(HoverProvider, _super);
    function HoverProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    HoverProvider.prototype.request = function (options) {
        var _this = this;
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        return this._client.sendRequest(protocol_1.HoverRequest.type, {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            position: types_1.Position.create(options.location.row, options.location.column)
        }).map(function (result) {
            return _this._makeSymbol(result);
        })
            .filter(function (x) { return !!x; });
    };
    HoverProvider.prototype._getString = function (markedString) {
        if (_.isString(markedString)) {
            return markedString;
        }
        else {
            if (markedString.language === 'string') {
                return markedString.value;
            }
            return "[" + markedString.language + "]: " + markedString.value;
        }
    };
    HoverProvider.prototype._makeSymbol = function (s) {
        var _this = this;
        if (!s) {
            return undefined;
        }
        var text;
        var description = [];
        if (_.isArray(s.contents)) {
            var values = _.map(s.contents, function (content) { return _this._getString(content); });
            text = values[0];
            description = _.drop(values, 1);
        }
        else {
            text = this._getString(s.contents);
        }
        // TODO: Icon html
        return { text: text, description: description.join('<br/>') };
    };
    return HoverProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG92ZXJQcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYXBhYmlsaXRpZXMvSG92ZXJQcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUErRix1QkFBdUIsQ0FBQyxDQUFBO0FBQ3ZILDJCQUFtQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3RFLHlCQUE2QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzlELHNCQUFnRiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzlHLElBQVksS0FBSyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBR2hEO0lBQW1DLGlDQUFjO0lBSTdDLHVCQUNxQyxNQUErQixFQUN6QyxhQUE0QixFQUMxQixjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFFdEMsa0NBQWtDO1FBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFuQkw7UUFBQyx1QkFBVSxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQTVCLENBQTRCLENBQUM7bUJBTWxELG1CQUFNLENBQUMsK0NBQXVCLENB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Q0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBQ0Qsa0JBQWtCO1FBQ2xCLE1BQU0sQ0FBQyxFQUFFLFVBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzVELENBQUM7SUFDTCxvQkFBQztBQUFELENBQUMsQUFwREQsQ0FBNEIsK0JBQWMsR0FvRHpDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEhvdmVyLCBJSG92ZXJQcm92aWRlciwgSUhvdmVyU2VydmljZSwgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgSG92ZXJSZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sJztcclxuaW1wb3J0IHsgSG92ZXIgYXMgVEhvdmVyLCBNYXJrZWRTdHJpbmcsIFBvc2l0aW9uLCBUZXh0RG9jdW1lbnRJZGVudGlmaWVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzJztcclxuaW1wb3J0ICogYXMgdG9VcmkgZnJvbSAnZmlsZS11cmwnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuXHJcbkBjYXBhYmlsaXR5KChjYXBhYmlsaXRpZXMpID0+ICEhY2FwYWJpbGl0aWVzLmhvdmVyUHJvdmlkZXIpXHJcbmV4cG9ydCBjbGFzcyBIb3ZlclByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9ob3ZlclNlcnZpY2U6IElIb3ZlclNlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSUhvdmVyU2VydmljZSkgZmluZGVyU2VydmljZTogSUhvdmVyU2VydmljZSxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvblxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5faG92ZXJTZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdHJpZ2dlciBjaGFyYWN0ZXJzXHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBIb3ZlclByb3ZpZGVyKGNsaWVudCwgc3luY0V4cHJlc3Npb24pO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2hvdmVyU2VydmljZS5yZWdpc3RlclByb3ZpZGVyKHNlcnZpY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIb3ZlclByb3ZpZGVyIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJSG92ZXJQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IEhvdmVyLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8SG92ZXIuSVJlc3BvbnNlPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zZW5kUmVxdWVzdChIb3ZlclJlcXVlc3QudHlwZSwge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKG9wdGlvbnMuZWRpdG9yLmdldFVSSSgpKSksXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBQb3NpdGlvbi5jcmVhdGUob3B0aW9ucy5sb2NhdGlvbi5yb3csIG9wdGlvbnMubG9jYXRpb24uY29sdW1uKVxyXG4gICAgICAgIH0pLm1hcChyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFrZVN5bWJvbChyZXN1bHQpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiAhIXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFN0cmluZyhtYXJrZWRTdHJpbmc6IE1hcmtlZFN0cmluZykge1xyXG4gICAgICAgIGlmIChfLmlzU3RyaW5nKG1hcmtlZFN0cmluZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcmtlZFN0cmluZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobWFya2VkU3RyaW5nLmxhbmd1YWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcmtlZFN0cmluZy52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYFske21hcmtlZFN0cmluZy5sYW5ndWFnZX1dOiAke21hcmtlZFN0cmluZy52YWx1ZX1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYWtlU3ltYm9sKHM6IFRIb3Zlcik6IEhvdmVyLklSZXNwb25zZSB7XHJcbiAgICAgICAgaWYgKCFzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbjogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBpZiAoXy5pc0FycmF5KHMuY29udGVudHMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IF8ubWFwKHMuY29udGVudHMsIGNvbnRlbnQgPT4gdGhpcy5fZ2V0U3RyaW5nKGNvbnRlbnQpKTtcclxuICAgICAgICAgICAgdGV4dCA9IHZhbHVlc1swXTtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBfLmRyb3AodmFsdWVzLCAxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy5fZ2V0U3RyaW5nKHMuY29udGVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUT0RPOiBJY29uIGh0bWxcclxuICAgICAgICByZXR1cm4geyB0ZXh0LCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24uam9pbignPGJyLz4nKSB9O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==