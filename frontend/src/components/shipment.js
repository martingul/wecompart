import m from 'mithril';
import utils from '../utils';
import Icon from './icon';
import Dropdown from './dropdown';

export default class Shipment {
    constructor(vnode) {
        this._shipment = {
            uuid: vnode.attrs.key,
            owner_uuid: vnode.attrs.owner_uuid,
            status: vnode.attrs.status,
            pickup_address: vnode.attrs.pickup_address,
            delivery_address: vnode.attrs.delivery_address,
            currency: vnode.attrs.currency,
            total_value: vnode.attrs.total_value,
            need_packing: vnode.attrs.need_packing,
            need_insurance: vnode.attrs.need_insurance,
            comments: vnode.attrs.comments,
            items: vnode.attrs.items,
            created_at: new Date(vnode.attrs.created_at),
            updated_at: new Date(vnode.attrs.updated_at),
        };

        this.status_colors = {
            'draft': 'gray',
            'pending': 'yellow',
            'ready': 'green',
        };

        const fmt = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this._shipment.currency,          
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        });
        this._shipment.total_value_fmt = fmt.format(this._shipment.total_value);

        // this.show_more = false;
    }

    get status_style() {
        const color = this.status_colors[this._shipment.status];
        return 'py-1 rounded text-xs text-center font-bold uppercase '
            + `bg-${color}-100 text-${color}-500`;
    }

    view(vnode) {
        return (
            <div class="w-full flex flex-row justify-between items-center p-2 my-2 border-b border-gray-200 text-gray-600
                hover:bg-gray-50 hover:shadow cursor-pointer whitespace-nowrap"
                onclick={() => {
                    // window.sessionStorage.setItem('shipment', this._shipment);
                    m.route.set('/shipments/:id', {id: this._shipment.uuid});
                }}>
                {/* <div class="max-w-xs flex flex-row justify-start whitespace-nowrap box-border">
                    <div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {this.pickup_address}
                    </div>
                    <Icon name="arrow-right" class="w-4 mx-2 text-gray-400" />
                    <div class="whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {this.delivery_address}
                    </div>
                </div> */}
                <div class="w-2/12">
                    {/* {this.items} {this.items == 1 ? 'item' : 'items'}, {utils.relative_date(this.created_at)} */}
                    <span>
                        {this._shipment.total_value_fmt} 
                    </span>
                    {/* <span class="text-gray-400 ml-2 text-sm">
                        {this.currency.toUpperCase()}
                    </span> */}
                </div>
                <div class="w-3/12 overflow-hidden overflow-ellipsis">
                    {this._shipment.pickup_address}
                </div>
                <div class="w-3/12 overflow-hidden overflow-ellipsis">
                    {this._shipment.delivery_address}
                </div>
                <div class="w-2/12">
                    {utils.absolute_date(this._shipment.created_at)}
                </div>
                <div class="w-2/12">
                    <div class={this.status_style}>
                        {this._shipment.status}
                    </div>
                </div>
            </div>
        );
    }
}