import m from 'mithril';
import Api from '../Api';
import IconButton from './IconButton';

export default class Notifications {
    constructor(vnode) {
        this.event_controller = new AbortController();
        this.notifications = [];
        this.show_dropdown = false;
        this.unread = false;

        Api.register_websocket_handler({
            name: 'new_notification_handler',
            fn: (e) => {
                const notification = JSON.parse(e.data);
                this.notifications.push(notification);
                this.unread = true;
                m.redraw();
            }
        });
    }

    toggle() {
        this.show_dropdown = !this.show_dropdown;
        this.unread = false;
    }

    oninit(vnode) {
        document.addEventListener('click', (e) => {
            const button = document.getElementById('notifications-button');
            const dropdown = document.getElementById('notifications-dropdown');
            if (button && dropdown) {
                if (!button.contains(e.target) || dropdown.contains(e.target)) {
                    this.show_dropdown = false;
                    m.redraw();
                }
            } else {
                this.event_controller.abort();
            }
        }, { signal: this.event_controller.signal });

        Api.read_notifications().then(res => {
            this.notifications = res;
            const notifications_unread = this.notifications.filter(n => !n.read);
            if (notifications_unread.length > 0) {
                this.unread = true;
            }
        }).catch(e => {
            console.log(e);
        });
    }

    view(vnode) {
        return (
            <div id="notifications-button" class="relative flex flex-col">
                <span class="relative inline-flex">
                    <IconButton icon="bell"
                        callback={() => this.toggle()} />
                    <span class={this.unread ? 'flex absolute h-2 w-2 top-0 right-0 mt-1 mr-1' : 'hidden'}>
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                </span>
                <div id="notifications-dropdown" class={this.show_dropdown ? 'block' : 'hidden'}>
                    <div class="absolute overflow-y-auto -ml-40 w-48 z-10 mt-1 shadow border border-gray-200 bg-white">
                        {this.notifications.map(n => {
                            if (n.type === 'new_quote') {
                                const quote = JSON.parse(n.content);
                                return (
                                    <div class="w-full cursor-pointer py-1 px-2 border-b last:border-b-0 hover:bg-gray-50 whitespace-nowrap overflow-hidden"
                                        onclick={(e) => {}}>
                                        New quote: {quote.price}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}