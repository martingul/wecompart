import m from 'mithril';
import Utils from '../Utils';
import Api from '../Api';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import ItemsEdit from '../components/ItemsEdit';
import LocationInput from '../components/LocationInput';
import DateInput from '../components/DateInput';
import ShipmentServicesInput from '../components/ShipmentServicesInput';
import SelectInput from '../components/SelectInput';
import IconButton from '../components/IconButton';
import Modal from '../components/Modal';
import Shipment from '../models/Shipment';
import Item from '../models/Item';
import ShipmentStorage from '../models/ShipmentStorage';
import User from '../models/User';
import AppView from './App';

export default class ShipmentEditView {
    constructor(vnode) {
        this.id = m.route.param('id');
        console.log(this.id);
        this.is_new = this.id === undefined;
        this.error_shipment_not_found = false;

        this.user = User.load();
        if (this.user === null) {
            m.route.set('/auth/login');
        }

        if (this.is_new) {
            this.shipment = new Shipment({});
            this.shipment.items.push(new Item({key: Utils.generate_key()}));
            this.shipment.services.push('shipping');
        } else {
            this.shipment = ShipmentStorage.get_by_id(this.id);
        }

        console.log('contruct ShipmentEdit', this.is_new);

        this.loading = false;
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
                ShipmentStorage.create(new Shipment(s));
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
                ShipmentStorage.create(new Shipment(s))
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
            ShipmentStorage.delete(this.shipment);
            m.route.set('/shipments');
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

    close() {
        if (this.is_new) {
            m.route.set('/shipments');
        } else {
            m.route.set('/shipments/:id', {id: this.id});
        }
    }

    oninit(vnode) {
        if (!this.shipment) {    
            this.loading = true;        
            console.log('fetching shipment', this.id);
            const access_token = m.route.param('access_token');
    
            Api.read_shipment({
                shipment_id: this.id,
                access_token: access_token
            }).then(s => {
                console.log('init success from ShipmentView')
                this.shipment = new Shipment(s);
                this.is_owner = this.shipment.owner_id === this.user.uuid;
                console.log(this.is_owner);
                console.log(this.shipment.owner_id, this.user.uuid);
            }).catch(e => {
                console.log(e);
                if (e.code === 401) {
                    m.route.set('/auth/login');
                } else if (e.code === 403) {
                    m.route.set('/');
                } else {
                    this.error_shipment_not_found = true;
                }
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    view(vnode) {
        if (!this.shipment && this.loading) {
            return (
                <AppView>
                    <div class="flex justify-center">
                        <div class="my-8 flex items-center text-gray-600">
                            <Loading class="w-12" />
                        </div>
                    </div>
                </AppView>
            );
        }

        if (this.error_shipment_not_found) {
            return (
                <AppView>
                    <div class={this.error_shipment_not_found ? 'block' : 'hidden'}>
                        <div class="my-6 w-full text-center">
                            No such shipment
                        </div>
                    </div>
                </AppView>
            );
        }
        
        return (
            <AppView>
                <div class="flex flex-col">
                    <div class="mb-2 flex justify-between items-start">
                        <div class="px-4 py-1 rounded font-bold bg-yellow-100 text-black">
                            <div class={this.is_new ? 'block' : 'hidden'}>
                                New Shipment
                            </div>
                            <div class={!this.is_new ? 'block' : 'hidden'}>
                                Edit Shipment
                            </div>
                        </div>
                        <div class={this.shipment.status !== 'draft' ? 'block' : 'hidden'}>
                            <IconButton icon="x" callback={() => this.close()} />
                        </div>
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
                                        onclick={() => Modal.create({
                                            message: 'Are you sure you want to delete this draft?',
                                            confirm_label: 'Delete',
                                            confirm_color: 'red',
                                            confirm: () => this.delete_shipment()
                                        })}>
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
            </AppView>
        );
    }
}