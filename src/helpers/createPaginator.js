import { range } from './util';

export default function createPaginator({ page, pageSize, totalCount }) {
    const pageCount = pageSize ? Math.ceil(totalCount / pageSize) : 1;

    return range(pageCount).map(number => {
        return { number, active: number === page };
    });
}
