"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
var _ = require('lodash');
/* tslint:disable-next-line:no-require-imports */
var atom_languageservices_1 = require('atom-languageservices');
var Fuse = require('fuse.js');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var constants_1 = require('../constants');
var AutocompleteService = (function (_super) {
    __extends(AutocompleteService, _super);
    function AutocompleteService() {
        _super.call(this);
        this.selector = ".source";
        // public disableForSelector = `.${className} .comment`;
        this.inclusionPriority = 10;
        this.suggestionPriority = 10;
        this.excludeLowerPriority = false;
        this._fuse = new Fuse([], {
            caseSensitive: false,
            threshold: 0.7,
            tokenize: true,
            tokenSeparator: /(?:(?=[A-Z])|\s+)/,
            shouldSort: true,
            keys: [
                { name: 'displayText', weight: 0.8 },
                { name: 'description', weight: 0.15 },
                { name: 'descriptionMoreURL', weight: 0.05 }
            ]
        });
    }
    AutocompleteService.prototype.createInvoke = function (callbacks) {
        var _this = this;
        return (function (options) {
            var requests = _.compact(_.over(callbacks)(options));
            return Promise.all(requests)
                .then(_.bind(_this._reduceItems, _this));
        });
    };
    AutocompleteService.prototype._reduceItems = function (results) {
        var _this = this;
        return _.flatMap(results, function (item) {
            if (item.length > 0) {
                if (item[0].iconHTML) {
                    return item;
                }
                if (item[0].type) {
                    _.each(item, function (i) {
                        if (i.type && !i.iconHTML) {
                            i.iconHTML = _this._renderIcon(i);
                        }
                        return;
                    });
                }
            }
            return item;
        });
    };
    AutocompleteService.prototype.getSuggestions = function (options) {
        var _this = this;
        if (!this.hasProviders) {
            return null;
        }
        if (!atom.views.getView(options.editor).classList.contains(constants_1.className)) {
            return null;
        }
        if (options.prefix === '.') {
            options.prefix = '';
        }
        var search = options.prefix;
        return this.invoke(options)
            .then(function (results) {
            if (search) {
                _this._fuse.set(results);
                results = _this._fuse.search(search);
            }
            return results;
        });
    };
    AutocompleteService.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromSuggestionType(completionItem.type) + ".svg\" />";
    };
    AutocompleteService.prototype.onDidInsertSuggestion = function (editor, triggerPosition, suggestion) { };
    return AutocompleteService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.AutocompleteService = AutocompleteService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b2NvbXBsZXRlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL0F1dG9jb21wbGV0ZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILDJCQUEyQjtBQUMzQixJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixpREFBaUQ7QUFDakQsc0NBQTBFLHVCQUF1QixDQUFDLENBQUE7QUFDbEcsSUFBWSxJQUFJLFdBQU0sU0FBUyxDQUFDLENBQUE7QUFDaEMscUNBQW9DLHdCQUF3QixDQUFDLENBQUE7QUFDN0QsMEJBQXVDLGNBQWMsQ0FBQyxDQUFBO0FBRXREO0lBQ1ksdUNBQXFKO0lBRTdKO1FBQ0ksaUJBQU8sQ0FBQztRQThCTCxhQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzVCLHdEQUF3RDtRQUNqRCxzQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDdkIsdUJBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLHlCQUFvQixHQUFHLEtBQUssQ0FBQztRQUM1QixVQUFLLEdBQUcsSUFBSSxJQUFJLENBQTBCLEVBQUUsRUFBRTtZQUNsRCxhQUFhLEVBQUUsS0FBSztZQUNwQixTQUFTLEVBQUUsR0FBRztZQUNkLFFBQVEsRUFBRSxJQUFJO1lBQ2QsY0FBYyxFQUFFLG1CQUFtQjtZQUNuQyxVQUFVLEVBQUUsSUFBSTtZQUNoQixJQUFJLEVBQUU7Z0JBQ0YsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQ3BDLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUNyQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2FBQy9DO1NBQ0osQ0FBQyxDQUFDO0lBN0NILENBQUM7SUFFUywwQ0FBWSxHQUF0QixVQUF1QixTQUFpRztRQUF4SCxpQkFNQztR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cUIsR0FBNUIsVUFBNkIsTUFBdUIsRUFBRSxlQUFpQyxFQUFFLFVBQW1DLElBQVUsQ0FBQztJQUMzSSwwQkFBQztBQUFELENBQUMsQUFoRkQsQ0FDWSwwQ0FBbUIsR0ErRTlCO0FBaEZZLDJCQUFtQixzQkFnRi9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tcmVxdWlyZS1pbXBvcnRzICovXHJcbmltcG9ydCB7IEF1dG9jb21wbGV0ZSwgSUF1dG9jb21wbGV0ZVByb3ZpZGVyLCBJQXV0b2NvbXBsZXRlU2VydmljZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCAqIGFzIEZ1c2UgZnJvbSAnZnVzZS5qcyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgY2xhc3NOYW1lLCBwYWNrYWdlTmFtZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXV0b2NvbXBsZXRlU2VydmljZVxyXG4gICAgZXh0ZW5kcyBQcm92aWRlclNlcnZpY2VCYXNlPElBdXRvY29tcGxldGVQcm92aWRlciwgQXV0b2NvbXBsZXRlLklSZXF1ZXN0LCBQcm9taXNlPEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uW10+IHwgdW5kZWZpbmVkLCBQcm9taXNlPEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uW10+PlxyXG4gICAgaW1wbGVtZW50cyBJQXV0b2NvbXBsZXRlU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IEF1dG9jb21wbGV0ZS5JUmVxdWVzdCkgPT4gUHJvbWlzZTxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbltdPiB8IHVuZGVmaW5lZClbXSkge1xyXG4gICAgICAgIHJldHVybiAoKG9wdGlvbnM6IEF1dG9jb21wbGV0ZS5JUmVxdWVzdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0cyA9IF8uY29tcGFjdChfLm92ZXIoY2FsbGJhY2tzKShvcHRpb25zKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbDxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbltdPig8YW55PnJlcXVlc3RzKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oXy5iaW5kKHRoaXMuX3JlZHVjZUl0ZW1zLCB0aGlzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVkdWNlSXRlbXMocmVzdWx0czogQXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb25bXVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uZmxhdE1hcDxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbltdLCBBdXRvY29tcGxldGUuU3VnZ2VzdGlvbj4ocmVzdWx0cywgaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtWzBdLmljb25IVE1MKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVswXS50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGl0ZW0sIGkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaS50eXBlICYmICFpLmljb25IVE1MKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLmljb25IVE1MID0gdGhpcy5fcmVuZGVySWNvbihpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdG9yID0gYC5zb3VyY2VgO1xyXG4gICAgLy8gcHVibGljIGRpc2FibGVGb3JTZWxlY3RvciA9IGAuJHtjbGFzc05hbWV9IC5jb21tZW50YDtcclxuICAgIHB1YmxpYyBpbmNsdXNpb25Qcmlvcml0eSA9IDEwO1xyXG4gICAgcHVibGljIHN1Z2dlc3Rpb25Qcmlvcml0eSA9IDEwO1xyXG4gICAgcHVibGljIGV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9mdXNlID0gbmV3IEZ1c2U8QXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb24+KFtdLCB7XHJcbiAgICAgICAgY2FzZVNlbnNpdGl2ZTogZmFsc2UsXHJcbiAgICAgICAgdGhyZXNob2xkOiAwLjcsXHJcbiAgICAgICAgdG9rZW5pemU6IHRydWUsXHJcbiAgICAgICAgdG9rZW5TZXBhcmF0b3I6IC8oPzooPz1bQS1aXSl8XFxzKykvLFxyXG4gICAgICAgIHNob3VsZFNvcnQ6IHRydWUsXHJcbiAgICAgICAga2V5czogW1xyXG4gICAgICAgICAgICB7IG5hbWU6ICdkaXNwbGF5VGV4dCcsIHdlaWdodDogMC44IH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2Rlc2NyaXB0aW9uJywgd2VpZ2h0OiAwLjE1IH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2Rlc2NyaXB0aW9uTW9yZVVSTCcsIHdlaWdodDogMC4wNSB9XHJcbiAgICAgICAgXVxyXG4gICAgfSk7XHJcblxyXG4gICAgcHVibGljIGdldFN1Z2dlc3Rpb25zKG9wdGlvbnM6IEF1dG9jb21wbGV0ZS5JUmVxdWVzdCk6IFByb21pc2U8QXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb25bXT4gfCBudWxsIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzUHJvdmlkZXJzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWF0b20udmlld3MuZ2V0VmlldyhvcHRpb25zLmVkaXRvcikuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5wcmVmaXggPT09ICcuJykge1xyXG4gICAgICAgICAgICBvcHRpb25zLnByZWZpeCA9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzZWFyY2ggPSBvcHRpb25zLnByZWZpeDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52b2tlKG9wdGlvbnMpXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Z1c2Uuc2V0KHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSB0aGlzLl9mdXNlLnNlYXJjaDxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbj4oc2VhcmNoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZW5kZXJJY29uKGNvbXBsZXRpb25JdGVtOiBBdXRvY29tcGxldGUuU3VnZ2VzdGlvbikge1xyXG4gICAgICAgIHJldHVybiBgPGltZyBoZWlnaHQ9XCIxNnB4XCIgd2lkdGg9XCIxNnB4XCIgc3JjPVwiYXRvbTovLyR7cGFja2FnZU5hbWV9L3N0eWxlcy9pY29ucy8ke0F1dG9jb21wbGV0ZS5nZXRJY29uRnJvbVN1Z2dlc3Rpb25UeXBlKGNvbXBsZXRpb25JdGVtLnR5cGUhKX0uc3ZnXCIgLz5gO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpZEluc2VydFN1Z2dlc3Rpb24oZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IsIHRyaWdnZXJQb3NpdGlvbjogVGV4dEJ1ZmZlci5Qb2ludCwgc3VnZ2VzdGlvbjogQXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb24pIHsgLyogKi8gfVxyXG59XHJcbiJdfQ==