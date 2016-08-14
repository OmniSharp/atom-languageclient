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
        var service = new RunCodeActionProvider(client, syncExpression, documentSyncProtocol);
        this._disposable.add(service);
        this._runCodeActionService.registerProvider(service);
    }
    RunCodeActionProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.extended.runCodeActionProvider; }),
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
        return this._client.sendRequest(protocol_extended_1.RunCodeActionRequest.type, params)
            .map(convert_1.fromWorkspaceEdit);
    };
    return RunCodeActionProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVuQ29kZUFjdGlvblByb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9SdW5Db2RlQWN0aW9uUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBNkgsdUJBQXVCLENBQUMsQ0FBQTtBQUNySiwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSxrQ0FBcUMseUNBQXlDLENBQUMsQ0FBQTtBQUMvRSwrQkFBNEQsc0NBQXNDLENBQUMsQ0FBQTtBQUNuRyxJQUFZLEtBQUssV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNsQywrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCx3QkFBMkMsaUJBQWlCLENBQUMsQ0FBQTtBQUM3RCxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUc5RDtJQUEyQyx5Q0FBYztJQU1yRCwrQkFDcUMsTUFBK0IsRUFDakMsYUFBb0MsRUFDMUMsY0FBK0IsRUFDeEQsb0JBQTBDO1FBRTFDLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMscUJBQXFCLEdBQUcsYUFBYSxDQUFDO1FBQzNDLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztRQUVsRCxJQUFNLE9BQU8sR0FBRyxJQUFJLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQXRCTDtRQUFDLHVCQUFVLENBQUMsVUFBQyxZQUFZLElBQUssT0FBQSxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBN0MsQ0FBNkMsQ0FBQzttQkFRbkUsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQyw2Q0FBcUIsQ0FBQzttQkFDN0IsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOzs2QkFWNEM7SUF1QjVFLDRCQUFDO0FBQUQsQ0FBQyxBQXRCRCxDQUEyQywrQkFBYyxHQXNCeEQ7QUF0QlksNkJBQXFCLHdCQXNCakMsQ0FBQTtBQUVEO0lBQW9DLHlDQUFjO0lBSTlDLCtCQUFtQixNQUErQixFQUFFLGNBQStCLEVBQUUsb0JBQTBDO1FBQzNILGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsb0JBQW9CLENBQUM7SUFDdEQsQ0FBQztJQUVNLHVDQUFPLEdBQWQsVUFBZSxPQUErQjtRQUMxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUEyQixDQUFDO1FBQ3ZELENBQUM7UUFFRCxJQUFNLE1BQU0sR0FBd0I7WUFDaEMsWUFBWSxFQUFFLHVDQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzNFLEtBQUssRUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDN0IsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO1lBQzlCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztTQUMzQixDQUFDO1FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLHdDQUFvQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFDN0QsR0FBRyxDQUFDLDJCQUFpQixDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNMLDRCQUFDO0FBQUQsQ0FBQyxBQTFCRCxDQUFvQywrQkFBYyxHQTBCakQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJUnVuQ29kZUFjdGlvblByb3ZpZGVyLCBJUnVuQ29kZUFjdGlvblNlcnZpY2UsIElTeW5jRXhwcmVzc2lvbiwgUnVuQ29kZUFjdGlvbiwgVGV4dCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgUnVuQ29kZUFjdGlvblJlcXVlc3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvcHJvdG9jb2wtZXh0ZW5kZWQnO1xyXG5pbXBvcnQgeyBSdW5Db2RlQWN0aW9uUGFyYW1zLCBUZXh0RG9jdW1lbnRJZGVudGlmaWVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzLWV4dGVuZGVkJztcclxuaW1wb3J0ICogYXMgdG9VcmkgZnJvbSAnZmlsZS11cmwnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgZnJvbVdvcmtzcGFjZUVkaXQsIHRvUmFuZ2UgfSBmcm9tICcuL3V0aWxzL2NvbnZlcnQnO1xyXG5pbXBvcnQgeyBEb2N1bWVudFN5bmNQcm90b2NvbCB9IGZyb20gJy4vRG9jdW1lbnRTeW5jUHJvdG9jb2wnO1xyXG5cclxuQGNhcGFiaWxpdHkoKGNhcGFiaWxpdGllcykgPT4gISFjYXBhYmlsaXRpZXMuZXh0ZW5kZWQucnVuQ29kZUFjdGlvblByb3ZpZGVyKVxyXG5leHBvcnQgY2xhc3MgUnVuQ29kZUFjdGlvblByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9ydW5Db2RlQWN0aW9uU2VydmljZTogSVJ1bkNvZGVBY3Rpb25TZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfZG9jdW1lbnRTeW5jUHJvdG9jb2w6IERvY3VtZW50U3luY1Byb3RvY29sO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBpbmplY3QoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgQGluamVjdChJUnVuQ29kZUFjdGlvblNlcnZpY2UpIGZpbmRlclNlcnZpY2U6IElSdW5Db2RlQWN0aW9uU2VydmljZSxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbixcclxuICAgICAgICBkb2N1bWVudFN5bmNQcm90b2NvbDogRG9jdW1lbnRTeW5jUHJvdG9jb2xcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3J1bkNvZGVBY3Rpb25TZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50U3luY1Byb3RvY29sID0gZG9jdW1lbnRTeW5jUHJvdG9jb2w7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgUnVuQ29kZUFjdGlvblByb3ZpZGVyKGNsaWVudCwgc3luY0V4cHJlc3Npb24sIGRvY3VtZW50U3luY1Byb3RvY29sKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLl9ydW5Db2RlQWN0aW9uU2VydmljZS5yZWdpc3RlclByb3ZpZGVyKHNlcnZpY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSdW5Db2RlQWN0aW9uUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElSdW5Db2RlQWN0aW9uUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9kb2N1bWVudFN5bmNQcm90b2NvbDogRG9jdW1lbnRTeW5jUHJvdG9jb2w7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbiwgZG9jdW1lbnRTeW5jUHJvdG9jb2w6IERvY3VtZW50U3luY1Byb3RvY29sKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgICAgICB0aGlzLl9kb2N1bWVudFN5bmNQcm90b2NvbCA9IGRvY3VtZW50U3luY1Byb3RvY29sO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IFJ1bkNvZGVBY3Rpb24uSVJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKG9wdGlvbnMuZWRpdG9yKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxUZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtczogUnVuQ29kZUFjdGlvblBhcmFtcyA9IHtcclxuICAgICAgICAgICAgdGV4dERvY3VtZW50OiBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLmNyZWF0ZSh0b1VyaShvcHRpb25zLmVkaXRvci5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICByYW5nZTogdG9SYW5nZShvcHRpb25zLnJhbmdlKSxcclxuICAgICAgICAgICAgaWRlbnRpZmllcjogb3B0aW9ucy5pZGVudGlmaWVyLFxyXG4gICAgICAgICAgICBjb250ZXh0OiBvcHRpb25zLmNvbnRleHRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50LnNlbmRSZXF1ZXN0KFJ1bkNvZGVBY3Rpb25SZXF1ZXN0LnR5cGUsIHBhcmFtcylcclxuICAgICAgICAgICAgLm1hcChmcm9tV29ya3NwYWNlRWRpdCk7XHJcbiAgICB9XHJcbn1cclxuIl19