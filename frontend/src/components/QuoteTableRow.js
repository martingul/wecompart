import m from 'mithril';
import Api from '../Api';
import warning_img from '../../assets/warning.svg';
import card_img from '../../assets/card.svg';
import Utils from '../Utils';
import Badge from './Badge';
import Actions from './Actions';
import Modal from './Modal';
import MoneyText from './MoneyText';
import User from '../models/User';

export default class QuoteTableRow {
    constructor(vnode) {
        this.index = vnode.attrs.index;
        this.quote = vnode.attrs.quote;
        this.shipment = vnode.attrs.shipment;
        this.callback = vnode.attrs.callback;
        this.user = vnode.attrs.user;
        this.currency = 'usd';
        this.loading = false;
        this.is_quote_owner = this.quote.owner.uuid === this.user.uuid;
        this.is_shipment_owner = this.shipment.owner.uuid === this.user.uuid;
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
            <tr class="whitespace-nowrap cursor-pointer transition-all
                hover:bg-gray-50 hover:shadow border-b border-gray-200 text-gray-600"
                onclick={() => this.navigate()}>
                <td class="w-1 pl-2 py-2 text-right">
                    <MoneyText currency={this.currency}>
                        {/* {this.quote.bid.value} */}
                        150
                    </MoneyText>
                </td>
                <td class="px-2"></td>
                <td class="w-full py-2 whitespace-nowrap">
                    <span class="inline-flex items-baseline">
                        {Utils.absolute_date(this.quote.delivery_date.value, true)}
                    </span>
                </td>
                <td class="w-full py-2 pr-2">
                    <span class="inline-flex items-center">
                        {(this.quote.is_accepted() && this.quote.is_paid()) ? (
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
                        {(this.is_shipment_owner && this.quote.is_accepted() && !this.quote.is_paid()) ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="yellow">
                                    Payment needed
                                </Badge>
                            </span>
                        ) : ''}
                        {this.is_quote_owner ? (
                            <span class="inline-flex mx-0.5">
                                <Badge color="blue">
                                    Your quote
                                </Badge>
                            </span>
                        ) : ''}
                    </span>
                </td>
            </tr>
        );
    }
}