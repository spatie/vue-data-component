<template>
    <div>
        <intro>
            <p>Similar to the previous ajax example, but with initial data passed to the data component.</p>
            <p>Since the component already knows which data to display in the first render, there's no flash when the page loads.</p>
        </intro>
        <data-component
            :source="getRicks"
            :filter="filter"
            :page="page"
            :per-page="perPage"
            :initial-data="initialData"
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
        </data-component>
    </div>
</template>

<script>
import axios from 'axios';
import ricksFirstPage from '../data/ricks-first-page';

export default {
    title: 'Prerendered card layout',

    data: () => ({
        filter: {
            status: 'all',
        },

        page: 1,
        perPage: 20,

        statusses: {
            all: 'All',
            Alive: 'Alive',
            Dead: 'Dead',
            unknown: 'Unknown',
        },

        initialData: {
            page: 1,
            totalCount: 73,
            data: ricksFirstPage,
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
