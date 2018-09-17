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
        queryString: { default: false, type: Boolean },
        queryStringDefaults: { default: null, type: Object },
        pageNumberKey: { default: 'page' },
        pageSizeKey: { default: 'pageSize' },
        totalCountKey: { default: 'total' },
    },

    data() {
        return {
            loaded: false,
            initialLoadDelayMsFinished: false,
            activeRequestCount: 0,
            slowRequest: false,
            visibleData: [],
            visibleCount: 0,
            totalCount: 0,
            previousQuery: null,
            initialQuery: cloneDeep(this.query),
        };
    },

    created() {
        this.debouncedFetchVisibleData = this.debounceMs
            ? debounce(this.fetchVisibleData, this.debounceMs)
            : this.fetchVisibleData;

        let query = this.query;

        if (this.queryString) {
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
        if (!this.loaded) {
            window.setTimeout(() => {
                this.initialLoadDelayMsFinished = true;
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
                totalCount: this.totalCount || 0,
            });
        },

        pageNumber() {
            return get(this.query, this.pageNumberKey);
        },

        pageSize() {
            return get(this.query, this.pageSizeKey);
        },

        previousQueryDiff() {
            if (!this.previousQuery) {
                return {};
            }

            return diff(this.query, this.previousQuery);
        },

        queryChangedSincePreviousFetch() {
            if (!this.previousQuery) {
                return true;
            }

            return Object.keys(this.previousQueryDiff).length > 0;
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

            return get(this.previousQueryDiff, this.pageNumberKey) === undefined;
        },
    },

    methods: {
        fetchVisibleData(query, { force = false } = {}) {
            if (!force && !this.queryChangedSincePreviousFetch) {
                return;
            }

            this.previousQuery = query;

            if (this.queryString) {
                this.updateQueryString();
            }

            const result = this.fetcher({
                query,
                force,
                queryString: toQueryString(this.query),
            });

            if (isPromise(result)) {
                this.activeRequestCount++;

                return result.then(
                    response => {
                        this.visibleData = response.data;
                        this.visibleCount = response.data.length;
                        this.totalCount = get(response, this.totalCountKey) || response.data.length;

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
            this.totalCount = result.total || result.data.length;
        },

        hydrateWithInitialData() {
            this.visibleData = this.initialData.data;
            this.visibleCount = this.initialData.data.length;
            this.totalCount = this.initialData.total || this.initialData.data.length;
        },

        handleQueryChange() {
            const query = cloneDeep(this.query);

            if (this.needsPageReset) {
                set(query, this.pageNumberKey, 1);
            }

            this.debouncedFetchVisibleData(query);
        },

        handleActiveRequestCountChange(activeRequestCount) {
            if (activeRequestCount === 0 && this.slowRequestTimeout) {
                window.clearTimeout(this.slowRequestTimeout);

                this.slowRequest = false;

                this.$emit('slowrequestend');
            }

            if (activeRequestCount === 1) {
                this.slowRequestTimeout = window.setTimeout(() => {
                    if (!this.slowRequest) {
                        this.slowRequest = true;

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

        updateQueryString() {
            const queryString = toQueryString(
                this.query,
                this.queryStringDefaults || this.initialQuery
            );

            const url = queryString
                ? `${window.location.pathname}?${queryString}`
                : window.location.pathname;

            window.history.replaceState(null, null, url);
        },

        loadIfNotLoaded() {
            if (!this.loaded) {
                this.loaded = true;
                this.initialLoadDelayMsFinished = true;
            }
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
            loaded: this.loaded,
            loading: !this.loaded,
            slowLoad: this.initialLoadDelayMsFinished && !this.loaded,
            slowRequest: this.slowRequest,
            reset: this.reset,
            pages: this.paginator.length,
            paginator: this.paginator,
        });
    },
};
