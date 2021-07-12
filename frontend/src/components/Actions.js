import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';
import IconButton from './IconButton';

export default class Actions {
    constructor(vnode) {
        this.actions = vnode.attrs.actions;
        this.event_controller = new AbortController();
        this.id = Utils.generate_key();
        this.show_dropdown = false;
    }

    toggle() {
        this.show_dropdown = !this.show_dropdown;
    }

    handle_action(action) {
        console.log(action);
        this.actions.filter(a => a.name === action.name)[0].callback();
    }

    oninit(vnode) {
        document.addEventListener('click', (e) => {
            const button = document.getElementById(`actions-${this.id}-button`);
            const dropdown = document.getElementById(`actions-${this.id}-dropdown`);
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
            <div id={`actions-${this.id}-button`} class="relative flex flex-col">
                <IconButton icon="more-horizontal" callback={() => this.toggle()} />
                <div id={`actions-${this.id}-dropdown`} class={this.show_dropdown ? 'block' : 'hidden'}>
                    <div class="absolute overflow-y-auto -ml-32 w-44 z-10 shadow border border-gray-100 bg-white">
                        {this.actions.map(action => (
                            <div class="flex items-center w-full cursor-pointer py-1 px-4 whitespace-nowrap overflow-hidden
                                text-gray-800 hover:text-indigo-800 hover:bg-indigo-50"
                                onclick={() => this.handle_action(action)}>
                                <Icon name={action.icon} class="w-4" />
                                <span class="ml-3">
                                    {action.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}