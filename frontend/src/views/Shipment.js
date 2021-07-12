import m from 'mithril';
import FileSaver from 'file-saver';
import Api from '../Api';
import Utils from '../Utils';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import Title from '../components/Title';
import Timer from '../components/Timer';
import Button from '../components/Button';
import Table from '../components/Table';
import Badge from '../components/Badge';
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
            this.shipment.flag_quotes(this.user.uuid);
        }

        this.show_quote_form = false;

        // Api.register_websocket_handler({
        //     name: 'new_quote_handler',
        //     fn: (e) => {
        //         const notification = JSON.parse(e.data);
        //         if (notification.type === 'new_quote') {
        //             const quote = JSON.parse(notification.content);
        //             console.log(quote);
        //             this.shipment.quotes.push(new Quote(quote));
        //             this.shipment.flag_quotes();
        //             m.redraw();
        //         }
        //     }
        // });
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
        this.shipment.delete().then(_ => {
            ShipmentStorage.remove(this.shipment);
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

                if (this.user) {
                    this.is_owner = this.shipment.owner_id === this.user.uuid;
                } else {
                    this.is_owner = false;
                }

                this.shipment.flag_quotes(this.user.uuid);
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
                                    <Badge color={Shipment.status_colors[this.shipment.status]}>
                                        {Utils.capitalize(this.shipment.status)}
                                    </Badge>
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
                            <div class="mt-2 w-1/2 flex flex-col">
                                <div class="mb-2">
                                    <div class="text-gray-500 mb-1">
                                        Pickup address
                                    </div>
                                    <div class="text-black">
                                        {this.shipment.pickup_address.value}
                                    </div>
                                </div>
                                <div class="mb-2">
                                    <div class="text-gray-500 mb-1">
                                        Delivery address
                                    </div>
                                    <div class="text-black">
                                        {this.shipment.delivery_address.value}
                                    </div>
                                </div>
                                <div class="mb-2">
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
                                <div class="mb-2">
                                    <div class="text-gray-500 mb-1">
                                        Services requested ({this.shipment.services.length})
                                    </div>
                                    <div class="flex flex-wrap">
                                        <div class="inline-flex mt-1">
                                            <Badge color="indigo" icon="truck">
                                                Shipping
                                            </Badge>
                                        </div>
                                        <div class={this.shipment.services.includes('packaging') ? 'inline-flex ml-1 mt-1' : 'hidden'}>
                                            <Badge color="indigo" icon="box">
                                                Packaging
                                            </Badge>
                                        </div>
                                        <div class={this.shipment.services.includes('insurance') ? 'inline-flex ml-1 mt-1' : 'hidden'}>
                                            <Badge color="indigo" icon="shield">
                                                Insurance
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-gray-500 mb-1">
                                        Additional comments
                                    </div>
                                    <div class="text-black">
                                        <ShipmentComments comments={this.shipment.comments.value} />
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 ml-8 w-1/2 flex flex-col">
                                <img class="shadow-lg rounded" src={this.shipment.map_url} />
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
                            <div class="flex items-center">
                                <span class="rounded text-lg font-bold text-black">
                                    Quotes
                                </span>
                                <span class={this.is_owner ? 'inline' : 'hidden'}>
                                    <span class="ml-2 text-gray-500">
                                        ({this.shipment.quotes.length})
                                    </span>
                                </span>
                            </div>
                            <div class={(this.user && this.user.role === 'shipper' && !this.is_owner) ? 'flex items-center' : 'hidden'}>
                                <span class="mr-4">
                                    <Badge color="yellow" icon="clock">
                                        <Timer end={this.shipment.pickup_date.value} />
                                    </Badge>
                                </span>
                                <Button icon="plus" callback={() => {
                                    if (this.user && this.user.role === 'shipper') {
                                        this.show_quote_form = true;
                                    } else {
                                        m.route.set('/auth/signup');
                                    }
                                }}>
                                    Create quote
                                </Button>
                            </div>
                        </div>
                        <div class={(this.is_owner && this.shipment.quotes.length > 0)? 'flex px-2' : 'hidden'}>
                            <Table collection={this.shipment.quotes}
                                fields={[
                                    {label: 'bid', type: 'number'},
                                    {label: '', attr: 'currency', type: 'string'},
                                    {label: ''},
                                    {label: 'delivery date', attr: 'delivery_date', type: 'date'},
                                    {label: ''},
                                ]}>
                                {this.shipment.quotes.length > 0 ? this.shipment.quotes.map((quote, i) => 
                                    <QuoteTableRow key={quote.uuid} index={i} quote={quote} />
                                ) : ''}
                            </Table>
                        </div>
                        <div class={(this.user && this.user.role === 'shipper' && !this.is_owner && this.shipment.quotes.length > 0)
                            ? 'flex flex-col px-2' : 'hidden'}>
                            <Table fields={[
                                    {label: 'bid', type: 'number'},
                                    {label: '', attr: 'currency', type: 'string'},
                                    {label: ''},
                                    {label: 'delivery date', attr: 'delivery_date', type: 'date'},
                                    {label: ''},
                                    ]}>
                                {this.shipment.quotes.map((quote, i) => 
                                    <QuoteTableRow key={quote.uuid} index={i} quote={quote} />
                                )}
                            </Table>
                        </div>
                        <div class={!this.show_quote_form ? 'block' : 'hidden'}>
                            <div class={this.shipment.quotes.length === 0 ? 'flex justify-center' : 'hidden'}>
                                <div class="flex flex-col items-center">
                                    <div class="my-4 text-gray-200">
                                        <Icon name="clock" class="w-12 h-12" />
                                    </div>
                                    <div class="my-1 text-gray-600">
                                        No quotes yet.
                                    </div>
                                </div>
                            </div>      
                        </div>
                        <div class={this.show_quote_form ? 'block' : 'hidden'}>
                            <div class="my-4 flex justify-center">
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