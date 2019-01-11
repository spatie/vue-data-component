import { default as DataComponent } from './components/DataComponent';
import { default as QueryComponent } from './components/QueryComponent';
import { default as DataSortToggle } from './components/DataSortToggle';
import { default as DataFilter } from './components/DataFilter';
import { default as DataPaginator } from './components/DataPaginator';

import { fromQueryString } from './queryString';

export default {
    install(Vue) {
        Vue.component('data-component', DataComponent);
        Vue.component('query-component', QueryComponent);
        Vue.component('data-sort-toggle', DataSortToggle);
        Vue.component('data-filter', DataFilter);
        Vue.component('data-paginator', DataPaginator);
    },
};

export {
    DataComponent,
    QueryComponent,
    DataSortToggle,
    DataFilter,
    DataPaginator,
    fromQueryString,
};

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(DataComponent);
}
