import { deepClone, omit } from '../util';
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
        innerItems: deepClone(vm.items),
        state: {
            filter: vm.filter,
            sortBy: vm.sortBy,
            sortOrder: vm.sortOrder,
        },
    }),

    render(createElement) {
        return createElement(ControlledDataComponent, {
            props: {
                ...omit(this.$props, ['filter', 'sortBy', 'sortOrder']),
                state: this.state,
            },
            on: {
                update: state => {
                    this.state = state;
                },
                remove: item => {
                    const index = this.innerItems.indexOf(item);

                    if (index > -1) {
                        this.innerItems.splice(index, 1);
                    }
                },
            },
            scopedSlots: {
                default: props => this.$scopedSlots.default({
                    ...props,
                    items: this.innerItems,
                    state: this.state,
                }),
            },
        });
    },
};
