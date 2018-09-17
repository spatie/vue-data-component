import { range } from '../util';

export function createPaginator({ page, pageSize, pageCount, totalCount }) {
    if (!pageCount) {
        pageCount = pageSize ? Math.ceil(totalCount / pageSize) : 1;
    }

    return range(pageCount).map(number => {
        return { number, active: number === page };
    });
}
