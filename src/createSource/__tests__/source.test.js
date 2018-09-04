import createSource, { Source } from '..';
import people from './helpers/people';

it('can be created as a class', () => {
    const userSource = new Source(people);

    expect(userSource.query()).toEqual({ data: people, totalCount: 7 });
});

it('can be created as a function', () => {
    const userSource = createSource(people);

    expect(userSource()).toEqual({ data: people, totalCount: 7 });
});

it('returns a total count', () => {
    const userSource = createSource(people);

    const result = userSource({ perPage: 2 });

    expect(result).toEqual({
        data: [
            { name: 'Willem', job: 'Designer' },
            { name: 'Freek', job: 'Developer' },
        ],
        totalCount: 7,
    });
});
