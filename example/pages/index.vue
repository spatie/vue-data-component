<template>
    <DataComponent
        :data="getData"
        :initial-data="initialData"
        :initial-load-delay-ms="1000"
    >
        <template slot-scope="{ state, data }">
            <div>
                <!-- <label>
                    <input type="radio" :value="null" v-model="state.filter.instrument">
                    All
                </label>
                <label>
                    <input type="radio" value="Bass" v-model="state.filter.instrument">
                    Bass
                </label>
                <label>
                    <input type="radio" value="Drums" v-model="state.filter.instrument">
                    Drums
                </label>
                <label>
                    <input type="radio" value="Guitar" v-model="state.filter.instrument">
                    Guitar
                </label> -->
                <input type="text" v-model="state.filter">
                <table>
                    <thead>
                        <tr>
                            <th v-for="(label, property) in columns" :key="property">
                                <DataSortToggle :for="property">
                                    <template slot-scope="{ isAscending, isDescending }">
                                        {{ label }}
                                        <span v-if="isAscending">⬆️</span>
                                        <span v-if="isDescending">⬇️️</span>
                                    </template>
                                </DataSortToggle>
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
            </div>
        </template>
    </DataComponent>
</template>

<script>
import { DataComponent, DataSortToggle } from '../../src';

export default {
    components: {
        DataComponent,
        DataSortToggle,
    },

    data: () => ({
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
        initialData() {
            return [this.members[0]];
        },
    },

    methods: {
        getData({ filter }) {
            const members = filter.instrument
                ? this.members.filter(member => member.instrument === filter.instrument)
                : this.members;

            return new Promise(resolve => {
                window.setTimeout(() => resolve({ data: members }), 2000);
            });
        },
    },
};
</script>
