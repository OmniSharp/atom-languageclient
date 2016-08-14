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
var ImplementationProtocol = (function (_super) {
    __extends(ImplementationProtocol, _super);
    function ImplementationProtocol(client, implementationService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
        this._implementationService = implementationService;
        var service = new LanguageProtocolImplementationProvider(this._client, this._syncExpression);
        this._disposable.add(service, this._implementationService.registerProvider(service));
    }
    ImplementationProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.extended.implementationProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IImplementationService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], ImplementationProtocol);
    return ImplementationProtocol;
}(ts_disposables_1.DisposableBase));
exports.ImplementationProtocol = ImplementationProtocol;
var LanguageProtocolImplementationProvider = (function (_super) {
    __extends(LanguageProtocolImplementationProvider, _super);
    function LanguageProtocolImplementationProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    LanguageProtocolImplementationProvider.prototype.request = function (options) {
        if (!this._syncExpression.evaluate(options.editor)) {
            /* tslint:disable-next-line:no-any */
            return rxjs_1.Observable.empty();
        }
        var params = {
            textDocument: types_extended_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            position: types_extended_1.Position.create(options.location.row, options.location.column)
        };
        return this._client.sendRequest(protocol_extended_1.ImplementationRequest.type, params)
            .map(function (response) {
            if (_.isArray(response)) {
                return _.map(response, function (location) {
                    return {
                        filePath: convert_1.fromUri(location.uri),
                        range: convert_1.fromRange(location.range)
                    };
                });
            }
            else {
                return [{
                        filePath: convert_1.fromUri(response.uri),
                        range: convert_1.fromRange(response.range)
                    }];
            }
        });
    };
    return LanguageProtocolImplementationProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1wbGVtZW50YXRpb25Qcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYXBhYmlsaXRpZXMvSW1wbGVtZW50YXRpb25Qcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUEwSCx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xKLDJCQUFtQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3RFLGtDQUFzQyx5Q0FBeUMsQ0FBQyxDQUFBO0FBQ2hGLCtCQUE2RSxzQ0FBc0MsQ0FBQyxDQUFBO0FBQ3BILElBQVksS0FBSyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELHdCQUFtQyxpQkFBaUIsQ0FBQyxDQUFBO0FBR3JEO0lBQTRDLDBDQUFjO0lBSXRELGdDQUNxQyxNQUErQixFQUNoQyxxQkFBNkMsRUFDcEQsY0FBK0I7UUFFeEQsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxxQkFBcUIsQ0FBQztRQUVwRCxJQUFNLE9BQU8sR0FBRyxJQUFJLHNDQUFzQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQy9GLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQixPQUFPLEVBQ1AsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUN4RCxDQUFDO0lBQ04sQ0FBQztJQXBCTDtRQUFDLHVCQUFVLENBQUMsVUFBQyxZQUFZLElBQUssT0FBQSxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBOUMsQ0FBOEMsQ0FBQzttQkFNcEUsbUJBQU0sQ0FBQywrQ0FBdUIsQ0FBQzttQkFDL0IsbUJBQU0sQ0FBQyw4Q0FBc0IsQ0FBQzttQkFDOUIsbUJBQU0sQ0FBQyx1Q0FBZSxDQUFDOzs4QkFSNkM7SUFxQjdFLDZCQUFDO0FBQUQsQ0FBQyxBQXBCRCxDQUE0QywrQkFBYyxHQW9CekQ7QUFwQlksOEJBQXNCLHlCQW9CbEMsQ0FBQTtBQUVEO0lBQXFELDBEQUFjO0lBRy9ELGdEQUNJLE1BQStCLEVBQy9CLGNBQStCO1FBQy9CLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sd0RBQU8sR0FBZCxVQUFlLE9BQWdDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLGlCQUFVLENBQUMsS0FBSyxFQUFPLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQU0sTUFBTSxHQUErQjtZQUN2QyxZQUFZLEVBQUUsdUNBQXNCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDNUUsUUFBUSxFQUFFLHlCQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1NBQzNFLENBQUM7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMseUNBQXFCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUM5RCxHQUFHLENBQUMsVUFBQSxRQUFRO1lBQ1QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxVQUFBLFFBQVE7b0JBQzNCLE1BQU0sQ0FBQzt3QkFDSCxRQUFRLEVBQUUsaUJBQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO3dCQUMvQixLQUFLLEVBQUUsbUJBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO3FCQUNuQyxDQUFDO2dCQUNOLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxDQUFDO3dCQUNKLFFBQVEsRUFBRSxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7d0JBQy9CLEtBQUssRUFBRSxtQkFBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7cUJBQ25DLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDTCw2Q0FBQztBQUFELENBQUMsQUF0Q0QsQ0FBcUQsK0JBQWMsR0FzQ2xFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElJbXBsZW1lbnRhdGlvblByb3ZpZGVyLCBJSW1wbGVtZW50YXRpb25TZXJ2aWNlLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVN5bmNFeHByZXNzaW9uLCBJbXBsZW1lbnRhdGlvbiB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNhcGFiaWxpdHksIGluamVjdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgSW1wbGVtZW50YXRpb25SZXF1ZXN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3Byb3RvY29sLWV4dGVuZGVkJztcclxuaW1wb3J0IHsgUG9zaXRpb24sIFRleHREb2N1bWVudElkZW50aWZpZXIsIFRleHREb2N1bWVudFBvc2l0aW9uUGFyYW1zIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL3R5cGVzLWV4dGVuZGVkJztcclxuaW1wb3J0ICogYXMgdG9VcmkgZnJvbSAnZmlsZS11cmwnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgZnJvbVJhbmdlLCBmcm9tVXJpIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuXHJcbkBjYXBhYmlsaXR5KChjYXBhYmlsaXRpZXMpID0+ICEhY2FwYWJpbGl0aWVzLmV4dGVuZGVkLmltcGxlbWVudGF0aW9uUHJvdmlkZXIpXHJcbmV4cG9ydCBjbGFzcyBJbXBsZW1lbnRhdGlvblByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9pbXBsZW1lbnRhdGlvblNlcnZpY2U6IElJbXBsZW1lbnRhdGlvblNlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSUltcGxlbWVudGF0aW9uU2VydmljZSkgaW1wbGVtZW50YXRpb25TZXJ2aWNlOiBJSW1wbGVtZW50YXRpb25TZXJ2aWNlLFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMuX2ltcGxlbWVudGF0aW9uU2VydmljZSA9IGltcGxlbWVudGF0aW9uU2VydmljZTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBMYW5ndWFnZVByb3RvY29sSW1wbGVtZW50YXRpb25Qcm92aWRlcih0aGlzLl9jbGllbnQsIHRoaXMuX3N5bmNFeHByZXNzaW9uKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgc2VydmljZSxcclxuICAgICAgICAgICAgdGhpcy5faW1wbGVtZW50YXRpb25TZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBMYW5ndWFnZVByb3RvY29sSW1wbGVtZW50YXRpb25Qcm92aWRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSUltcGxlbWVudGF0aW9uUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IEltcGxlbWVudGF0aW9uLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxhbnk+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IFRleHREb2N1bWVudFBvc2l0aW9uUGFyYW1zID0ge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKG9wdGlvbnMuZWRpdG9yIS5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogUG9zaXRpb24uY3JlYXRlKG9wdGlvbnMubG9jYXRpb24ucm93LCBvcHRpb25zLmxvY2F0aW9uLmNvbHVtbilcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoSW1wbGVtZW50YXRpb25SZXF1ZXN0LnR5cGUsIHBhcmFtcylcclxuICAgICAgICAgICAgLm1hcChyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5pc0FycmF5KHJlc3BvbnNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChyZXNwb25zZSwgbG9jYXRpb24gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVBhdGg6IGZyb21VcmkobG9jYXRpb24udXJpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiBmcm9tUmFuZ2UobG9jYXRpb24ucmFuZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlUGF0aDogZnJvbVVyaShyZXNwb25zZS51cmkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogZnJvbVJhbmdlKHJlc3BvbnNlLnJhbmdlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=