import m from 'mithril';
import Utils from '../Utils';
import ShipmentStatus from './ShipmentStatus';

export default class ShipmentListElement {
    constructor(vnode) {
        console.log('construct ShipmentListElement');
        this.shipment = vnode.attrs.shipment;
        this.callback = vnode.attrs.callback;
    }

    view(vnode) {
        return (
            <div class="w-full flex flex-row justify-between items-center p-2 my-2 border-b whitespace-nowrap cursor-pointer transition-all
                border-gray-200 text-gray-600 hover:bg-gray-50 hover:shadow"
                onclick={() => this.callback(this.shipment)}>
                <div class="w-4/12 flex items-center">
                    <span class="text-black font-bold">
                        {this.shipment.get_total_value_fmt()}
                    </span>
                    <span class="mx-2 uppercase text-gray-500">
                        {this.shipment.currency.value}
                    </span>
                    <ShipmentStatus status={this.shipment.status} />
                </div>
                <div class="w-3/12 overflow-hidden overflow-ellipsis">
                    {this.shipment.pickup_address.short}
                </div>
                <div class="w-3/12 overflow-hidden overflow-ellipsis">
                    {this.shipment.delivery_address.short}
                </div>
                <div class="w-2/12">
                    {Utils.absolute_date(this.shipment.pickup_date.value)}
                </div>
            </div>
        );
    }
}