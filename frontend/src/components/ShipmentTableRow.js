import m from 'mithril';
import Shipment from '../models/Shipment';
import Utils from '../Utils';
import Badge from './Badge';

export default class ShipmentListRow {
    constructor(vnode) {
        console.log('construct ShipmentListRow');
        this.shipment = vnode.attrs.shipment;
        this.callback = vnode.attrs.callback;
    }

    view(vnode) {
        return (
            <tr class="whitespace-nowrap cursor-pointer transition-all
                border-b border-gray-200 text-gray-600 hover:bg-gray-50 hover:shadow"
                onclick={() => this.callback(this.shipment)}>
                <td class="w-1 py-2 text-black font-bold text-right">
                    {this.shipment.get_total_value_fmt()}
                </td>
                <td class="w-1 py-2 px-2 uppercase text-gray-500">
                    {this.shipment.currency.value}
                </td>
                <td class="w-1 py-2 pr-4">
                    <Badge text={this.shipment.status}
                        color={Shipment.status_colors[this.shipment.status]} />
                </td>
                <td class="w-auto py-2 overflow-hidden overflow-ellipsis">
                    {this.shipment.pickup_address_short}
                </td>
                <td class="w-auto py-2 overflow-hidden overflow-ellipsis">
                    {this.shipment.delivery_address_short}
                </td>
                <td clas="w-1 py-2">
                    {Utils.absolute_date(this.shipment.pickup_date.value)}
                </td>
            </tr>
        );
    }
}