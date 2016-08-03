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
var constants_1 = require('../../constants');
var DiagnosticsView_1 = require('./DiagnosticsView');
var FlameView_1 = require('./FlameView');
var View_1 = require('../../atom/views/View');
var StatusBarView = (function (_super) {
    __extends(StatusBarView, _super);
    function StatusBarView() {
        _super.call(this, document.createElement('span'));
        this.root.classList.add(constants_1.packageName);
        this._flame = new FlameView_1.FlameView();
        this.root.appendChild(this._flame.root);
        this._diagnostics = new DiagnosticsView_1.DiagnosticsView();
        this.root.appendChild(this._diagnostics.root);
    }
    return StatusBarView;
}(View_1.View));
exports.StatusBarView = StatusBarView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdHVzQmFyVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91aS92aWV3cy9TdGF0dXNCYXJWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwwQkFBNEIsaUJBQWlCLENBQUMsQ0FBQTtBQUM5QyxnQ0FBZ0MsbUJBQW1CLENBQUMsQ0FBQTtBQUNwRCwwQkFBMEIsYUFBYSxDQUFDLENBQUE7QUFDeEMscUJBQXFCLHVCQUF1QixDQUFDLENBQUE7QUFFN0M7SUFBbUMsaUNBQXFCO0lBSXBEO1FBQ0ksa0JBQU0sUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBVyxDQUFDLENBQUM7UUFFckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQUFDLEFBZEQsQ0FBbUMsV0FBSSxHQWN0QztBQWRZLHFCQUFhLGdCQWN6QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBEaWFnbm9zdGljc1ZpZXcgfSBmcm9tICcuL0RpYWdub3N0aWNzVmlldyc7XHJcbmltcG9ydCB7IEZsYW1lVmlldyB9IGZyb20gJy4vRmxhbWVWaWV3JztcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4uLy4uL2F0b20vdmlld3MvVmlldyc7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdHVzQmFyVmlldyBleHRlbmRzIFZpZXc8SFRNTFNwYW5FbGVtZW50PiB7XHJcbiAgICBwcml2YXRlIF9mbGFtZTogRmxhbWVWaWV3O1xyXG4gICAgcHJpdmF0ZSBfZGlhZ25vc3RpY3M6IERpYWdub3N0aWNzVmlldztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykpO1xyXG4gICAgICAgIHRoaXMucm9vdC5jbGFzc0xpc3QuYWRkKHBhY2thZ2VOYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZmxhbWUgPSBuZXcgRmxhbWVWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5yb290LmFwcGVuZENoaWxkKHRoaXMuX2ZsYW1lLnJvb3QpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaWFnbm9zdGljcyA9IG5ldyBEaWFnbm9zdGljc1ZpZXcoKTtcclxuICAgICAgICB0aGlzLnJvb3QuYXBwZW5kQ2hpbGQodGhpcy5fZGlhZ25vc3RpY3Mucm9vdCk7XHJcbiAgICB9XHJcbn1cclxuIl19