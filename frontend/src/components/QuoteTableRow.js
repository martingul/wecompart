import m from 'mithril';
import Api from '../Api';
import warning_img from '../assets/warning.svg';
import card_img from '../assets/card.svg';
import Utils from '../Utils';
import IconButton from './IconButton';
import Badge from './Badge';
import Actions from './Actions';
import Modal from './Modal';

export default class QuoteTableRow {
    constructor(vnode) {
        this.index = vnode.attrs.index;
        this.quote = vnode.attrs.quote;
        this.shipment = vnode.attrs.shipment;
        this.user = vnode.attrs.user;
        this.currency = 'usd';
        this.loading = false;
        this.is_quote_owner = this.quote.owner_uuid === this.user.uuid;
        this.is_shipment_owner = this.shipment.owner_id === this.user.uuid;
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

    decline_quote() {
        return this.update_quote_status('declined');
    }

    update_quote_status(status) {
        this.loading = true;
        this.quote.status = status;
        return this.quote.update().finally(() => {
            this.loading = false;
        });
    }

    delete_quote() {
        this.loading = true;
        return this.quote.delete().then(_ => {
            this.shipment.remove_quote(this.quote);
        }).finally(() => {
            this.loading = false;
        });
    }

    view(vnode) {
        return (
            <tr class="text-gray-600 border-b border-gray-200">
                <td class="w-1 py-2 text-black font-bold text-right">
                    {Utils.format_money(this.quote.bid.value, this.currency)}
                </td>
                <td class="w-1 py-2 px-2 uppercase text-gray-400">
                    {this.currency}
                </td>
                <td class="w-1 py-2 pr-4">
                    <span class="inline-flex items-center">
                        {this.quote.is_declined() ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="red">
                                    Declined
                                </Badge>
                            </span>
                        ) : ''}
                        {(this.quote.is_cheapest && !this.quote.is_declined()) ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="green">
                                    Cheapest
                                </Badge>
                            </span>
                        ) : ''}
                        {(this.quote.is_earliest && !this.quote.is_declined()) ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="purple">
                                    Earliest
                                </Badge>
                            </span>
                        ) : ''}
                    </span>
                </td>
                <td class="w-full py-2 pr-4 whitespace-nowrap">
                    <span class="inline-flex items-baseline">
                        {Utils.absolute_date(this.quote.delivery_date.value, true)}
                    </span>
                </td>
                <td class="w-full">
                    {(this.is_shipment_owner && !this.quote.is_declined()) ? (
                        <Actions actions={[
                            {name: 'accept', label: 'Accept', icon: 'check', callback: () => {
                                console.log('accept');
                                // this.update_quote_status('accepted');
                                // TODO show modal confirming acceptance:
                                //    - show quote summary
                                //    - show what is due to pay (include taxes)
                                //    - show button to go to checkout
                                Modal.create({
                                    title: 'Accept quote',
                                    content: (
                                        <div class="flex flex-col items-center">
                                            <img class="w-60" src={card_img} />
                                            <div class="my-6 flex flex-col">
                                                <span class="text-gray-800">
                                                    Are you sure you want to accept this quote?
                                                </span>
                                                <span class="mt-2 text-gray-500">
                                                    You will be redirected to a confirmation page in order to complete your order.
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                    confirm_label: 'Accept',
                                    confirm_color: 'indigo',
                                    confirm: () => this.accept_quote(),
                                    loading: () => this.loading,
                                })
                            }},
                            {name: 'decline', label: 'Decline', icon: 'slash', callback: () => {
                                console.log('decline');
                                Modal.create({
                                    title: 'Decline quote',
                                    content: (
                                        <div class="flex flex-col items-center">
                                            <img class="w-60" src={warning_img} />
                                            <div class="my-6 flex flex-col">
                                                <span class="text-gray-800">
                                                    Are you sure you want to decline this quote?
                                                </span>
                                                <span class="mt-2 text-gray-500">
                                                    You will not be able to accept a quote once you have declined it.
                                                </span>
                                            </div>
                                        </div>
                                    ),
                                    confirm_label: 'Decline',
                                    confirm_color: 'red',
                                    confirm: () => this.decline_quote(),
                                    loading: () => this.loading,
                                });
                            }},
                            {name: 'message', label: 'Message shipper', icon: 'message-circle', callback: () => {
                                console.log('message');
                            }},
                        ]} />
                    ) : ''}
                    {this.is_quote_owner ? (
                        <IconButton icon="x" callback={() => {
                            console.log('delete');
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
                        }} />
                    ) : ''}
                </td>
            </tr>
        );
    }
}