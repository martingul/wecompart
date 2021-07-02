import m from 'mithril';
import Icon from './Icon';

export default class Breadcrumb {
    constructor(vnode) {
        this.path = m.route.get().split('/');
        if (this.path.length > 0) {
            this.path = this.path.slice(1);
        }
        console.log('path', this.path);
    }

    view(vnode) {
        if (this.path[0] === 'shipments' && this.path.length === 1) {
            return (
                <div class="mb-4 flex items-center w-full border-b border-gray-100 px-4 py-2">
                    <button class="font-bold text-black px-1"
                        onclick={() => m.route.set('/shipments')}>
                        Shipments
                    </button>
                </div>
            );
        }

        if (this.path[0] === 'shipments' && this.path.length === 2) {
            const shipment_id = this.path[1];
            return (
                <div class="mb-4 flex items-center w-full border-b border-gray-100 px-4 py-2">
                    <button class="font-bold border-b border-dotted border-gray-800 text-gray-800 hover:text-black px-1"
                        onclick={() => m.route.set('/shipments')}>
                        Shipments
                    </button>
                    <Icon name="chevron-right" class="w-5 text-gray-400 mx-1" />
                    <span class="text-gray-600">
                        {shipment_id}
                    </span>
                </div>
            );
        }
    }
}