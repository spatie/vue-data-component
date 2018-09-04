import Source from './Source';

export default function createSource(data, options) {
    const resource = new Source(data, options);

    return resource.query.bind(resource);
}

export { Source };

export { default as sort } from './filters/sort';
export { default as search } from './filters/search';
