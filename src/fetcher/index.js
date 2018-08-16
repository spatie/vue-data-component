import search from './filters/search';

export default class Fetcher {
    static defaultFilters = [search()];

    constructor(data = [], options = {}) {
        this.data = data;
        this.filters = options.filters || Fetcher.defaultFilters;
    }

    addFilter(filter) {
        this.filters.push(filter);

        return this;
    }

    get(state = {}) {
        return this.filters.reduce((data, filter) => filter(data, state), [].concat(this.data));
    }
}

// function createFetcher(data, options = {}) {
//     return state => {
//         const totalCount = data.length;

//         let visibleData = [].concat(data);

//         if (options.searchBy && state.filter) {
//             if (typeof state.filter !== 'string' && typeof state.filter !== 'number') {
//                 throw new Error("Only strings and numbers are supported with `searchBy`")
//             }

//             visibleData = filterData(visibleData, options.searchBy, state.filter);
//         }

//         if (state.sort) {
//             visibleData = sortData(visibleData, state.sort);
//         }

//         return {
//             totalCount,
//             data: visibleData,
//         };
//     };
// }

// function filterData(data, fields, filter) {
//     const normalizedFilter = filter.toLowerCase().replace(/[^A-Za-z0-9]*/g, '');

//     if (!normalizedFilter) {
//         return data;
//     }

//     return data.filter(row => {
//         return Object.keys(row)
//             .filter(field => fields.indexOf(field) !== -1)
//             .map(field => row[field])
//             .join('')
//             .toLowerCase()
//             .replace(/[^A-Za-z0-9]*/g, '')
//             .indexOf(normalizedFilter) !== -1;
//     });
// }

// function sortData(data, sort) {
//     if (!sort) {
//         return data;
//     }

//     const sortOrder = sort.charAt(0) === '-' ? 'desc' : 'asc';
//     const sortBy = sortOrder === 'desc' ? sort.slice(1) : sort;

//     // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript/4760279#4760279
//     const compareFunction = (a, b) => {
//         const sortOrderIndex = sortOrder === 'desc' ? -1 : 1;
//         const result = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;

//         return result * sortOrderIndex;
//     };

//     return data.sort(compareFunction);
// }
