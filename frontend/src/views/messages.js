import m from 'mithril';
import Api from '../api';
import utils from '../utils';
import Icon from '../components/icon';
import Loading from '../components/loading';

export default class MessagesView {
    constructor(vnode) {
        console.log('construct MessagesView');
        this.messages = [];
        this.message = '';
        this.selected_messages = '';
        this.loading = false;
        this.user_uuid = Api.get_session().uuid;

        Api.websocket.onmessage = (e) => {
            const notification = JSON.parse(e.data);
            if (notification.type === 'new_message') {
                const message = JSON.parse(notification.content);

                let target = '';
                if (message.src_user_uuid !== this.user_uuid) {
                    target = message.src_user_uuid
                } else {
                    target = message.dst_user_uuid
                }

                this.messages[target].push(message);
            }

            m.redraw();
            // TODO scroll to new bottom if user is already at bottom otherwise indicate new message
        }
    }

    send_message(message) {
        console.log('Sending message:', message);
        // Api.websocket.send(message);

        const message_payload = {
            dst_user_uuid: this.selected_messages,
            content: message
        };

        Api.create_message({ message: message_payload }).then(res => {
            // maybe append to messages when user gets new_message event
            const message = res;
            this.messages[this.selected_messages].push(message);
            this.message = '';
            // TODO scroll to new bottom if user is already at bottom otherwise indicate new message
        }).catch(e => {
            console.log(e);
        });
    }

    switch_messages(selected_messages) {
        this.selected_messages = selected_messages;
    }

    oninit(vnode) {
        this.loading = true;
        Api.read_messages().then(res => {
            // TODO check if res is empty and display accordingly
            this.messages = res;
            this.selected_messages = Object.entries(this.messages)[0][0];
            // TODO scroll to bottom of messages
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            this.loading = false;
        });
    }

    view(vnode) {
        const message_entries = Object.entries(this.messages);

        if (message_entries.length === 0 && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }

        if (message_entries.length === 0 && !this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-2 flex flex-col items-center">
                        <div class="my-4 text-gray-200">
                            <Icon name="wind" class="w-12 h-12" />
                        </div>
                        <div class="my-1 text-gray-600">
                            No messages yet.
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div class="flex items-start text-gray-800">
                    <div class="w-1/3 flex flex-col shadow">
                        <div class="py-2 flex flex-col items-center font-bold border-b border-gray-100">
                            Conversations
                        </div>
                        {message_entries.map(([key, value]) => {
                            return (
                                <div key={key} class="py-2 px-4 hover:bg-yellow-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onclick={(e) => this.switch_messages(key)}>
                                    <div class="text-sm">
                                        <span class={this.selected_messages === key ? 'text-gray-600' : 'text-gray-400'}>
                                            {key}
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <div class="py-1 whitespace-nowrap overflow-ellipsis overflow-hidden">
                                            <span class={this.selected_messages === key ? 'text-gray-700' : 'text-gray-500'}>
                                                {value[0].content}
                                            </span>
                                        </div>
                                        <div class="self-end">
                                            <span class={this.selected_messages === key ? 'text-gray-600' : 'text-gray-400'}>
                                                {utils.relative_date(value[0].created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div class="flex flex-col w-full ml-8 max-h-96 overflow-hidden">
                        <div class="mb-6 flex flex-col items-center">
                            <div class="text-lg">
                                {this.selected_messages}
                            </div>
                        </div>
                        <div class="flex flex-col max-h-full overflow-y-auto">
                            {message_entries.length > 0 ? this.messages[this.selected_messages].map(msg => {
                                const is_own_message = msg.src_user_uuid === this.user_uuid;
                                return (
                                    <div id={msg.uuid} key={msg.uuid} class={'w-1/2 py-2 px-3 my-2 rounded ' + (is_own_message ? 'self-end bg-yellow-50' : 'bg-gray-50')}>
                                        <div class="text-xs">
                                            from ..., {utils.relative_date(msg.created_at)}
                                        </div>
                                        <div>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div>
                                    No messages {message_entries.length}
                                </div>
                            )}
                        </div>
                        <div class="flex mt-6">
                            <input type="text" placeholder="Message..." class="bg-gray-100 focus:bg-gray-50 transition-colors rounded"
                                value={this.message}
                                oninput={(e) => this.message = e.target.value }/>
                            <button class="flex items-center ml-2 bg-green-50 px-3 rounded"
                                onclick={(e) => this.send_message(this.message)}>
                                    <Icon class="w-4 text-gray-800" name="send" />
                                <span class="ml-3">
                                    Send
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}