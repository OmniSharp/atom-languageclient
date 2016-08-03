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
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var Services = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var AtomChanges_1 = require('./AtomChanges');
var RunCodeActionService = (function (_super) {
    __extends(RunCodeActionService, _super);
    function RunCodeActionService(changes) {
        _super.call(this);
        this._changes = changes;
    }
    RunCodeActionService.prototype.createInvoke = function (callbacks) {
        return function (options) {
            return rxjs_1.Observable.from(_.over(callbacks)(options))
                .mergeMap(_.identity)
                .reduce(function (acc, results) { return _.compact(acc.concat(results)); }, []);
        };
    };
    RunCodeActionService.prototype.request = function (options) {
        var _this = this;
        this.invoke(options)
            .concatMap(function (changes) {
            return _this._changes.applyWorkspaceChanges(changes);
        })
            .subscribe();
    };
    RunCodeActionService = __decorate([
        decorators_1.injectable(),
        decorators_1.alias(Services.IRunCodeActionService), 
        __metadata('design:paramtypes', [AtomChanges_1.AtomChanges])
    ], RunCodeActionService);
    return RunCodeActionService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.RunCodeActionService = RunCodeActionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVuQ29kZUFjdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9SdW5Db2RlQWN0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLElBQVksUUFBUSxXQUFNLHVCQUF1QixDQUFDLENBQUE7QUFDbEQsMkJBQWtDLGtDQUFrQyxDQUFDLENBQUE7QUFDckUscUNBQW9DLHdCQUF3QixDQUFDLENBQUE7QUFDN0QsNEJBQTRCLGVBQWUsQ0FBQyxDQUFBO0FBSTVDO0lBQ1ksd0NBQWlMO0lBSXpMLDhCQUFZLE9BQW9CO1FBQzVCLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRVMsMkNBQVksR0FBdEIsVUFBdUIsU0FBeUc7UUFDNUgsTUFBTSxDQUFDLFVBQUMsT0FBd0M7WUFDNUMsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsT0FBTyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTlCLENBQThCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVNLHNDQUFPLEdBQWQsVUFBZSxPQUF3QztRQUF2RCxpQkFNQztRQUxHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQ2YsU0FBUyxDQUFDLFVBQUEsT0FBTztZQUNkLE1BQU0sQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQzthQUNELFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUExQkw7UUFBQyx1QkFBVSxFQUFFO1FBQ1osa0JBQUssQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUM7OzRCQUFBO0lBMEJ0QywyQkFBQztBQUFELENBQUMsQUF6QkQsQ0FDWSwwQ0FBbUIsR0F3QjlCO0FBekJZLDRCQUFvQix1QkF5QmhDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0ICogYXMgU2VydmljZXMgZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IFByb3ZpZGVyU2VydmljZUJhc2UgfSBmcm9tICcuL19Qcm92aWRlclNlcnZpY2VCYXNlJztcclxuaW1wb3J0IHsgQXRvbUNoYW5nZXMgfSBmcm9tICcuL0F0b21DaGFuZ2VzJztcclxuXHJcbkBpbmplY3RhYmxlKClcclxuQGFsaWFzKFNlcnZpY2VzLklSdW5Db2RlQWN0aW9uU2VydmljZSlcclxuZXhwb3J0IGNsYXNzIFJ1bkNvZGVBY3Rpb25TZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8U2VydmljZXMuSVJ1bkNvZGVBY3Rpb25Qcm92aWRlciwgU2VydmljZXMuUnVuQ29kZUFjdGlvbi5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxTZXJ2aWNlcy5UZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4sIE9ic2VydmFibGU8U2VydmljZXMuVGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+PlxyXG4gICAgaW1wbGVtZW50cyBTZXJ2aWNlcy5JUnVuQ29kZUFjdGlvblNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY2hhbmdlczogQXRvbUNoYW5nZXM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hhbmdlczogQXRvbUNoYW5nZXMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZXMgPSBjaGFuZ2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJbnZva2UoY2FsbGJhY2tzOiAoKG9wdGlvbnM6IFNlcnZpY2VzLlJ1bkNvZGVBY3Rpb24uSVJlcXVlc3QpID0+IE9ic2VydmFibGU8U2VydmljZXMuVGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+KVtdKSB7XHJcbiAgICAgICAgcmV0dXJuIChvcHRpb25zOiBTZXJ2aWNlcy5SdW5Db2RlQWN0aW9uLklSZXF1ZXN0KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20oXy5vdmVyKGNhbGxiYWNrcykob3B0aW9ucykpXHJcbiAgICAgICAgICAgICAgICAubWVyZ2VNYXAoXy5pZGVudGl0eSlcclxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgcmVzdWx0cykgPT4gXy5jb21wYWN0KGFjYy5jb25jYXQocmVzdWx0cykpLCBbXSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVxdWVzdChvcHRpb25zOiBTZXJ2aWNlcy5SdW5Db2RlQWN0aW9uLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgdGhpcy5pbnZva2Uob3B0aW9ucylcclxuICAgICAgICAgICAgLmNvbmNhdE1hcChjaGFuZ2VzID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFuZ2VzLmFwcGx5V29ya3NwYWNlQ2hhbmdlcyhjaGFuZ2VzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==