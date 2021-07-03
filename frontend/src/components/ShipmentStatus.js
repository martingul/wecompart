import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';

export default class ShipmentStatus {
    constructor(vnode) {
        this.icon = vnode.attrs.icon !== undefined ? vnode.attrs.icon : false;
        this.statuses = [
            {name: 'draft', color: 'gray'},
            {name: 'pending', color: 'yellow', icon: 'clock'},
            {name: 'ready', color: 'green'},
        ];
        console.log(this.statuses.filter(s => s.name === vnode.attrs.status))
        this.status = this.statuses.filter(s => s.name === vnode.attrs.status)[0];
    }

    view(vnode) {
        return (
            <div class={`flex items-center px-2 rounded text-sm text-center font-bold
                bg-${this.status.color}-100 text-${this.status.color}-500`}>
                <Icon name={this.status.icon} class={this.icon ? 'w-4 mr-1.5' : 'hidden'} />
                <span>
                    {Utils.capitalize(this.status.name)}
                </span>
            </div>
        );
    }
}