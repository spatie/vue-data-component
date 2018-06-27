import { debounce } from '../helpers/util';
import createPagesArray from '../helpers/createPagesArray';
import createItemGetterFromArray from '../helpers/createItemGetterFromArray';

export default {
    props: {
        sort: { default: null, type: String },
        filter: { default: null },
        page: { default: 1, type: Number },
        perPage: { default: Infinity, type: Number },
        data: { required: true, type: [Array, Function] },
        initialData: { default: null },
        debounceMs: { default: 0 },
        initialLoadDelayMs: { default: 0 },
        tag: { default: 'div' },
    },

    data: () => ({
        dataGetter: null,
        loaded: false,

        visibleData: [],
        visibleCount: 0,
        totalCount: 0,
    }),

    created() {
        this.dataGetter =
            typeof this.data === 'function' ? this.data : createItemGetterFromArray(this.data);

        if (this.initialData) {
            this.visibleData = this.initialData.data;
            this.visibleCount = this.initialData.data.length;
            this.totalCount = this.initialData.totalCount || this.initialData.data.length;

            this.loaded = true;
        }

        const getVisibleData = this.debounceMs
            ? debounce(this.getVisibleData, this.debounceMs)
            : this.getVisibleData;

        this.$watch('state', getVisibleData, { deep: true, immediate: true });

        if (!this.initialLoadDelayMs) {
            this.loaded = true;
        }
    },

    mounted() {
        if (this.initialLoadDelayMs) {
            window.setTimeout(() => {
                this.loaded = true;
            }, this.initialLoadDelayMs);
        }
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
        forceUpdate() {
            this.getVisibleData();
        },

        getVisibleData() {
            const result = this.dataGetter(this.state);

            if (typeof result.then == 'function') {
                result.then(response => {
                    this.visibleData = response.data;
                    this.visibleCount = response.data.length;
                    this.totalCount = response.totalCount || response.data.length;

                    this.loaded = true;
                });
            } else if (result.hasOwnProperty('data')) {
                this.visibleData = result.data;
                this.visibleCount = result.data.length;
                this.totalCount = result.data.length;

                this.loaded = true;
            } else {
                throw new Error('Data function must return an object or a promise');
            }
        },

        toggleSort(field) {
            const currentSortOrder = this.sort.charAt(0) === '-' ? 'desc' : 'asc';
            const currentSortField = currentSortOrder === 'desc' ? this.sort.slice(1) : this.sort;

            if (field === currentSortField && currentSortOrder === 'asc') {
                this.$emit('update:sort', `-${currentSortField}`);

                return;
            }

            this.$emit('update:sort', field);
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
                data: this.visibleData,
                visibleCount: this.visibleCount,
                totalCount: this.totalCount,

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
