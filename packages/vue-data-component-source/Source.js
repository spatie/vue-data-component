import search from './filters/search';
import sort from './filters/sort';
import paginate from './filters/paginate';

export default class Source {
    constructor(data, options = {}) {
        this.data = data;

        this.filters = options.filters || [search(), sort(), paginate()];

        this.defaultQuery = {
            filter: null,
            sort: null,
            page: null,
            perPage: null,
            ...options.defaultQuery,
        };
    }

    query(query) {
        const data = this.filters.reduce(
            (data, filter) =>
                filter(data, {
                    ...this.defaultQuery,
                    ...query,
                }),
            [].concat(this.data)
        );

        return { data, totalCount: this.data.length };
    }
}
