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
var atom_languageservices_1 = require('atom-languageservices');
exports.IStatusBarService = atom_languageservices_1.IStatusBarService;
exports.StatusBar = atom_languageservices_1.StatusBar;
var ts_disposables_1 = require('ts-disposables');
var StatusBarService = (function (_super) {
    __extends(StatusBarService, _super);
    function StatusBarService() {
        _super.call(this);
    }
    StatusBarService.prototype.addTile = function (_a) {
        var position = _a.position, item = _a.item, priority = _a.priority;
        var tile;
        if (position === atom_languageservices_1.StatusBar.Position.Left) {
            tile = this._api.addLeftTile({ item: item, priority: priority });
        }
        else {
            tile = this._api.addRightTile({ item: item, priority: priority });
        }
        return ts_disposables_1.Disposable.create(function () { return tile.destroy(); });
    };
    Object.defineProperty(StatusBarService.prototype, "api", {
        set: function (value) {
            this._api = value;
        },
        enumerable: true,
        configurable: true
    });
    return StatusBarService;
}(ts_disposables_1.DisposableBase));
exports.StatusBarService = StatusBarService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdHVzQmFyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hdG9tL1N0YXR1c0JhclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILHNDQUE2Qyx1QkFBdUIsQ0FBQyxDQUFBO0FBRTVELHlCQUFpQjtBQUFFLGlCQUFTO0FBRHJDLCtCQUEyQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBRzVEO0lBQXNDLG9DQUFjO0lBRWhEO1FBQ0ksaUJBQU8sQ0FBQztJQUNaLENBQUM7SUFFTSxrQ0FBTyxHQUFkLFVBQWUsRUFBa0c7WUFBakcsc0JBQVEsRUFBRSxjQUFJLEVBQUUsc0JBQVE7UUFDcEMsSUFBSSxJQUFvQixDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxpQ0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLFVBQUksRUFBRSxrQkFBUSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxVQUFJLEVBQUUsa0JBQVEsRUFBRSxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUVELE1BQU0sQ0FBQywyQkFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxzQkFBVyxpQ0FBRzthQUFkLFVBQWUsS0FBb0I7WUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFDTCx1QkFBQztBQUFELENBQUMsQUFwQkQsQ0FBc0MsK0JBQWMsR0FvQm5EO0FBcEJZLHdCQUFnQixtQkFvQjVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgeyBJU3RhdHVzQmFyU2VydmljZSwgU3RhdHVzQmFyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZSwgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmV4cG9ydCB7IElTdGF0dXNCYXJTZXJ2aWNlLCBTdGF0dXNCYXIgfTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0dXNCYXJTZXJ2aWNlIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJU3RhdHVzQmFyU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9hcGk6IFN0YXR1c0Jhci5BcGk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRUaWxlKHtwb3NpdGlvbiwgaXRlbSwgcHJpb3JpdHl9OiB7IHBvc2l0aW9uOiBTdGF0dXNCYXIuUG9zaXRpb247IGl0ZW06IEhUTUxFbGVtZW50OyBwcmlvcml0eTogbnVtYmVyOyB9KSB7XHJcbiAgICAgICAgbGV0IHRpbGU6IFN0YXR1c0Jhci5UaWxlO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gU3RhdHVzQmFyLlBvc2l0aW9uLkxlZnQpIHtcclxuICAgICAgICAgICAgdGlsZSA9IHRoaXMuX2FwaS5hZGRMZWZ0VGlsZSh7IGl0ZW0sIHByaW9yaXR5IH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRpbGUgPSB0aGlzLl9hcGkuYWRkUmlnaHRUaWxlKHsgaXRlbSwgcHJpb3JpdHkgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gRGlzcG9zYWJsZS5jcmVhdGUoKCkgPT4gdGlsZS5kZXN0cm95KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgYXBpKHZhbHVlOiBTdGF0dXNCYXIuQXBpKSB7XHJcbiAgICAgICAgdGhpcy5fYXBpID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuIl19