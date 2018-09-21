import { range } from '../util';

export default {
    name: 'DataPaginator',

    props: {
        page: { required: true },
        pageCount: { required: true, type: Number },
        linksOnEachSide: { default: 3, type: Number },
    },

    computed: {
        paginator() {
            console.log(this.pagination(this.page, this.pageCount));




            return range(this.pageCount).map(number => {
                return { number, active: number === this.page };
            });
        },
    },

    methods: {
        pagination () {

            let range = []
            for (let i = Math.max(2, this.page - this.linksOnEachSide); i <= Math.min(this.pageCount - 1, this.page + this.linksOnEachSide); i++) {
                range.push(i)
            }

            if (this.page - this.linksOnEachSide > 2) {
                range.unshift("...")
            }
            if (this.page + this.linksOnEachSide < this.pageCount - 1) {
                range.push("...")
            }

            range.unshift(1)
            range.push(this.pageCount)

            return range
        },
    },

    render() {
        return this.$scopedSlots.default({
            pages: this.paginator,
        });
    },
};
