import { flatMap, fromPairs, isObject, mapValues, pipe, toPairs } from '../helpers/util';
import { parse, stringify } from 'query-string';

export function fromQueryString(state, queryString = null) {
    if (queryString === null && typeof window !== 'undefined') {
        queryString = window.location.search;
    }

    return { ...state, ...parse(queryString) };
}

export function toQueryString(query, defaults) {
    return pipe(
        query,
        [toPairsRecursive, flattenPairs, fromPairs, query => stringify(query, { encode: false })]
    );
}

function toPairsRecursive(object, prefix = '', level = 0) {
    return toPairs(object).map(([key, value]) => {
        if (prefix && level === 1) {
            key = `${prefix}[${key}]`;
        }

        if (prefix && level > 1) {
            key = `${prefix.slice(0, -1)}.${key}]`;
        }

        if (Array.isArray(value)) {
            return [key, value.length ? value.join(',') : undefined];
        }

        if (isObject(value)) {
            return [key, toPairsRecursive(value, key, level + 1)];
        }

        if (value === null || value === '') {
            return [key, undefined];
        }

        return [key, value];
    });
}

function flattenPairs(pairs) {
    return pairs.reduce((newPairs, [key, value]) => {
        if (Array.isArray(value)) {
            return [...newPairs, ...flattenPairs(value)];
        }

        return [...newPairs, [key, value]];
    }, []);
}

function stringifyArrays(object) {
    return mapValues(object, value => {
        return Array.isArray(value) ? value.join(',') : value;
    });
}
