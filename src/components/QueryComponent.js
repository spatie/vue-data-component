import DataComponent from './DataComponent';

export default {
    name: 'QueryComponent',

    props: {
        url: { default: '' },
        filter: { default: () => ({}) },
        sort: { default: null },
        page: { default: 1 },
        pageSize: { default: null },
    },

    data() {
        return {
            query: {
                filter: this.filter,
                sort: this.sort,
                page: this.page,
                pageSize: this.pageSize,
            },
        };
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
    },

    render(h) {
        return h(DataComponent, {
            props: {
                fetcher: this.fetch,
                query: this.query,
                useQueryString: true,
                ...this.$attrs,
            },
            on: {
                'update:query': query => {
                    this.query = query;
                },
                error: response => {
                    this.$emit('error', response);
                },
            },
            scopedSlots: {
                default: props => this.$scopedSlots.default({ query: this.query, ...props }),
            },
        });
    },
};
