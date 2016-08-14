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
var convert_1 = require('./utils/convert');
var CodeLensProtocol = (function (_super) {
    __extends(CodeLensProtocol, _super);
    function CodeLensProtocol(client, finderService, syncExpression) {
        _super.call(this);
        this._client = client;
        this._codeLensService = finderService;
        this._syncExpression = syncExpression;
        // TODO: Handle trigger characters
        var service = new CodeLensProvider(client, syncExpression);
        this._disposable.add(service);
        this._codeLensService.registerProvider(service);
    }
    CodeLensProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.codeLensProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.ICodeLensService)),
        __param(2, decorators_1.inject(atom_languageservices_1.ISyncExpression)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], CodeLensProtocol);
    return CodeLensProtocol;
}(ts_disposables_1.DisposableBase));
exports.CodeLensProtocol = CodeLensProtocol;
var CodeLensProvider = (function (_super) {
    __extends(CodeLensProvider, _super);
    function CodeLensProvider(client, syncExpression) {
        _super.call(this);
        this._client = client;
        this._syncExpression = syncExpression;
        if (this._client.capabilities.codeLensProvider.resolveProvider) {
            this._doResolve = !!this._client.capabilities.codeLensProvider.resolveProvider;
        }
    }
    CodeLensProvider.prototype.request = function (options) {
        var _this = this;
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        return this._client.sendRequest(protocol_1.CodeLensRequest.type, {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(options.editor.getURI()))
        }).map(function (results) {
            return _.map(results, _.bind(_this._createResponse, _this));
        });
    };
    CodeLensProvider.prototype._createResponse = function (context) {
        var _this = this;
        return new CodeLensResponse(context, function (value) { return _this.resolve(value); });
    };
    CodeLensProvider.prototype.resolve = function (codeLens) {
        if (!this._doResolve) {
            return rxjs_1.Observable.of(codeLens);
        }
        return this._client.sendRequest(protocol_1.CodeLensResolveRequest.type, {
            command: codeLens.command,
            data: codeLens.data,
            range: convert_1.toRange(codeLens.range)
        }).map(function (result) {
            codeLens.command = result.command;
            codeLens.data = result.data;
            return codeLens;
        });
    };
    return CodeLensProvider;
}(ts_disposables_1.DisposableBase));
var CodeLensResponse = (function () {
    function CodeLensResponse(context, resolve) {
        this._resolved = false;
        this.command = context.command;
        this.data = context.data;
        this.range = convert_1.fromRange(context.range);
        this._resolve = resolve;
    }
    CodeLensResponse.prototype.resolve = function () {
        var _this = this;
        if (this._resolved) {
            return rxjs_1.Observable.of(this);
        }
        return this._resolve(this)
            .do(function () { _this._resolved = true; });
    };
    return CodeLensResponse;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUxlbnNQcm90b2NvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jYXBhYmlsaXRpZXMvQ29kZUxlbnNQcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUF3Ryx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2hJLDJCQUFtQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3RFLHlCQUF3RCxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3pGLHNCQUE0RSw2QkFBNkIsQ0FBQyxDQUFBO0FBQzFHLElBQVksS0FBSyxXQUFNLFVBQVUsQ0FBQyxDQUFBO0FBQ2xDLCtCQUErQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hELHdCQUFtQyxpQkFBaUIsQ0FBQyxDQUFBO0FBR3JEO0lBQXNDLG9DQUFjO0lBSWhELDBCQUNxQyxNQUErQixFQUN0QyxhQUErQixFQUNoQyxjQUErQjtRQUV4RCxpQkFBTyxDQUFDO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUV0QyxrQ0FBa0M7UUFDbEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFuQkw7UUFBQyx1QkFBVSxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0Is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QztRQUd0QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsbUJBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQU1NLGtDQUFPLEdBQWQ7UUFBQSxpQkFNQztRQUxHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxpQkFBVSxDQUFDLEVBQUUsQ0FBcUIsSUFBSSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzthQUNyQixFQUFFLENBQUMsY0FBUSxLQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDTCx1QkFBQztBQUFELENBQUMsQUFyQkQsSUFxQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ29kZUxlbnMsIElDb2RlTGVuc1Byb3ZpZGVyLCBJQ29kZUxlbnNTZXJ2aWNlLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVN5bmNFeHByZXNzaW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBDb2RlTGVuc1JlcXVlc3QsIENvZGVMZW5zUmVzb2x2ZVJlcXVlc3QgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvcHJvdG9jb2wnO1xyXG5pbXBvcnQgeyBDb2RlTGVucyBhcyBUQ29kZUxlbnMsIE1hcmtlZFN0cmluZywgVGV4dERvY3VtZW50SWRlbnRpZmllciB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGZyb21SYW5nZSwgdG9SYW5nZSB9IGZyb20gJy4vdXRpbHMvY29udmVydCc7XHJcblxyXG5AY2FwYWJpbGl0eSgoY2FwYWJpbGl0aWVzKSA9PiAhIWNhcGFiaWxpdGllcy5jb2RlTGVuc1Byb3ZpZGVyKVxyXG5leHBvcnQgY2xhc3MgQ29kZUxlbnNQcm90b2NvbCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHJpdmF0ZSBfY29kZUxlbnNTZXJ2aWNlOiBJQ29kZUxlbnNTZXJ2aWNlO1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgQGluamVjdChJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCkgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBAaW5qZWN0KElDb2RlTGVuc1NlcnZpY2UpIGZpbmRlclNlcnZpY2U6IElDb2RlTGVuc1NlcnZpY2UsXHJcbiAgICAgICAgQGluamVjdChJU3luY0V4cHJlc3Npb24pIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb25cclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX2NvZGVMZW5zU2VydmljZSA9IGZpbmRlclNlcnZpY2U7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHRyaWdnZXIgY2hhcmFjdGVyc1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgQ29kZUxlbnNQcm92aWRlcihjbGllbnQsIHN5bmNFeHByZXNzaW9uKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLl9jb2RlTGVuc1NlcnZpY2UucmVnaXN0ZXJQcm92aWRlcihzZXJ2aWNlKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ29kZUxlbnNQcm92aWRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSUNvZGVMZW5zUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBwcml2YXRlIF9kb1Jlc29sdmU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCxcclxuICAgICAgICBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NsaWVudC5jYXBhYmlsaXRpZXMuY29kZUxlbnNQcm92aWRlciEucmVzb2x2ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RvUmVzb2x2ZSA9ICEhdGhpcy5fY2xpZW50LmNhcGFiaWxpdGllcy5jb2RlTGVuc1Byb3ZpZGVyIS5yZXNvbHZlUHJvdmlkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IENvZGVMZW5zLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZW1wdHk8Q29kZUxlbnMuSVJlc3BvbnNlW10+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50LnNlbmRSZXF1ZXN0KENvZGVMZW5zUmVxdWVzdC50eXBlLCB7XHJcbiAgICAgICAgICAgIHRleHREb2N1bWVudDogVGV4dERvY3VtZW50SWRlbnRpZmllci5jcmVhdGUodG9Vcmkob3B0aW9ucy5lZGl0b3IuZ2V0VVJJKCkpKVxyXG4gICAgICAgIH0pLm1hcChyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHJlc3VsdHMsIF8uYmluZCh0aGlzLl9jcmVhdGVSZXNwb25zZSwgdGhpcykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZVJlc3BvbnNlKGNvbnRleHQ6IFRDb2RlTGVucykge1xyXG4gICAgICAgIHJldHVybiBuZXcgQ29kZUxlbnNSZXNwb25zZShjb250ZXh0LCAodmFsdWU6IENvZGVMZW5zUmVzcG9uc2UpID0+IHRoaXMucmVzb2x2ZSh2YWx1ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNvbHZlKGNvZGVMZW5zOiBDb2RlTGVucy5JUmVzcG9uc2UpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2RvUmVzb2x2ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZihjb2RlTGVucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2xpZW50LnNlbmRSZXF1ZXN0KENvZGVMZW5zUmVzb2x2ZVJlcXVlc3QudHlwZSwge1xyXG4gICAgICAgICAgICBjb21tYW5kOiBjb2RlTGVucy5jb21tYW5kLFxyXG4gICAgICAgICAgICBkYXRhOiBjb2RlTGVucy5kYXRhLFxyXG4gICAgICAgICAgICByYW5nZTogdG9SYW5nZShjb2RlTGVucy5yYW5nZSlcclxuICAgICAgICB9KS5tYXAocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgY29kZUxlbnMuY29tbWFuZCA9IHJlc3VsdC5jb21tYW5kO1xyXG4gICAgICAgICAgICBjb2RlTGVucy5kYXRhID0gcmVzdWx0LmRhdGE7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2RlTGVucztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQ29kZUxlbnNSZXNwb25zZSBpbXBsZW1lbnRzIENvZGVMZW5zLklSZXNwb25zZSB7XHJcbiAgICBwcml2YXRlIF9yZXNvbHZlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfcmVzb2x2ZTogKGNvbnRleHQ6IENvZGVMZW5zLklSZXNwb25zZSkgPT4gT2JzZXJ2YWJsZTxDb2RlTGVucy5JUmVzcG9uc2U+O1xyXG4gICAgY29uc3RydWN0b3IoY29udGV4dDogVENvZGVMZW5zLCByZXNvbHZlOiAoY29udGV4dDogQ29kZUxlbnMuSVJlc3BvbnNlKSA9PiBPYnNlcnZhYmxlPENvZGVMZW5zLklSZXNwb25zZT4pIHtcclxuICAgICAgICB0aGlzLmNvbW1hbmQgPSBjb250ZXh0LmNvbW1hbmQ7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gY29udGV4dC5kYXRhO1xyXG4gICAgICAgIHRoaXMucmFuZ2UgPSBmcm9tUmFuZ2UoY29udGV4dC5yYW5nZSk7XHJcbiAgICAgICAgdGhpcy5fcmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbW1hbmQ6IENvZGVMZW5zLklDb21tYW5kIHwgdW5kZWZpbmVkO1xyXG4gICAgcHVibGljIGRhdGE6IGFueTtcclxuICAgIHB1YmxpYyByYW5nZTogVGV4dEJ1ZmZlci5SYW5nZTtcclxuXHJcbiAgICBwdWJsaWMgcmVzb2x2ZSgpOiBPYnNlcnZhYmxlPENvZGVMZW5zLklSZXNwb25zZT4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZXNvbHZlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZjxDb2RlTGVucy5JUmVzcG9uc2U+KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZSh0aGlzKVxyXG4gICAgICAgICAgICAuZG8oKCkgPT4geyB0aGlzLl9yZXNvbHZlZCA9IHRydWU7IH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==