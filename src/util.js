// https://davidwalsh.name/javascript-debounce-function
export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export function defaultFilterFunction(items, filter) {
    if (!filter) {
        return items;
    }

    const normalizedFilter = filter.toLowerCase().replace(/[^A-Za-z0-9]*/g, '');

    const filterCallback = flow([
        row => Object.values(row)
            .filter(value => typeof value === 'string' || typeof value === 'number'),
        values =>
            values
                .join('')
                .toLowerCase()
                .replace(/[^A-Za-z0-9]*/g, ''),
        matchString => matchString.indexOf(normalizedFilter) !== -1,
    ]);

    return items.filter(filterCallback);
}

// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript/4760279#4760279
export function defaultSortFunction(items, { sortBy, sortOrder }) {
    const sortCallback = (a, b) => {
        let sortOrderIndex = sortOrder === 'desc' ? -1 : 1;

        const result = a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;

        return result * sortOrderIndex;
    };

    return items.sort(sortCallback);
}

export function get(object, path) {
    if (!path) {
        return object;
    }

    if (object === null || typeof object !== 'object') {
        return object;
    }

    const [pathHead, pathTail] = path.split(/\.(.+)/);

    return get(object[pathHead], pathTail);
}

export function keyBy(collection, key) {
    return collection.reduce((keyedCollection, item) => {
        keyedCollection[get(item, key)] = item;
        return keyedCollection;
    }, {});
}

export function flow(fns) {
    return subject => fns.reduce((subject, fn) => fn(subject), subject);
}
