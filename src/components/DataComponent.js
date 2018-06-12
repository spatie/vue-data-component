import { debounce } from '../helpers/util';
import createItemGetterFromArray from '../helpers/createItemGetterFromArray';

export default {
    name: 'DataComponent',

    props: {
        data: { required: true, type: [Array, Function] },
        debounceMs: { default: 0 },
        initialState: { default: () => ({}), type: Object },
        tag: { default: 'div' },
    },

    data: vm => ({
        dataGetter: null,

        visibleData: [],
        visibleDataCount: 0,
        totalDataCount: 0,

        state: {
            filter: vm.initialState.filter || '',
            sortBy: vm.initialState.sortBy || null,
            sortOrder: vm.initialState.sortOrder || 'asc',
        },
    }),

    provide() {
        return {
            dataComponent: {
                setState: this.setState,
                getState: () => this.state,
                onStateChange: callback => this.$on('statechange', callback),
            },
        };
    },

    created() {
        this.dataGetter = typeof this.data === 'function'
            ? this.data
            : createItemGetterFromArray(this.data);

        const getVisibleData = this.debounceMs
            ? debounce(this.getVisibleData, this.debounceMs)
            : this.getVisibleData;

        this.$watch('state', getVisibleData, { deep: true, immediate: true });
    },

    methods: {
        getVisibleData() {
            const result = this.dataGetter(this.state);

            if (result.hasOwnProperty('data')) {
                this.visibleData = result.data;
                this.visibleItemCount = result.data.length;
                this.totalItemCount = result.data.length;
            } else if (typeof result.then == 'function') {
                result.then(response => {
                    this.visibleData = response.data;
                    this.visibleItemCount = response.data.length;
                    this.totalItemCount = response.data.length;
                });
            } else {
                throw new Error('Data function must return an object or a promise');
            }
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
            this.state = {
                ...this.state,
                ...partialState,
            };

            this.$emit('statechange', this.state);
        },
    },

    render(createElement) {
        return createElement(
            this.tag,
            {},
            this.$scopedSlots.default({
                state: this.state,
                setFilter: this.setFilter,
                toggleSort: this.toggleSort,

                data: this.visibleData,
                visibleDataCount: this.visibleDataCount,
                totalDataCount: this.totalDataCount,
            })
        );
    },
};
