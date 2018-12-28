<template>
    <no-ssr>
        <data-component
            v-if="query"
            :fetcher="getMembers"
            :query.sync="query"
            :use-query-string="true"
        >
            <div slot-scope="{ data, pageCount, queryString }">
                <input type="text" v-model="query.filter.search">

                <data-filter v-model="query.filter.instruments" :multiple="true">
                    <ul slot-scope="{ toggle, active }">
                        <li v-for="instrument in instruments" :key="instrument">
                            <button @click.prevent="toggle(instrument)" :class="{ 'font-bold': active(instrument) }">
                                {{ instrument }}
                            </button>
                        </li>
                    </ul>
                </data-filter>

                <data-filter v-model="query.filter.moreThanTenSongs">
                    <button slot-scope="{ toggle, active }" @click.prevent="toggle" :class="{ 'font-bold': active }">
                        More than 10 songs
                    </button>
                </data-filter>

                <data-filter v-model="query.filter.lover" facet-value="Yoko">
                    <button slot-scope="{ toggle, active }" @click.prevent="toggle" :class="{ 'font-bold': active }">
                        Yoko
                    </button>
                </data-filter>

                <table>
                    <thead>
                        <tr>
                            <th v-for="(label, property) in columns" :key="property">
                                <data-sort-toggle :for="property" v-model="query.sort">
                                    <template slot-scope="{ isSortedAsc, isSortedDesc }">
                                        {{ label }}
                                        <span v-if="isSortedAsc">⬆️</span>
                                        <span v-if="isSortedDesc">⬇️️</span>
                                    </template>
                                </data-sort-toggle>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="member in data" :key="member.firstName">
                            <td>{{ member.firstName }}</td>
                            <td>{{ member.lastName }}</td>
                            <td>{{ member.instrument }}</td>
                            <td>{{ member.songs }}</td>
                        </tr>
                    </tbody>
                </table>

                <data-paginator :page="query.page" :page-count="pageCount">
                    <ul slot-scope="{ pages }" class="mt-4 flex justify-center">
                        <li v-for="page in pages" :key="page.number">
                            <button
                                class="mx-4"
                                :class="page.isActive ? 'border-b border-black' : 'text-grey-dark'"
                                :disabled="page.isDisabled"
                                @click="query.page = page.number"
                            >
                                {{ page.number }}
                            </button>
                        </li>
                    </ul>
                </data-paginator>

                <pre>{{ debug }}</pre>
            </div>
        </data-component>
    </no-ssr>
</template>

<script>
import createSource from '../../src/createSource';

export default {
    data() {
        return {
            query: {
                page: 1,
                pageSize: 10,
                filter: {
                    search: '',
                    instruments: [],
                    moreThanTenSongs: null,
                    lover: null,
                },
                sort: 'firstName',
            },

            columns: {
                firstName: 'First name',
                lastName: 'Last name',
                instrument: 'Instrument',
                songs: 'Songs',
            },

            members: [
                {
                    firstName: 'John',
                    lastName: 'Lennon',
                    instrument: 'Guitar',
                    birthday: '04/10/1940',
                    songs: 72,
                },
                {
                    firstName: 'Paul',
                    lastName: 'McCartney',
                    instrument: 'Bass',
                    birthday: '18/06/1942',
                    songs: 70,
                },
                {
                    firstName: 'George',
                    lastName: 'Harrison',
                    instrument: 'Guitar',
                    birthday: '25/02/1943',
                    songs: 22,
                },
                {
                    firstName: 'Ringo',
                    lastName: 'Starr',
                    instrument: 'Drums',
                    birthday: '07/07/1940',
                    songs: 2,
                },
                {
                    firstName: 'keke',
                    lastName: 'Lennon',
                    instrument: 'Guitar',
                    birthday: '04/10/1940',
                    songs: 72,
                },
                {
                    firstName: 'lol',
                    lastName: 'McCartney',
                    instrument: 'Bass',
                    birthday: '18/06/1942',
                    songs: 70,
                },
                {
                    firstName: 'zi',
                    lastName: 'Harrison',
                    instrument: 'Guitar',
                    birthday: '25/02/1943',
                    songs: 22,
                },
                {
                    firstName: 'bar',
                    lastName: 'Starr',
                    instrument: 'Drums',
                    birthday: '07/07/1940',
                    songs: 2,
                },
            ],
        };
    },

    computed: {
        getMembers() {
            return createSource(this.members);
        },

        instruments() {
            const instruments = this.members.map(member => member.instrument);

            return instruments.filter((instrument, index) => {
                return instruments.indexOf(instrument) === index;
            });
        },

        debug() {
            return JSON.stringify(this.query, null, 4);
        },
    },
};
</script>
