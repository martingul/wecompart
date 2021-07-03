import m from 'mithril';
import Api from '../Api';
import Icon from './Icon';
import Logo from './Logo';

export default class Navigation {
    static views = [
        {name: 'Home', icon: 'command', navigate: () => m.route.set('/')},
        {name: 'Shipments', icon: 'package', navigate: () => m.route.set('/shipments')},
        {name: 'Messages', icon: 'message-circle', navigate: () => {}},
        {name: 'Sign out', icon: 'log-out', navigate: () => {
            Api.signout().finally(() => {
                localStorage.clear();
                m.route.set('/auth/login');
            });
        }},
    ];
    static selected_view = Navigation.views[0];
    static show = true;

    constructor(vnode) {
        console.log('construct Navigation');
        this.path = m.route.get().split('/');
        if (this.path.length > 0) {
            this.path = this.path.slice(1);
        }

        // TODO make a map instead of if statements to match

        if (this.path[0] === '') {
            Navigation.selected_view = Navigation.views[0];
        }

        if (this.path[0] === 'shipments') {
            Navigation.selected_view = Navigation.views[1];
        }
    }

    view(vnode) {
        if (!Navigation.show) {
            return;
        }
        
        return (
            <div class="flex flex-col bg-gray-50 border-r border-gray-100 h-full">
                <div class="flex items-baseline py-6 px-8">
                    <button class="flex items-center whitespace-nowrap"
                        onclick={() => m.route.set('/')}>
                        <Logo />
                    </button>
                </div>
                {Navigation.views.map(v => (
                    <button class={'flex items-center w-full px-6 py-2 my-0.5 transition-all '
                        + (Navigation.selected_view === v ? 'text-indigo-600 font-bold' : 'text-gray-600 hover:text-black')}
                        onclick={() => {
                            v.navigate();
                            Navigation.selected_view = v;
                        }}>
                        <Icon name={v.icon} class="w-5" />
                        <span class="ml-3">
                            {v.name}
                        </span>
                    </button>
                ))}
            </div>
        );
    }
}