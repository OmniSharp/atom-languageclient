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
        if (!client.capabilities.extended.getCodeActionsProvider) {
            return;
        }
        // TODO: Handle trigger characters
        var service = new GetCodeActionsProvider(client, syncExpression);
        this._disposable.add(service);
        this._getCodeActionsService.registerProvider(service);
    }
    GetCodeActionsProtocol = __decorate([
        decorators_1.capability,
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
        return rxjs_1.Observable.fromPromise(this._client.sendRequest(protocol_extended_1.GetCodeActionsRequest.type, {
            textDocument: types_extended_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            range: convert_1.toRange(options.range),
            context: {}
        }))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0Q29kZUFjdGlvbnNQcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYXBhYmlsaXRpZXMvR2V0Q29kZUFjdGlvbnNQcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUEwSCx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xKLDJCQUFtQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3RFLGtDQUFzQyx5Q0FBeUMsQ0FBQyxDQUFBO0FBQ2hGLCtCQUF1QyxzQ0FBc0MsQ0FBQyxDQUFBO0FBQzlFLElBQVksS0FBSyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELHdCQUEyQyxpQkFBaUIsQ0FBQyxDQUFBO0FBRzdEO0lBQTRDLDBDQUFjO0lBSXRELGdDQUNxQyxNQUErQixFQUNoQyxhQUFxQyxFQUM1QyxjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLGFBQWEsQ0FBQztRQUM1QyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUN2RCxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsa0NBQWtDO1FBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksc0JBQXNCLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBdEJMO1FBQUMsdUJBQVU7bUJBTUYsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQyw4Q0FBc0IsQ0FBQzttQkFDOUIsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOzs4QkFSckI7SUF1QlgsNkJBQUM7QUFBRCxDQUFDLEFBdEJELENBQTRDLCtCQUFjLEdBc0J6RDtBQXRCWSw4QkFBc0IseUJBc0JsQyxDQUFBO0FBRUQ7SUFBcUMsMENBQWM7SUFHL0MsZ0NBQ0ksTUFBK0IsRUFDL0IsY0FBK0I7UUFDL0IsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0lBQzFDLENBQUM7SUFFTSx3Q0FBTyxHQUFkLFVBQWUsT0FBZ0M7UUFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxpQkFBVSxDQUFDLEtBQUssRUFBOEIsQ0FBQztRQUMxRCxDQUFDO1FBRUQsTUFBTSxDQUFDLGlCQUFVLENBQUMsV0FBVyxDQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5Q0FBcUIsQ0FBQyxJQUFJLEVBQUU7WUFDakQsWUFBWSxFQUFFLHVDQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzNFLEtBQUssRUFBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7WUFDN0IsT0FBTyxFQUFFLEVBQUU7U0FDZCxDQUFDLENBQUM7YUFDRixHQUFHLENBQUMsVUFBQSxRQUFRO1lBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFBLE1BQU07Z0JBQ3JDLE1BQU0sQ0FBQztvQkFDSCxFQUFFLEVBQUUsTUFBTSxDQUFDLFVBQVU7b0JBQ3JCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtvQkFDakIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJO2lCQUNyQixDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDTCw2QkFBQztBQUFELENBQUMsQUFoQ0QsQ0FBcUMsK0JBQWMsR0FnQ2xEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEdldENvZGVBY3Rpb25zLCBJR2V0Q29kZUFjdGlvbnNQcm92aWRlciwgSUdldENvZGVBY3Rpb25zU2VydmljZSwgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgR2V0Q29kZUFjdGlvbnNSZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sLWV4dGVuZGVkJztcclxuaW1wb3J0IHsgVGV4dERvY3VtZW50SWRlbnRpZmllciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcy1leHRlbmRlZCc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGZyb21Xb3Jrc3BhY2VFZGl0LCB0b1JhbmdlIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuXHJcbkBjYXBhYmlsaXR5XHJcbmV4cG9ydCBjbGFzcyBHZXRDb2RlQWN0aW9uc1Byb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9nZXRDb2RlQWN0aW9uc1NlcnZpY2U6IElHZXRDb2RlQWN0aW9uc1NlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSUdldENvZGVBY3Rpb25zU2VydmljZSkgZmluZGVyU2VydmljZTogSUdldENvZGVBY3Rpb25zU2VydmljZSxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvblxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fZ2V0Q29kZUFjdGlvbnNTZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIGlmICghY2xpZW50LmNhcGFiaWxpdGllcy5leHRlbmRlZC5nZXRDb2RlQWN0aW9uc1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSB0cmlnZ2VyIGNoYXJhY3RlcnNcclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IEdldENvZGVBY3Rpb25zUHJvdmlkZXIoY2xpZW50LCBzeW5jRXhwcmVzc2lvbik7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoc2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5fZ2V0Q29kZUFjdGlvbnNTZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEdldENvZGVBY3Rpb25zUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElHZXRDb2RlQWN0aW9uc1Byb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3Qob3B0aW9uczogR2V0Q29kZUFjdGlvbnMuSVJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKG9wdGlvbnMuZWRpdG9yKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxHZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2VbXT4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb21Qcm9taXNlKFxyXG4gICAgICAgICAgICB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoR2V0Q29kZUFjdGlvbnNSZXF1ZXN0LnR5cGUsIHtcclxuICAgICAgICAgICAgICAgIHRleHREb2N1bWVudDogVGV4dERvY3VtZW50SWRlbnRpZmllci5jcmVhdGUodG9Vcmkob3B0aW9ucy5lZGl0b3IuZ2V0VVJJKCkpKSxcclxuICAgICAgICAgICAgICAgIHJhbmdlOiB0b1JhbmdlKG9wdGlvbnMucmFuZ2UpLFxyXG4gICAgICAgICAgICAgICAgY29udGV4dDoge31cclxuICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgIC5tYXAocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3BvbnNlLmNvZGVBY3Rpb25zLCBhY3Rpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBhY3Rpb24uaWRlbnRpZmllcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYWN0aW9uLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBhY3Rpb24ubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl19