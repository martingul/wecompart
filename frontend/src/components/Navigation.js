import m from 'mithril';
import Icon from './Icon';
import Activity from './Activity';
// import ShipmentList from './ShipmentList';
import ShipmentsView from '../views/Shipments';

export default class Navigation {
    static views = [
        {name: 'Home', icon: 'command', view: Activity},
        {name: 'Shipments', icon: 'package', view: ShipmentsView}
    ];
    static default_view = Navigation.views[1];

    constructor(vnode) {
        console.log('construct Navigation');
        this.navigate = vnode.attrs.navigate;
        this.selected = Navigation.default_view;
    }

    oninit(vnode) {
        this.navigate(this.selected);
   }

    view(vnode) {
        return (
            <div class="flex flex-col">
                {Navigation.views.map(v => (
                    <button class={'flex items-center w-full px-6 py-2 my-2 rounded hover:text-black transition-colors '
                        + (this.selected === v ? 'bg-yellow-100 text-black' : 'text-gray-500 hover:bg-yellow-50')}
                        onclick={() => { this.navigate(v); this.selected = v;}}>
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