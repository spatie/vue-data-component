import { isObject, mapValues, pipe } from '../helpers/util';
import { parse as qsParse, stringify as qsStringify } from 'qs';

const qsOptions = {
    arrayFormat: 'brackets',
    encodeValuesOnly: true,
    skipNulls: true,
    sort: (a, b) => a.localeCompare(b),
};

const stringify = query => qsStringify(query, qsOptions);
const parse = query => qsParse(query, qsOptions);

export function fromQueryString(state, queryString = null) {
    if (queryString === null && typeof window !== 'undefined') {
        queryString = window.location.search;
    }

    return { ...state, ...parse(queryString) };
}

export function toQueryString(query, defaults) {
    return pipe(
        query,
        [filterEmptyStrings, sortArrayValues, stringify]
    );
}

function filterEmptyStrings(object) {
    return mapValues(object, value => {
        if (value === '') {
            return undefined;
        }

        if (isObject(value)) {
            return filterEmptyStrings(value);
        }

        return value;
    });
}

function sortArrayValues(object) {
    return mapValues(object, value => {
        if (Array.isArray(value)) {
            return value.sort();
        }

        if (isObject(value)) {
            return sortArrayValues(value);
        }

        return value;
    });
}
