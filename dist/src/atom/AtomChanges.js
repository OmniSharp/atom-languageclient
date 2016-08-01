"use strict";
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
var _ = require('lodash');
var rxjs_1 = require('rxjs');
var atom_languageservices_1 = require('atom-languageservices');
var decorators_1 = require('atom-languageservices/decorators');
var AtomChanges = (function () {
    function AtomChanges() {
    }
    AtomChanges.prototype.applyChanges = function (editor, changes) {
        if (_.isString(changes)) {
            editor.setText(changes);
        }
        else {
            var changesArray_1 = this._orderInReverse(changes);
            editor.transact(function () {
                var buffer = editor.getBuffer();
                _.each(changesArray_1, function (change) {
                    buffer.setTextInRange(change.range, change.text);
                });
            });
        }
    };
    AtomChanges.prototype.applyWorkspaceChanges = function (textChanges) {
        var _this = this;
        return rxjs_1.Observable.from(textChanges)
            .concatMap(function (change) {
            return atom.workspace.open(change.filePath);
        }, function (_a, editor) {
            var changes = _a.changes;
            return ({ changes: changes, editor: editor });
        })
            .do(function (_a) {
            var changes = _a.changes, editor = _a.editor;
            _this._resetPreviewTab(editor);
            _this.applyChanges(editor, changes);
        })
            .reduce(_.noop, void 0);
    };
    AtomChanges.prototype._resetPreviewTab = function (editor) {
        var pane = atom.views.getView(editor);
        if (pane) {
            var title = pane.querySelector('.title.temp');
            if (title) {
                title.classList.remove('temp');
            }
            var tab = pane.querySelector('.preview-tab.active');
            if (tab) {
                tab.classList.remove('preview-tab');
                /* tslint:disable-next-line:no-any */
                tab.isPreviewTab = false;
            }
        }
    };
    AtomChanges.prototype._orderInReverse = function (changes) {
        return _.orderBy(changes, [function (result) { return result.range.start.row; }, function (result) { return result.range.start.column; }], ['desc', 'desc']);
    };
    AtomChanges = __decorate([
        decorators_1.injectable,
        decorators_1.alias(atom_languageservices_1.IAtomChanges), 
        __metadata('design:paramtypes', [])
    ], AtomChanges);
    return AtomChanges;
}());
exports.AtomChanges = AtomChanges;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXRvbUNoYW5nZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXRvbS9BdG9tQ2hhbmdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7R0FJRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLHFCQUEyQixNQUFNLENBQUMsQ0FBQTtBQUNsQyxzQ0FBbUMsdUJBQXVCLENBQUMsQ0FBQTtBQUMzRCwyQkFBa0Msa0NBQWtDLENBQUMsQ0FBQTtBQUlyRTtJQUFBO0lBb0RBLENBQUM7SUFqRFUsa0NBQVksR0FBbkIsVUFBb0IsTUFBdUIsRUFBRSxPQUFvQztRQUM3RSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQU0sY0FBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDWixJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2xDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBWSxFQUFFLFVBQUEsTUFBTTtvQkFDdkIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckQsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBRU0sMkNBQXFCLEdBQTVCLFVBQTZCLFdBQW9DO1FBQWpFLGlCQWFDO1FBWkcsTUFBTSxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUM5QixTQUFTLENBQ1YsVUFBQSxNQUFNO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxDQUFDLEVBQ0QsVUFBQyxFQUFTLEVBQUUsTUFBTTtnQkFBaEIsb0JBQU87WUFBYyxPQUFBLENBQUMsRUFBRSxnQkFBTyxFQUFFLGNBQU0sRUFBRSxDQUFDO1FBQXJCLENBQXFCLENBQzNDO2FBQ0EsRUFBRSxDQUFDLFVBQUMsRUFBaUI7Z0JBQWhCLG9CQUFPLEVBQUUsa0JBQU07WUFDakIsS0FBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVPLHNDQUFnQixHQUF4QixVQUF5QixNQUF1QjtRQUM1QyxJQUFNLElBQUksR0FBNkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBRUQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3RELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3BDLHFDQUFxQztnQkFDL0IsR0FBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBRU8scUNBQWUsR0FBdkIsVUFBb0QsT0FBWTtRQUM1RCxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBdEIsQ0FBc0IsRUFBRSxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBekIsQ0FBeUIsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDekgsQ0FBQztJQXJETDtRQUFDLHVCQUFVO1FBQ1Ysa0JBQUssQ0FBQyxvQ0FBWSxDQUFDOzttQkFBQTtJQXFEcEIsa0JBQUM7QUFBRCxDQUFDLEFBcERELElBb0RDO0FBcERZLG1CQUFXLGNBb0R2QixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqICBAbGljZW5zZSAgIE1JVFxyXG4gKiAgQGNvcHlyaWdodCBPbW5pU2hhcnAgVGVhbVxyXG4gKiAgQHN1bW1hcnkgICBBZGRzIHN1cHBvcnQgZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sIChhbmQgbW9yZSEpIHRvIGh0dHBzOi8vYXRvbS5pb1xyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IElBdG9tQ2hhbmdlcywgVGV4dCB9IGZyb20gJ2F0b20tbGFuZ3VhZ2VzZXJ2aWNlcyc7XHJcbmltcG9ydCB7IGFsaWFzLCBpbmplY3RhYmxlIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzL2RlY29yYXRvcnMnO1xyXG5cclxuQGluamVjdGFibGVcclxuQGFsaWFzKElBdG9tQ2hhbmdlcylcclxuZXhwb3J0IGNsYXNzIEF0b21DaGFuZ2VzIGltcGxlbWVudHMgSUF0b21DaGFuZ2VzIHtcclxuICAgIHB1YmxpYyBhcHBseUNoYW5nZXMoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IsIGJ1ZmZlcjogc3RyaW5nKTogdm9pZDtcclxuICAgIHB1YmxpYyBhcHBseUNoYW5nZXMoZWRpdG9yOiBBdG9tLlRleHRFZGl0b3IsIGNoYW5nZXM6IFRleHQuSUZpbGVDaGFuZ2VbXSk6IHZvaWQ7XHJcbiAgICBwdWJsaWMgYXBwbHlDaGFuZ2VzKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yLCBjaGFuZ2VzOiBzdHJpbmcgfCBUZXh0LklGaWxlQ2hhbmdlW10pIHtcclxuICAgICAgICBpZiAoXy5pc1N0cmluZyhjaGFuZ2VzKSkge1xyXG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dChjaGFuZ2VzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VzQXJyYXkgPSB0aGlzLl9vcmRlckluUmV2ZXJzZShjaGFuZ2VzKTtcclxuICAgICAgICAgICAgZWRpdG9yLnRyYW5zYWN0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcclxuICAgICAgICAgICAgICAgIF8uZWFjaChjaGFuZ2VzQXJyYXksIGNoYW5nZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLnNldFRleHRJblJhbmdlKGNoYW5nZS5yYW5nZSwgY2hhbmdlLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXBwbHlXb3Jrc3BhY2VDaGFuZ2VzKHRleHRDaGFuZ2VzOiBUZXh0LklXb3Jrc3BhY2VDaGFuZ2VbXSk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlLmZyb20odGV4dENoYW5nZXMpXHJcbiAgICAgICAgICAgIC5jb25jYXRNYXAoXHJcbiAgICAgICAgICAgIGNoYW5nZSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihjaGFuZ2UuZmlsZVBhdGgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoe2NoYW5nZXN9LCBlZGl0b3IpID0+ICh7IGNoYW5nZXMsIGVkaXRvciB9KVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICAgIC5kbygoe2NoYW5nZXMsIGVkaXRvcn0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jlc2V0UHJldmlld1RhYihlZGl0b3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseUNoYW5nZXMoZWRpdG9yLCBjaGFuZ2VzKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnJlZHVjZShfLm5vb3AsIHZvaWQgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVzZXRQcmV2aWV3VGFiKGVkaXRvcjogQXRvbS5UZXh0RWRpdG9yKSB7XHJcbiAgICAgICAgY29uc3QgcGFuZTogQXRvbS5UZXh0RWRpdG9yUHJlc2VudGVyID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XHJcbiAgICAgICAgaWYgKHBhbmUpIHtcclxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBwYW5lLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZS50ZW1wJyk7XHJcbiAgICAgICAgICAgIGlmICh0aXRsZSkge1xyXG4gICAgICAgICAgICAgICAgdGl0bGUuY2xhc3NMaXN0LnJlbW92ZSgndGVtcCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0YWIgPSBwYW5lLnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aWV3LXRhYi5hY3RpdmUnKTtcclxuICAgICAgICAgICAgaWYgKHRhYikge1xyXG4gICAgICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZXZpZXctdGFiJyk7XHJcbiAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55ICovXHJcbiAgICAgICAgICAgICAgICAoPGFueT50YWIpLmlzUHJldmlld1RhYiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29yZGVySW5SZXZlcnNlPFQgZXh0ZW5kcyBUZXh0LklGaWxlQ2hhbmdlPihjaGFuZ2VzOiBUW10pIHtcclxuICAgICAgICByZXR1cm4gXy5vcmRlckJ5KGNoYW5nZXMsIFtyZXN1bHQgPT4gcmVzdWx0LnJhbmdlLnN0YXJ0LnJvdywgcmVzdWx0ID0+IHJlc3VsdC5yYW5nZS5zdGFydC5jb2x1bW5dLCBbJ2Rlc2MnLCAnZGVzYyddKTtcclxuICAgIH1cclxufVxyXG4iXX0=