import { toQueryString, fromQueryString } from '../queryString';
import { createPaginator } from '../pagination';
import { cloneDeep, debounce, diff, get, set } from '../util';

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
        if (this.initialData) {
            this.hydrateWithInitialData();

            this.loadIfNotLoaded();
        }

        const fetchVisibleData = this.debounceMs
            ? debounce(this.fetchVisibleData, this.debounceMs)
            : this.fetchVisibleData;

        this.$watch('query', fetchVisibleData, {
            deep: true,
        });

        if (!this.loaded) {
            fetchVisibleData({ isFirstRender: true });
        }

        if (!this.initialLoadDelayMs) {
            this.loadIfNotLoaded();
        }
    },

    mounted() {
        if (!this.loaded) {
            window.setTimeout(() => {
                this.initialLoadDelayMsFinished = true;
            }, this.initialLoadDelayMs);
        }

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

            return get(diff(this.query, this.previousQuery), this.pageNumberKey) === undefined;
        },
    },

    methods: {
        fetchVisibleData({ isFirstRender = false, isForcedUpdate = false } = {}) {
            let query = cloneDeep(this.query);

            if (isFirstRender && this.queryString) {
                query = fromQueryString(query, window.location.search);

                this.$emit('update:query', query);
            }

            if (!isFirstRender && !isForcedUpdate && this.needsPageReset) {
                set(query, this.pageNumberKey, 1);

                this.$emit('update:query', query);
            }

            this.previousQuery = query;

            if (this.queryString && this.loaded) {
                this.updateQueryString();
            }

            const result = this.fetcher({
                query,
                isFirstRender,
                isForcedUpdate,
                queryString: toQueryString(this.query),
            });

            if (typeof result.then == 'function') {
                this.activeRequestCount++;

                result.then(
                    response => {
                        this.visibleData = response.data;
                        this.visibleCount = response.data.length;
                        this.totalCount = get(response, this.totalCountKey) || response.data.length;

                        this.loadIfNotLoaded();

                        this.activeRequestCount--;
                    },
                    () => {
                        this.activeRequestCount--;
                    }
                );
            } else if (result.hasOwnProperty('data')) {
                this.visibleData = result.data;
                this.visibleCount = result.data.length;
                this.totalCount = result.total || result.data.length;

                this.loadIfNotLoaded();
            } else {
                throw new Error('Fetcher must return a promise or an object with a `data` key');
            }
        },

        hydrateWithInitialData() {
            this.visibleData = this.initialData.data;
            this.visibleCount = this.initialData.data.length;
            this.totalCount = this.initialData.total || this.initialData.data.length;
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
            this.fetchVisibleData({ isForcedUpdate: true });
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
