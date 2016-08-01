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
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var ts_disposables_1 = require('ts-disposables');
var index_1 = require('../helpers/index');
var activeEditorCallback = function (pane) {
    if (pane && pane.getGrammar && pane.getPath) {
        return pane;
    }
    return null;
};
var AtomTextEditorSource = (function (_super) {
    __extends(AtomTextEditorSource, _super);
    function AtomTextEditorSource() {
        var _this = this;
        _super.call(this);
        this._subject = new rxjs_1.Subject();
        this._observeActiveTextEditor =
            rxjs_1.Observable.merge(index_1.observeCallback(atom.workspace.observeActivePaneItem, atom.workspace)
                .map(activeEditorCallback)
                .share(), rxjs_1.Observable.defer(function () { return rxjs_1.Observable.of(activeEditorCallback(atom.workspace.getActivePaneItem())); }));
        var editorAdded = index_1.observeCallback(atom.workspace.onDidAddTextEditor, atom.workspace)
            .mergeMap(function (_a) {
            var textEditor = _a.textEditor;
            if (!textEditor.getPath()) {
                return index_1.observeCallback(textEditor.onDidChangePath, textEditor)
                    .map(function () { return textEditor; })
                    .filter(function (x) { return !!x; })
                    .take(1);
            }
            return rxjs_1.Observable.of(textEditor);
        })
            .do(function (editor) {
            var cd = new ts_disposables_1.CompositeDisposable();
            var next = _.bind(_this._subject.next, _this._subject, editor);
            cd.add(editor.onDidChangeGrammar(next), editor.onDidChangePath(next));
            editor.onDidDestroy(function () {
                cd.dispose();
            });
        })
            .share();
        this._observeTextEditors =
            rxjs_1.Observable.merge(editorAdded, rxjs_1.Observable.defer(function () { return rxjs_1.Observable.from(atom.workspace.getTextEditors()); }));
    }
    Object.defineProperty(AtomTextEditorSource.prototype, "activeTextEditor", {
        get: function () {
            return atom.workspace.getActiveTextEditor();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AtomTextEditorSource.prototype, "textEditors", {
        get: function () {
            return atom.workspace.getTextEditors();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AtomTextEditorSource.prototype, "observeActiveTextEditor", {
        get: function () { return this._observeActiveTextEditor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AtomTextEditorSource.prototype, "observeTextEditors", {
        get: function () { return this._observeTextEditors; },
        enumerable: true,
        configurable: true
    });
    AtomTextEditorSource = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomTextEditorSource), 
        __metadata('design:paramtypes', [])
    ], AtomTextEditorSource);
    return AtomTextEditorSource;
}(ts_disposables_1.DisposableBase));
exports.AtomTextEditorSource = AtomTextEditorSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbVRleHRFZGl0b3JTb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9BdG9tVGV4dEVkaXRvclNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsMkJBQTJCO0FBQzNCLElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUFvQyxNQUFNLENBQUMsQ0FBQTtBQUMzQyxzQ0FBc0MsdUJBQXVCLENBQUMsQ0FBQTtBQUM5RCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUNyRSwrQkFBb0QsZ0JBQWdCLENBQUMsQ0FBQTtBQUNyRSxzQkFBZ0Msa0JBQWtCLENBQUMsQ0FBQTtBQUVuRCxJQUFNLG9CQUFvQixHQUFHLFVBQUMsSUFBUztJQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQWtCLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFJRjtJQUEwQyx3Q0FBYztJQUtwRDtRQUxKLGlCQXlEQztRQW5ETyxpQkFBTyxDQUFDO1FBSEosYUFBUSxHQUFHLElBQUssY0FBTyxFQUFtQixDQUFDO1FBSy9DLElBQUksQ0FBQyx3QkFBd0I7WUFDekIsaUJBQVUsQ0FBQyxLQUFLLENBQ1osdUJBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7aUJBQ2hFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztpQkFDekIsS0FBSyxFQUFFLEVBQ1osaUJBQVUsQ0FBQyxLQUFLLENBQUMsY0FBTSxPQUFBLGlCQUFVLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQXZFLENBQXVFLENBQUMsQ0FDbEcsQ0FBQztRQUVOLElBQU0sV0FBVyxHQUFHLHVCQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2FBQ2pGLFFBQVEsQ0FBQyxVQUFDLEVBQVk7Z0JBQVgsMEJBQVU7WUFDbEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsdUJBQWUsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQztxQkFDekQsR0FBRyxDQUFDLGNBQU0sT0FBQSxVQUFVLEVBQVYsQ0FBVSxDQUFDO3FCQUNyQixNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsQ0FBQyxFQUFILENBQUcsQ0FBQztxQkFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLENBQUM7WUFFRCxNQUFNLENBQUMsaUJBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLFVBQUMsTUFBTTtZQUNQLElBQU0sRUFBRSxHQUFHLElBQUksb0NBQW1CLEVBQUUsQ0FBQztZQUNyQyxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0QsRUFBRSxDQUFDLEdBQUcsQ0FDRixNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQy9CLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQy9CLENBQUM7WUFDRixNQUFNLENBQUMsWUFBWSxDQUFDO2dCQUNoQixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxLQUFLLEVBQUUsQ0FBQztRQUViLElBQUksQ0FBQyxtQkFBbUI7WUFDcEIsaUJBQVUsQ0FBQyxLQUFLLENBQ1osV0FBVyxFQUNYLGlCQUFVLENBQUMsS0FBSyxDQUFDLGNBQU0sT0FBQSxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQWhELENBQWdELENBQUMsQ0FDM0UsQ0FBQztJQUNWLENBQUM7SUFFRCxzQkFBVyxrREFBZ0I7YUFBM0I7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ2hELENBQUM7OztPQUFBO0lBRUQsc0JBQVcsNkNBQVc7YUFBdEI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMzQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHlEQUF1QjthQUFsQyxjQUF1QyxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDOUUsc0JBQVcsb0RBQWtCO2FBQTdCLGNBQWtDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQTFEeEU7UUFBQyx1QkFBVTtRQUNWLGtCQUFLLENBQUMsNkNBQXFCLENBQUM7OzRCQUFBO0lBMEQ3QiwyQkFBQztBQUFELENBQUMsQUF6REQsQ0FBMEMsK0JBQWMsR0F5RHZEO0FBekRZLDRCQUFvQix1QkF5RGhDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElBdG9tVGV4dEVkaXRvclNvdXJjZSB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlQmFzZSB9IGZyb20gJ3RzLWRpc3Bvc2FibGVzJztcclxuaW1wb3J0IHsgb2JzZXJ2ZUNhbGxiYWNrIH0gZnJvbSAnLi4vaGVscGVycy9pbmRleCc7XHJcblxyXG5jb25zdCBhY3RpdmVFZGl0b3JDYWxsYmFjayA9IChwYW5lOiBhbnkpID0+IHtcclxuICAgIGlmIChwYW5lICYmIHBhbmUuZ2V0R3JhbW1hciAmJiBwYW5lLmdldFBhdGgpIHtcclxuICAgICAgICByZXR1cm4gPEF0b20uVGV4dEVkaXRvcj5wYW5lO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XHJcblxyXG5AaW5qZWN0YWJsZVxyXG5AYWxpYXMoSUF0b21UZXh0RWRpdG9yU291cmNlKVxyXG5leHBvcnQgY2xhc3MgQXRvbVRleHRFZGl0b3JTb3VyY2UgZXh0ZW5kcyBEaXNwb3NhYmxlQmFzZSBpbXBsZW1lbnRzIElBdG9tVGV4dEVkaXRvclNvdXJjZSB7XHJcbiAgICBwcml2YXRlIF9vYnNlcnZlQWN0aXZlVGV4dEVkaXRvcjogT2JzZXJ2YWJsZTxBdG9tLlRleHRFZGl0b3IgfCBudWxsPjtcclxuICAgIHByaXZhdGUgX29ic2VydmVUZXh0RWRpdG9yczogT2JzZXJ2YWJsZTxBdG9tLlRleHRFZGl0b3I+O1xyXG4gICAgcHJpdmF0ZSBfc3ViamVjdCA9IG5ldyAgU3ViamVjdDxBdG9tLlRleHRFZGl0b3I+KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3IgPVxyXG4gICAgICAgICAgICBPYnNlcnZhYmxlLm1lcmdlKFxyXG4gICAgICAgICAgICAgICAgb2JzZXJ2ZUNhbGxiYWNrKGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbSwgYXRvbS53b3Jrc3BhY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcChhY3RpdmVFZGl0b3JDYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICAuc2hhcmUoKSxcclxuICAgICAgICAgICAgICAgIE9ic2VydmFibGUuZGVmZXIoKCkgPT4gT2JzZXJ2YWJsZS5vZihhY3RpdmVFZGl0b3JDYWxsYmFjayhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpKSkpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVkaXRvckFkZGVkID0gb2JzZXJ2ZUNhbGxiYWNrKGF0b20ud29ya3NwYWNlLm9uRGlkQWRkVGV4dEVkaXRvciwgYXRvbS53b3Jrc3BhY2UpXHJcbiAgICAgICAgICAgIC5tZXJnZU1hcCgoe3RleHRFZGl0b3J9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRleHRFZGl0b3IuZ2V0UGF0aCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmVDYWxsYmFjayh0ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlUGF0aCwgdGV4dEVkaXRvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoKSA9PiB0ZXh0RWRpdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHggPT4gISF4KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGFrZSgxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JzZXJ2YWJsZS5vZih0ZXh0RWRpdG9yKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmRvKChlZGl0b3IpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNkID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBfLmJpbmQodGhpcy5fc3ViamVjdC5uZXh0LCB0aGlzLl9zdWJqZWN0LCBlZGl0b3IpO1xyXG4gICAgICAgICAgICAgICAgY2QuYWRkKFxyXG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIobmV4dCksXHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlUGF0aChuZXh0KVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNkLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc2hhcmUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fb2JzZXJ2ZVRleHRFZGl0b3JzID1cclxuICAgICAgICAgICAgT2JzZXJ2YWJsZS5tZXJnZShcclxuICAgICAgICAgICAgICAgIGVkaXRvckFkZGVkLFxyXG4gICAgICAgICAgICAgICAgT2JzZXJ2YWJsZS5kZWZlcigoKSA9PiBPYnNlcnZhYmxlLmZyb20oYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKSkpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBhY3RpdmVUZXh0RWRpdG9yKCkge1xyXG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0ZXh0RWRpdG9ycygpIHtcclxuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG9ic2VydmVBY3RpdmVUZXh0RWRpdG9yKCkgeyByZXR1cm4gdGhpcy5fb2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3I7IH1cclxuICAgIHB1YmxpYyBnZXQgb2JzZXJ2ZVRleHRFZGl0b3JzKCkgeyByZXR1cm4gdGhpcy5fb2JzZXJ2ZVRleHRFZGl0b3JzOyB9XHJcbn1cclxuIl19