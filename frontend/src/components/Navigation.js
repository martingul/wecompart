import m from 'mithril';
import Icon from './Icon';
import Logo from './Logo';

export default class Navigation {
    static views = [
        {name: 'Home', icon: 'command', navigate: () => m.route.set('/')},
        {name: 'Shipments', icon: 'package', navigate: () => m.route.set('/shipments')},
        {name: 'Messages', icon: 'message-circle', navigate: () => {}},
    ];
    static selected_view = Navigation.views[0];

    constructor(vnode) {
        console.log('construct Navigation');
    }

    view(vnode) {
        return (
            <div class="flex flex-col bg-gray-50 border-r border-gray-100 h-full">
                <div class="flex items-baseline py-4 px-8">
                    <button class="flex items-center whitespace-nowrap"
                        onclick={() => m.route.set('/auth/signup')}>
                        <Logo />
                    </button>
                </div>
                {Navigation.views.map(v => (
                    <button class={'flex items-center w-full px-6 py-2 my-2 hover:text-black transition-colors '
                        + (Navigation.selected_view === v ? 'bg-yellow-100 text-black border-l-4 border-yellow-300' : 'text-gray-500 hover:bg-yellow-50')}
                        onclick={() => {
                            v.navigate();
                            Navigation.selected_view = v;
                        }}>
                        <Icon name={v.icon} class="w-5" />
                        <span class="ml-6">
                            {v.name}
                        </span>
                    </button>
                ))}
            </div>
        );
    }
}