import m from 'mithril';
import Service from '../models/Service';
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
        const i = this.services.map(s => s.name).indexOf(service.name);
        if (i >= 0) {
            this.services.splice(i, 1);
        } else {
            this.services.push(new Service({name: service.name}));
        }
    }

    style(service) {
        if (service.name === 'shipping') {
            return 'bg-blue-100 text-blue-500 cursor-not-allowed';
        }

        if (this.services.map(s => s.name).includes(service.name)) {
            return 'bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-600'
        } else {
            return 'bg-gray-100 hover:bg-blue-200 text-gray-500 hover:text-blue-600'
        }
    }
    
    view(vnode) {
        return (
            <div class="flex justify-start">
                {this.services_all.map(s => (
                    <button class={'mr-4 last:mr-0 flex items-center px-2 rounded text-sm text-center font-bold transition-colors ' + this.style(s)}
                        onclick={() => this.toggle(s)}
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