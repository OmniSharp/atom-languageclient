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
        if (!client.capabilities.completionProvider) {
            return;
        }
        // TODO: Handle trigger characters
        var service = new AutocompleteService(client, this._syncExpression, client.capabilities.completionProvider);
        this._disposable.add(service);
        this._autocompleteService.registerProvider(service);
    }
    AutocompleteProtocol = __decorate([
        decorators_1.capability,
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
            return;
        }
        var editor = options.editor, bufferPosition = options.bufferPosition;
        var params = {
            textDocument: types_1.TextDocumentIdentifier.create(toUri(editor.getURI())),
            position: types_1.Position.create(bufferPosition.row, bufferPosition.column)
        };
        return this._client.sendRequest(protocol_1.CompletionRequest.type, params)
            .then(function (response) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b2NvbXBsZXRlUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2FwYWJpbGl0aWVzL0F1dG9jb21wbGV0ZVByb3RvY29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixzQ0FBb0gsdUJBQXVCLENBQUMsQ0FBQTtBQUM1SSwyQkFBbUMsa0NBQWtDLENBQUMsQ0FBQTtBQUN0RSx5QkFBa0MsZ0NBQWdDLENBQUMsQ0FBQTtBQUNuRSxzQkFBZ0ksNkJBQTZCLENBQUMsQ0FBQTtBQUM5SixJQUFZLEtBQUssV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNsQywrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCwwQkFBNEIsY0FBYyxDQUFDLENBQUE7QUFFM0MsSUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDO0FBRWxDLHFDQUFxQztBQUNyQywwQkFBMEIsSUFBUztJQUMvQixNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDOUIsQ0FBQztBQUdEO0lBQTBDLHdDQUFjO0lBSXBELDhCQUNxQyxNQUErQixFQUN2QyxjQUErQixFQUMxQixtQkFBeUM7UUFFdkUsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxtQkFBbUIsQ0FBQztRQUNoRCxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxrQ0FBa0M7UUFDbEMsSUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFD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Q0FBQyxDQUFDLENBQUM7WUFDVixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBQyxTQUFpQixFQUFFLEtBQWE7Z0JBQ3RFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1IsTUFBTSxDQUFDLFNBQVEsS0FBSyxNQUFHLENBQUM7Z0JBQzVCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLElBQUssQ0FBQztnQkFDakIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxJQUFJLElBQUksQ0FBQztZQUNoQixNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xCLDhCQUFjO2dCQUNkLG9DQUFpQjtnQkFDakIsZ0JBQU87YUFDVixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2xCLDhCQUFjO2dCQUNkLG9DQUFpQjtnQkFDakIsVUFBSTthQUNQLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBRU8seUNBQVcsR0FBbkIsVUFBb0IsY0FBOEI7UUFDOUMsTUFBTSxDQUFDLHNEQUErQyx1QkFBVyxzQkFBaUIsb0NBQVksQ0FBQyw2QkFBNkIsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFDLGNBQVUsQ0FBQztJQUNqSyxDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBL0ZELENBQWtDLCtCQUFjLEdBK0YvQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQXV0b2NvbXBsZXRlLCBJQXV0b2NvbXBsZXRlUHJvdmlkZXIsIElBdXRvY29tcGxldGVTZXJ2aWNlLCBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudCwgSVN5bmNFeHByZXNzaW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY2FwYWJpbGl0eSwgaW5qZWN0IH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBDb21wbGV0aW9uUmVxdWVzdCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9wcm90b2NvbCc7XHJcbmltcG9ydCB7IENvbXBsZXRpb25JdGVtLCBDb21wbGV0aW9uTGlzdCwgQ29tcGxldGlvbk9wdGlvbnMsIFBvc2l0aW9uLCBUZXh0RG9jdW1lbnRJZGVudGlmaWVyLCBUZXh0RG9jdW1lbnRQb3NpdGlvblBhcmFtcyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy90eXBlcyc7XHJcbmltcG9ydCAqIGFzIHRvVXJpIGZyb20gJ2ZpbGUtdXJsJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IHBhY2thZ2VOYW1lIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcclxuXHJcbmNvbnN0IF9zbmlwcGV0UmVnZXggPSAve3soLio/KX19LztcclxuXHJcbi8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuZnVuY3Rpb24gaXNDb21wbGV0aW9uTGlzdChpdGVtOiBhbnkpOiBpdGVtIGlzIENvbXBsZXRpb25MaXN0IHtcclxuICAgIHJldHVybiBpdGVtICYmIGl0ZW0uaXRlbXM7XHJcbn1cclxuXHJcbkBjYXBhYmlsaXR5XHJcbmV4cG9ydCBjbGFzcyBBdXRvY29tcGxldGVQcm90b2NvbCBleHRlbmRzIERpc3Bvc2FibGVCYXNlIHtcclxuICAgIHByaXZhdGUgX2NsaWVudDogSUxhbmd1YWdlUHJvdG9jb2xDbGllbnQ7XHJcbiAgICBwcml2YXRlIF9hdXRvY29tcGxldGVTZXJ2aWNlOiBJQXV0b2NvbXBsZXRlU2VydmljZTtcclxuICAgIHByaXZhdGUgX3N5bmNFeHByZXNzaW9uOiBJU3luY0V4cHJlc3Npb247XHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBAaW5qZWN0KElMYW5ndWFnZVByb3RvY29sQ2xpZW50KSBjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LFxyXG4gICAgICAgIEBpbmplY3QoSVN5bmNFeHByZXNzaW9uKSBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLFxyXG4gICAgICAgIEBpbmplY3QoSUF1dG9jb21wbGV0ZVNlcnZpY2UpIGF1dG9jb21wbGV0ZVNlcnZpY2U6IElBdXRvY29tcGxldGVTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NsaWVudCA9IGNsaWVudDtcclxuICAgICAgICB0aGlzLl9hdXRvY29tcGxldGVTZXJ2aWNlID0gYXV0b2NvbXBsZXRlU2VydmljZTtcclxuICAgICAgICB0aGlzLl9zeW5jRXhwcmVzc2lvbiA9IHN5bmNFeHByZXNzaW9uO1xyXG4gICAgICAgIGlmICghY2xpZW50LmNhcGFiaWxpdGllcy5jb21wbGV0aW9uUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHRyaWdnZXIgY2hhcmFjdGVyc1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgQXV0b2NvbXBsZXRlU2VydmljZShjbGllbnQsIHRoaXMuX3N5bmNFeHByZXNzaW9uLCBjbGllbnQuY2FwYWJpbGl0aWVzLmNvbXBsZXRpb25Qcm92aWRlcik7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoc2VydmljZSk7XHJcbiAgICAgICAgdGhpcy5fYXV0b2NvbXBsZXRlU2VydmljZS5yZWdpc3RlclByb3ZpZGVyKHNlcnZpY2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBBdXRvY29tcGxldGVTZXJ2aWNlIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJQXV0b2NvbXBsZXRlUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfY2xpZW50OiBJTGFuZ3VhZ2VQcm90b2NvbENsaWVudDtcclxuICAgIHByaXZhdGUgX29wdGlvbnM6IENvbXBsZXRpb25PcHRpb25zO1xyXG4gICAgcHJpdmF0ZSBfc3luY0V4cHJlc3Npb246IElTeW5jRXhwcmVzc2lvbjtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihjbGllbnQ6IElMYW5ndWFnZVByb3RvY29sQ2xpZW50LCBzeW5jRXhwcmVzc2lvbjogSVN5bmNFeHByZXNzaW9uLCBvcHRpb25zOiBDb21wbGV0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gY2xpZW50O1xyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIHRoaXMuX3N5bmNFeHByZXNzaW9uID0gc3luY0V4cHJlc3Npb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcXVlc3Qob3B0aW9uczogQXV0b2NvbXBsZXRlLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zeW5jRXhwcmVzc2lvbi5ldmFsdWF0ZShvcHRpb25zLmVkaXRvcikpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbn0gPSBvcHRpb25zO1xyXG5cclxuICAgICAgICBjb25zdCBwYXJhbXM6IFRleHREb2N1bWVudFBvc2l0aW9uUGFyYW1zID0ge1xyXG4gICAgICAgICAgICB0ZXh0RG9jdW1lbnQ6IFRleHREb2N1bWVudElkZW50aWZpZXIuY3JlYXRlKHRvVXJpKGVkaXRvci5nZXRVUkkoKSkpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogUG9zaXRpb24uY3JlYXRlKGJ1ZmZlclBvc2l0aW9uLnJvdywgYnVmZmVyUG9zaXRpb24uY29sdW1uKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnQuc2VuZFJlcXVlc3QoQ29tcGxldGlvblJlcXVlc3QudHlwZSwgcGFyYW1zKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbXM6IENvbXBsZXRpb25JdGVtW107XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNDb21wbGV0aW9uTGlzdChyZXNwb25zZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBIb3cgdG8gbWVyZ2UgaW5jb21wbGV0ZT9cclxuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IHJlc3BvbnNlLml0ZW1zO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcyA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChpdGVtcywgaXRlbSA9PiB0aGlzLl9tYWtlU3VnZ2VzdGlvbihpdGVtLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21ha2VTdWdnZXN0aW9uKGNvbXBsZXRpb25JdGVtOiBDb21wbGV0aW9uSXRlbSwgb3B0aW9uczogQXV0b2NvbXBsZXRlLklSZXF1ZXN0KTogQXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb24ge1xyXG4gICAgICAgIGxldCByZXBsYWNlbWVudFByZWZpeDogc3RyaW5nID0gb3B0aW9ucy5wcmVmaXg7XHJcbiAgICAgICAgbGV0IGhhc1NuaXBwZXRMb2NhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBzbmlwcGV0OiBzdHJpbmcgfCB1bmRlZmluZWQ7XHJcbiAgICAgICAgbGV0IHRleHQ6IHN0cmluZyA9IGNvbXBsZXRpb25JdGVtLmluc2VydFRleHQgfHwgY29tcGxldGlvbkl0ZW0ubGFiZWw7XHJcbiAgICAgICAgaWYgKGNvbXBsZXRpb25JdGVtLnRleHRFZGl0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtyYW5nZSwgbmV3VGV4dH0gPSBjb21wbGV0aW9uSXRlbS50ZXh0RWRpdDtcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXggPSBvcHRpb25zLmVkaXRvci5nZXRUZXh0SW5SYW5nZShbW3JhbmdlLnN0YXJ0LmxpbmUsIHJhbmdlLnN0YXJ0LmNoYXJhY3Rlcl0sIFtyYW5nZS5lbmQubGluZSwgcmFuZ2UuZW5kLmNoYXJhY3Rlcl1dKTtcclxuICAgICAgICAgICAgaWYgKF9zbmlwcGV0UmVnZXgudGVzdChuZXdUZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgaGFzU25pcHBldExvY2F0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHNuaXBwZXQgPSBuZXdUZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4dCA9IG5ld1RleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGNvbXBsZXRpb25JdGVtLmluc2VydFRleHQpIHtcclxuICAgICAgICAgICAgaWYgKF9zbmlwcGV0UmVnZXgudGVzdChjb21wbGV0aW9uSXRlbS5pbnNlcnRUZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgaGFzU25pcHBldExvY2F0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHNuaXBwZXQgPSBjb21wbGV0aW9uSXRlbS5pbnNlcnRUZXh0O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4dCA9IGNvbXBsZXRpb25JdGVtLmluc2VydFRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGJhc2UgPSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBjb21wbGV0aW9uSXRlbS5sYWJlbCxcclxuICAgICAgICAgICAgaWNvbkhUTUw6IHRoaXMuX3JlbmRlckljb24oY29tcGxldGlvbkl0ZW0pLFxyXG4gICAgICAgICAgICBmaWx0ZXJUZXh0OiBjb21wbGV0aW9uSXRlbS5maWx0ZXJUZXh0IHx8IGNvbXBsZXRpb25JdGVtLmxhYmVsLFxyXG4gICAgICAgICAgICB0eXBlOiBBdXRvY29tcGxldGUuZ2V0VHlwZUZyb21Db21wbGV0aW9uSXRlbUtpbmQoY29tcGxldGlvbkl0ZW0ua2luZCEpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogY29tcGxldGlvbkl0ZW0uZGV0YWlsLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbk1vcmVVUkw6IGNvbXBsZXRpb25JdGVtLmRvY3VtZW50YXRpb24sXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogYGF1dG9jb21wbGV0ZS0ke3BhY2thZ2VOYW1lfWBcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoc25pcHBldCkge1xyXG4gICAgICAgICAgICBzbmlwcGV0ID0gc25pcHBldC5yZXBsYWNlKF9zbmlwcGV0UmVnZXgsIChzdWJzdHJpbmc6IHN0cmluZywgdmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGBcXCR7MToke3ZhbHVlfX1gO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYFxcJDFgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc25pcHBldCArPSAnJDInO1xyXG4gICAgICAgICAgICByZXR1cm4gXy5hc3NpZ24oYmFzZSwge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGlvbkl0ZW0sXHJcbiAgICAgICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeCxcclxuICAgICAgICAgICAgICAgIHNuaXBwZXRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8uYXNzaWduKGJhc2UsIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRpb25JdGVtLFxyXG4gICAgICAgICAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXgsXHJcbiAgICAgICAgICAgICAgICB0ZXh0XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJJY29uKGNvbXBsZXRpb25JdGVtOiBDb21wbGV0aW9uSXRlbSkge1xyXG4gICAgICAgIHJldHVybiBgPGltZyBoZWlnaHQ9XCIxNnB4XCIgd2lkdGg9XCIxNnB4XCIgc3JjPVwiYXRvbTovLyR7cGFja2FnZU5hbWV9L3N0eWxlcy9pY29ucy8ke0F1dG9jb21wbGV0ZS5nZXRJY29uRnJvbUNvbXBsZXRpb25JdGVtS2luZChjb21wbGV0aW9uSXRlbS5raW5kISl9LnN2Z1wiIC8+YDtcclxuICAgIH1cclxufVxyXG4iXX0=