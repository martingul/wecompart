import m from 'mithril';
import Icon from './Icon';
import SwitchInput from './SwitchInput';
import IconButton from './IconButton';

export default class ItemEdit {
    constructor(vnode) {
        console.log('construct ItemEdit');
        this.item = vnode.attrs.item;
        this.delete = vnode.attrs.delete;
    }

    view(vnode) {
        return (
            <div id={`item-${this.item.key}`}
                class={'flex flex-col my-2 px-4 py-2 rounded-sm border border-gray-200 text-gray-800'
                    + (this.item.delete ? ' bg-red-50' : '')}>
                <div class="flex flex-row items-center mb-1">
                    <div class="w-full">
                        <span>
                            Item
                        </span>
                        <span class="ml-2 font-bold" id={`item-index-${this.item.key}`}>
                            {this.item.index + 1}
                        </span>
                        <span class='text-gray-500 ml-1'>
                            {this.item.uuid}
                        </span>
                    </div>
                    <div class="flex items-center align-middle justify-between select-none whitespace-nowrap">
                        <SwitchInput bind={this.item.dim_unit} on="cm" off="in" />
                        <div class={this.item.delete ? 'block' : 'hidden'}>
                            <button class="flex item-center justify-center ml-8 px-4 py-1 rounded text-red-800 hover:bg-red-100 transition-colors"
                                onclick={() => this.delete(this.item.index)}>
                                <Icon name="rotate-ccw" class="w-4" />
                                <span class="ml-2">
                                    undo
                                </span>
                            </button>
                        </div>
                        <div class={!this.item.delete ? 'block' : 'hidden'}>
                            <IconButton class="ml-8" icon="x" width="4" color="red"
                                callback={() => this.delete(this.item.index)} />
                        </div>
                    </div>
                </div>
                <div class="flex flex-row my-2">
                    <div class="flex flex-col w-3/4">
                        <label class="mb-0.5" for={`item-description-${this.item.key}`}>
                            Description
                        </label>
                        <input id={`item-description-${this.item.key}`} type="text" placeholder="e.g. 1 table, 2 paintings..."
                            oninput={(e) => this.item.description = e.target.value} value={this.item.description} />
                    </div>
                    <div class="flex flex-col w-1/4 ml-2">
                        <label class="mb-0.5" for={`item-quantity-${this.item.key}`}>
                            Qty.
                        </label>
                        <input id={`item-quantity-${this.item.key}`} type="number" min="1" step="any"
                            oninput={(e) => this.item.quantity = e.target.value} value={this.item.quantity} />
                    </div>
                </div>
                <div class="flex flex-row my-2">
                    <div class="w-3/4 flex flex-row">
                        <div class="flex flex-col w-full">
                            <label class="mb-0.5" for={`item-length-${this.item.key}`}>
                                Length <span class="text-gray-500">({this.item.dim_unit.value})</span>
                            </label>
                            <input id={`item-length-${this.item.key}`} type="number" min="0" step="any" value={this.item.length}
                                oninput={(e) => this.item.length = e.target.value} />
                        </div>
                        <div class="flex flex-col w-full ml-2">
                            <label class="mb-0.5" for={`item-width-${this.item.key}`}>
                                Width <span class="text-gray-500">({this.item.dim_unit.value})</span>
                            </label>
                            <input id={`item-width-${this.item.key}`} type="number" min="0" step="any" value={this.item.width}
                                oninput={(e) => this.item.width = e.target.value} />
                        </div>
                        <div class="flex flex-col w-full ml-2">
                            <label class="mb-0.5" for={`item-height-${this.item.key}`}>
                                Height <span class="text-gray-500">({this.item.dim_unit.value})</span>
                            </label>
                            <input id={`item-height-${this.item.key}`} type="number" min="0" step="any" value={this.item.height}
                                oninput={(e) => this.item.height = e.target.value} />
                        </div>
                    </div>
                    <div class="flex flex-col w-1/4 ml-2">
                        <label class="mb-0.5" for={`item-weight-${this.item.key}`}>
                            Weight <span class="text-gray-500">(kg)</span>
                        </label>
                        <input id={`item-weight-${this.item.key}`} type="number" min="0" step="any" value={this.item.weight}
                            oninput={(e) => this.item.weight = e.target.value} />
                    </div>
                </div>
            </div>
        );
    }
}