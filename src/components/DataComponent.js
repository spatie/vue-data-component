import { createPaginator } from '../pagination';
import { toQueryString, fromQueryString } from '../queryString';
import { cloneDeep, debounce, diff, get, isPromise, set } from '../util';

export default {
    name: 'DataComponent',

    props: {
        fetcher: { required: true, type: Function },
        query: { default: () => ({}), type: Object },
        initialData: { default: null, type: Object },
        debounceMs: { default: 0, type: Number },
        initialLoadDelayMs: { default: 0, type: Number },
        slowRequestThresholdMs: { default: 400, type: Number },
        useQueryString: { default: false, type: Boolean },
        queryStringDefaults: { default: null, type: Object },
        pageNumberKey: { default: 'page' },
        pageSizeKey: { default: 'pageSize' },
        pageCountKey: { default: null },
        totalCountKey: { default: 'total' },
    },

    data() {
        return {
            isLoaded: false,
            isInitialLoadDelayFinished: false,
            activeRequestCount: 0,
            isSlowRequest: false,
            visibleData: [],
            visibleCount: 0,
            totalCount: 0,
            pageCount: 0,
            previousQuery: null,
            initialQuery: cloneDeep(this.query),
        };
    },

    created() {
        this.debouncedFetchVisibleData = this.debounceMs
            ? debounce(this.fetchVisibleData, this.debounceMs)
            : this.fetchVisibleData;

        let query = this.query;

        if (this.useQueryString) {
            query = this.updateQueryFromQueryString();
        }

        if (this.initialData) {
            this.hydrateWithInitialData();

            this.loadIfNotLoaded();

            return;
        }

        const fetchResult = this.debouncedFetchVisibleData(this.query);

        if (isPromise(fetchResult)) {
            fetchResult.then(this.loadIfNotLoaded);
        } else {
            this.loadIfNotLoaded();
        }
    },

    mounted() {
        if (!this.isLoaded) {
            window.setTimeout(() => {
                this.isInitialLoadDelayFinished = true;
            }, this.initialLoadDelayMs);
        }

        this.$watch('query', this.handleQueryChange, { deep: true });
        this.$watch('activeRequestCount', this.handleActiveRequestCountChange);
    },

    computed: {
        paginator() {
            return createPaginator({
                page: this.pageNumber,
                pageSize: this.pageSize,
                pageCount: this.pageCount,
                totalCount: this.totalCount || 0,
            });
        },

        pageNumber() {
            return get(this.query, this.pageNumberKey);
        },

        pageSize() {
            return get(this.query, this.pageSizeKey);
        },

        needsPageReset() {
            if (!this.pageNumber) {
                return false;
            }

            if (this.pageNumber == 1) {
                return false;
            }

            if (!this.previousQuery) {
                return false;
            }

            const queryDiff = diff(this.query, this.previousQuery);

            return get(queryDiff, this.pageNumberKey) === undefined;
        },
    },

    methods: {
        fetchVisibleData(query, { force = false } = {}) {
            if (!force && !this.queryChangedSincePreviousFetch(query)) {
                return;
            }

            this.previousQuery = cloneDeep(query);

            if (this.useQueryString) {
                this.updateQueryString(query);
            }

            const result = this.fetcher({
                query,
                force,
                queryString: toQueryString(query),
            });

            if (isPromise(result)) {
                this.activeRequestCount++;

                return result.then(
                    response => {
                        this.visibleData = response.data;
                        this.visibleCount = response.data.length;
                        this.totalCount = get(response, this.totalCountKey) || response.data.length;
                        this.pageCount = this.calculatePageCount(response);

                        this.activeRequestCount--;
                    },
                    () => {
                        this.activeRequestCount--;
                    }
                );
            }

            if (!result.hasOwnProperty('data')) {
                throw new Error('Fetcher must return a promise or an object with a `data` key');
            }

            this.visibleData = result.data;
            this.visibleCount = result.data.length;
            this.totalCount = get(result, this.totalCountKey) || result.data.length;
            this.pageCount = this.calculatePageCount(result);
        },

        hydrateWithInitialData() {
            this.visibleData = this.initialData.data;
            this.visibleCount = this.initialData.data.length;
            this.totalCount =
                get(this.initialData, this.totalCountKey) || this.initialData.data.length;
            this.pageCount = this.calculatePageCount(this.initialData);
        },

        handleQueryChange() {
            let query = this.query;

            if (this.needsPageReset) {
                query = cloneDeep(query);
                set(query, this.pageNumberKey, 1);

                this.$emit('update:query', query);
            }

            this.debouncedFetchVisibleData(query);
        },

        handleActiveRequestCountChange(activeRequestCount) {
            if (activeRequestCount === 0 && this.slowRequestTimeout) {
                window.clearTimeout(this.slowRequestTimeout);

                this.isSlowRequest = false;

                this.$emit('slowrequestend');
            }

            if (activeRequestCount === 1) {
                this.slowRequestTimeout = window.setTimeout(() => {
                    if (!this.isSlowRequest) {
                        this.isSlowRequest = true;

                        this.$emit('slowrequeststart');
                    }
                }, this.slowRequestThresholdMs);
            }
        },

        updateQueryFromQueryString() {
            const query = fromQueryString(this.query, window.location.search);

            this.$emit('update:query', query);

            return query;
        },

        updateQueryString(query) {
            const queryString = toQueryString(query, this.queryStringDefaults || this.initialQuery);

            const url = queryString
                ? `${window.location.pathname}?${queryString}`
                : window.location.pathname;

            window.history.replaceState(null, null, url);
        },

        queryChangedSincePreviousFetch(query) {
            if (!this.previousQuery) {
                return true;
            }

            const queryDiff = diff(query, this.previousQuery);

            return Object.keys(queryDiff).length > 0;
        },

        loadIfNotLoaded() {
            if (!this.isLoaded) {
                this.isLoaded = true;
                this.isInitialLoadDelayFinished = true;
            }
        },

        calculatePageCount(fetchResult) {
            if (this.pageCountKey) {
                return get(fetchResult, this.pageCountKey);
            }

            return this.pageSize ? Math.ceil(this.totalCount / this.pageSize) : 1;
        },

        forceUpdate() {
            this.fetchVisibleData({ force: true });
        },
    },

    render(createElement) {
        return this.$scopedSlots.default({
            data: this.visibleData,
            visibleCount: this.visibleCount,
            totalCount: this.totalCount,
            isLoaded: this.isLoaded,
            isSlowLoad: this.isInitialLoadDelayFinished && !this.isLoaded,
            isSlowRequest: this.isSlowRequest,
            reset: this.reset,
            pages: this.paginator.length,
            paginator: this.paginator,
        });
    },
};
