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
var DocumentSyncProtocol_1 = require('./DocumentSyncProtocol');
var RunCodeActionProtocol = (function (_super) {
    __extends(RunCodeActionProtocol, _super);
    function RunCodeActionProtocol(client, finderService, syncExpression, documentSyncProtocol) {
        _super.call(this);
        this._client = client;
        this._runCodeActionService = finderService;
        this._syncExpression = syncExpression;
        this._documentSyncProtocol = documentSyncProtocol;
        if (!this._client.capabilities.extended.getCodeActionsProvider) {
            return;
        }
        var service = new RunCodeActionProvider(client, syncExpression, documentSyncProtocol);
        this._disposable.add(service);
        this._runCodeActionService.registerProvider(service);
    }
    RunCodeActionProtocol = __decorate([
        decorators_1.capability,
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IRunCodeActionService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object, DocumentSyncProtocol_1.DocumentSyncProtocol])
    ], RunCodeActionProtocol);
    return RunCodeActionProtocol;
}(ts_disposables_1.DisposableBase));
exports.RunCodeActionProtocol = RunCodeActionProtocol;
var RunCodeActionProvider = (function (_super) {
    __extends(RunCodeActionProvider, _super);
    function RunCodeActionProvider(client, syncExpression, documentSyncProtocol) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
        this._documentSyncProtocol = documentSyncProtocol;
    }
    RunCodeActionProvider.prototype.request = function (options) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        var params = {
            textDocument: types_extended_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            range: convert_1.toRange(options.range),
            identifier: options.identifier,
            context: options.context
        };
        return rxjs_1.Observable.fromPromise(this._client.sendRequest(protocol_extended_1.RunCodeActionRequest.type, params))
            .map(convert_1.fromWorkspaceEdit);
    };
    return RunCodeActionProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVuQ29kZUFjdGlvblByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9SdW5Db2RlQWN0aW9uUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBNkgsdUJBQXVCLENBQUMsQ0FBQTtBQUNySiwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSxrQ0FBcUMseUNBQXlDLENBQUMsQ0FBQTtBQUMvRSwrQkFBNEQsc0NBQXNDLENBQUMsQ0FBQTtBQUNuRyxJQUFZLEtBQUssV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNsQywrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBMkMsaUJBQWlCLENBQUMsQ0FBQTtBQUM3RCxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUc5RDtJQUEyQyx5Q0FBYztJQU1yRCwrQkFDcUMsTUFBK0IsRUFDakMsYUFBb0MsRUFDMUMsY0FBK0IsRUFDeEQsb0JBQTBDO1FBRTFDLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMscUJBQXFCLEdBQUcsYUFBYSxDQUFDO1FBQzNDLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUVsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQU0sT0FBTyxHQUFHLElBQUkscUJBQXFCLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBekJMO1FBQUMsdUJBQVU7bUJBUUYsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQyw2Q0FBcUIsQ0FBQzttQkFDN0IsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOzs2QkFWckI7SUEwQlgsNEJBQUM7QUFBRCxDQUFDLEFBekJELENBQTJDLCtCQUFjLEdBeUJ4RDtBQXpCWSw2QkFBcUIsd0JBeUJqQyxDQUFBO0FBRUQ7SUFBb0MseUNBQWM7SUFJOUMsK0JBQW1CLE1BQStCLEVBQUUsY0FBK0IsRUFBRSxvQkFBMEM7UUFDM0gsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztJQUN0RCxDQUFDO0lBRU0sdUNBQU8sR0FBZCxVQUFlLE9BQStCO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsaUJBQVUsQ0FBQyxLQUFLLEVBQTJCLENBQUM7UUFDdkQsQ0FBQztRQUVELElBQU0sTUFBTSxHQUF3QjtZQUNoQyxZQUFZLEVBQUUsdUNBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDM0UsS0FBSyxFQUFFLGlCQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUM3QixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7WUFDOUIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1NBQzNCLENBQUM7UUFFRixNQUFNLENBQUMsaUJBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsd0NBQW9CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3JGLEdBQUcsQ0FBQywyQkFBaUIsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDTCw0QkFBQztBQUFELENBQUMsQUExQkQsQ0FBb0MsK0JBQWMsR0EwQmpEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVJ1bkNvZGVBY3Rpb25Qcm92aWRlciwgSVJ1bkNvZGVBY3Rpb25TZXJ2aWNlLCBJU3luY0V4cHJlc3Npb24sIFJ1bkNvZGVBY3Rpb24sIFRleHQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjYXBhYmlsaXR5LCBpbmplY3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IFJ1bkNvZGVBY3Rpb25SZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sLWV4dGVuZGVkJztcclxuaW1wb3J0IHsgUnVuQ29kZUFjdGlvblBhcmFtcywgVGV4dERvY3VtZW50SWRlbnRpZmllciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcy1leHRlbmRlZCc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGZyb21Xb3Jrc3BhY2VFZGl0LCB0b1JhbmdlIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuaW1wb3J0IHsgRG9jdW1lbnRTeW5jUHJvdG9jb2wgfSBmcm9tICcuL0RvY3VtZW50U3luY1Byb3RvY29sJztcclxuXHJcbkBjYXBhYmlsaXR5XHJcbmV4cG9ydCBjbGFzcyBSdW5Db2RlQWN0aW9uUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX3J1bkNvZGVBY3Rpb25TZXJ2aWNlOiBJUnVuQ29kZUFjdGlvblNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9kb2N1bWVudFN5bmNQcm90b2NvbDogRG9jdW1lbnRTeW5jUHJvdG9jb2w7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElSdW5Db2RlQWN0aW9uU2VydmljZSkgZmluZGVyU2VydmljZTogSVJ1bkNvZGVBY3Rpb25TZXJ2aWNlLFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLFxyXG4gICAgICAgIGRvY3VtZW50U3luY1Byb3RvY29sOiBEb2N1bWVudFN5bmNQcm90b2NvbFxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fcnVuQ29kZUFjdGlvblNlcnZpY2UgPSBmaW5kZXJTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICAgICAgdGhpcy5fZG9jdW1lbnRTeW5jUHJvdG9jb2wgPSBkb2N1bWVudFN5bmNQcm90b2NvbDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9jbGllbnQuY2FwYWJpbGl0aWVzLmV4dGVuZGVkLmdldENvZGVBY3Rpb25zUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IFJ1bkNvZGVBY3Rpb25Qcm92aWRlcihjbGllbnQsIHN5bmNFeHByZXNzaW9uLCBkb2N1bWVudFN5bmNQcm90b2NvbCk7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoc2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5fcnVuQ29kZUFjdGlvblNlcnZpY2UucmVnaXN0ZXJQcm92aWRlcihzZXJ2aWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUnVuQ29kZUFjdGlvblByb3ZpZGVyIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJUnVuQ29kZUFjdGlvblByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHJpdmF0ZSBfZG9jdW1lbnRTeW5jUHJvdG9jb2w6IERvY3VtZW50U3luY1Byb3RvY29sO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24sIGRvY3VtZW50U3luY1Byb3RvY29sOiBEb2N1bWVudFN5bmNQcm90b2NvbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICAgICAgdGhpcy5fZG9jdW1lbnRTeW5jUHJvdG9jb2wgPSBkb2N1bWVudFN5bmNQcm90b2NvbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdChvcHRpb25zOiBSdW5Db2RlQWN0aW9uLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8VGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IFJ1bkNvZGVBY3Rpb25QYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIHRleHREb2N1bWVudDogVGV4dERvY3VtZW50SWRlbnRpZmllci5jcmVhdGUodG9Vcmkob3B0aW9ucy5lZGl0b3IuZ2V0VVJJKCkpKSxcclxuICAgICAgICAgICAgcmFuZ2U6IHRvUmFuZ2Uob3B0aW9ucy5yYW5nZSksXHJcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IG9wdGlvbnMuaWRlbnRpZmllcixcclxuICAgICAgICAgICAgY29udGV4dDogb3B0aW9ucy5jb250ZXh0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UodGhpcy5fY2xpZW50LnNlbmRSZXF1ZXN0KFJ1bkNvZGVBY3Rpb25SZXF1ZXN0LnR5cGUsIHBhcmFtcykpXHJcbiAgICAgICAgICAgIC5tYXAoZnJvbVdvcmtzcGFjZUVkaXQpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==