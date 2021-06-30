import m from 'mithril';
import Icon from '../components/Icon';
import Api from '../Api';

export default class LayoutView {
    constructor(vnode) {
        console.log('construct LayoutView');

        this.is_shipper = false;
        this.show_user_dropdown = false;
        this.show_notifications_dropdown = false;
        this.username = Api.get_username();

        this.notifications = [];

        Api.read_notifications().then(res => {
            console.log(res);
            this.notifications = res.map(n => n.uuid);
        }).catch(e => {
            console.log(e);
        })

        Api.websocket.onmessage = (e) => {
            const notification = JSON.parse(e.data);
            notification.content = JSON.parse(notification.content);
            console.log(notification);
            // TODO display notificiation according to its type

            m.redraw();
        }

        Api.websocket.onopen = (e) => {
            console.log('websocket open');
        }
        
        Api.websocket.onclose = (e) => {
            console.log('websocket close');
        }
    }

    handle_action_dropdown(action) {
        console.log('action:', action);
        if (action === 'sign out') {
            Api.signout().finally(() => {
                Api.clear_storage();
                m.route.set('/auth/login');
            });
        }

        if (action === 'messages') {
            m.route.set('/messages');
        }
    }

    view(vnode) {
        return (
            <div class="flex flex-col items-center">
                <div class="w-full px-4 md:w-4/5 lg:w-1/2">
                    <div class="flex flex-row justify-between py-2 -mx-6 px-6">
                        <div class="flex items-baseline">
                            <button class="flex items-center whitespace-nowrap text-xl font-bold"
                                onclick={() => m.route.set('/shipments')}>
                                wecompart &trade;
                            </button>
                            {/* <div>
                                <button class="mx-8 text-gray-600 border-b border-gray-500 border-dotted"
                                    onclick={() => m.route.set('/shipments')}>
                                    shipments
                                </button>
                            </div> */}
                        </div>
                        <div class="flex">
                            <div class={this.is_shipper ? 'block' : 'hidden'}>
                                <button class="text-yellow-700 border-b border-dotted border-yellow-700"
                                    onclick={() => m.route.set('/auth/signup')}>
                                    Sign up as a shipper!
                                </button>
                            </div>
                            <div class={!this.is_shipper ? 'flex' : 'hidden'}>
                                <div class="relative flex flex-col">
                                    <button class="flex items-center px-1 text-gray-600 border-b border-gray-500 border-dotted"
                                        onclick={(e) => this.show_user_dropdown = !this.show_user_dropdown}>
                                        <Icon name="user" class="w-4" />
                                        {/* <div class="ml-1">
                                            account
                                        </div> */}
                                    </button>
                                    <div class={this.show_user_dropdown ? 'block' : 'hidden'}>
                                        {/* <Dropdown fullwidth={false} values={[`Signed in as ${this.username}`,'Profile', 'Messages', 'Sign out']}
                                            callback={(v) => this.handle_action_dropdown(v.toLowerCase())} /> */}
                                    </div>
                                </div>
                                <div class="relative flex flex-col">
                                    <button class="flex items-center px-1 ml-6 text-gray-600 border-b border-gray-500 border-dotted"
                                        onclick={(e) => this.show_notifications_dropdown = !this.show_notifications_dropdown}>
                                        <Icon name="bell" class="w-4" />
                                        {/* <div class="ml-1 flex items-start">
                                            alerts */}
                                            {/* <pre class="ml-1 text-xs text-white bg-red-400 opacity-80 rounded-full w-4 h-4 text-center align-middle">
                                                1
                                            </pre> */}
                                        {/* </div> */}
                                    </button>
                                    <div class={this.show_notifications_dropdown ? 'block' : 'hidden'}>
                                        {/* <Dropdown fullwidth={false} values={this.notifications}
                                            callback={(v) => this.handle_action_dropdown(v.toLowerCase())} /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="my-4">
                        {vnode.children}
                    </div>
                    <div class="flex flex-col my-8 text-center text-sm">
                        <span class="mt-4 text-gray-500">
                            <button class="focus:outline-none hover:text-gray-600">
                                © Wecompart
                            </button>
                            <span class="mx-2">·</span>
                            <button class="focus:outline-none hover:text-gray-600">
                                Privacy & Terms
                            </button>
                            <span class="mx-2">·</span>
                            <button class="focus:outline-none hover:text-gray-700">
                                Contact
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}