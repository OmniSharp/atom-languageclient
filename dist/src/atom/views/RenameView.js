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
var rxjs_1 = require('rxjs');
var createObservable_1 = require('../../helpers/createObservable');
var View_1 = require('./View');
var RenameView = (function (_super) {
    __extends(RenameView, _super);
    function RenameView(commands, options) {
        var _this = this;
        _super.call(this, document.createElement('div'));
        this._options = options;
        this.root.classList.add('rename', 'overlay', 'from-top');
        this._message = document.createElement('p');
        /* tslint:disable-next-line:no-any */
        this._editorView = document.createElement('atom-text-editor');
        /* tslint:disable-next-line:no-any */
        this._editorView.setAttribute('mini', true);
        this._editor = this._editorView.getModel();
        this.root.appendChild(this._message);
        this.root.appendChild(this._editorView);
        this._disposable.add(rxjs_1.Observable.fromEvent(this.root, 'blur')
            .subscribe(function () {
            _this.destroy();
        }), commands.add(this.root, {
            'core:confirm': function () { return _this._rename(); },
            'core:cancel': function () { return _this.destroy(); }
        }));
        this._panel = atom.workspace.addTopPanel({
            item: this.root
        });
        this._disposable.add(function () { return _this._panel.destroy(); });
        this._editor.setText(options.word);
        this._editorView.focus();
        this._rename$ = createObservable_1.createObservable(function (observer) {
            _this._renameObserver = observer;
            _this._disposable.add(observer);
        }).share();
    }
    Object.defineProperty(RenameView.prototype, "rename$", {
        get: function () { return this._rename$; },
        enumerable: true,
        configurable: true
    });
    RenameView.prototype._rename = function () {
        if (this._renameObserver) {
            this._renameObserver.next(_.defaults({ word: this._editor.getText() }, this._options));
        }
        this.destroy();
    };
    RenameView.prototype.destroy = function () {
        this._editor.setText('');
        this.dispose();
    };
    return RenameView;
}(View_1.View));
exports.RenameView = RenameView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuYW1lVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hdG9tL3ZpZXdzL1JlbmFtZVZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUF1QyxNQUFNLENBQUMsQ0FBQTtBQUU5QyxpQ0FBaUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUVsRSxxQkFBcUIsUUFBUSxDQUFDLENBQUE7QUFFOUI7SUFBZ0MsOEJBQW9CO0lBU2hELG9CQUFZLFFBQXNCLEVBQUUsT0FBd0I7UUFUaEUsaUJBcUVDO1FBM0RPLGtCQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUMscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQVEsUUFBUSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25FLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQU8sSUFBSSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTNDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2hCLGlCQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2FBQ2xDLFNBQVMsQ0FBQztZQUNQLEtBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUMsRUFDTixRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDcEIsY0FBYyxFQUFFLGNBQU0sT0FBQSxLQUFJLENBQUMsT0FBTyxFQUFFLEVBQWQsQ0FBYztZQUNwQyxhQUFhLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxPQUFPLEVBQUUsRUFBZCxDQUFjO1NBQ3RDLENBQUMsQ0FDTCxDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztZQUNyQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2hCLGNBQU0sT0FBQSxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFyQixDQUFxQixDQUM5QixDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQ0FBZ0IsQ0FBa0IsVUFBQSxRQUFRO1lBQ3RELEtBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDO1lBQ2hDLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELHNCQUFXLCtCQUFPO2FBQWxCLGNBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFdEMsNEJBQU8sR0FBZjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUNyQixDQUFDLENBQUMsUUFBUSxDQUNOLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNyQixDQUFDO1FBQ04sQ0FBQztRQUNELElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRU0sNEJBQU8sR0FBZDtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQUFDLEFBckVELENBQWdDLFdBQUksR0FxRW5DO0FBckVZLGtCQUFVLGFBcUV0QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IFJlbmFtZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGNyZWF0ZU9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9oZWxwZXJzL2NyZWF0ZU9ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi9WaWV3JztcclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5hbWVWaWV3IGV4dGVuZHMgVmlldzxIVE1MRGl2RWxlbWVudD4ge1xyXG4gICAgcHJpdmF0ZSBfbWVzc2FnZTogSFRNTFBhcmFncmFwaEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9lZGl0b3JWaWV3OiBBdG9tLlRleHRFZGl0b3JQcmVzZW50ZXI7XHJcbiAgICBwcml2YXRlIF9lZGl0b3I6IEF0b20uVGV4dEVkaXRvcjtcclxuICAgIHByaXZhdGUgX3JlbmFtZSQ6IE9ic2VydmFibGU8UmVuYW1lLklSZXF1ZXN0PjtcclxuICAgIHByaXZhdGUgX3JlbmFtZU9ic2VydmVyOiBTdWJzY3JpYmVyPFJlbmFtZS5JUmVxdWVzdD47XHJcbiAgICBwcml2YXRlIF9wYW5lbDogeyBkZXN0cm95KCk6IHZvaWQ7IH07XHJcbiAgICBwcml2YXRlIF9vcHRpb25zOiBSZW5hbWUuSVJlcXVlc3Q7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29tbWFuZHM6IEF0b21Db21tYW5kcywgb3B0aW9uczogUmVuYW1lLklSZXF1ZXN0KSB7XHJcbiAgICAgICAgc3VwZXIoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xyXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgICAgICB0aGlzLnJvb3QuY2xhc3NMaXN0LmFkZCgncmVuYW1lJywgJ292ZXJsYXknLCAnZnJvbS10b3AnKTtcclxuICAgICAgICB0aGlzLl9tZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnkgKi9cclxuICAgICAgICB0aGlzLl9lZGl0b3JWaWV3ID0gPGFueT5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdG9tLXRleHQtZWRpdG9yJyk7XHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSAqL1xyXG4gICAgICAgIHRoaXMuX2VkaXRvclZpZXcuc2V0QXR0cmlidXRlKCdtaW5pJywgPGFueT50cnVlKTtcclxuICAgICAgICB0aGlzLl9lZGl0b3IgPSB0aGlzLl9lZGl0b3JWaWV3LmdldE1vZGVsKCk7XHJcblxyXG4gICAgICAgIHRoaXMucm9vdC5hcHBlbmRDaGlsZCh0aGlzLl9tZXNzYWdlKTtcclxuICAgICAgICB0aGlzLnJvb3QuYXBwZW5kQ2hpbGQodGhpcy5fZWRpdG9yVmlldyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxyXG4gICAgICAgICAgICBPYnNlcnZhYmxlLmZyb21FdmVudCh0aGlzLnJvb3QsICdibHVyJylcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIGNvbW1hbmRzLmFkZCh0aGlzLnJvb3QsIHtcclxuICAgICAgICAgICAgICAgICdjb3JlOmNvbmZpcm0nOiAoKSA9PiB0aGlzLl9yZW5hbWUoKSxcclxuICAgICAgICAgICAgICAgICdjb3JlOmNhbmNlbCc6ICgpID0+IHRoaXMuZGVzdHJveSgpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRUb3BQYW5lbCh7XHJcbiAgICAgICAgICAgIGl0ZW06IHRoaXMucm9vdFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChcclxuICAgICAgICAgICAgKCkgPT4gdGhpcy5fcGFuZWwuZGVzdHJveSgpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZWRpdG9yLnNldFRleHQob3B0aW9ucy53b3JkKTtcclxuICAgICAgICB0aGlzLl9lZGl0b3JWaWV3LmZvY3VzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmFtZSQgPSBjcmVhdGVPYnNlcnZhYmxlPFJlbmFtZS5JUmVxdWVzdD4ob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5hbWVPYnNlcnZlciA9IG9ic2VydmVyO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZChvYnNlcnZlcik7XHJcbiAgICAgICAgfSkuc2hhcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJlbmFtZSQoKSB7IHJldHVybiB0aGlzLl9yZW5hbWUkOyB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVuYW1lKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZW5hbWVPYnNlcnZlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5hbWVPYnNlcnZlci5uZXh0KFxyXG4gICAgICAgICAgICAgICAgXy5kZWZhdWx0cyhcclxuICAgICAgICAgICAgICAgICAgICB7IHdvcmQ6IHRoaXMuX2VkaXRvci5nZXRUZXh0KCkgfSxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vcHRpb25zKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLl9lZGl0b3Iuc2V0VGV4dCgnJyk7XHJcbiAgICAgICAgdGhpcy5kaXNwb3NlKCk7XHJcbiAgICB9XHJcbn1cclxuIl19