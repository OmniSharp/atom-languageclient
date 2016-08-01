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
var Fuse = require('fuse.js');
var SelectListView_1 = require('./SelectListView');
var FilterSelectListView = (function (_super) {
    __extends(FilterSelectListView, _super);
    function FilterSelectListView(commands) {
        _super.call(this, commands);
        this._fuse = new Fuse([], {
            caseSensitive: false,
            tokenize: true,
            tokenSeparator: /(?:(?=[A-Z])|\s+)/,
            shouldSort: true,
            keys: this.filterKeys,
            include: ['matches', 'score']
        });
    }
    FilterSelectListView.prototype.setFilterItems = function (items, filter) {
        this._items = items != null ? items : [];
        this.populateList(filter);
        return this.setLoading();
    };
    FilterSelectListView.prototype.populateList = function (filter) {
        if (this._items == null) {
            return;
        }
        if (filter) {
            this._filter = filter;
        }
        filter = filter || this._filter;
        var filterQuery = filter || this.getFilterQuery();
        var filteredItems;
        if (filterQuery.length) {
            this._fuse.set(this._items);
            filteredItems = this._fuse.search(filterQuery);
        }
        else {
            filteredItems = _.map(this._items, function (item) { return ({ item: item }); });
        }
        this.populateItems(filteredItems);
    };
    return FilterSelectListView;
}(SelectListView_1.SelectListView));
exports.FilterSelectListView = FilterSelectListView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsdGVyU2VsZWN0TGlzdFZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXRvbS92aWV3cy9GaWx0ZXJTZWxlY3RMaXN0Vmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7R0FFRztBQUNILElBQVksQ0FBQyxXQUFNLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLElBQVksSUFBSSxXQUFNLFNBQVMsQ0FBQyxDQUFBO0FBRWhDLCtCQUErQixrQkFBa0IsQ0FBQyxDQUFBO0FBRWxEO0lBQXNELHdDQUFpQjtJQUduRSw4QkFBbUIsUUFBc0I7UUFDckMsa0JBQU0sUUFBUSxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBSSxFQUFFLEVBQUU7WUFDekIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsUUFBUSxFQUFFLElBQUk7WUFDZCxjQUFjLEVBQUUsbUJBQW1CO1lBQ25DLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtZQUNyQixPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDO1NBQ2hDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFJTSw2Q0FBYyxHQUFyQixVQUFzQixLQUFVLEVBQUUsTUFBMkI7UUFDekQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFUywyQ0FBWSxHQUF0QixVQUF1QixNQUFlO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQzFCLENBQUM7UUFDRCxNQUFNLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFaEMsSUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNwRCxJQUFJLGFBQStCLENBQUM7UUFDcEMsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVCLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxFQUFFLFVBQUksRUFBRSxDQUFDLEVBQVYsQ0FBVSxDQUFDLENBQUM7UUFDM0QsQ0FBQztRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNMLDJCQUFDO0FBQUQsQ0FBQyxBQTFDRCxDQUFzRCwrQkFBYyxHQTBDbkU7QUExQ3FCLDRCQUFvQix1QkEwQ3pDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICpcclxuICovXHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0ICogYXMgRnVzZSBmcm9tICdmdXNlLmpzJztcclxuaW1wb3J0IHsgQXRvbUNvbW1hbmRzIH0gZnJvbSAnLi4vQXRvbUNvbW1hbmRzJztcclxuaW1wb3J0IHsgU2VsZWN0TGlzdFZpZXcgfSBmcm9tICcuL1NlbGVjdExpc3RWaWV3JztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGaWx0ZXJTZWxlY3RMaXN0VmlldzxUPiBleHRlbmRzIFNlbGVjdExpc3RWaWV3PFQ+IHtcclxuICAgIHByaXZhdGUgX2Z1c2U6IEZ1c2U8VD47XHJcbiAgICBwcml2YXRlIF9maWx0ZXI6IHN0cmluZztcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21tYW5kczogQXRvbUNvbW1hbmRzKSB7XHJcbiAgICAgICAgc3VwZXIoY29tbWFuZHMpO1xyXG4gICAgICAgIHRoaXMuX2Z1c2UgPSBuZXcgRnVzZTxUPihbXSwge1xyXG4gICAgICAgICAgICBjYXNlU2Vuc2l0aXZlOiBmYWxzZSxcclxuICAgICAgICAgICAgdG9rZW5pemU6IHRydWUsXHJcbiAgICAgICAgICAgIHRva2VuU2VwYXJhdG9yOiAvKD86KD89W0EtWl0pfFxccyspLyxcclxuICAgICAgICAgICAgc2hvdWxkU29ydDogdHJ1ZSxcclxuICAgICAgICAgICAga2V5czogdGhpcy5maWx0ZXJLZXlzLFxyXG4gICAgICAgICAgICBpbmNsdWRlOiBbJ21hdGNoZXMnLCAnc2NvcmUnXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBmaWx0ZXJLZXlzOiBmdXNlLldlaWdodGVkS2V5W107XHJcblxyXG4gICAgcHVibGljIHNldEZpbHRlckl0ZW1zKGl0ZW1zOiBUW10sIGZpbHRlcj86IHN0cmluZyB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX2l0ZW1zID0gaXRlbXMgIT0gbnVsbCA/IGl0ZW1zIDogW107XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZUxpc3QoZmlsdGVyKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXRMb2FkaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHBvcHVsYXRlTGlzdChmaWx0ZXI/OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5faXRlbXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmaWx0ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyID0gZmlsdGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaWx0ZXIgPSBmaWx0ZXIgfHwgdGhpcy5fZmlsdGVyO1xyXG5cclxuICAgICAgICBjb25zdCBmaWx0ZXJRdWVyeSA9IGZpbHRlciB8fCB0aGlzLmdldEZpbHRlclF1ZXJ5KCk7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkSXRlbXM6IGZ1c2UuUmVzdWx0PFQ+W107XHJcbiAgICAgICAgaWYgKGZpbHRlclF1ZXJ5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9mdXNlLnNldCh0aGlzLl9pdGVtcyk7XHJcbiAgICAgICAgICAgIGZpbHRlcmVkSXRlbXMgPSB0aGlzLl9mdXNlLnNlYXJjaChmaWx0ZXJRdWVyeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmlsdGVyZWRJdGVtcyA9IF8ubWFwKHRoaXMuX2l0ZW1zLCBpdGVtID0+ICh7IGl0ZW0gfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvcHVsYXRlSXRlbXMoZmlsdGVyZWRJdGVtcyk7XHJcbiAgICB9XHJcbn1cclxuIl19