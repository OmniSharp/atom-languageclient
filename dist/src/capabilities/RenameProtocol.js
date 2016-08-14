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
        var service = new RenameProvider(client, syncExpression, documentSyncProtocol);
        this._disposable.add(service);
        this._renameService.registerProvider(service);
    }
    RenameProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.renameProvider; }),
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
        return this._client.sendRequest(protocol_1.RenameRequest.type, params)
            .map(convert_1.fromWorkspaceEdit);
    };
    return RenameProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuYW1lUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL1JlbmFtZVByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQXdHLHVCQUF1QixDQUFDLENBQUE7QUFDaEksMkJBQW1DLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUseUJBQThCLGdDQUFnQyxDQUFDLENBQUE7QUFDL0Qsc0JBQXFELDZCQUE2QixDQUFDLENBQUE7QUFDbkYsSUFBWSxLQUFLLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFDbEMsK0JBQStCLGdCQUFnQixDQUFDLENBQUE7QUFDaEQsd0JBQThDLGlCQUFpQixDQUFDLENBQUE7QUFDaEUscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFHOUQ7SUFBb0Msa0NBQWM7SUFNOUMsd0JBQ3FDLE1BQStCLEVBQ3hDLGFBQTZCLEVBQzVCLGNBQStCLEVBQ3hELG9CQUEwQztRQUUxQyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO1FBRWxELElBQU0sT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUF0Qkw7UUFBQyx1QkFBVSxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQTdCLENBQTZCLENBQUM7bUJBUW5ELG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsc0NBQWMsQ0FBQzttQkFDdEIsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOztzQkFWNEI7SUF1QjVELHFCQUFDO0FBQUQsQ0FBQyxBQXRCRCxDQUFvQywrQkFBYyxHQXNCakQ7QUF0Qlksc0JBQWMsaUJBc0IxQixDQUFBO0FBRUQ7SUFBNkIsa0NBQWM7SUFJdkMsd0JBQW1CLE1BQStCLEVBQUUsY0FBK0IsRUFBRSxvQkFBMEM7UUFDM0gsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztJQUN0RCxDQUFDO0lBRU0sZ0NBQU8sR0FBZCxVQUFlLE9BQXdCO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsaUJBQVUsQ0FBQyxLQUFLLEVBQTJCLENBQUM7UUFDdkQsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFpQjtZQUN6QixZQUFZLEVBQUUsOEJBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDM0UsUUFBUSxFQUFFLG9CQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUN0QyxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUk7U0FDeEIsQ0FBQztRQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyx3QkFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7YUFDdEQsR0FBRyxDQUFDLDJCQUFpQixDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQXpCRCxDQUE2QiwrQkFBYyxHQXlCMUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJUmVuYW1lUHJvdmlkZXIsIElSZW5hbWVTZXJ2aWNlLCBJU3luY0V4cHJlc3Npb24sIFJlbmFtZSwgVGV4dCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgUmVuYW1lUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IFJlbmFtZVBhcmFtcywgVGV4dERvY3VtZW50SWRlbnRpZmllciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGZyb21Xb3Jrc3BhY2VFZGl0LCB0b1Bvc2l0aW9uIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuaW1wb3J0IHsgRG9jdW1lbnRTeW5jUHJvdG9jb2wgfSBmcm9tICcuL0RvY3VtZW50U3luY1Byb3RvY29sJztcclxuXHJcbkBjYXBhYmlsaXR5KChjYXBhYmlsaXRpZXMpID0+ICEhY2FwYWJpbGl0aWVzLnJlbmFtZVByb3ZpZGVyKVxyXG5leHBvcnQgY2xhc3MgUmVuYW1lUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX3JlbmFtZVNlcnZpY2U6IElSZW5hbWVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfZG9jdW1lbnRTeW5jUHJvdG9jb2w6IERvY3VtZW50U3luY1Byb3RvY29sO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBpbmplY3QoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgQGluamVjdChJUmVuYW1lU2VydmljZSkgZmluZGVyU2VydmljZTogSVJlbmFtZVNlcnZpY2UsXHJcbiAgICAgICAgQGluamVjdChJU3luY0V4cHJlc3Npb24pIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24sXHJcbiAgICAgICAgZG9jdW1lbnRTeW5jUHJvdG9jb2w6IERvY3VtZW50U3luY1Byb3RvY29sXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9yZW5hbWVTZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50U3luY1Byb3RvY29sID0gZG9jdW1lbnRTeW5jUHJvdG9jb2w7XHJcblxyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgUmVuYW1lUHJvdmlkZXIoY2xpZW50LCBzeW5jRXhwcmVzc2lvbiwgZG9jdW1lbnRTeW5jUHJvdG9jb2wpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX3JlbmFtZVNlcnZpY2UucmVnaXN0ZXJQcm92aWRlcihzZXJ2aWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVuYW1lUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElSZW5hbWVQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX2RvY3VtZW50U3luY1Byb3RvY29sOiBEb2N1bWVudFN5bmNQcm90b2NvbDtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLCBkb2N1bWVudFN5bmNQcm90b2NvbDogRG9jdW1lbnRTeW5jUHJvdG9jb2wpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX2RvY3VtZW50U3luY1Byb3RvY29sID0gZG9jdW1lbnRTeW5jUHJvdG9jb2w7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3Qob3B0aW9uczogUmVuYW1lLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8VGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IFJlbmFtZVBhcmFtcyA9IHtcclxuICAgICAgICAgICAgdGV4dERvY3VtZW50OiBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLmNyZWF0ZSh0b1VyaShvcHRpb25zLmVkaXRvci5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdG9Qb3NpdGlvbihvcHRpb25zLmxvY2F0aW9uKSxcclxuICAgICAgICAgICAgbmV3TmFtZTogb3B0aW9ucy53b3JkXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zZW5kUmVxdWVzdChSZW5hbWVSZXF1ZXN0LnR5cGUsIHBhcmFtcylcclxuICAgICAgICAgICAgLm1hcChmcm9tV29ya3NwYWNlRWRpdCk7XHJcbiAgICB9XHJcbn1cclxuIl19