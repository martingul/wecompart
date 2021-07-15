import m from 'mithril';

export default class MoneyText {
    constructor(vnode) {
        this.currency = vnode.attrs.currency;
    }

    view(vnode) {
        return (
            <span class="inline-flex items-baseline font-normal">
                <span class="mr-1.5 uppercase text-gray-400 text-sm">
                    {this.currency}
                </span>
                <span class="font-mono text-black text-lg">
                    {vnode.children}
                </span>
            </span>
        );
    }
}