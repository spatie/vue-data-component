import { debounce } from '../helpers/util';
import createPagesArray from '../helpers/createPagesArray';

export const dataComponent = Symbol();

export default {
    name: 'DataComponent',

    props: {
        fetcher: { required: true, type: Function },
        sort: { default: null, type: String },
        filter: { default: null },
        page: { default: 1, type: Number },
        perPage: { default: Infinity, type: Number },
        initialData: { default: null },
        debounceMs: { default: 0 },
        initialLoadDelayMs: { default: 0 },
        slowRequestThresholdMs: { default: 400 },
        dataKey: { default: 'data' },
        tag: { default: 'div' },
    },

    data: () => ({
        loaded: false,
        activeRequestCount: 0,
        isSlowRequest: false,

        visibleData: [],
        visibleCount: 0,
        totalCount: 0,
    }),

    provide() {
        return {
            [dataComponent]: {
                setSort: this.setSort,
                toggleSort: this.toggleSort,
                setFilter: this.setFilter,
                setPage: this.setPage,
                setPerPage: this.setPerPage,
            },
        }
    },

    created() {
        if (this.initialData) {
            this.hydrateWithInitialData();

            this.loaded = true;
        }

        const getVisibleData = this.debounceMs
            ? debounce(this.getVisibleData, this.debounceMs)
            : this.getVisibleData;

        this.$watch('state', getVisibleData, {
            deep: true,
            immediate: !this.initialData,
        });

        if (!this.initialLoadDelayMs) {
            this.loaded = true;
        }
    },

    mounted() {
        if (!this.loaded) {
            window.setTimeout(() => {
                this.loaded = true;
            }, this.initialLoadDelayMs);
        }

        // Since `handleActiveRequestCountChange` uses the browser's `timeout` API, we can't start the watcher in
        // the `created` hook for SSR.
        this.$watch('activeRequestCount', this.handleActiveRequestCountChange);
    },

    computed: {
        state() {
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
            const result = this.fetcher({ ...this.state, forceUpdate });

            if (typeof result.then == 'function') {
                this.activeRequestCount++;

                result.then(
                    response => {
                        this.visibleData = response.data;
                        this.visibleCount = response.data.length;
                        this.totalCount = response.totalCount || response.data.length;

                        this.loaded = true;

                        this.activeRequestCount--;
                    },
                    () => {
                        this.activeRequestCount--;
                    }
                );
            } else if (result.hasOwnProperty('data')) {
                this.visibleData = result.data;
                this.visibleCount = result.data.length;
                this.totalCount = result.data.length;

                this.loaded = true;
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

        toggleSort(field) {
            const currentSortOrder = this.sort.charAt(0) === '-' ? 'desc' : 'asc';
            const currentSortField = currentSortOrder === 'desc' ? this.sort.slice(1) : this.sort;

            if (field === currentSortField && currentSortOrder === 'asc') {
                this.setSort(`-${currentSortField}`);

                return;
            }

            this.setSort(field);
        },

        setSort(sort) {
            this.$emit('update:sort', sort);
        },

        setFilter(filter) {
            this.$emit('update:filter', filter);
        },

        setPage(page) {
            this.$emit('update:page', page);
        },

        setPerPage(perPage) {
            this.$emit('update:perPage', perPage);
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
                toggleSort: this.toggleSort,
                pages: createPagesArray({
                    page: this.state.page,
                    perPage: this.state.perPage,
                    totalCount: this.totalCount,
                }),
            })
        );
    },
};
