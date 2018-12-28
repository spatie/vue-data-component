# A straightforward Vue component to filter, sort and paginate data.

[![Latest Version on NPM](https://img.shields.io/npm/v/vue-data-component.svg?style=flat-square)](https://npmjs.com/package/vue-data-component)
![Less than 6.5kb](https://img.shields.io/badge/size-%3C6.5kb-brightgreen.svg?style=flat-square)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/spatie/vue-data-component/master.svg?style=flat-square)](https://travis-ci.org/spatie/vue-data-component)
[![npm](https://img.shields.io/npm/dt/vue-data-component.svg?style=flat-square)](https://www.npmjs.com/package/vue-data-component)

**Work in progress!**

`vue-data-component` is a renderless component to build data-driven interfaces. Especially interfaces that contain filterable, sortable, or paginated data. We wanted to build something that takes care of pesky little problems like loading indicators, debouncing, or mapping your interface's filters to an AJAX request.

A brief overview of what `vue-data-component` has to offer:

- Filter, sort, and paginate data via AJAX or from any other data source
- Sync the component state with the current URL's query string
- Debounce asynchronous requests
- Handle loading indicators. No unnecessary flashes, only display them if the request is taking too long
- Pass initial data for the component's first render when fetching data asynchronously, avoids layout jumps on first render when the data isn't loaded yet
- Renderless: build your own interface, we don't make any assumptions
- Additional helper components for sorting, pagination, and facet filters

On their own, none of these features are super impressive, but together they enable you to build better interfaces in a uniform approach.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Installation

With npm:

```
npm install vue-data-component
```

With yarn:

```
yarn add vue-data-component
```

This package contains a few components. You can register them all globally by installing this package as a plugin.

```js
import Vue from 'vue';
import VueDataComponent from 'vue-data-component';

Vue.use(VueDataComponent);
```

Alternatively, you can import the ones you need separately.

```js
import {
    DataComponent,
    QueryComponent,
    DataSortToggle,
    DataFilter,
    DataPaginator,
} from 'vue-data-component';
```

### Polyfills

`vue-data-component` expects the following browser API's to be available. If you expect wider browser support, you'll need to add a polyfill.

- `Promise` ([Can I use](https://caniuse.com/#feat=promises))
- `Array.from` ([ES compat](http://kangax.github.io/compat-table/es6/#test-Array.from))

## Usage

The main component exposed by this package is the

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source`* | `Function` | (required) | This function will be called to fetch data. It receives an object parameter: `{ query, queryString }`. The function should return a [response object](#response-objects). The response object mayb be wrapped in a promise. |
| `query` | `Object` | `{}` | A [query object](#query-objects). A deep watcher will be registered on the query object to determine when new data should be fetched. |
| `initial` | `Object` or `null` | `null` | An initial [response object](#response-objects) so the component can render as soon as possible. |
| `debounceMs` | `Number` | `0` | Data wont be subsequently fetched until the debounce time has passed. |
| `slowRequestMs` | `Number` | `0` | Requests that take longer than `slowRequestMs` will be considered slow. See [Handling slow requests](#handling-slow-requests). |
| `useQueryString` | `Boolean` | `false` | When `true`, the browser's query string will be updated based on the current query. See [Query strings](#query-strings).  This prop is currently not supported with SSR. |
| `queryStringDefaults` | `Object` or `null` | `null` | The default values for the query string. When these values match the current `query` values, they will be omitted from the query string. For example, you generally don't want `page=1` in your URL's, since it has the same effect as no `page` parameter. |

### Query objects

Todo

#### Query strings

### Response objects

Todo

### Handling slow requests

#### Slow initial loads

Todo

#### Slow subsequent requests

Todo

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

- [Sebastian De Deyne](https://github.com/sebastiandedeyne)
- [Adriaan Marain](https://github.com/AdrianMrn)
- [All Contributors](../../contributors)

## Support us

Spatie is a webdesign agency based in Antwerp, Belgium. You'll find an overview of all our open source projects [on our website](https://spatie.be/opensource).

Does your business depend on our contributions? Reach out and support us on [Patreon](https://www.patreon.com/spatie).
All pledges will be dedicated to allocating workforce on maintenance and new awesome stuff.

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
