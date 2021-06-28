import m from 'mithril';
import Utils from '../Utils';
import Api from '../Api';
import Icon from './Icon';
import Loading from './Loading';
import ItemsEdit from './ItemsEdit';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import ShipmentServicesInput from './ShipmentServicesInput';
import SelectInput from './SelectInput';
import Shipment from '../models/Shipment';
import Item from '../models/Item';

export default class ShipmentEdit {
    constructor(vnode) {
        this.close = vnode.attrs.close;
        this.shipment = vnode.attrs.shipment ? vnode.attrs.shipment : new Shipment({});
        this.new = vnode.attrs.shipment === undefined;
        console.log('contruct ShipmentEdit', this.shipment.uuid, this.new);

        if (this.new) {
            this.shipment.items.push(new Item({key: Utils.generate_key()}));
            this.shipment.services.push('transportation');
        }

        this.loading = false;
        this.error_shipment_not_found = false;
        this.save = false;
        this._shipment = null;
    }

    delete() {
        console.log('delete');
        Api.delete_shipment({shipment_id: this._shipment.uuid}).then(res => {
            console.log(res);
            m.route.set('/shipments');
        }).catch(e => {
            console.log(e);
        });
    }

    submit(e) {
        e.preventDefault();
        console.log('submit shipment', this.save);
        console.log(this.shipment);

        const items = this.shipment.items.map(item => item.serialize());
        console.log(items);

        const shipment = this.shipment.serialize();
        console.log(shipment);

        if (this.save) {
            if (this.new) {
                console.log('save new draft');
                shipment.items = items;
                shipment.status = 'draft';
                Api.create_shipment({shipment}).then(res => {
                    console.log(res);
                    m.route.set(`/shipments/${res.uuid}`);
                }).catch(e => {
                    console.log(e);
                });
            } else {
                console.log('edit current shipment');
                Api.update_shipment({
                    shipment_id: this._shipment.uuid,
                    patch: shipment
                }).then(res => {
                    console.log(res);
                }).catch(e => {
                    console.log(e);
                });

                items.filter(item => item.id === null).forEach(item => {
                    Api.create_shipment_item({
                        shipment_id: this._shipment.uuid,
                        item: item
                    }).then(res => {
                        console.log(res);
                    }).catch(e => {
                        console.log(e);
                    });
                });

                items.filter(item => item.id !== null).forEach(item => {
                    Api.update_shipment_item({
                        shipment_id: this._shipment.uuid,
                        item_id: item.id,
                        patch: item
                    }).then(res => {
                        console.log(res);
                    }).catch(e => {
                        console.log(e);
                    });
                });
                
                const items_before = new Set(this._shipment.items.map(item => item.uuid));
                const items_after = new Set(items.map(item => item.id));
                const items_diff = new Set([...items_before].filter(x => !items_after.has(x)));

                items_diff.forEach(item_id => {
                    Api.delete_shipment_item({
                        shipment_id: this._shipment.uuid,
                        item_id: item_id
                    }).then(res => {
                        console.log(res);
                        m.route.set(`/shipments/${this._shipment.uuid}`);
                    }).catch(e => {
                        console.log(e);
                    });
                });

                // m.route.set(`/shipments/${this._shipment.uuid}`);
            }
        } else {
            if (this.new) {
                /* TODO add progress bar and undo option, makes user feel there
                is a lot of stuff going on in the back scene
                not saying there isn't */
                console.log('create new');
                shipment.items = items;
                shipment.status = 'pending';
                Api.create_shipment({shipment}).then(res => {
                    console.log(res);
                    m.route.set(`/shipments/${res.uuid}`);
                }).catch(e => {
                    console.log(e);
                });
            } else {
                console.log('create from draft');
                Api.update_shipment({
                    shipment_id: this._shipment.uuid,
                    patch: {status: 'pending'}
                }).then(res => {
                    console.log(res);
                    m.route.set(`/shipments/${res.uuid}`);
                }).catch(e => {
                    console.log(e);
                });
            }
        }
    }

    // oninit(vnode) {
    //     if (this.id) {
    //         this.loading = true;
    //         Api.read_shipment({ shipment_id: this.id}).then(res => {
    //             console.log(res);
    //             this._shipment = res;
                
    //             this.shipment.pickup_address.value = this._shipment.pickup_address_long;
    //             this.shipment.pickup_address.place_id = this._shipment.pickup_address_id;

    //             this.shipment.delivery_address.value = this._shipment.delivery_address_long;
    //             this.shipment.delivery_address.place_id = this._shipment.delivery_address_id;

    //             this.shipment.currency.value = this._shipment.currency;
    //             this.shipment.total_value.value = this._shipment.total_value;
    //             this.shipment.need_packing.value = this._shipment.need_packing;
    //             this.shipment.need_insurance.value = this._shipment.need_insurance;
    //             this.shipment.comments.value = this._shipment.comments;

    //             this.items = this._shipment.items.map(item => {
    //                 return {key: Utils.generate_key(), _item: item}
    //             });
    //         }).catch(e => {
    //             console.log(e);
    //             this.error_shipment_not_found = true;
    //         }).finally(() => {
    //             this.loading = false;
    //         });
    //     }
    // }

    view(vnode) {
        if (!this._shipment && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }
        
        return (
            <div class="my-2 flex flex-col">
                <div class="my-2 flex justify-between">
                    <div class="px-2 rounded font-bold bg-yellow-100 text-black">
                        <div class={this.new ? 'block' : 'hidden'}>
                            New Shipment
                        </div>
                        <div class={!this.new ? 'block' : 'hidden'}>
                            Edit Shipment
                        </div>
                    </div>
                    <button class="flex items-center px-2 rounded-md transition-colors
                        text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-200"
                        onclick={() => this.close()}>
                        <Icon name="x" class="w-5" />
                    </button>
                </div>
                {/* <div class={this.new ? 'flex' : 'hidden'}>
                    <div class="w-full my-2 px-4 py-2 flex items-center rounded shadow bg-gray-100">
                        message...
                    </div>
                </div> */}
                <form class="flex flex-col" onsubmit={(e) => e.preventDefault()}>
                    <div class="my-2 text-gray-600">
                        Shipment information
                    </div>
                    <div class="m-2 flex justify-between">
                        <div class="mr-4 w-full flex flex-col">
                            <label class="mb-1 whitespace-nowrap overflow-hidden overflow-ellipsis" for="from-input">
                                Pickup address
                            </label>
                            <LocationInput bind={this.shipment.pickup_address}
                                placeholder="Pickup address" id="from-input" />
                        </div>
                        <div class="ml-4 w-full flex flex-col">
                            <label class="mb-1 whitespace-nowrap overflow-hidden overflow-ellipsis" for="to-input">
                                Delivery address
                            </label>
                            <LocationInput bind={this.shipment.delivery_address}
                                placeholder="Delivery address" id="to-input" />
                        </div>
                    </div>
                    <div class="flex flex-col m-2">
                        <label class="mb-1 whitespace-nowrap overflow-hidden overflow-ellipsis" for="pickup-date-input">
                            Desired pickup date
                        </label>
                        <DateInput bind={this.shipment.pickup_date} future={true}
                            id="pickup-date-input" />
                    </div>
                    <div class="flex items-center my-4 py-1 px-4 rounded shadow bg-gray-100 text-gray-600">
                        <Icon name="info" class="w-5" />
                        <span class="ml-4">
                            Exact pickup date and time will be set once you accept a shipper's quote.
                        </span>
                    </div>
                    <div class="mt-4 flex flex-col">
                        <div class="text-gray-600 w-full">
                            What items are you shipping?
                            <span class="ml-1 italic">
                                ({this.shipment.items.length} total)
                            </span>
                        </div>
                        <ItemsEdit bind={this.shipment.items} />
                    </div>
                    <div class="mt-8">
                        <div class="text-gray-600 w-full">
                            What is the total commercial value of your items?
                        </div>
                        <div class="flex items-center w-full my-1 p-2">
                            <SelectInput bind={this.shipment.currency} values={[
                                {label: '$', value: 'usd'},
                                {label: '€', value: 'eur'},
                                {label: '£', value: 'eur'}
                            ]} />
                            <input class="ml-2" type="number" step="any" placeholder="Total value"
                                oninput={(e) => this.shipment.total_value.value = e.target.value}
                                value={this.shipment.total_value.value} />
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="text-gray-600 w-full mb-4">
                            Services requested ({this.shipment.services.length} total)
                        </div>
                        <ShipmentServicesInput bind={this.shipment.services} />
                    </div>
                    <div class="mt-4">
                        <div class="text-gray-600 w-full">
                            Anything else to add?
                        </div>
                        <div class="my-2 py-2 px-4">
                            <textarea rows="2" class="max-h-64" placeholder="Additional comments..."
                                oninput={(e) => this.shipment.comments.value = e.target.value}
                                value={this.shipment.comments.value}>
                            </textarea>	
                        </div>
                    </div>
                    <div class="mt-8">
                        <div class="flex">
                            <div class={!this.new ? 'block' : 'hidden'}>
                                <button class="flex justify-center items-center whitespace-nowrap px-4 py-2 rounded
                                    text-red-800 hover:text-red-900 bg-red-200 hover:bg-red-300 hover:shadow transition-all"
                                    onclick={(e) => {this.delete(e)}}>
                                    <Icon name="trash-2" class="w-4 h-4" />
                                    <span class="ml-2">
                                        Delete
                                    </span>
                                </button>
                            </div>
                            <div class="flex justify-end w-full select-none">
                                <button class="flex justify-center items-center whitespace-nowrap mx-2 px-4 py-2 rounded
                                    text-gray-800 hover:text-black bg-gray-100 hover:bg-gray-200 hover:shadow transition-all"
                                    onclick={(e) => {this.save = true; this.submit(e)}}>
                                    <Icon name="save" class="w-4" />
                                    <span class="ml-2">
                                        Save <span class={this.new ? '' : 'hidden'}>as draft</span>
                                    </span>
                                </button>
                                <div class={!this._shipment || this._shipment.status === 'draft' ? 'block' : 'hidden'}>
                                    <button class="flex justify-center items-center whitespace-nowrap mx-2 px-4 py-2 rounded
                                        text-gray-800 hover:text-black bg-blue-200 hover:bg-blue-300 hover:shadow transition-all"
                                        onclick={(e) => {this.save = false; this.submit(e)}}>
                                        <Icon name="arrow-right" class="w-4" />
                                        <span class="ml-2">
                                            Create
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}``