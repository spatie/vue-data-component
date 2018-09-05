import { toQueryString } from '../';

it('creates an empty query string from an empty object', () => {
    const queryString = toQueryString({});

    expect(queryString).toBe('');
});

it('adds nothing from an undefined value', () => {
    const queryString = toQueryString({ search: undefined });

    expect(queryString).toBe('');
});

it('adds nothing from a null value', () => {
    const queryString = toQueryString({ search: null });

    expect(queryString).toBe('');
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

it('adds nothing key from an empty array', () => {
    const queryString = toQueryString({ ids: [] });

    expect(queryString).toBe('');
});

it('accepts an array value', () => {
    const queryString = toQueryString({ ids: [1, 2, 3] });

    expect(queryString).toBe('ids=1,2,3');
});

it('accepts an object value', () => {
    const queryString = toQueryString({
        filter: {
            name: 'Sebastian',
            company: 'Spatie',
        },
    });

    expect(queryString).toBe('filter[company]=Spatie&filter[name]=Sebastian');
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

    expect(queryString).toBe('filter[search.author]=Sebastian&filter[search.company]=Spatie');
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
        'filter[search.deeper.author]=Sebastian&filter[search.deeper.company]=Spatie'
    );
});
