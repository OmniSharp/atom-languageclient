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
var DefinitionProtocol = (function (_super) {
    __extends(DefinitionProtocol, _super);
    function DefinitionProtocol(client, definitionService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
        this._definitionService = definitionService;
        if (!client.capabilities.definitionProvider) {
            return;
        }
        var service = new LanguageProtocolDefinitionProvider(this._client, this._syncExpression);
        this._disposable.add(service);
        this._definitionService.registerProvider(service);
    }
    DefinitionProtocol = __decorate([
        decorators_1.capability,
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IDefinitionService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], DefinitionProtocol);
    return DefinitionProtocol;
}(ts_disposables_1.DisposableBase));
exports.DefinitionProtocol = DefinitionProtocol;
var LanguageProtocolDefinitionProvider = (function (_super) {
    __extends(LanguageProtocolDefinitionProvider, _super);
    function LanguageProtocolDefinitionProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    LanguageProtocolDefinitionProvider.prototype.request = function (options) {
        if (!this._syncExpression.evaluate(options.editor)) {
            /* tslint:disable-next-line:no-any */
            return rxjs_1.Observable.empty();
        }
        var params = {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            position: types_1.Position.create(options.location.row, options.location.column)
        };
        return rxjs_1.Observable.fromPromise(this._client.sendRequest(protocol_1.DefinitionRequest.type, params))
            .map(function (response) {
            if (_.isArray(response)) {
                return _.map(response, function (location) {
                    return {
                        filePath: convert_1.fromUri(location.uri),
                        range: convert_1.fromRange(location.range)
                    };
                });
            }
            else {
                return [{
                        filePath: convert_1.fromUri(response.uri),
                        range: convert_1.fromRange(response.range)
                    }];
            }
        });
    };
    return LanguageProtocolDefinitionProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVmaW5pdGlvblByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9EZWZpbml0aW9uUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBOEcsdUJBQXVCLENBQUMsQ0FBQTtBQUN0SSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBa0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUNuRSxzQkFBNkUsNkJBQTZCLENBQUMsQ0FBQTtBQUMzRyxJQUFZLEtBQUssV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNsQywrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBbUMsaUJBQWlCLENBQUMsQ0FBQTtBQUdyRDtJQUF3QyxzQ0FBYztJQUlsRCw0QkFDcUMsTUFBK0IsRUFDcEMsaUJBQXFDLEVBQ3hDLGNBQStCO1FBRXhELGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7UUFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBTSxPQUFPLEdBQUcsSUFBSSxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQXJCTDtRQUFDLHVCQUFVO21CQU1GLG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsMENBQWtCLENBQUM7bUJBQzFCLG1CQUFNLENBQUMsdUNBQWUsQ0FBQzs7MEJBUnJCO0lBc0JYLHlCQUFDO0FBQUQsQ0FBQyxBQXJCRCxDQUF3QywrQkFBYyxHQXFCckQ7QUFyQlksMEJBQWtCLHFCQXFCOUIsQ0FBQTtBQUVEO0lBQWlELHNEQUFjO0lBRzNELDRDQUNJLE1BQStCLEVBQy9CLGNBQStCO1FBQy9CLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sb0RBQU8sR0FBZCxVQUFlLE9BQTRCO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUFPLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQU0sTUFBTSxHQUErQjtZQUN2QyxZQUFZLEVBQUUsOEJBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUUsUUFBUSxFQUFFLGdCQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1NBQzNFLENBQUM7UUFDRixNQUFNLENBQUMsaUJBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsNEJBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2xGLEdBQUcsQ0FBQyxVQUFBLFFBQVE7WUFDVCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQUEsUUFBUTtvQkFDM0IsTUFBTSxDQUFDO3dCQUNILFFBQVEsRUFBRSxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7d0JBQy9CLEtBQUssRUFBRSxtQkFBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7cUJBQ25DLENBQUM7Z0JBQ04sQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLENBQUM7d0JBQ0osUUFBUSxFQUFFLGlCQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQzt3QkFDL0IsS0FBSyxFQUFFLG1CQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztxQkFDbkMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNMLHlDQUFDO0FBQUQsQ0FBQyxBQXRDRCxDQUFpRCwrQkFBYyxHQXNDOUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgRGVmaW5pdGlvbiwgSURlZmluaXRpb25Qcm92aWRlciwgSURlZmluaXRpb25TZXJ2aWNlLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVN5bmNFeHByZXNzaW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBEZWZpbml0aW9uUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IFBvc2l0aW9uLCBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLCBUZXh0RG9jdW1lbnRQb3NpdGlvblBhcmFtcyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGZyb21SYW5nZSwgZnJvbVVyaSB9IGZyb20gJy4vdXRpbHMvY29udmVydCc7XHJcblxyXG5AY2FwYWJpbGl0eVxyXG5leHBvcnQgY2xhc3MgRGVmaW5pdGlvblByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9kZWZpbml0aW9uU2VydmljZTogSURlZmluaXRpb25TZXJ2aWNlO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElEZWZpbml0aW9uU2VydmljZSkgZGVmaW5pdGlvblNlcnZpY2U6IElEZWZpbml0aW9uU2VydmljZSxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvblxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgICAgICB0aGlzLl9kZWZpbml0aW9uU2VydmljZSA9IGRlZmluaXRpb25TZXJ2aWNlO1xyXG4gICAgICAgIGlmICghY2xpZW50LmNhcGFiaWxpdGllcy5kZWZpbml0aW9uUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBMYW5ndWFnZVByb3RvY29sRGVmaW5pdGlvblByb3ZpZGVyKHRoaXMuX2NsaWVudCwgdGhpcy5fc3luY0V4cHJlc3Npb24pO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2RlZmluaXRpb25TZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIExhbmd1YWdlUHJvdG9jb2xEZWZpbml0aW9uUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElEZWZpbml0aW9uUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IERlZmluaXRpb24uSVJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKG9wdGlvbnMuZWRpdG9yKSkge1xyXG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55ICovXHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmVtcHR5PGFueT4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtczogVGV4dERvY3VtZW50UG9zaXRpb25QYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIHRleHREb2N1bWVudDogVGV4dERvY3VtZW50SWRlbnRpZmllci5jcmVhdGUodG9Vcmkob3B0aW9ucy5lZGl0b3IhLmdldFVSSSgpKSksXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBQb3NpdGlvbi5jcmVhdGUob3B0aW9ucy5sb2NhdGlvbi5yb3csIG9wdGlvbnMubG9jYXRpb24uY29sdW1uKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UodGhpcy5fY2xpZW50LnNlbmRSZXF1ZXN0KERlZmluaXRpb25SZXF1ZXN0LnR5cGUsIHBhcmFtcykpXHJcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShyZXNwb25zZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5tYXAocmVzcG9uc2UsIGxvY2F0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBmcm9tVXJpKGxvY2F0aW9uLnVyaSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogZnJvbVJhbmdlKGxvY2F0aW9uLnJhbmdlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IGZyb21VcmkocmVzcG9uc2UudXJpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IGZyb21SYW5nZShyZXNwb25zZS5yYW5nZSlcclxuICAgICAgICAgICAgICAgICAgICB9XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19