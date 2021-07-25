import m from 'mithril';

export default class Button {
    constructor(vnode) {
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};
        this.active = vnode.attrs.active !== undefined ? vnode.attrs.active : true;
    }

    view(vnode) {
        return (
            <button type="button" class={`h-8 flex items-center justify-center py-1 px-2 whitespace-nowrap font-semibold hover:shadow transition-all
                ${this.active ? 'text-white bg-blue-600 hover:bg-blue-700'
                            : 'border border-gray-300 hover:border-gray-300 text-gray-800 bg-white hover:text-black'}`}
                onclick={this.callback}>
                <span class="flex items-center">
                    {vnode.children}
                </span>
            </button>
        );
    }
}