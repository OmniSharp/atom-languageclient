"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 *
 */
var _ = require('lodash');
var atom_languageservices_1 = require('atom-languageservices');
var constants_1 = require('../../constants');
var FilterSelectListView_1 = require('./FilterSelectListView');
var WorkspaceFinderView = (function (_super) {
    __extends(WorkspaceFinderView, _super);
    function WorkspaceFinderView(commands, navigation, results, filter$) {
        var _this = this;
        _super.call(this, commands);
        this._navigation = navigation;
        this._subscription = results.subscribe(function (items) {
            _this.setFilterItems(items.results, items.filter);
        });
        this._filterEditorView.getModel().buffer.onDidChange(function () {
            filter$.next(_this._filterEditorView.getModel().getText());
        });
        filter$.next('');
        this.storeFocusedElement();
        this._panel = atom.workspace.addModalPanel({ item: this.root });
        this.focusFilterEditor();
        this.setMaxItems(50);
        this._disposable.add(function () { return _this._panel.destroy(); });
    }
    Object.defineProperty(WorkspaceFinderView.prototype, "filterKeys", {
        get: function () {
            return [
                { name: 'filterText', weight: 0.4 },
                { name: 'name', weight: 0.6 }
            ];
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceFinderView.prototype.cancelled = function () {
        this._subscription.unsubscribe();
    };
    WorkspaceFinderView.prototype.confirmed = function (item) {
        this._subscription.unsubscribe();
        this._navigation.navigateTo(item);
    };
    WorkspaceFinderView.prototype.viewForItem = function (result) {
        var item = result.item, matches = result.matches;
        var li = document.createElement('li');
        var filename = atom.project.relativizePath(item.filePath)[1];
        if (item.location) {
            filename += ': ' + item.location.row;
        }
        var nameContent = item.name;
        // const pathMatches = _.find(matches!, { key: 'filePath' });
        // if (pathMatches) {
        //     filenameContent = this._getMatchString(filenameContent, pathMatches);
        // }
        var nameMatches = _.find(matches, { key: 'name' });
        if (nameMatches) {
            nameContent = this._getMatchString(nameContent, nameMatches);
        }
        /* tslint:disable-next-line:no-inner-html */
        li.innerHTML = "\n            <span>" + (item.iconHTML || this._renderIcon(item)) + "<span>" + nameContent + "</span></span><br/>\n            <span class=\"filename\">" + item.filePath + "</span>\n            ";
        return li;
    };
    WorkspaceFinderView.prototype._getMatchString = function (text, match) {
        _.each(_.reverse(match.indices), function (_a) {
            var start = _a[0], end = _a[1];
            var endStr = text.substr(end + 1);
            var replace = "<span class=\"character-match\">" + text.substr(start, end - start + 1) + "</span>";
            var startStr = text.substr(0, start);
            text = "" + startStr + replace + endStr;
        });
        return text;
    };
    WorkspaceFinderView.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromSuggestionType(completionItem.type) + ".svg\" />";
    };
    return WorkspaceFinderView;
}(FilterSelectListView_1.FilterSelectListView));
exports.WorkspaceFinderView = WorkspaceFinderView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya3NwYWNlRmluZGVyVmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hdG9tL3ZpZXdzL1dvcmtzcGFjZUZpbmRlclZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0dBRUc7QUFDSCxJQUFZLENBQUMsV0FBTSxRQUFRLENBQUMsQ0FBQTtBQUc1QixzQ0FBcUMsdUJBQXVCLENBQUMsQ0FBQTtBQUM3RCwwQkFBNEIsaUJBQWlCLENBQUMsQ0FBQTtBQUc5QyxxQ0FBcUMsd0JBQXdCLENBQUMsQ0FBQTtBQUU5RDtJQUF5Qyx1Q0FBc0M7SUFJM0UsNkJBQVksUUFBc0IsRUFBRSxVQUEwQixFQUFFLE9BQW9FLEVBQUUsT0FBNkI7UUFKdkssaUJBK0VDO1FBMUVPLGtCQUFNLFFBQVEsQ0FBQyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUs7WUFDeEMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxD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O1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU8seUNBQVcsR0FBbkIsVUFBb0IsY0FBdUQ7UUFDdkUsTUFBTSxDQUFDLHNEQUErQyx1QkFBVyxzQkFBaUIsb0NBQVksQ0FBQyx5QkFBeUIsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFDLGNBQVUsQ0FBQztJQUM3SixDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBL0VELENBQXlDLDJDQUFvQixHQStFNUQ7QUEvRVksMkJBQW1CLHNCQStFL0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKlxyXG4gKi9cclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgTmV4dE9ic2VydmVyIH0gZnJvbSAncnhqcy9PYnNlcnZlcic7XHJcbmltcG9ydCB7IEF1dG9jb21wbGV0ZSwgRmluZGVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tTmF2aWdhdGlvbiB9IGZyb20gJy4uL0F0b21OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgRmlsdGVyU2VsZWN0TGlzdFZpZXcgfSBmcm9tICcuL0ZpbHRlclNlbGVjdExpc3RWaWV3JztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3Jrc3BhY2VGaW5kZXJWaWV3IGV4dGVuZHMgRmlsdGVyU2VsZWN0TGlzdFZpZXc8RmluZGVyLklSZXNwb25zZT4ge1xyXG4gICAgcHJpdmF0ZSBfbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb247XHJcbiAgICBwcml2YXRlIF9zdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICAgIHByaXZhdGUgX3BhbmVsOiBBdG9tLlBhbmVsO1xyXG4gICAgY29uc3RydWN0b3IoY29tbWFuZHM6IEF0b21Db21tYW5kcywgbmF2aWdhdGlvbjogQXRvbU5hdmlnYXRpb24sIHJlc3VsdHM6IE9ic2VydmFibGU8eyBmaWx0ZXI6IHN0cmluZzsgcmVzdWx0czogRmluZGVyLklSZXNwb25zZVtdIH0+LCBmaWx0ZXIkOiBOZXh0T2JzZXJ2ZXI8c3RyaW5nPikge1xyXG4gICAgICAgIHN1cGVyKGNvbW1hbmRzKTtcclxuICAgICAgICB0aGlzLl9uYXZpZ2F0aW9uID0gbmF2aWdhdGlvbjtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSByZXN1bHRzLnN1YnNjcmliZShpdGVtcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RmlsdGVySXRlbXMoaXRlbXMucmVzdWx0cywgaXRlbXMuZmlsdGVyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9maWx0ZXJFZGl0b3JWaWV3LmdldE1vZGVsKCkuYnVmZmVyLm9uRGlkQ2hhbmdlKCgpID0+IHtcclxuICAgICAgICAgICAgZmlsdGVyJC5uZXh0KHRoaXMuX2ZpbHRlckVkaXRvclZpZXcuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGZpbHRlciQubmV4dCgnJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RvcmVGb2N1c2VkRWxlbWVudCgpO1xyXG4gICAgICAgIHRoaXMuX3BhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMucm9vdCB9KTtcclxuICAgICAgICB0aGlzLmZvY3VzRmlsdGVyRWRpdG9yKCk7XHJcbiAgICAgICAgdGhpcy5zZXRNYXhJdGVtcyg1MCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKCgpID0+IHRoaXMuX3BhbmVsLmRlc3Ryb3koKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBmaWx0ZXJLZXlzKCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2ZpbHRlclRleHQnLCB3ZWlnaHQ6IDAuNCB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICduYW1lJywgd2VpZ2h0OiAwLjYgfVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNhbmNlbGxlZCgpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29uZmlybWVkKGl0ZW06IEZpbmRlci5JUmVzcG9uc2UpIHtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgICB0aGlzLl9uYXZpZ2F0aW9uLm5hdmlnYXRlVG8oaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHZpZXdGb3JJdGVtKHJlc3VsdDogZnVzZS5SZXN1bHQ8RmluZGVyLklSZXNwb25zZT4pIHtcclxuICAgICAgICBjb25zdCB7aXRlbSwgbWF0Y2hlc30gPSByZXN1bHQ7XHJcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGxldCBmaWxlbmFtZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChpdGVtLmZpbGVQYXRoKVsxXTtcclxuICAgICAgICBpZiAoaXRlbS5sb2NhdGlvbikge1xyXG4gICAgICAgICAgICBmaWxlbmFtZSArPSAnOiAnICsgaXRlbS5sb2NhdGlvbi5yb3c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbmFtZUNvbnRlbnQgPSBpdGVtLm5hbWU7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHBhdGhNYXRjaGVzID0gXy5maW5kKG1hdGNoZXMhLCB7IGtleTogJ2ZpbGVQYXRoJyB9KTtcclxuICAgICAgICAvLyBpZiAocGF0aE1hdGNoZXMpIHtcclxuICAgICAgICAvLyAgICAgZmlsZW5hbWVDb250ZW50ID0gdGhpcy5fZ2V0TWF0Y2hTdHJpbmcoZmlsZW5hbWVDb250ZW50LCBwYXRoTWF0Y2hlcyk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGNvbnN0IG5hbWVNYXRjaGVzID0gXy5maW5kKG1hdGNoZXMhLCB7IGtleTogJ25hbWUnIH0pO1xyXG4gICAgICAgIGlmIChuYW1lTWF0Y2hlcykge1xyXG4gICAgICAgICAgICBuYW1lQ29udGVudCA9IHRoaXMuX2dldE1hdGNoU3RyaW5nKG5hbWVDb250ZW50LCBuYW1lTWF0Y2hlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbm5lci1odG1sICovXHJcbiAgICAgICAgbGkuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICA8c3Bhbj4ke2l0ZW0uaWNvbkhUTUwgfHwgdGhpcy5fcmVuZGVySWNvbihpdGVtKX08c3Bhbj4ke25hbWVDb250ZW50fTwvc3Bhbj48L3NwYW4+PGJyLz5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJmaWxlbmFtZVwiPiR7aXRlbS5maWxlUGF0aH08L3NwYW4+XHJcbiAgICAgICAgICAgIGA7XHJcblxyXG4gICAgICAgIHJldHVybiBsaTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRNYXRjaFN0cmluZyh0ZXh0OiBzdHJpbmcsIG1hdGNoOiBmdXNlLk1hdGNoKSB7XHJcbiAgICAgICAgXy5lYWNoKF8ucmV2ZXJzZShtYXRjaC5pbmRpY2VzKSwgKFtzdGFydCwgZW5kXSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlbmRTdHIgPSB0ZXh0LnN1YnN0cihlbmQgKyAxKTtcclxuICAgICAgICAgICAgY29uc3QgcmVwbGFjZSA9IGA8c3BhbiBjbGFzcz1cImNoYXJhY3Rlci1tYXRjaFwiPiR7dGV4dC5zdWJzdHIoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSl9PC9zcGFuPmA7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0U3RyID0gdGV4dC5zdWJzdHIoMCwgc3RhcnQpO1xyXG4gICAgICAgICAgICB0ZXh0ID0gYCR7c3RhcnRTdHJ9JHtyZXBsYWNlfSR7ZW5kU3RyfWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVuZGVySWNvbihjb21wbGV0aW9uSXRlbTogeyB0eXBlPzogQXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb25UeXBlOyB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGA8aW1nIGhlaWdodD1cIjE2cHhcIiB3aWR0aD1cIjE2cHhcIiBzcmM9XCJhdG9tOi8vJHtwYWNrYWdlTmFtZX0vc3R5bGVzL2ljb25zLyR7QXV0b2NvbXBsZXRlLmdldEljb25Gcm9tU3VnZ2VzdGlvblR5cGUoY29tcGxldGlvbkl0ZW0udHlwZSEpfS5zdmdcIiAvPmA7XHJcbiAgICB9XHJcbn1cclxuIl19