import { debounce } from '../helpers/util';
import createPagesArray from '../helpers/createPagesArray';
import createItemGetterFromArray from '../helpers/createItemGetterFromArray';

export default {
    name: 'DataComponent',

    props: {
        data: { required: true, type: [Array, Function] },
        initialData: { type: Array },
        debounceMs: { default: 0 },
        initialLoadDelayMs: { default: 0 },
        initialState: { default: () => ({}), type: Object },
        tag: { default: 'div' },
    },

    data: vm => ({
        dataGetter: null,
        loaded: false,

        visibleData: [],
        visibleCount: 0,
        totalCount: 0,

        state: {
            filter: vm.initialState.filter || '',
            sortBy: vm.initialState.sortBy || '',
            sortOrder: vm.initialState.sortOrder || 'asc',
            page: vm.initialState.page || 1,
            perPage: vm.initialState.perPage || Infinity,
        },
    }),

    provide() {
        return {
            dataComponent: this,
        };
    },

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

        ['filter', 'sortBy', 'sortOrder', 'perPage'].forEach(stateProp => {
            this.$watch(`state.${stateProp}`, () => { this.state.page = 1; }, { deep: true });
        });

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

    methods: {
        forceUpdate() {
            this.getVisibleData();
        },

        getVisibleData() {
            this.$emit('fetch');

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

        toggleSort(sortBy) {
            if (this.state.sortBy === sortBy) {
                this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';

                return;
            }

            this.state.sortBy = sortBy;
            this.state.sortOrder = 'asc';
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
                state: this.state,
                toggleSort: this.toggleSort,

                data: this.visibleData,
                visibleCount: this.visibleCount,
                totalCount: this.totalCount,

                pages: createPagesArray({
                    page: this.state.page,
                    perPage: this.state.perPage,
                    totalCount: this.totalCount,
                }),
            })
        );
    },
};
