import m from 'mithril';
import Api from '../Api';
import Notifications from './Notifications';
import Icon from './Icon';
import Logo from './Logo';
import SearchInput from './SearchInput';
import User from '../models/User';

export default class Header {
    constructor(vnode) {
        this.user = User.load();
        console.log('construct Header');
    }

    view(vnode) {
        if (!this.user) {
            return (
                <div class="w-full flex justify-between items-center py-4 px-8 border-b border-gray-100">
                    <button class="flex items-center whitespace-nowrap"
                        onclick={() => m.route.set('/auth/signup')}>
                        <Logo />
                    </button>
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
            <div class="w-full flex justify-between items-center py-4 px-8 border-b border-gray-100">
                <div class="w-full mr-12">
                    <SearchInput />
                </div>
                <Notifications />
            </div>
        );
    }
}