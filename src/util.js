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

export function flow(fns) {
    return subject => fns.reduce((subject, fn) => fn(subject), subject);
}

export function range(length) {
    return Array.from({ length }).map((v, k) => k + 1);
}

export function arrayWrap(array) {
    return Array.isArray(array) ? array : [array];
}

export function passThrough(value) {
    return value;
}
