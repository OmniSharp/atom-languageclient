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
        var service = new LanguageProtocolDefinitionProvider(this._client, this._syncExpression);
        this._disposable.add(service, this._definitionService.registerProvider(service));
    }
    DefinitionProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.definitionProvider; }),
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
        return this._client.sendRequest(protocol_1.DefinitionRequest.type, params)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVmaW5pdGlvblByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9EZWZpbml0aW9uUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBOEcsdUJBQXVCLENBQUMsQ0FBQTtBQUN0SSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBa0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUNuRSxzQkFBNkUsNkJBQTZCLENBQUMsQ0FBQTtBQUMzRyxJQUFZLEtBQUssV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNsQywrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBbUMsaUJBQWlCLENBQUMsQ0FBQTtBQUdyRDtJQUF3QyxzQ0FBYztJQUlsRCw0QkFDcUMsTUFBK0IsRUFDcEMsaUJBQXFDLEVBQ3hDLGNBQStCO1FBRXhELGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7UUFFNUMsSUFBTSxPQUFPLEdBQUcsSUFBSSxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDaEIsT0FBTyxFQUNQLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FDcEQsQ0FBQztJQUNOLENBQUM7SUFwQkw7UUFBQyx1QkFBVSxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBakMsQ0FBaUMsQ0FBQzttQkFNdkQsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQywwQ0FBa0IsQ0FBQzttQkFDMUIsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOzswQkFSZ0M7SUFxQmhFLHlCQUFDO0FBQUQsQ0FBQyxBQXBCRCxDQUF3QywrQkFBYyxHQW9CckQ7QUFwQlksMEJBQWtCLHFCQW9COUIsQ0FBQTtBQUVEO0lBQWlELHNEQUFjO0lBRzNELDRDQUNJLE1BQStCLEVBQy9CLGNBQStCO1FBQy9CLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sb0RBQU8sR0FBZCxVQUFlLE9BQTRCO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUFPLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQU0sTUFBTSxHQUErQjtZQUN2QyxZQUFZLEVBQUUsOEJBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUUsUUFBUSxFQUFFLGdCQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1NBQzNFLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsNEJBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUMxRCxHQUFHLENBQUMsVUFBQSxRQUFRO1lBQ1QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFBLFFBQVE7b0JBQzNCLE1BQU0sQ0FBQzt3QkFDSCxRQUFRLEVBQUUsaUJBQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO3dCQUMvQixLQUFLLEVBQUUsbUJBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO3FCQUNuQyxDQUFDO2dCQUNOLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDO3dCQUNKLFFBQVEsRUFBRSxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7d0JBQy9CLEtBQUssRUFBRSxtQkFBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7cUJBQ25DLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDTCx5Q0FBQztBQUFELENBQUMsQUF0Q0QsQ0FBaUQsK0JBQWMsR0FzQzlEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IERlZmluaXRpb24sIElEZWZpbml0aW9uUHJvdmlkZXIsIElEZWZpbml0aW9uU2VydmljZSwgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgRGVmaW5pdGlvblJlcXVlc3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvcHJvdG9jb2wnO1xyXG5pbXBvcnQgeyBQb3NpdGlvbiwgVGV4dERvY3VtZW50SWRlbnRpZmllciwgVGV4dERvY3VtZW50UG9zaXRpb25QYXJhbXMgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgKiBhcyB0b1VyaSBmcm9tICdmaWxlLXVybCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBmcm9tUmFuZ2UsIGZyb21VcmkgfSBmcm9tICcuL3V0aWxzL2NvbnZlcnQnO1xyXG5cclxuQGNhcGFiaWxpdHkoKGNhcGFiaWxpdGllcykgPT4gISFjYXBhYmlsaXRpZXMuZGVmaW5pdGlvblByb3ZpZGVyKVxyXG5leHBvcnQgY2xhc3MgRGVmaW5pdGlvblByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9kZWZpbml0aW9uU2VydmljZTogSURlZmluaXRpb25TZXJ2aWNlO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElEZWZpbml0aW9uU2VydmljZSkgZGVmaW5pdGlvblNlcnZpY2U6IElEZWZpbml0aW9uU2VydmljZSxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvblxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgICAgICB0aGlzLl9kZWZpbml0aW9uU2VydmljZSA9IGRlZmluaXRpb25TZXJ2aWNlO1xyXG5cclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IExhbmd1YWdlUHJvdG9jb2xEZWZpbml0aW9uUHJvdmlkZXIodGhpcy5fY2xpZW50LCB0aGlzLl9zeW5jRXhwcmVzc2lvbik7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIHNlcnZpY2UsXHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmluaXRpb25TZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMYW5ndWFnZVByb3RvY29sRGVmaW5pdGlvblByb3ZpZGVyIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJRGVmaW5pdGlvblByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdChvcHRpb25zOiBEZWZpbml0aW9uLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxhbnk+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IFRleHREb2N1bWVudFBvc2l0aW9uUGFyYW1zID0ge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKG9wdGlvbnMuZWRpdG9yIS5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogUG9zaXRpb24uY3JlYXRlKG9wdGlvbnMubG9jYXRpb24ucm93LCBvcHRpb25zLmxvY2F0aW9uLmNvbHVtbilcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoRGVmaW5pdGlvblJlcXVlc3QudHlwZSwgcGFyYW1zKVxyXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkocmVzcG9uc2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3BvbnNlLCBsb2NhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogZnJvbVVyaShsb2NhdGlvbi51cmkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IGZyb21SYW5nZShsb2NhdGlvbi5yYW5nZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBmcm9tVXJpKHJlc3BvbnNlLnVyaSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiBmcm9tUmFuZ2UocmVzcG9uc2UucmFuZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgfV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==