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
        if (!client.capabilities.workspaceSymbolProvider) {
            return;
        }
        // TODO: Handle trigger characters
        var service = new WorkspaceFinderService(client);
        this._disposable.add(service);
        this._finderService.registerProvider(service);
    }
    WorkspaceSymbolsProtocol = __decorate([
        decorators_1.capability,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya3NwYWNlU3ltYm9sc1Byb3RvY29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NhcGFiaWxpdGllcy9Xb3Jrc3BhY2VTeW1ib2xzUHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUE4QyxNQUFNLENBQUMsQ0FBQTtBQUNyRCxzQ0FBaUgsdUJBQXVCLENBQUMsQ0FBQTtBQUN6SSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBdUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUV4RSwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCwwQkFBNEIsY0FBYyxDQUFDLENBQUE7QUFDM0Msd0JBQXNDLGlCQUFpQixDQUFDLENBQUE7QUFHeEQ7SUFBOEMsNENBQWM7SUFHeEQsa0NBQ3FDLE1BQStCLEVBQy9CLGFBQXNDO1FBRXZFLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxrQ0FBa0M7UUFDbEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFuQkw7UUFBQyx1QkFBVTttQkFLRixtQkFBTSxDQUFDLCtDQUF1QixDQUFDO21CQUMvQixtQkFBTSxDQUFDLCtDQUF1QixDQUFDOztnQ0FON0I7SUFvQlgsK0JBQUM7QUFBRCxDQUFDLEFBbkJELENBQThDLCtCQUFjLEdBbUIzRDtBQW5CWSxnQ0FBd0IsMkJBbUJwQyxDQUFBO0FBRUQ7SUFBcUMsMENBQWM7SUFFL0MsZ0NBQW1CLE1BQStCO1FBRnRELGlCQW9DQztRQWpDTyxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFdEIsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGNBQU8sRUFBVSxDQUFDO1FBRW5ELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTTthQUNoQixZQUFZLEVBQUU7YUFDZCxTQUFTLENBQUMsVUFBQSxLQUFLO1lBQ1osTUFBTSxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGlDQUFzQixDQUFDLElBQUksRUFBRSxFQUFFLFlBQUssRUFBRSxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQUEsT0FBTztZQUNSLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFLTyw0Q0FBVyxHQUFuQixVQUFvQixNQUF5QjtRQUN6QyxrQkFBa0I7UUFDbEIsTUFBTSxDQUFtQjtZQUNyQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsVUFBVSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ3ZCLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUNsQyxRQUFRLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztZQUN0QyxRQUFRLEVBQUUsc0JBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDbkQsSUFBSSxFQUFFLG9DQUFZLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztTQUN4RCxDQUFDO0lBQ04sQ0FBQztJQUVPLDRDQUFXLEdBQW5CLFVBQW9CLGNBQW9DO1FBQ3BELE1BQU0sQ0FBQyxzREFBK0MsdUJBQVcsc0JBQWlCLG9DQUFZLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQyxjQUFVLENBQUM7SUFDekosQ0FBQztJQUNMLDZCQUFDO0FBQUQsQ0FBQyxBQXBDRCxDQUFxQywrQkFBYyxHQW9DbEQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dG9jb21wbGV0ZSwgRmluZGVyLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVdvcmtzcGFjZUZpbmRlclByb3ZpZGVyLCBJV29ya3NwYWNlRmluZGVyU2VydmljZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgV29ya3NwYWNlU3ltYm9sUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IFN5bWJvbEluZm9ybWF0aW9uLCBTeW1ib2xLaW5kIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IHBhY2thZ2VOYW1lIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuaW1wb3J0IHsgZnJvbVBvc2l0aW9uLCBmcm9tVXJpIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuXHJcbkBjYXBhYmlsaXR5XHJcbmV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VTeW1ib2xzUHJvdG9jb2wgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfZmluZGVyU2VydmljZTogSVdvcmtzcGFjZUZpbmRlclNlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSVdvcmtzcGFjZUZpbmRlclNlcnZpY2UpIGZpbmRlclNlcnZpY2U6IElXb3Jrc3BhY2VGaW5kZXJTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9maW5kZXJTZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuICAgICAgICBpZiAoIWNsaWVudC5jYXBhYmlsaXRpZXMud29ya3NwYWNlU3ltYm9sUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHRyaWdnZXIgY2hhcmFjdGVyc1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgV29ya3NwYWNlRmluZGVyU2VydmljZShjbGllbnQpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgIHRoaXMuX2ZpbmRlclNlcnZpY2UucmVnaXN0ZXJQcm92aWRlcihzZXJ2aWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgV29ya3NwYWNlRmluZGVyU2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSVdvcmtzcGFjZUZpbmRlclByb3ZpZGVyIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG5cclxuICAgICAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmZpbHRlciA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gZmlsdGVyXHJcbiAgICAgICAgICAgIC5hc09ic2VydmFibGUoKVxyXG4gICAgICAgICAgICAuc3dpdGNoTWFwKHF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoV29ya3NwYWNlU3ltYm9sUmVxdWVzdC50eXBlLCB7IHF1ZXJ5IH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAubWFwKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3VsdHMsIHN5bWJvbCA9PiB0aGlzLl9tYWtlU3ltYm9sKHN5bWJvbCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzdWx0czogT2JzZXJ2YWJsZTxGaW5kZXIuSVJlc3BvbnNlW10+O1xyXG4gICAgcHVibGljIGZpbHRlcjogT2JzZXJ2ZXI8c3RyaW5nPjtcclxuXHJcbiAgICBwcml2YXRlIF9tYWtlU3ltYm9sKHN5bWJvbDogU3ltYm9sSW5mb3JtYXRpb24pOiBGaW5kZXIuSVJlc3BvbnNlIHtcclxuICAgICAgICAvLyBUT0RPOiBJY29uIGh0bWxcclxuICAgICAgICByZXR1cm4gPEZpbmRlci5JUmVzcG9uc2U+e1xyXG4gICAgICAgICAgICBuYW1lOiBzeW1ib2wubmFtZSxcclxuICAgICAgICAgICAgZmlsdGVyVGV4dDogc3ltYm9sLm5hbWUsXHJcbiAgICAgICAgICAgIGljb25IVE1MOiB0aGlzLl9yZW5kZXJJY29uKHN5bWJvbCksXHJcbiAgICAgICAgICAgIGZpbGVQYXRoOiBmcm9tVXJpKHN5bWJvbC5sb2NhdGlvbi51cmkpLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogZnJvbVBvc2l0aW9uKHN5bWJvbC5sb2NhdGlvbi5yYW5nZS5zdGFydCksXHJcbiAgICAgICAgICAgIHR5cGU6IEF1dG9jb21wbGV0ZS5nZXRUeXBlRnJvbVN5bWJvbEtpbmQoc3ltYm9sLmtpbmQpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJJY29uKGNvbXBsZXRpb25JdGVtOiB7IGtpbmQ6IFN5bWJvbEtpbmQgfSkge1xyXG4gICAgICAgIHJldHVybiBgPGltZyBoZWlnaHQ9XCIxNnB4XCIgd2lkdGg9XCIxNnB4XCIgc3JjPVwiYXRvbTovLyR7cGFja2FnZU5hbWV9L3N0eWxlcy9pY29ucy8ke0F1dG9jb21wbGV0ZS5nZXRJY29uRnJvbVN5bWJvbEtpbmQoY29tcGxldGlvbkl0ZW0ua2luZCEpfS5zdmdcIiAvPmA7XHJcbiAgICB9XHJcbn1cclxuIl19