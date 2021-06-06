import m from 'mithril';

export default class ItemEdit {
    constructor(vnode) {
        console.log('construct ItemEdit', vnode.attrs.key, vnode.attrs.index, vnode.attrs.description);
        this.key = vnode.attrs.key;
        this.index = vnode.attrs.index;
        this.ondelete = vnode.attrs.ondelete;

        this._item = {
            id: vnode.attrs.id === undefined ? null : vnode.attrs.id,
            description: vnode.attrs.description === undefined ? '' : vnode.attrs.description,
            quantity: vnode.attrs.quantity === undefined ? 1 : vnode.attrs.quantity,
            dim_unit: vnode.attrs.dim_unit === undefined ? 'cm' : vnode.attrs.dim_unit,
            length: vnode.attrs.length === undefined ? 0.0 : vnode.attrs.length,
            width: vnode.attrs.width === undefined ? 0.0 : vnode.attrs.width,
            height: vnode.attrs.height === undefined ? 0.0 : vnode.attrs.height,
            weight: vnode.attrs.weight === undefined ? 0.0 : vnode.attrs.weight,
        };
    }

    handle_delete() {
        this.ondelete(this.key);
    }

    view(vnode) {
        return (
            <div id={`item-${this.key}`}
                class="flex flex-col my-2 p-2 border border-gray-200 shadow rounded-sm text-gray-800">
                <div class="flex flex-row mb-1">
                    <div class="font-bold w-full">
                        Item <span id={`item-index-${this.key}`}>{this.index + 1}</span>
                        <span class='text-gray-500 ml-2'>{this._item.id}</span>
                    </div>
                    <div class="flex items-center justify-between select-none whitespace-nowrap">
                        <div class="flex items-center justify-between">
                            <button class={this._item.dim_unit === 'cm'
                                ? 'px-1 border-b border-dotted border-gray-800 font-bold'
                                : 'px-1 border-b border-dotted border-white'}
                                onclick={(e) => this._item.dim_unit = e.target.innerText}>
                                cm
                            </button>
                            <button class={this._item.dim_unit === 'in'
                                ? 'px-1 ml-4 border-b border-dotted border-gray-800 font-bold'
                                : 'px-1 ml-4 border-b border-dotted border-white'}
                                onclick={(e) => this._item.dim_unit = e.target.innerText}>
                                in
                            </button>
                        </div>
                        <button class="ml-8 p-1 text-red-800"
                            onclick={() => this.handle_delete()}>
                            <pre>x</pre>
                        </button> 
                    </div>
                </div>
                <div class="flex flex-row my-2">
                    <div class="flex flex-col w-3/4">
                        <label class="mb-0.5" for={`item-description-${this.key}`}>
                            Description
                        </label>
                        <input class="w-full pl-2 py-1 border border-gray-400 focus:border-gray-500"
                            id={`item-description-${this.key}`} type="text" placeholder="e.g. 1 table, 2 paintings..."
                            oninput={(e) => this._item.description = e.target.value} value={this._item.description} />
                    </div>
                    <div class="flex flex-col w-1/4 ml-2">
                        <label class="mb-0.5" for={`item-quantity-${this.key}`}>
                            Qty.
                        </label>
                        <input class="w-full pl-2 py-1 border border-gray-400 focus:border-gray-500"
                            id={`item-quantity-${this.key}`} type="number" min="1" step="any"
                            oninput={(e) => this._item.quantity = e.target.value} value={this._item.quantity} />
                    </div>
                </div>
                <div class="flex flex-row my-2">
                    <div class="w-3/4 flex flex-row">
                        <div class="flex flex-col w-full">
                            <label class="mb-0.5" for={`item-length-${this.key}`}>
                                Length <span class="text-gray-500">({this._item.dim_unit})</span>
                            </label>
                            <input class="w-full pl-2 py-1 border border-gray-400 focus:border-gray-500"
                                id={`item-length-${this.key}`} type="number" min="0" step="any" value={this._item.length}
                                oninput={(e) => this._item.length = e.target.value} />
                        </div>
                        <div class="flex flex-col w-full ml-2">
                            <label class="mb-0.5" for={`item-width-${this.key}`}>
                                Width <span class="text-gray-500">({this._item.dim_unit})</span>
                            </label>
                            <input class="w-full pl-2 py-1 border border-gray-400 focus:border-gray-500"
                                id={`item-width-${this.key}`} type="number" min="0" step="any" value={this._item.width}
                                oninput={(e) => this._item.width = e.target.value} />
                        </div>
                        <div class="flex flex-col w-full ml-2">
                            <label class="mb-0.5" for={`item-height-${this.key}`}>
                                Height <span class="text-gray-500">({this._item.dim_unit})</span>
                            </label>
                            <input class="w-full pl-2 py-1 border border-gray-400 focus:border-gray-500"
                                id={`item-height-${this.key}`} type="number" min="0" step="any" value={this._item.height}
                                oninput={(e) => this._item.height = e.target.value} />
                        </div>
                    </div>
                    <div class="flex flex-col w-1/4 ml-2">
                        <label class="mb-0.5" for={`item-weight-${this.key}`}>
                            Weight <span class="text-gray-500">(kg)</span>
                        </label>
                        <input class="w-full pl-2 py-1 border border-gray-400 focus:border-gray-500"
                            id={`item-weight-${this.key}`} type="number" min="0" step="any" value={this._item.weight}
                            oninput={(e) => this._item.weight = e.target.value} />
                    </div>
                </div>
            </div>
        );
    }
}