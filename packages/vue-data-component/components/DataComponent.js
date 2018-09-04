import { debounce } from '../util';
import createPagesArray from '../helpers/createPagesArray';
import { toQueryString } from '../helpers/queryString';

export default {
    name: 'DataComponent',

    props: {
        source: { required: true, type: Function },
        sort: { default: null, type: String },
        filter: { default: () => ({}) },
        page: { default: 1, type: Number },
        perPage: { default: null, type: Number },
        initialData: { default: null, type: Object },
        debounceMs: { default: 0, type: Number },
        initialLoadDelayMs: { default: 0, type: Number },
        slowRequestThresholdMs: { default: 400, type: Number },
        dataKey: { default: 'data', type: String },
        tag: { default: 'div', type: String },
        queryString: { default: false, type: Boolean },
    },

    data: () => ({
        loaded: false,
        activeRequestCount: 0,
        isSlowRequest: false,

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

        if (!this.initialLoadDelayMs) {
            this.loadIfNotLoaded();
        }
    },

    mounted() {
        if (!this.loaded) {
            window.setTimeout(() => {
                this.loadIfNotLoaded();
            }, this.initialLoadDelayMs);
        }

        this.$watch('activeRequestCount', this.handleActiveRequestCountChange);
    },

    computed: {
        query() {
            return {
                sort: this.sort,
                filter: this.filter,
                page: this.page,
                perPage: this.perPage,
            };
        },
    },

    methods: {
        getVisibleData({ forceUpdate = false } = {}) {
            if (this.queryString && this.loaded) {
                this.updateQueryString();
            }

            const result = this.source({
                ...this.query,
                forceUpdate,
            });

            if (typeof result.then == 'function') {
                this.activeRequestCount++;

                result.then(
                    response => {
                        this.visibleData = response.data;
                        this.visibleCount = response.data.length;
                        this.totalCount = response.totalCount || response.data.length;

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
                this.totalCount = result.totalCount || result.data.length;

                this.loadIfNotLoaded();
            } else {
                throw new Error('Fetcher must return a promise or an object with a `data` key');
            }
        },

        hydrateWithInitialData() {
            this.visibleData = this.initialData.data;
            this.visibleCount = this.initialData.data.length;
            this.totalCount = this.initialData.totalCount || this.initialData.data.length;
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

        updateQueryString() {
            window.history.replaceState(
                null,
                null,
                window.location.pathname + toQueryString(this.query)
            );
        },

        loadIfNotLoaded() {
            if (!this.loaded) {
                this.loaded = true;
                this.$emit('load');
            }
        },

        forceUpdate() {
            this.getVisibleData({ forceUpdate: true });
        },
    },

    render(createElement) {
        if (!this.loaded) {
            return null;
        }

        return createElement(
            this.tag,
            {},
            this.$scopedSlots.default({
                [this.dataKey]: this.visibleData,
                visibleCount: this.visibleCount,
                totalCount: this.totalCount,
                isSlowRequest: this.isSlowRequest,
                reset: this.reset,
                pages: createPagesArray({
                    page: this.query.page,
                    perPage: this.query.perPage,
                    totalCount: this.totalCount,
                }),
            })
        );
    },
};
