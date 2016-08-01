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
var rxjs_1 = require('rxjs');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var index_1 = require('../helpers/index');
var TextEditorSource = (function (_super) {
    __extends(TextEditorSource, _super);
    function TextEditorSource() {
        _super.call(this);
    }
    Object.defineProperty(TextEditorSource.prototype, "activeTextEditor", {
        get: function () {
            return atom.workspace.getActiveTextEditor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextEditorSource.prototype, "textEditors", {
        get: function () {
            return atom.workspace.getTextEditors();
        },
        enumerable: true,
        configurable: true
    });
    TextEditorSource.prototype.observeActiveTextEditor = function () {
        var _this = this;
        return index_1.observeCallback(atom.workspace.observeActivePaneItem, atom.workspace)
            .mergeMap(function (pane) {
            if (pane && pane.getGrammar && pane.getPath) {
                return _this._getServerForEditor(pane);
            }
            return rxjs_1.Observable.empty();
        });
    };
    TextEditorSource.prototype.observeTextEditor = function () {
        var _this = this;
        return index_1.observeCallback(atom.workspace.observeTextEditors, atom.workspace)
            .mergeMap(function (editor) {
            if (!editor.getPath()) {
                return index_1.observeCallback(editor.onDidChange, editor)
                    .filter(function (x) { return !!x; })
                    .take(1);
            }
            return rxjs_1.Observable.of(editor);
        })
            .mergeMap(function (editor) { return _this._getServerForEditor(editor); });
    };
    TextEditorSource.prototype._getServerForEditor = function (textEditor) {
        return rxjs_1.Observable.of(textEditor);
    };
    TextEditorSource = __decorate([
        decorators_1.injectable, 
        __metadata('design:paramtypes', [])
    ], TextEditorSource);
    return TextEditorSource;
}(ts_disposables_1.DisposableBase));
exports.TextEditorSource = TextEditorSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dEVkaXRvclNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbW5pL1RleHRFZGl0b3JTb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILDJCQUEyQjtBQUMzQixxQkFBMkIsTUFBTSxDQUFDLENBQUE7QUFDbEMsMkJBQTJCLGtDQUFrQyxDQUFDLENBQUE7QUFDOUQsK0JBQStCLGdCQUFnQixDQUFDLENBQUE7QUFDaEQsc0JBQWdDLGtCQUFrQixDQUFDLENBQUE7QUFXbkQ7SUFBc0Msb0NBQWM7SUFDaEQ7UUFDSSxpQkFBTyxDQUFDO0lBQ1osQ0FBQztJQUVELHNCQUFXLDhDQUFnQjthQUEzQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDaEQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx5Q0FBVzthQUF0QjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzNDLENBQUM7OztPQUFBO0lBRU0sa0RBQXVCLEdBQTlCO1FBQUEsaUJBUUM7UUFQRyxNQUFNLENBQUMsdUJBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDdkUsUUFBUSxDQUFDLFVBQUMsSUFBUztZQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxtQkFBbUIsQ0FBa0IsSUFBSSxDQUFDLENBQUM7WUFDM0QsQ0FBQztZQUNELE1BQU0sQ0FBQyxpQkFBVSxDQUFDLEtBQUssRUFBNkIsQ0FBQztRQUN6RCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFTSw0Q0FBaUIsR0FBeEI7UUFBQSxpQkFZQztRQVhHLE1BQU0sQ0FBQyx1QkFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQzthQUNwRSxRQUFRLENBQUMsVUFBQSxNQUFNO1lBQ1osRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsdUJBQWUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQztxQkFDN0MsTUFBTSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLENBQUMsRUFBSCxDQUFHLENBQUM7cUJBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixDQUFDO1lBRUQsTUFBTSxDQUFDLGlCQUFVLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQzthQUNELFFBQVEsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFTyw4Q0FBbUIsR0FBM0IsVUFBNEIsVUFBMkI7UUFDbkQsTUFBTSxDQUFDLGlCQUFVLENBQUMsRUFBRSxDQUFNLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUF4Q0w7UUFBQyx1QkFBVTs7d0JBQUE7SUF5Q1gsdUJBQUM7QUFBRCxDQUFDLEFBeENELENBQXNDLCtCQUFjLEdBd0NuRDtBQXhDWSx3QkFBZ0IsbUJBd0M1QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuLyogdHNsaW50OmRpc2FibGU6bm8tYW55ICovXHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgaW5qZWN0YWJsZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcy9kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IG9ic2VydmVDYWxsYmFjayB9IGZyb20gJy4uL2hlbHBlcnMvaW5kZXgnO1xyXG5pbXBvcnQgeyBJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yIH0gZnJvbSAnLi9JTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRleHRFZGl0b3JTb3VyY2Uge1xyXG4gICAgcmVhZG9ubHkgYWN0aXZlVGV4dEVkaXRvcjogQXRvbS5UZXh0RWRpdG9yO1xyXG4gICAgcmVhZG9ubHkgdGV4dEVkaXRvcnM6IEF0b20uVGV4dEVkaXRvcltdO1xyXG4gICAgb2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3IoKTogT2JzZXJ2YWJsZTxJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yPjtcclxuICAgIG9ic2VydmVUZXh0RWRpdG9yKCk6IE9ic2VydmFibGU8SUxhbmd1YWdlQ2xpZW50VGV4dEVkaXRvcj47XHJcbn1cclxuXHJcbkBpbmplY3RhYmxlXHJcbmV4cG9ydCBjbGFzcyBUZXh0RWRpdG9yU291cmNlIGV4dGVuZHMgRGlzcG9zYWJsZUJhc2UgaW1wbGVtZW50cyBJVGV4dEVkaXRvclNvdXJjZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgYWN0aXZlVGV4dEVkaXRvcigpIHtcclxuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdGV4dEVkaXRvcnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9ic2VydmVBY3RpdmVUZXh0RWRpdG9yKCkge1xyXG4gICAgICAgIHJldHVybiBvYnNlcnZlQ2FsbGJhY2soYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtLCBhdG9tLndvcmtzcGFjZSlcclxuICAgICAgICAgICAgLm1lcmdlTWFwKChwYW5lOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChwYW5lICYmIHBhbmUuZ2V0R3JhbW1hciAmJiBwYW5lLmdldFBhdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0U2VydmVyRm9yRWRpdG9yKDxBdG9tLlRleHRFZGl0b3I+cGFuZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5lbXB0eTxJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yPigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb2JzZXJ2ZVRleHRFZGl0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIG9ic2VydmVDYWxsYmFjayhhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMsIGF0b20ud29ya3NwYWNlKVxyXG4gICAgICAgICAgICAubWVyZ2VNYXAoZWRpdG9yID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghZWRpdG9yLmdldFBhdGgoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZlQ2FsbGJhY2soZWRpdG9yLm9uRGlkQ2hhbmdlLCBlZGl0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoeCA9PiAhIXgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50YWtlKDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBPYnNlcnZhYmxlLm9mKGVkaXRvcik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5tZXJnZU1hcChlZGl0b3IgPT4gdGhpcy5fZ2V0U2VydmVyRm9yRWRpdG9yKGVkaXRvcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldFNlcnZlckZvckVkaXRvcih0ZXh0RWRpdG9yOiBBdG9tLlRleHRFZGl0b3IpOiBPYnNlcnZhYmxlPElMYW5ndWFnZUNsaWVudFRleHRFZGl0b3I+IHtcclxuICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZig8YW55PnRleHRFZGl0b3IpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==