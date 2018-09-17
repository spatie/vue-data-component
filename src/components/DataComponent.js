import { debounce } from '../util';
import { toQueryString } from '../queryString';
import { createPaginator } from '../pagination';

export default {
    name: 'DataComponent',

    props: {
        source: { required: true, type: Function },
        query: { default: () => ({}), type: Object },
        pageSize: { default: null },
        pageNumber: { default: null },
        initialData: { default: null, type: Object },
        debounceMs: { default: 0, type: Number },
        initialLoadDelayMs: { default: 0, type: Number },
        slowRequestThresholdMs: { default: 400, type: Number },
        queryString: { default: false, type: Boolean },
        queryStringDefaults: { default: () => ({}), type: Object },
    },

    data: () => ({
        loaded: false,
        initialLoadDelayMsFinished: false,
        activeRequestCount: 0,
        slowRequest: false,

        visibleData: [],
        visibleCount: 0,
        totalCount: 0,
    }),

    created() {
        if (this.initialData) {
            this.hydrateWithInitialData();

            this.loadIfNotLoaded();
        }

        const getVisibleData = this.debounceMs
            ? debounce(this.getVisibleData, this.debounceMs)
            : this.getVisibleData;

        this.$watch('query', getVisibleData, {
            deep: true,
            immediate: !this.loaded,
        });

        this.$watch('pageSize', getVisibleData);
        this.$watch('pageNumber', getVisibleData);

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
                pageSize: this.pageSize,
                pageNumber: this.pageNumber,
                totalCount: this.totalCount || 0,
            });
        },
    },

    methods: {
        getVisibleData({ forceUpdate = false } = {}) {
            if (this.queryString && this.loaded) {
                this.updateQueryString();
            }

            const result = this.source({
                query: this.query,
                queryString: toQueryString(this.query),
                forcedUpdate: forceUpdate,
            });

            if (typeof result.then == 'function') {
                this.activeRequestCount++;

                result.then(
                    response => {
                        this.visibleData = response.data;
                        this.visibleCount = response.data.length;
                        this.totalCount =
                            response.total || response.data.length;

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
                throw new Error(
                    'Fetcher must return a promise or an object with a `data` key'
                );
            }
        },

        hydrateWithInitialData() {
            this.visibleData = this.initialData.data;
            this.visibleCount = this.initialData.data.length;
            this.totalCount =
                this.initialData.total || this.initialData.data.length;
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
                this.queryStringDefaults
            );

            window.history.replaceState(
                null,
                null,
                queryString
                    ? `${window.location.pathname}?${queryString}`
                    : window.location.pathname
            );
        },

        loadIfNotLoaded() {
            if (!this.loaded) {
                this.loaded = true;
                this.initialLoadDelayMsFinished = true;
            }
        },

        forceUpdate() {
            this.getVisibleData({ forceUpdate: true });
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
