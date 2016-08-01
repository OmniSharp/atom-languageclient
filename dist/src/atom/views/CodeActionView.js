/**
 *  @license   MIT
 *  @copyright OmniSharp Team
 *  @summary   Adds support for https://github.com/Microsoft/language-server-protocol (and more!) to https://atom.io
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var createObservable_1 = require('../../helpers/createObservable');
var FilterSelectListView_1 = require('./FilterSelectListView');
var CodeActionView = (function (_super) {
    __extends(CodeActionView, _super);
    function CodeActionView(commands, viewFinder, editor) {
        var _this = this;
        _super.call(this, commands);
        this.root.classList.add('code-actions-overlay');
        this._editor = editor;
        this._editorView = viewFinder.getView(editor);
        this._decoration = this._editor.decorateMarker(this._editor.getLastCursor().getMarker(), { type: 'overlay', position: 'tail', item: this.root });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUFjdGlvblZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXRvbS92aWV3cy9Db2RlQWN0aW9uVmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHOzs7Ozs7O0FBSUgsaUNBQWlDLGdDQUFnQyxDQUFDLENBQUE7QUFHbEUscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFFOUQ7SUFBb0Msa0NBQTBDO0lBTzFFLHdCQUFtQixRQUFzQixFQUFFLFVBQTBCLEVBQUUsTUFBdUI7UUFQbEcsaUJBdURDO1FBL0NPLGtCQUFNLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBMkIsTUFBTSxDQUFDLENBQUM7UUFFeEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFDeEMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FDekQsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZLEdBQUcsbUNBQWdCLENBQXVCLFVBQUEsUUFBUTtZQUMvRCxLQUFJLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDO1lBQ3BDLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRVgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2hCLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUExQixDQUEwQixDQUNuQyxDQUFDO0lBQ04sQ0FBQztJQUVNLGtDQUFTLEdBQWhCLGNBQTJCLENBQUM7SUFFNUIsc0JBQVcsc0NBQVU7YUFBckI7WUFDSSxNQUFNLENBQUM7Z0JBQ0gsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQzNCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUM3QixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTthQUNqQyxDQUFDO1FBQ04sQ0FBQzs7O09BQUE7SUFFTSxrQ0FBUyxHQUFoQixVQUFpQixJQUEwQjtRQUN2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNMLENBQUM7SUFFRCxzQkFBVyx1Q0FBVzthQUF0QixjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRS9DLG9DQUFXLEdBQWxCLFVBQW1CLEtBQXdDO1FBQ3ZELElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDOUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUF2REQsQ0FBb0MsMkNBQW9CLEdBdUR2RDtBQXZEWSxzQkFBYyxpQkF1RDFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDb2RlQWN0aW9uIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgY3JlYXRlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL2hlbHBlcnMvY3JlYXRlT2JzZXJ2YWJsZSc7XHJcbmltcG9ydCB7IEF0b21Db21tYW5kcyB9IGZyb20gJy4uL0F0b21Db21tYW5kcyc7XHJcbmltcG9ydCB7IEF0b21WaWV3RmluZGVyIH0gZnJvbSAnLi4vQXRvbVZpZXdGaW5kZXInO1xyXG5pbXBvcnQgeyBGaWx0ZXJTZWxlY3RMaXN0VmlldyB9IGZyb20gJy4vRmlsdGVyU2VsZWN0TGlzdFZpZXcnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvZGVBY3Rpb25WaWV3IGV4dGVuZHMgRmlsdGVyU2VsZWN0TGlzdFZpZXc8Q29kZUFjdGlvbi5JUmVzcG9uc2U+IHtcclxuICAgIHByaXZhdGUgX2RlY29yYXRpb246IEF0b20uRGVjb3JhdGlvbjtcclxuICAgIHByaXZhdGUgX2VkaXRvcjogQXRvbS5UZXh0RWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yVmlldzogQXRvbS5UZXh0RWRpdG9yUHJlc2VudGVyO1xyXG4gICAgcHJpdmF0ZSBfY29kZWFjdGlvbiQ6IE9ic2VydmFibGU8Q29kZUFjdGlvbi5JUmVzcG9uc2U+O1xyXG4gICAgcHJpdmF0ZSBfY29kZWFjdGlvbk9ic2VydmVyOiBTdWJzY3JpYmVyPENvZGVBY3Rpb24uSVJlc3BvbnNlPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tbWFuZHM6IEF0b21Db21tYW5kcywgdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXIsIGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgc3VwZXIoY29tbWFuZHMpO1xyXG4gICAgICAgIHRoaXMucm9vdC5jbGFzc0xpc3QuYWRkKCdjb2RlLWFjdGlvbnMtb3ZlcmxheScpO1xyXG4gICAgICAgIHRoaXMuX2VkaXRvciA9IGVkaXRvcjtcclxuICAgICAgICB0aGlzLl9lZGl0b3JWaWV3ID0gdmlld0ZpbmRlci5nZXRWaWV3PEF0b20uVGV4dEVkaXRvclByZXNlbnRlcj4oZWRpdG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGVjb3JhdGlvbiA9IHRoaXMuX2VkaXRvci5kZWNvcmF0ZU1hcmtlcihcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRNYXJrZXIoKSxcclxuICAgICAgICAgICAgeyB0eXBlOiAnb3ZlcmxheScsIHBvc2l0aW9uOiAndGFpbCcsIGl0ZW06IHRoaXMucm9vdCB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29kZWFjdGlvbiQgPSBjcmVhdGVPYnNlcnZhYmxlPENvZGVBY3Rpb24uSVJlc3BvbnNlPihvYnNlcnZlciA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVhY3Rpb25PYnNlcnZlciA9IG9ic2VydmVyO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChvYnNlcnZlcik7XHJcbiAgICAgICAgfSkuc2hhcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgICgpID0+IHRoaXMuX2RlY29yYXRpb24uZGVzdHJveSgpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2FuY2VsbGVkKCkgeyAvKiAqLyB9XHJcblxyXG4gICAgcHVibGljIGdldCBmaWx0ZXJLZXlzKCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2lkJywgd2VpZ2h0OiAwLjIgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHdlaWdodDogMC41IH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3RpdGxlJywgd2VpZ2h0OiAwLjMgfVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbmZpcm1lZChpdGVtOiBDb2RlQWN0aW9uLklSZXNwb25zZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2RlYWN0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZWFjdGlvbk9ic2VydmVyLm5leHQoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29kZWFjdGlvbiQoKSB7IHJldHVybiB0aGlzLl9jb2RlYWN0aW9uJDsgfVxyXG5cclxuICAgIHB1YmxpYyB2aWV3Rm9ySXRlbSh2YWx1ZTogZnVzZS5SZXN1bHQ8Q29kZUFjdGlvbi5JUmVzcG9uc2U+KSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdldmVudCcpO1xyXG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbi5pbm5lclRleHQgPSB2YWx1ZS5pdGVtLm5hbWU7XHJcbiAgICAgICAgc3Bhbi50aXRsZSA9IHZhbHVlLml0ZW0udGl0bGU7XHJcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxufVxyXG4iXX0=