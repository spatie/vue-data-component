import search from './filters/search';
import sort from './filters/sort';
import paginate from './filters/paginate';

export default class Source {
    constructor(data, options = {}) {
        this.data = data;

        this.filters = options.filters || [search(), sort(), paginate()];
    }

    query(query) {
        const data = this.filters.reduce(
            (data, filter) => filter(data, query),
            [].concat(this.data)
        );

        return { data, totalCount: this.data.length };
    }
}
