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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var _ProviderServiceBase_1 = require('./_ProviderServiceBase');
var decorators_2 = require('../decorators');
var AtomChanges_1 = require('./AtomChanges');
var RunCodeActionService = (function (_super) {
    __extends(RunCodeActionService, _super);
    function RunCodeActionService(changes) {
        _super.call(this);
        this._changes = changes;
    }
    RunCodeActionService.prototype.onEnabled = function () {
        return ts_disposables_1.Disposable.empty;
    };
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
        decorators_1.alias(atom_languageservices_1.IRunCodeActionService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds support for running code actions from a list of actual code actions'
        }), 
        __metadata('design:paramtypes', [AtomChanges_1.AtomChanges])
    ], RunCodeActionService);
    return RunCodeActionService;
}(_ProviderServiceBase_1.ProviderServiceBase));
exports.RunCodeActionService = RunCodeActionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUnVuQ29kZUFjdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9SdW5Db2RlQWN0aW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLHNDQUFtRix1QkFBdUIsQ0FBQyxDQUFBO0FBQzNHLDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JFLCtCQUEyQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzVDLHFDQUFvQyx3QkFBd0IsQ0FBQyxDQUFBO0FBQzdELDJCQUEyQixlQUFlLENBQUMsQ0FBQTtBQUMzQyw0QkFBNEIsZUFBZSxDQUFDLENBQUE7QUFRNUM7SUFDWSx3Q0FBNkk7SUFJckosOEJBQVksT0FBb0I7UUFDNUIsaUJBQU8sQ0FBQztRQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFTSx3Q0FBUyxHQUFoQjtRQUNJLE1BQU0sQ0FBQywyQkFBVSxDQUFDLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRVMsMkNBQVksR0FBdEIsVUFBdUIsU0FBdUY7UUFDMUcsTUFBTSxDQUFDLFVBQUMsT0FBK0I7WUFDbkMsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzdDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2lCQUNwQixNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsT0FBTyxJQUFLLE9BQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTlCLENBQThCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVNLHNDQUFPLEdBQWQsVUFBZSxPQUErQjtRQUE5QyxpQkFNQztRQUxHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQ2YsU0FBUyxDQUFDLFVBQUEsT0FBTztZQUNkLE1BQU0sQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQzthQUNELFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFsQ0w7UUFBQyx1QkFBVSxFQUFFO1FBQ1osa0JBQUssQ0FBQyw2Q0FBcUIsQ0FBQztRQUM1Qix1QkFBVSxDQUFDO1lBQ1IsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUsMEVBQTBFO1NBQzFGLENBQUM7OzRCQUFBO0lBOEJGLDJCQUFDO0FBQUQsQ0FBQyxBQTdCRCxDQUNZLDBDQUFtQixHQTRCOUI7QUE3QlksNEJBQW9CLHVCQTZCaEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJUnVuQ29kZUFjdGlvblByb3ZpZGVyLCBJUnVuQ29kZUFjdGlvblNlcnZpY2UsIFJ1bkNvZGVBY3Rpb24sIFRleHQgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBhbGlhcywgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgUHJvdmlkZXJTZXJ2aWNlQmFzZSB9IGZyb20gJy4vX1Byb3ZpZGVyU2VydmljZUJhc2UnO1xyXG5pbXBvcnQgeyBhdG9tQ29uZmlnIH0gZnJvbSAnLi4vZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEF0b21DaGFuZ2VzIH0gZnJvbSAnLi9BdG9tQ2hhbmdlcyc7XHJcblxyXG5AaW5qZWN0YWJsZSgpXHJcbkBhbGlhcyhJUnVuQ29kZUFjdGlvblNlcnZpY2UpXHJcbkBhdG9tQ29uZmlnKHtcclxuICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc3VwcG9ydCBmb3IgcnVubmluZyBjb2RlIGFjdGlvbnMgZnJvbSBhIGxpc3Qgb2YgYWN0dWFsIGNvZGUgYWN0aW9ucydcclxufSlcclxuZXhwb3J0IGNsYXNzIFJ1bkNvZGVBY3Rpb25TZXJ2aWNlXHJcbiAgICBleHRlbmRzIFByb3ZpZGVyU2VydmljZUJhc2U8SVJ1bkNvZGVBY3Rpb25Qcm92aWRlciwgUnVuQ29kZUFjdGlvbi5JUmVxdWVzdCwgT2JzZXJ2YWJsZTxUZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4sIE9ic2VydmFibGU8VGV4dC5JV29ya3NwYWNlQ2hhbmdlW10+PlxyXG4gICAgaW1wbGVtZW50cyBJUnVuQ29kZUFjdGlvblNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfY2hhbmdlczogQXRvbUNoYW5nZXM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY2hhbmdlczogQXRvbUNoYW5nZXMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2NoYW5nZXMgPSBjaGFuZ2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIERpc3Bvc2FibGUuZW1wdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUludm9rZShjYWxsYmFja3M6ICgob3B0aW9uczogUnVuQ29kZUFjdGlvbi5JUmVxdWVzdCkgPT4gT2JzZXJ2YWJsZTxUZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXT4pW10pIHtcclxuICAgICAgICByZXR1cm4gKG9wdGlvbnM6IFJ1bkNvZGVBY3Rpb24uSVJlcXVlc3QpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbShfLm92ZXIoY2FsbGJhY2tzKShvcHRpb25zKSlcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcChfLmlkZW50aXR5KVxyXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCByZXN1bHRzKSA9PiBfLmNvbXBhY3QoYWNjLmNvbmNhdChyZXN1bHRzKSksIFtdKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXF1ZXN0KG9wdGlvbnM6IFJ1bkNvZGVBY3Rpb24uSVJlcXVlc3QpIHtcclxuICAgICAgICB0aGlzLmludm9rZShvcHRpb25zKVxyXG4gICAgICAgICAgICAuY29uY2F0TWFwKGNoYW5nZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYW5nZXMuYXBwbHlXb3Jrc3BhY2VDaGFuZ2VzKGNoYW5nZXMpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbn1cclxuIl19