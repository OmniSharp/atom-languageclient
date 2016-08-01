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
        if (!client.capabilities.hoverProvider) {
            return;
        }
        // TODO: Handle trigger characters
        var service = new HoverProvider(client, syncExpression);
        this._disposable.add(service);
        this._hoverService.registerProvider(service);
    }
    HoverProtocol = __decorate([
        decorators_1.capability,
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
        return rxjs_1.Observable.fromPromise(this._client.sendRequest(protocol_1.HoverRequest.type, {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            position: types_1.Position.create(options.location.row, options.location.column)
        })).map(function (result) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG92ZXJQcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYXBhYmlsaXRpZXMvSG92ZXJQcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUErRix1QkFBdUIsQ0FBQyxDQUFBO0FBQ3ZILDJCQUFtQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3RFLHlCQUE2QixnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzlELHNCQUFnRiw2QkFBNkIsQ0FBQyxDQUFBO0FBQzlHLElBQVksS0FBSyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBR2hEO0lBQW1DLGlDQUFjO0lBSTdDLHVCQUNxQyxNQUErQixFQUN6QyxhQUE0QixFQUMxQixjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELGtDQUFrQztRQUNsQyxJQUFNLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBdEJMO1FBQUMsdUJBQVU7bUJBTUYsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQyxxQ0FBYSxDQUFDO21CQUNyQixtQkFBTSxDQUFDLHVDQUFlLENBQUM7O3FCQVJyQjtJQXVCWCxvQkFBQztBQUFELENBQUMsQUF0QkQsQ0FBbUMsK0JBQWMsR0FzQmhEO0FBdEJZLHFCQUFhLGdCQXNCekIsQ0FBQTtBQUVEO0lBQTRCLGlDQUFjO0lBR3RDLHVCQUNJLE1BQStCLEVBQy9CLGNBQStCO1FBQy9CLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sK0JBQU8sR0FBZCxVQUFlLE9BQXVCO1FBQXRDLGlCQWNDO1FBYkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxpQkFBVSxDQUFDLEtBQUssRUFBbUIsQ0FBQztRQUMvQyxDQUFDO1FBRUQsTUFBTSxDQUFDLGlCQUFVLENBQUMsV0FBVyxDQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyx1QkFBWSxDQUFDLElBQUksRUFBRTtZQUN4QyxZQUFZLEVBQUUsOEJBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDM0UsUUFBUSxFQUFFLGdCQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1NBQzNFLENBQUMsQ0FDTCxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU07WUFDUixNQUFNLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUM7YUFDRCxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFTyxrQ0FBVSxHQUFsQixVQUFtQixZQUEwQjtRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDOUIsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFJLFlBQVksQ0FBQyxRQUFRLFdBQU0sWUFBWSxDQUFDLEtBQU8sQ0FBQztRQUMvRCxDQUFDO0lBQ0wsQ0FBQztJQUVPLG1DQUFXLEdBQW5CLFVBQW9CLENBQVM7UUFBN0IsaUJBZUM7UUFkRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTCxNQUFNLENBQUMsU0FBVSxDQUFDO1FBQ3RCLENBQUM7UUFDRCxJQUFJLElBQVksQ0FBQztRQUNqQixJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztZQUN0RSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUNELGtCQUFrQjtRQUNsQixNQUFNLENBQUMsRUFBRSxVQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQUFDLEFBdERELENBQTRCLCtCQUFjLEdBc0R6QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBIb3ZlciwgSUhvdmVyUHJvdmlkZXIsIElIb3ZlclNlcnZpY2UsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJU3luY0V4cHJlc3Npb24gfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjYXBhYmlsaXR5LCBpbmplY3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEhvdmVyUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IEhvdmVyIGFzIFRIb3ZlciwgTWFya2VkU3RyaW5nLCBQb3NpdGlvbiwgVGV4dERvY3VtZW50SWRlbnRpZmllciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcblxyXG5AY2FwYWJpbGl0eVxyXG5leHBvcnQgY2xhc3MgSG92ZXJQcm90b2NvbCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHJpdmF0ZSBfaG92ZXJTZXJ2aWNlOiBJSG92ZXJTZXJ2aWNlO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElIb3ZlclNlcnZpY2UpIGZpbmRlclNlcnZpY2U6IElIb3ZlclNlcnZpY2UsXHJcbiAgICAgICAgQGluamVjdChJU3luY0V4cHJlc3Npb24pIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb25cclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX2hvdmVyU2VydmljZSA9IGZpbmRlclNlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgICAgICBpZiAoIWNsaWVudC5jYXBhYmlsaXRpZXMuaG92ZXJQcm92aWRlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdHJpZ2dlciBjaGFyYWN0ZXJzXHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBIb3ZlclByb3ZpZGVyKGNsaWVudCwgc3luY0V4cHJlc3Npb24pO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2hvdmVyU2VydmljZS5yZWdpc3RlclByb3ZpZGVyKHNlcnZpY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBIb3ZlclByb3ZpZGVyIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJSG92ZXJQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IEhvdmVyLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8SG92ZXIuSVJlc3BvbnNlPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UoXHJcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudC5zZW5kUmVxdWVzdChIb3ZlclJlcXVlc3QudHlwZSwge1xyXG4gICAgICAgICAgICAgICAgdGV4dERvY3VtZW50OiBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLmNyZWF0ZSh0b1VyaShvcHRpb25zLmVkaXRvci5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFBvc2l0aW9uLmNyZWF0ZShvcHRpb25zLmxvY2F0aW9uLnJvdywgb3B0aW9ucy5sb2NhdGlvbi5jb2x1bW4pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKS5tYXAocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21ha2VTeW1ib2wocmVzdWx0KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5maWx0ZXIoeCA9PiAhIXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFN0cmluZyhtYXJrZWRTdHJpbmc6IE1hcmtlZFN0cmluZykge1xyXG4gICAgICAgIGlmIChfLmlzU3RyaW5nKG1hcmtlZFN0cmluZykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1hcmtlZFN0cmluZztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobWFya2VkU3RyaW5nLmxhbmd1YWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcmtlZFN0cmluZy52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYFske21hcmtlZFN0cmluZy5sYW5ndWFnZX1dOiAke21hcmtlZFN0cmluZy52YWx1ZX1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tYWtlU3ltYm9sKHM6IFRIb3Zlcik6IEhvdmVyLklSZXNwb25zZSB7XHJcbiAgICAgICAgaWYgKCFzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGxldCBkZXNjcmlwdGlvbjogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBpZiAoXy5pc0FycmF5KHMuY29udGVudHMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IF8ubWFwKHMuY29udGVudHMsIGNvbnRlbnQgPT4gdGhpcy5fZ2V0U3RyaW5nKGNvbnRlbnQpKTtcclxuICAgICAgICAgICAgdGV4dCA9IHZhbHVlc1swXTtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBfLmRyb3AodmFsdWVzLCAxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy5fZ2V0U3RyaW5nKHMuY29udGVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUT0RPOiBJY29uIGh0bWxcclxuICAgICAgICByZXR1cm4geyB0ZXh0LCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24uam9pbignPGJyLz4nKSB9O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==