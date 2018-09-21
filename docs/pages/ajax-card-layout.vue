<template>
    <div>
        <intro>
            <p>Here we use the <a href="https://rickandmortyapi.com/" target="_blank">Rick and Morty API</a> to render a list of Ricks.
            The free public API is a perfect case for a paginated, filterable, ajax-driven data component.</p>
        </intro>
        <data-component
            :fetcher="getRicks"
            :query.sync="query"
            :initial-load-delay-ms="400"
            pageCountKey="pageCount"
        >
            <div slot-scope="{ data: ricks, visibleCount, totalCount, isLoaded, isSlowLoad, isSlowRequest, isInitialLoadDelayFinished, pageCount }">
                <div v-if="isLoaded || isSlowLoad" class="flex justify-between mb-12 py-4 border-t border-b border-grey">
                    <p v-if="isLoaded" class="text-grey-dark italic">
                        Displaying {{ visibleCount }} of {{ totalCount }} Ricks.
                        <span v-if="isSlowRequest">Loading...</span>
                    </p>
                    <p v-else class="text-grey-dark italic">
                        Still loading...
                    </p>
                    <p v-if="isLoaded">
                        <button
                            class="uppercase tracking-wide ml-4"
                            :class="!query.status ? 'border-b border-black' : 'text-grey-dark'"
                            @click="filterStatus(null)"
                        >
                            All
                        </button>
                        <button
                            v-for="(status, value) in statusses"
                            :key="value"
                            class="uppercase tracking-wide ml-4"
                            :class="query.status == value ? 'border-b border-black' : 'text-grey-dark'"
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
                        v-for="rick in ricks"
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

                <data-paginator :page="query.page" :page-count="pageCount" @change-page="query.page = $event"></data-paginator>

            </div>
        </data-component>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    title: 'Ajax card layout',

    data: () => ({
        query: {
            status: null,
            page: 1,
        },

        statusses: {
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
        getRicks({ query, queryString }) {
            const baseUrl = 'https://rickandmortyapi.com/api/character';

            return axios.get(`${baseUrl}?${queryString}`).then(response => ({
                data: response.data.results,
                totalCount: response.data.info.count,
                pageCount: response.data.info.pages,
            }));
        },

        filterStatus(status) {
            if (this.query.status === status) {
                return;
            }

            this.query.status = status;
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
