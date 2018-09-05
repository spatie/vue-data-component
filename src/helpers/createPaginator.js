import { range } from './util';

export default function createPaginator({ page, perPage, totalCount }) {
    const pageCount = perPage ? Math.ceil(totalCount / perPage) : 1;

    return range(pageCount).map(number => ({
        number,
        isActive: number === page,
    }));
}
