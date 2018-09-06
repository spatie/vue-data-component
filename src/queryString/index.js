import { flatMap, fromPairs, isObject, mapValues, pipe, toPairs } from '../helpers/util';
import { parse, stringify } from 'qs';

const qsOptions = {
    arrayFormat: 'brackets',
    encodeValuesOnly: true,
    skipNulls: true,
    sort: (a, b) => a.localeCompare(b),
};

export function fromQueryString(state, queryString = null) {
    if (queryString === null && typeof window !== 'undefined') {
        queryString = window.location.search;
    }

    return { ...state, ...parse(queryString, qsOptions) };
}

export function toQueryString(query, defaults) {
    return stringify(query, qsOptions);
}
