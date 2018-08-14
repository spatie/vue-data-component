<template>
    <div>
        <Intro>
            <p>Here we use the <a href="https://rickandmortyapi.com/" target="_blank">Rick and Morty API</a> to render a list of Ricks.
            The free public API is a perfect case for a paginated, filterable, ajax-driven data component.</p>
        </Intro>
        <DataComponent
            :fetcher="getRicks"
            :initial-load-delay-ms="1000"
            :filter="filter"
            :page="page"
            :per-page="20"
        >
            <template slot-scope="{ data, visibleCount, totalCount, pages, isSlowRequest }">
                <div class="flex justify-between mb-12 py-4 border-t border-b border-grey">
                    <p class="text-grey-dark italic">
                        Displaying {{ visibleCount }} of {{ totalCount }} Ricks.
                        <span v-if="isSlowRequest">Loading...</span>
                    </p>
                    <p>
                        <button
                            v-for="(status, value) in statusses"
                            :key="value"
                            class="uppercase tracking-wide ml-4"
                            :class="filter.status == value ? 'border-b border-black' : 'text-grey-dark'"
                            @click="filterStatus(value)"
                        >
                            {{ status }}
                        </button>
                    </p>
                </div>

                <div
                    class="flex flex-wrap justify-between transition"
                    :class="isSlowRequest ? 'opacity-50' : null"
                >
                    <article
                        v-for="rick in data"
                        :key="rick.id"
                        class="w-32 flex flex-col items-center text-center mb-12 relative text-grey-darkest"
                    >
                        <img
                            :src="rick.image"
                            :alt="`Image of ${rick.name}`"
                            class="rounded-full mb-4 w-16 h-16 bg-grey-light fit-cover"
                        >
                        {{ rick.name }}
                        <span
                            class="absolute pin-t pin-r bg-white rounded-full w-8 h-8 flex items-center justify-center"
                            :style="{ transform: 'translate(-3rem, 3.25rem)' }"
                        >
                            <span :style="{ transform: 'translateX(0.15em)' }">
                                {{ rick.status | emoji }}
                            </span>
                        </span>
                    </article>
                </div>

                <ul class="mt-4 flex justify-center">
                    <li v-for="p in pages" :key="p.number">
                        <button
                            class="mx-4"
                            :class="p.isActive ? 'border-b border-black' : 'text-grey-dark'"
                            @click="page = p.number"
                        >
                            {{ p.number }}
                        </button>
                    </li>
                </ul>
            </template>
        </DataComponent>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    title: 'Ajax card layout',

    data: () => ({
        page: 1,
        filter: { status: 'all' },

        statusses: {
            all: 'All',
            Alive: 'Alive',
            Dead: 'Dead',
            unknown: 'Unknown',
        },
    }),

    filters: {
        emoji(status) {
            if (status === 'Dead') {
                return '☠️';
            }

            if (status === 'unknown') {
                return '️❓';
            }

            return '🆗';
        },
    },

    methods: {
        getRicks({ filter, page }) {
            const baseUrl = `https://rickandmortyapi.com/api/character?page=${page}&name=Rick`;
            const requestUrl =
                filter.status !== 'all' ? `${baseUrl}&status=${filter.status}` : baseUrl;

            return axios.get(requestUrl).then(response => {
                return {
                    data: response.data.results,
                    totalCount: response.data.info.count,
                };
            });
        },

        filterStatus(status) {
            if (this.filter.status === status) {
                return;
            }

            this.page = 1;
            this.filter.status = status;
        },
    },
};
</script>

<style>
.grid {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: 4rem;
}
</style>
