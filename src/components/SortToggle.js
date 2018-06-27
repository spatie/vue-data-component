export default {
    props: {
        for: { required: true },
        value: { required: true },
        tag: { default: 'button' },
    },

    computed: {
        isActive() {
            return this.value === this.for || this.value === `-${this.for}`;
        },

        isAscending() {
            return this.isActive && this.value.charAt(0) !== '-';
        },

        isDescending() {
            return this.isActive && this.value.charAt(0) === '-';
        },
    },

    methods: {
        toggleSort() {
            this.$emit('input', this.isAscending ? `-${this.for}` : this.for);
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
