import { debounce } from '../helpers/util';
import createPagesArray from '../helpers/createPagesArray';
import { toQuery } from '../helpers/queryString';

export const dataComponent = Symbol();

export default {
    name: 'DataComponent',

    props: {
        fetcher: { required: true, type: Function },
        sort: { default: null, type: String },
        filter: { default: null },
        page: { default: 1, type: Number },
        perPage: { default: Infinity, type: Number },
        initialData: { default: null, type: Object },
        debounceMs: { default: 0, type: Number },
        initialLoadDelayMs: { default: 0, type: Number },
        slowRequestThresholdMs: { default: 400, type: Number },
        dataKey: { default: 'data', type: String },
        tag: { default: 'div', type: String },
        queryString: { default: false, type: Boolean },
        queryStringDefaults: { default: () => {}, type: Object },
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
                setState: this.setState,
                toggleSort: this.toggleSort,
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

        this.stateWatcher = this.$watch('state', getVisibleData, {
            deep: true,
            immediate: !this.loaded,
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
            if (this.queryString && this.loaded) {
                window.history.replaceState(null, null, toQuery(this.state, this.queryStringDefaults));
            }

            const result = this.fetcher({
                ...this.state,
                forceUpdate,
            });

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

        setState(state) {
            for (const key in state) {
                this.$emit(`update:${key}`, state[key]);
            }
        },

        toggleSort(field) {
            if (!this.sort) {
                this.setState({ sort: field });

                return;
            }

            const currentSortOrder = this.sort.charAt(0) === '-' ? 'desc' : 'asc';
            const currentSortField = currentSortOrder === 'desc' ? this.sort.slice(1) : this.sort;

            if (field === currentSortField && currentSortOrder === 'asc') {
                this.setState({ sort: `-${currentSortField}` });

                return;
            }

            this.setState({ sort: field });
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
                setState: this.setState,
                pages: createPagesArray({
                    page: this.state.page,
                    perPage: this.state.perPage,
                    totalCount: this.totalCount,
                }),
            })
        );
    },
};
