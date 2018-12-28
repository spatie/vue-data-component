import { toQueryString, fromQueryString } from '../queryString';
import { cloneDeep, debounce, get, isPromise, set } from '../util';

export default {
    name: 'DataComponent',

    props: {
        source: { required: true, type: Function },
        query: { default: () => ({}), type: Object },
        initial: { default: null, type: Object },
        debounceMs: { default: 0, type: Number },
        slowRequestMs: { default: 0, type: Number },
        useQueryString: { default: false, type: Boolean },
        queryStringDefaults: { default: null, type: Object },
        pageNumberKey: { default: 'page', type: String },
        pageSizeKey: { default: 'pageSize', type: String },
        pageCountKey: { default: 'pageCount', type: String },
        totalCountKey: { default: 'totalCount', type: String },
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
            lastFetchedQueryString: '',
        };
    },

    created() {
        // Register a debounced version of `fetchVisibleData` on the component
        // instance. This function doesn't need to be reactive, so it's not
        // registered via `data`.
        this.debouncedFetchVisibleData = this.debounceMs
            ? debounce(this.fetchVisibleData, this.debounceMs)
            : this.fetchVisibleData;

        if (this.useQueryString) {
            this.updateQueryFromQueryString();
        }

        if (this.initial) {
            this.hydrateWithInitialData();

            this.loadIfNotLoaded();

            // The next step in `created` is to fetch data from the source. If
            // `initial` is provided, we want to entirely skip the first
            // fetch.
            return;
        }

        const fetchResult = this.debouncedFetchVisibleData(this.query);

        // It's important that we handle promises and non-promises differently.
        // Non-promises can be resolved immediately, so they don't trigger a re-
        // render after the component is marked as loaded. Fetching data with a
        // promise will never display data in the first render.
        if (isPromise(fetchResult)) {
            fetchResult.then(this.loadIfNotLoaded);
        } else {
            this.loadIfNotLoaded();
        }
    },

    mounted() {
        // Registering the `slowRequestMs` timeout for the initial load must
        // happen in the `mounted` hook to support SSR.
        if (this.slowRequestMs && !this.isLoaded) {
            window.setTimeout(() => {
                this.isInitialLoadDelayFinished = true;
            }, this.slowRequestMs);
        }
    },

    watch: {
        query: {
            deep: true,
            handler(query) {
                let query = this.query;

                if (this.needsPageReset) {
                    query = cloneDeep(query);
                    set(query, this.pageNumberKey, 1);

                    this.$emit('update:query', query);
                }

                this.debouncedFetchVisibleData(query);
            },
        },

        activeRequestCount: {
            handler(activeRequestCount) {
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
                    }, this.slowRequestMs);
                }
            },
        },
    },

    computed: {
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

        previousQueryString() {
            return toQueryString(this.previousQuery, this.queryStringDefaults || this.initialQuery);
        },
    },

    methods: {
        fetchVisibleData(query, { force = false } = {}) {
            if (!force && !this.queryChangedSincePreviousFetch(query)) {
                return;
            }

            this.previousQuery = cloneDeep(query);

            const queryString = toQueryString(query, this.queryStringDefaults || this.initialQuery);

            if (this.useQueryString) {
                this.updateQueryString(queryString);
            }

            const result = this.source({
                query,
                force,
                queryString,
            });

            if (isPromise(result)) {
                this.activeRequestCount++;

                return result
                    .then(response => {
                        if (!response.hasOwnProperty('data')) {
                            throw response;
                        }

                        this.visibleData = response.data;
                        this.visibleCount = response.data.length;
                        this.totalCount = get(response, this.totalCountKey) || response.data.length;
                        this.pageCount = this.calculatePageCount(response);

                        this.activeRequestCount--;
                    })
                    .catch(response => {
                        this.activeRequestCount--;

                        if (response) {
                            this.$emit('error', response);
                        }
                    });
            }

            if (!result.hasOwnProperty('data')) {
                throw new Error('Fetcher must return a promise or an object with a `data` key');
            }

            this.visibleData = result.data;
            this.visibleCount = result.data.length;
            this.totalCount = get(result, this.totalCountKey) || result.data.length;
            this.pageCount = this.calculatePageCount(result);
            this.lastFetchedQueryString = queryString;
        },

        hydrateWithInitialData() {
            this.visibleData = this.initial.data;
            this.visibleCount = this.initial.data.length;
            this.totalCount =
                get(this.initial, this.totalCountKey) || this.initial.data.length;
            this.pageCount = this.calculatePageCount(this.initial);
        },

        updateQueryFromQueryString() {
            const query = fromQueryString(this.query, window.location.search);

            this.$emit('update:query', query);
        },

        updateQueryString(queryString) {
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
            let pageCount = get(fetchResult, this.pageCountKey);

            if (pageCount === undefined) {
                pageCount = this.pageSize ? Math.ceil(this.totalCount / this.pageSize) : 1;
            }

            return pageCount;
        },
    },

    render() {
        return this.$scopedSlots.default({
            data: this.visibleData,
            visibleCount: this.visibleCount,
            totalCount: this.totalCount,
            isLoaded: this.isLoaded,
            isSlowLoad: this.isInitialLoadDelayFinished && !this.isLoaded,
            isInitialLoadDelayFinished: this.isInitialLoadDelayFinished,
            isSlowRequest: this.isSlowRequest,
            pageCount: this.pageCount,
            queryString: this.lastFetchedQueryString,
        });
    },
};
