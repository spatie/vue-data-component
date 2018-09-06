import search from '../filters/search';
import people from './helpers/people';
import { createQuery } from './util';

it('does nothing when empty', () => {
    const results = search()(people, createQuery());

    expect(results).toEqual(people);
});

it("searches all fields by specifying `['*']`", () => {
    const results = search()(
        people,
        createQuery({ filter: { search: 'Seb' } })
    );

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Sebastian');
});

it('searches specific fields when specified', () => {
    const searchName = search({
        fields: ['name'],
    });

    let results = searchName(
        people,
        createQuery({ filter: { search: 'Developer' } })
    );

    expect(results).toHaveLength(0);

    results = searchName(people, createQuery({ filter: { search: 'Seb' } }));

    expect(results).toHaveLength(1);
    expect(results).toEqual([{ name: 'Sebastian', job: 'Developer' }]);
});

it('searches case insensitively', () => {
    const searchAll = search();

    const results = searchAll(
        people,
        createQuery({ filter: { search: 'seb' } })
    );

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Sebastian');
});

it("doesn't search when minQueryLength isn't met", () => {
    const searchAll = search({
        minQueryLength: 5,
    });

    let results = searchAll(people, createQuery({ filter: { search: 'seb' } }));

    expect(results).toEqual(people);

    results = searchAll(people, createQuery({ filter: { search: 'sebas' } }));

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Sebastian');
});

it('searches with a custom key', () => {
    const searchAll = search({
        key: 'query',
    });

    const results = searchAll(
        people,
        createQuery({ filter: { query: 'Seb' } })
    );

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Sebastian');
});
