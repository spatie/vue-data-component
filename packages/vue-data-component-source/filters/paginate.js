export default function paginate() {
    return function(data, query) {
        if (!query.perPage) {
            return data;
        }

        const page = query.page || 1;

        const fromIndex = (page - 1) * query.perPage;
        const toIndex = fromIndex + query.perPage;

        return data.slice(fromIndex, toIndex);
    };
}
