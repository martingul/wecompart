import m from 'mithril';
import Icon from './Icon';

export default class Button {
    constructor(vnode) {
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};
        this.icon = vnode.attrs.icon ? vnode.attrs.icon : null;
        this.active = vnode.attrs.active !== undefined ? vnode.attrs.active : true;
    }

    view(vnode) {
        if (!this.icon) {
            return (
                <button class={`flex items-center justify-center py-1 px-2 rounded whitespace-nowrap font-bold hover:shadow transition-all
                + ${this.active ? 'text-white bg-indigo-500 hover:bg-indigo-600'
                                : 'border border-gray-300 hover:border-gray-300 text-gray-800 bg-white hover:text-black'}`}
                    onclick={this.callback}>
                    <span>
                        {vnode.children}
                    </span>
                </button>
            );
        }
        
        return (
            <button class={`flex items-center justify-center py-1 px-2 rounded whitespace-nowrap font-bold hover:shadow transition-all
            + ${this.active ? 'text-white bg-indigo-500 hover:bg-indigo-600'
                            : 'border border-gray-300 hover:border-gray-400 text-gray-800 bg-white hover:text-black'}`}
                onclick={this.callback}>
                <Icon name={this.icon} class="w-5" />
                <span class="ml-2">
                    {vnode.children}
                </span>
            </button>
        );
    }
}