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
var protocol_1 = require('atom-languageservices/protocol');
var types_1 = require('atom-languageservices/types');
var toUri = require('file-url');
var ts_disposables_1 = require('ts-disposables');
var convert_1 = require('./utils/convert');
var DocumentSyncProtocol_1 = require('./DocumentSyncProtocol');
var RenameProtocol = (function (_super) {
    __extends(RenameProtocol, _super);
    function RenameProtocol(client, finderService, syncExpression, documentSyncProtocol) {
        _super.call(this);
        this._client = client;
        this._renameService = finderService;
        this._syncExpression = syncExpression;
        this._documentSyncProtocol = documentSyncProtocol;
        if (!this._client.capabilities.renameProvider) {
            return;
        }
        var service = new RenameProvider(client, syncExpression, documentSyncProtocol);
        this._disposable.add(service);
        this._renameService.registerProvider(service);
    }
    RenameProtocol = __decorate([
        decorators_1.capability,
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IRenameService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object, DocumentSyncProtocol_1.DocumentSyncProtocol])
    ], RenameProtocol);
    return RenameProtocol;
}(ts_disposables_1.DisposableBase));
exports.RenameProtocol = RenameProtocol;
var RenameProvider = (function (_super) {
    __extends(RenameProvider, _super);
    function RenameProvider(client, syncExpression, documentSyncProtocol) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
        this._documentSyncProtocol = documentSyncProtocol;
    }
    RenameProvider.prototype.request = function (options) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        var params = {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            position: convert_1.toPosition(options.location),
            newName: options.word
        };
        return rxjs_1.Observable.fromPromise(this._client.sendRequest(protocol_1.RenameRequest.type, params))
            .map(convert_1.fromWorkspaceEdit);
    };
    return RenameProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuYW1lUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL1JlbmFtZVByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQXdHLHVCQUF1QixDQUFDLENBQUE7QUFDaEksMkJBQW1DLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUseUJBQThCLGdDQUFnQyxDQUFDLENBQUE7QUFDL0Qsc0JBQXFELDZCQUE2QixDQUFDLENBQUE7QUFDbkYsSUFBWSxLQUFLLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFDbEMsK0JBQStCLGdCQUFnQixDQUFDLENBQUE7QUFDaEQsd0JBQThDLGlCQUFpQixDQUFDLENBQUE7QUFDaEUscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFHOUQ7SUFBb0Msa0NBQWM7SUFNOUMsd0JBQ3FDLE1BQStCLEVBQ3hDLGFBQTZCLEVBQzVCLGNBQStCLEVBQ3hELG9CQUEwQztRQUUxQyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO1FBRWxELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQXpCTDtRQUFDLHVCQUFVO21CQVFGLG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsc0NBQWMsQ0FBQzttQkFDdEIsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOztzQkFWckI7SUEwQlgscUJBQUM7QUFBRCxDQUFDLEFBekJELENBQW9DLCtCQUFjLEdBeUJqRDtBQXpCWSxzQkFBYyxpQkF5QjFCLENBQUE7QUFFRDtJQUE2QixrQ0FBYztJQUl2Qyx3QkFBbUIsTUFBK0IsRUFBRSxjQUErQixFQUFFLG9CQUEwQztRQUMzSCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO0lBQ3RELENBQUM7SUFFTSxnQ0FBTyxHQUFkLFVBQWUsT0FBd0I7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxpQkFBVSxDQUFDLEtBQUssRUFBMkIsQ0FBQztRQUN2RCxDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQWlCO1lBQ3pCLFlBQVksRUFBRSw4QkFBc0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMzRSxRQUFRLEVBQUUsb0JBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ3RDLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSTtTQUN4QixDQUFDO1FBRUYsTUFBTSxDQUFDLGlCQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLHdCQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQzlFLEdBQUcsQ0FBQywyQkFBaUIsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUF6QkQsQ0FBNkIsK0JBQWMsR0F5QjFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVJlbmFtZVByb3ZpZGVyLCBJUmVuYW1lU2VydmljZSwgSVN5bmNFeHByZXNzaW9uLCBSZW5hbWUsIFRleHQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjYXBhYmlsaXR5LCBpbmplY3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IFJlbmFtZVJlcXVlc3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvcHJvdG9jb2wnO1xyXG5pbXBvcnQgeyBSZW5hbWVQYXJhbXMsIFRleHREb2N1bWVudElkZW50aWZpZXIgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgKiBhcyB0b1VyaSBmcm9tICdmaWxlLXVybCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBmcm9tV29ya3NwYWNlRWRpdCwgdG9Qb3NpdGlvbiB9IGZyb20gJy4vdXRpbHMvY29udmVydCc7XHJcbmltcG9ydCB7IERvY3VtZW50U3luY1Byb3RvY29sIH0gZnJvbSAnLi9Eb2N1bWVudFN5bmNQcm90b2NvbCc7XHJcblxyXG5AY2FwYWJpbGl0eVxyXG5leHBvcnQgY2xhc3MgUmVuYW1lUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX3JlbmFtZVNlcnZpY2U6IElSZW5hbWVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfZG9jdW1lbnRTeW5jUHJvdG9jb2w6IERvY3VtZW50U3luY1Byb3RvY29sO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBpbmplY3QoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgQGluamVjdChJUmVuYW1lU2VydmljZSkgZmluZGVyU2VydmljZTogSVJlbmFtZVNlcnZpY2UsXHJcbiAgICAgICAgQGluamVjdChJU3luY0V4cHJlc3Npb24pIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24sXHJcbiAgICAgICAgZG9jdW1lbnRTeW5jUHJvdG9jb2w6IERvY3VtZW50U3luY1Byb3RvY29sXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9yZW5hbWVTZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50U3luY1Byb3RvY29sID0gZG9jdW1lbnRTeW5jUHJvdG9jb2w7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fY2xpZW50LmNhcGFiaWxpdGllcy5yZW5hbWVQcm92aWRlcikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgUmVuYW1lUHJvdmlkZXIoY2xpZW50LCBzeW5jRXhwcmVzc2lvbiwgZG9jdW1lbnRTeW5jUHJvdG9jb2wpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX3JlbmFtZVNlcnZpY2UucmVnaXN0ZXJQcm92aWRlcihzZXJ2aWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVuYW1lUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElSZW5hbWVQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX2RvY3VtZW50U3luY1Byb3RvY29sOiBEb2N1bWVudFN5bmNQcm90b2NvbDtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLCBkb2N1bWVudFN5bmNQcm90b2NvbDogRG9jdW1lbnRTeW5jUHJvdG9jb2wpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50U3luY1Byb3RvY29sID0gZG9jdW1lbnRTeW5jUHJvdG9jb2w7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3Qob3B0aW9uczogUmVuYW1lLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8VGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IFJlbmFtZVBhcmFtcyA9IHtcclxuICAgICAgICAgICAgdGV4dERvY3VtZW50OiBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLmNyZWF0ZSh0b1VyaShvcHRpb25zLmVkaXRvci5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdG9Qb3NpdGlvbihvcHRpb25zLmxvY2F0aW9uKSxcclxuICAgICAgICAgICAgbmV3TmFtZTogb3B0aW9ucy53b3JkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UodGhpcy5fY2xpZW50LnNlbmRSZXF1ZXN0KFJlbmFtZVJlcXVlc3QudHlwZSwgcGFyYW1zKSlcclxuICAgICAgICAgICAgLm1hcChmcm9tV29ya3NwYWNlRWRpdCk7XHJcbiAgICB9XHJcbn1cclxuIl19