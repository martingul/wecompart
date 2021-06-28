import m from 'mithril';
import Notifications from './Notifications';

export default class Header {
    constructor(vnode) {
        console.log('construct Header');
    }

    view(vnode) {
        return (
            <div class="flex flex-row justify-between py-2 px-8 my-4">
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