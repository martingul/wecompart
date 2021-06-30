import m from 'mithril';
import Icon from './Icon';
import ShipmentListElement from './ShipmentListElement';
import ShipmentEdit from './ShipmentEdit';
import ShipmentRead from './ShipmentRead';
import ShipmentStorage from '../models/ShipmentStorage';

export default class ShipmentList {
    constructor(vnode) {
        console.log('construct ShipmentList');

        this.sortable = {
            pickup_address: {
                cmp: (l, r) => l.pickup_address.short.localeCompare(r.pickup_address_short),
                active: false,
                desc: true
            },
            delivery_address: {
                cmp: (l, r) => l.delivery_address.short.localeCompare(r.delivery_address_short),
                active: false,
                desc: true
            },
            total_value: {
                cmp: (l, r) => r.total_value.value - l.total_value.value,
                active: false,
                desc: true
            },
            date: {
                cmp: (l, r) => Date.parse(r.pickup_date.value) - Date.parse(l.pickup_date.value),
                active: false,
                desc: true
            },
            status: {
                cmp: (l, r) => l.status.localeCompare(r.status),
                active: false,
                desc: true
            }
        };

        this._sort_state = null;
        this.loading = false;

        this.new_shipment = false;
        this.selected_shipment = null;
    }

    get sort_state() {
        return this._sort_state;
    }

    set sort_state(sort_state) {
        if (this._sort_state && this._sort_state !== sort_state) {
            this._sort_state.desc = true;
            this._sort_state.active = false;
        }

        this._sort_state = sort_state;

        if (this._sort_state.active) {
            this._sort_state.desc = !this._sort_state.desc;
            ShipmentStorage.shipments.reverse();
            return;
        }

        this._sort_state.active = true;
        ShipmentStorage.shipments.sort(this._sort_state.cmp);
    }

    view(vnode) {
        if (this.new_shipment) {
            return <ShipmentEdit close={() => this.new_shipment = false} />
        }

        if (this.selected_shipment) {
            if (this.selected_shipment.status === 'draft') {
                return <ShipmentEdit shipment={this.selected_shipment}
                    close={(s) => {
                        if (s) {
                            this.selected_shipment = s;
                        } else {
                            this.selected_shipment = null;
                        }
                    }} />
            } else {
                return <ShipmentRead shipment={this.selected_shipment}
                    close={() => this.selected_shipment = null} />
            }
        }

        return (
            <div class="flex flex-col">
                <div class="mb-4 flex items-start justify-between">
                    <div class="px-4 py-1 rounded font-bold bg-yellow-100 text-black">
                        Shipments
                    </div>
                    <button class="flex items-center py-1 px-4 rounded whitespace-nowrap font-bold
                        text-white bg-green-500 hover:bg-green-600 hover:shadow transition-all"
                        onclick={() => this.new_shipment = true}>
                        <Icon name="plus" class="w-5" />
                        <span class="ml-2">
                            New
                        </span>
                    </button>
                </div>
                <div class="flex flex-col">
                    <div class="my-4">
                        <div class="flex items-center justify-between my-2 w-full px-2 whitespace-nowrap text-xs">
                            <div class="w-2/12">
                                <button class="flex items-center border-b border-dotted border-gray-600"
                                    onclick={() => this.sort_state = this.sortable.total_value}>
                                    <b class="text-xs uppercase">value</b>
                                    <div class={this.sortable.total_value.active && this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▾</span>
                                    </div>
                                    <div class={this.sortable.total_value.active && !this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▴</span>
                                    </div>
                                </button>
                            </div>
                            <div class="w-3/12">
                                <button class="flex border-b border-dotted border-gray-600"
                                    onclick={() => this.sort_state = this.sortable.pickup_address}>
                                    <b class="uppercase">pickup</b>
                                    <div class={this.sortable.pickup_address.active && this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▾</span>
                                    </div>
                                    <div class={this.sortable.pickup_address.active && !this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▴</span>
                                    </div>
                                </button>
                            </div>
                            <div class="w-3/12">
                                <button class="flex border-b border-dotted border-gray-600"
                                    onclick={() => this.sort_state = this.sortable.delivery_address}>
                                    <b class="uppercase">delivery</b>
                                    <div class={this.sortable.delivery_address.active && this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▾</span>
                                    </div>
                                    <div class={this.sortable.delivery_address.active && !this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▴</span>
                                    </div>
                                </button>
                            </div>
                            <div class="w-2/12">
                                <button class="flex border-b border-dotted border-gray-600"
                                    onclick={() => this.sort_state = this.sortable.date}>
                                    <b class="uppercase">date</b>
                                    <div class={this.sortable.date.active && this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▾</span>
                                    </div>
                                    <div class={this.sortable.date.active && !this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▴</span>
                                    </div>
                                </button>
                            </div>
                            <div class="w-2/12">
                                <button class="flex border-b border-dotted border-gray-600"
                                    onclick={() => this.sort_state = this.sortable.status}>
                                    <b class="uppercase">status</b>
                                    <div class={this.sortable.status.active && this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▾</span>
                                    </div>
                                    <div class={this.sortable.status.active && !this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">▴</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div class="my-2">
                            {ShipmentStorage.shipments.map(s =>
                                <ShipmentListElement key={s.uuid} shipment={s} 
                                    callback={(s) => this.selected_shipment = s} />
                            )}
                        </div>
                    </div>
                    <div class="my-2">
                        <span class="text-black font-bold">
                            {ShipmentStorage.shipments.length}
                        </span>
                        <span class="text-gray-600 ml-1.5">
                            {ShipmentStorage.shipments.length === 1 ? 'shipment' : 'shipments'}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}