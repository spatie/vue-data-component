export default {
    props: {
        for: { required: true },
        tag: { default: 'button' },
    },

    data: () => ({
        sortBy: null,
        sortOrder: null,
    }),

    inject: ['dataComponent'],

    created() {
        const initialState = this.dataComponent.getState();

        this.sortBy = initialState.sortBy;
        this.sortOrder = initialState.sortOrder;

        this.dataComponent.onStateChange(state => {
            this.sortBy = state.sortBy;
            this.sortOrder = state.sortOrder;
        });
    },

    computed: {
        isActive() {
            return this.sortBy === this.for;
        },

        isAscending() {
            return this.isActive && this.sortOrder === 'asc';
        },

        isDescending() {
            return this.isActive && this.sortOrder === 'desc';
        },
    },

    methods: {
        toggleSort() {
            if (this.isActive) {
                this.dataComponent.setState({
                    sortOrder: this.isAscending ? 'desc' : 'asc',
                });

                return;
            }

            this.dataComponent.setState({
                sortBy: this.for,
                sortOrder: 'asc',
            });
        },
    },

    render(h) {
        const contents = this.$scopedSlots.default
            ? this.$scopedSlots.default({
                  isActive: this.isActive,
                  isAscending: this.isAscending,
                  isDescending: this.isDescending,
              })
            : this.$slots.default;

        return h(
            this.tag,
            {
                on: {
                    click: this.toggleSort,
                },
            },
            contents
        );
    },
};
