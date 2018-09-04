# A straightforward Vue component to filter, sort and paginate data.

[![Latest Version on NPM](https://img.shields.io/npm/v/vue-data-component.svg?style=flat-square)](https://npmjs.com/package/vue-data-component)
![Less than 4kb](https://img.shields.io/badge/size-%3C4kb-brightgreen.svg?style=flat-square)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/spatie/vue-data-component/master.svg?style=flat-square)](https://travis-ci.org/spatie/vue-data-component)
[![npm](https://img.shields.io/npm/dt/vue-data-component.svg?style=flat-square)](https://www.npmjs.com/package/vue-data-component)

**Work in progress!**

`vue-data-component` is a renderless component to build data-driven interfaces. Interfaces that contain filterable, sortable, or paginated data. We wanted to build something that takes care of pesky little problems like loading indicators, debouncing, or mapping your interface's filters to an AJAX request.

A brief overview of what `vue-data-component` has to offer:

- Filter, sort, and paginate data via AJAX or from a local array
- Sync the component state with the current URL's query string
- Debounce AJAX requests
- No unnecessary loading indicators, only if the request is taking too long
- Pass initial data for the component's first render when fetching data asynchronously
- Avoids layout jumps on first render when the data isn't loaded yet, inspired by React Suspense
- Lightweight, the base package is less than 4KB small
- Renderless: build your own interface, we don't make any assumptions
- Additional helper components for sort toggling, pagination, and facet filters

On their own, these features aren't super impressive, but together they enable you to build better interfaces in a uniform approach.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Installation

### Optional dependencies

- `query-string`
- `data-resource`

### Polyfills

- `Promise`
- `Array.from`

## Testing

```bash
yarn test
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Postcardware

You're free to use this package, but if it makes it to your production environment we highly appreciate you sending us a postcard from your hometown, mentioning which of our package(s) you are using.

Our address is: Spatie, Samberstraat 69D, 2060 Antwerp, Belgium.

We publish all received postcards [on our company website](https://spatie.be/en/opensource/postcards).

## Security

If you discover any security related issues, please contact freek@spatie.be instead of using the issue tracker.

## Credits

- [Sebastian De Deyne](https://github.com/sebdedeyne)
- [All Contributors](../../contributors)

## Support us

Spatie is a webdesign agency based in Antwerp, Belgium. You'll find an overview of all our open source projects [on our website](https://spatie.be/opensource).

Does your business depend on our contributions? Reach out and support us on [Patreon](https://www.patreon.com/spatie).
All pledges will be dedicated to allocating workforce on maintenance and new awesome stuff.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
