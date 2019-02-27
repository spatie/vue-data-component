import DataComponent from './WithData';
import { cloneDeep } from '../util';

export default {
    name: 'WithQuery',

    inheritAttrs: false,

    props: {
        url: { default: '' },
        filter: { default: () => ({}) },
        sort: { default: null },
    },

    data() {
        const query = {
            filter: cloneDeep(this.filter),
            sort: this.sort,
            page: {
                number: 1,
            },
        };

        return {
            query,
            initialQuery: cloneDeep(query),
        };
    },

    created() {
        this.$watch('query.filter', this.resetPage, { deep: true });
        this.$watch('query.sort', this.resetPage);
    },

    methods: {
        fetch({ queryString }) {
            const headers = new Headers({
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            });

            return fetch(`${this.url}?${queryString}`, { headers }).then(response =>
                response.json()
            );
        },

        reset() {
            this.query = cloneDeep(this.initialQuery);
        },

        resetPage() {
            if (this.query.page.number !== 1) {
                this.query.page.number = 1;
            }
        },
    },

    render(h) {
        return h(DataComponent, {
            props: {
                source: this.fetch,
                query: this.query,
                ...this.$attrs,
            },
            on: this.$listeners,
            scopedSlots: {
                default: props =>
                    this.$scopedSlots.default({
                        query: this.query,
                        reset: this.reset,
                        ...props,
                    }),
            },
        });
    },
};
