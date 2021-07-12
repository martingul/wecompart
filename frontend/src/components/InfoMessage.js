import m from 'mithril';
import Icon from './Icon';

export default class InfoMessage {
    constructor(vnode) {

    }

    view(vnode) {
        return (
            <div class="flex items-center my-6 p-2 shadow rounded border border-gray-200 text-gray-500">
                <Icon name="info" class="w-5 ml-2" />
                <span class="ml-4">
                    {vnode.children}
                </span>
            </div>
        );
    }
}