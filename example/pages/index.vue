<template>
    <DataComponent
        :fetcher="fetcher"
        :filter="filter"
        :sort.sync="sort"
        :initial-load-delay-ms="1000"
        data-key="members"
    >
        <template slot-scope="{ members }">
            <div>
                <input type="text" v-model="filter">
                <table>
                    <thead>
                        <tr>
                            <th v-for="(label, property) in columns" :key="property">
                                <SortToggle :for="property">
                                    <template slot-scope="{ sortedByAscending, sortedByDescending }">
                                        {{ label }}
                                        <span v-if="sortedByAscending">⬆️</span>
                                        <span v-if="sortedByDescending">⬇️️</span>
                                    </template>
                                </SortToggle>
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
            </div>
        </template>
    </DataComponent>
</template>

<script>
import DataComponent, { SortToggle, createFetcher } from '../../src';

export default {
    components: {
        DataComponent,
        SortToggle,
    },

    data: () => ({
        filter: '',
        sort: 'firstName',

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
    }),

    computed: {
        fetcher() {
            return createFetcher(this.members, {
                filterBy: ['firstName', 'lastName', 'instrument'],
            });
        },
    },
};
</script>
