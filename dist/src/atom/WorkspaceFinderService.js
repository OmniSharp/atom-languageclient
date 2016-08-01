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
var ts_disposables_1 = require('ts-disposables');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var WorkspaceFinderView_1 = require('./views/WorkspaceFinderView');
var MAX_ITEMS = 100;
var WorkspaceFinderService = (function (_super) {
    __extends(WorkspaceFinderService, _super);
    function WorkspaceFinderService(navigation, commands) {
        var _this = this;
        _super.call(this);
        this._filter$ = new rxjs_1.Subject();
        this._filterObservable$ = this._filter$.asObservable().lodashThrottle(300, { leading: true, trailing: true });
        this._providers = new Set();
        this._navigation = navigation;
        this._commands = commands;
        this._results$ = this._getResults();
        this._disposable.add(ts_disposables_1.Disposable.create(function () {
            _this._providers.forEach(function (x) { return x.dispose(); });
            _this._providers.clear();
        }));
    }
    WorkspaceFinderService.prototype._getResults = function () {
        var _this = this;
        var providers = rxjs_1.Observable.defer(function () {
            /* tslint:disable-next-line:no-any */
            return rxjs_1.Observable.from(_this._providers)
                .mergeMap(function (x) { return x.results; }, function (provider, results) { return ({ provider: provider, results: results }); })
                .scan(function (acc, _a) {
                var provider = _a.provider, results = _a.results;
                acc.set(provider, results);
                return acc;
            }, new Map());
        });
        return rxjs_1.Observable.combineLatest(providers, this._filter$)
            .map(function (_a) {
            var map = _a[0], filter = _a[1];
            // atom.project.relativizePath(item.filePath)
            var iterator = map.values();
            var result = iterator.next();
            var results = [];
            while (!result.done) {
                results.push.apply(results, _.map(_.take(result.value, MAX_ITEMS), function (value) {
                    value.filePath = atom.project.relativizePath(value.filePath)[1];
                    return value;
                }));
                result = iterator.next();
            }
            return { filter: filter, results: results };
        });
    };
    WorkspaceFinderService.prototype.registerProvider = function (provider) {
        var _this = this;
        this._disposable.add(this._commands.add(Services.AtomCommands.CommandType.Workspace, "finder-workspace", function () { return _this.open(); }));
        var sub = this._filterObservable$.subscribe(provider.filter);
        this._providers.add(provider);
        return ts_disposables_1.Disposable.create(function () {
            sub.unsubscribe();
            _this._providers.delete(provider);
        });
    };
    WorkspaceFinderService.prototype.open = function () {
        var view = new WorkspaceFinderView_1.WorkspaceFinderView(this._commands, this._navigation, this._results$, this._filter$);
        view.setMaxItems(MAX_ITEMS);
    };
    WorkspaceFinderService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(Services.IWorkspaceFinderService), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, AtomCommands_1.AtomCommands])
    ], WorkspaceFinderService);
    return WorkspaceFinderService;
}(ts_disposables_1.DisposableBase));
exports.WorkspaceFinderService = WorkspaceFinderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya3NwYWNlRmluZGVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL1dvcmtzcGFjZUZpbmRlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUFvQyxNQUFNLENBQUMsQ0FBQTtBQUMzQyxJQUFZLFFBQVEsV0FBTSx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2xELDJCQUFrQyxrQ0FBa0MsQ0FBQyxDQUFBO0FBQ3JFLCtCQUEyQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzVELDZCQUE2QixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzlDLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBQ2xELG9DQUFvQyw2QkFBNkIsQ0FBQyxDQUFBO0FBRWxFLElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUl0QjtJQUE0QywwQ0FBYztJQVF0RCxnQ0FBWSxVQUEwQixFQUFFLFFBQXNCO1FBUmxFLGlCQXFFQztRQTVETyxpQkFBTyxDQUFDO1FBTkosYUFBUSxHQUFHLElBQUksY0FBTyxFQUFVLENBQUM7UUFDakMsdUJBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6RyxlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQXFDLENBQUM7UUFLOUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2hCLDJCQUFVLENB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LFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0scUNBQUksR0FBWDtRQUNJLElBQU0sSUFBSSxHQUFHLElBQUkseUNBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQXRFTDtRQUFDLHVCQUFVO1FBQ1Ysa0JBQUssQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUM7OzhCQUFBO0lBc0V4Qyw2QkFBQztBQUFELENBQUMsQUFyRUQsQ0FBNEMsK0JBQWMsR0FxRXpEO0FBckVZLDhCQUFzQix5QkFxRWxDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0ICogYXMgU2VydmljZXMgZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21OYXZpZ2F0aW9uIH0gZnJvbSAnLi9BdG9tTmF2aWdhdGlvbic7XHJcbmltcG9ydCB7IFdvcmtzcGFjZUZpbmRlclZpZXcgfSBmcm9tICcuL3ZpZXdzL1dvcmtzcGFjZUZpbmRlclZpZXcnO1xyXG5cclxuY29uc3QgTUFYX0lURU1TID0gMTAwO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKFNlcnZpY2VzLklXb3Jrc3BhY2VGaW5kZXJTZXJ2aWNlKVxyXG5leHBvcnQgY2xhc3MgV29ya3NwYWNlRmluZGVyU2VydmljZSBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgU2VydmljZXMuSVdvcmtzcGFjZUZpbmRlclNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb247XHJcbiAgICBwcml2YXRlIF9jb21tYW5kczogQXRvbUNvbW1hbmRzO1xyXG4gICAgcHJpdmF0ZSBfZmlsdGVyJCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgIHByaXZhdGUgX2ZpbHRlck9ic2VydmFibGUkID0gdGhpcy5fZmlsdGVyJC5hc09ic2VydmFibGUoKS5sb2Rhc2hUaHJvdHRsZSgzMDAsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IHRydWUgfSk7XHJcbiAgICBwcml2YXRlIF9wcm92aWRlcnMgPSBuZXcgU2V0PFNlcnZpY2VzLklXb3Jrc3BhY2VGaW5kZXJQcm92aWRlcj4oKTtcclxuICAgIHByaXZhdGUgX3Jlc3VsdHMkOiBPYnNlcnZhYmxlPHsgZmlsdGVyOiBzdHJpbmc7IHJlc3VsdHM6IFNlcnZpY2VzLkZpbmRlci5JUmVzcG9uc2VbXSB9PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbiwgY29tbWFuZHM6IEF0b21Db21tYW5kcykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbiA9IG5hdmlnYXRpb247XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZHMgPSBjb21tYW5kcztcclxuICAgICAgICB0aGlzLl9yZXN1bHRzJCA9IHRoaXMuX2dldFJlc3VsdHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIERpc3Bvc2FibGUuY3JlYXRlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Byb3ZpZGVycy5mb3JFYWNoKHggPT4geC5kaXNwb3NlKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvdmlkZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRSZXN1bHRzKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVycyA9IE9ic2VydmFibGUuZGVmZXIoKCkgPT4ge1xyXG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55ICovXHJcbiAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb208U2VydmljZXMuSVdvcmtzcGFjZUZpbmRlclByb3ZpZGVyPig8YW55PnRoaXMuX3Byb3ZpZGVycylcclxuICAgICAgICAgICAgICAgIC5tZXJnZU1hcCh4ID0+IHgucmVzdWx0cywgKHByb3ZpZGVyLCByZXN1bHRzKSA9PiAoeyBwcm92aWRlciwgcmVzdWx0cyB9KSlcclxuICAgICAgICAgICAgICAgIC5zY2FuPE1hcDxTZXJ2aWNlcy5JV29ya3NwYWNlRmluZGVyUHJvdmlkZXIsIFNlcnZpY2VzLkZpbmRlci5JUmVzcG9uc2VbXT4+KFxyXG4gICAgICAgICAgICAgICAgKGFjYywgeyBwcm92aWRlciwgcmVzdWx0cyB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWNjLnNldChwcm92aWRlciwgcmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBuZXcgTWFwPFNlcnZpY2VzLklXb3Jrc3BhY2VGaW5kZXJQcm92aWRlciwgU2VydmljZXMuRmluZGVyLklSZXNwb25zZVtdPigpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuY29tYmluZUxhdGVzdChwcm92aWRlcnMsIHRoaXMuX2ZpbHRlciQpXHJcbiAgICAgICAgICAgIC5tYXAoKFttYXAsIGZpbHRlcl0pID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChpdGVtLmZpbGVQYXRoKVxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBtYXAudmFsdWVzKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0czogU2VydmljZXMuRmluZGVyLklSZXNwb25zZVtdID0gW107XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIXJlc3VsdC5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKC4uLl8ubWFwKF8udGFrZShyZXN1bHQudmFsdWUsIE1BWF9JVEVNUyksIHZhbHVlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuZmlsZVBhdGggPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgodmFsdWUuZmlsZVBhdGgpWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGZpbHRlciwgcmVzdWx0cyB9O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJQcm92aWRlcihwcm92aWRlcjogU2VydmljZXMuSVdvcmtzcGFjZUZpbmRlclByb3ZpZGVyKSB7XHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbW1hbmRzLmFkZChTZXJ2aWNlcy5BdG9tQ29tbWFuZHMuQ29tbWFuZFR5cGUuV29ya3NwYWNlLCBgZmluZGVyLXdvcmtzcGFjZWAsICgpID0+IHRoaXMub3BlbigpKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY29uc3Qgc3ViID0gdGhpcy5fZmlsdGVyT2JzZXJ2YWJsZSQuc3Vic2NyaWJlKHByb3ZpZGVyLmZpbHRlcik7XHJcbiAgICAgICAgdGhpcy5fcHJvdmlkZXJzLmFkZChwcm92aWRlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBEaXNwb3NhYmxlLmNyZWF0ZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHN1Yi51bnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9wcm92aWRlcnMuZGVsZXRlKHByb3ZpZGVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3BlbigpIHtcclxuICAgICAgICBjb25zdCB2aWV3ID0gbmV3IFdvcmtzcGFjZUZpbmRlclZpZXcodGhpcy5fY29tbWFuZHMsIHRoaXMuX25hdmlnYXRpb24sIHRoaXMuX3Jlc3VsdHMkLCB0aGlzLl9maWx0ZXIkKTtcclxuICAgICAgICB2aWV3LnNldE1heEl0ZW1zKE1BWF9JVEVNUyk7XHJcbiAgICB9XHJcbn1cclxuIl19