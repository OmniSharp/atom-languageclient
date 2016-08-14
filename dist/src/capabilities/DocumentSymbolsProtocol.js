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
var constants_1 = require('../constants');
var convert_1 = require('./utils/convert');
var DocumentSymbolsProtocol = (function (_super) {
    __extends(DocumentSymbolsProtocol, _super);
    function DocumentSymbolsProtocol(client, finderService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._finderService = finderService;
        this._syncExpression = syncExpression;
        // TODO: Handle trigger characters
        var service = new DocumentFinderProvider(client, syncExpression);
        this._disposable.add(service);
        this._finderService.registerProvider(service);
    }
    DocumentSymbolsProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.documentSymbolProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IDocumentFinderService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], DocumentSymbolsProtocol);
    return DocumentSymbolsProtocol;
}(ts_disposables_1.DisposableBase));
exports.DocumentSymbolsProtocol = DocumentSymbolsProtocol;
var DocumentFinderProvider = (function (_super) {
    __extends(DocumentFinderProvider, _super);
    function DocumentFinderProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    DocumentFinderProvider.prototype.request = function (editor) {
        var _this = this;
        if (!this._syncExpression.evaluate(editor)) {
            return rxjs_1.Observable.empty();
        }
        return this._client.sendRequest(protocol_1.DocumentSymbolRequest.type, {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(editor.getURI()))
        }).map(function (results) {
            return _.map(results, function (result) { return _this._makeSymbol(result); });
        });
    };
    DocumentFinderProvider.prototype._makeSymbol = function (symbol) {
        // TODO: Icon html
        return {
            name: symbol.name,
            filterText: symbol.name,
            iconHTML: this._renderIcon(symbol),
            filePath: convert_1.fromUri(symbol.location.uri),
            location: convert_1.fromPosition(symbol.location.range.start),
            type: atom_languageservices_1.Autocomplete.getTypeFromSymbolKind(symbol.kind)
        };
    };
    DocumentFinderProvider.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromSymbolKind(completionItem.kind) + ".svg\" />";
    };
    return DocumentFinderProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRTeW1ib2xzUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0RvY3VtZW50U3ltYm9sc1Byb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQWdJLHVCQUF1QixDQUFDLENBQUE7QUFDeEosMkJBQW1DLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUseUJBQXNDLGdDQUFnQyxDQUFDLENBQUE7QUFDdkUsc0JBQXNFLDZCQUE2QixDQUFDLENBQUE7QUFDcEcsSUFBWSxLQUFLLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFDbEMsK0JBQStCLGdCQUFnQixDQUFDLENBQUE7QUFDaEQsMEJBQTRCLGNBQWMsQ0FBQyxDQUFBO0FBQzNDLHdCQUFzQyxpQkFBaUIsQ0FBQyxDQUFBO0FBR3hEO0lBQTZDLDJDQUFjO0lBSXZELGlDQUNxQyxNQUErQixFQUNoQyxhQUFxQyxFQUM1QyxjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFFdEMsa0NBQWtDO1FBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksc0JBQXNCLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQW5CTDtRQUFDLHVCQUFVLENBQUMsVUFBQyxZQUFZLElBQUssT0FBQSxDQUFDLENBQUMsWUFBWSxDQUFDLHNCQUFzQixFQUFyQyxDQUFxQyxDQUFDO21CQU0zRCxtQkFBTSxDQUFDLCtDQUF1QixDQUFDO21CQUMvQixtQkFBTSxDQUFDLDhDQUFzQixDQUFDO21CQUM5QixtQkFBTSxDQUFDLHVDQUFlLENBQUM7OytCQVJvQztJQW9CcEUsOEJBQUM7QUFBRCxDQUFDLEFBbkJELENBQTZDLCtCQUFjLEdBbUIxRDtBQW5CWSwrQkFBdUIsMEJBbUJuQyxDQUFBO0FBRUQ7SUFBcUMsMENBQWM7SUFHL0MsZ0NBQ0ksTUFBK0IsRUFDL0IsY0FBK0I7UUFDL0IsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0lBQzFDLENBQUM7SUFFTSx3Q0FBTyxHQUFkLFVBQWUsTUFBdUI7UUFBdEMsaUJBVUM7UUFURyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsaUJBQVUsQ0FBQyxLQUFLLEVBQXNCLENBQUM7UUFDbEQsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxnQ0FBcUIsQ0FBQyxJQUFJLEVBQUU7WUFDeEQsWUFBWSxFQUFFLDhCQUFzQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDdkUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87WUFDVixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUF4QixDQUF3QixDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sNENBQVcsR0FBbkIsVUFBb0IsTUFBeUI7UUFDekMsa0JBQWtCO1FBQ2xCLE1BQU0sQ0FBbUI7WUFDckIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLFVBQVUsRUFBRSxNQUFNLENBQUMsSUFBSTtZQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDbEMsUUFBUSxFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7WUFDdEMsUUFBUSxFQUFFLHNCQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ25ELElBQUksRUFBRSxvQ0FBWSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDeEQsQ0FBQztJQUNOLENBQUM7SUFFTyw0Q0FBVyxHQUFuQixVQUFvQixjQUFvQztRQUNwRCxNQUFNLENBQUMsc0RBQStDLHVCQUFXLHNCQUFpQixvQ0FBWSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUMsY0FBVSxDQUFDO0lBQ3pKLENBQUM7SUFDTCw2QkFBQztBQUFELENBQUMsQUF0Q0QsQ0FBcUMsK0JBQWMsR0FzQ2xEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dG9jb21wbGV0ZSwgRmluZGVyLCBJRG9jdW1lbnRGaW5kZXJQcm92aWRlciwgSURvY3VtZW50RmluZGVyU2VydmljZSwgSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIElTeW5jRXhwcmVzc2lvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgRG9jdW1lbnRTeW1ib2xSZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sJztcclxuaW1wb3J0IHsgU3ltYm9sSW5mb3JtYXRpb24sIFN5bWJvbEtpbmQsIFRleHREb2N1bWVudElkZW50aWZpZXIgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgKiBhcyB0b1VyaSBmcm9tICdmaWxlLXVybCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBwYWNrYWdlTmFtZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IGZyb21Qb3NpdGlvbiwgZnJvbVVyaSB9IGZyb20gJy4vdXRpbHMvY29udmVydCc7XHJcblxyXG5AY2FwYWJpbGl0eSgoY2FwYWJpbGl0aWVzKSA9PiAhIWNhcGFiaWxpdGllcy5kb2N1bWVudFN5bWJvbFByb3ZpZGVyKVxyXG5leHBvcnQgY2xhc3MgRG9jdW1lbnRTeW1ib2xzUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHByaXZhdGUgX2ZpbmRlclNlcnZpY2U6IElEb2N1bWVudEZpbmRlclNlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSURvY3VtZW50RmluZGVyU2VydmljZSkgZmluZGVyU2VydmljZTogSURvY3VtZW50RmluZGVyU2VydmljZSxcclxuICAgICAgICBAaW5qZWN0KElTeW5jRXhwcmVzc2lvbikgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvblxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fZmluZGVyU2VydmljZSA9IGZpbmRlclNlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHRyaWdnZXIgY2hhcmFjdGVyc1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgRG9jdW1lbnRGaW5kZXJQcm92aWRlcihjbGllbnQsIHN5bmNFeHByZXNzaW9uKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLl9maW5kZXJTZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERvY3VtZW50RmluZGVyUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElEb2N1bWVudEZpbmRlclByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3QoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKGVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8RmluZGVyLklSZXNwb25zZVtdPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudC5zZW5kUmVxdWVzdChEb2N1bWVudFN5bWJvbFJlcXVlc3QudHlwZSwge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKGVkaXRvciEuZ2V0VVJJKCkpKVxyXG4gICAgICAgIH0pLm1hcChyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3VsdHMsIHJlc3VsdCA9PiB0aGlzLl9tYWtlU3ltYm9sKHJlc3VsdCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21ha2VTeW1ib2woc3ltYm9sOiBTeW1ib2xJbmZvcm1hdGlvbik6IEZpbmRlci5JUmVzcG9uc2Uge1xyXG4gICAgICAgIC8vIFRPRE86IEljb24gaHRtbFxyXG4gICAgICAgIHJldHVybiA8RmluZGVyLklSZXNwb25zZT57XHJcbiAgICAgICAgICAgIG5hbWU6IHN5bWJvbC5uYW1lLFxyXG4gICAgICAgICAgICBmaWx0ZXJUZXh0OiBzeW1ib2wubmFtZSxcclxuICAgICAgICAgICAgaWNvbkhUTUw6IHRoaXMuX3JlbmRlckljb24oc3ltYm9sKSxcclxuICAgICAgICAgICAgZmlsZVBhdGg6IGZyb21Vcmkoc3ltYm9sLmxvY2F0aW9uLnVyaSksXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBmcm9tUG9zaXRpb24oc3ltYm9sLmxvY2F0aW9uLnJhbmdlLnN0YXJ0KSxcclxuICAgICAgICAgICAgdHlwZTogQXV0b2NvbXBsZXRlLmdldFR5cGVGcm9tU3ltYm9sS2luZChzeW1ib2wua2luZClcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlckljb24oY29tcGxldGlvbkl0ZW06IHsga2luZDogU3ltYm9sS2luZCB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGA8aW1nIGhlaWdodD1cIjE2cHhcIiB3aWR0aD1cIjE2cHhcIiBzcmM9XCJhdG9tOi8vJHtwYWNrYWdlTmFtZX0vc3R5bGVzL2ljb25zLyR7QXV0b2NvbXBsZXRlLmdldEljb25Gcm9tU3ltYm9sS2luZChjb21wbGV0aW9uSXRlbS5raW5kISl9LnN2Z1wiIC8+YDtcclxuICAgIH1cclxufVxyXG4iXX0=