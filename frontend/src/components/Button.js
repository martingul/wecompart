import m from 'mithril';

export default class Button {
    constructor(vnode) {
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};
        this.active = vnode.attrs.active !== undefined ? vnode.attrs.active : true;
    }

    view(vnode) {
        return (
            <button type="button" class={`h-8 px-2 flex items-center justify-center
                box-border whitespace-nowrap font-semibold hover:shadow transition-all
                ${this.active ? 'text-white bg-blue-500 hover:bg-blue-600'
                            : 'border border-gray-300 hover:border-gray-300 text-gray-800 bg-white hover:text-black'}`}
                onclick={this.callback}>
                <div class="flex items-center">
                    {vnode.children}
                </div>
            </button>
        );
    }
}