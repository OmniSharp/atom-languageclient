"use strict";
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
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var WaitService = (function () {
    function WaitService() {
        var _this = this;
        this._waiting$ = this._waitingObserver = new rxjs_1.BehaviorSubject(false);
        this._waiting$.subscribe(function (waiting) { return _this._waiting = waiting; });
    }
    Object.defineProperty(WaitService.prototype, "waiting", {
        get: function () { return this._waiting; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WaitService.prototype, "waiting$", {
        get: function () { return this._waiting$; },
        enumerable: true,
        configurable: true
    });
    WaitService.prototype.waitUntil = function (emit) {
        var _this = this;
        this._waitingObserver.next(true);
        if (atom_languageservices_1.helpers.isPromise(emit)) {
            emit.then(function () {
                _this._waitingObserver.next(false);
            }, function () {
                _this._waitingObserver.next(false);
            });
        }
        else {
            emit.subscribe({
                error: function () {
                    _this._waitingObserver.next(false);
                },
                complete: function () {
                    _this._waitingObserver.next(false);
                }
            });
        }
    };
    WaitService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IWaitService), 
        __metadata('design:paramtypes', [])
    ], WaitService);
    return WaitService;
}());
exports.WaitService = WaitService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2FpdFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9XYWl0U2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILHFCQUE0QyxNQUFNLENBQUMsQ0FBQTtBQUNuRCxzQ0FBc0MsdUJBQXVCLENBQUMsQ0FBQTtBQUM5RCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUlyRTtJQUtJO1FBTEosaUJBbUNDO1FBN0JPLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksc0JBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxFQUF2QixDQUF1QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELHNCQUFXLGdDQUFPO2FBQWxCLGNBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDOUMsc0JBQVcsaUNBQVE7YUFBbkIsY0FBd0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUV6QywrQkFBUyxHQUFoQixVQUFpQixJQUFzQztRQUF2RCxpQkFxQkM7UUFwQkcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQywrQkFBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FDTDtnQkFDSSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLENBQUMsRUFDRDtnQkFDSSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDWCxLQUFLLEVBQUU7b0JBQ0gsS0FBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztnQkFDRCxRQUFRLEVBQUU7b0JBQ04sS0FBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEMsQ0FBQzthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBcENMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLG9DQUFZLENBQUM7O21CQUFBO0lBb0NwQixrQkFBQztBQUFELENBQUMsQUFuQ0QsSUFtQ0M7QUFuQ1ksbUJBQVcsY0FtQ3ZCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSVdhaXRTZXJ2aWNlLCBoZWxwZXJzIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSVdhaXRTZXJ2aWNlKVxyXG5leHBvcnQgY2xhc3MgV2FpdFNlcnZpY2UgaW1wbGVtZW50cyBJV2FpdFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfd2FpdGluZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3dhaXRpbmckOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xyXG4gICAgcHJpdmF0ZSBfd2FpdGluZ09ic2VydmVyOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fd2FpdGluZyQgPSB0aGlzLl93YWl0aW5nT2JzZXJ2ZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcclxuICAgICAgICB0aGlzLl93YWl0aW5nJC5zdWJzY3JpYmUod2FpdGluZyA9PiB0aGlzLl93YWl0aW5nID0gd2FpdGluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3YWl0aW5nKCkgeyByZXR1cm4gdGhpcy5fd2FpdGluZzsgfVxyXG4gICAgcHVibGljIGdldCB3YWl0aW5nJCgpIHsgcmV0dXJuIHRoaXMuX3dhaXRpbmckOyB9XHJcblxyXG4gICAgcHVibGljIHdhaXRVbnRpbChlbWl0OiBQcm9taXNlPHZvaWQ+IHwgT2JzZXJ2YWJsZTx2b2lkPikge1xyXG4gICAgICAgIHRoaXMuX3dhaXRpbmdPYnNlcnZlci5uZXh0KHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoaGVscGVycy5pc1Byb21pc2UoZW1pdCkpIHtcclxuICAgICAgICAgICAgZW1pdC50aGVuKFxyXG4gICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dhaXRpbmdPYnNlcnZlci5uZXh0KGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2FpdGluZ09ic2VydmVyLm5leHQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZW1pdC5zdWJzY3JpYmUoe1xyXG4gICAgICAgICAgICAgICAgZXJyb3I6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93YWl0aW5nT2JzZXJ2ZXIubmV4dChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl93YWl0aW5nT2JzZXJ2ZXIubmV4dChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=