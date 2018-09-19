import sort from '../filters/sort';
import people from './helpers/people';
import { createQuery } from './helpers/util';

it('does nothing when empty', () => {
    const results = sort()(people, createQuery());

    expect(results).toEqual(people);
});

it('sorts ascending by default', () => {
    const results = sort()(people, createQuery({ sort: 'name' }));

    expect(results).toEqual([
        { name: 'Alex', job: 'Developer' },
        { name: 'Brent', job: 'Developer' },
        { name: 'Freek', job: 'Developer' },
        { name: 'Jef', job: 'Account manager' },
        { name: 'Sebastian', job: 'Developer' },
        { name: 'Willem', job: 'Designer' },
        { name: 'Wouter', job: 'Account manager' },
    ]);
});

it('sorts descending when the field name is prepended with `-`', () => {
    const results = sort()(people, createQuery({ sort: '-name' }));

    expect(results).toEqual([
        { name: 'Wouter', job: 'Account manager' },
        { name: 'Willem', job: 'Designer' },
        { name: 'Sebastian', job: 'Developer' },
        { name: 'Jef', job: 'Account manager' },
        { name: 'Freek', job: 'Developer' },
        { name: 'Brent', job: 'Developer' },
        { name: 'Alex', job: 'Developer' },
    ]);
});
