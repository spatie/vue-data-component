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
        const initialState = this.dataComponent.state;

        this.sortBy = initialState.sortBy;
        this.sortOrder = initialState.sortOrder;

        this.dataComponent.$on('fetch', () => {
            this.sortBy = this.dataComponent.state.sortBy;
            this.sortOrder = this.dataComponent.state.sortOrder;
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
                    click: () => this.dataComponent.toggleSort(this.for),
                },
            },
            contents
        );
    },
};
