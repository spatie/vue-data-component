export default function paginate() {
    return function(data, query) {
        if (!query.pageSize) {
            return data;
        }

        const page = query.page || 1;

        const fromIndex = (page - 1) * query.pageSize;
        const toIndex = fromIndex + query.pageSize;

        return data.slice(fromIndex, toIndex);
    };
}
