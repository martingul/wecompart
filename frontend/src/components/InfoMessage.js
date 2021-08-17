import m from 'mithril';
import Icon from './Icon';

export default class InfoMessage {
    constructor(vnode) {
        this.class = vnode.attrs.class ? vnode.attrs.class : '';
    }

    view(vnode) {
        return (
            <div class={`flex items-center p-2 border
                border-gray-300 text-gray-700 ${this.class}`}>
                <Icon name="info" class="w-5 ml-2" />
                <span class="ml-4">
                    {vnode.children}
                </span>
            </div>
        );
    }
}