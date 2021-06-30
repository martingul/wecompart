import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';

export default class ShipmentListElement {
    constructor(vnode) {
        console.log('construct ShipmentListElement');
        this.shipment = vnode.attrs.shipment;
        this.callback = vnode.attrs.callback;
    }

    view(vnode) {
        return (
            <div class="w-full flex flex-row justify-between items-center p-2 my-2 border-b whitespace-nowrap cursor-pointer
                border-gray-200 text-gray-600 hover:bg-gray-50 hover:shadow"
                onclick={() => this.callback(this.shipment)}>
                <div class="w-2/12">
                    <span>
                        {this.shipment.get_total_value_fmt()}
                    </span>
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
                <div class="w-2/12">
                    <div class={Utils.get_status_style(this.shipment.status)}>
                        {this.shipment.status}
                    </div>
                </div>
            </div>
        );
    }
}