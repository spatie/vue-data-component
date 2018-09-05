import { range } from './util';

export default function createPaginator({ pageSize, pageNumber, totalCount }) {
    const pageCount = pageSize ? Math.ceil(totalCount / pageSize) : 1;

    return range(pageCount).map(number => {
        return { number, active: number === pageNumber };
    });
}
