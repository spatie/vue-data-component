import DataComponent from './vue-data-component/components/DataComponent';
export default DataComponent;

export {
    DataSortToggle,
    DataFilterFacet,
    sanitizeQueryString,
    fromQueryString,
} from './vue-data-component/index';
export { default as createSource, search, sort, paginate } from './vue-data-component-source/index';
