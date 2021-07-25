import m from 'mithril';
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

export default class QuoteView {
    constructor(vnode) {
        this.quote_id = vnode.attrs.id;
        this.quote = null;
        
        console.log('construct QuoteView', this.quote_id);
        this.loading = false;  
        this.show_payment = false;
        this.show_accept = false;
        this.quote_accept_loading = false;
        this.quote_download_loading = false;
    }

    accept_quote() {
        return this.update_quote_status('accepted')
            .then(_ => this.shipment.checkout(this.quote.uuid))
            .then(url => {
                window.location.replace(url);
            })
            .catch(e => {
                console.log(e);
            });
    }

    update_quote_status(status) {
        this.loading = true;
        this.quote.status = status;
        return this.quote.update().finally(() => {
            this.loading = false;
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
        if (!this.quote) {
            this.loading = true;
            console.log('fetching quote', this.quote_id);

            Api.read_quote({
                quote_id: this.quote_id
            }).then(s => {
                this.quote = new Quote(s);
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    view(vnode) {
        if (this.loading || !this.quote) {
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
                                    <Badge color={() => this.quote.get_status_color()}>
                                        {Utils.capitalize(this.quote.status)}
                                    </Badge>
                                </div>
                                {/* <span class="ml-2 text-gray-400">
                                    created {Utils.relative_date(this.quote.created_at)}
                                </span> */}
                            </div>
                        </div>
                        {this.quote.is_accepted() ? (
                            <div class="flex items-center">
                                <Button active={false} icon="arrow-down"
                                    loading={() => this.quote_download_loading}
                                    callback={() => {
                                        this.download_quote();
                                    }}>
                                    Download
                                </Button>
                            </div>
                        ) : (
                            <div class="flex items-center">
                                <Button active={false} icon="check" callback={() => {
                                    this.show_accept = true;
                                }}>
                                    Accept
                                </Button>
                                <div class="ml-4">
                                    <Actions actions={[
                                        {name: 'download', label: 'Download PDF', icon: 'download', callback: () => {
                                            console.log('download');
                                        }},
                                        {name: 'decline', label: 'Decline', icon: 'slash', callback: () => {
                                            console.log('decline');
                                        }},
                                    ]} />
                                </div>
                            </div>
                        )}
                    </div>
                    {this.show_accept ? (
                        <div class="mt-6 p-4 flex flex-col rounded border border-gray-200">
                            <div class="flex">
                                <span class="text-gray-800">
                                    Accepting a quote will require you to provide payment for your booking, which will be released to the service provider once your shipment is delivered.
                                </span>
                            </div>
                            <div class="mt-4 flex justify-end">
                                <Button active={false} callback={() => {
                                    this.show_accept = false;
                                }}>
                                    Cancel
                                </Button>
                                <div class="ml-2">
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
                    {(this.quote.is_accepted() && !this.quote.is_paid()) ? (
                        <div class="mt-6 py-3 px-5 flex flex-col rounded border border-gray-200">
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
                    <table class="mt-6">
                        <tr>
                            <td class="w-full whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-gray-500">
                                        From
                                    </span>
                                    <div class="flex items-center">
                                        <span class="text-black font-semibold mr-1.5">
                                            Shipper company
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
                                            Alex Parkinson
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
                                        Delivery date
                                    </span>
                                    <span class="mt-0.5 text-gray-800">
                                        {Utils.absolute_date(this.quote.delivery_date.value, true)}
                                    </span>
                                </div>
                            </td>
                            <td class="pt-4 whitespace-nowrap">
                                <div class="flex flex-col">
                                    <span class="text-gray-500">
                                        Expiration date
                                    </span>
                                    <span class="mt-0.5 text-gray-800">
                                        {Utils.absolute_date(this.quote.delivery_date.value, true)}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div class="mt-8 flex flex-col">
                        <Table collection={this.services}
                            fields={[
                                {label: 'item', type: 'string'},
                                {label: 'quantity', type: 'number'},
                                {label: 'price', type: 'number'},
                            ]}>
                            {this.quote.bids.map(bid => (
                                <tr class="border-b border-gray-200 text-gray-600">
                                    <td class="py-2 italic">
                                        {`${Utils.capitalize(bid.service.name)} service`}
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
                                            {bid.amount}
                                        </MoneyText>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                        <div class="flex justify-end">
                            <table>
                                <tr class="border-b border-gray-200">
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
                                </tr>
                                <tr class="border-b border-gray-200">
                                    <td class="py-2 whitespace-nowrap text-black">
                                        Total
                                    </td>
                                    <td class="py-2 pl-6">
                                        <MoneyText currency="usd">
                                            <span class="font-semibold">
                                                119
                                            </span>
                                        </MoneyText>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="mt-8 flex flex-col">
                        <span class="text-gray-500">
                            Notes from shipper
                        </span>
                        <span class="mt-1 text-gray-800">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta arcu sed consequat feugiat. Praesent vel justo suscipit, ultricies eros sed, feugiat orci.
                        </span>
                    </div>
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