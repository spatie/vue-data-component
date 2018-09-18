import DataComponent from './DataComponent';

export default {
    props: {
        url: { default: '' },
        filter: { default: () => ({}) },
        sort: { default: null },
        page: { default: 1 },
        pageSize: { default: null },
        pageCountKey: { default: 'last_page' },
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

    computed: {
        dataComponentProps() {
            return {
                ...this.$attrs,
                fetcher: this.getData,
                queryString: true,
                pageCountKey: this.pageCountKey,
            };
        },
    },

    methods: {
        getData({ queryString }) {
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
                query: this.query,
            },
            on: {
                'update:query': query => {
                    this.query = query;
                },
            },
            scopedSlots: {
                default: props => this.$scopedSlots.default({ query: this.query, ...props }),
            },
        });
    },
};
