import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';

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
            return 'bg-yellow-100 text-yellow-700 cursor-not-allowed';
        }

        if (this.services.includes(service)) {
            return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-800'
        } else {
            return 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
        }
    }
    
    view(vnode) {
        return (
            <div class="flex justify-evenly">
                {this.services_all.map(s => (
                    <button class={'flex items-center px-4 py-1 rounded transition-colors ' + this.style(s.name)}
                        onclick={() => this.toggle(s.name)}
                        disabled={s.name === 'shipping'}>
                        <Icon name={s.icon} class="w-4" />
                        <span class="ml-4">
                            {Utils.capitalize(s.name)}
                        </span>
                    </button>
                ))}
            </div>
        );
    }
}