import m from 'mithril';
import Icon from './Icon';

export default class SelectInput {
    constructor(vnode) {
        this.model = vnode.attrs.bind;
        this.values = vnode.attrs.values;
    }

    view(vnode) {
        return (
            <div class="inline-block relative min-w-max">
                <select class="cursor-pointer pr-10"
                    oninput={(e) => this.model.value = e.target.value}
                    value={this.model.value}>
                    {this.values.map(v => <option value={v.value}>{v.label}</option>)}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ml-4 text-gray-600">
                    <Icon name="chevron-down" class="w-4" />
                </div>
            </div>
        );
    }
}