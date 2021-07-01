import m from 'mithril';
import FileSaver from 'file-saver';
import Api from '../Api';
import Utils from '../Utils';
import Icon from './Icon';
import Loading from './Loading';
import Header from './Header';
import IconButton from './IconButton';
import ShipmentEdit from './ShipmentEdit';
import ShipmentActions from './ShipmentActions';
import ShipmentComments from './ShipmentComments';
import QuoteEdit from './QuoteEdit';
import Modal from './Modal';
import ShipmentStorage from '../models/ShipmentStorage';
import Shipment from '../models/Shipment';

export default class ShipmentRead {
    constructor(vnode) {
        // this.id = vnode.attrs.id;
        this.loading = false;
        this.shipment = vnode.attrs.shipment ? vnode.attrs.shipment : null;
        this.id = vnode.attrs.id;
        this.close = vnode.attrs.close;
        this.error_shipment_not_found = false;

        if (this.id) {
            if (this.user) {
                // TODO do not show 'sign up as a shipper
            }

            this.loading = true;

            const access_token = m.route.param('access_token');

            Api.read_shipment({
                shipment_id: this.id,
                access_token: access_token
            }).then(s => {
                this.shipment = new Shipment(s);
                this.is_owner = this.shipment.owner_id === Api.get_session().uuid;
                if (this.is_owner) {
                    m.route.set('/')
                }
            }).catch(e => {
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

        if (this.shipment) {
            this.is_owner = this.shipment.owner_id === Api.get_session().uuid;
            this.total_items_quantity = this.shipment.items
                .map(item => item.quantity)
                .reduce((a, c) => a + c);
            this.total_items_weight = this.shipment.items
                .map(item => item.weight)
                .reduce((a, c) => a + c);
        } else {
            this.is_owner = false;
            this.total_items_quantity = 0;
            this.total_items_weight = 0;
        }

        this.access_token = null;
        this.edit = false;
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

    // oninit(vnode) {
    //     const access_token = m.route.param('access_token');
    //     console.log('access_token: ', access_token);
    //     if (access_token) this.access_token = access_token;

    //     if (this.id) {
    //         this.loading = true;
    //         Api.read_shipment({
    //             shipment_id: this.id,
    //             access_token: this.access_token
    //         }).then(res => {
    //             this.shipment = res;

    //             const fmt = new Intl.NumberFormat('en-US', {
    //                 style: 'currency',
    //                 currency: this.shipment.currency,          
    //             });
    //             this.shipment.total_value_fmt = fmt.format(this.shipment.total_value);

    //             const comments_short = Utils.truncate(this.shipment.comments, 25);
    //             if (comments_short === this.shipment.comments) {
    //                 this.show_comments = true;
    //             } else {
    //                 this.shipment.comments_short = comments_short + '...';
    //             }

    //             this.shipment.created_at = new Date(this.shipment.created_at);
    //             this.shipment.updated_at = new Date(this.shipment.updated_at);
    //         }).catch(e => {
    //             console.log(e);
    //             if (e.code === 401) {
    //                 m.route.set('/auth/login');
    //             } else if (e.code === 403) {
    //                 m.route.set('/shipments');
    //             } else {
    //                 this.error_shipment_not_found = true;
    //             }
    //         }).finally(() => {
    //             this.loading = false;
    //         });
    //     }
    // }

    download() {

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

    view(vnode) {
        if (this.shipment === null && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }

        if (this.shipment !== null) {
            if (this.shipment.status === 'draft') {
                return <ShipmentEdit id={vnode.attrs.id} />;
            }

            if (this.edit) {
                return <ShipmentEdit shipment={this.shipment}
                    close={() => this.edit = false} />;
            }
        }

        if (this.error_shipment_not_found) {
            return (
                <div class={this.error_shipment_not_found ? 'block' : 'hidden'}>
                    <div class="my-6 w-full text-center">
                        No such shipment
                    </div>
                </div>
            );
        }

        return (
            <div class={`flex flex-col ${this.id ? 'm-8' : ''}`}>
                <div class={this.id ? 'flex mb-4' : 'hidden'}>
                    <Header auth={false} />
                </div>
                <div class="mb-2 flex justify-between items-start">
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
                        <div class={!this.id ? 'flex items-center' : 'hidden'}>
                            <ShipmentActions
                                edit={() => this.edit = true}
                                download={() => console.log('download')}
                                delete={() => Modal.create({
                                    message: 'Are you sure you want to delete this shipment?',
                                    confirm_label: 'Delete',
                                    confirm_color: 'red',
                                    confirm: () => this.delete_shipment()
                                })} />
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
                                {`(${this.total_items_quantity} ${this.total_items_quantity === 1 ? 'item' : 'items'}, ${this.total_items_weight} kg)`}
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
        );
    }
}