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

export function range(length) {
    return Array.from({ length }).map((v, k) => k + 1);
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
