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
var View_1 = require('../../atom/views/View');
var FlameView = (function (_super) {
    __extends(FlameView, _super);
    function FlameView() {
        _super.call(this, document.createElement('a'));
        this.root.classList.add(constants_1.packageName + "-button", 'flame');
        var outgoing = this._outgoing = document.createElement('span');
        outgoing.classList.add('outgoing-requests');
        this.root.appendChild(outgoing);
        var icon = this._icon = document.createElement('span');
        icon.classList.add('icon', 'icon-flame');
        this.root.appendChild(icon);
    }
    return FlameView;
}(View_1.View));
exports.FlameView = FlameView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmxhbWVWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3VpL3ZpZXdzL0ZsYW1lVmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsMEJBQTRCLGlCQUFpQixDQUFDLENBQUE7QUFDOUMscUJBQXFCLHVCQUF1QixDQUFDLENBQUE7QUFFN0M7SUFBK0IsNkJBQXVCO0lBSWxEO1FBQ0ksa0JBQU0sUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBSSx1QkFBVyxZQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFMUQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pFLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFaEMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLEFBaEJELENBQStCLFdBQUksR0FnQmxDO0FBaEJZLGlCQUFTLFlBZ0JyQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vLi4vYXRvbS92aWV3cy9WaWV3JztcclxuXHJcbmV4cG9ydCBjbGFzcyBGbGFtZVZpZXcgZXh0ZW5kcyBWaWV3PEhUTUxBbmNob3JFbGVtZW50PiB7XHJcbiAgICBwcml2YXRlIF9pY29uOiBIVE1MU3BhbkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9vdXRnb2luZzogSFRNTFNwYW5FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSk7XHJcbiAgICAgICAgdGhpcy5yb290LmNsYXNzTGlzdC5hZGQoYCR7cGFja2FnZU5hbWV9LWJ1dHRvbmAsICdmbGFtZScpO1xyXG5cclxuICAgICAgICBjb25zdCBvdXRnb2luZyA9IHRoaXMuX291dGdvaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIG91dGdvaW5nLmNsYXNzTGlzdC5hZGQoJ291dGdvaW5nLXJlcXVlc3RzJyk7XHJcbiAgICAgICAgdGhpcy5yb290LmFwcGVuZENoaWxkKG91dGdvaW5nKTtcclxuXHJcbiAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMuX2ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgaWNvbi5jbGFzc0xpc3QuYWRkKCdpY29uJywgJ2ljb24tZmxhbWUnKTtcclxuICAgICAgICB0aGlzLnJvb3QuYXBwZW5kQ2hpbGQoaWNvbik7XHJcbiAgICB9XHJcbn1cclxuIl19