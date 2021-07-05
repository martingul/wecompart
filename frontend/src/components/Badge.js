import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';

export default class Badge {
    constructor(vnode) {
        this.icon = vnode.attrs.icon;
        this.color = vnode.attrs.color;
    }

    view(vnode) {
        if (this.icon) {
            return (
                <div class={`flex items-center px-2 rounded text-sm text-center font-bold
                    bg-${this.color}-100 text-${this.color}-500`}>
                    <Icon name={this.icon} class={this.icon ? 'w-4 mr-1.5' : 'hidden'} />
                    <span>
                        {vnode.children}
                    </span>
                </div>
            );
        }
        return (
            <span class={`px-2 rounded text-sm text-center font-bold 
                bg-${this.color}-100 text-${this.color}-500`}>
                {vnode.children}
            </span>
        );
    }
}