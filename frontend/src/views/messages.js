import m from 'mithril';
import Api from '../api';
import utils from '../utils';

export default class MessagesView {
    constructor(vnode) {
        console.log('construct MessagesView');
        this.messages = [];
        this.message = '';
        this.selected_messages = '';

        Api.websocket.onmessage = (e) => {
            console.log('Received:', e.data);
            this.messages.push(e.data);
            m.redraw();
        }
        Api.websocket.onopen = (e) => {
            console.log('websocket open');
        }
        Api.websocket.onclose = (e) => {
            console.log('websocket close');
        }
    }

    send_message(message) {
        console.log('Sending message:', message);
        Api.websocket.send(message);
    }

    oninit(vnode) {
        Api.read_messages().then(res => {
            // TODO check if res is empty and display accordingly
            this.messages = res;
            this.selected_messages = Object.entries(this.messages)[0][0];
        }).catch(e => {
            console.log(e);
        });
    }

    switch_messages(selected_messages) {
        this.selected_messages = selected_messages;
    }

    view(vnode) {
        return (
            <div>
                <div class="flex my-8">
                    <div class="font-bold text-lg">
                        Messages
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="w-1/3 flex flex-col shadow">
                        {Object.entries(this.messages).map(([key, value]) => {
                            return (
                                <div key={key} class="py-2 px-4 hover:bg-yellow-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onclick={(e) => this.switch_messages(key)}>
                                    <div class="text-sm">
                                        <span class={this.selected_messages === key ? 'text-gray-600' : 'text-gray-400'}>
                                            {key}
                                        </span>
                                    </div>
                                    <div class="flex flex-col text-gray-800">
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
                    <div class="flex flex-col w-full ml-8 rounded">
                        <div class="flex flex-col">
                            {Object.entries(this.messages).length > 0 ? this.messages[this.selected_messages].map(msg => {
                                console.log(Api.get_session().uuid)
                                const is_own_message = msg.src_user_uuid === Api.get_session().uuid;
                                return (
                                    <div key={msg.uuid} class={'w-1/2 py-2 px-3 my-2 rounded ' + (is_own_message ? 'self-end bg-yellow-50' : 'bg-gray-50')}>
                                        <div class="text-xs">
                                            from - to, {utils.relative_date(msg.created_at)}
                                        </div>
                                        <div>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div>
                                    No messages {this.messages.length}
                                </div>
                            )}
                        </div>
                        <div class="flex mt-6">
                            <input type="text" placeholder="Message..." class="bg-gray-100 rounded-sm"
                                value={this.message}
                                oninput={(e) => this.message = e.target.value }/>
                            <button class="ml-2"
                                onclick={(e) => this.send_message(this.message)}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}