import m from 'mithril';
import Api from '../Api';
import Utils from '../Utils';
import Button from './Button';

export default class QuoteTableRow {
    constructor(vnode) {
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
            <tr class="border-b border-gray-200 text-gray-600">
                <td class="w-1 py-2 text-black font-bold text-right">
                    {Utils.format_money(this.quote.price, this.currency)}
                </td>
                <td class="w-1 py-2 px-2 uppercase text-gray-400">
                    {this.currency}
                </td>
                <td class="w-1 py-2 pr-4 whitespace-nowrap">
                    {Utils.relative_date(this.quote.created_at)}
                </td>
                <td class="w-40">
                    <span class={this.show_actions ? 'flex' : 'hidden'}>
                        <div class="mr-2">
                            <Button text="Accept"
                                callback={() => this.update_status('accepted')} />
                        </div>
                        <div>
                            <Button text="Decline" active={false}
                                callback={() => this.update_status('declined')} />
                        </div>
                    </span>
                </td>
            </tr>
        );
    }
}