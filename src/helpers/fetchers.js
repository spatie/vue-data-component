export function createFetcher(data, decorators = []) {
    return state => {
        const visibleData = decorators.reduce(
            (data, decorator) => decorator(data, state),
            [].concat(data)
        );

        return { data: visibleData };
    };
}

export function sortBy(fields) {
    return (data, { sort }) => {
        const sortOrder = `${sort}`.charAt(0) === '-' ? 'desc' : 'asc';
        const sortBy = sortOrder === 'desc' ? sort.slice(1) : `${sort}`;

        if (fields.indexOf(sortBy) === -1) {
            return data;
        }

        // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript/4760279#4760279
        const compareFunction = (a, b) => {
            const sortOrderIndex = sortOrder === 'desc' ? -1 : 1;
            const result = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;

            return result * sortOrderIndex;
        };

        return data.sort(compareFunction);
    }
}

export function filterBy(fields) {
    return (data, { filter }) => {
        const normalizedFilter = `${filter}`.toLowerCase().replace(/[^A-Za-z0-9]*/g, '');

        if (! normalizedFilter) {
            return data;
        }

        return data.filter(row => {
            return Object.keys(row)
                .filter(field => fields.indexOf(field) !== -1)
                .map(field => row[field])
                .join('')
                .toLowerCase()
                .replace(/[^A-Za-z0-9]*/g, '')
                .indexOf(normalizedFilter) !== -1;
        });
    }
}
