import m from 'mithril';
import time_img from '../../assets/time.svg';
import warning_img from '../../assets/warning.svg';
import Api from '../Api';
import Utils from '../Utils';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Title from '../components/Title';
import Timer from '../components/Timer';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Actions from '../components/Actions';
import ShipmentComments from '../components/ShipmentComments';
import ItemTableRow from '../components/ItemTableRow';
import QuoteTableRow from '../components/QuoteTableRow';
import QuoteEdit from '../components/QuoteEdit';
import Modal from '../components/Modal';
import IconButton from '../components/IconButton';
import MoneyText from '../components/MoneyText';
import ShipmentStorage from '../models/ShipmentStorage';
import Shipment from '../models/Shipment';
import User from '../models/User';
import AppView from './App';
import ButtonLink from '../components/ButtonLink';

export default class ShipmentView {
    constructor(vnode, user = User.load()) {
        console.log('construct ShipmentView');
        this.user = user;
        this.id = m.route.param('id');
        this.access_token = m.route.param('access_token');
        this.error_shipment_not_found = false;
        this.shipment = null;

        if (!this.user && !this.access_token) {
            m.route.set('/auth/login');
        }

        if (this.access_token) {
            localStorage.setItem('access_token', this.access_token);
        }

        this.is_owner = false;
        this.loading = false;
        this.delete_loading = false;

        this.quote_create_show = false;
        this.quote_create_success = false;
        this.quote_create_success_close = false;
        this.quote_new = null;
    }

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
    
            Api.read_shipment({
                shipment_id: this.id,
                access_token: this.access_token
            }).then(s => {
                this.shipment = new Shipment(s);

                if (this.user) {
                    this.is_owner = this.shipment.owner.uuid === this.user.uuid;
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

        if (this.shipment && this.shipment.is_draft()) {
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
                    {(this.quote_create_success && !this.quote_create_success_close) ? (
                        <div class="mb-6 flex items-center p-2 shadow border border-blue-400">
                            <Icon name="check-circle" class="w-5 ml-2 text-blue-500" />
                            <span class="w-full text-gray-700 mx-5">
                                Your quote has been placed and you will be notified once {this.shipment.owner.fullname} accepts or declines it.
                                {this.quote_new ? (
                                    <span class="ml-2">
                                        <ButtonLink callback={() => {
                                            m.route.set('/quotes/:id', {id: this.quote_new.uuid})
                                        }}>
                                            <span>
                                                View
                                            </span>
                                            <Icon name="external-link" class="w-5 ml-1.5" />
                                        </ButtonLink>
                                    </span>
                                ) : ''}
                            </span>
                            <IconButton icon="x" callback={() => {
                                this.quote_create_success_close = true;
                            }} />
                        </div>
                    ) : ''}
                    <div class='flex justify-between items-end pb-3 border-b border-gray-200'>
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
                    {(this.shipment.accepted_quote
                        && !this.shipment.accepted_quote.is_paid()
                        && !this.shipment.is_booked()) ? (
                        <div class="mt-6 py-3 px-5 flex items-center justify-between rounded border border-gray-200">
                            <span class="mr-4 text-gray-800">
                                You have accepted a quote without providing payment. Please confirm and pay the associated invoice in order to complete your booking.
                            </span>
                            <Button active={false} callback={() => {
                                m.route.set('/quotes/:id', {id: this.shipment.accepted_quote.uuid})
                            }}>
                                View quote
                            </Button>
                        </div>
                    ) : ''}
                    {!this.is_owner ? (
                        <div class="px-4 mt-6 flex flex-col">
                            <span class="text-gray-500">
                                Customer
                            </span>
                            <div class="mt-1">
                                <ButtonLink active={false}>
                                    <span>
                                        {this.shipment.owner.fullname}
                                    </span>
                                    <Icon name="external-link" class="w-4 ml-1.5" />
                                </ButtonLink>
                            </div>
                        </div>
                    ) : ''}
                    <div class="px-4 mt-4 flex justify-between items-center">
                        <div class="flex flex-col">
                            <span class="text-gray-500">
                                Pickup address
                            </span>
                            <div class="mt-1 text-black">
                                {this.shipment.pickup_address_formatted.line1}
                            </div>
                            {this.shipment.pickup_address_formatted.line2 ? (
                                <div class="mt-1 text-black">
                                    {this.shipment.pickup_address_formatted.line2}
                                </div>
                            ) : ''}
                        </div>
                        <div class="mx-8 flex flex-col items-center">
                            <Icon name="arrow-right" class="w-6 text-gray-300" />
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-500">
                                Delivery address
                            </span>
                            <div class="mt-1 text-black">
                                {this.shipment.delivery_address_formatted.line1}
                            </div>
                            {this.shipment.delivery_address_formatted.line2 ? (
                                <div class="mt-1 text-black">
                                    {this.shipment.delivery_address_formatted.line2}
                                </div>
                            ) : ''}
                        </div>
                    </div>
                    {/* <div class="mt-6 mx-8 flex flex-col">
                        <img class="shadow-lg rounded" src={this.shipment.map_url} />
                    </div> */}
                    <div class="mt-10 flex flex-col">
                        <div class="flex items-center pb-3 border-b border-gray-200">
                            <span class="rounded text-lg font-semibold text-black">
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
                        <div class="mt-4 px-4">
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
                    <div class="mt-6 px-4 flex justify-between items-start">
                        <div>
                            <div class="text-gray-500 mb-1.5">
                                Services requested ({this.shipment.services.length})
                            </div>
                            <div class="flex flex-wrap">
                                {this.shipment.services.map(s => (
                                    <div class="inline-flex mr-2">
                                        <Badge color="gray">
                                            {Utils.capitalize(s.name)}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div class="ml-2">
                            <div class="text-gray-500 mb-1">
                                Total value
                            </div>
                            <MoneyText currency={this.shipment.currency.value}>
                                {this.shipment.total_value.value}
                            </MoneyText>
                        </div>
                    </div>
                    {this.shipment.comments.value ? (
                        <div class="mt-4 px-4 flex flex-col">
                            <div class="text-gray-500 mb-1">
                                Additional comments
                            </div>
                            <div class="text-black">
                                <ShipmentComments comments={this.shipment.comments.value} />
                            </div>
                        </div>
                    ) : ''}
                    <div class="mt-10 flex flex-col">
                        <div class="mb-4 flex items-center justify-between pb-3 border-b border-gray-200">
                            <div class="flex items-center">
                                <span class="rounded text-lg font-semibold text-black">
                                    Quotes
                                </span>
                                {this.is_owner ? (
                                    <span class="ml-2 text-gray-500">
                                        ({this.shipment.quotes.length})
                                    </span>
                                ) : ''}
                                {(this.user
                                    && this.user.role === 'shipper'
                                    && !this.is_owner
                                    && !this.shipment.has_quote_with_owner(this.user.uuid)) ? (
                                    <span class="flex items-center ml-4">
                                        <Badge color="yellow" icon="clock">
                                            <Timer end={this.shipment.pickup_date.value} />
                                        </Badge>
                                    </span>
                                ) : ''}
                            </div>
                            {(this.user
                                && this.user.role === 'shipper'
                                && !this.is_owner
                                && !this.shipment.has_quote_with_owner(this.user.uuid)) ? (
                                // hide (or disable with explaining tooltip) when user already has a quote posted
                                <div class="flex justify-end">
                                    <Button active={false} callback={() => {
                                        if (this.user && this.user.role === 'shipper') {
                                            this.quote_create_show = true;
                                        } else {
                                            m.route.set('/auth/signup');
                                        }
                                    }}>
                                        <Icon name="plus" class="w-5 mr-1.5" />
                                        <span>
                                            Create quote
                                        </span>
                                    </Button>
                                </div>
                            ) : ''}
                        </div>
                        {(this.is_owner && this.shipment.quotes.length > 0) ? (
                            <div class="flex px-4">
                                <Table collection={this.shipment.quotes}
                                    fields={[
                                        {label: 'bid', type: 'number'},
                                        {label: ''},
                                        {label: 'delivery date', attr: 'delivery_date', type: 'date'},
                                        {label: ''},
                                    ]}>
                                    {this.shipment.quotes.length > 0 ? this.shipment.quotes.map((quote, i) => 
                                        <QuoteTableRow key={quote.uuid} index={i} user={this.user} quote={quote} shipment={this.shipment} />
                                    ) : ''}
                                </Table>
                            </div>
                        ) : ''}
                        {(this.user
                            && this.user.role === 'shipper'
                            && !this.is_owner
                            && this.shipment.quotes.length > 0) ? (
                            <div class="flex flex-col px-4">
                                <Table fields={[
                                        {label: 'bid', type: 'number'},
                                        {label: ''},
                                        {label: 'delivery date', attr: 'delivery_date', type: 'date'},
                                        {label: ''},
                                    ]}>
                                    {this.shipment.quotes.map((quote, i) => 
                                        <QuoteTableRow key={quote.uuid} index={i} user={this.user} quote={quote} shipment={this.shipment} />
                                    )}
                                </Table>
                            </div>
                        ) : ''}
                        {(!this.quote_create_show && this.shipment.quotes.length === 0) ? (
                            <div class="flex justify-center">
                                <div class="w-1/2 my-2 flex flex-col items-center">
                                    <img class="w-60" src={time_img} />
                                    {this.is_owner ? (
                                        <span class="mt-6 text-gray-500">
                                            Shippers will soon place their quotes if they wish to handle your shipment.
                                        </span>
                                    ) : (
                                        <div class="flex flex-col">
                                            <span class="mt-6 text-xl font-semibold text-black">
                                                Be first
                                            </span>
                                            <span class="my-1 text-gray-500">
                                                Be the first shipper to place a quote on this shipment!
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : ''}
                        {this.quote_create_show ? (
                            <div class="my-4 w-full flex justify-center">
                                <div class="px-4 w-full md:w-1/2">
                                    <QuoteEdit shipment={this.shipment}
                                        close={(quote) => {
                                            if (quote) {
                                                this.quote_create_success = true;
                                                this.quote_new = quote;
                                            }
                                            this.quote_create_show = false;
                                        }} />
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>
            </AppView>
        );
    }
}