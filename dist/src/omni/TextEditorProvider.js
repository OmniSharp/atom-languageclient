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
/* tslint:disable:no-any */
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var helpers_1 = require('./helpers');
var TextEditorSource_1 = require('./TextEditorSource');
var TextEditorProvider = (function (_super) {
    __extends(TextEditorProvider, _super);
    function TextEditorProvider(textEditorSource) {
        _super.call(this);
        this._editorsSet = new Set();
        this._textEditorSource = textEditorSource;
    }
    Object.defineProperty(TextEditorProvider.prototype, "get$", {
        get: function () {
            if (!this._editors$) {
                this._editors$ = this._createEditor$();
            }
            return this._editors$;
        },
        enumerable: true,
        configurable: true
    });
    TextEditorProvider.prototype.forEach = function (callback) {
        var _this = this;
        var outerCd = new ts_disposables_1.CompositeDisposable();
        this._disposable.add(outerCd);
        outerCd.add(function () { return _this._disposable.remove(outerCd); }, this._editors$
            .subscribe(function (editor) {
            var innerCd = new ts_disposables_1.CompositeDisposable();
            outerCd.add(innerCd);
            innerCd.add(editor.onDidDestroy((function () {
                outerCd.remove(innerCd);
                innerCd.dispose();
            })));
            callback(editor, innerCd);
        }));
        return outerCd;
    };
    TextEditorProvider.prototype._createEditor$ = function () {
        var _this = this;
        var observable$ = rxjs_1.Observable.merge(rxjs_1.Observable.defer(function () { return rxjs_1.Observable.from(_this._editorsSet); }), this._textEditorSource.observeTextEditor().share());
        return _.flow(helpers_1.subscribeAsync, helpers_1.ensureEditor)(observable$);
    };
    TextEditorProvider = __decorate([
        decorators_1.injectable, 
        __metadata('design:paramtypes', [TextEditorSource_1.TextEditorSource])
    ], TextEditorProvider);
    return TextEditorProvider;
}(ts_disposables_1.DisposableBase));
exports.TextEditorProvider = TextEditorProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dEVkaXRvclByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL29tbmkvVGV4dEVkaXRvclByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwyQkFBMkI7QUFDM0IsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFDNUIscUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBQ2xDLDJCQUEyQixrQ0FBa0MsQ0FBQyxDQUFBO0FBQzlELCtCQUFpRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2xGLHdCQUE2QyxXQUFXLENBQUMsQ0FBQTtBQUV6RCxpQ0FBaUMsb0JBQW9CLENBQUMsQ0FBQTtBQVF0RDtJQUF3QyxzQ0FBYztJQUtsRCw0QkFBWSxnQkFBa0M7UUFDMUMsaUJBQU8sQ0FBQztRQUxKLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBQTZCLENBQUM7UUFNdkQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGdCQUFnQixDQUFDO0lBQzlDLENBQUM7SUFFRCxzQkFBVyxvQ0FBSTthQUFmO1lBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDM0MsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFCLENBQUM7OztPQUFBO0lBRU0sb0NBQU8sR0FBZCxVQUFlLFFBQThFO1FBQTdGLGlCQXFCQztRQXBCRyxJQUFNLE9BQU8sR0FBRyxJQUFJLG9DQUFtQixFQUFFLENBQUM7UUFFMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FDUCxjQUFNLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQWhDLENBQWdDLEVBQ3RDLElBQUksQ0FBQyxTQUFTO2FBQ1QsU0FBUyxDQUFDLFVBQUEsTUFBTTtZQUNiLElBQU0sT0FBTyxHQUFHLElBQUksb0NBQW1CLEVBQUUsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXJCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM3QixPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRUwsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FDVCxDQUFDO1FBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRU8sMkNBQWMsR0FBdEI7UUFBQSxpQkFPQztRQU5HLElBQU0sV0FBVyxHQUFHLGlCQUFVLENBQUMsS0FBSyxDQUNoQyxpQkFBVSxDQUFDLEtBQUssQ0FBQyxjQUFNLE9BQUEsaUJBQVUsQ0FBQyxJQUFJLENBQWlDLEtBQUksQ0FBQyxXQUFXLENBQUMsRUFBakUsQ0FBaUUsQ0FBQyxFQUN6RixJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FDckQsQ0FBQztRQUVGLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUFjLEVBQUUsc0JBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFoREw7UUFBQyx1QkFBVTs7MEJBQUE7SUFpRFgseUJBQUM7QUFBRCxDQUFDLEFBaERELENBQXdDLCtCQUFjLEdBZ0RyRDtBQWhEWSwwQkFBa0IscUJBZ0Q5QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlQmFzZSwgSURpc3Bvc2FibGUgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGVuc3VyZUVkaXRvciwgc3Vic2NyaWJlQXN5bmMgfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5pbXBvcnQgeyBJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yIH0gZnJvbSAnLi9JTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yJztcclxuaW1wb3J0IHsgVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4vVGV4dEVkaXRvclNvdXJjZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUZXh0RWRpdG9yUHJvdmlkZXIge1xyXG4gICAgcmVhZG9ubHkgZ2V0JDogT2JzZXJ2YWJsZTxJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yPjtcclxuICAgIGZvckVhY2goY2FsbGJhY2s6IChlZGl0b3I6IElMYW5ndWFnZUNsaWVudFRleHRFZGl0b3IsIGNkOiBDb21wb3NpdGVEaXNwb3NhYmxlKSA9PiB2b2lkKTogSURpc3Bvc2FibGU7XHJcbn1cclxuXHJcbkBpbmplY3RhYmxlXHJcbmV4cG9ydCBjbGFzcyBUZXh0RWRpdG9yUHJvdmlkZXIgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElUZXh0RWRpdG9yUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yc1NldCA9IG5ldyBTZXQ8SUxhbmd1YWdlQ2xpZW50VGV4dEVkaXRvcj4oKTtcclxuICAgIHByaXZhdGUgX2VkaXRvcnMkOiBPYnNlcnZhYmxlPElMYW5ndWFnZUNsaWVudFRleHRFZGl0b3I+O1xyXG4gICAgcHJpdmF0ZSBfdGV4dEVkaXRvclNvdXJjZTogVGV4dEVkaXRvclNvdXJjZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0RWRpdG9yU291cmNlOiBUZXh0RWRpdG9yU291cmNlKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl90ZXh0RWRpdG9yU291cmNlID0gdGV4dEVkaXRvclNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldCQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lZGl0b3JzJCkge1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JzJCA9IHRoaXMuX2NyZWF0ZUVkaXRvciQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VkaXRvcnMkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmb3JFYWNoKGNhbGxiYWNrOiAoZWRpdG9yOiBJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yLCBjZDogQ29tcG9zaXRlRGlzcG9zYWJsZSkgPT4gdm9pZCk6IElEaXNwb3NhYmxlIHtcclxuICAgICAgICBjb25zdCBvdXRlckNkID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQob3V0ZXJDZCk7XHJcbiAgICAgICAgb3V0ZXJDZC5hZGQoXHJcbiAgICAgICAgICAgICgpID0+IHRoaXMuX2Rpc3Bvc2FibGUucmVtb3ZlKG91dGVyQ2QpLFxyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3JzJFxyXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZShlZGl0b3IgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyQ2QgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG91dGVyQ2QuYWRkKGlubmVyQ2QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbm5lckNkLmFkZChlZGl0b3Iub25EaWREZXN0cm95KCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGVyQ2QucmVtb3ZlKGlubmVyQ2QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lckNkLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlZGl0b3IsIGlubmVyQ2QpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0ZXJDZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jcmVhdGVFZGl0b3IkKCkge1xyXG4gICAgICAgIGNvbnN0IG9ic2VydmFibGUkID0gT2JzZXJ2YWJsZS5tZXJnZShcclxuICAgICAgICAgICAgT2JzZXJ2YWJsZS5kZWZlcigoKSA9PiBPYnNlcnZhYmxlLmZyb208SUxhbmd1YWdlQ2xpZW50VGV4dEVkaXRvcj4oPGFueT50aGlzLl9lZGl0b3JzU2V0KSksXHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRFZGl0b3JTb3VyY2Uub2JzZXJ2ZVRleHRFZGl0b3IoKS5zaGFyZSgpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIF8uZmxvdyhzdWJzY3JpYmVBc3luYywgZW5zdXJlRWRpdG9yKShvYnNlcnZhYmxlJCk7XHJcbiAgICB9XHJcbn1cclxuIl19