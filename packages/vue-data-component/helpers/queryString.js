import { parse, stringify } from 'query-string';

export function withQuery(state, queryString = null) {
    if (queryString === null && typeof window !== 'undefined') {
        queryString = window.location.search;
    }

    return parse(queryString);
}

export function toQuery(state) {
    return `?${stringify({ sort: state.sort })}`;
}
