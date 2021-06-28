import m from 'mithril';
import Icon from './Icon';

export default class ShipmentServicesInput {
    constructor(vnode) {
        this.services = vnode.attrs.bind;
        this.services_all = [
            {name: 'transportation', icon: 'truck'},
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

    color(service) {
        if (this.services.includes(service)) {
            return 'bg-yellow-100 hover:bg-yellow-50 text-yellow-700 hover:text-yellow-600'
        } else {
            return 'bg-gray-100 hover:bg-yellow-100 text-gray-600 hover:text-yellow-700'
        }
    }
    
    view(vnode) {
        return (
            <div class="flex justify-evenly">
                {this.services_all.map(s => (
                    <button class={'flex items-center px-4 py-1 rounded transition-colors ' + this.color(s.name)}
                        onclick={() => this.toggle(s.name)}>
                        <Icon name={s.icon} class="w-4" />
                        <span class="ml-4">
                            {s.name.toUpperCase()}
                        </span>
                    </button>
                ))}
            </div>
        );
    }
}