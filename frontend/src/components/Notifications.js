import m from 'mithril';
import Api from '../Api';
import Utils from '../Utils';
import Loading from './Loading';
import Icon from './Icon';
import IconButton from './IconButton';
import Badge from './Badge';
import Notification from '../models/Notification';
import NotificationStorage from '../models/NotificationStorage';

export default class Notifications {
    constructor(vnode) {
        this.event_controller = new AbortController();
        this.show_dropdown = false;
        this.loading = false;

        Api.register_websocket_handler({
            name: 'new_notification_handler',
            fn: (e) => {
                const notification = JSON.parse(e.data);
                NotificationStorage.add(new Notification(notification));
                m.redraw();
            }
        });
    }

    toggle() {
        this.show_dropdown = !this.show_dropdown;
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

        if (!NotificationStorage.fetched) {
            this.loading = true;
            Api.read_notifications().then(res => {
                if (res === null) {
                    NotificationStorage.notifications = [];
                } else {
                    NotificationStorage.notifications = res;
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                this.loading = false;
                NotificationStorage.fetched = true;
            });
        }
    }

    view(vnode) {
        return (
            <div id="notifications-button" class="relative flex flex-col">
                <span class="relative inline-flex">
                    <IconButton icon="bell" callback={() => this.toggle()} />
                    <span class={NotificationStorage.has_unread() ? 'flex absolute h-2 w-2 top-0 right-0 mt-1 mr-1' : 'hidden'}>
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                </span>
                <div id="notifications-dropdown" class={this.show_dropdown ? 'block' : 'hidden'}>
                    <div class="absolute overflow-y-auto transform -translate-x-full ml-6 z-10 mt-1 rounded shadow-md border border-gray-100 bg-white">
                        <div class="flex items-center justify-between py-2 w-full border-b border-gray-200">
                            <span class="px-4 font-bold text-black">
                                Notifications
                            </span>
                            <button class={`px-4 text-sm font-bold whitespace-nowrap
                                ${NotificationStorage.has_unread() ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-500 cursor-not-allowed'}`}
                                onclick={() => {
                                    NotificationStorage.get_unread().forEach(n => {
                                        n.read = true;
                                        // TODO batch into single request
                                        Api.update_notification({
                                            notification_id: n.uuid,
                                            patch: {
                                                read: true
                                            }
                                        }).then(res => {
                                            console.log(res);
                                        }).catch(e => {
                                            console.log(e);
                                            n.read = false;
                                        });
                                    });
                                }}>
                                <span>
                                    Mark all as read
                                </span>
                            </button>
                        </div>
                        <div class={this.loading ? 'py-4 flex items-center justify-center' : 'hidden'}>
                            <Loading class="w-8" />
                        </div>
                        <div class={(!this.loading && NotificationStorage.notifications.length === 0) ? 'flex' : 'hidden'}>
                            <div class="py-4 w-full flex items-center justify-center">
                                <Icon name="check-circle" class="w-5 text-green-600" />
                                <span class="ml-4 mb-0.5 text-gray-600">
                                    You are all caught up.
                                </span>
                            </div>
                        </div>
                        {NotificationStorage.notifications.map(n => {
                            if (n.type === 'new_quote') {
                                const quote = JSON.parse(n.content);
                                return (
                                    <div class={`w-full py-2 px-4 text-gray-600 border-b last:border-b-0 hover:bg-gray-50 whitespace-nowrap cursor-pointer
                                        ${!n.read ? 'bg-yellow-50' : ''}`}
                                        onclick={() => {
                                            if (!n.read) {
                                                n.read = true;
                                                Api.update_notification({
                                                    notification_id: n.uuid,
                                                    patch: {
                                                        read: true
                                                    }
                                                }).then(res => {
                                                    console.log(res);
                                                }).catch(e => {
                                                    console.log(e);
                                                    n.read = false;
                                                });
                                            }
                                            m.route.set('/shipments/:id', {id: quote.shipment_uuid});
                                        }}>
                                        <div class="w-full flex justify-between items-start">
                                            <div class="flex flex-col items-start">
                                                <span class="mb-1">
                                                    A shipper placed a bid on your shipment.
                                                </span>
                                                <Badge color="gray">
                                                    Bid: 12
                                                </Badge>
                                            </div>
                                            <div class="ml-4 flex flex-col items-start">
                                                <span class="text-xs text-gray-400">
                                                    {Utils.relative_date(quote.created_at)}
                                                </span>
                                            </div>
                                        </div>
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