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
import IconButton from './IconButton';
import Shipment from '../models/Shipment';
import Item from '../models/Item';
import ShipmentStorage from '../models/ShipmentStorage';

export default class ShipmentEdit {
    constructor(vnode) {
        this.close = vnode.attrs.close ? vnode.attrs.close : (() => {});
        this.shipment = vnode.attrs.shipment ? vnode.attrs.shipment : new Shipment({});
        this.is_new = vnode.attrs.shipment === undefined;
        console.log('contruct ShipmentEdit', this.is_new);

        
        if (this.is_new) {
            this.shipment.items.push(new Item({key: Utils.generate_key()}));
            this.shipment.services.push('shipping');
        }

        this.loading = false;
        this.error_shipment_not_found = false;
        this.save = false;
    }

    // TODO move all flags to shipment model and move all methods

    create_shipment() {
        if (this.is_new) {
            /* TODO add progress bar and undo option, makes user feel there
            is a lot of stuff going on in the back scene
            not saying there isn't */
            console.log('create new');
            this.shipment.status = 'pending';
            console.log(this.shipment.serialize());
            this.shipment.create().then(s => {
                console.log(s);
                ShipmentStorage.create_shipment(new Shipment(s));
                this.close();
            }).catch(e => {
                console.log(e);
            });
        } else {
            console.log('create from draft');
            this.shipment.status = 'pending';
            this.shipment.update().then(s => {
                console.log(s);
                this.close(this.shipment);
            }).catch(e => {
                console.log(e);
            });
        }
    }

    save_shipment() {
        if (this.is_new) {
            console.log('save new draft');
            this.shipment.status = 'draft';
            this.shipment.create().then(s => {
                console.log(s);
                ShipmentStorage.create_shipment(new Shipment(s))
                this.close();
            }).catch(e => {
                console.log(e);
            });
        } else {
            console.log('edit current shipment');
            this.shipment.update().then(s => {
                console.log(s);
                this.close();
            }).catch(e => {
                console.log(e);
            });

            // maybe put this is this.shipment.update()
            this.shipment.create_items();
            this.shipment.update_items();
            this.shipment.delete_items();
        }
    }

    delete_shipment() {
        console.log('delete');
        this.shipment.delete().then(_ => {
            ShipmentStorage.delete_shipment(this.shipment);
            this.close();
        }).catch(e => {
            console.log(e);
        });
    }

    submit(e) {
        e.preventDefault();
        console.log('submit shipment', this.save);

        if (this.save) {
            this.save_shipment();
        } else {
            this.create_shipment();
        }
    }

    // oninit(vnode) {
    //     if (this.id) {
    //         this.loading = true;
    //         Api.read_shipment({ shipment_id: this.id}).then(res => {
    //             console.log(res);
    //             this.shipment = res;
                
    //             this.shipment.pickup_address.value = this.shipment.pickup_address_long;
    //             this.shipment.pickup_address.place_id = this.shipment.pickup_address_id;

    //             this.shipment.delivery_address.value = this.shipment.delivery_address_long;
    //             this.shipment.delivery_address.place_id = this.shipment.delivery_address_id;

    //             this.shipment.currency.value = this.shipment.currency;
    //             this.shipment.total_value.value = this.shipment.total_value;
    //             this.shipment.need_packing.value = this.shipment.need_packing;
    //             this.shipment.need_insurance.value = this.shipment.need_insurance;
    //             this.shipment.comments.value = this.shipment.comments;

    //             this.items = this.shipment.items.map(item => {
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
        if (!this.shipment && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }
        
        return (
            <div class="mt-2 mb-10 flex flex-col">
                <div class="my-2 flex justify-between items-center">
                    <div class="px-2 rounded font-bold bg-yellow-100 text-black">
                        <div class={this.is_new ? 'block' : 'hidden'}>
                            New Shipment
                        </div>
                        <div class={!this.is_new ? 'block' : 'hidden'}>
                            Edit Shipment
                        </div>
                    </div>
                    <IconButton icon="x" callback={() => this.close()} />
                </div>
                {/* <div class={this.is_new ? 'flex' : 'hidden'}>
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
                    <div class="flex items-center my-4 py-1 px-4 rounded shadow bg-gray-50 text-gray-600">
                        <Icon name="info" class="w-5" />
                        <span class="ml-4">
                            Exact pickup date and time will be set once you accept a shipper's quote.
                        </span>
                    </div>
                    <div class="mt-4 flex flex-col">
                        <div class="text-gray-600 w-full">
                            What items are you shipping?
                            <span class="ml-1 italic">
                                ({this.shipment.items.map(item => item.quantity).reduce((a, b) => a + b, 0)} total)
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
                            <div class={!this.is_new ? 'block' : 'hidden'}>
                                <button class="flex justify-center items-center whitespace-nowrap px-4 py-1 rounded
                                    text-red-800 hover:text-red-900 bg-red-200 hover:bg-red-300 hover:shadow transition-all"
                                    onclick={() => {this.delete_shipment()}}>
                                    <Icon name="trash-2" class="w-4 h-4" />
                                    <span class="ml-2">
                                        Delete
                                    </span>
                                </button>
                            </div>
                            <div class="flex justify-end w-full select-none">
                                <button class="flex justify-center items-center whitespace-nowrap mx-2 px-4 py-1 rounded
                                    text-gray-800 hover:text-black bg-gray-100 hover:bg-gray-200 hover:shadow transition-all"
                                    onclick={(e) => {this.save = true; this.submit(e)}}>
                                    <Icon name="save" class="w-4" />
                                    <span class="ml-2">
                                        Save <span class={this.is_new ? '' : 'hidden'}>as draft</span>
                                    </span>
                                </button>
                                <div class={this.is_new || this.shipment.status === 'draft' ? 'block' : 'hidden'}>
                                    <button class="flex justify-center items-center whitespace-nowrap mx-2 px-4 py-1 rounded
                                        text-gray-800 hover:text-black bg-yellow-200 hover:bg-yellow-300 hover:shadow transition-all"
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
}