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
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var decorators_1 = require('atom-languageservices/decorators');
var ProjectProvider_1 = require('./ProjectProvider');
/* tslint:disable-next-line:variable-name */
exports.IProjectTracker = Symbol.for('IProjectTracker');
var ProjectTracker = (function () {
    function ProjectTracker(provider) {
        var _this = this;
        this._projectPaths = [];
        var base = rxjs_1.Observable.create(function (observer) {
            _this._projectsObserver = observer;
            _this._updatePaths(provider.getPaths());
            var disposable = provider.onDidChangePaths(function (paths) {
                _this._updatePaths(paths);
            });
            return function () { return disposable.dispose(); };
        })
            .share();
        this._added = rxjs_1.Observable.merge(rxjs_1.Observable.defer(function () { return rxjs_1.Observable.from(_this._projectPaths); }), base.mergeMap(function (_a) {
            var added = _a[0];
            return added;
        }));
        this._removed = base.mergeMap(function (_a) {
            var removed = _a[1];
            return removed;
        });
    }
    Object.defineProperty(ProjectTracker.prototype, "added", {
        get: function () { return this._added; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectTracker.prototype, "removed", {
        get: function () { return this._removed; },
        enumerable: true,
        configurable: true
    });
    ProjectTracker.prototype._updatePaths = function (paths) {
        var addedPaths = _.difference(paths, this._projectPaths);
        var removedPaths = _.difference(this._projectPaths, paths);
        this._projectsObserver
            .next([addedPaths, removedPaths]);
        this._projectPaths = paths;
    };
    ProjectTracker = __decorate([
        decorators_1.injectable,
        decorators_1.alias(exports.IProjectTracker), 
        __metadata('design:paramtypes', [ProjectProvider_1.ProjectProvider])
    ], ProjectTracker);
    return ProjectTracker;
}());
exports.ProjectTracker = ProjectTracker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvamVjdFRyYWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9Qcm9qZWN0VHJhY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUF1QyxNQUFNLENBQUMsQ0FBQTtBQUM5QywyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSxnQ0FBZ0MsbUJBQW1CLENBQUMsQ0FBQTtBQUVwRCw0Q0FBNEM7QUFDL0IsdUJBQWUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFRN0Q7SUFTSSx3QkFBbUIsUUFBeUI7UUFUaEQsaUJBc0NDO1FBckNXLGtCQUFhLEdBQWEsRUFBRSxDQUFDO1FBU2pDLElBQU0sSUFBSSxHQUFxQyxpQkFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFFBQTBDO1lBQ3hHLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7WUFFbEMsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN2QyxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBQyxLQUFLO2dCQUMvQyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQXBCLENBQW9CLENBQUM7UUFDdEMsQ0FBQyxDQUFDO2FBQ0csS0FBSyxFQUFFLENBQUM7UUFFYixJQUFJLENBQUMsTUFBTSxHQUFHLGlCQUFVLENBQUMsS0FBSyxDQUMxQixpQkFBVSxDQUFDLEtBQUssQ0FBQyxjQUFNLE9BQUEsaUJBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLEVBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsVUFBQyxFQUFPO2dCQUFOLGFBQUs7WUFBTSxPQUFBLEtBQUs7UUFBTCxDQUFLLENBQUMsQ0FDcEMsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFDLEVBQVc7Z0JBQVIsZUFBTztZQUFNLE9BQUEsT0FBTztRQUFQLENBQU8sQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFyQkQsc0JBQVcsaUNBQUs7YUFBaEIsY0FBcUIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMxQyxzQkFBVyxtQ0FBTzthQUFsQixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBc0J0QyxxQ0FBWSxHQUFwQixVQUFxQixLQUFlO1FBQ2hDLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMzRCxJQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLGlCQUFpQjthQUNqQixJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBdkNMO1FBQUMsdUJBQVU7UUFDVixrQkFBSyxDQUFDLHVCQUFlLENBQUM7O3NCQUFBO0lBdUN2QixxQkFBQztBQUFELENBQUMsQUF0Q0QsSUFzQ0M7QUF0Q1ksc0JBQWMsaUJBc0MxQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBQcm9qZWN0UHJvdmlkZXIgfSBmcm9tICcuL1Byb2plY3RQcm92aWRlcic7XHJcblxyXG4vKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZSAqL1xyXG5leHBvcnQgY29uc3QgSVByb2plY3RUcmFja2VyID0gU3ltYm9sLmZvcignSVByb2plY3RUcmFja2VyJyk7XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVByb2plY3RUcmFja2VyIHtcclxuICAgIHJlYWRvbmx5IGFkZGVkOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgICByZWFkb25seSByZW1vdmVkOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbn1cclxuXHJcbkBpbmplY3RhYmxlXHJcbkBhbGlhcyhJUHJvamVjdFRyYWNrZXIpXHJcbmV4cG9ydCBjbGFzcyBQcm9qZWN0VHJhY2tlciB7XHJcbiAgICBwcml2YXRlIF9wcm9qZWN0UGF0aHM6IHN0cmluZ1tdID0gW107XHJcbiAgICBwcml2YXRlIF9wcm9qZWN0c09ic2VydmVyOiBTdWJzY3JpYmVyPFtzdHJpbmdbXSwgc3RyaW5nW11dPjtcclxuICAgIHByaXZhdGUgX2FkZGVkOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcbiAgICBwcml2YXRlIF9yZW1vdmVkOiBPYnNlcnZhYmxlPHN0cmluZz47XHJcblxyXG4gICAgcHVibGljIGdldCBhZGRlZCgpIHsgcmV0dXJuIHRoaXMuX2FkZGVkOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlbW92ZWQoKSB7IHJldHVybiB0aGlzLl9yZW1vdmVkOyB9XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByb3ZpZGVyOiBQcm9qZWN0UHJvdmlkZXIpIHtcclxuICAgICAgICBjb25zdCBiYXNlOiBPYnNlcnZhYmxlPFtzdHJpbmdbXSwgc3RyaW5nW11dPiA9IE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcjogU3Vic2NyaWJlcjxbc3RyaW5nW10sIHN0cmluZ1tdXT4pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fcHJvamVjdHNPYnNlcnZlciA9IG9ic2VydmVyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGF0aHMocHJvdmlkZXIuZ2V0UGF0aHMoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBwcm92aWRlci5vbkRpZENoYW5nZVBhdGhzKChwYXRocykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGF0aHMocGF0aHMpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc2hhcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYWRkZWQgPSBPYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICBPYnNlcnZhYmxlLmRlZmVyKCgpID0+IE9ic2VydmFibGUuZnJvbSh0aGlzLl9wcm9qZWN0UGF0aHMpKSxcclxuICAgICAgICAgICAgYmFzZS5tZXJnZU1hcCgoW2FkZGVkXSkgPT4gYWRkZWQpXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLl9yZW1vdmVkID0gYmFzZS5tZXJnZU1hcCgoWywgcmVtb3ZlZF0pID0+IHJlbW92ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVBhdGhzKHBhdGhzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIGNvbnN0IGFkZGVkUGF0aHMgPSBfLmRpZmZlcmVuY2UocGF0aHMsIHRoaXMuX3Byb2plY3RQYXRocyk7XHJcbiAgICAgICAgY29uc3QgcmVtb3ZlZFBhdGhzID0gXy5kaWZmZXJlbmNlKHRoaXMuX3Byb2plY3RQYXRocywgcGF0aHMpO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9qZWN0c09ic2VydmVyXHJcbiAgICAgICAgICAgIC5uZXh0KFthZGRlZFBhdGhzLCByZW1vdmVkUGF0aHNdKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcHJvamVjdFBhdGhzID0gcGF0aHM7XHJcbiAgICB9XHJcbn1cclxuIl19