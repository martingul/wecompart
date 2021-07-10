import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';

// TODO rewrite generic 'PickerInput' component
export default class ShipmentServicesInput {
    constructor(vnode) {
        this.services = vnode.attrs.bind;
        this.services_all = [
            {name: 'shipping', icon: 'truck'},
            {name: 'packaging', icon: 'box'},
            {name: 'insurance', icon: 'shield'}
        ];
    }

    toggle(service) {
        const i = this.services.indexOf(service);
        if (i >= 0) {
            this.services.splice(i, 1);
        } else {
            this.services.push(service)
        }
    }

    style(service) {
        if (service === 'shipping') {
            return 'bg-indigo-100 text-indigo-500 cursor-not-allowed';
        }

        if (this.services.includes(service)) {
            return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-500 hover:text-indigo-600'
        } else {
            return 'bg-gray-100 hover:bg-indigo-200 text-gray-500 hover:text-indigo-600'
        }
    }
    
    view(vnode) {
        return (
            <div class="flex justify-start">
                {this.services_all.map(s => (
                    <button class={'mr-4 last:mr-0 flex items-center px-2 rounded text-sm text-center font-bold transition-colors ' + this.style(s.name)}
                        onclick={() => this.toggle(s.name)}
                        disabled={s.name === 'shipping'}>
                        <Icon name={s.icon} class="w-4 mr-1.5" />
                        <span>
                            {Utils.capitalize(s.name)}
                        </span>
                    </button>
                ))}
            </div>
        );
    }
}