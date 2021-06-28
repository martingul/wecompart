import m from 'mithril';

export default class SwitchInput {
    constructor(vnode) {
        this.model = vnode.attrs.bind;
        this.on = vnode.attrs.on;
        this.off = vnode.attrs.off;
    }
    
    view(vnode) {
        return (
            <div class="flex items-center w-full">
                <button class={this.model.value === this.on
                    ? 'border-b border-dotted border-gray-800 text-gray-800 font-bold'
                    : 'border-b border-dotted border-white text-gray-600'}
                    onclick={() => this.model.value = this.on}>
                    {this.on}
                </button>
                <button class={this.model.value === this.off
                    ? 'ml-6 border-b border-dotted border-gray-800 text-gray-800 font-bold'
                    : 'ml-6 border-b border-dotted border-white text-gray-600'}
                    onclick={() => this.model.value = this.off}>
                    {this.off}
                </button>
            </div>
        );
    }
}