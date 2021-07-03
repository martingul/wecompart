import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';

export default class ShipmentStatus {
    constructor(vnode) {
        this.status_map = {
            'draft': {color: 'gray'},
            'pending': {color: 'yellow', icon: 'clock'},
            'ready': {color: 'green'},
        };
        this.icon = vnode.attrs.icon !== undefined ? vnode.attrs.icon : false;
        this.status_name = vnode.attrs.status;
        this.status = this.status_map[this.status_name];
    }

    view(vnode) {
        return (
            <div class={`flex items-center px-2 rounded text-sm text-center font-bold
                bg-${this.status.color}-100 text-${this.status.color}-500`}>
                <Icon name={this.status.icon} class={this.icon ? 'w-4 mr-1.5' : 'hidden'} />
                <span>
                    {Utils.capitalize(this.status_name)}
                </span>
            </div>
        );
    }
}