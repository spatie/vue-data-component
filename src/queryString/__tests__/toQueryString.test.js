import { toQueryString } from '../';

it('creates an empty query string from an empty object', () => {
    const queryString = toQueryString({});

    expect(queryString).toBe('');
});

it('adds nothing from an undefined value', () => {
    const queryString = toQueryString({ search: undefined });

    expect(queryString).toBe('');
});

it('adds nothing from a nested undefined', () => {
    const queryString = toQueryString({
        filter: {
            search: undefined,
        },
    });

    expect(queryString).toBe('');
});

it('adds nothing from a null value', () => {
    const queryString = toQueryString({ search: null });

    expect(queryString).toBe('');
});

it('adds nothing from a nested null value', () => {
    const queryString = toQueryString({
        filter: {
            search: null,
        },
    });

    expect(queryString).toBe('');
});

it('adds nothing from an empty string', () => {
    const queryString = toQueryString({ search: '' });

    expect(queryString).toBe('');
});

it('adds nothing from a nested empty string', () => {
    const queryString = toQueryString({
        filter: {
            search: '',
        },
    });

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

    expect(queryString).toBe('ids[]=1&ids[]=2&ids[]=3');
});

it('sorts array values', () => {
    const queryString = toQueryString({ ids: [2, 1, 3] });

    expect(queryString).toBe('ids[]=1&ids[]=2&ids[]=3');
});

it('sorts nested array values', () => {
    const queryString = toQueryString({
        filter: {
            ids: [2, 1, 3],
        },
    });

    expect(queryString).toBe('ids[]=1&ids[]=2&ids[]=3');
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

    expect(queryString).toBe('filter[search][author]=Sebastian&filter[search][company]=Spatie');
});

it('sorts nested object value keys', () => {
    const queryString = toQueryString({
        filter: {
            search: {
                company: 'Spatie',
                author: 'Sebastian',
            },
        },
    });

    expect(queryString).toBe('filter[search][author]=Sebastian&filter[search][company]=Spatie');
});

it('accepts a value with dotted keys', () => {
    const queryString = toQueryString({
        filter: {
            'search.author': 'Sebastian',
            'search.company': 'Spatie',
        },
    });

    expect(queryString).toBe('filter[search.author]=Sebastian&filter[search.company]=Spatie');
});
