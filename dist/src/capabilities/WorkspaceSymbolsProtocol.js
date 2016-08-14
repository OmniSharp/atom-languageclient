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
var ts_disposables_1 = require('ts-disposables');
var constants_1 = require('../constants');
var convert_1 = require('./utils/convert');
var WorkspaceSymbolsProtocol = (function (_super) {
    __extends(WorkspaceSymbolsProtocol, _super);
    function WorkspaceSymbolsProtocol(client, finderService) {
        _super.call(this);
        this._client = client;
        this._finderService = finderService;
        // TODO: Handle trigger characters
        var service = new WorkspaceFinderService(client);
        this._disposable.add(service);
        this._finderService.registerProvider(service);
    }
    WorkspaceSymbolsProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.workspaceSymbolProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IWorkspaceFinderService)), 
        __metadata('design:paramtypes', [Object, Object])
    ], WorkspaceSymbolsProtocol);
    return WorkspaceSymbolsProtocol;
}(ts_disposables_1.DisposableBase));
exports.WorkspaceSymbolsProtocol = WorkspaceSymbolsProtocol;
var WorkspaceFinderService = (function (_super) {
    __extends(WorkspaceFinderService, _super);
    function WorkspaceFinderService(client) {
        var _this = this;
        _super.call(this);
        this._client = client;
        var filter = this.filter = new rxjs_1.Subject();
        this.results = filter
            .asObservable()
            .switchMap(function (query) {
            return _this._client.sendRequest(protocol_1.WorkspaceSymbolRequest.type, { query: query });
        })
            .map(function (results) {
            return _.map(results, function (symbol) { return _this._makeSymbol(symbol); });
        });
    }
    WorkspaceFinderService.prototype._makeSymbol = function (symbol) {
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
    WorkspaceFinderService.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromSymbolKind(completionItem.kind) + ".svg\" />";
    };
    return WorkspaceFinderService;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya3NwYWNlU3ltYm9sc1Byb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9Xb3Jrc3BhY2VTeW1ib2xzUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUE4QyxNQUFNLENBQUMsQ0FBQTtBQUNyRCxzQ0FBaUgsdUJBQXVCLENBQUMsQ0FBQTtBQUN6SSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBdUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUV4RSwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCwwQkFBNEIsY0FBYyxDQUFDLENBQUE7QUFDM0Msd0JBQXNDLGlCQUFpQixDQUFDLENBQUE7QUFHeEQ7SUFBOEMsNENBQWM7SUFHeEQsa0NBQ3FDLE1BQStCLEVBQy9CLGFBQXNDO1FBRXZFLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUVwQyxrQ0FBa0M7UUFDbEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFoQkw7UUFBQyx1QkFBVSxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsRUFBdEMsQ0FBc0MsQ0FBQzttQkFLNUQsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzs7Z0NBTjZCO0lBaUJyRSwrQkFBQztBQUFELENBQUMsQUFoQkQsQ0FBOEMsK0JBQWMsR0FnQjNEO0FBaEJZLGdDQUF3QiwyQkFnQnBDLENBQUE7QUFFRDtJQUFxQywwQ0FBYztJQUUvQyxnQ0FBbUIsTUFBK0I7UUFGdEQsaUJBb0NDO1FBakNPLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUV0QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksY0FBTyxFQUFVLENBQUM7UUFFbkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNO2FBQ2hCLFlBQVksRUFBRTthQUNkLFNBQVMsQ0FBQyxVQUFBLEtBQUs7WUFDWixNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsaUNBQXNCLENBQUMsSUFBSSxFQUFFLEVBQUUsWUFBSyxFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUM7YUFDRCxHQUFHLENBQUMsVUFBQSxPQUFPO1lBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQUEsTUFBTSxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUtPLDRDQUFXLEdBQW5CLFVBQW9CLE1BQXlCO1FBQ3pDLGtCQUFrQjtRQUNsQixNQUFNLENBQW1CO1lBQ3JCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNqQixVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO1lBQ2xDLFFBQVEsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1lBQ3RDLFFBQVEsRUFBRSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNuRCxJQUFJLEVBQUUsb0NBQVksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQ3hELENBQUM7SUFDTixDQUFDO0lBRU8sNENBQVcsR0FBbkIsVUFBb0IsY0FBb0M7UUFDcEQsTUFBTSxDQUFDLHNEQUErQyx1QkFBVyxzQkFBaUIsb0NBQVksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFDLGNBQVUsQ0FBQztJQUN6SixDQUFDO0lBQ0wsNkJBQUM7QUFBRCxDQUFDLEFBcENELENBQXFDLCtCQUFjLEdBb0NsRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0b2NvbXBsZXRlLCBGaW5kZXIsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJV29ya3NwYWNlRmluZGVyUHJvdmlkZXIsIElXb3Jrc3BhY2VGaW5kZXJTZXJ2aWNlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBXb3Jrc3BhY2VTeW1ib2xSZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sJztcclxuaW1wb3J0IHsgU3ltYm9sSW5mb3JtYXRpb24sIFN5bWJvbEtpbmQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBmcm9tUG9zaXRpb24sIGZyb21VcmkgfSBmcm9tICcuL3V0aWxzL2NvbnZlcnQnO1xyXG5cclxuQGNhcGFiaWxpdHkoKGNhcGFiaWxpdGllcykgPT4gISFjYXBhYmlsaXRpZXMud29ya3NwYWNlU3ltYm9sUHJvdmlkZXIpXHJcbmV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VTeW1ib2xzUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfZmluZGVyU2VydmljZTogSVdvcmtzcGFjZUZpbmRlclNlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSVdvcmtzcGFjZUZpbmRlclNlcnZpY2UpIGZpbmRlclNlcnZpY2U6IElXb3Jrc3BhY2VGaW5kZXJTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9maW5kZXJTZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHRyaWdnZXIgY2hhcmFjdGVyc1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgV29ya3NwYWNlRmluZGVyU2VydmljZShjbGllbnQpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2ZpbmRlclNlcnZpY2UucmVnaXN0ZXJQcm92aWRlcihzZXJ2aWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgV29ya3NwYWNlRmluZGVyU2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSVdvcmtzcGFjZUZpbmRlclByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG5cclxuICAgICAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmZpbHRlciA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gZmlsdGVyXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAuc3dpdGNoTWFwKHF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoV29ya3NwYWNlU3ltYm9sUmVxdWVzdC50eXBlLCB7IHF1ZXJ5IH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3VsdHMsIHN5bWJvbCA9PiB0aGlzLl9tYWtlU3ltYm9sKHN5bWJvbCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzdWx0czogT2JzZXJ2YWJsZTxGaW5kZXIuSVJlc3BvbnNlW10+O1xyXG4gICAgcHVibGljIGZpbHRlcjogT2JzZXJ2ZXI8c3RyaW5nPjtcclxuXHJcbiAgICBwcml2YXRlIF9tYWtlU3ltYm9sKHN5bWJvbDogU3ltYm9sSW5mb3JtYXRpb24pOiBGaW5kZXIuSVJlc3BvbnNlIHtcclxuICAgICAgICAvLyBUT0RPOiBJY29uIGh0bWxcclxuICAgICAgICByZXR1cm4gPEZpbmRlci5JUmVzcG9uc2U+e1xyXG4gICAgICAgICAgICBuYW1lOiBzeW1ib2wubmFtZSxcclxuICAgICAgICAgICAgZmlsdGVyVGV4dDogc3ltYm9sLm5hbWUsXHJcbiAgICAgICAgICAgIGljb25IVE1MOiB0aGlzLl9yZW5kZXJJY29uKHN5bWJvbCksXHJcbiAgICAgICAgICAgIGZpbGVQYXRoOiBmcm9tVXJpKHN5bWJvbC5sb2NhdGlvbi51cmkpLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZnJvbVBvc2l0aW9uKHN5bWJvbC5sb2NhdGlvbi5yYW5nZS5zdGFydCksXHJcbiAgICAgICAgICAgIHR5cGU6IEF1dG9jb21wbGV0ZS5nZXRUeXBlRnJvbVN5bWJvbEtpbmQoc3ltYm9sLmtpbmQpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJJY29uKGNvbXBsZXRpb25JdGVtOiB7IGtpbmQ6IFN5bWJvbEtpbmQgfSkge1xyXG4gICAgICAgIHJldHVybiBgPGltZyBoZWlnaHQ9XCIxNnB4XCIgd2lkdGg9XCIxNnB4XCIgc3JjPVwiYXRvbTovLyR7cGFja2FnZU5hbWV9L3N0eWxlcy9pY29ucy8ke0F1dG9jb21wbGV0ZS5nZXRJY29uRnJvbVN5bWJvbEtpbmQoY29tcGxldGlvbkl0ZW0ua2luZCEpfS5zdmdcIiAvPmA7XHJcbiAgICB9XHJcbn1cclxuIl19