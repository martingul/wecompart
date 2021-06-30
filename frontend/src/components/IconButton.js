import m from 'mithril';
import Icon from './Icon';

export default class IconButton {
    constructor(vnode) {
        this.class = vnode.attrs.class ? vnode.attrs.class : '';
        this.color = vnode.attrs.color ? vnode.attrs.color : 'gray';
        this.width = vnode.attrs.width ? vnode.attrs.width : '5';
        this.icon = vnode.attrs.icon;
        this.callback = vnode.attrs.callback;
    }

    view(vnode) {
        return (
            <button class={`flex items-center px-2 py-1 rounded-full transition-colors
                text-${this.color}-600 hover:text-${this.color}-800 bg-${this.color}-50 hover:bg-${this.color}-200 
                ${this.class}`}
                onclick={(e) => this.callback()}>
                <Icon name={this.icon} class={`w-${this.width}`} />
            </button>
        );
    }
}