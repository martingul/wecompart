import m from 'mithril';
import FileSaver from 'file-saver';
import Api from '../Api';
import Utils from '../Utils';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import IconButton from '../components/IconButton';
import ShipmentActions from '../components/ShipmentActions';
import ShipmentComments from '../components/ShipmentComments';
import QuoteEdit from '../components/QuoteEdit';
import Modal from '../components/Modal';
import ShipmentStorage from '../models/ShipmentStorage';
import Shipment from '../models/Shipment';
import User from '../models/User';
import AppView from './App';

export default class ShipmentView {
    constructor(vnode) {
        console.log('construct ShipmentView');
        this.loading = false;
        this.id = m.route.param('id');
        this.access_token = m.route.param('access_token');
        this.shipment = ShipmentStorage.get_by_id(this.id);
        this.error_shipment_not_found = false;

        this.user = User.load();
        if (!this.user && !this.access_token) {
            m.route.set('/auth/login');
        }

        if (this.access_token) {
            localStorage.setItem('access_token', this.access_token);
        }

        this.is_owner = false;
        if (this.shipment) {
            this.is_owner = this.shipment.owner_id === this.user.uuid;
        }

        this.show_items = false;
        this.show_quote_form = false;
    }

    // download_shipment(format) {
    //     Api.download_shipment({
    //         shipment_id: this.id,
    //         format: format,
    //     }).then(res => {
    //         /* TODO check res length is not 0 */
    //         const date = this.shipment.created_at;
    //         const date_fmt = [
    //             date.getFullYear(),
    //             (date.getMonth() + 1).toString().padStart(2, '0'),
    //             date.getDate().toString().padStart(2, '0')
    //         ].join('-');

    //         if (format === 'text') format = 'txt';

    //         const filename = `shipment-${date_fmt}.${format}`;
    //         FileSaver.saveAs(res, filename);
    //     }).catch(e => {
    //         console.log(e);
    //     });
    // }

    delete_shipment() {
        console.log('delete');
        this.shipment.delete().then(_ => {
            ShipmentStorage.delete(this.shipment);
            this.close();
        }).catch(e => {
            console.log(e);
        });
    }

    oninit(vnode) {
        if (!this.shipment) {    
            this.loading = true;        
            console.log('fetching shipment', this.id);
            console.log(this.access_token);
    
            Api.read_shipment({
                shipment_id: this.id,
                access_token: this.access_token
            }).then(s => {
                this.shipment = new Shipment(s);
                if (this.user) {
                    this.is_owner = this.shipment.owner_id === this.user.uuid;
                } else {
                    this.is_owner = false;
                }
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

        if (this.shipment && this.shipment.status === 'draft') {
            m.route.set('/shipments/:id/edit', {id: this.shipment.uuid});
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
                <div class='flex flex-col'>
                    <div class='flex justify-between items-start'>
                        <div class="flex flex-col">
                            <div class="px-4 py-1 rounded font-bold bg-yellow-100 text-black">
                                Shipment information
                            </div>
                            <div class="my-1 px-2 whitespace-nowrap text-sm text-gray-400">
                                created {Utils.relative_date(this.shipment.created_at)}
                                {this.created_at !== this.updated_at ?
                                    'last updated ' + Utils.relative_date(this.shipment.updated_at) : ''}
                            </div>
                        </div>
                        <div class="flex items-center whitespace-nowrap">
                            <div class={!this.is_owner ? 'block' : 'hidden'}>
                                <button class="flex flex-col items-center px-4 py-1 whitespace-nowrap rounded transitions-colors
                                    text-gray-800 hover:text-black bg-gray-100 hover:bg-gray-200 hover:shadow"
                                    // onclick={(e) => this.show_download = !this.show_download}
                                    onclick={(e) => {}}>
                                    <div class="flex items-center">
                                        <Icon name="message-circle" class="w-5" />
                                        <span class="ml-2">
                                            Message
                                        </span>
                                        {/* <Icon name="chevron-down" class="w-4 h-4" /> */}
                                    </div>
                                </button>
                            </div>
                            <div class={this.is_owner ? 'flex items-center' : 'hidden'}>
                                <ShipmentActions
                                    edit={() => m.route.set('/shipments/:id/edit', {id: this.shipment.uuid})}
                                    download={() => console.log('download')}
                                    delete={() => Modal.create({
                                        message: 'Are you sure you want to delete this shipment?',
                                        confirm_label: 'Delete',
                                        confirm_color: 'red',
                                        confirm: () => this.delete_shipment()
                                    })} />
                            </div>
                            <div class={!this.id ? 'flex items-center' : 'hidden'}>
                                <IconButton class="ml-6" icon="x"
                                    callback={() => this.close()} />
                            </div>
                        </div>
                    </div>
                    <div class="my-2 flex flex-col">
                        <div class="my-2">
                            <div class="flex justify-between px-4">
                                <div class="flex flex-col">
                                    <div class="my-1">
                                        <div class="text-gray-600">
                                            Pickup address
                                        </div>
                                        <div class="my-1 text-black">
                                            {this.shipment.pickup_address.value}
                                        </div>
                                    </div>
                                    <div class="my-1">
                                        <div class="text-gray-600">
                                            Delivery address
                                        </div>
                                        <div class="my-1 text-black">
                                            {this.shipment.delivery_address.value}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col ml-4">
                                    <div class={!this.access_token ? 'block' : 'hidden'}>
                                        <div class="my-1">
                                            <div class="text-gray-600">
                                                Status
                                            </div>
                                            <div class="my-1">
                                                <div class={Utils.get_status_style(this.shipment.status)}>
                                                    {this.shipment.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="my-1">
                                        <div class="text-gray-600">
                                            Total value
                                        </div>
                                        <div class="my-1">
                                            <span class="font-bold text-lg text-black">
                                                {this.shipment.get_total_value_fmt()}
                                            </span>
                                            <span class="ml-2 uppercase text-gray-400">
                                                {this.shipment.currency.value}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 mb-6 flex flex-col rounded shadow bg-gray-50">
                            <button class="px-4 py-2 flex items-center whitespace-nowrap"
                                onclick={(e) => this.show_items = !this.show_items}>
                                <div class={this.show_items ? 'inline-block' : 'hidden'}>
                                    <Icon name="chevron-down" class="w-4 h-4" />
                                </div>
                                <div class={!this.show_items ? 'inline-block' : 'hidden'}>
                                    <Icon name="chevron-right" class="w-4 h-4" />
                                </div>
                                <span class="px-1 rounded font-bold text-black ">
                                    Shipment content
                                </span>
                                <span class="p-1 text-gray-600">
                                    {(() => {
                                        const total_item_quantity = this.shipment.get_total_item_quantity();
                                        const total_items_weight = this.shipment.get_total_item_weight();
                                        return `(${total_item_quantity} ${total_item_quantity === 1 ? 'item' : 'items'}, ${total_items_weight} kg)`
                                    })()}
                                </span>
                            </button>
                            <div class={this.show_items ? 'flex flex-col' : 'hidden'}>
                                <div class="py-2 px-4">
                                    {this.shipment.items.map((item, i) => {
                                        return (
                                            <div class="my-2 py-2 px-4 bg-white rounded border border-gray-100">
                                                <div class="my-1 flex items-center">
                                                    <div class="w-full font-bold">
                                                        Item {i + 1}
                                                    </div>
                                                    <div class="font-bold text-gray-600">
                                                        <code>x{item.quantity}</code>
                                                    </div>
                                                </div>
                                                <div class="my-2 flex flex-col">
                                                    <div class="text-gray-600 leading-relaxed">
                                                        Description
                                                    </div>
                                                    <div class="my-1 text-black italic">
                                                        {item.description}
                                                    </div>
                                                </div>
                                                <div class="my-2 flex justify-between">
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Length
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.length}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                {item.dim_unit.value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Width
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.width}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                {item.dim_unit.value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Height
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.height}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                {item.dim_unit.value}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Weight
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.weight}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                kg
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div class="my-2 flex flex-col sm:flex-row justify-between items-start">
                            <div class="flex flex-col">
                                <div class="my-1">
                                    <span class="p-1 rounded font-bold text-black whitespace-nowrap">
                                        Additional comments
                                    </span>
                                </div>
                                <ShipmentComments comments={this.shipment.comments.value} />
                            </div>
                            <div class="flex flex-col sm:ml-4">
                                <div class="my-1">
                                    <span class="p-1 rounded font-bold text-black whitespace-nowrap">
                                        Services requested ({this.shipment.services.length})
                                    </span>
                                </div>
                                <div class="my-2 flex items-center px-4 text-center">
                                    <div class="text-green-500">
                                        <Icon name="check-square" class="w-4 h-4" />
                                    </div>
                                    <span class="ml-4 uppercase font-bold text-sm text-green-500">
                                        Shipping
                                    </span>
                                </div>
                                <div class="my-2 flex items-center px-4 text-center">
                                    <div class={!this.shipment.services.includes('packaging') ? 'block text-gray-400' : 'hidden'}>
                                        <Icon name="x-square" class="w-4 h-4" />
                                    </div>
                                    <div class={this.shipment.services.includes('packaging') ? 'block text-green-500' : 'hidden'}>
                                        <Icon name="check-square" class="w-4 h-4" />
                                    </div>
                                    <span class="ml-4 uppercase font-bold text-sm">
                                        <span class={this.shipment.services.includes('packaging') ? 'text-green-500' : 'text-gray-400 line-through'}>
                                            Packaging
                                        </span>
                                    </span>
                                </div>
                                <div class="my-2 flex items-center px-4 text-center">
                                    <div class={!this.shipment.services.includes('insurance') ? 'block text-gray-400' : 'hidden'}>
                                        <Icon name="x-square" class="w-4 h-4" />
                                    </div>
                                    <div class={this.shipment.services.includes('insurance') ? 'block text-green-500' : 'hidden'}>
                                        <Icon name="check-square" class="w-4 h-4" />
                                    </div>
                                    <span class="ml-4 uppercase font-bold text-sm">
                                        <span class={this.shipment.services.includes('insurance') ? 'text-green-500' : 'text-gray-400 line-through'}>
                                            Insurance
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="my-2 flex flex-col">
                        <div class="my-2 flex">
                            <div class="px-2 rounded font-bold bg-yellow-100 text-black whitespace-nowrap">
                                Quotes
                            </div>
                        </div>
                        <div class={this.show_quote_form ? 'hidden' : 'block'}>
                            <div class="flex justify-center">
                                <div class="flex flex-col items-center">
                                    <div class="my-4 text-gray-200">
                                        <Icon name="clock" class="w-12 h-12" />
                                    </div>
                                    <div class="my-1 text-gray-600">
                                        No quotes yet.
                                    </div>
                                    <div class={this.access_token ? 'block' : 'hidden'}>
                                        <button class="mt-8 bg-yellow-100 font-bold font-lg px-4 py-1 rounded shadow-lg border border-gray-500"
                                            onclick={() => {this.show_quote_form = true}}>
                                            Place a quote
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class={this.show_quote_form ? 'block' : 'block'}>
                            <div class="my-4">
                                <QuoteEdit shipment_id={this.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </AppView>
        );
    }
}