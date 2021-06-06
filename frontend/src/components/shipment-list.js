import m from 'mithril';
import Api from '../api';
import Icon from './icon';
import Loading from './loading';
import Shipment from './shipment';

export default class ShipmentList {
    constructor(vnode) {
        console.log('construct ShipmentList');

        this.sortable = {
            pickup_address: {
                cmp: (l, r) => l.pickup_address_short.localeCompare(r.pickup_address_short),
                active: false,
                desc: true
            },
            delivery_address: {
                cmp: (l, r) => l.delivery_address_short.localeCompare(r.delivery_address_short),
                active: false,
                desc: true
            },
            total_value: {
                cmp: (l, r) => r.total_value - l.total_value,
                active: false,
                desc: true
            },
            date: {
                cmp: (l, r) => Date.parse(r.created_at) - Date.parse(l.created_at),
                active: false,
                desc: true
            },
            status: {
                cmp: (l, r) => l.status.localeCompare(r.status),
                active: false,
                desc: true
            }
        };

        this.shipments = [];
        this._sort_state = null;
        this.loading = false;
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
            this.shipments.reverse();
            return;
        }

        this._sort_state.active = true;
        this.shipments.sort(this._sort_state.cmp);
    }

    oninit(vnode) {
        this.loading = true;
        Api.read_shipments().then(res => {
            if (res === null) this.shipments = [];
            else this.shipments = res;
        }).catch(e => {
            console.log(e);
            m.route.set('/auth/signin');
        }).finally(() => {
            this.loading = false;
        });
    }

    view(vnode) {
        if (this.shipments.length === 0 && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }

        if (this.shipments.length === 0 && !this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-2 flex flex-col items-center">
                        <div class="my-4 text-gray-200">
                            <Icon name="wind" class="w-12 h-12" />
                        </div>
                        <div class="my-1 text-gray-600">
                            No shipments yet.
                            <button class="ml-4 text-green-700 border-b border-dotted border-green-700"
                                onclick={() => m.route.set('/shipments/new')}>
                                + create
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div class="my-2 flex flex-col">
                <div class="my-2 flex justify-between">
                    <div class="px-2 rounded font-bold bg-yellow-100 text-black">
                        Shipments
                    </div>
                    <div class="whitespace-nowrap">
                        <button class="text-green-700 border-b border-dotted border-green-700"
                            onclick={() => m.route.set('/shipments/new')}>
                            + new
                        </button>
                    </div>
                </div>
                <div class={this.shipments.length ? 'flex flex-col' : 'hidden'}>
                    <div class="my-2">
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
                                    <b class="uppercase">created</b>
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
                            {this.shipments.map(o =>
                                <Shipment
                                    key={o.uuid}
                                    status={o.status}
                                    owner_uuid={o.owner_uuid}
                                    pickup_address={o.pickup_address_short}
                                    delivery_address={o.delivery_address_short}
                                    currency={o.currency}
                                    total_value={o.total_value}
                                    need_packing={o.need_packing}
                                    need_insurance={o.need_insurance}
                                    comments={o.comments}
                                    items={o.items.length}
                                    created_at={o.created_at}
                                    updated_at={o.updated_at}
                                />
                            )}
                        </div>
                    </div>
                    <div class="my-2">
                        <span class="text-black font-bold">
                            {this.shipments.length}
                        </span>
                        <span class="text-gray-600 ml-1">
                            {this.shipments.length === 1 ? 'shipment' : 'shipments'}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}