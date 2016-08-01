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
        if (!client.capabilities.documentSymbolProvider) {
            return;
        }
        // TODO: Handle trigger characters
        var service = new DocumentFinderProvider(client, syncExpression);
        this._disposable.add(service);
        this._finderService.registerProvider(service);
    }
    DocumentSymbolsProtocol = __decorate([
        decorators_1.capability,
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
        return rxjs_1.Observable.fromPromise(this._client.sendRequest(protocol_1.DocumentSymbolRequest.type, {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(editor.getURI()))
        })).map(function (results) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRTeW1ib2xzUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0RvY3VtZW50U3ltYm9sc1Byb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQWdJLHVCQUF1QixDQUFDLENBQUE7QUFDeEosMkJBQW1DLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUseUJBQXNDLGdDQUFnQyxDQUFDLENBQUE7QUFDdkUsc0JBQXNFLDZCQUE2QixDQUFDLENBQUE7QUFDcEcsSUFBWSxLQUFLLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFDbEMsK0JBQStCLGdCQUFnQixDQUFDLENBQUE7QUFDaEQsMEJBQTRCLGNBQWMsQ0FBQyxDQUFBO0FBQzNDLHdCQUFzQyxpQkFBaUIsQ0FBQyxDQUFBO0FBR3hEO0lBQTZDLDJDQUFjO0lBSXZELGlDQUNxQyxNQUErQixFQUNoQyxhQUFxQyxFQUM1QyxjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsa0NBQWtDO1FBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksc0JBQXNCLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQXRCTDtRQUFDLHVCQUFVO21CQU1GLG1CQUFNLENBQUMsK0NBQXVCLENBQUM7bUJBQy9CLG1CQUFNLENBQUMsOENBQXNCLENBQUM7bUJBQzlCLG1CQUFNLENBQUMsdUNBQWUsQ0FBQzs7K0JBUnJCO0lBdUJYLDhCQUFDO0FBQUQsQ0FBQyxBQXRCRCxDQUE2QywrQkFBYyxHQXNCMUQ7QUF0QlksK0JBQXVCLDBCQXNCbkMsQ0FBQTtBQUVEO0lBQXFDLDBDQUFjO0lBRy9DLGdDQUNJLE1BQStCLEVBQy9CLGNBQStCO1FBQy9CLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sd0NBQU8sR0FBZCxVQUFlLE1BQXVCO1FBQXRDLGlCQVlDO1FBWEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUFzQixDQUFDO1FBQ2xELENBQUM7UUFFRCxNQUFNLENBQUMsaUJBQVUsQ0FBQyxXQUFXLENBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGdDQUFxQixDQUFDLElBQUksRUFBRTtZQUNqRCxZQUFZLEVBQUUsOEJBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN2RSxDQUFDLENBQ0wsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPO1lBQ1QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQUEsTUFBTSxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLDRDQUFXLEdBQW5CLFVBQW9CLE1BQXlCO1FBQ3pDLGtCQUFrQjtRQUNsQixNQUFNLENBQW1CO1lBQ3JCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBQ2xDLFFBQVEsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ3RDLFFBQVEsRUFBRSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNuRCxJQUFJLEVBQUUsb0NBQVksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQ3hELENBQUM7SUFDTixDQUFDO0lBRU8sNENBQVcsR0FBbkIsVUFBb0IsY0FBb0M7UUFDcEQsTUFBTSxDQUFDLHNEQUErQyx1QkFBVyxzQkFBaUIsb0NBQVksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFDLGNBQVUsQ0FBQztJQUN6SixDQUFDO0lBQ0wsNkJBQUM7QUFBRCxDQUFDLEFBeENELENBQXFDLCtCQUFjLEdBd0NsRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBdXRvY29tcGxldGUsIEZpbmRlciwgSURvY3VtZW50RmluZGVyUHJvdmlkZXIsIElEb2N1bWVudEZpbmRlclNlcnZpY2UsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJU3luY0V4cHJlc3Npb24gfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjYXBhYmlsaXR5LCBpbmplY3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IERvY3VtZW50U3ltYm9sUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IFN5bWJvbEluZm9ybWF0aW9uLCBTeW1ib2xLaW5kLCBUZXh0RG9jdW1lbnRJZGVudGlmaWVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzJztcclxuaW1wb3J0ICogYXMgdG9VcmkgZnJvbSAnZmlsZS11cmwnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBmcm9tUG9zaXRpb24sIGZyb21VcmkgfSBmcm9tICcuL3V0aWxzL2NvbnZlcnQnO1xyXG5cclxuQGNhcGFiaWxpdHlcclxuZXhwb3J0IGNsYXNzIERvY3VtZW50U3ltYm9sc1Byb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9maW5kZXJTZXJ2aWNlOiBJRG9jdW1lbnRGaW5kZXJTZXJ2aWNlO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElEb2N1bWVudEZpbmRlclNlcnZpY2UpIGZpbmRlclNlcnZpY2U6IElEb2N1bWVudEZpbmRlclNlcnZpY2UsXHJcbiAgICAgICAgQGluamVjdChJU3luY0V4cHJlc3Npb24pIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb25cclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX2ZpbmRlclNlcnZpY2UgPSBmaW5kZXJTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICAgICAgaWYgKCFjbGllbnQuY2FwYWJpbGl0aWVzLmRvY3VtZW50U3ltYm9sUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHRyaWdnZXIgY2hhcmFjdGVyc1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgRG9jdW1lbnRGaW5kZXJQcm92aWRlcihjbGllbnQsIHN5bmNFeHByZXNzaW9uKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLl9maW5kZXJTZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIERvY3VtZW50RmluZGVyUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElEb2N1bWVudEZpbmRlclByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3QoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKGVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8RmluZGVyLklSZXNwb25zZVtdPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbVByb21pc2UoXHJcbiAgICAgICAgICAgIHRoaXMuX2NsaWVudC5zZW5kUmVxdWVzdChEb2N1bWVudFN5bWJvbFJlcXVlc3QudHlwZSwge1xyXG4gICAgICAgICAgICAgICAgdGV4dERvY3VtZW50OiBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLmNyZWF0ZSh0b1VyaShlZGl0b3IhLmdldFVSSSgpKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApLm1hcChyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3VsdHMsIHJlc3VsdCA9PiB0aGlzLl9tYWtlU3ltYm9sKHJlc3VsdCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21ha2VTeW1ib2woc3ltYm9sOiBTeW1ib2xJbmZvcm1hdGlvbik6IEZpbmRlci5JUmVzcG9uc2Uge1xyXG4gICAgICAgIC8vIFRPRE86IEljb24gaHRtbFxyXG4gICAgICAgIHJldHVybiA8RmluZGVyLklSZXNwb25zZT57XHJcbiAgICAgICAgICAgIG5hbWU6IHN5bWJvbC5uYW1lLFxyXG4gICAgICAgICAgICBmaWx0ZXJUZXh0OiBzeW1ib2wubmFtZSxcclxuICAgICAgICAgICAgaWNvbkhUTUw6IHRoaXMuX3JlbmRlckljb24oc3ltYm9sKSxcclxuICAgICAgICAgICAgZmlsZVBhdGg6IGZyb21Vcmkoc3ltYm9sLmxvY2F0aW9uLnVyaSksXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBmcm9tUG9zaXRpb24oc3ltYm9sLmxvY2F0aW9uLnJhbmdlLnN0YXJ0KSxcclxuICAgICAgICAgICAgdHlwZTogQXV0b2NvbXBsZXRlLmdldFR5cGVGcm9tU3ltYm9sS2luZChzeW1ib2wua2luZClcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlckljb24oY29tcGxldGlvbkl0ZW06IHsga2luZDogU3ltYm9sS2luZCB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGA8aW1nIGhlaWdodD1cIjE2cHhcIiB3aWR0aD1cIjE2cHhcIiBzcmM9XCJhdG9tOi8vJHtwYWNrYWdlTmFtZX0vc3R5bGVzL2ljb25zLyR7QXV0b2NvbXBsZXRlLmdldEljb25Gcm9tU3ltYm9sS2luZChjb21wbGV0aW9uSXRlbS5raW5kISl9LnN2Z1wiIC8+YDtcclxuICAgIH1cclxufVxyXG4iXX0=