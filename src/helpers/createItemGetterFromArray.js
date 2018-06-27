import { flow } from './util';

export default function createItemGetterFromArray(array) {
    return state => {
        return {
            data: []
                .concat(array)
                .filter(createFilterFunction(state))
                .sort(createSortFunction(state)),
        };
    };
}

// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript/4760279#4760279
function createSortFunction({ sortBy, sortOrder }) {
    return (a, b) => {
        const sortOrderIndex = sortOrder === 'desc' ? -1 : 1;
        const result = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;

        return result * sortOrderIndex;
    };
}

function createFilterFunction({ filter }) {
    const normalizedFilter = filter.toLowerCase().replace(/[^A-Za-z0-9]*/g, '');

    return flow([
        row =>
            Object.values(row).filter(
                value => typeof value === 'string' || typeof value === 'number'
            ),
        values =>
            values
                .join('')
                .toLowerCase()
                .replace(/[^A-Za-z0-9]*/g, ''),
        matchString => matchString.indexOf(normalizedFilter) !== -1,
    ]);
}
