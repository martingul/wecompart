import m from 'mithril';
import Icon from './Icon';

export default class Button {
    constructor(vnode) {
        this.text = vnode.attrs.text;
        this.icon = vnode.attrs.icon;
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};
        this.active = vnode.attrs.active !== undefined ? vnode.attrs.active : true;
    }

    view(vnode) {
        return (
            <button class={`flex items-center py-1 px-2 rounded whitespace-nowrap font-bold hover:shadow transition-all
            + ${this.active ? 'text-white bg-indigo-500 hover:bg-indigo-600'
                            : 'border border-gray-300 hover:border-gray-400 text-gray-800 bg-white hover:text-black'}`}
                onclick={this.callback}>
                <Icon name={this.icon} class="w-5" />
                <span class="ml-2">
                    {this.text}
                </span>
            </button>
        );
    }
}