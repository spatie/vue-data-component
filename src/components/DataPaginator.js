import { createPaginator } from '../pagination';

export default {
    name: 'DataPaginator',

    props: {
        page: { required: true, type: Number },
        pageCount: { required: true, type: Number },
    },

    computed: {
        paginator() {
            return createPaginator({
                page: this.pageNumber,
                pageSize: this.pageSize,
                pageCount: this.pageCount,
                totalCount: this.totalCount || 0,
            });
        },
    },

    methods: {

    },

    render() {
        return this.$scopedSlots.default({
            pages: this.paginator,
        });
    },
};
