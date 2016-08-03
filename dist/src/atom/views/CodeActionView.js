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
        this._decoration = editor.decorateMarker(this._filterEditor.getLastCursor().getMarker(), { type: 'overlay', position: 'tail', item: this.root });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUFjdGlvblZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXRvbS92aWV3cy9Db2RlQWN0aW9uVmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFHNUIsaUNBQWlDLGdDQUFnQyxDQUFDLENBQUE7QUFHbEUscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFFOUQ7SUFBb0Msa0NBQThDO0lBSzlFLHdCQUFtQixRQUFzQixFQUFFLFVBQTBCLEVBQUUsTUFBdUI7UUFMbEcsaUJBcURDO1FBL0NPLGtCQUFNLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBRWhELElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FDcEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFDOUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FDekQsQ0FBQztRQUVGLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxZQUFZLEdBQUcsbUNBQWdCLENBQTJCLFVBQUEsUUFBUTtZQUNuRSxLQUFJLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDO1lBQ3BDLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRVgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2hCLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxFQUExQixDQUEwQixDQUNuQyxDQUFDO0lBQ04sQ0FBQztJQUVNLGtDQUFTLEdBQWhCLGNBQTJCLENBQUM7SUFFNUIsc0JBQVcsc0NBQVU7YUFBckI7WUFDSSxNQUFNLENBQUM7Z0JBQ0gsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQzNCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUM3QixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTthQUNqQyxDQUFDO1FBQ04sQ0FBQzs7O09BQUE7SUFFTSxrQ0FBUyxHQUFoQixVQUFpQixJQUE4QjtRQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNMLENBQUM7SUFFRCxzQkFBVyx1Q0FBVzthQUF0QixjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRS9DLG9DQUFXLEdBQWxCLFVBQW1CLEtBQTRDO1FBQzNELElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDOUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUMsQUFyREQsQ0FBb0MsMkNBQW9CLEdBcUR2RDtBQXJEWSxzQkFBYyxpQkFxRDFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmliZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgR2V0Q29kZUFjdGlvbnMgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMnO1xyXG5pbXBvcnQgeyBjcmVhdGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vaGVscGVycy9jcmVhdGVPYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgQXRvbUNvbW1hbmRzIH0gZnJvbSAnLi4vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgQXRvbVZpZXdGaW5kZXIgfSBmcm9tICcuLi9BdG9tVmlld0ZpbmRlcic7XHJcbmltcG9ydCB7IEZpbHRlclNlbGVjdExpc3RWaWV3IH0gZnJvbSAnLi9GaWx0ZXJTZWxlY3RMaXN0Vmlldyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29kZUFjdGlvblZpZXcgZXh0ZW5kcyBGaWx0ZXJTZWxlY3RMaXN0VmlldzxHZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2U+IHtcclxuICAgIHByaXZhdGUgX2RlY29yYXRpb246IEF0b20uRGVjb3JhdGlvbjtcclxuICAgIHByaXZhdGUgX2NvZGVhY3Rpb24kOiBPYnNlcnZhYmxlPEdldENvZGVBY3Rpb25zLklSZXNwb25zZT47XHJcbiAgICBwcml2YXRlIF9jb2RlYWN0aW9uT2JzZXJ2ZXI6IFN1YnNjcmliZXI8R2V0Q29kZUFjdGlvbnMuSVJlc3BvbnNlPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tbWFuZHM6IEF0b21Db21tYW5kcywgdmlld0ZpbmRlcjogQXRvbVZpZXdGaW5kZXIsIGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgc3VwZXIoY29tbWFuZHMpO1xyXG4gICAgICAgIHRoaXMucm9vdC5jbGFzc0xpc3QuYWRkKCdjb2RlLWFjdGlvbnMtb3ZlcmxheScpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKFxyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXJFZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldE1hcmtlcigpLFxyXG4gICAgICAgICAgICB7IHR5cGU6ICdvdmVybGF5JywgcG9zaXRpb246ICd0YWlsJywgaXRlbTogdGhpcy5yb290IH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBfLmRlbGF5KCgpID0+IHRoaXMuX2ZpbHRlckVkaXRvclZpZXcuZm9jdXMoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvZGVhY3Rpb24kID0gY3JlYXRlT2JzZXJ2YWJsZTxHZXRDb2RlQWN0aW9ucy5JUmVzcG9uc2U+KG9ic2VydmVyID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZWFjdGlvbk9ic2VydmVyID0gb2JzZXJ2ZXI7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKG9ic2VydmVyKTtcclxuICAgICAgICB9KS5zaGFyZSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgKCkgPT4gdGhpcy5fZGVjb3JhdGlvbi5kZXN0cm95KClcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5jZWxsZWQoKSB7IC8qICovIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGZpbHRlcktleXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyBuYW1lOiAnaWQnLCB3ZWlnaHQ6IDAuMiB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgd2VpZ2h0OiAwLjUgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAndGl0bGUnLCB3ZWlnaHQ6IDAuMyB9XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29uZmlybWVkKGl0ZW06IEdldENvZGVBY3Rpb25zLklSZXNwb25zZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2RlYWN0aW9uT2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZWFjdGlvbk9ic2VydmVyLm5leHQoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29kZWFjdGlvbiQoKSB7IHJldHVybiB0aGlzLl9jb2RlYWN0aW9uJDsgfVxyXG5cclxuICAgIHB1YmxpYyB2aWV3Rm9ySXRlbSh2YWx1ZTogZnVzZS5SZXN1bHQ8R2V0Q29kZUFjdGlvbnMuSVJlc3BvbnNlPikge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZXZlbnQnKTtcclxuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW4uaW5uZXJUZXh0ID0gdmFsdWUuaXRlbS5uYW1lO1xyXG4gICAgICAgIHNwYW4udGl0bGUgPSB2YWx1ZS5pdGVtLnRpdGxlO1xyXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbn1cclxuIl19