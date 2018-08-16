import { arrayWrap, passThrough } from '../../util';

export default function search({ fields = '*', getQuery = passThrough, minQueryLength = 0 } = {}) {
    fields = arrayWrap(fields);

    return function(data, state) {
        const query = normalizeQuery(getQuery(state.filter));

        if (!query || query.length < minQueryLength || data.length === 0) {
            return data;
        }

        const searchAllFields = fields.indexOf('*') !== -1;

        return data.filter(item => {
            const filterableFields = searchAllFields ? Object.keys(item) : fields;

            return (
                filterableFields
                    .map(field => item[field])
                    .join('')
                    .toLowerCase()
                    .replace(/[^A-Za-z0-9]*/g, '')
                    .indexOf(query) !== -1
            );
        });
    };
}

function normalizeQuery(query) {
    if (query && typeof query !== 'string') {
        throw new Error('Filter must be a string');
    }

    if (!query) {
        return '';
    }

    return query.toLowerCase().replace(/[^A-Za-z0-9]*/g, '');
}
