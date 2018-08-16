import Fetcher from '..';
import people from './fixtures/people';

describe('fetcher', () => {
    let data;

    beforeEach(() => {
        data = people;
    });

    it('returns all data with an empty state', () => {
        const fetcher = new Fetcher(data);

        expect(fetcher.get()).toEqual(data);
    });
});
