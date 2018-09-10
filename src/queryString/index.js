import { parse as qsParse, stringify as qsStringify } from 'qs';
import { cloneDeep, diff, isObject, mapValues, mergeDeep } from '../util';

const qsOptions = {
    arrayFormat: 'brackets',
    encodeValuesOnly: true,
    skipNulls: true,
    sort: (a, b) => a.localeCompare(b),
};

const stringify = query => qsStringify(query, qsOptions);
const parse = query => qsParse(query, qsOptions);

export function fromQueryString(defaultQuery, queryString = null) {
    if (queryString === null && typeof window !== 'undefined') {
        queryString = window.location.search;
    }

    const query = filterEmptyValues(parse(queryString));

    return mergeDeep(cloneDeep(defaultQuery), query);
}

export function toQueryString(query, defaults = {}) {
    return stringify(diff(sanitizeQuery(defaults), sanitizeQuery(query)));
}

function sanitizeQuery(query) {
    return sortArrayValues(filterEmptyValues(cloneDeep(query)));
}

function filterEmptyValues(object) {
    return Object.keys(object).reduce((filteredObject, key) => {
        if (isEmptyValue(object[key])) {
            return filteredObject;
        }

        if (Array.isArray(object[key])) {
            const value = object[key].filter(isNotEmptyValue);

            if (value.length === 0) {
                return filteredObject;
            }

            filteredObject[key] = value;

            return filteredObject;
        }

        if (isObject(object[key])) {
            const value = filterEmptyValues(object[key]);

            if (Object.keys(value).length === 0) {
                return filteredObject;
            }

            filteredObject[key] = value;

            return filteredObject;
        }

        filteredObject[key] = object[key];

        return filteredObject;
    }, {});
}

function isEmptyValue(value) {
    if (value === '') {
        return true;
    }

    if (value === undefined) {
        return true;
    }

    if (value === null) {
        return true;
    }

    return false;
}

function isNotEmptyValue(value) {
    return !isEmptyValue(value);
}

function sortArrayValues(object) {
    return mapValues(object, value => {
        if (Array.isArray(value)) {
            return value.sort();
        }

        if (isObject(value) && !Array.isArray(value)) {
            return sortArrayValues(value);
        }

        return value;
    });
}
