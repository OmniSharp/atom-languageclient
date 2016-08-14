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
var decorators_2 = require('../decorators');
var AtomCommands_1 = require('./AtomCommands');
var AtomNavigation_1 = require('./AtomNavigation');
var CommandsService_1 = require('./CommandsService');
var WorkspaceFinderView_1 = require('./views/WorkspaceFinderView');
var MAX_ITEMS = 100;
var WorkspaceFinderService = (function (_super) {
    __extends(WorkspaceFinderService, _super);
    function WorkspaceFinderService(navigation, commands, atomCommands) {
        var _this = this;
        _super.call(this);
        this._filter$ = new rxjs_1.Subject();
        this._filterObservable$ = this._filter$.asObservable().lodashThrottle(300, { leading: true, trailing: true });
        this._providers = new Set();
        this._navigation = navigation;
        this._commands = commands;
        this._atomCommands = atomCommands;
        this._results$ = this._getResults();
        this._disposable.add(ts_disposables_1.Disposable.create(function () {
            _this._providers.forEach(function (x) { return x.dispose(); });
            _this._providers.clear();
        }));
    }
    WorkspaceFinderService.prototype.onEnabled = function () {
        var _this = this;
        return this._commands.add(atom_languageservices_1.CommandType.Workspace, "finder-workspace", ['ctrl-,', 'alt-shift-t'], function () { return _this.open(); });
    };
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
        var sub = this._filterObservable$.subscribe(provider.filter);
        this._providers.add(provider);
        return ts_disposables_1.Disposable.create(function () {
            sub.unsubscribe();
            _this._providers.delete(provider);
        });
    };
    WorkspaceFinderService.prototype.open = function () {
        var view = new WorkspaceFinderView_1.WorkspaceFinderView(this._atomCommands, this._navigation, this._results$, this._filter$);
        view.setMaxItems(MAX_ITEMS);
    };
    WorkspaceFinderService = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IWorkspaceFinderService),
        decorators_2.atomConfig({
            default: true,
            description: 'Adds ability to find all symbols on a servers workspace'
        }), 
        __metadata('design:paramtypes', [AtomNavigation_1.AtomNavigation, CommandsService_1.CommandsService, AtomCommands_1.AtomCommands])
    ], WorkspaceFinderService);
    return WorkspaceFinderService;
}(ts_disposables_1.DisposableBase));
exports.WorkspaceFinderService = WorkspaceFinderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya3NwYWNlRmluZGVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL1dvcmtzcGFjZUZpbmRlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUFvQyxNQUFNLENBQUMsQ0FBQTtBQUMzQyxzQ0FBdUYsdUJBQXVCLENBQUMsQ0FBQTtBQUMvRywyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBMkMsZ0JBQWdCLENBQUMsQ0FBQTtBQUM1RCwyQkFBMkIsZUFBZSxDQUFDLENBQUE7QUFDM0MsNkJBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFDOUMsK0JBQStCLGtCQUFrQixDQUFDLENBQUE7QUFDbEQsZ0NBQWdDLG1CQUFtQixDQUFDLENBQUE7QUFDcEQsb0NBQW9DLDZCQUE2QixDQUFDLENBQUE7QUFFbEUsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBUXRCO0lBQTRDLDBDQUFjO0lBU3RELGdDQUFZLFVBQTBCLEVBQUUsUUFBeUIsRUFBRSxZQUEwQjtRQVRqRyxpQkF3RUM7UUE5RE8saUJBQU8sQ0FBQztRQU5KLGFBQVEsR0FBRyxJQUFJLGNBQU8sRUFBVSxDQUFDO1FBQ2pDLHVCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDekcsZUFBVSxHQUFHLElBQUksR0FBRyxFQUE0QixDQUFDO1FBS3JELElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFD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QyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlCLE1BQU0sQ0FBQywyQkFBVSxDQUFDLE1BQU0sQ0FBQztZQUNyQixHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0scUNBQUksR0FBWDtRQUNJLElBQU0sSUFBSSxHQUFHLElBQUkseUNBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQTdFTDtRQUFDLHVCQUFVO1FBQ1Ysa0JBQUssQ0FBQywrQ0FBdUIsQ0FBQztRQUM5Qix1QkFBVSxDQUFDO1lBQ1IsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXLEVBQUUseURBQXlEO1NBQ3pFLENBQUM7OzhCQUFBO0lBeUVGLDZCQUFDO0FBQUQsQ0FBQyxBQXhFRCxDQUE0QywrQkFBYyxHQXdFekQ7QUF4RVksOEJBQXNCLHlCQXdFbEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDb21tYW5kVHlwZSwgRmluZGVyLCBJV29ya3NwYWNlRmluZGVyUHJvdmlkZXIsIElXb3Jrc3BhY2VGaW5kZXJTZXJ2aWNlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgYWxpYXMsIGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IERpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlIH0gZnJvbSAndHMtZGlzcG9zYWJsZXMnO1xyXG5pbXBvcnQgeyBhdG9tQ29uZmlnIH0gZnJvbSAnLi4vZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEF0b21Db21tYW5kcyB9IGZyb20gJy4vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgQXRvbU5hdmlnYXRpb24gfSBmcm9tICcuL0F0b21OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgQ29tbWFuZHNTZXJ2aWNlIH0gZnJvbSAnLi9Db21tYW5kc1NlcnZpY2UnO1xyXG5pbXBvcnQgeyBXb3Jrc3BhY2VGaW5kZXJWaWV3IH0gZnJvbSAnLi92aWV3cy9Xb3Jrc3BhY2VGaW5kZXJWaWV3JztcclxuXHJcbmNvbnN0IE1BWF9JVEVNUyA9IDEwMDtcclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhJV29ya3NwYWNlRmluZGVyU2VydmljZSlcclxuQGF0b21Db25maWcoe1xyXG4gICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBhYmlsaXR5IHRvIGZpbmQgYWxsIHN5bWJvbHMgb24gYSBzZXJ2ZXJzIHdvcmtzcGFjZSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFdvcmtzcGFjZUZpbmRlclNlcnZpY2UgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElXb3Jrc3BhY2VGaW5kZXJTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX25hdmlnYXRpb246IEF0b21OYXZpZ2F0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY29tbWFuZHM6IENvbW1hbmRzU2VydmljZTtcclxuICAgIHByaXZhdGUgX2F0b21Db21tYW5kczogQXRvbUNvbW1hbmRzO1xyXG4gICAgcHJpdmF0ZSBfZmlsdGVyJCA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcclxuICAgIHByaXZhdGUgX2ZpbHRlck9ic2VydmFibGUkID0gdGhpcy5fZmlsdGVyJC5hc09ic2VydmFibGUoKS5sb2Rhc2hUaHJvdHRsZSgzMDAsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IHRydWUgfSk7XHJcbiAgICBwcml2YXRlIF9wcm92aWRlcnMgPSBuZXcgU2V0PElXb3Jrc3BhY2VGaW5kZXJQcm92aWRlcj4oKTtcclxuICAgIHByaXZhdGUgX3Jlc3VsdHMkOiBPYnNlcnZhYmxlPHsgZmlsdGVyOiBzdHJpbmc7IHJlc3VsdHM6IEZpbmRlci5JUmVzcG9uc2VbXSB9PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihuYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbiwgY29tbWFuZHM6IENvbW1hbmRzU2VydmljZSwgYXRvbUNvbW1hbmRzOiBBdG9tQ29tbWFuZHMpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRzID0gY29tbWFuZHM7XHJcbiAgICAgICAgdGhpcy5fYXRvbUNvbW1hbmRzID0gYXRvbUNvbW1hbmRzO1xyXG4gICAgICAgIHRoaXMuX3Jlc3VsdHMkID0gdGhpcy5fZ2V0UmVzdWx0cygpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJvdmlkZXJzLmZvckVhY2goeCA9PiB4LmRpc3Bvc2UoKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm92aWRlcnMuY2xlYXIoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRzLmFkZChDb21tYW5kVHlwZS5Xb3Jrc3BhY2UsIGBmaW5kZXItd29ya3NwYWNlYCwgWydjdHJsLSwnLCAnYWx0LXNoaWZ0LXQnXSwgKCkgPT4gdGhpcy5vcGVuKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFJlc3VsdHMoKSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXJzID0gT2JzZXJ2YWJsZS5kZWZlcigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgICAgICAgICAgcmV0dXJuIE9ic2VydmFibGUuZnJvbTxJV29ya3NwYWNlRmluZGVyUHJvdmlkZXI+KDxhbnk+dGhpcy5fcHJvdmlkZXJzKVxyXG4gICAgICAgICAgICAgICAgLm1lcmdlTWFwKHggPT4geC5yZXN1bHRzLCAocHJvdmlkZXIsIHJlc3VsdHMpID0+ICh7IHByb3ZpZGVyLCByZXN1bHRzIH0pKVxyXG4gICAgICAgICAgICAgICAgLnNjYW48TWFwPElXb3Jrc3BhY2VGaW5kZXJQcm92aWRlciwgRmluZGVyLklSZXNwb25zZVtdPj4oXHJcbiAgICAgICAgICAgICAgICAoYWNjLCB7IHByb3ZpZGVyLCByZXN1bHRzIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhY2Muc2V0KHByb3ZpZGVyLCByZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG5ldyBNYXA8SVdvcmtzcGFjZUZpbmRlclByb3ZpZGVyLCBGaW5kZXIuSVJlc3BvbnNlW10+KCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KHByb3ZpZGVycywgdGhpcy5fZmlsdGVyJClcclxuICAgICAgICAgICAgLm1hcCgoW21hcCwgZmlsdGVyXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGl0ZW0uZmlsZVBhdGgpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVyYXRvciA9IG1hcC52YWx1ZXMoKTtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRzOiBGaW5kZXIuSVJlc3BvbnNlW10gPSBbXTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goLi4uXy5tYXAoXy50YWtlKHJlc3VsdC52YWx1ZSwgTUFYX0lURU1TKSwgdmFsdWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5maWxlUGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aCh2YWx1ZS5maWxlUGF0aClbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZmlsdGVyLCByZXN1bHRzIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWdpc3RlclByb3ZpZGVyKHByb3ZpZGVyOiBJV29ya3NwYWNlRmluZGVyUHJvdmlkZXIpIHtcclxuICAgICAgICBjb25zdCBzdWIgPSB0aGlzLl9maWx0ZXJPYnNlcnZhYmxlJC5zdWJzY3JpYmUocHJvdmlkZXIuZmlsdGVyKTtcclxuICAgICAgICB0aGlzLl9wcm92aWRlcnMuYWRkKHByb3ZpZGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIERpc3Bvc2FibGUuY3JlYXRlKCgpID0+IHtcclxuICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb3ZpZGVycy5kZWxldGUocHJvdmlkZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKCkge1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgV29ya3NwYWNlRmluZGVyVmlldyh0aGlzLl9hdG9tQ29tbWFuZHMsIHRoaXMuX25hdmlnYXRpb24sIHRoaXMuX3Jlc3VsdHMkLCB0aGlzLl9maWx0ZXIkKTtcclxuICAgICAgICB2aWV3LnNldE1heEl0ZW1zKE1BWF9JVEVNUyk7XHJcbiAgICB9XHJcbn1cclxuIl19