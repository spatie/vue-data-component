import paginate from '../filters/paginate';
import people from './helpers/people';
import { createQuery } from './util';

it('does nothing when perPage is empty', () => {
    const results = paginate()(people, createQuery());

    expect(results).toEqual(people);
});

it('paginates data', () => {
    const results = paginate()(people, createQuery({ page: 1, perPage: 2 }));

    expect(results).toEqual([
        { name: 'Willem', job: 'Designer' },
        { name: 'Freek', job: 'Developer' },
    ]);
});

it('paginates a specific page', () => {
    const results = paginate()(people, createQuery({ page: 2, perPage: 2 }));

    expect(results).toEqual([
        { name: 'Jef', job: 'Account manager' },
        { name: 'Sebastian', job: 'Developer' },
    ]);
});

it("returns the first page when page isn't, provided", () => {
    const results = paginate()(people, createQuery({ perPage: 2 }));

    expect(results).toEqual([
        { name: 'Willem', job: 'Designer' },
        { name: 'Freek', job: 'Developer' },
    ]);
});

it("returns an empty array when a page doesn't exist", () => {
    const results = paginate()(people, createQuery({ page: 1000, perPage: 10 }));

    expect(results).toHaveLength(0);
});
