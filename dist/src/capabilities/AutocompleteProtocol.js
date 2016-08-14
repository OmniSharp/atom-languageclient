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
var _snippetRegex = /{{(.*?)}}/;
/* tslint:disable-next-line:no-any */
function isCompletionList(item) {
    return item && item.items;
}
var AutocompleteProtocol = (function (_super) {
    __extends(AutocompleteProtocol, _super);
    function AutocompleteProtocol(client, syncExpression, autocompleteService) {
        _super.call(this);
        this._client = client;
        this._autocompleteService = autocompleteService;
        this._syncExpression = syncExpression;
        // TODO: Handle trigger characters
        var service = new AutocompleteService(client, this._syncExpression, client.capabilities.completionProvider);
        this._disposable.add(service);
        this._autocompleteService.registerProvider(service);
    }
    AutocompleteProtocol = __decorate([
        decorators_1.capability(function (capabilities) { return !!capabilities.completionProvider; }),
        __param(0, decorators_1.inject(atom_languageservices_1.ILanguageProtocolClient)),
        __param(1, decorators_1.inject(atom_languageservices_1.ISyncExpression)),
        __param(2, decorators_1.inject(atom_languageservices_1.IAutocompleteService)), 
        __metadata('design:paramtypes', [Object, Object, Object])
    ], AutocompleteProtocol);
    return AutocompleteProtocol;
}(ts_disposables_1.DisposableBase));
exports.AutocompleteProtocol = AutocompleteProtocol;
var AutocompleteService = (function (_super) {
    __extends(AutocompleteService, _super);
    function AutocompleteService(client, syncExpression, options) {
        _super.call(this);
        this._client = client;
        this._options = options;
        this._syncExpression = syncExpression;
    }
    AutocompleteService.prototype.request = function (options) {
        var _this = this;
        if (!this._syncExpression.evaluate(options.editor)) {
            return rxjs_1.Observable.empty();
        }
        var editor = options.editor, bufferPosition = options.bufferPosition;
        var params = {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(editor.getURI())),
            position: types_1.Position.create(bufferPosition.row, bufferPosition.column)
        };
        return this._client.sendRequest(protocol_1.CompletionRequest.type, params)
            .map(function (response) {
            var items;
            if (isCompletionList(response)) {
                // TODO: How to merge incomplete?
                items = response.items;
            }
            else {
                items = response;
            }
            return _.map(items, function (item) { return _this._makeSuggestion(item, options); });
        });
    };
    AutocompleteService.prototype._makeSuggestion = function (completionItem, options) {
        var replacementPrefix = options.prefix;
        var hasSnippetLocation = false;
        var snippet;
        var text = completionItem.insertText || completionItem.label;
        if (completionItem.textEdit) {
            var _a = completionItem.textEdit, range = _a.range, newText = _a.newText;
            replacementPrefix = options.editor.getTextInRange([[range.start.line, range.start.character], [range.end.line, range.end.character]]);
            if (_snippetRegex.test(newText)) {
                hasSnippetLocation = true;
                snippet = newText;
            }
            else {
                text = newText;
            }
        }
        else if (completionItem.insertText) {
            if (_snippetRegex.test(completionItem.insertText)) {
                hasSnippetLocation = true;
                snippet = completionItem.insertText;
            }
            else {
                text = completionItem.insertText;
            }
        }
        var base = {
            displayText: completionItem.label,
            iconHTML: this._renderIcon(completionItem),
            filterText: completionItem.filterText || completionItem.label,
            type: atom_languageservices_1.Autocomplete.getTypeFromCompletionItemKind(completionItem.kind),
            description: completionItem.detail,
            descriptionMoreURL: completionItem.documentation,
            className: "autocomplete-" + constants_1.packageName
        };
        if (snippet) {
            snippet = snippet.replace(_snippetRegex, function (substring, value) {
                if (value) {
                    return "${1:" + value + "}";
                }
                else {
                    return "$1";
                }
            });
            snippet += '$2';
            return _.assign(base, {
                completionItem: completionItem,
                replacementPrefix: replacementPrefix,
                snippet: snippet
            });
        }
        else {
            return _.assign(base, {
                completionItem: completionItem,
                replacementPrefix: replacementPrefix,
                text: text
            });
        }
    };
    AutocompleteService.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromCompletionItemKind(completionItem.kind) + ".svg\" />";
    };
    return AutocompleteService;
}(ts_disposables_1.DisposableBase));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b2NvbXBsZXRlUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0F1dG9jb21wbGV0ZVByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsc0NBQW9ILHVCQUF1QixDQUFDLENBQUE7QUFDNUksMkJBQW1DLGtDQUFrQyxDQUFDLENBQUE7QUFDdEUseUJBQWtDLGdDQUFnQyxDQUFDLENBQUE7QUFDbkUsc0JBQWdJLDZCQUE2QixDQUFDLENBQUE7QUFDOUosSUFBWSxLQUFLLFdBQU0sVUFBVSxDQUFDLENBQUE7QUFDbEMsK0JBQStCLGdCQUFnQixDQUFDLENBQUE7QUFDaEQsMEJBQTRCLGNBQWMsQ0FBQyxDQUFBO0FBRTNDLElBQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQztBQUVsQyxxQ0FBcUM7QUFDckMsMEJBQTBCLElBQVM7SUFDL0IsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzlCLENBQUM7QUFHRDtJQUEwQyx3Q0FBYztJQUlwRCw4QkFDcUMsTUFBK0IsRUFDdkMsY0FBK0IsRUFDMUIsbUJBQXlDO1FBRXZFLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsbUJBQW1CLENBQUM7UUFDaEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7UUFFdEMsa0NBQWtDO1FBQ2xDLElBQU0sT0FBTyxHQUFHLElBQUksbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxrQkFBbUIsQ0FBQyxDQUFDO1FBQy9HLElBQUksQ0FBQyxX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QzNDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ1YsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFVBQUMsU0FBaUIsRUFBRSxLQUFhO2dCQUN0RSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNSLE1BQU0sQ0FBQyxTQUFRLEtBQUssTUFBRyxDQUFDO2dCQUM1QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sQ0FBQyxJQUFLLENBQUM7Z0JBQ2pCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxJQUFJLENBQUM7WUFDaEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNsQiw4QkFBYztnQkFDZCxvQ0FBaUI7Z0JBQ2pCLGdCQUFPO2FBQ1YsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNsQiw4QkFBYztnQkFDZCxvQ0FBaUI7Z0JBQ2pCLFVBQUk7YUFDUCxDQUFDLENBQUM7UUFDUCxDQUFDO0lBQ0wsQ0FBQztJQUVPLHlDQUFXLEdBQW5CLFVBQW9CLGNBQThCO1FBQzlDLE1BQU0sQ0FBQyxzREFBK0MsdUJBQVcsc0JBQWlCLG9DQUFZLENBQUMsNkJBQTZCLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQyxjQUFVLENBQUM7SUFDakssQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0FBQyxBQS9GRCxDQUFrQywrQkFBYyxHQStGL0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQXV0b2NvbXBsZXRlLCBJQXV0b2NvbXBsZXRlUHJvdmlkZXIsIElBdXRvY29tcGxldGVTZXJ2aWNlLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVN5bmNFeHByZXNzaW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBDb21wbGV0aW9uUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IENvbXBsZXRpb25JdGVtLCBDb21wbGV0aW9uTGlzdCwgQ29tcGxldGlvbk9wdGlvbnMsIFBvc2l0aW9uLCBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLCBUZXh0RG9jdW1lbnRQb3NpdGlvblBhcmFtcyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IHBhY2thZ2VOYW1lIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuXHJcbmNvbnN0IF9zbmlwcGV0UmVnZXggPSAve3soLio/KX19LztcclxuXHJcbi8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuZnVuY3Rpb24gaXNDb21wbGV0aW9uTGlzdChpdGVtOiBhbnkpOiBpdGVtIGlzIENvbXBsZXRpb25MaXN0IHtcclxuICAgIHJldHVybiBpdGVtICYmIGl0ZW0uaXRlbXM7XHJcbn1cclxuXHJcbkBjYXBhYmlsaXR5KChjYXBhYmlsaXRpZXMpID0+ICEhY2FwYWJpbGl0aWVzLmNvbXBsZXRpb25Qcm92aWRlcilcclxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZVByb3RvY29sIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX2F1dG9jb21wbGV0ZVNlcnZpY2U6IElBdXRvY29tcGxldGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBpbmplY3QoSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQpIGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsXHJcbiAgICAgICAgQGluamVjdChJU3luY0V4cHJlc3Npb24pIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24sXHJcbiAgICAgICAgQGluamVjdChJQXV0b2NvbXBsZXRlU2VydmljZSkgYXV0b2NvbXBsZXRlU2VydmljZTogSUF1dG9jb21wbGV0ZVNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX2F1dG9jb21wbGV0ZVNlcnZpY2UgPSBhdXRvY29tcGxldGVTZXJ2aWNlO1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSB0cmlnZ2VyIGNoYXJhY3RlcnNcclxuICAgICAgICBjb25zdCBzZXJ2aWNlID0gbmV3IEF1dG9jb21wbGV0ZVNlcnZpY2UoY2xpZW50LCB0aGlzLl9zeW5jRXhwcmVzc2lvbiwgY2xpZW50LmNhcGFiaWxpdGllcy5jb21wbGV0aW9uUHJvdmlkZXIhKTtcclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChzZXJ2aWNlKTtcclxuICAgICAgICB0aGlzLl9hdXRvY29tcGxldGVTZXJ2aWNlLnJlZ2lzdGVyUHJvdmlkZXIoc2VydmljZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEF1dG9jb21wbGV0ZVNlcnZpY2UgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElBdXRvY29tcGxldGVQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9jbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50O1xyXG4gICAgcHJpdmF0ZSBfb3B0aW9uczogQ29tcGxldGlvbk9wdGlvbnM7XHJcbiAgICBwcml2YXRlIF9zeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQsIHN5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb24sIG9wdGlvbnM6IENvbXBsZXRpb25PcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5fc3luY0V4cHJlc3Npb24gPSBzeW5jRXhwcmVzc2lvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdChvcHRpb25zOiBBdXRvY29tcGxldGUuSVJlcXVlc3QpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N5bmNFeHByZXNzaW9uLmV2YWx1YXRlKG9wdGlvbnMuZWRpdG9yKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbltdPigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbn0gPSBvcHRpb25zO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IFRleHREb2N1bWVudFBvc2l0aW9uUGFyYW1zID0ge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKGVkaXRvci5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogUG9zaXRpb24uY3JlYXRlKGJ1ZmZlclBvc2l0aW9uLnJvdywgYnVmZmVyUG9zaXRpb24uY29sdW1uKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoQ29tcGxldGlvblJlcXVlc3QudHlwZSwgcGFyYW1zKVxyXG4gICAgICAgICAgICAubWFwKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtczogQ29tcGxldGlvbkl0ZW1bXTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0NvbXBsZXRpb25MaXN0KHJlc3BvbnNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IEhvdyB0byBtZXJnZSBpbmNvbXBsZXRlP1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gcmVzcG9uc2UuaXRlbXM7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF8ubWFwKGl0ZW1zLCBpdGVtID0+IHRoaXMuX21ha2VTdWdnZXN0aW9uKGl0ZW0sIG9wdGlvbnMpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbWFrZVN1Z2dlc3Rpb24oY29tcGxldGlvbkl0ZW06IENvbXBsZXRpb25JdGVtLCBvcHRpb25zOiBBdXRvY29tcGxldGUuSVJlcXVlc3QpOiBBdXRvY29tcGxldGUuU3VnZ2VzdGlvbiB7XHJcbiAgICAgICAgbGV0IHJlcGxhY2VtZW50UHJlZml4OiBzdHJpbmcgPSBvcHRpb25zLnByZWZpeDtcclxuICAgICAgICBsZXQgaGFzU25pcHBldExvY2F0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IHNuaXBwZXQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQgdGV4dDogc3RyaW5nID0gY29tcGxldGlvbkl0ZW0uaW5zZXJ0VGV4dCB8fCBjb21wbGV0aW9uSXRlbS5sYWJlbDtcclxuICAgICAgICBpZiAoY29tcGxldGlvbkl0ZW0udGV4dEVkaXQpIHtcclxuICAgICAgICAgICAgY29uc3Qge3JhbmdlLCBuZXdUZXh0fSA9IGNvbXBsZXRpb25JdGVtLnRleHRFZGl0O1xyXG4gICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeCA9IG9wdGlvbnMuZWRpdG9yLmdldFRleHRJblJhbmdlKFtbcmFuZ2Uuc3RhcnQubGluZSwgcmFuZ2Uuc3RhcnQuY2hhcmFjdGVyXSwgW3JhbmdlLmVuZC5saW5lLCByYW5nZS5lbmQuY2hhcmFjdGVyXV0pO1xyXG4gICAgICAgICAgICBpZiAoX3NuaXBwZXRSZWdleC50ZXN0KG5ld1RleHQpKSB7XHJcbiAgICAgICAgICAgICAgICBoYXNTbmlwcGV0TG9jYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc25pcHBldCA9IG5ld1RleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gbmV3VGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY29tcGxldGlvbkl0ZW0uaW5zZXJ0VGV4dCkge1xyXG4gICAgICAgICAgICBpZiAoX3NuaXBwZXRSZWdleC50ZXN0KGNvbXBsZXRpb25JdGVtLmluc2VydFRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICBoYXNTbmlwcGV0TG9jYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc25pcHBldCA9IGNvbXBsZXRpb25JdGVtLmluc2VydFRleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gY29tcGxldGlvbkl0ZW0uaW5zZXJ0VGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYmFzZSA9IHtcclxuICAgICAgICAgICAgZGlzcGxheVRleHQ6IGNvbXBsZXRpb25JdGVtLmxhYmVsLFxyXG4gICAgICAgICAgICBpY29uSFRNTDogdGhpcy5fcmVuZGVySWNvbihjb21wbGV0aW9uSXRlbSksXHJcbiAgICAgICAgICAgIGZpbHRlclRleHQ6IGNvbXBsZXRpb25JdGVtLmZpbHRlclRleHQgfHwgY29tcGxldGlvbkl0ZW0ubGFiZWwsXHJcbiAgICAgICAgICAgIHR5cGU6IEF1dG9jb21wbGV0ZS5nZXRUeXBlRnJvbUNvbXBsZXRpb25JdGVtS2luZChjb21wbGV0aW9uSXRlbS5raW5kISksXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjb21wbGV0aW9uSXRlbS5kZXRhaWwsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogY29tcGxldGlvbkl0ZW0uZG9jdW1lbnRhdGlvbixcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiBgYXV0b2NvbXBsZXRlLSR7cGFja2FnZU5hbWV9YFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChzbmlwcGV0KSB7XHJcbiAgICAgICAgICAgIHNuaXBwZXQgPSBzbmlwcGV0LnJlcGxhY2UoX3NuaXBwZXRSZWdleCwgKHN1YnN0cmluZzogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYFxcJHsxOiR7dmFsdWV9fWA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgXFwkMWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzbmlwcGV0ICs9ICckMic7XHJcbiAgICAgICAgICAgIHJldHVybiBfLmFzc2lnbihiYXNlLCB7XHJcbiAgICAgICAgICAgICAgICBjb21wbGV0aW9uSXRlbSxcclxuICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4LFxyXG4gICAgICAgICAgICAgICAgc25pcHBldFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5hc3NpZ24oYmFzZSwge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGlvbkl0ZW0sXHJcbiAgICAgICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeCxcclxuICAgICAgICAgICAgICAgIHRleHRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlckljb24oY29tcGxldGlvbkl0ZW06IENvbXBsZXRpb25JdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIGA8aW1nIGhlaWdodD1cIjE2cHhcIiB3aWR0aD1cIjE2cHhcIiBzcmM9XCJhdG9tOi8vJHtwYWNrYWdlTmFtZX0vc3R5bGVzL2ljb25zLyR7QXV0b2NvbXBsZXRlLmdldEljb25Gcm9tQ29tcGxldGlvbkl0ZW1LaW5kKGNvbXBsZXRpb25JdGVtLmtpbmQhKX0uc3ZnXCIgLz5gO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==