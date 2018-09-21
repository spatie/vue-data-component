export default {
    name: 'DataPaginator',

    props: {
        page: { required: true },
        pageCount: { required: true, type: Number },
        linksOnEachSide: { default: 2, type: Number },
        navigateButtons: { default: true, type: Boolean},
    },

    computed: {
        paginator() {
            if (this.pageCount <= 1) {
                return [];
            }

            // https://gist.github.com/kottenator/9d936eb3e4e3c3e02598#gistcomment-1748957
            let range = []

            for (let i = Math.max(2, this.page - this.linksOnEachSide); i <= Math.min(this.pageCount - 1, this.page + this.linksOnEachSide); i++) {
                range.push(i);
            }

            if (this.page - this.linksOnEachSide > 2) {
                range.unshift("...");
            }

            if (this.page + this.linksOnEachSide < this.pageCount - 1) {
                range.push("...");
            }

            range.unshift(1);
            range.push(this.pageCount);

            return range.map(number => {
                if (typeof number === 'string') {
                    return { number, disabled: true };
                }
                return { number, active: number === this.page };
            });
        },
    },

    render() {
        if (this.$scopedSlots.default) {
            return this.$scopedSlots.default({
                pages: this.paginator,
            });
        }

        if (this.pageCount === 1) {
            return null;
        }

        return (
            <ul slot-scope="{ pages }" class="mt-4 flex justify-center">
                <li>
                    <button
                        onClick={() => this.$emit('change-page', (this.page === 1) ? this.page : this.page - 1)}
                    >
                        &lt;
                    </button>
                </li>
                { this.paginator.map(page =>
                    <li key={ page.number } class={page.active ? 'active' : ''}>
                        { page.disabled &&
                             page.number
                        }
                        { !page.disabled &&
                            <button
                                onClick={() => this.$emit('change-page', page.number)}
                                disabled={ page.disabled }
                            >
                                { page.number }
                            </button>
                        }
                    </li>
                ) }
                <button
                    onClick={() => this.$emit('change-page', (this.page === this.pageCount) ? this.page : this.page + 1)}
                >
                    &gt;
                </button>
            </ul>
        );
    },
};
