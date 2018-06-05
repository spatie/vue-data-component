import { defaultSortFunction, defaultFilterFunction, debounce, flow } from '../util';

export const stateProvider = Symbol();

export default {
    name: 'TableComponent',

    props: {
        items: { required: true, type: [Array, Function] },
        debounceMs: { default: 0 },

        filter: { default: '' },
        filterFunction: { default: defaultFilterFunction, type: Function },

        sortBy: { default: null },
        sortOrder: {
            default: 'asc',
            validator: sortOrder => ['asc', 'desc'].indexOf(sortOrder) !== -1,
        },
        sortFunction: { default: defaultSortFunction, type: Function },

        tag: { default: 'div' },
    },

    provide() {
        return {
            [stateProvider]: this.state,
        }
    },

    data() {
        return {
            visibleItems: [],
            visibleItemsCount: 0,
            totalItemsCount: 0,

            state: {
                filter: this.filter,
                sortBy: this.sortBy,
                sortOrder: this.sortOrder,
            },
        };
    },

    created() {
        const getVisibleItems = typeof this.items === 'function'
            ? this.getVisibleItemsFromDataSource
            : this.getVisibleItemsFromLocalData;

        getVisibleItems();

        this.$watch('state', debounce(getVisibleItems, this.debounceMs), { deep: true });

        this.$watch('state.filter', filter => {
            if (!this.isControlledUpdate) {
                this.$emit('update-filter', filter);
            }
        });

        this.$watch('state.sortBy', sortBy => {
            if (!this.isControlledUpdate) {
                this.$emit('update-sort-by', sortBy);
            }
        });

        this.$watch('state.sortOrder', sortOrder => {
            if (!this.isControlledUpdate) {
                this.$emit('update-sort-order', sortOrder);
            }
        });

        ['filter', 'sortBy', 'sortOrder'].forEach(prop => {
            this.$watch(prop, value => {
                this.isControlledUpdate = true;
                this.state[prop] = value;
                this.isControlledUpdate = false;
            });
        });
    },

    methods: {
        getVisibleItemsFromDataSource() {
            this.items(this.state).then(response => {
                this.visibleItems = response.data;
                this.visibleItemCount = response.data.length;
                this.totalItemCount = response.data.length;
            });
        },

        getVisibleItemsFromLocalData() {
            const visibleItems = flow([
                items => this.filterFunction(items, this.state.filter),
                items => this.sortFunction(items, { sortBy: this.state.sortBy, sortOrder: this.state.sortOrder }),
            ])([...this.items]);

            this.visibleItems = visibleItems;
            this.visibleItemCount = visibleItems.length;
            this.totalItemCount = this.items.length;
        },

        toggleSort(property) {
            if (this.state.sortBy === property) {
                this.state.sortOrder = this.state.sortOrder === 'asc'
                    ? 'desc'
                    : 'asc';

                return;
            }

            this.state.sortBy = property;
            this.state.sortOrder = 'asc';
        },
    },

    render(createElement) {
        return createElement(this.tag, {}, this.$scopedSlots.default({
            state: this.state,
            items: this.visibleItems,
            visibleItemsCount: this.visibleItemsCount,
            totalItemsCount: this.totalItemsCount,
            toggleSort: this.toggleSort,
        }));
    },
};
