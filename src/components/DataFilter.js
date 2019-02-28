export default {
    name: 'DataFilter',

    props: {
        value: { required: true },
        facetValue: {},
        multiple: { default: false, type: Boolean },
    },

    computed: {
        active() {
            if (this.multiple) {
                if (!Array.isArray(this.value)) {
                    return () => false;
                }

                return value => this.value.some(v => v == value);
            }

            if (this.facetValue) {
                return this.value == this.facetValue;
            }

            return !!this.value;
        },
    },

    methods: {
        toggle(value) {
            if (this.multiple) {
                const newValue = this.value.some(v => v == value)
                    ? this.value.filter(v => v != value)
                    : this.value.concat(value);

                this.$emit('input', newValue);

                return;
            }

            if (!this.facetValue) {
                this.$emit('input', this.value ? null : true);

                return;
            }

            this.$emit('input', this.value == this.facetValue ? null : this.facetValue);
        },

        set(value) {
            this.$emit('input', value);
        },
    },

    render(h) {
        return this.$scopedSlots.default({
            active: this.active,
            toggle: this.toggle,
            set: this.set,
        });
    },
};
