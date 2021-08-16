import m from 'mithril';
import warning_img from '../../assets/warning.svg';
import Api from '../Api';
import Utils from '../Utils';
import AppView from './App';
import Quote from '../models/Quote';
import Icon from '../components/Icon';
import Title from '../components/Title';
import Table from '../components/Table';
import Badge from '../components/Badge';
import MoneyText from '../components/MoneyText';
import Button from '../components/Button';
import Payment from '../components/Payment';
import Actions from '../components/Actions';
import Loading from '../components/Loading';
import ButtonLink from '../components/ButtonLink';
import Modal from '../components/Modal';
import User from '../models/User';
import Shipment from '../models/Shipment';

export default class QuoteView {
    constructor(vnode, user = User.load()) {
        this.quote_id = vnode.attrs.id;
        this.user = user;
        this.quote = null;
        this.shipment = null;
        
        console.log('construct QuoteView', this.quote_id);
        this.show_payment = false;
        this.show_accept = false;

        this.quote_read_loading = false;  
        this.quote_accept_loading = false;
        this.quote_download_loading = false;
        this.quote_delete_loading = false;

        this.is_quote_owner = false;
        this.is_shipment_owner = false;
    }

    delete_quote() {
        this.quote_delete_loading = true;
        return this.quote.delete().then(_ => {
            this.shipment.remove_quote(this.quote);
        }).finally(() => {
            this.quote_delete_loading = false;
        });
    }

    download_quote() {
        this.quote_download_loading = true;
        Api.download_quote({
            quote_id: this.quote.uuid
        }).then(res => {
            console.log(res);
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(res.blob);
            link.download = res.filename;
            link.click();
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            this.quote_download_loading = false;
        });
    }

    oninit(vnode) {
        // TODO retrieve from local cache
        this.quote_read_loading = true;
        console.log('fetching quote', this.quote_id);

        Api.read_quote({
            quote_id: this.quote_id
        }).then(q => {
            console.log(q);
            this.quote = new Quote(q);
            this.is_quote_owner = this.quote.owner.uuid === this.user.uuid;
            return Api.read_shipment({
                shipment_id: this.quote.shipment_uuid
            });
        }).then(s => {
            console.log(s);
            this.shipment = new Shipment(s);
            this.is_shipment_owner = this.shipment.owner.uuid === this.user.uuid
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            this.quote_read_loading = false;
        });
    }

    view(vnode) {
        if (this.quote_read_loading || !this.quote) {
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

        return (
            <AppView>
                <div class="flex flex-col">
                    {(this.is_shipment_owner
                        && this.quote.is_accepted()
                        && !this.quote.is_paid()) ? (
                        <div class="mb-6 py-3 px-5 flex flex-col rounded border border-gray-200">
                            <div class="flex">
                                <span class="text-gray-800">
                                    After having accepted a quote, you will need to pay the associated invoice in order to complete your booking.
                                </span>
                            </div>
                            <div class="mt-4 flex justify-between">
                                <ButtonLink callback={() => {
                                    window.location.replace(this.quote.stripe_data.stripe_invoice_pdf);
                                }}>
                                    <Icon name="arrow-down" class="w-5 mr-1.5" />
                                    <span>
                                        Invoice {this.quote.stripe_data.stripe_invoice_number}
                                    </span>
                                </ButtonLink>
                                <Button active={false} callback={() => {
                                    window.open(this.quote.stripe_data.stripe_invoice_url);
                                }}>
                                    <span>
                                        Pay invoice
                                    </span>
                                    <Icon name="external-link" class="w-4 ml-1.5" />
                                </Button>
                            </div>
                        </div>
                    ) : ''}
                    {(this.is_quote_owner
                        && this.quote.is_accepted()) ? (
                        <div class="mb-6 py-3 px-5 flex flex-col rounded border border-gray-200">
                            <div class="flex">
                                <span class="text-gray-800">
                                    The customer has accepted your quote and should be contacting you soon.
                                </span>
                            </div>
                        </div>
                    ) : ''}
                    <div class='flex justify-between items-end pb-2 border-b border-gray-200'>
                        <div class="flex flex-col">
                            <div class="mb-1 flex items-center text-gray-500">
                                <Icon name="hexagon" class="w-4" />
                                <span class="uppercase ml-2 font-semibold">
                                    Quote
                                </span>
                            </div>
                            <div class="flex items-start">
                                <Title>
                                    <span class="text-gray-400 font-normal">
                                        #
                                    </span>
                                    {this.quote.stripe_data.stripe_quote_number}
                                </Title>
                                <div class="ml-2 mt-1">
                                    {(this.is_shipment_owner
                                        && this.quote.is_accepted ()
                                        && !this.quote.is_paid()) ? (
                                        <Badge color="yellow">
                                            Payment needed
                                        </Badge>
                                    ) : (
                                        <Badge color={() => this.quote.get_status_color()}>
                                            {Utils.capitalize(this.quote.status)}
                                        </Badge>
                                    )}
                                </div>
                                {/* <span class="ml-2 text-gray-400">
                                    created {Utils.relative_date(this.quote.created_at)}
                                </span> */}
                            </div>
                        </div>
                        {this.quote.is_accepted() ? (
                            <div class="flex items-center">
                                <Button active={false} callback={() => {
                                        this.download_quote();
                                    }}>
                                    {this.quote_download_loading ? (
                                        <Loading class="w-8" />
                                    ) : ''}
                                    <span>
                                        Download
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <div class="flex items-center">
                                {!this.is_quote_owner ? (
                                    <div class="mr-4">
                                        <Button active={false} callback={() => {
                                            this.show_accept = true;
                                        }}>
                                            Accept
                                        </Button>
                                    </div>
                                ) : ''}
                                <Actions actions={[
                                    {name: 'download', label: 'Download PDF', icon: 'download', callback: () => {
                                        this.download_quote();
                                    }},
                                    this.is_quote_owner
                                        ? {name: 'delete', label: 'Delete', icon: 'trash-2', callback: () => {
                                            Modal.create({
                                                title: 'Delete quote',
                                                content: (
                                                    <div class="flex flex-col items-center">
                                                        <img class="w-60" src={warning_img} />
                                                        <div class="my-6 flex flex-col">
                                                            <span class="text-gray-800">
                                                                Are you sure you want to delete this quote?
                                                            </span>
                                                            <span class="mt-2 text-gray-500">
                                                                You will have to place a new quote in order to notify the client of your interest.
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                                confirm_label: 'Delete',
                                                confirm_color: 'red',
                                                confirm: () => this.delete_quote(),
                                                loading: () => this.loading,
                                            });
                                        }}
                                        : {name: 'decline', label: 'Decline', icon: 'slash', callback: () => {
                                            console.log('decline');
                                        }},
                                ]} />
                            </div>
                        )}
                    </div>
                    {this.show_accept ? (
                        <div class="mt-6 p-4 flex flex-col rounded border border-gray-200">
                            <div class="flex">
                                <span class="text-gray-800">
                                    Accepting a quote will require you to pay a small fee in order to contact the shipper.
                                </span>
                            </div>
                            <div class="mt-4 flex justify-end">
                                <Button active={false} callback={() => {
                                    this.show_accept = false;
                                }}>
                                    Cancel
                                </Button>
                                <div class="ml-3">
                                    <Button loading={() => this.quote_accept_loading} callback={() => {
                                        this.quote_accept_loading = true;
                                        this.quote.update({
                                            status: 'accepted'
                                        }).then(q => {
                                            this.quote = new Quote(q);
                                            m.redraw();
                                            const invoice_url = q.stripe_data.stripe_invoice_url;
                                            if (invoice_url) {
                                                window.open(invoice_url);
                                            }
                                        }).catch(e => {
                                            console.log(e);
                                        }).finally(() => {
                                            this.quote_accept_loading = false;
                                            this.show_accept = false;
                                        });
                                    }}>
                                        Accept
                                    </Button>   
                                </div>
                            </div>
                        </div>
                    ) : ''}
                    <table class="mt-6">
                        <tr>
                            <td class="w-full whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-gray-500">
                                        From
                                    </span>
                                    <div class="flex items-center">
                                        <span class="text-black font-semibold mr-1.5">
                                            {this.quote.owner.fullname}
                                        </span>
                                        <Badge color="gray">
                                            Service provider
                                        </Badge>
                                    </div>
                                </div>
                            </td>
                            <td class="whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-gray-500">
                                        For
                                    </span>
                                    <div class="flex items-center">
                                        <span class="text-black font-semibold mr-1.5">
                                            {this.shipment.owner.fullname}
                                        </span>
                                        <Badge color="gray">
                                            Customer
                                        </Badge>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="pt-4 w-full whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-gray-500">
                                        Expected delivery date
                                    </span>
                                    <span class="mt-0.5 text-gray-800">
                                        {Utils.absolute_date(this.quote.delivery_date.value, true)}
                                    </span>
                                </div>
                            </td>
                            <td class="pt-4 whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-gray-500">
                                        Quote expiration date
                                    </span>
                                    <span class="mt-0.5 text-gray-800">
                                        {Utils.absolute_date(this.quote.delivery_date.value, true)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="mt-8 flex flex-col">
                        <Table collection={this.shipment.services}
                            fields={[
                                {label: 'item', type: 'string'},
                                {label: 'quantity', type: 'number'},
                                {label: 'price', type: 'number'},
                            ]}>
                            {this.shipment.services.map(service => (
                                <tr class="border-b border-gray-200 text-gray-600">
                                    <td class="py-2 italic">
                                        {`${Utils.capitalize(service.name)} service`}
                                    </td>
                                    <td class="py-2 text-right">
                                        <span class="text-sm text-gray-500">
                                            x
                                        </span>
                                        <code class="text-black ml-0.5">
                                            1
                                        </code>
                                    </td>
                                    <td class="py-2 text-right">
                                        <MoneyText currency="usd">
                                            {this.quote.get_bid_by_service_uuid(service.uuid).amount}
                                        </MoneyText>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                        <div class="flex justify-end">
                            <table>
                                {/* <tr class="border-b border-gray-200">
                                    <td class="py-2 whitespace-nowrap text-gray-700">
                                        Subtotal
                                    </td>
                                    <td class="py-2 pl-6">
                                        <MoneyText currency="usd">
                                            {this.quote.get_total_bid()}
                                        </MoneyText>
                                    </td>
                                </tr>
                                <tr class="border-b border-gray-200">
                                    <td class="py-2 whitespace-nowrap text-gray-700">
                                        <div class="flex items-center">
                                            <span class="mr-2">
                                                Platform fees
                                            </span>
                                            <Badge color="gray">
                                                10%
                                            </Badge>
                                        </div>
                                    </td>
                                    <td class="py-2 pl-6">
                                        <MoneyText currency="usd">
                                            14
                                        </MoneyText>
                                    </td>
                                </tr> */}
                                <tr class="border-b border-gray-200">
                                    <td class="py-2 whitespace-nowrap text-black">
                                        Total
                                    </td>
                                    <td class="py-2 pl-6">
                                        <MoneyText currency="usd">
                                            <span class="font-semibold">
                                                {this.quote.get_total_bid()}
                                            </span>
                                        </MoneyText>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    {this.quote.comments.value.length > 0 ? (
                        <div class="mt-8 flex flex-col">
                            <span class="text-gray-500">
                                Notes from shipper
                            </span>
                            <span class="mt-1 text-gray-800">
                                {this.quote.comments.value}
                            </span>
                        </div>
                    ) : ''}
                    {this.show_payment ? (
                        <div class="mt-6">
                            <Payment quote_id={this.quote_id} close={() => {
                                this.show_payment = false;
                            }} />
                        </div>
                    ) : ''}
                </div>
            </AppView>
        );
    }
}