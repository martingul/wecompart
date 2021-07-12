import m from 'mithril';
import FileSaver from 'file-saver';
import hourglass_img from '../assets/hourglass.svg';
import success_img from '../assets/success.svg';
import warning_img from '../assets/warning.svg';
import Api from '../Api';
import Utils from '../Utils';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import Title from '../components/Title';
import Timer from '../components/Timer';
import Button from '../components/Button';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Actions from '../components/Actions';
import ShipmentComments from '../components/ShipmentComments';
import ItemTableRow from '../components/ItemTableRow';
import QuoteTableRow from '../components/QuoteTableRow';
import QuoteEdit from '../components/QuoteEdit';
import Modal from '../components/Modal';
import ShipmentStorage from '../models/ShipmentStorage';
import Shipment from '../models/Shipment';
import User from '../models/User';
import AppView from './App';
import IconButton from '../components/IconButton';

export default class ShipmentView {
    constructor(vnode) {
        console.log('construct ShipmentView');
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

        this.loading = false;
        this.delete_loading = false;

        this.quote_create_show = false;
        this.quote_create_success = false;

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
        this.delete_loading = true;
        return this.shipment.delete().then(_ => {
            ShipmentStorage.remove(this.shipment);
            m.route.set('/shipments');
        }).finally(() => {
            this.delete_loading = false;
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
                    <div class="my-6 w-full text-center">
                        No such shipment
                    </div>
                </AppView>
            );
        }

        return (
            <AppView>
                <div class='flex flex-col'>
                    <div class='flex justify-between items-end pb-2 border-b border-gray-200'>
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
                        {this.is_owner ? (
                            <div class="flex items-center">
                                <Actions actions={[
                                    {name: 'edit', label: 'Edit', icon: 'edit-3', callback: () => {
                                        m.route.set('/shipments/:id/edit', {id: this.shipment.uuid});
                                    }},
                                    {name: 'download', label: 'Download PDF', icon: 'download', callback: () => {
                                        console.log('download');
                                    }},
                                    {name: 'delete', label: 'Delete', icon: 'trash-2', callback: () => {
                                        Modal.create({
                                            title: 'Delete shipment',
                                            content: (
                                                <div class="flex flex-col items-center">
                                                    <img class="w-60" src={warning_img} />
                                                    <div class="my-6 flex flex-col">
                                                        <span class="text-gray-800">
                                                            Are you sure you want to delete this shipment?
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                            confirm_label: 'Delete',
                                            confirm_color: 'red',
                                            confirm: () => this.delete_shipment(),
                                            loading: () => this.delete_loading,
                                        });
                                    }},
                                ]} />
                            </div>
                        ) : ''}
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
                                        <div class="inline-flex mt-1 mr-1">
                                            <Badge color="indigo" icon="truck">
                                                Shipping
                                            </Badge>
                                        </div>
                                        {this.shipment.services.includes('packaging') ? (
                                             <div class="inline-flex mr-1 mt-1">
                                                <Badge color="indigo" icon="box">
                                                    Packaging
                                                </Badge>
                                            </div>
                                        ) : ''}
                                        {this.shipment.services.includes('insurance') ? (
                                            <div class="inline-flex mt-1">
                                                <Badge color="indigo" icon="shield">
                                                    Insurance
                                                </Badge>
                                            </div>
                                        ) : ''}
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
                                {this.is_owner ? (
                                    <span class="ml-2 text-gray-500">
                                        ({this.shipment.quotes.length})
                                    </span>
                                ) : ''}
                                {(this.user && this.user.role === 'shipper' && !this.is_owner) ? (
                                    <span class="flex items-center ml-4">
                                        <Badge color="yellow" icon="clock">
                                            <Timer end={this.shipment.pickup_date.value} />
                                        </Badge>
                                    </span>
                                ) : ''}
                            </div>
                            {(this.user && this.user.role === 'shipper' && !this.is_owner) ? (
                                // hide (or disable with explaining tooltip) when user already has a quote posted
                                <div class="flex justify-end">
                                    <Button icon="plus" callback={() => {
                                        if (this.user && this.user.role === 'shipper') {
                                            this.quote_create_show = true;
                                        } else {
                                            m.route.set('/auth/signup');
                                        }
                                    }}>
                                        Create quote
                                    </Button>
                                </div>
                            ) : ''}
                        </div>
                        {(this.is_owner && this.shipment.quotes.length > 0) ? (
                            <div class="flex px-2">
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
                        ) : ''}
                        {(this.user && this.user.role === 'shipper' && !this.is_owner && this.shipment.quotes.length > 0 && !this.quote_create_success) ? (
                            <div class="flex flex-col px-2">
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
                        ) : ''}
                        {(!this.quote_create_show && this.shipment.quotes.length === 0) ? (
                            <div class="flex justify-center">
                                <div class="w-1/3 my-2 flex flex-col items-center text-center">
                                    <img src={hourglass_img} />
                                    <span class="mt-4 mb-6 text-gray-500">
                                        {(this.user && this.user.role === 'shipper')
                                            ? 'Be the first shipper to place a quote on this shipment!'
                                            : 'Shippers will soon place their quotes if they wish to handle your shipment.'
                                        }
                                    </span>
                                </div>
                            </div>
                        ) : ''}
                        {this.quote_create_show ? (
                            <div class="my-4 flex justify-center">
                                <QuoteEdit shipment={this.shipment}
                                    close={(success) => {
                                        this.quote_create_success = success;
                                        this.quote_create_show = false;
                                    }} />
                            </div>
                        ) : ''}
                        {this.quote_create_success ? (
                            <div class="flex flex-col items-center">
                                <div class="w-1/2 my-2 flex flex-col items-center text-center rounded border border-gray-200">
                                    <div class="w-full flex justify-end p-2">
                                        <IconButton icon="x" callback={() => this.quote_create_success = false} />
                                    </div>
                                    <img class="w-60" src={success_img} />
                                    <span class="pt-4 pb-8 px-2 text-gray-500">
                                        Your quote has been placed and you will be notified once the client accepts or declines it.
                                    </span>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>
            </AppView>
        );
    }
}