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
/* tslint:disable:no-any */
var ts_disposables_1 = require('ts-disposables');
var constants_1 = require('../constants');
var LanguageClientTextEditorChanges_1 = require('./LanguageClientTextEditorChanges');
var LanguageClientTextEditorContext = (function (_super) {
    __extends(LanguageClientTextEditorContext, _super);
    function LanguageClientTextEditorContext(editor, solution) {
        var _this = this;
        _super.call(this);
        this._loaded = false;
        this._changes = new LanguageClientTextEditorChanges_1.LanguageClientTextEditorChanges();
        this._version = 0;
        if (editor.omni) {
            return;
        }
        this._editor = editor;
        this._editor.languageclient = this;
        // this._solution = solution;
        // this._project = new EmptyProjectViewModel(null, solution.path);
        var view = atom.views.getView(editor);
        view.classList.add(constants_1.className);
        this._disposable.add(function () {
            delete _this._editor.languageclient;
            view.classList.remove(constants_1.className);
        }, this._editor.onDidChange(function () {
            _this._version += 1;
        }));
    }
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "solution", {
        get: function () {
            return this._solution;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "project", {
        get: function () {
            return this._project;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "temporary", {
        get: function () {
            return this._temporary || false;
        },
        set: function (value) {
            this._temporary = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "metadata", {
        get: function () {
            return this._metadata;
        },
        set: function (value) {
            this._metadata = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "version", {
        get: function () { return this._version; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "languageId", {
        get: function () { return this._editor.getGrammar().name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageClientTextEditorContext.prototype, "changes", {
        get: function () { return this._changes; },
        enumerable: true,
        configurable: true
    });
    return LanguageClientTextEditorContext;
}(ts_disposables_1.DisposableBase));
exports.LanguageClientTextEditorContext = LanguageClientTextEditorContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbW5pL0xhbmd1YWdlQ2xpZW50VGV4dEVkaXRvckNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILDJCQUEyQjtBQUMzQiwrQkFBK0IsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRCwwQkFBMEIsY0FBYyxDQUFDLENBQUE7QUFFekMsZ0RBQWdELG1DQUFtQyxDQUFDLENBQUE7QUFFcEY7SUFBcUQsbURBQWM7SUFVL0QseUNBQVksTUFBdUIsRUFBRSxRQUFnQjtRQVZ6RCxpQkFtRUM7UUF4RE8saUJBQU8sQ0FBQztRQVBKLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFHaEIsYUFBUSxHQUFHLElBQUksaUVBQStCLEVBQUUsQ0FBQztRQUNqRCxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBSWpCLEVBQUUsQ0FBQyxDQUFPLE1BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFRLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFFbkMsNkJBQTZCO1FBQzdCLGtFQUFrRTtRQUVsRSxJQUFNLElBQUksR0FBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQVMsQ0FBQyxDQUFDO1FBRTlCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUNoQjtZQUNJLE9BQU8sS0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7WUFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMscUJBQVMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsRUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUNyQixLQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDLENBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQUVELHNCQUFXLHFEQUFRO2FBQW5CO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDMUIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxvREFBTzthQUFsQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsbURBQU07YUFBakI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHNEQUFTO2FBQXBCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO1FBQ3BDLENBQUM7YUFFRCxVQUFxQixLQUFjO1lBQy9CLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQzVCLENBQUM7OztPQUpBO0lBTUQsc0JBQVcscURBQVE7YUFBbkI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO2FBQ0QsVUFBb0IsS0FBSztZQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUMzQixDQUFDOzs7T0FIQTtJQUtELHNCQUFXLG9EQUFPO2FBQWxCLGNBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDOUMsc0JBQVcsdURBQVU7YUFBckIsY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFbEUsc0JBQVcsb0RBQU87YUFBbEIsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNsRCxzQ0FBQztBQUFELENBQUMsQUFuRUQsQ0FBcUQsK0JBQWMsR0FtRWxFO0FBbkVZLHVDQUErQixrQ0FtRTNDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogIEBsaWNlbnNlICAgTUlUXHJcbiAqICBAY29weXJpZ2h0IE9tbmlTaGFycCBUZWFtXHJcbiAqICBAc3VtbWFyeSAgIEFkZHMgc3VwcG9ydCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9sYW5ndWFnZS1zZXJ2ZXItcHJvdG9jb2wgKGFuZCBtb3JlISkgdG8gaHR0cHM6Ly9hdG9tLmlvXHJcbiAqL1xyXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgKi9cclxuaW1wb3J0IHsgRGlzcG9zYWJsZUJhc2UgfSBmcm9tICd0cy1kaXNwb3NhYmxlcyc7XHJcbmltcG9ydCB7IGNsYXNzTmFtZSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IElMYW5ndWFnZUNsaWVudFRleHRFZGl0b3IgfSBmcm9tICcuL0lMYW5ndWFnZUNsaWVudFRleHRFZGl0b3InO1xyXG5pbXBvcnQgeyBMYW5ndWFnZUNsaWVudFRleHRFZGl0b3JDaGFuZ2VzIH0gZnJvbSAnLi9MYW5ndWFnZUNsaWVudFRleHRFZGl0b3JDaGFuZ2VzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBMYW5ndWFnZUNsaWVudFRleHRFZGl0b3JDb250ZXh0IGV4dGVuZHMgRGlzcG9zYWJsZUJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfZWRpdG9yOiBJTGFuZ3VhZ2VDbGllbnRUZXh0RWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBfcHJvamVjdDogT2JqZWN0O1xyXG4gICAgcHJpdmF0ZSBfc29sdXRpb246IE9iamVjdDtcclxuICAgIHByaXZhdGUgX2xvYWRlZCA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfdGVtcG9yYXJ5OiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfbWV0YWRhdGE6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9jaGFuZ2VzID0gbmV3IExhbmd1YWdlQ2xpZW50VGV4dEVkaXRvckNoYW5nZXMoKTtcclxuICAgIHByaXZhdGUgX3ZlcnNpb24gPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yLCBzb2x1dGlvbjogT2JqZWN0KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoKDxhbnk+ZWRpdG9yKS5vbW5pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2VkaXRvciA9IDxhbnk+ZWRpdG9yO1xyXG4gICAgICAgIHRoaXMuX2VkaXRvci5sYW5ndWFnZWNsaWVudCA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuX3NvbHV0aW9uID0gc29sdXRpb247XHJcbiAgICAgICAgLy8gdGhpcy5fcHJvamVjdCA9IG5ldyBFbXB0eVByb2plY3RWaWV3TW9kZWwobnVsbCwgc29sdXRpb24ucGF0aCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXc6IEhUTUxFbGVtZW50ID0gPGFueT5hdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKTtcclxuICAgICAgICB2aWV3LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGlzcG9zYWJsZS5hZGQoXHJcbiAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9lZGl0b3IubGFuZ3VhZ2VjbGllbnQ7XHJcbiAgICAgICAgICAgICAgICB2aWV3LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yLm9uRGlkQ2hhbmdlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnNpb24gKz0gMTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc29sdXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NvbHV0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcHJvamVjdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGxvYWRlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdGVtcG9yYXJ5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wb3JhcnkgfHwgZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0ZW1wb3JhcnkodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl90ZW1wb3JhcnkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1ldGFkYXRhKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXRhZGF0YTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgbWV0YWRhdGEodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9tZXRhZGF0YSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmVyc2lvbigpIHsgcmV0dXJuIHRoaXMuX3ZlcnNpb247IH1cclxuICAgIHB1YmxpYyBnZXQgbGFuZ3VhZ2VJZCgpIHsgcmV0dXJuIHRoaXMuX2VkaXRvci5nZXRHcmFtbWFyKCkubmFtZTsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY2hhbmdlcygpIHsgcmV0dXJuIHRoaXMuX2NoYW5nZXM7IH1cclxufVxyXG4iXX0=