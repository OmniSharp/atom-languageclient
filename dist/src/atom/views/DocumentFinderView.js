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
var DocumentFinderView = (function (_super) {
    __extends(DocumentFinderView, _super);
    function DocumentFinderView(commands, navigation, results) {
        var _this = this;
        _super.call(this, commands);
        this._navigation = navigation;
        this._subscription = results.subscribe(function (items) {
            _this.setFilterItems(items);
        });
        this._filterEditorView.getModel().buffer.onDidChange(function () {
            _this.populateList(_this._filterEditorView.getModel().getText());
        });
        this.storeFocusedElement();
        this._panel = atom.workspace.addModalPanel({ item: this.root });
        this.focusFilterEditor();
        this._disposable.add(function () { return _this._panel.destroy(); });
    }
    Object.defineProperty(DocumentFinderView.prototype, "filterKeys", {
        get: function () {
            return [
                { name: 'filterText', weight: 0.4 },
                { name: 'name', weight: 0.6 }
            ];
        },
        enumerable: true,
        configurable: true
    });
    DocumentFinderView.prototype.cancelled = function () {
        this._subscription.unsubscribe();
    };
    DocumentFinderView.prototype.confirmed = function (item) {
        this._subscription.unsubscribe();
        this._navigation.navigateTo(item);
    };
    DocumentFinderView.prototype.viewForItem = function (result) {
        var item = result.item, matches = result.matches;
        var li = document.createElement('li');
        var filename = atom.project.relativizePath(item.filePath)[1];
        if (item.location) {
            filename += ': ' + item.location.row;
        }
        var filenameContent = filename;
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
        li.innerHTML = "\n            <span>" + (item.iconHTML || this._renderIcon(item)) + "<span>" + nameContent + "</span></span><br/>\n            <span class=\"filename\">" + filenameContent + "</span>\n            ";
        return li;
    };
    DocumentFinderView.prototype._getMatchString = function (text, match) {
        _.each(_.reverse(match.indices), function (_a) {
            var start = _a[0], end = _a[1];
            var endStr = text.substr(end + 1);
            var replace = "<span class=\"character-match\">" + text.substr(start, end - start + 1) + "</span>";
            var startStr = text.substr(0, start);
            text = "" + startStr + replace + endStr;
        });
        return text;
    };
    DocumentFinderView.prototype._renderIcon = function (completionItem) {
        return "<img height=\"16px\" width=\"16px\" src=\"atom://" + constants_1.packageName + "/styles/icons/" + atom_languageservices_1.Autocomplete.getIconFromSuggestionType(completionItem.type) + ".svg\" />";
    };
    return DocumentFinderView;
}(FilterSelectListView_1.FilterSelectListView));
exports.DocumentFinderView = DocumentFinderView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRGaW5kZXJWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2F0b20vdmlld3MvRG9jdW1lbnRGaW5kZXJWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztHQUVHO0FBQ0gsSUFBWSxDQUFDLFdBQU0sUUFBUSxDQUFDLENBQUE7QUFFNUIsc0NBQXFDLHVCQUF1QixDQUFDLENBQUE7QUFDN0QsMEJBQTRCLGlCQUFpQixDQUFDLENBQUE7QUFHOUMscUNBQXFDLHdCQUF3QixDQUFDLENBQUE7QUFFOUQ7SUFBd0Msc0NBQXNDO0lBSTFFLDRCQUFZLFFBQXNCLEVBQUUsVUFBMEIsRUFBRSxPQUF1QztRQUozRyxpQkE4RUM7UUF6RU8sa0JBQU0sUUFBUSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSztZQUN4QyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDakQsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxH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QUFZLENBQUMseUJBQXlCLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQyxjQUFVLENBQUM7SUFDN0osQ0FBQztJQUNMLHlCQUFDO0FBQUQsQ0FBQyxBQTlFRCxDQUF3QywyQ0FBb0IsR0E4RTNEO0FBOUVZLDBCQUFrQixxQkE4RTlCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICpcclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEF1dG9jb21wbGV0ZSwgRmluZGVyIH0gZnJvbSAnYXRvbS1sYW5ndWFnZXNlcnZpY2VzJztcclxuaW1wb3J0IHsgcGFja2FnZU5hbWUgfSBmcm9tICcuLi8uLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgeyBBdG9tQ29tbWFuZHMgfSBmcm9tICcuLi9BdG9tQ29tbWFuZHMnO1xyXG5pbXBvcnQgeyBBdG9tTmF2aWdhdGlvbiB9IGZyb20gJy4uL0F0b21OYXZpZ2F0aW9uJztcclxuaW1wb3J0IHsgRmlsdGVyU2VsZWN0TGlzdFZpZXcgfSBmcm9tICcuL0ZpbHRlclNlbGVjdExpc3RWaWV3JztcclxuXHJcbmV4cG9ydCBjbGFzcyBEb2N1bWVudEZpbmRlclZpZXcgZXh0ZW5kcyBGaWx0ZXJTZWxlY3RMaXN0VmlldzxGaW5kZXIuSVJlc3BvbnNlPiB7XHJcbiAgICBwcml2YXRlIF9uYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbjtcclxuICAgIHByaXZhdGUgX3N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gICAgcHJpdmF0ZSBfcGFuZWw6IEF0b20uUGFuZWw7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb21tYW5kczogQXRvbUNvbW1hbmRzLCBuYXZpZ2F0aW9uOiBBdG9tTmF2aWdhdGlvbiwgcmVzdWx0czogT2JzZXJ2YWJsZTxGaW5kZXIuSVJlc3BvbnNlW10+KSB7XHJcbiAgICAgICAgc3VwZXIoY29tbWFuZHMpO1xyXG4gICAgICAgIHRoaXMuX25hdmlnYXRpb24gPSBuYXZpZ2F0aW9uO1xyXG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IHJlc3VsdHMuc3Vic2NyaWJlKGl0ZW1zID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRGaWx0ZXJJdGVtcyhpdGVtcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fZmlsdGVyRWRpdG9yVmlldy5nZXRNb2RlbCgpLmJ1ZmZlci5vbkRpZENoYW5nZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wdWxhdGVMaXN0KHRoaXMuX2ZpbHRlckVkaXRvclZpZXcuZ2V0TW9kZWwoKS5nZXRUZXh0KCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnN0b3JlRm9jdXNlZEVsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLl9wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiB0aGlzLnJvb3QgfSk7XHJcbiAgICAgICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9kaXNwb3NhYmxlLmFkZCgoKSA9PiB0aGlzLl9wYW5lbC5kZXN0cm95KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZmlsdGVyS2V5cygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IG5hbWU6ICdmaWx0ZXJUZXh0Jywgd2VpZ2h0OiAwLjQgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnbmFtZScsIHdlaWdodDogMC42IH1cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjYW5jZWxsZWQoKSB7XHJcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbmZpcm1lZChpdGVtOiBGaW5kZXIuSVJlc3BvbnNlKSB7XHJcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgdGhpcy5fbmF2aWdhdGlvbi5uYXZpZ2F0ZVRvKGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB2aWV3Rm9ySXRlbShyZXN1bHQ6IGZ1c2UuUmVzdWx0PEZpbmRlci5JUmVzcG9uc2U+KSB7XHJcbiAgICAgICAgY29uc3Qge2l0ZW0sIG1hdGNoZXN9ID0gcmVzdWx0O1xyXG4gICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBsZXQgZmlsZW5hbWUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoaXRlbS5maWxlUGF0aClbMV07XHJcbiAgICAgICAgaWYgKGl0ZW0ubG9jYXRpb24pIHtcclxuICAgICAgICAgICAgZmlsZW5hbWUgKz0gJzogJyArIGl0ZW0ubG9jYXRpb24ucm93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmlsZW5hbWVDb250ZW50ID0gZmlsZW5hbWU7XHJcbiAgICAgICAgbGV0IG5hbWVDb250ZW50ID0gaXRlbS5uYW1lO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBwYXRoTWF0Y2hlcyA9IF8uZmluZChtYXRjaGVzISwgeyBrZXk6ICdmaWxlUGF0aCcgfSk7XHJcbiAgICAgICAgLy8gaWYgKHBhdGhNYXRjaGVzKSB7XHJcbiAgICAgICAgLy8gICAgIGZpbGVuYW1lQ29udGVudCA9IHRoaXMuX2dldE1hdGNoU3RyaW5nKGZpbGVuYW1lQ29udGVudCwgcGF0aE1hdGNoZXMpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBjb25zdCBuYW1lTWF0Y2hlcyA9IF8uZmluZChtYXRjaGVzISwgeyBrZXk6ICduYW1lJyB9KTtcclxuICAgICAgICBpZiAobmFtZU1hdGNoZXMpIHtcclxuICAgICAgICAgICAgbmFtZUNvbnRlbnQgPSB0aGlzLl9nZXRNYXRjaFN0cmluZyhuYW1lQ29udGVudCwgbmFtZU1hdGNoZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5uZXItaHRtbCAqL1xyXG4gICAgICAgIGxpLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgICAgPHNwYW4+JHtpdGVtLmljb25IVE1MIHx8IHRoaXMuX3JlbmRlckljb24oaXRlbSl9PHNwYW4+JHtuYW1lQ29udGVudH08L3NwYW4+PC9zcGFuPjxici8+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZmlsZW5hbWVcIj4ke2ZpbGVuYW1lQ29udGVudH08L3NwYW4+XHJcbiAgICAgICAgICAgIGA7XHJcblxyXG4gICAgICAgIHJldHVybiBsaTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRNYXRjaFN0cmluZyh0ZXh0OiBzdHJpbmcsIG1hdGNoOiBmdXNlLk1hdGNoKSB7XHJcbiAgICAgICAgXy5lYWNoKF8ucmV2ZXJzZShtYXRjaC5pbmRpY2VzKSwgKFtzdGFydCwgZW5kXSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBlbmRTdHIgPSB0ZXh0LnN1YnN0cihlbmQgKyAxKTtcclxuICAgICAgICAgICAgY29uc3QgcmVwbGFjZSA9IGA8c3BhbiBjbGFzcz1cImNoYXJhY3Rlci1tYXRjaFwiPiR7dGV4dC5zdWJzdHIoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSl9PC9zcGFuPmA7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0U3RyID0gdGV4dC5zdWJzdHIoMCwgc3RhcnQpO1xyXG4gICAgICAgICAgICB0ZXh0ID0gYCR7c3RhcnRTdHJ9JHtyZXBsYWNlfSR7ZW5kU3RyfWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVuZGVySWNvbihjb21wbGV0aW9uSXRlbTogeyB0eXBlPzogQXV0b2NvbXBsZXRlLlN1Z2dlc3Rpb25UeXBlOyB9KSB7XHJcbiAgICAgICAgcmV0dXJuIGA8aW1nIGhlaWdodD1cIjE2cHhcIiB3aWR0aD1cIjE2cHhcIiBzcmM9XCJhdG9tOi8vJHtwYWNrYWdlTmFtZX0vc3R5bGVzL2ljb25zLyR7QXV0b2NvbXBsZXRlLmdldEljb25Gcm9tU3VnZ2VzdGlvblR5cGUoY29tcGxldGlvbkl0ZW0udHlwZSEpfS5zdmdcIiAvPmA7XHJcbiAgICB9XHJcbn1cclxuIl19