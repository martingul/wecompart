import m from 'mithril';
import Icon from './Icon';
import Loading from './Loading';

export default class Button {
    constructor(vnode) {
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};
        this.icon = vnode.attrs.icon ? vnode.attrs.icon : null;
        this.active = vnode.attrs.active !== undefined ? vnode.attrs.active : true;
        this.loading = vnode.attrs.loading ? vnode.attrs.loading : null;
    }

    view(vnode) {
        return (
            <button type="button" class={`h-8 flex items-center justify-center py-1 px-2 rounded whitespace-nowrap font-bold hover:shadow transition-all
            + ${this.active ? 'text-white bg-indigo-500 hover:bg-indigo-600'
                            : 'border border-gray-300 hover:border-gray-300 text-gray-800 bg-white hover:text-black'}`}
                onclick={this.callback}>
                <div class="flex items-center">
                    {(this.icon && ((this.loading && !this.loading()) || !this.loading)) ? <Icon name={this.icon} class="w-5 mr-2" /> : ''}
                    {(this.loading && this.loading()) ? <Loading color="light" class={`w-8 ${!this.icon ? 'ml-1' : ''}`} /> : ''}
                    <span class="flex items-center">
                        {vnode.children}
                    </span>
                </div>
            </button>
        );
    }
}