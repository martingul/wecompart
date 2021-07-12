import m from 'mithril';
import Api from '../Api';
import Utils from '../Utils';
import Button from './Button';
import Badge from './Badge';

export default class QuoteTableRow {
    constructor(vnode) {
        this.index = vnode.attrs.index;
        this.quote = vnode.attrs.quote;
        this.currency = 'usd';
    }

    update_status(status) {
        Api.update_shipment_quote({
            shipment_id: this.quote.shipment_uuid,
            quote_id: this.quote.uuid,
            patch: {
                status: status
            }
        }).then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        });
    }

    oncreate(vnode) {
        vnode.dom.addEventListener('mouseover', () => {
            this.show_actions = true;
            m.redraw();
        });

        vnode.dom.addEventListener('mouseout', () => {
            this.show_actions = false;
            m.redraw();
        });
    }

    view(vnode) {
        return (
            <tr class={`text-gray-600 border-b border-gray-200
                ${this.quote.is_user ? 'bg-yellow-50 rounded' : ''}`}>
                <td class="w-1 py-2 text-black font-bold text-right">
                    {Utils.format_money(this.quote.price.value, this.currency)}
                </td>
                <td class="w-1 py-2 px-2 uppercase text-gray-400">
                    {this.currency}
                </td>
                <td class="w-1 py-2 pr-4">
                    <span class="inline-flex items-center">
                        <span class={this.quote.is_cheapest ? 'inline-flex mx-0.5' : 'hidden'}>
                            <Badge color="green">
                                Cheapest
                            </Badge>
                        </span>
                        <span class={this.quote.is_earliest ? 'inline-flex mx-0.5' : 'hidden'}>
                            <Badge color="purple">
                                Earliest
                            </Badge>
                        </span>
                    </span>
                </td>
                <td class="w-full py-2 pr-4 whitespace-nowrap">
                    <span class="inline-flex items-baseline">
                        <span>
                            {Utils.absolute_date(this.quote.delivery_date.value, true)}
                        </span>
                        <span class="pl-2 text-sm text-gray-400">
                            {this.quote.delivery_date.value.replaceAll('-', '/')}
                        </span>
                    </span>
                </td>
                <td class="w-full">
                    <span class={this.show_actions ? 'flex' : 'hidden'}>
                        <div class="mr-2">
                            <Button callback={() => this.update_status('accepted')}>
                                Accept
                            </Button>
                        </div>
                        <div>
                            <Button active={false} callback={() => this.update_status('declined')}>
                                Decline
                            </Button>
                        </div>
                    </span>
                </td>
            </tr>
        );
    }
}