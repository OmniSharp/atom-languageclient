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
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var helpers_1 = require('./helpers');
var TextEditorSource_1 = require('./TextEditorSource');
var ActiveTextEditorProvider = (function (_super) {
    __extends(ActiveTextEditorProvider, _super);
    function ActiveTextEditorProvider(source) {
        _super.call(this);
        this._source = source;
    }
    Object.defineProperty(ActiveTextEditorProvider.prototype, "editor$", {
        get: function () {
            if (!this._editor$) {
                this._editor$ = _.flow(helpers_1.subscribeAsync, helpers_1.ensureEditor, helpers_1.cacheEditor)(this._source.observeActiveTextEditor());
            }
            return this._editor$;
        },
        enumerable: true,
        configurable: true
    });
    ActiveTextEditorProvider.prototype.switch = function (callback) {
        var _this = this;
        var outerCd = new ts_disposables_1.CompositeDisposable();
        this._disposable.add(outerCd);
        outerCd.add(function () { return _this._disposable.remove(outerCd); }, this.editor$
            .filter(function (z) { return !!z; })
            .subscribe(function (editor) {
            var innerCd = new ts_disposables_1.CompositeDisposable();
            outerCd.add(innerCd, _this.editor$
                .filter(function (active) { return active !== editor; })
                .subscribe(function () {
                outerCd.remove(innerCd);
                innerCd.dispose();
            }));
            callback(editor, innerCd);
        }));
        return outerCd;
    };
    ActiveTextEditorProvider = __decorate([
        decorators_1.injectable, 
        __metadata('design:paramtypes', [TextEditorSource_1.TextEditorSource])
    ], ActiveTextEditorProvider);
    return ActiveTextEditorProvider;
}(ts_disposables_1.DisposableBase));
exports.ActiveTextEditorProvider = ActiveTextEditorProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aXZlVGV4dEVkaXRvclByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL29tbmkvQWN0aXZlVGV4dEVkaXRvclByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0dBSUc7QUFDSCwyQkFBMkI7QUFDM0IsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFNUIsMkJBQTJCLGtDQUFrQyxDQUFDLENBQUE7QUFDOUQsK0JBQWlFLGdCQUFnQixDQUFDLENBQUE7QUFDbEYsd0JBQTBELFdBQVcsQ0FBQyxDQUFBO0FBRXRFLGlDQUFpQyxvQkFBb0IsQ0FBQyxDQUFBO0FBUXREO0lBQThDLDRDQUFjO0lBSXhELGtDQUFZLE1BQXdCO1FBQ2hDLGlCQUFPLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUMxQixDQUFDO0lBRUQsc0JBQVcsNkNBQU87YUFBbEI7WUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQWMsRUFBRSxzQkFBWSxFQUFFLHFCQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUM5RyxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFFTSx5Q0FBTSxHQUFiLFVBQWMsUUFBOEU7UUFBNUYsaUJBMEJDO1FBekJHLElBQU0sT0FBTyxHQUFHLElBQUksb0NBQW1CLEVBQUUsQ0FBQztRQUUxQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixPQUFPLENBQUMsR0FBRyxDQUNQLGNBQU0sT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBaEMsQ0FBZ0MsRUFDdEMsSUFBSSxDQUFDLE9BQU87YUFDUCxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBQzthQUNoQixTQUFTLENBQUMsVUFBQSxNQUFNO1lBQ2IsSUFBTSxPQUFPLEdBQUcsSUFBSSxvQ0FBbUIsRUFBRSxDQUFDO1lBRTFDLE9BQU8sQ0FBQyxHQUFHLENBQ1AsT0FBTyxFQUNQLEtBQUksQ0FBQyxPQUFPO2lCQUNQLE1BQU0sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sS0FBSyxNQUFNLEVBQWpCLENBQWlCLENBQUM7aUJBQ25DLFNBQVMsQ0FBQztnQkFDUCxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QixPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEIsQ0FBQyxDQUFDLENBQ1QsQ0FBQztZQUVGLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQ1QsQ0FBQztRQUVGLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQTNDTDtRQUFDLHVCQUFVOztnQ0FBQTtJQTRDWCwrQkFBQztBQUFELENBQUMsQUEzQ0QsQ0FBOEMsK0JBQWMsR0EyQzNEO0FBM0NZLGdDQUF3QiwyQkEyQ3BDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGluamVjdGFibGUgfSBmcm9tICdhdG9tLWxhbmd1YWdlc2VydmljZXMvZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGVCYXNlLCBJRGlzcG9zYWJsZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgY2FjaGVFZGl0b3IsIGVuc3VyZUVkaXRvciwgc3Vic2NyaWJlQXN5bmMgfSBmcm9tICcuL2hlbHBlcnMnO1xyXG5pbXBvcnQgeyBJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yIH0gZnJvbSAnLi9JTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yJztcclxuaW1wb3J0IHsgVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJy4vVGV4dEVkaXRvclNvdXJjZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBY3RpdmVUZXh0RWRpdG9yUHJvdmlkZXIge1xyXG4gICAgcmVhZG9ubHkgZWRpdG9yJDogT2JzZXJ2YWJsZTxJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yPjtcclxuICAgIHN3aXRjaChjYWxsYmFjazogKGVkaXRvcjogSUxhbmd1YWdlQ2xpZW50VGV4dEVkaXRvciwgY2Q6IENvbXBvc2l0ZURpc3Bvc2FibGUpID0+IHZvaWQpOiBJRGlzcG9zYWJsZTtcclxufVxyXG5cclxuQGluamVjdGFibGVcclxuZXhwb3J0IGNsYXNzIEFjdGl2ZVRleHRFZGl0b3JQcm92aWRlciBleHRlbmRzIERpc3Bvc2FibGVCYXNlIGltcGxlbWVudHMgSUFjdGl2ZVRleHRFZGl0b3JQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9lZGl0b3IkOiBPYnNlcnZhYmxlPElMYW5ndWFnZUNsaWVudFRleHRFZGl0b3I+O1xyXG4gICAgcHJpdmF0ZSBfc291cmNlOiBUZXh0RWRpdG9yU291cmNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZTogVGV4dEVkaXRvclNvdXJjZSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fc291cmNlID0gc291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZWRpdG9yJCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2VkaXRvciQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yJCA9IF8uZmxvdyhzdWJzY3JpYmVBc3luYywgZW5zdXJlRWRpdG9yLCBjYWNoZUVkaXRvcikodGhpcy5fc291cmNlLm9ic2VydmVBY3RpdmVUZXh0RWRpdG9yKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZWRpdG9yJDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3dpdGNoKGNhbGxiYWNrOiAoZWRpdG9yOiBJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yLCBjZDogQ29tcG9zaXRlRGlzcG9zYWJsZSkgPT4gdm9pZCk6IElEaXNwb3NhYmxlIHtcclxuICAgICAgICBjb25zdCBvdXRlckNkID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQob3V0ZXJDZCk7XHJcbiAgICAgICAgb3V0ZXJDZC5hZGQoXHJcbiAgICAgICAgICAgICgpID0+IHRoaXMuX2Rpc3Bvc2FibGUucmVtb3ZlKG91dGVyQ2QpLFxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvciRcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoeiA9PiAhIXopXHJcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKGVkaXRvciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5uZXJDZCA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG91dGVyQ2QuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbm5lckNkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRvciRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoYWN0aXZlID0+IGFjdGl2ZSAhPT0gZWRpdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ZXJDZC5yZW1vdmUoaW5uZXJDZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5uZXJDZC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVkaXRvciwgaW5uZXJDZCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXRlckNkO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==