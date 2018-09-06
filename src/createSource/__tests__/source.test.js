import createSource from '..';
import people from './helpers/people';

it('can create a source', () => {
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
