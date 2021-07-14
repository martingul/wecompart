import m from 'mithril';
import Utils from '../Utils';

export default class MoneyText {
    constructor(vnode) {
        this.currency = vnode.attrs.currency;
    }

    view(vnode) {
        return (
            <div class="flex items-center font-normal">
                <span class="font-bold font-mono text-black text-lg">
                    {vnode.children}
                </span>
                <span class="ml-2 uppercase text-gray-400">
                    {this.currency}
                </span>
            </div>

        );
    }
}