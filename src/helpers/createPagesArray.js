import { range } from '../util';

export default function createPagesArray({ page, perPage, totalCount }) {
    const pageCount = perPage === Infinity ? 1 : Math.ceil(totalCount / perPage);

    return range(pageCount).map(number => ({
        number,
        isActive: number === page,
    }));
}
