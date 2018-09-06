import sort from './filters/sort';
import search from './filters/search';
import paginate from './filters/paginate';

export default function createSource(data, options = {}) {
    const filters = options.filters || [search(), sort(), paginate()];

    return function({ query = {} } = {}) {
        const queriedData = filters.reduce(
            (data, filter) => filter(data, query),
            [].concat(data)
        );

        return {
            data: queriedData,
            totalCount: data.length,
        };
    };
}
