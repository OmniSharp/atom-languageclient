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
var FormatProtocol = (function (_super) {
    __extends(FormatProtocol, _super);
    function FormatProtocol(client, finderService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._FormatService = finderService;
        this._syncExpression = syncExpression;
        if (this._client.capabilities.documentFormattingProvider) {
            var service = new FormatDocumentProvider(client, syncExpression);
            this._disposable.add(service);
            this._FormatService.registerProvider(service);
        }
        if (this._client.capabilities.documentRangeFormattingProvider) {
            var service = new FormatRangeProvider(client, syncExpression);
            this._disposable.add(service);
            this._FormatService.registerProvider(service);
        }
        // TODO: Handle trigger characters
    }
    FormatProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.documentFormattingProvider || !!capabilities.documentRangeFormattingProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.IFormatService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], FormatProtocol);
    return FormatProtocol;
}(ts_disposables_1.DisposableBase));
exports.FormatProtocol = FormatProtocol;
var FormatRangeProvider = (function (_super) {
    __extends(FormatRangeProvider, _super);
    function FormatRangeProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    FormatRangeProvider.prototype.request = function (options) {
        if (!atom_languageservices_1.Format.formatHasRange(options)) {
            return rxjs_1.Observable.empty();
        }
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        var params = {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            range: convert_1.toRange(options.range),
            options: {
                // TODO...
                insertSpaces: true,
                tabSize: 4
            }
        };
        return this._client.sendRequest(protocol_1.DocumentRangeFormattingRequest.type, params)
            .map(convert_1.fromTextEdits);
    };
    return FormatRangeProvider;
}(ts_disposables_1.DisposableBase));
var FormatDocumentProvider = (function (_super) {
    __extends(FormatDocumentProvider, _super);
    function FormatDocumentProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
    }
    FormatDocumentProvider.prototype.request = function (options) {
        if (atom_languageservices_1.Format.formatHasRange(options)) {
            return rxjs_1.Observable.empty();
        }
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        var params = {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(options.editor.getURI())),
            options: {
                // TODO...
                insertSpaces: true,
                tabSize: 4
            }
        };
        return this._client.sendRequest(protocol_1.DocumentFormattingRequest.type, params)
            .map(convert_1.fromTextEdits);
    };
    return FormatDocumentProvider;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9ybWF0UHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0Zvcm1hdFByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQXdHLHVCQUF1QixDQUFDLENBQUE7QUFDaEksMkJBQW1DLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUseUJBQTBFLGdDQUFnQyxDQUFDLENBQUE7QUFDM0csc0JBQWdHLDZCQUE2QixDQUFDLENBQUE7QUFDOUgsSUFBWSxLQUFLLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFDbEMsK0JBQStCLGdCQUFnQixDQUFDLENBQUE7QUFDaEQsd0JBQXVDLGlCQUFpQixDQUFDLENBQUE7QUFHekQ7SUFBb0Msa0NBQWM7SUFJOUMsd0JBQ3FDLE1BQStCLEVBQ3hDLGFBQTZCLEVBQzVCLGNBQStCO1FBRXhELGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUV0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBTSxPQUFPLEdBQUcsSUFBSSxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsK0JB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SUFBTSxNQUFNLEdBQTZCO1lBQ3JDLFlBQVksRUFBRSw4QkFBc0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMzRSxPQUFPLEVBQUU7Z0JBQ0wsVUFBVTtnQkFDVixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsT0FBTyxFQUFFLENBQUM7YUFDYjtTQUNKLENBQUM7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsb0NBQXlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUNsRSxHQUFHLENBQUMsdUJBQWEsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFDTCw2QkFBQztBQUFELENBQUMsQUE5QkQsQ0FBcUMsK0JBQWMsR0E4QmxEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBGb3JtYXQsIElGb3JtYXRQcm92aWRlciwgSUZvcm1hdFNlcnZpY2UsIElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBJU3luY0V4cHJlc3Npb24sIFRleHQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjYXBhYmlsaXR5LCBpbmplY3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IERvY3VtZW50Rm9ybWF0dGluZ1JlcXVlc3QsIERvY3VtZW50UmFuZ2VGb3JtYXR0aW5nUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IERvY3VtZW50Rm9ybWF0dGluZ1BhcmFtcywgRG9jdW1lbnRSYW5nZUZvcm1hdHRpbmdQYXJhbXMsIFRleHREb2N1bWVudElkZW50aWZpZXIgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvdHlwZXMnO1xyXG5pbXBvcnQgKiBhcyB0b1VyaSBmcm9tICdmaWxlLXVybCc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBmcm9tVGV4dEVkaXRzLCB0b1JhbmdlIH0gZnJvbSAnLi91dGlscy9jb252ZXJ0JztcclxuXHJcbkBjYXBhYmlsaXR5KChjYXBhYmlsaXRpZXMpID0+ICEhY2FwYWJpbGl0aWVzLmRvY3VtZW50Rm9ybWF0dGluZ1Byb3ZpZGVyIHx8ICEhY2FwYWJpbGl0aWVzLmRvY3VtZW50UmFuZ2VGb3JtYXR0aW5nUHJvdmlkZXIpXHJcbmV4cG9ydCBjbGFzcyBGb3JtYXRQcm90b2NvbCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHJpdmF0ZSBfRm9ybWF0U2VydmljZTogSUZvcm1hdFNlcnZpY2U7XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSUZvcm1hdFNlcnZpY2UpIGZpbmRlclNlcnZpY2U6IElGb3JtYXRTZXJ2aWNlLFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9Gb3JtYXRTZXJ2aWNlID0gZmluZGVyU2VydmljZTtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fY2xpZW50LmNhcGFiaWxpdGllcy5kb2N1bWVudEZvcm1hdHRpbmdQcm92aWRlcikge1xyXG4gICAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IEZvcm1hdERvY3VtZW50UHJvdmlkZXIoY2xpZW50LCBzeW5jRXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKHNlcnZpY2UpO1xyXG4gICAgICAgICAgICB0aGlzLl9Gb3JtYXRTZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9jbGllbnQuY2FwYWJpbGl0aWVzLmRvY3VtZW50UmFuZ2VGb3JtYXR0aW5nUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VydmljZSA9IG5ldyBGb3JtYXRSYW5nZVByb3ZpZGVyKGNsaWVudCwgc3luY0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICAgICAgdGhpcy5fRm9ybWF0U2VydmljZS5yZWdpc3RlclByb3ZpZGVyKHNlcnZpY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdHJpZ2dlciBjaGFyYWN0ZXJzXHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEZvcm1hdFJhbmdlUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElGb3JtYXRQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdChvcHRpb25zOiBGb3JtYXQuSVJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoIUZvcm1hdC5mb3JtYXRIYXNSYW5nZShvcHRpb25zKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxUZXh0LklGaWxlQ2hhbmdlW10+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKG9wdGlvbnMuZWRpdG9yKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxUZXh0LklGaWxlQ2hhbmdlW10+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IERvY3VtZW50UmFuZ2VGb3JtYXR0aW5nUGFyYW1zID0ge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKG9wdGlvbnMuZWRpdG9yLmdldFVSSSgpKSksXHJcbiAgICAgICAgICAgIHJhbmdlOiB0b1JhbmdlKG9wdGlvbnMucmFuZ2UpLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPLi4uXHJcbiAgICAgICAgICAgICAgICBpbnNlcnRTcGFjZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0YWJTaXplOiA0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50LnNlbmRSZXF1ZXN0KERvY3VtZW50UmFuZ2VGb3JtYXR0aW5nUmVxdWVzdC50eXBlLCBwYXJhbXMpXHJcbiAgICAgICAgICAgIC5tYXAoZnJvbVRleHRFZGl0cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEZvcm1hdERvY3VtZW50UHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElGb3JtYXRQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdChvcHRpb25zOiBGb3JtYXQuSVJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoRm9ybWF0LmZvcm1hdEhhc1JhbmdlKG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmVtcHR5PFRleHQuSUZpbGVDaGFuZ2VbXT4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fc3luY0V4cHJlc3Npb24uZXZhbHVhdGUob3B0aW9ucy5lZGl0b3IpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmVtcHR5PFRleHQuSUZpbGVDaGFuZ2VbXT4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtczogRG9jdW1lbnRGb3JtYXR0aW5nUGFyYW1zID0ge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKG9wdGlvbnMuZWRpdG9yLmdldFVSSSgpKSksXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE8uLi5cclxuICAgICAgICAgICAgICAgIGluc2VydFNwYWNlczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRhYlNpemU6IDRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoRG9jdW1lbnRGb3JtYXR0aW5nUmVxdWVzdC50eXBlLCBwYXJhbXMpXHJcbiAgICAgICAgICAgIC5tYXAoZnJvbVRleHRFZGl0cyk7XHJcbiAgICB9XHJcbn1cclxuIl19