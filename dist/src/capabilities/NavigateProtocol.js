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
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var protocol_extended_1 = require('atom-languageservices/protocol-extended');
var types_extended_1 = require('atom-languageservices/types-extended');
var toUri = require('file-url');
var ts_disposables_1 = require('ts-disposables');
var convert_1 = require('./utils/convert');
var NavigateProtocol = (function (_super) {
    __extends(NavigateProtocol, _super);
    function NavigateProtocol(client, navigateService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
        this._navigateService = navigateService;
        var service = new LanguageProtocolNavigateProvider(this._client, this._syncExpression);
        this._disposable.add(service, this._navigateService.registerProvider(service));
    }
    NavigateProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.extended.navigateProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.INavigateService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], NavigateProtocol);
    return NavigateProtocol;
}(ts_disposables_1.DisposableBase));
exports.NavigateProtocol = NavigateProtocol;
var LanguageProtocolNavigateProvider = (function (_super) {
    __extends(LanguageProtocolNavigateProvider, _super);
    function LanguageProtocolNavigateProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    LanguageProtocolNavigateProvider.prototype.request = function (options) {
        if (!this._syncExpression.evaluate(options.editor)) {
            /* tslint:disable-next-line:no-any */
            return rxjs_1.Observable.empty();
        }
        var params = {
            textDocument: types_extended_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            position: types_extended_1.Position.create(options.location.row, options.location.column),
            direction: options.direction
        };
        return this._client.sendRequest(protocol_extended_1.NavigateRequest.type, params)
            .map(function (response) {
            return convert_1.fromPosition(response);
        });
    };
    return LanguageProtocolNavigateProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmF2aWdhdGVQcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYXBhYmlsaXRpZXMvTmF2aWdhdGVQcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUF3Ryx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2hJLDJCQUFtQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3RFLGtDQUFnQyx5Q0FBeUMsQ0FBQyxDQUFBO0FBQzFFLCtCQUFrRSxzQ0FBc0MsQ0FBQyxDQUFBO0FBQ3pHLElBQVksS0FBSyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELHdCQUE2QixpQkFBaUIsQ0FBQyxDQUFBO0FBRy9DO0lBQXNDLG9DQUFjO0lBSWhELDBCQUNxQyxNQUErQixFQUN0QyxlQUFpQyxFQUNsQyxjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztRQUV4QyxJQUFNLE9BQU8sR0FBRyxJQUFJLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pGLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixPQUFPLEVBQ1AsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUNsRCxDQUFDO0lBQ04sQ0FBQztJQXBCTDtRQUFDLHVCQUFVLENBQUMsVUFBQyxZQUFZLElBQUssT0FBQSxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBeEMsQ0FBd0MsQ0FBQzttQkFNOUQsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQyx3Q0FBZ0IsQ0FBQzttQkFDeEIsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOzt3QkFSdUM7SUFxQnZFLHVCQUFDO0FBQUQsQ0FBQyxBQXBCRCxDQUFzQywrQkFBYyxHQW9CbkQ7QUFwQlksd0JBQWdCLG1CQW9CNUIsQ0FBQTtBQUVEO0lBQStDLG9EQUFjO0lBR3pELDBDQUNJLE1BQStCLEVBQy9CLGNBQStCO1FBQy9CLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sa0RBQU8sR0FBZCxVQUFlLE9BQTBCO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUFPLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFtQjtZQUMzQixZQUFZLEVBQUUsdUNBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUUsUUFBUSxFQUFFLHlCQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3hFLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztTQUMvQixDQUFDO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLG1DQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUN4RCxHQUFHLENBQUMsVUFBQSxRQUFRO1lBQ1QsTUFBTSxDQUFDLHNCQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0wsdUNBQUM7QUFBRCxDQUFDLEFBM0JELENBQStDLCtCQUFjLEdBMkI1RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElOYXZpZ2F0ZVByb3ZpZGVyLCBJTmF2aWdhdGVTZXJ2aWNlLCBJU3luY0V4cHJlc3Npb24sIE5hdmlnYXRlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBOYXZpZ2F0ZVJlcXVlc3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvcHJvdG9jb2wtZXh0ZW5kZWQnO1xyXG5pbXBvcnQgeyBOYXZpZ2F0ZVBhcmFtcywgUG9zaXRpb24sIFRleHREb2N1bWVudElkZW50aWZpZXIgIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzLWV4dGVuZGVkJztcclxuaW1wb3J0ICogYXMgdG9VcmkgZnJvbSAnZmlsZS11cmwnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgZnJvbVBvc2l0aW9uIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuXHJcbkBjYXBhYmlsaXR5KChjYXBhYmlsaXRpZXMpID0+ICEhY2FwYWJpbGl0aWVzLmV4dGVuZGVkLm5hdmlnYXRlUHJvdmlkZXIpXHJcbmV4cG9ydCBjbGFzcyBOYXZpZ2F0ZVByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9uYXZpZ2F0ZVNlcnZpY2U6IElOYXZpZ2F0ZVNlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSU5hdmlnYXRlU2VydmljZSkgbmF2aWdhdGVTZXJ2aWNlOiBJTmF2aWdhdGVTZXJ2aWNlLFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRlU2VydmljZSA9IG5hdmlnYXRlU2VydmljZTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBMYW5ndWFnZVByb3RvY29sTmF2aWdhdGVQcm92aWRlcih0aGlzLl9jbGllbnQsIHRoaXMuX3N5bmNFeHByZXNzaW9uKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgc2VydmljZSxcclxuICAgICAgICAgICAgdGhpcy5fbmF2aWdhdGVTZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMYW5ndWFnZVByb3RvY29sTmF2aWdhdGVQcm92aWRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSU5hdmlnYXRlUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IE5hdmlnYXRlLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxhbnk+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IE5hdmlnYXRlUGFyYW1zID0ge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKG9wdGlvbnMuZWRpdG9yIS5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogUG9zaXRpb24uY3JlYXRlKG9wdGlvbnMubG9jYXRpb24ucm93LCBvcHRpb25zLmxvY2F0aW9uLmNvbHVtbiksXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogb3B0aW9ucy5kaXJlY3Rpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoTmF2aWdhdGVSZXF1ZXN0LnR5cGUsIHBhcmFtcylcclxuICAgICAgICAgICAgLm1hcChyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbVBvc2l0aW9uKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19