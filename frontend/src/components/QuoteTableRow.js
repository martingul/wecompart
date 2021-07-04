import m from 'mithril';
import Utils from '../Utils';
import Button from './Button';

export default class QuoteTableRow {
    constructor(vnode) {
        this.quote = vnode.attrs.quote;
        this.currency = 'usd';
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
                            <Button text="Accept" />
                        </div>
                        <div>
                            <Button text="Decline" active={false} />
                        </div>
                    </span>
                </td>
            </tr>
        );
    }
}