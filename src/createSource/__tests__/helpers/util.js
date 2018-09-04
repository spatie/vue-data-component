export function createQuery(partialQuery) {
    return {
        filter: {
            search: '',
        },
        sort: null,
        page: null,
        perPage: null,
        ...partialQuery,
    };
}
