<template>
    <DataComponent
        :data="getRicks"
        :debounce-ms="200"
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
                        @click="filter.status = value"
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
                    class="w-32 flex flex-col items-center text-center mb-12"
                >
                    <img
                        :src="rick.image"
                        :alt="`Image of ${rick.name}`"
                        width="50"
                        class="rounded-full mb-4"
                    >
                    <span class="text-grey-darkest mb-1">
                        {{ rick.name }}
                    </span>
                    <span class="italic text-grey-dark">
                        {{ statusses[rick.status] }}
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
</template>

<script>
import axios from 'axios';
import DataComponent from '../../src';

export default {
    title: 'Ajax card layout',

    components: {
        DataComponent,
    },

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

    methods: {
        getRicks({ filter, page }) {
            const baseUrl = `https://rickandmortyapi.com/api/character?page=${page}&name=Rick`;
            const requestUrl = filter.status !== 'all' ? `${baseUrl}&status=${filter.status}` : baseUrl;

            return axios.get(requestUrl).then(response => {
                return {
                    data: response.data.results,
                    totalCount: response.data.info.count,
                };
            });
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
