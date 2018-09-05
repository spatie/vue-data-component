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

export function flatMap(array, callback) {
    return [].concat([], ...array.map(callback));
}

export function fromPairs(pairs) {
    return pairs.reduce((object, [key, value]) => {
        object[key] = value;
        return object;
    }, {});
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

export function isObject(object) {
    if (!object) {
        return false;
    }

    if (Array.isArray(object)) {
        return false;
    }

    return typeof object === 'object';
}

export function mapValues(object, callback) {
    return Object.keys(object).reduce((newObject, key) => {
        newObject[key] = callback(object[key]);
        return newObject;
    }, {});
}

export function pipe(subject, fns) {
    return fns.reduce((subject, fn) => fn(subject), subject);
}

export function range(length) {
    return Array.from({ length }).map((v, k) => k + 1);
}

export function toPairs(object) {
    return Object.entries(object);
}
