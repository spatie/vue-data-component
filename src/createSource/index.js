import Source from './Source';

export default function createSource(data, options) {
    const resource = new Source(data, options);

    return resource.query.bind(resource);
}
