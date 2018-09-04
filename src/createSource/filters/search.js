const defaultSearchOptions = {
    fields: ['*'],
    key: 'search',
    minQueryLength: 0,
};

export default function search(searchOptions) {
    const { fields, key, minQueryLength } = {
        ...defaultSearchOptions,
        ...searchOptions,
    };

    return function(data, query) {
        const searchQuery = normalizeQuery(
            query.filter ? query.filter[key] : ''
        );

        if (
            !searchQuery ||
            searchQuery.length < minQueryLength ||
            data.length === 0
        ) {
            return data;
        }

        const searchAllFields = fields.indexOf('*') !== -1;

        return data.filter(item => {
            const filterableFields = searchAllFields
                ? Object.keys(item)
                : fields;

            return (
                filterableFields
                    .map(field => item[field])
                    .join('')
                    .toLowerCase()
                    .replace(/[^A-Za-z0-9]*/g, '')
                    .indexOf(searchQuery) !== -1
            );
        });
    };
}

function normalizeQuery(query) {
    if (query && typeof query !== 'string') {
        throw new Error(`Filter must be a string, [${query}] provided.`);
    }

    if (!query) {
        return '';
    }

    return query.toLowerCase().replace(/[^A-Za-z0-9]*/g, '');
}
