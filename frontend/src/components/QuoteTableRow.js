import m from 'mithril';
import Api from '../Api';
import warning_img from '../../assets/warning.svg';
import card_img from '../../assets/card.svg';
import Utils from '../Utils';
import IconButton from './IconButton';
import Badge from './Badge';
import Actions from './Actions';
import Modal from './Modal';
import MoneyText from './MoneyText';

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
        this.callback = vnode.attrs.callback;
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

    navigate() {
        m.route.set('/quotes/:id', {id: this.quote.uuid});
    }

    view(vnode) {
        return (
            <tr class={`border-b border-gray-200 text-gray-600
                ${this.is_shipment_owner ? 'whitespace-nowrap cursor-pointer transition-all hover:bg-gray-50 hover:shadow' : ''}`}
                onclick={() => this.navigate()}>
                <td class="w-1 pl-2 py-1 text-right">
                    <MoneyText currency={this.currency}>
                        {/* {this.quote.bid.value} */}
                        150
                    </MoneyText>
                </td>
                <td class="w-1 py-1 px-4">
                    <span class="inline-flex items-center">
                        {this.quote.is_accepted() ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="green">
                                    Accepted
                                </Badge>
                            </span>
                        ) : ''}
                        {this.quote.is_declined() ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="red">
                                    Declined
                                </Badge>
                            </span>
                        ) : ''}
                        {(this.quote.is_cheapest && !this.quote.is_declined()) ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="pink">
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
                <td class="w-full py-1 whitespace-nowrap">
                    <span class="inline-flex items-baseline">
                        {Utils.absolute_date(this.quote.delivery_date.value, true)}
                    </span>
                </td>
                <td class="w-full py-1 pr-2">
                    {(this.is_shipment_owner && this.quote.is_pending()) ? (
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
                    {(this.is_shipment_owner && this.quote.is_accepted() && !this.quote.is_paid()) ? (
                        <Badge color="yellow" icon="alert-circle">
                            Payment needed
                        </Badge>
                    ) : ''}
                    {(this.is_quote_owner && !this.quote.is_accepted()) ? (
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