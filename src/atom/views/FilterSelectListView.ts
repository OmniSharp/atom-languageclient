/**
 *
 */
import * as _ from 'lodash';
import Fuse = require('fuse.js');
import { SelectListView } from './SelectListView';

export abstract class FilterSelectListView<T> extends SelectListView<T> {
    private _fuse: Fuse<T>;
    private _filter: string;
    public constructor() {
        super();
        // this._filterEditor.buffer.onDidChange(() => {
        //     this.schedulePopulateList();
        // });
        this._fuse = new Fuse<T>([], {
            caseSensitive: false,
            tokenize: true,
            tokenSeparator: /(?:(?=[A-Z])|\s+)/,
            shouldSort: true,
            keys: this.filterKeys,
            include: ['matches', 'score']
        });
    }

    public abstract filterKeys: fuse.WeightedKey[];

    public setFilterItems(items: T[], filter: string | undefined) {
        this._items = items != null ? items : [];
        this.populateList(filter);
        return this.setLoading();
    }

    protected populateList(filter?: string) {
        if (this._items == null) {
            return;
        }
        if (filter) {
            this._filter = filter;
        }
        filter = filter || this._filter;

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
