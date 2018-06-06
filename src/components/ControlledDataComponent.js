import { defaultSortFunction, defaultFilterFunction, debounce, flow } from '../util';

export const dataComponentProvider = Symbol();

export default {
    name: 'ControlledDataComponent',

    props: {
        items: { required: true, type: [Array, Function] },
        debounceMs: { default: 0 },

        state: {
            required: true,
            validator: state => {
                if (!['filter', 'sortBy', 'sortOrder'].every(property => state.hasOwnProperty(property))) {
                    return false;
                }

                return ['asc', 'desc'].includes(state.sortOrder);
            },
        },

        filterFunction: { default: defaultFilterFunction, type: Function },
        sortFunction: { default: defaultSortFunction, type: Function },

        tag: { default: 'div' },
    },

    model: {
        prop: 'state',
        event: 'update',
    },

    provide() {
        return {
            [dataComponentProvider]: {
                setState: this.setState,
                getState: () => this.state,
                onStateChange: (callback) => this.$on('update', callback),
            },
        }
    },

    data() {
        return {
            visibleItems: [],
            visibleItemsCount: 0,
            totalItemsCount: 0,
        };
    },

    created() {
        const getVisibleItems = typeof this.items === 'function'
            ? this.getVisibleItemsFromDataSource
            : this.getVisibleItemsFromLocalData;

        getVisibleItems();

        this.$watch('state', debounce(getVisibleItems, this.debounceMs), { deep: true });
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

        toggleSort(sortBy) {
            if (this.state.sortBy === sortBy) {
                this.setState({
                    sortOrder: this.state.sortOrder === 'asc' ? 'desc' : 'asc',
                });

                return;
            }

            this.setState({
                sortBy,
                sortOrder: 'asc',
            });
        },

        setFilter(filter) {
            this.setState({ filter });
        },

        setState(partialState) {
            this.$emit('update', { ...this.state, ...partialState });
        },
    },

    render(createElement) {
        return createElement(this.tag, {}, this.$scopedSlots.default({
            filter: this.state.filter,
            setFilter: this.setFilter,

            sortBy: this.state.sortBy,
            sortOrder: this.state.sortOrder,
            toggleSort: this.toggleSort,

            items: this.visibleItems,
            visibleItemsCount: this.visibleItemsCount,
            totalItemsCount: this.totalItemsCount,
        }));
    },
};
