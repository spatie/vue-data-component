export default {
    facetValue: 'DataFilterFacet',

    props: {
        value: { required: true },
        facetValue: {},
        multiple: { default: false, type: Boolean },
    },

    computed: {
        active() {
            if (this.multiple) {
                return value => this.value.indexOf(value) !== -1;
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
                const valueIndex = this.value.indexOf(value);

                const newValue =
                    valueIndex === -1
                        ? this.value.concat(value)
                        : this.value.filter(v => v != value);

                this.$emit('input', newValue);

                return;
            }

            if (!this.facetValue) {
                this.$emit('input', !this.value);

                return;
            }

            this.$emit('input', this.value == this.facetValue ? null : this.facetValue);
        },
    },

    render(h) {
        return this.$scopedSlots.default({
            active: this.active,
            toggle: this.toggle,
        });
    },
};
