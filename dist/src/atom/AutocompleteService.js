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
/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
/* tslint:disable:no-any */
var _ = require('lodash');
var rxjs_1 = require('rxjs');
/* tslint:disable-next-line:no-require-imports */
var atom_languageservices_1 = require('atom-languageservices');
var Fuse = require('fuse.js');
var ts_disposables_1 = require('ts-disposables');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var constants_1 = require('../constants');
var decorators_1 = require('../decorators');
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
    AutocompleteService.prototype.onEnabled = function () {
        var _this = this;
        this._enabled = true;
        return ts_disposables_1.Disposable.create(function () {
            _this._enabled = false;
        });
    };
    AutocompleteService.prototype.createInvoke = function (callbacks) {
        var _this = this;
        return (function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce(function (acc, results) { return _.compact(acc.concat(_this._reduceItems(results))); }, []);
        });
    };
    AutocompleteService.prototype._reduceItems = function (results) {
        var _this = this;
        return _.map(results, function (item) {
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
            .map(function (results) {
            if (search) {
                _this._fuse.set(results);
                results = _this._fuse.search(search);
            }
            return results;
        })
            .toPromise();
    };
    AutocompleteService.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromSuggestionType(completionItem.type) + ".svg\" />";
    };
    AutocompleteService.prototype.onDidInsertSuggestion = function (editor, triggerPosition, suggestion) { };
    AutocompleteService = __decorate([
        decorators_1.atomConfig({
            default: true,
            description: 'Adds support for integration with atoms autocomplete service'
        }), 
        __metadata('design:paramtypes', [])
    ], AutocompleteService);
    return AutocompleteService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.AutocompleteService = AutocompleteService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXV0b2NvbXBsZXRlU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL0F1dG9jb21wbGV0ZVNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILDJCQUEyQjtBQUMzQixJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUM1QixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsaURBQWlEO0FBQ2pELHNDQUEwRSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xHLElBQVksSUFBSSxXQUFNLFNBQVMsQ0FBQyxDQUFBO0FBQ2hDLCtCQUEyQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzVDLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzdELDBCQUF1QyxjQUFjLENBQUMsQ0FBQTtBQUN0RCwyQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFNM0M7SUFDWSx1Q0FBK0k7SUFHdko7UUFDSSxpQkFBTyxDQUFDO1FBcUNMLGFBQVEsR0FBRyxTQUFTLENBQUM7UUFDNUIsd0RBQXdEO1FBQ2pELHNCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUN2Qix1QkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDeEIseUJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQzVCLFVBQUssR0FBRyxJQUFJLElBQUksQ0FBMEIsRUFBRSxFQUFFO1lBQ2xELGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFNBQVMsRUFBRSxHQUFHO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxjQUFjLEVBQUUsbUJBQW1CO1lBQ25DLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLElBQUksRUFBRTtnQkFDRixFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDcEMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBQ3JDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFF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LENBQUM7Z0JBQ1QsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBMEIsTUFBTSxDQUFDLENBQUM7WUFDakUsQ0FBQztZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbkIsQ0FBQyxDQUFDO2FBQ0QsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVPLHlDQUFXLEdBQW5CLFVBQW9CLGNBQXVDO1FBQ3ZELE1BQU0sQ0FBQyxzREFBK0MsdUJBQVcsc0JBQWlCLG9DQUFZLENBQUMseUJBQXlCLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQyxjQUFVLENBQUM7SUFDN0osQ0FBQztJQUVNLG1EQUFxQixHQUE1QixVQUE2QixNQUF1QixFQUFFLGVBQWlDLEVBQUUsVUFBbUMsSUFBVSxDQUFDO0lBNUYzSTtRQUFDLHVCQUFVLENBQUM7WUFDUixPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSw4REFBOEQ7U0FDOUUsQ0FBQzs7MkJBQUE7SUEwRkYsMEJBQUM7QUFBRCxDQUFDLEFBekZELENBQ1ksMENBQW1CLEdBd0Y5QjtBQXpGWSwyQkFBbUIsc0JBeUYvQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tcmVxdWlyZS1pbXBvcnRzICovXHJcbmltcG9ydCB7IEF1dG9jb21wbGV0ZSwgSUF1dG9jb21wbGV0ZVByb3ZpZGVyLCBJQXV0b2NvbXBsZXRlU2VydmljZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCAqIGFzIEZ1c2UgZnJvbSAnZnVzZS5qcyc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgY2xhc3NOYW1lLCBwYWNrYWdlTmFtZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IGF0b21Db25maWcgfSBmcm9tICcuLi9kZWNvcmF0b3JzJztcclxuXHJcbkBhdG9tQ29uZmlnKHtcclxuICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc3VwcG9ydCBmb3IgaW50ZWdyYXRpb24gd2l0aCBhdG9tcyBhdXRvY29tcGxldGUgc2VydmljZSdcclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZVNlcnZpY2VcclxuICAgIGV4dGVuZHMgUHJvdmlkZXJTZXJ2aWNlQmFzZTxJQXV0b2NvbXBsZXRlUHJvdmlkZXIsIEF1dG9jb21wbGV0ZS5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbltdPiwgT2JzZXJ2YWJsZTxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbltdPj5cclxuICAgIGltcGxlbWVudHMgSUF1dG9jb21wbGV0ZVNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfZW5hYmxlZDogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlZCgpIHtcclxuICAgICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgob3B0aW9uczogQXV0b2NvbXBsZXRlLklSZXF1ZXN0KSA9PiBPYnNlcnZhYmxlPEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uW10+KVtdKSB7XHJcbiAgICAgICAgcmV0dXJuICgob3B0aW9uczogQXV0b2NvbXBsZXRlLklSZXF1ZXN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20oXy5vdmVyKGNhbGxiYWNrcykob3B0aW9ucykpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoXy5pZGVudGl0eSlcclxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcmVzdWx0cykgPT4gXy5jb21wYWN0KGFjYy5jb25jYXQodGhpcy5fcmVkdWNlSXRlbXMocmVzdWx0cykpKSwgW10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlZHVjZUl0ZW1zKHJlc3VsdHM6IEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uW10pIHtcclxuICAgICAgICByZXR1cm4gXy5tYXA8QXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb25bXSwgQXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb24+KHJlc3VsdHMsIGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVswXS5pY29uSFRNTCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1bMF0udHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChpdGVtLCBpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkudHlwZSAmJiAhaS5pY29uSFRNTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5pY29uSFRNTCA9IHRoaXMuX3JlbmRlckljb24oaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RvciA9IGAuc291cmNlYDtcclxuICAgIC8vIHB1YmxpYyBkaXNhYmxlRm9yU2VsZWN0b3IgPSBgLiR7Y2xhc3NOYW1lfSAuY29tbWVudGA7XHJcbiAgICBwdWJsaWMgaW5jbHVzaW9uUHJpb3JpdHkgPSAxMDtcclxuICAgIHB1YmxpYyBzdWdnZXN0aW9uUHJpb3JpdHkgPSAxMDtcclxuICAgIHB1YmxpYyBleGNsdWRlTG93ZXJQcmlvcml0eSA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfZnVzZSA9IG5ldyBGdXNlPEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uPihbXSwge1xyXG4gICAgICAgIGNhc2VTZW5zaXRpdmU6IGZhbHNlLFxyXG4gICAgICAgIHRocmVzaG9sZDogMC43LFxyXG4gICAgICAgIHRva2VuaXplOiB0cnVlLFxyXG4gICAgICAgIHRva2VuU2VwYXJhdG9yOiAvKD86KD89W0EtWl0pfFxccyspLyxcclxuICAgICAgICBzaG91bGRTb3J0OiB0cnVlLFxyXG4gICAgICAgIGtleXM6IFtcclxuICAgICAgICAgICAgeyBuYW1lOiAnZGlzcGxheVRleHQnLCB3ZWlnaHQ6IDAuOCB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdkZXNjcmlwdGlvbicsIHdlaWdodDogMC4xNSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdkZXNjcmlwdGlvbk1vcmVVUkwnLCB3ZWlnaHQ6IDAuMDUgfVxyXG4gICAgICAgIF1cclxuICAgIH0pO1xyXG5cclxuICAgIHB1YmxpYyBnZXRTdWdnZXN0aW9ucyhvcHRpb25zOiBBdXRvY29tcGxldGUuSVJlcXVlc3QpOiBQcm9taXNlPEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uW10+IHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc1Byb3ZpZGVycykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFhdG9tLnZpZXdzLmdldFZpZXcob3B0aW9ucy5lZGl0b3IpLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMucHJlZml4ID09PSAnLicpIHtcclxuICAgICAgICAgICAgb3B0aW9ucy5wcmVmaXggPSAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gb3B0aW9ucy5wcmVmaXg7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmludm9rZShvcHRpb25zKVxyXG4gICAgICAgICAgICAubWFwKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Z1c2Uuc2V0KHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSB0aGlzLl9mdXNlLnNlYXJjaDxBdXRvY29tcGxldGUuU3VnZ2VzdGlvbj4oc2VhcmNoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudG9Qcm9taXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVuZGVySWNvbihjb21wbGV0aW9uSXRlbTogQXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb24pIHtcclxuICAgICAgICByZXR1cm4gYDxpbWcgaGVpZ2h0PVwiMTZweFwiIHdpZHRoPVwiMTZweFwiIHNyYz1cImF0b206Ly8ke3BhY2thZ2VOYW1lfS9zdHlsZXMvaWNvbnMvJHtBdXRvY29tcGxldGUuZ2V0SWNvbkZyb21TdWdnZXN0aW9uVHlwZShjb21wbGV0aW9uSXRlbS50eXBlISl9LnN2Z1wiIC8+YDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaWRJbnNlcnRTdWdnZXN0aW9uKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yLCB0cmlnZ2VyUG9zaXRpb246IFRleHRCdWZmZXIuUG9pbnQsIHN1Z2dlc3Rpb246IEF1dG9jb21wbGV0ZS5TdWdnZXN0aW9uKSB7IC8qICovIH1cclxufVxyXG4iXX0=