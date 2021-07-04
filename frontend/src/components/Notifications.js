import m from 'mithril';
import Api from '../Api';
import Icon from './Icon';

export default class Notifications {
    constructor(vnode) {
        this.event_controller = new AbortController();
        this.notifications = ['foobarfoo', 'barfoobar'];
        this.show_dropdown = false;
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
    }

    view(vnode) {
        return (
            <div id="notifications-button" class="relative flex flex-col">
                <button class="flex items-center px-2 py-1 rounded-full transition-colors
                    text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-200"
                    onclick={(e) => this.toggle()}>
                    <Icon name="bell" class="w-5" />
                </button>
                <div id="notifications-dropdown" class={this.show_dropdown ? 'block' : 'hidden'}>
                    <div class="absolute overflow-y-auto -ml-32 w-40 z-10 mt-1 shadow border border-gray-200 bg-white">
                        {this.notifications.map(value => (
                            <div class="w-full cursor-pointer py-1 px-2 border-b last:border-b-0 hover:bg-gray-100 whitespace-nowrap overflow-hidden"
                                onclick={(e) => {}}>
                                {value}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}