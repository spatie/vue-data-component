import { toQueryString } from '../';

it('creates an empty query string from an empty object', () => {
    const queryString = toQueryString({});

    expect(queryString).toBe('');
});

it('adds nothing from an undefined value', () => {
    const queryString = toQueryString({ search: undefined });

    expect(queryString).toBe('');
});

it('adds an empty key from a null value', () => {
    const queryString = toQueryString({ search: null });

    expect(queryString).toBe('search');
});

it('accepts a string value', () => {
    const queryString = toQueryString({ search: 'Sebastian' });

    expect(queryString).toBe('search=Sebastian');
});

it('accepts a number value', () => {
    const queryString = toQueryString({ page: 5 });

    expect(queryString).toBe('page=5');
});

it('accepts multiple values', () => {
    const queryString = toQueryString({ page: 5, search: 'Sebastian' });

    expect(queryString).toBe('page=5&search=Sebastian');
});

it('sorts multiple values', () => {
    const queryString = toQueryString({ search: 'Sebastian', page: 5 });

    expect(queryString).toBe('page=5&search=Sebastian');
});

it('accepts an array value', () => {
    const queryString = toQueryString({ ids: [1, 2, 3] });

    expect(queryString).toBe('ids=1%2C2%2C3');
});

it('accepts an object value', () => {
    const queryString = toQueryString({
        filter: {
            name: 'Sebastian',
            company: 'Spatie',
        },
    });

    expect(queryString).toBe('filter%5Bcompany%5D=Spatie&filter%5Bname%5D=Sebastian');
});

it('accepts a nested object value', () => {
    const queryString = toQueryString({
        filter: {
            search: {
                author: 'Sebastian',
                company: 'Spatie',
            },
        },
    });

    expect(queryString).toBe(
        'filter%5Bsearch.author%5D=Sebastian&filter%5Bsearch.company%5D=Spatie'
    );
});

it('accepts a deeply nested object value', () => {
    const queryString = toQueryString({
        filter: {
            search: {
                deeper: {
                    author: 'Sebastian',
                    company: 'Spatie',
                },
            },
        },
    });

    expect(queryString).toBe(
        'filter%5Bsearch.deeper.author%5D=Sebastian&filter%5Bsearch.deeper.company%5D=Spatie'
    );
});
