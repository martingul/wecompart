import m from 'mithril';

export default class ButtonLink {
    constructor(vnode) {
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};
        this.active = vnode.attrs.active !== undefined ? vnode.attrs.active : true;
    }

    view(vnode) {
        return (
            <button type="button" class={`inline-flex items-center whitespace-nowrap font-semibold transition-all
                ${this.active ? 'text-blue-600 hover:text-blue-700' : 'text-gray-800 hover:text-black'}`}
                onclick={this.callback}>
                <span class="flex items-center">
                    {vnode.children}
                </span>
            </button>
        );
    }
}