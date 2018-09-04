import { parse, stringify } from 'query-string';

export function sanitizeQueryString(state) {
    if (state.page === 1) {
        delete state.page;
    }

    delete state.perPage;

    return state;
}

export function withQuery(state, queryString = null) {
    if (queryString === null && typeof window !== 'undefined') {
        queryString = window.location.search;
    }

    return { ...state, ...parse(queryString) };
}

export function toQuery(state, ignore) {
    const queryString = stringify({ sort: state.sort });

    return queryString ? `?${queryString}` : '';
}
