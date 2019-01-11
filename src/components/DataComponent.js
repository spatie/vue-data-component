import { toQueryString } from '../queryString';
import { cloneDeep, diff, debounce, isPromise } from '../util';

export default {
    name: 'DataComponent',

    props: {
        source: { required: true, type: Function },
        query: { default: () => ({}), type: Object },
        initial: { default: null, type: Object },
        debounceMs: { default: 0, type: Number },
        slowRequestMs: { default: 0, type: Number },
        updateQueryString: { default: false, type: Boolean },
        queryStringDefaults: { default: null, type: Object },
    },

    data() {
        return {
            isLoaded: false,
            isInitialLoadDelayFinished: false,
            activeRequestCount: 0,
            isSlowRequest: false,
            visibleData: [],
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

        if (this.initial) {
            this.visibleData = this.initial;

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

            if (this.updateQueryString) {
                this.setWindowLocationFromQueryString(queryString);
            }

            const result = this.source({
                query,
                force,
                queryString,
            });

            if (isPromise(result)) {
                this.activeRequestCount++;

                return result
                    .then(data => {
                        this.visibleData = data;

                        this.activeRequestCount--;
                    })
                    .catch(data => {
                        this.activeRequestCount--;

                        if (data) {
                            this.$emit('error', data);
                        }
                    });
            }

            this.visibleData = result;
            this.lastFetchedQueryString = queryString;
        },

        setWindowLocationFromQueryString(queryString) {
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
    },

    render() {
        return this.$scopedSlots.default({
            data: this.visibleData,
            isLoaded: this.isLoaded,
            isSlowLoad: this.isInitialLoadDelayFinished && !this.isLoaded,
            isInitialLoadDelayFinished: this.isInitialLoadDelayFinished,
            isSlowRequest: this.isSlowRequest,
            queryString: this.lastFetchedQueryString,
        });
    },
};
