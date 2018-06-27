export default {
    props: {
        for: { required: true },
        tag: { default: 'button' },
    },

    data: () => ({
        sort: null,
    }),

    inject: ['dataComponent'],

    created() {
        this.dataComponent.$on('fetch', () => {
            this.sort = this.dataComponent.state.sort;
        }, { immediate: true });
    },

    computed: {
        isActive() {
            return this.sort === this.for || this.sort === `-${this.for}`;
        },

        isAscending() {
            return this.isActive && this.sort.charAt(0) !== '-';
        },

        isDescending() {
            return this.isActive && this.sort.charAt(0) === '-';
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
