import { dataComponent } from './DataComponent';

export default {
    props: {
        for: { required: true },
        tag: { default: 'button' },
    },

    inject: {
        dataComponent,
    },

    computed: {
        sortedBy() {
            return this.value === this.for || this.value === `-${this.for}`;
        },

        sortedByAscending() {
            return this.sortedBy && this.value.charAt(0) !== '-';
        },

        sortedByDescending() {
            return this.sortedBy && this.value.charAt(0) === '-';
        },
    },

    methods: {
        toggleSort() {
            this.dataComponent.toggleSort(this.for);
        },
    },

    render(h) {
        const contents = this.$scopedSlots.default
            ? this.$scopedSlots.default({
                  sortedBy: this.sortedBy,
                  sortedByAscending: this.sortedByAscending,
                  sortedByDescending: this.sortedByDescending,
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
