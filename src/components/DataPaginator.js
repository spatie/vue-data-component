export default {
    name: 'DataPaginator',

    model: {
        prop: 'page',
        event: 'pagechange',
    },

    props: {
        page: { required: true },
        lastPage: { required: true, type: Number },
        linksOnEachSide: { default: 2, type: Number },
        navigateButtons: { default: true, type: Boolean },
    },

    computed: {
        pageObjects() {
            if (this.lastPage <= 1) {
                return [];
            }

            // https://gist.github.com/kottenator/9d936eb3e4e3c3e02598#gistcomment-1748957
            let range = [];

            for (
                let i = Math.max(2, this.page - this.linksOnEachSide);
                i <= Math.min(this.lastPage - 1, this.page + this.linksOnEachSide);
                i++
            ) {
                range.push(i);
            }

            if (this.page - this.linksOnEachSide > 2) {
                range.unshift('…');
            }

            if (this.page + this.linksOnEachSide < this.lastPage - 1) {
                range.push('…');
            }

            range.unshift(1);
            range.push(this.lastPage);

            return range.map(number => {
                if (typeof number === 'string') {
                    return { number, isDisabled: true };
                }
                return { number, isActive: number === this.page };
            });
        },
    },

    methods: {
        pageChange(page) {
            this.$emit('pagechange', page);
        },
    },

    render() {
        if (this.$scopedSlots.default) {
            return this.$scopedSlots.default({
                pages: this.pageObjects,
                next: () => this.pageChange(this.page + 1),
                hasNext: this.page < this.lastPage,
                previous: () => this.pageChange(this.page - 1),
                hasPrevious: this.page > 1,
            });
        }

        if (this.lastPage === 1) {
            return null;
        }

        return (
            <nav aria-label="Pagination Navigation">
                <ul class="mt-4 flex justify-center">
                    <li>
                        <button
                            onClick={() =>
                                this.pageChange(this.page === 1 ? this.page : this.page - 1)
                            }
                            aria-label="Previous page"
                            disabled={this.page === 1 ? true : false}
                        >
                            &lt;
                        </button>
                    </li>
                    {this.pageObjects.map(page => (
                        <li key={page.number} class={page.isActive ? 'active' : ''}>
                            {page.isDisabled ? (
                                page.number
                            ) : (
                                <button
                                    onClick={() => this.pageChange(page.number)}
                                    aria-label={
                                        this.page === page.number
                                            ? `Current page, Page ${page.number}`
                                            : `Goto page ${page.number}`
                                    }
                                    aria-current={this.page === page.number}
                                    disabled={page.isDisabled}
                                >
                                    {page.number}
                                </button>
                            )}
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() =>
                                this.pageChange(
                                    this.page === this.lastPage ? this.page : this.page + 1
                                )
                            }
                            aria-label="Next page"
                            disabled={this.page === this.lastPage ? true : false}
                        >
                            &gt;
                        </button>
                    </li>
                </ul>
            </nav>
        );
    },
};
