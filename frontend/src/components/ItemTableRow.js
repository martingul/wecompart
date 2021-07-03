import m from 'mithril';

export default class ItemTableRow {
    constructor(vnode) {
        this.item = vnode.attrs.item;
        this.index = vnode.attrs.index;
    }

    view(vnode) {
        return (
            <tr class="border-b border-gray-200">
                <td class="py-2 italic">
                    {this.item.description}
                </td>
                <td class="py-2 text-right">
                    <code>
                        {this.item.quantity}
                    </code>
                </td>
                <td class="py-2 text-right">
                    <code>
                        {this.item.length}
                    </code>
                    <span class="ml-1 text-sm text-gray-500">
                        {this.item.dim_unit.value}
                    </span>
                </td>
                <td class="py-2 text-right">
                    <code>
                        {this.item.width}
                    </code>
                    <span class="ml-1 text-sm text-gray-500">
                        {this.item.dim_unit.value}
                    </span>
                </td>
                <td class="py-2 text-right">
                    <code>
                        {this.item.height}
                    </code>
                    <span class="ml-1 text-sm text-gray-500">
                        {this.item.dim_unit.value}
                    </span>
                </td>
                <td class="py-2 text-right">
                    <code>
                        {this.item.weight}
                    </code>
                    <span class="ml-1 text-sm text-gray-500">
                        kg
                    </span>
                </td>
            </tr>
        );
    }
}