import m from 'mithril';
import Api from '../Api';
import Notifications from './Notifications';
import Logo from './Logo';
import Icon from './Icon';

export default class Header {
    constructor(vnode) {
        this.auth = vnode.attrs.auth !== undefined ? vnode.attrs.auth : true;
        console.log('construct Header', this.auth);
    }

    view(vnode) {
        if (!this.auth) {
            return (
                <div class="w-full flex flex-row justify-between items-center py-4 px-8 border-b border-gray-100">
                    <div class="flex items-baseline">
                        <button class="flex items-center whitespace-nowrap"
                            onclick={() => m.route.set('/')}>
                            <Logo />
                        </button>
                    </div>
                    <button class="flex flex-col items-center self-end px-4 py-1 whitespace-nowrap rounded transitions-colors
                        text-gray-800 hover:text-black border border-gray-500 hover:border-gray-600 hover:shadow"
                        onclick={(e) => m.route.set('/auth/signup')}>
                        <div class="flex items-center">
                            <Icon name="user-plus" class="w-5" />
                            <span class="ml-4">
                                Sign up as a shipper!
                            </span>
                        </div>
                    </button>
                </div>
            );
        }

        return (
            <div class="w-full flex flex-row justify-between items-center py-4 px-8 border-b border-gray-100">
                <div class="flex items-baseline">
                    <button class="flex items-center whitespace-nowrap"
                        onclick={() => m.route.set('/')}>
                        <Logo />
                    </button>
                </div>
                <button onclick={() => {
                    Api.signout().finally(() => {
                        Api.clear_storage();
                        m.route.set('/auth/login');
                    });
                }}>
                    sign out
                </button>
                <Notifications />
            </div>
        );
    }
}