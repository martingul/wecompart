import m from 'mithril';

export default class ButtonLink {
    constructor(vnode) {
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};
    }

    view(vnode) {
        return (
            <button type="button" class="inline-flex items-center py-1 whitespace-nowrap font-semibold transition-all
                text-blue-600 hover:text-blue-700"
                onclick={this.callback}>
                <span class="flex items-center">
                    {vnode.children}
                </span>
            </button>
        );
    }
}