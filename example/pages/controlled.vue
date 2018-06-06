<template>
    <ControlledDataComponent
        :items="items"
        :filter-function="filterFunction"
        v-model="dataComponentState"
    >
        <template slot-scope="{ items }">
            <div>
                <label>
                    <input type="radio" :value="null" v-model="dataComponentState.filter.instrument">
                    All
                </label>
                <label>
                    <input type="radio" value="Bass" v-model="dataComponentState.filter.instrument">
                    Bass
                </label>
                <label>
                    <input type="radio" value="Drums" v-model="dataComponentState.filter.instrument">
                    Drums
                </label>
                <label>
                    <input type="radio" value="Guitar" v-model="dataComponentState.filter.instrument">
                    Guitar
                </label>
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
                        <tr v-for="item in items" :key="item.firstName">
                            <td>{{ item.firstName }}</td>
                            <td>{{ item.lastName }}</td>
                            <td>{{ item.instrument }}</td>
                            <td>{{ item.songs }}</td>
                        </tr>
                    </tbody>
                </table>
                <button @click="dataComponentState.sortBy = 'firstName'">Sort by name</button>
                <button @click="dataComponentState.sortBy = 'instrument'">Sort by instrument</button>
            </div>
        </template>
    </ControlledDataComponent>
</template>

<script>
import { ControlledDataComponent, DataSortToggle } from '../../src';

export default {
    components: {
        ControlledDataComponent,
        DataSortToggle,
    },

    data: () => ({
        dataComponentState: {
            filter: { instrument: null },
            sortBy: null,
            sortOrder: 'asc',
        },

        columns: {
            firstName: 'First name',
            lastName: 'Last name',
            instrument: 'Instrument',
            songs: 'Songs',
        },

        items: [
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

    methods: {
        updateSortBy(sortBy) {
            console.log('Setting parent sortBy', sortBy);
            this.sortBy = sortBy;
        },

        filterFunction(members, filter) {
            return filter.instrument
                ? members.filter(member => member.instrument === filter.instrument)
                : members
        },
    },
};
</script>
