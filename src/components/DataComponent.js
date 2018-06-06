import { omit } from '../util';
import ControlledDataComponent from './ControlledDataComponent';

export default {
    name: 'DataComponent',

    props: {
        ...omit(ControlledDataComponent.props, ['state']),

        filter: { default: '' },
        sortBy: { default: null },
        sortOrder: {
            default: 'asc',
            validator: sortOrder => ['asc', 'desc'].includes(sortOrder),
        },
    },

    data: vm => ({
        state: {
            filter: vm.filter,
            sortBy: vm.sortBy,
            sortOrder: vm.sortOrder,
        },
    }),

    render(createElement) {
        return createElement(
            ControlledDataComponent,
            {
                props: {
                    ...omit(this.$props, ['filter', 'sortBy', 'sortOrder']),
                    state: this.state,
                },
                on: {
                    update: state => {
                        this.state = state;
                    },
                },
                scopedSlots: {
                    default: props => this.$scopedSlots.default({ ...props, state: this.state }),
                },
            }
        );
    },
}
