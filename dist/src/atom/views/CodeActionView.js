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
var _ = require('lodash');
var createObservable_1 = require('../../helpers/createObservable');
var FilterSelectListView_1 = require('./FilterSelectListView');
var CodeActionView = (function (_super) {
    __extends(CodeActionView, _super);
    function CodeActionView(commands, viewFinder, editor) {
        var _this = this;
        _super.call(this, commands);
        this.root.classList.add('code-actions-overlay');
        this._decoration = editor.decorateMarker(editor.getLastCursor().getMarker(), { type: 'overlay', position: 'tail', item: this.root });
        _.delay(function () { return _this._filterEditorView.focus(); });
        this._codeaction$ = createObservable_1.createObservable(function (observer) {
            _this._codeactionObserver = observer;
            _this._disposable.add(observer);
        }).share();
        this._disposable.add(function () { return _this._decoration.destroy(); });
    }
    CodeActionView.prototype.cancelled = function () { };
    Object.defineProperty(CodeActionView.prototype, "filterKeys", {
        get: function () {
            return [
                { name: 'id', weight: 0.2 },
                { name: 'name', weight: 0.5 },
                { name: 'title', weight: 0.3 }
            ];
        },
        enumerable: true,
        configurable: true
    });
    CodeActionView.prototype.confirmed = function (item) {
        if (this._codeactionObserver) {
            this._codeactionObserver.next(item);
        }
    };
    Object.defineProperty(CodeActionView.prototype, "codeaction$", {
        get: function () { return this._codeaction$; },
        enumerable: true,
        configurable: true
    });
    CodeActionView.prototype.viewForItem = function (value) {
        var element = document.createElement('li');
        element.classList.add('event');
        var span = document.createElement('span');
        span.innerText = value.item.name;
        span.title = value.item.title;
        element.appendChild(span);
        return element;
    };
    return CodeActionView;
}(FilterSelectListView_1.FilterSelectListView));
exports.CodeActionView = CodeActionView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUFjdGlvblZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXRvbS92aWV3cy9Db2RlQWN0aW9uVmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFHNUIsaUNBQWlDLGdDQUFnQyxDQUFDLENBQUE7QUFHbEUscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFFOUQ7SUFBb0Msa0NBQThDO0lBSzlFLHdCQUFtQixRQUFzQixFQUFFLFVBQTBCLEVBQUUsTUFBdUI7UUFMbEcsaUJBcURDO1FBL0NPLGtCQUFNLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FDcEMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUNsQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUN6RCxDQUFDO1FBRUYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUE5QixDQUE4QixDQUFDLENBQUM7UUFFOUMsSUFBSSxDQUFDLFlBQVksR0FBRyxtQ0FBZ0IsQ0FBMkIsVUFBQSxRQUFRO1lBQ25FLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUM7WUFDcEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFWCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDaEIsY0FBTSxPQUFBLEtBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQTFCLENBQTBCLENBQ25DLENBQUM7SUFDTixDQUFDO0lBRU0sa0NBQVMsR0FBaEIsY0FBMkIsQ0FBQztJQUU1QixzQkFBVyxzQ0FBVTthQUFyQjtZQUNJLE1BQU0sQ0FBQztnQkFDSCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtnQkFDM0IsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQzdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO2FBQ2pDLENBQUM7UUFDTixDQUFDOzs7T0FBQTtJQUVNLGtDQUFTLEdBQWhCLFVBQWlCLElBQThCO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDO0lBQ0wsQ0FBQztJQUVELHNCQUFXLHVDQUFXO2FBQXRCLGNBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFL0Msb0NBQVcsR0FBbEIsVUFBbUIsS0FBNEM7UUFDM0QsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM5QixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQXJERCxDQUFvQywyQ0FBb0IsR0FxRHZEO0FBckRZLHNCQUFjLGlCQXFEMUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiAgQGxpY2Vuc2UgICBNSVRcclxuICogIEBjb3B5cmlnaHQgT21uaVNoYXJwIFRlYW1cclxuICogIEBzdW1tYXJ5ICAgQWRkcyBzdXBwb3J0IGZvciBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L2xhbmd1YWdlLXNlcnZlci1wcm90b2NvbCAoYW5kIG1vcmUhKSB0byBodHRwczovL2F0b20uaW9cclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBHZXRDb2RlQWN0aW9ucyB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNyZWF0ZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9oZWxwZXJzL2NyZWF0ZU9ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tVmlld0ZpbmRlciB9IGZyb20gJy4uL0F0b21WaWV3RmluZGVyJztcclxuaW1wb3J0IHsgRmlsdGVyU2VsZWN0TGlzdFZpZXcgfSBmcm9tICcuL0ZpbHRlclNlbGVjdExpc3RWaWV3JztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb2RlQWN0aW9uVmlldyBleHRlbmRzIEZpbHRlclNlbGVjdExpc3RWaWV3PEdldENvZGVBY3Rpb25zLklSZXNwb25zZT4ge1xyXG4gICAgcHJpdmF0ZSBfZGVjb3JhdGlvbjogQXRvbS5EZWNvcmF0aW9uO1xyXG4gICAgcHJpdmF0ZSBfY29kZWFjdGlvbiQ6IE9ic2VydmFibGU8R2V0Q29kZUFjdGlvbnMuSVJlc3BvbnNlPjtcclxuICAgIHByaXZhdGUgX2NvZGVhY3Rpb25PYnNlcnZlcjogU3Vic2NyaWJlcjxHZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2U+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21tYW5kczogQXRvbUNvbW1hbmRzLCB2aWV3RmluZGVyOiBBdG9tVmlld0ZpbmRlciwgZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpIHtcclxuICAgICAgICBzdXBlcihjb21tYW5kcyk7XHJcbiAgICAgICAgdGhpcy5yb290LmNsYXNzTGlzdC5hZGQoJ2NvZGUtYWN0aW9ucy1vdmVybGF5Jyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlY29yYXRpb24gPSBlZGl0b3IuZGVjb3JhdGVNYXJrZXIoXHJcbiAgICAgICAgICAgIGVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0TWFya2VyKCksXHJcbiAgICAgICAgICAgIHsgdHlwZTogJ292ZXJsYXknLCBwb3NpdGlvbjogJ3RhaWwnLCBpdGVtOiB0aGlzLnJvb3QgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIF8uZGVsYXkoKCkgPT4gdGhpcy5fZmlsdGVyRWRpdG9yVmlldy5mb2N1cygpKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29kZWFjdGlvbiQgPSBjcmVhdGVPYnNlcnZhYmxlPEdldENvZGVBY3Rpb25zLklSZXNwb25zZT4ob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlYWN0aW9uT2JzZXJ2ZXIgPSBvYnNlcnZlcjtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQob2JzZXJ2ZXIpO1xyXG4gICAgICAgIH0pLnNoYXJlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICAoKSA9PiB0aGlzLl9kZWNvcmF0aW9uLmRlc3Ryb3koKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhbmNlbGxlZCgpIHsgLyogKi8gfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZmlsdGVyS2V5cygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IG5hbWU6ICdpZCcsIHdlaWdodDogMC4yIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ25hbWUnLCB3ZWlnaHQ6IDAuNSB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICd0aXRsZScsIHdlaWdodDogMC4zIH1cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb25maXJtZWQoaXRlbTogR2V0Q29kZUFjdGlvbnMuSVJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVhY3Rpb25PYnNlcnZlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlYWN0aW9uT2JzZXJ2ZXIubmV4dChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb2RlYWN0aW9uJCgpIHsgcmV0dXJuIHRoaXMuX2NvZGVhY3Rpb24kOyB9XHJcblxyXG4gICAgcHVibGljIHZpZXdGb3JJdGVtKHZhbHVlOiBmdXNlLlJlc3VsdDxHZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2U+KSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdldmVudCcpO1xyXG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbi5pbm5lclRleHQgPSB2YWx1ZS5pdGVtLm5hbWU7XHJcbiAgICAgICAgc3Bhbi50aXRsZSA9IHZhbHVlLml0ZW0udGl0bGU7XHJcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxufVxyXG4iXX0=