import { parse, stringify } from 'query-string';

export function fromQueryString(state, queryString = null) {
    if (queryString === null && typeof window !== 'undefined') {
        queryString = window.location.search;
    }

    return { ...state, ...parse(queryString) };
}

export function toQueryString(state, ignore) {
    const queryString = stringify({ sort: state.sort });

    return queryString ? `?${queryString}` : '';
}
