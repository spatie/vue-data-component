import { createPaginator } from '../pagination';

export default {
    name: 'DataPaginator',

    props: {
        page: { required: true, type: Number },
        pageCount: { required: true, type: Number },
        linksOnEachSide: { default: 3, type: Number },
        pageSize: {default: 20, type: Number },
    },

    computed: {
        paginator() {
            return createPaginator({
                page: this.page,
                pageSize: this.pageSize,
                pageCount: this.pageCount,
                totalCount: this.totalCount || 0,
            });
        },
    },

    mounted() {
        /* console.log(this.pagination(this.page, this.)) */
    },

    methods: {
        pagination (currentPage, pageCount) {
            const delta = 2

            let range = []
            for (let i = Math.max(2, currentPage - delta); i <= Math.min(pageCount - 1, currentPage + delta); i++) {
                range.push(i)
            }

            if (currentPage - delta > 2) {
                range.unshift("...")
            }
            if (currentPage + delta < pageCount - 1) {
                range.push("...")
            }

            range.unshift(1)
            range.push(pageCount)

            return range
        },
    },

    render() {
        return this.$scopedSlots.default({
            pages: this.paginator,
        });
    },
};
