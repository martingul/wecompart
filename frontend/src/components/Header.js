import m from 'mithril';
import Notifications from './Notifications';

export default class Header {
    constructor(vnode) {
        console.log('construct Header');
    }

    view(vnode) {
        return (
            <div class="flex flex-row justify-between items-center py-4 px-8 border-b border-gray-100">
                <div class="flex items-baseline">
                    <button class="flex items-center whitespace-nowrap text-xl font-bold"
                        onclick={() => m.route.set('/')}>
                        wecompart &trade;
                    </button>
                </div>
                <Notifications />
            </div>
        );
    }
}