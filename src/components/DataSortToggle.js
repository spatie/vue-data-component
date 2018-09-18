export default {
    name: 'DataSortToggle',

    props: {
        tag: { default: 'button' },
        for: { required: true },
        value: { required: true },
    },

    computed: {
        isSorted() {
            return this.value === this.for || this.value === `-${this.for}`;
        },

        isSortedAsc() {
            return this.isSorted && this.value.charAt(0) !== '-';
        },

        isSortedDesc() {
            return this.isSorted && this.value.charAt(0) === '-';
        },

        ariaSort() {
            if (this.isSortedAsc) {
                return 'ascending';
            }

            if (this.isSortedDesc) {
                return 'descending';
            }

            return 'none';
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
        return h(
            this.tag,
            {
                domProps: {
                    role: 'columnheader',
                    'aria-sort': this.ariaSort,
                },
                on: {
                    click: e => {
                        e.preventDefault();
                        this.toggle();
                    },
                },
            },
            this.$slots.default ||
                this.$scopedSlots.default({
                    toggle: this.toggle,
                    isSorted: this.isSorted,
                    isSortedAsc: this.isSortedAsc,
                    isSortedDesc: this.isSortedDesc,
                })
        );
    },
};
