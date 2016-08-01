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
var convert_1 = require('./utils/convert');
var ReferencesProtocol = (function (_super) {
    __extends(ReferencesProtocol, _super);
    function ReferencesProtocol(client, referencesService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
        this._referencesService = referencesService;
        if (!client.capabilities.referencesProvider) {
            return;
        }
        var service = new LanguageProtocolReferencesProvider(this._client, this._syncExpression);
        this._disposable.add(service);
        this._referencesService.registerProvider(service);
    }
    ReferencesProtocol = __decorate([
        decorators_1.capability,
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IReferencesService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], ReferencesProtocol);
    return ReferencesProtocol;
}(ts_disposables_1.DisposableBase));
exports.ReferencesProtocol = ReferencesProtocol;
var LanguageProtocolReferencesProvider = (function (_super) {
    __extends(LanguageProtocolReferencesProvider, _super);
    function LanguageProtocolReferencesProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    LanguageProtocolReferencesProvider.prototype.request = function (editor) {
        if (!this._syncExpression.evaluate(editor)) {
            /* tslint:disable-next-line:no-any */
            return rxjs_1.Observable.empty();
        }
        var marker = editor.getCursorBufferPosition();
        var params = {
            context: {
                includeDeclaration: true
            },
            textDocument: types_1.TextDocumentIdentifier.create(toUri(editor.getURI())),
            position: types_1.Position.create(marker.row, marker.column)
        };
        return rxjs_1.Observable.fromPromise(this._client.sendRequest(protocol_1.ReferencesRequest.type, params))
            .map(function (response) {
            return _.map(response, function (location) {
                return {
                    filePath: convert_1.fromUri(location.uri),
                    range: convert_1.fromRange(location.range)
                };
            });
        });
    };
    return LanguageProtocolReferencesProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVmZXJlbmNlc1Byb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9SZWZlcmVuY2VzUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBa0csdUJBQXVCLENBQUMsQ0FBQTtBQUMxSCwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBa0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUNuRSxzQkFBa0UsNkJBQTZCLENBQUMsQ0FBQTtBQUNoRyxJQUFZLEtBQUssV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNsQywrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBbUMsaUJBQWlCLENBQUMsQ0FBQTtBQUdyRDtJQUF3QyxzQ0FBYztJQUlsRCw0QkFDcUMsTUFBK0IsRUFDcEMsaUJBQXFDLEVBQ3hDLGNBQStCO1FBRXhELGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQXJCTDtRQUFDLHVCQUFVO21CQU1GLG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsMENBQWtCLENBQUM7bUJBQzFCLG1CQUFNLENBQUMsdUNBQWUsQ0FBQzs7MEJBUnJCO0lBc0JYLHlCQUFDO0FBQUQsQ0FBQyxBQXJCRCxDQUF3QywrQkFBYyxHQXFCckQ7QUFyQlksMEJBQWtCLHFCQXFCOUIsQ0FBQTtBQUVEO0lBQWlELHNEQUFjO0lBRzNELDRDQUNJLE1BQStCLEVBQy9CLGNBQStCO1FBQy9CLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUN0QyxDQUFDO0lBRUUsb0RBQU8sR0FBZCxVQUFlLE1BQXVCO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLHFDQUFxQztZQUNyQyxNQUFNLENBQUMsaUJBQVUsQ0FBQyxLQUFLLEVBQU8sQ0FBQztRQUNuQyxDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQUcsTUFBTyxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFFakQsSUFBTSxNQUFNLEdBQW9CO1lBQzVCLE9BQU8sRUFBRTtnQkFDTCxrQkFBa0IsRUFBRSxJQUFJO2FBQzNCO1lBQ0QsWUFBWSxFQUFFLDhCQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDcEUsUUFBUSxFQUFFLGdCQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUN2RCxDQUFDO1FBQ0YsTUFBTSxDQUFDLGlCQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDRCQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNsRixHQUFHLENBQUMsVUFBQSxRQUFRO1lBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQUEsUUFBUTtnQkFDM0IsTUFBTSxDQUFDO29CQUNILFFBQVEsRUFBRSxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7b0JBQy9CLEtBQUssRUFBRSxtQkFBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7aUJBQ25DLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNMLHlDQUFDO0FBQUQsQ0FBQyxBQXBDRCxDQUFpRCwrQkFBYyxHQW9DOUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElSZWZlcmVuY2VzUHJvdmlkZXIsIElSZWZlcmVuY2VzU2VydmljZSwgSVN5bmNFeHByZXNzaW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBSZWZlcmVuY2VzUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IFBvc2l0aW9uLCBSZWZlcmVuY2VQYXJhbXMsIFRleHREb2N1bWVudElkZW50aWZpZXIgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgKiBhcyB0b1VyaSBmcm9tICdmaWxlLXVybCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBmcm9tUmFuZ2UsIGZyb21VcmkgfSBmcm9tICcuL3V0aWxzL2NvbnZlcnQnO1xyXG5cclxuQGNhcGFiaWxpdHlcclxuZXhwb3J0IGNsYXNzIFJlZmVyZW5jZXNQcm90b2NvbCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHJpdmF0ZSBfcmVmZXJlbmNlc1NlcnZpY2U6IElSZWZlcmVuY2VzU2VydmljZTtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBpbmplY3QoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgQGluamVjdChJUmVmZXJlbmNlc1NlcnZpY2UpIHJlZmVyZW5jZXNTZXJ2aWNlOiBJUmVmZXJlbmNlc1NlcnZpY2UsXHJcbiAgICAgICAgQGluamVjdChJU3luY0V4cHJlc3Npb24pIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb25cclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICAgICAgdGhpcy5fcmVmZXJlbmNlc1NlcnZpY2UgPSByZWZlcmVuY2VzU2VydmljZTtcclxuICAgICAgICBpZiAoIWNsaWVudC5jYXBhYmlsaXRpZXMucmVmZXJlbmNlc1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgTGFuZ3VhZ2VQcm90b2NvbFJlZmVyZW5jZXNQcm92aWRlcih0aGlzLl9jbGllbnQsIHRoaXMuX3N5bmNFeHByZXNzaW9uKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLl9yZWZlcmVuY2VzU2VydmljZS5yZWdpc3RlclByb3ZpZGVyKHNlcnZpY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMYW5ndWFnZVByb3RvY29sUmVmZXJlbmNlc1Byb3ZpZGVyIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJUmVmZXJlbmNlc1Byb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3QoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKGVkaXRvcikpIHtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxhbnk+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYXJrZXIgPSBlZGl0b3IhLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtczogUmVmZXJlbmNlUGFyYW1zID0ge1xyXG4gICAgICAgICAgICBjb250ZXh0OiB7XHJcbiAgICAgICAgICAgICAgICBpbmNsdWRlRGVjbGFyYXRpb246IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGV4dERvY3VtZW50OiBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLmNyZWF0ZSh0b1VyaShlZGl0b3IhLmdldFVSSSgpKSksXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBQb3NpdGlvbi5jcmVhdGUobWFya2VyLnJvdywgbWFya2VyLmNvbHVtbilcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb21Qcm9taXNlKHRoaXMuX2NsaWVudC5zZW5kUmVxdWVzdChSZWZlcmVuY2VzUmVxdWVzdC50eXBlLCBwYXJhbXMpKVxyXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChyZXNwb25zZSwgbG9jYXRpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBmcm9tVXJpKGxvY2F0aW9uLnVyaSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiBmcm9tUmFuZ2UobG9jYXRpb24ucmFuZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=