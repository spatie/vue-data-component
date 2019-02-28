import { default as WithData } from './components/WithData';
import { default as WithQuery } from './components/WithQuery';
import { default as DataFilter } from './components/DataFilter';
import { default as DataPaginator } from './components/DataPaginator';
import { default as DataSortToggle } from './components/DataSortToggle';

import { fromQueryString } from './queryString';

export { WithData, WithQuery, DataSortToggle, DataFilter, DataPaginator, fromQueryString };

const DataComponentPlugin = {
    install(Vue) {
        Vue.component('with-data', WithData);
        Vue.component('with-query', WithQuery);
        Vue.component('data-filter', DataFilter);
        Vue.component('data-paginator', DataPaginator);
        Vue.component('data-sort-toggle', DataSortToggle);
    },
};

export default DataComponentPlugin;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(DataComponentPlugin);
}
