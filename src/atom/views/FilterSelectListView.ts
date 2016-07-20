/**
 *
 */
import * as _ from 'lodash';
import Fuse = require('fuse.js');
import { SelectListView } from './SelectListView';

export abstract class FilterSelectListView<T> extends SelectListView<T> {
    private _fuse: Fuse<T>;
    public constructor() {
        super();
        // this._filterEditor.buffer.onDidChange(() => {
        //     this.schedulePopulateList();
        // });
        this._fuse = new Fuse<T>([], {
            caseSensitive: false,
            // distance: 200,
            // threshold: 0.6,
            // tokenize: true,
            shouldSort: true,
            keys: this.filterKeys,
            include: ['matches', 'score']
        });
    }

    public abstract filterKeys: string[];

    public setFilterItems(items: T[], filter: string) {
        this._items = items != null ? items : [];
        this.populateList(filter);
        return this.setLoading();
    }

    protected populateList(filter?: string) {
        if (this._items == null) {
            return;
        }
        const filterQuery = filter || this.getFilterQuery();
        let filteredItems: fuse.Result<T>[];
        if (filterQuery.length) {
            this._fuse.set(this._items);
            filteredItems = this._fuse.search(filterQuery);
        } else {
            filteredItems = _.map(this._items, item => ({ item }));
        }
        this.populateItems(filteredItems);
    }
}
