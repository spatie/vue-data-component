<template>
    <no-ssr>
        <data-component
            :resource="resource"
            :filter.sync="state.filter"
            :sort.sync="state.sort"
            :initial-load-delay-ms="1000"
            :query-string="true"
            :query-string-sanitizer="sanitizeQueryString"
            data-key="members"
        >
            <template slot-scope="{ members }">
                <input type="text" v-model="state.filter.search">
                <table>
                    <thead>
                        <tr>
                            <th v-for="(label, property) in columns" :key="property">
                                <data-sort-toggle :for="property">
                                    <template slot-scope="{ toggle, sortedByAscending, sortedByDescending }">
                                        {{ label }}
                                        <span v-if="sortedByAscending">⬆️</span>
                                        <span v-if="sortedByDescending">⬇️️</span>
                                    </template>
                                </data-sort-toggle>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="member in members" :key="member.firstName">
                            <td>{{ member.firstName }}</td>
                            <td>{{ member.lastName }}</td>
                            <td>{{ member.instrument }}</td>
                            <td>{{ member.songs }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </data-component>
    </no-ssr>
</template>

<script>
import DataComponent, { DataSortToggle, createSource, withQuery, sanitizeQueryString } from '../../packages';

export default {
    components: {
        DataComponent,
        DataSortToggle,
    },

    data() {
        return {
            state: withQuery({
                filter: {
                    search: '',
                },

                sort: 'firstName',
            }),

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
            ],
        };
    },

    computed: {
        resource() {
            return createSource(this.members, {
                filterBy: ['firstName', 'lastName', 'instrument'],
            });
        },
    },

    methods: {
        sanitizeQueryString(state) {
            state = sanitizeQueryString(state);

            if (state.sort === 'firstName') {
                delete state.sort;
            }

            return state;
        },
    },
};
</script>
