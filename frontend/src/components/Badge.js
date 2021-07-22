import m from 'mithril';
import Icon from './Icon';

export default class Badge {
    constructor(vnode) {
        this.icon = vnode.attrs.icon;
        this.color = vnode.attrs.color;
    }

    view(vnode) {
        return (
            <div class={`px-1.5 rounded text-sm text-center font-semibold
                ${this.icon ? 'flex items-center' : 'py-0.5'}
                bg-${this.color}-100 text-${this.color}-500`}>
                {this.icon ? (
                    <Icon name={this.icon} class={this.icon ? 'w-4 mr-1.5' : 'hidden'} />
                ) : ''}
                <span>
                    {vnode.children}
                </span>
            </div>
        );
    }
}