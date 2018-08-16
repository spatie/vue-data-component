import search from '../filters/search';
import people from './fixtures/people';

describe('fetcher', () => {
    let data;

    beforeEach(() => {
        data = people;
    });

    it("searches all fields specifying `'*'`", () => {
        const searchAll = search({
            fields: '*',
        });

        let results = searchAll(data, { filter: 'Seb' });

        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Sebastian');
    });

    it("searches all fields by specifying `['*']`", () => {
        const searchAll = search({
            fields: ['*'],
        });

        let results = searchAll(data, { filter: 'Seb' });

        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Sebastian');
    });

    it('searches specific fields when specified', () => {
        const searchName = search({
            fields: ['name'],
        });

        let results = searchName(data, { filter: 'Developer' });

        expect(results).toHaveLength(0);

        results = searchName(data, { filter: 'Seb' });

        expect(results).toHaveLength(1);
        expect(results).toEqual([{ name: 'Sebastian', job: 'Developer' }]);
    });

    it('searches case insensitively', () => {
        const searchAll = search();

        let results = searchAll(data, { filter: 'seb' });

        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Sebastian');
    });

    it("doesn't search when minQueryLength isn't met", () => {
        const searchAll = search({
            minQueryLength: 5,
        });

        let results = searchAll(data, { filter: 'seb' });

        expect(results).toEqual(data);

        results = searchAll(data, { filter: 'sebas' });

        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Sebastian');
    });

    it('searches with a different query whith getQuery', () => {
        const searchAll = search({
            getQuery: filter => filter.query,
        });

        let results = searchAll(data, { filter: { query: 'Seb' } });

        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Sebastian');
    });
});
