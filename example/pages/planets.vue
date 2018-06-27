<template>
    <DataComponent
        :data="getPlanets"
        :debounce-ms="200"
        :initial-load-delay-ms="1000"
        :initial-state="{ perPage: 10 }"
    >
        <template slot-scope="{ state, data, visibleCount, totalCount, pages }">
            <div>
                <input type="text" v-model="state.filter" placeholder="Filter planets...">
                <p><em>Displaying {{ visibleCount }} of {{ totalCount }} results</em></p>
                <ul>
                    <li v-for="planet in data" :key="planet.name">
                        {{ planet.name }}
                    </li>
                </ul>
                <ul>
                    <li
                        v-for="page in pages"
                        :key="page.number"
                        :style="{ textDecoration: page.isActive ? 'underline' : null }"
                        @click="state.page = page.number"
                    >
                        {{ page.number }}
                    </li>
                </ul>
            </div>
        </template>
    </DataComponent>
</template>

<script>
import axios from 'axios';
import DataComponent from '../../src';
import queryString from 'query-string';

export default {
    components: {
        DataComponent,
    },

    methods: {
        getPlanets({ filter, page }) {
            const baseUrl = `https://swapi.co/api/planets?page=${page}`;
            const requestUrl = filter ? `${baseUrl}&search=${filter}` : baseUrl;

            return axios.get(requestUrl).then(response => {
                return {
                    data: response.data.results,
                    totalCount: response.data.count,
                };
            });
        },
    },
}
</script>
