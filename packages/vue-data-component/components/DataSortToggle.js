export default {
    name: 'DataSortToggle',

    props: {
        for: { required: true },
        value: { required: true },
    },

    computed: {
        sorted() {
            return this.value === this.for || this.value === `-${this.for}`;
        },

        sortedAsc() {
            return this.sorted && this.value.charAt(0) !== '-';
        },

        sortedDesc() {
            return this.sorted && this.value.charAt(0) === '-';
        },
    },

    methods: {
        toggle() {
            if (!this.value) {
                this.$emit('input', this.for);

                return;
            }

            const currentSortOrder = this.value.charAt(0) === '-' ? 'desc' : 'asc';
            const currentSortField = currentSortOrder === 'desc' ? this.value.slice(1) : this.value;

            if (this.for === currentSortField && currentSortOrder === 'asc') {
                this.$emit('input', `-${this.for}`);

                return;
            }

            this.$emit('input', this.for);
        },
    },

    render(h) {
        return this.$scopedSlots.default({
            toggle: this.toggle,
            sorted: this.sorted,
            sortedAsc: this.sortedAsc,
            sortedDesc: this.sortedDesc,
        });
    },
};
