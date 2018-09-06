export default function createSource(data, options) {
    const filters = options.filters || [search(), sort(), paginate()];

    return function(query = {}) {
        const data = filters.reduce((data, filter) => filter(data, query), [].concat(data));

        return { data, totalCount: data.length };
    };
}
