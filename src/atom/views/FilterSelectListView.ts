/**
 *
 */
import * as _ from 'lodash';
import { filter } from 'fuzzaldrin-plus';
import { SelectListView } from './SelectListView';

export abstract class FilterSelectListView<T> extends SelectListView<T> {
    public constructor() {
        super();
        this._filterEditorView.editor.buffer.onDidChange(() => {
            this.schedulePopulateList();
        });
    }

    public abstract filterKey: string;

    protected populateList() {
        if (this._items == null) {
            return;
        }
        const filterQuery = this.getFilterQuery();
        let filteredItems: T[];
        if (filterQuery.length) {
            filteredItems = filter(this._items, filterQuery, {
                key: this.filterKey
            });
        } else {
            filteredItems = this._items;
        }
        this.populateItems(filteredItems);
    }
}
