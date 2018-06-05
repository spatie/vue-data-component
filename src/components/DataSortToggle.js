import { stateProvider } from './DataComponent';

export default {
    props: {
        for: { required: true },
        tag: { default: 'button' },
    },

    inject: {
        state: stateProvider,
    },

    computed: {
        isActive() {
            return this.state.sortBy === this.for;
        },

        isAscending() {
            return this.isActive && this.state.sortOrder === 'asc';
        },

        isDescending() {
            return this.isActive && this.state.sortOrder === 'desc';
        },
    },

    methods: {
        toggleSort() {
            if (this.isActive) {
                this.state.sortOrder = this.state.sortOrder === 'asc'
                    ? 'desc'
                    : 'asc';

                return;
            }

            this.state.sortBy = this.for;
            this.state.sortOrder = 'asc';
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

        return h(this.tag, {
            on: {
                click: this.toggleSort,
            },
        }, contents);
    },
}
