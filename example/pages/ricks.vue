<template>
    <DataComponent
        :data="getRicks"
        :debounce-ms="200"
        :initial-load-delay-ms="1000"
        :initial-state="{
            filter: {
                status: null,
            },
            perPage: 20,
        }"
    >
        <template slot-scope="{ state, data, visibleCount, totalCount, pages }">
            <div>
                <label><input type="radio" name="status" :value="null" v-model="state.filter.status"> All</label>
                <label><input type="radio" name="status" value="Alive" v-model="state.filter.status"> Alive</label>
                <label><input type="radio" name="status" value="Dead" v-model="state.filter.status"> Dead</label>

                <p><em>Displaying {{ visibleCount }} of {{ totalCount }} Ricks</em></p>

                <div class="flex flex-wrap">
                    <article
                        v-for="rick in data"
                        :key="rick.id"
                        class="text-xs flex flex-col items-center m-4 w-32"
                    >
                        <img
                            :src="rick.image"
                            :alt="`Image of ${rick.name}`"
                            width="100"
                            class="border border-grey-darkest rounded mb-2"
                        >
                        <span class="truncate">
                            {{ rick.name }}
                        </span>
                    </article>
                </div>

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

export default {
    components: {
        DataComponent,
    },

    methods: {
        getRicks({ filter, page }) {
            const baseUrl = `https://rickandmortyapi.com/api/character?page=${page}&name=Rick`;
            const requestUrl = filter.status ? `${baseUrl}&status=${filter.status}` : baseUrl;

            return axios.get(requestUrl).then(response => {
                return {
                    data: response.data.results,
                    totalCount: response.data.info.count,
                };
            });
        },
    },
}
</script>
