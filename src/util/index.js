export { default as set } from 'lodash.set';
export { default as mergeDeep } from 'deepmerge';

export function cloneDeep(object) {
    if (!object) {
        return object;
    }

    return JSON.parse(JSON.stringify(object));
}

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

// Modified version of https://github.com/mattphillips/deep-object-diff
export function diff(lhs, rhs) {
    if (lhs === rhs) {
        return {}; // equal return no diff
    }

    if (!isObject(lhs) || !isObject(rhs)) {
        return rhs; // return updated rhs
    }

    const deletedValues = Object.keys(lhs).reduce((acc, key) => {
        return rhs.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
    }, {});

    return Object.keys(rhs).reduce((acc, key) => {
        if (!lhs.hasOwnProperty(key)) {
            return { ...acc, [key]: rhs[key] }; // return added r key
        }

        if (Array.isArray(rhs[key])) {
            return { ...acc, [key]: rhs[key] };
        }

        const difference = diff(lhs[key], rhs[key]);

        if (isObject(difference) && isEmpty(difference)) {
            return acc; // return no diff
        }

        return { ...acc, [key]: difference }; // return updated key
    }, deletedValues);
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

export function isEmpty(object) {
    return Object.keys(object).length === 0;
}

export function isObject(object) {
    if (!object) {
        return false;
    }

    return typeof object === 'object';
}

export function isPromise(object) {
    return object && typeof object.then == 'function';
}

export function mapValues(object, callback) {
    return Object.keys(object).reduce((newObject, key) => {
        newObject[key] = callback(object[key]);
        return newObject;
    }, {});
}

export function range(length) {
    return Array.from({ length }).map((v, k) => k + 1);
}
