import m from 'mithril';
import FileSaver from 'file-saver';
import Api from '../Api';
import Utils from '../Utils';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import Title from '../components/Title';
import Button from '../components/Button';
import Table from '../components/Table';
import ShipmentStatus from '../components/ShipmentStatus';
import ShipmentActions from '../components/ShipmentActions';
import ShipmentComments from '../components/ShipmentComments';
import ItemTableRow from '../components/ItemTableRow';
import QuoteTableRow from '../components/QuoteTableRow';
import QuoteEdit from '../components/QuoteEdit';
import Modal from '../components/Modal';
import ShipmentStorage from '../models/ShipmentStorage';
import Shipment from '../models/Shipment';
import User from '../models/User';
import AppView from './App';
import Quote from '../models/Quote';

export default class ShipmentView {
    constructor(vnode) {
        console.log('construct ShipmentView');
        this.loading = false;
        this.id = m.route.param('id');
        this.access_token = m.route.param('access_token');
        this.shipment = ShipmentStorage.get_by_id(this.id);
        this.error_shipment_not_found = false;
        this.best_quote = null;

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
            this.best_quote = this.shipment.get_best_quote();
        }

        this.show_items = false;
        this.show_quote_form = false;

        Api.websocket.onmessage = (e) => {
            const notification = JSON.parse(e.data);
            console.log(notification);
            if (notification.type === 'new_quote') {
                const quote = JSON.parse(notification.content);
                this.shipment.quotes.push(new Quote(quote));
                m.redraw();
            }
        }
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
            m.route.set('/shipments');
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
                console.log(this.shipment);
                this.best_quote = this.shipment.get_best_quote();
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
                    <div class='flex justify-between items-center pb-2 border-b border-gray-200'>
                        <div class="flex flex-col">
                            <div class="mb-1 flex items-center text-gray-500">
                                <Icon name="hexagon" class="w-4" />
                                <span class="uppercase ml-2 font-semibold">
                                    Shipment
                                </span>
                            </div>
                            <div class="flex items-start">
                                <Title>
                                    {Utils.absolute_date(this.shipment.pickup_date.value, true)}
                                </Title>
                                <div class="ml-2 mt-1">
                                    <ShipmentStatus status={this.shipment.status} />
                                </div>
                            </div>
                            {/* <div class="mt-1 whitespace-nowrap text-sm text-gray-400">
                                created {Utils.relative_date(this.shipment.created_at)}
                                {this.created_at !== this.updated_at ?
                                    'last updated ' + Utils.relative_date(this.shipment.updated_at) : ''}
                            </div> */}
                        </div>
                        <div class={this.is_owner ? 'flex items-center' : 'hidden'}>
                            <ShipmentActions
                                edit={() => m.route.set('/shipments/:id/edit', {id: this.shipment.uuid})}
                                download={() => console.log('download')}
                                delete={() => Modal.create({
                                    title: 'Delete shipment',
                                    message: 'Are you sure you want to delete this shipment?',
                                    confirm_label: 'Delete',
                                    confirm_color: 'red',
                                    confirm: () => this.delete_shipment()
                                })} />
                        </div>
                    </div>
                    <div class="mt-2 flex flex-col">
                        <div class="flex justify-between px-4">
                            <div class="flex flex-col">
                                <div class="my-1">
                                    <div class="text-gray-500 mb-1">
                                        Pickup address
                                    </div>
                                    <div class="text-black">
                                        {this.shipment.pickup_address.value}
                                    </div>
                                </div>
                                <div class="my-1">
                                    <div class="text-gray-500 mb-1">
                                        Delivery address
                                    </div>
                                    <div class="text-black">
                                        {this.shipment.delivery_address.value}
                                    </div>
                                </div>
                                <div class="my-1">
                                    <div class="text-gray-500 mb-1">
                                        Total value
                                    </div>
                                    <div class="flex items-center">
                                        <span class="font-bold text-lg text-black">
                                            {this.shipment.get_total_value_fmt()}
                                        </span>
                                        <span class="ml-2 uppercase text-gray-400">
                                            {this.shipment.currency.value}
                                        </span>
                                    </div>
                                </div>
                                <div class="my-1">
                                    <div class="text-gray-500 mb-1">
                                        Services requested ({this.shipment.services.length})
                                    </div>
                                    <div class="my-2 flex items-center px-4 text-center">
                                        <div class="text-green-500">
                                            <Icon name="check-square" class="w-4" />
                                        </div>
                                        <span class="ml-4 uppercase font-bold text-sm text-green-500">
                                            Shipping
                                        </span>
                                    </div>
                                    <div class="my-2 flex items-center px-4 text-center">
                                        <div class={!this.shipment.services.includes('packaging') ? 'block text-gray-400' : 'hidden'}>
                                            <Icon name="x-square" class="w-4" />
                                        </div>
                                        <div class={this.shipment.services.includes('packaging') ? 'block text-green-500' : 'hidden'}>
                                            <Icon name="check-square" class="w-4" />
                                        </div>
                                        <span class="ml-4 uppercase font-bold text-sm">
                                            <span class={this.shipment.services.includes('packaging') ? 'text-green-500' : 'text-gray-400 line-through'}>
                                                Packaging
                                            </span>
                                        </span>
                                    </div>
                                    <div class="my-2 flex items-center px-4 text-center">
                                        <div class={!this.shipment.services.includes('insurance') ? 'block text-gray-400' : 'hidden'}>
                                            <Icon name="x-square" class="w-4" />
                                        </div>
                                        <div class={this.shipment.services.includes('insurance') ? 'block text-green-500' : 'hidden'}>
                                            <Icon name="check-square" class="w-4" />
                                        </div>
                                        <span class="ml-4 uppercase font-bold text-sm">
                                            <span class={this.shipment.services.includes('insurance') ? 'text-green-500' : 'text-gray-400 line-through'}>
                                                Insurance
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div class="my-1">
                                    <div class="text-gray-500 mb-1">
                                        Additional comments
                                    </div>
                                    <div class="text-black">
                                        <ShipmentComments comments={this.shipment.comments.value} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 flex flex-col">
                            <div class="mb-4 flex items-center">
                                <span class="rounded text-lg font-bold text-black">
                                    Shipment content
                                </span>
                                <span>
                                    <span class="ml-2 text-gray-500">
                                        {(() => {
                                            const total_item_quantity = this.shipment.get_total_item_quantity();
                                            const total_items_weight = this.shipment.get_total_item_weight();
                                            return `(${total_item_quantity} ${total_item_quantity === 1 ? 'item' : 'items'}, ${total_items_weight} kg)`
                                        })()}
                                    </span>
                                </span>
                            </div>
                            <div class="px-2">
                                <Table collection={this.shipment.items}
                                    fields={[
                                        {label: 'description', type: 'string'},
                                        {label: 'quantity', type: 'number'},
                                        {label: 'length', type: 'number'},
                                        {label: 'width', type: 'number'},
                                        {label: 'height', type: 'number'},
                                        {label: 'weight', type: 'number'},
                                    ]}>
                                    {this.shipment.items.map(item =>
                                        <ItemTableRow key={item.uuid} item={item} />
                                    )}
                                </Table> 
                            </div>
                        </div>
                    </div>
                    <div class="mt-8 flex flex-col">
                        <div class="mb-4 flex items-center justify-between">
                            <div class="mb-4 flex items-center">
                                <span class="rounded text-lg font-bold text-black">
                                    Quotes
                                </span>
                                <span class={this.is_owner ? 'inline' : 'hidden'}>
                                    <span class="ml-2 text-gray-500">
                                        ({this.shipment.quotes.length})
                                    </span>
                                </span>
                            </div>
                            <div class={(this.user && this.user.role === 'shipper') ? 'block' : 'hidden'}>
                                <Button text="Create quote" icon="plus"
                                    callback={() => {this.show_quote_form = true}} />
                            </div>
                        </div>
                        <div class={(this.is_owner && this.shipment.quotes.length > 0) ? 'flex px-2' : 'hidden'}>
                            <Table collection={this.shipment.quotes}
                                fields={[
                                    {label: 'price', type: 'number'},
                                    {label: '', attr: 'currency', type: 'string'},
                                    {label: 'date', attr: 'created_at', type: 'string'},
                                    {label: ''},
                                ]}>
                                {this.shipment.quotes.map(quote => 
                                    <QuoteTableRow key={quote.uuid} quote={quote} />
                                )}
                            </Table>
                        </div>
                        <div class={(this.user && this.user.role === 'shipper' && !this.is_owner && this.best_quote) ? 'block' : 'hidden'}>
                            <div>
                                Best quote: ${this.best_quote.price}, {Utils.relative_date(this.best_quote.created_at)}
                            </div>
                        </div>
                        <div class={!this.show_quote_form ? 'block' : 'hidden'}>
                            <div class={this.shipment.quotes.length === 0 ? 'flex' : 'hidden'}>
                                <div class="flex justify-center">
                                    <div class="flex flex-col items-center">
                                        <div class="my-4 text-gray-200">
                                            <Icon name="clock" class="w-12 h-12" />
                                        </div>
                                        <div class="my-1 text-gray-600">
                                            No quotes yet.
                                        </div>
                                        <div class={(!this.user && this.access_token) ? 'block' : 'hidden'}>
                                            <button class="mt-8 font-bold font-lg px-4 py-1 rounded hover:shadow-lg transition-all border border-gray-500"
                                                onclick={() => m.route.set('/auth/signup')}>
                                                Place a quote
                                            </button>
                                        </div>
                                        {/* <div class={(this.user && this.user.role === 'shipper') ? 'block' : 'hidden'}>
                                            <button class="mt-8 font-bold font-lg px-4 py-1 rounded hover:shadow-lg transition-all border border-gray-500"
                                                onclick={() => {this.show_quote_form = true}}>
                                                Place a quote
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>      
                        </div>
                        <div class={this.show_quote_form ? 'block' : 'hidden'}>
                            <div class="my-4">
                                <QuoteEdit shipment_id={this.id}
                                    close={() => this.show_quote_form = false} />
                            </div>
                        </div>
                    </div>
                </div>
            </AppView>
        );
    }
}