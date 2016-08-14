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
        var service = new LanguageProtocolReferencesProvider(this._client, this._syncExpression);
        this._disposable.add(service);
        this._referencesService.registerProvider(service);
    }
    ReferencesProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.referencesProvider; }),
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
    LanguageProtocolReferencesProvider.prototype.request = function (request) {
        if (!this._syncExpression.evaluate(request.editor)) {
            /* tslint:disable-next-line:no-any */
            return rxjs_1.Observable.empty();
        }
        var params = {
            context: {
                includeDeclaration: true
            },
            textDocument: types_1.TextDocumentIdentifier.create(toUri(request.filePath)),
            position: types_1.Position.create(request.position.row, request.position.column)
        };
        return this._client.sendRequest(protocol_1.ReferencesRequest.type, params)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVmZXJlbmNlc1Byb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9SZWZlcmVuY2VzUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBNkcsdUJBQXVCLENBQUMsQ0FBQTtBQUNySSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBa0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUNuRSxzQkFBa0UsNkJBQTZCLENBQUMsQ0FBQTtBQUNoRyxJQUFZLEtBQUssV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNsQywrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBbUMsaUJBQWlCLENBQUMsQ0FBQTtBQUdyRDtJQUF3QyxzQ0FBYztJQUlsRCw0QkFDcUMsTUFBK0IsRUFDcEMsaUJBQXFDLEVBQ3hDLGNBQStCO1FBRXhELGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLENBQUM7UUFFNUMsSUFBTSxPQUFPLEdBQUcsSUFBSSxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQWxCTDtRQUFDLHVCQUFVLENBQUMsVUFBQyxZQUFZLElBQUssT0FBQSxDQUFDLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFqQyxDQUFpQyxDQUFDO21CQU12RCxtQkFBTSxDQUFDLCtDQUF1QixDQUFDO21CQUMvQixtQkFBTSxDQUFDLDBDQUFrQixDQUFDO21CQUMxQixtQkFBTSxDQUFDLHVDQUFlLENBQUM7OzBCQVJnQztJQW1CaEUseUJBQUM7QUFBRCxDQUFDLEFBbEJELENBQXdDLCtCQUFjLEdBa0JyRDtBQWxCWSwwQkFBa0IscUJBa0I5QixDQUFBO0FBRUQ7SUFBaUQsc0RBQWM7SUFHM0QsNENBQ0ksTUFBK0IsRUFDL0IsY0FBK0I7UUFDL0IsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0lBQ3RDLENBQUM7SUFFRSxvREFBTyxHQUFkLFVBQWUsT0FBMkI7UUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELHFDQUFxQztZQUNyQyxNQUFNLENBQUMsaUJBQVUsQ0FBQyxLQUFLLEVBQU8sQ0FBQztRQUNuQyxDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQW9CO1lBQzVCLE9BQU8sRUFBRTtnQkFDTCxrQkFBa0IsRUFBRSxJQUFJO2FBQzNCO1lBQ0QsWUFBWSxFQUFFLDhCQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BFLFFBQVEsRUFBRSxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztTQUMzRSxDQUFDO1FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLDRCQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFDMUQsR0FBRyxDQUFDLFVBQUEsUUFBUTtZQUNULE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFBLFFBQVE7Z0JBQzNCLE1BQU0sQ0FBQztvQkFDSCxRQUFRLEVBQUUsaUJBQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO29CQUMvQixLQUFLLEVBQUUsbUJBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2lCQUNuQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDTCx5Q0FBQztBQUFELENBQUMsQUFuQ0QsQ0FBaUQsK0JBQWMsR0FtQzlEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJUmVmZXJlbmNlc1Byb3ZpZGVyLCBJUmVmZXJlbmNlc1NlcnZpY2UsIElTeW5jRXhwcmVzc2lvbiwgUmVmZXJlbmNlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBSZWZlcmVuY2VzUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IFBvc2l0aW9uLCBSZWZlcmVuY2VQYXJhbXMsIFRleHREb2N1bWVudElkZW50aWZpZXIgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgKiBhcyB0b1VyaSBmcm9tICdmaWxlLXVybCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBmcm9tUmFuZ2UsIGZyb21VcmkgfSBmcm9tICcuL3V0aWxzL2NvbnZlcnQnO1xyXG5cclxuQGNhcGFiaWxpdHkoKGNhcGFiaWxpdGllcykgPT4gISFjYXBhYmlsaXRpZXMucmVmZXJlbmNlc1Byb3ZpZGVyKVxyXG5leHBvcnQgY2xhc3MgUmVmZXJlbmNlc1Byb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9yZWZlcmVuY2VzU2VydmljZTogSVJlZmVyZW5jZXNTZXJ2aWNlO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElSZWZlcmVuY2VzU2VydmljZSkgcmVmZXJlbmNlc1NlcnZpY2U6IElSZWZlcmVuY2VzU2VydmljZSxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvblxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgICAgICB0aGlzLl9yZWZlcmVuY2VzU2VydmljZSA9IHJlZmVyZW5jZXNTZXJ2aWNlO1xyXG5cclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IExhbmd1YWdlUHJvdG9jb2xSZWZlcmVuY2VzUHJvdmlkZXIodGhpcy5fY2xpZW50LCB0aGlzLl9zeW5jRXhwcmVzc2lvbik7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoc2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5fcmVmZXJlbmNlc1NlcnZpY2UucmVnaXN0ZXJQcm92aWRlcihzZXJ2aWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgTGFuZ3VhZ2VQcm90b2NvbFJlZmVyZW5jZXNQcm92aWRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSVJlZmVyZW5jZXNQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KHJlcXVlc3Q6IFJlZmVyZW5jZS5JUmVxdWVzdCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3luY0V4cHJlc3Npb24uZXZhbHVhdGUocmVxdWVzdC5lZGl0b3IpKSB7XHJcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8YW55PigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcGFyYW1zOiBSZWZlcmVuY2VQYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIGNvbnRleHQ6IHtcclxuICAgICAgICAgICAgICAgIGluY2x1ZGVEZWNsYXJhdGlvbjogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKHJlcXVlc3QuZmlsZVBhdGgpKSxcclxuICAgICAgICAgICAgcG9zaXRpb246IFBvc2l0aW9uLmNyZWF0ZShyZXF1ZXN0LnBvc2l0aW9uLnJvdywgcmVxdWVzdC5wb3NpdGlvbi5jb2x1bW4pXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zZW5kUmVxdWVzdChSZWZlcmVuY2VzUmVxdWVzdC50eXBlLCBwYXJhbXMpXHJcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3BvbnNlLCBsb2NhdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IGZyb21VcmkobG9jYXRpb24udXJpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IGZyb21SYW5nZShsb2NhdGlvbi5yYW5nZSlcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==