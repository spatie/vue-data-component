export default function sort() {
    return function(data, query) {
        if (!query.sort) {
            return data;
        }

        const sortOrder = query.sort.charAt(0) === '-' ? 'desc' : 'asc';
        const sortBy = sortOrder === 'desc' ? query.sort.slice(1) : query.sort;

        // Based on https://stackoverflow.com/a/4760279
        const compareFunction = (a, b) => {
            const sortOrderIndex = sortOrder === 'desc' ? -1 : 1;

            const result = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;

            return result * sortOrderIndex;
        };

        return data.sort(compareFunction);
    };
}
