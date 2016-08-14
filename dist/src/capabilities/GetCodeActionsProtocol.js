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
var protocol_extended_1 = require('atom-languageservices/protocol-extended');
var types_extended_1 = require('atom-languageservices/types-extended');
var toUri = require('file-url');
var ts_disposables_1 = require('ts-disposables');
var convert_1 = require('./utils/convert');
var GetCodeActionsProtocol = (function (_super) {
    __extends(GetCodeActionsProtocol, _super);
    function GetCodeActionsProtocol(client, finderService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._getCodeActionsService = finderService;
        this._syncExpression = syncExpression;
        // TODO: Handle trigger characters
        var service = new GetCodeActionsProvider(client, syncExpression);
        this._disposable.add(service);
        this._getCodeActionsService.registerProvider(service);
    }
    GetCodeActionsProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.extended.getCodeActionsProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IGetCodeActionsService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], GetCodeActionsProtocol);
    return GetCodeActionsProtocol;
}(ts_disposables_1.DisposableBase));
exports.GetCodeActionsProtocol = GetCodeActionsProtocol;
var GetCodeActionsProvider = (function (_super) {
    __extends(GetCodeActionsProvider, _super);
    function GetCodeActionsProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    GetCodeActionsProvider.prototype.request = function (options) {
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        return this._client.sendRequest(protocol_extended_1.GetCodeActionsRequest.type, {
            textDocument: types_extended_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            range: convert_1.toRange(options.range),
            context: {}
        })
            .map(function (response) {
            return _.map(response.codeActions, function (action) {
                return {
                    id: action.identifier,
                    name: action.name,
                    title: action.name
                };
            });
        });
    };
    return GetCodeActionsProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0Q29kZUFjdGlvbnNQcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYXBhYmlsaXRpZXMvR2V0Q29kZUFjdGlvbnNQcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUEwSCx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xKLDJCQUFtQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3RFLGtDQUFzQyx5Q0FBeUMsQ0FBQyxDQUFBO0FBQ2hGLCtCQUF1QyxzQ0FBc0MsQ0FBQyxDQUFBO0FBQzlFLElBQVksS0FBSyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELHdCQUEyQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRzdEO0lBQTRDLDBDQUFjO0lBSXRELGdDQUNxQyxNQUErQixFQUNoQyxhQUFxQyxFQUM1QyxjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLGFBQWEsQ0FBQztRQUM1QyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUV0QyxrQ0FBa0M7UUFDbEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFuQkw7UUFBQyx1QkFBVSxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQTlDLENBQThDLENBQUM7bUJBTXBFLG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsOENBQXNCLENBQUM7bUJBQzlCLG1CQUFNLENBQUMsdUNBQWUsQ0FBQzs7OEJBUjZDO0lBb0I3RSw2QkFBQztBQUFELENBQUMsQUFuQkQsQ0FBNEMsK0JBQWMsR0FtQnpEO0FBbkJZLDhCQUFzQix5QkFtQmxDLENBQUE7QUFFRDtJQUFxQywwQ0FBYztJQUcvQyxnQ0FDSSxNQUErQixFQUMvQixjQUErQjtRQUMvQixpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7SUFDMUMsQ0FBQztJQUVNLHdDQUFPLEdBQWQsVUFBZSxPQUFnQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUE4QixDQUFDO1FBQzFELENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMseUNBQXFCLENBQUMsSUFBSSxFQUFFO1lBQ3hELFlBQVksRUFBRSx1Q0FBc0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMzRSxLQUFLLEVBQUUsaUJBQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQzdCLE9BQU8sRUFBRSxFQUFFO1NBQ2QsQ0FBQzthQUNHLEdBQUcsQ0FBQyxVQUFBLFFBQVE7WUFDVCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFVBQUEsTUFBTTtnQkFDckMsTUFBTSxDQUFDO29CQUNILEVBQUUsRUFBRSxNQUFNLENBQUMsVUFBVTtvQkFDckIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO29CQUNqQixLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUk7aUJBQ3JCLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNMLDZCQUFDO0FBQUQsQ0FBQyxBQS9CRCxDQUFxQywrQkFBYyxHQStCbEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgR2V0Q29kZUFjdGlvbnMsIElHZXRDb2RlQWN0aW9uc1Byb3ZpZGVyLCBJR2V0Q29kZUFjdGlvbnNTZXJ2aWNlLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVN5bmNFeHByZXNzaW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBHZXRDb2RlQWN0aW9uc1JlcXVlc3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvcHJvdG9jb2wtZXh0ZW5kZWQnO1xyXG5pbXBvcnQgeyBUZXh0RG9jdW1lbnRJZGVudGlmaWVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzLWV4dGVuZGVkJztcclxuaW1wb3J0ICogYXMgdG9VcmkgZnJvbSAnZmlsZS11cmwnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgZnJvbVdvcmtzcGFjZUVkaXQsIHRvUmFuZ2UgfSBmcm9tICcuL3V0aWxzL2NvbnZlcnQnO1xyXG5cclxuQGNhcGFiaWxpdHkoKGNhcGFiaWxpdGllcykgPT4gISFjYXBhYmlsaXRpZXMuZXh0ZW5kZWQuZ2V0Q29kZUFjdGlvbnNQcm92aWRlcilcclxuZXhwb3J0IGNsYXNzIEdldENvZGVBY3Rpb25zUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX2dldENvZGVBY3Rpb25zU2VydmljZTogSUdldENvZGVBY3Rpb25zU2VydmljZTtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBpbmplY3QoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgQGluamVjdChJR2V0Q29kZUFjdGlvbnNTZXJ2aWNlKSBmaW5kZXJTZXJ2aWNlOiBJR2V0Q29kZUFjdGlvbnNTZXJ2aWNlLFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9nZXRDb2RlQWN0aW9uc1NlcnZpY2UgPSBmaW5kZXJTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSB0cmlnZ2VyIGNoYXJhY3RlcnNcclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IEdldENvZGVBY3Rpb25zUHJvdmlkZXIoY2xpZW50LCBzeW5jRXhwcmVzc2lvbik7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoc2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5fZ2V0Q29kZUFjdGlvbnNTZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEdldENvZGVBY3Rpb25zUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElHZXRDb2RlQWN0aW9uc1Byb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3Qob3B0aW9uczogR2V0Q29kZUFjdGlvbnMuSVJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKG9wdGlvbnMuZWRpdG9yKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxHZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2VbXT4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoR2V0Q29kZUFjdGlvbnNSZXF1ZXN0LnR5cGUsIHtcclxuICAgICAgICAgICAgdGV4dERvY3VtZW50OiBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLmNyZWF0ZSh0b1VyaShvcHRpb25zLmVkaXRvci5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICByYW5nZTogdG9SYW5nZShvcHRpb25zLnJhbmdlKSxcclxuICAgICAgICAgICAgY29udGV4dDoge31cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChyZXNwb25zZS5jb2RlQWN0aW9ucywgYWN0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYWN0aW9uLmlkZW50aWZpZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGFjdGlvbi5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogYWN0aW9uLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==