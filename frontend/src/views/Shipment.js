import m from 'mithril';
import FileSaver from 'file-saver';
import Api from '../Api';
import Utils from '../Utils';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import ShipmentEdit from '../components/ShipmentEdit';
import QuoteEdit from '../components/QuoteEdit';

export default class ShipmentView {
    constructor(vnode) {
        this.id = vnode.attrs.id;
        console.log('contruct ShipmentView', this.id);

        this.status_colors = {
            'draft': 'gray',
            'pending': 'yellow',
            'ready': 'green',
        };

        this._shipment = null;
        this.access_token = null;
        this.error_shipment_not_found = false;
        this.loading = false;
        this.edit = false;
        this.show_show_more_actions = false;
        this.show_comments = false;
        this.show_items = false;
        this.show_quote_form = false;
    }

    get status_style() {
        const color = this.status_colors[this._shipment.status];
        return 'py-1 rounded text-xs text-center font-bold uppercase '
            + `bg-${color}-100 text-${color}-500`;
    }

    download_shipment(format) {
        Api.download_shipment({
            shipment_id: this.id,
            format: format,
        }).then(res => {
            /* TODO check res length is not 0 */
            const date = this._shipment.created_at;
            const date_fmt = [
                date.getFullYear(),
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getDate().toString().padStart(2, '0')
            ].join('-');

            if (format === 'text') format = 'txt';

            const filename = `shipment-${date_fmt}.${format}`;
            FileSaver.saveAs(res, filename);
        }).catch(e => {
            console.log(e);
        });
    }

    handle_action_dropdown(action) {
        console.log(action);
        if (action === 'edit') {
            this.edit = !this.edit;
        }

        if (action === 'delete') {
            /* add popup and loading indicator */
            Api.delete_shipment({ shipment_id: this.id }).then(res => {
                m.route.set('/shipments');
            }).catch(e => {
                console.log(e);
            });
        }
    }

    oninit(vnode) {
        const access_token = m.route.param('access_token');
        console.log('access_token: ', access_token);
        if (access_token) this.access_token = access_token;

        if (this.id) {
            this.loading = true;
            Api.read_shipment({
                shipment_id: this.id,
                access_token: this.access_token
            }).then(res => {
                this._shipment = res;

                const fmt = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: this._shipment.currency,          
                });
                this._shipment.total_value_fmt = fmt.format(this._shipment.total_value);

                const comments_short = Utils.truncate(this._shipment.comments, 25);
                if (comments_short === this._shipment.comments) {
                    this.show_comments = true;
                } else {
                    this._shipment.comments_short = comments_short + '...';
                }

                this._shipment.created_at = new Date(this._shipment.created_at);
                this._shipment.updated_at = new Date(this._shipment.updated_at);
            }).catch(e => {
                console.log(e);
                if (e.code === 401) {
                    m.route.set('/auth/login');
                } else if (e.code === 403) {
                    m.route.set('/shipments');
                } else {
                    this.error_shipment_not_found = true;
                }
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    view(vnode) {
        if (this._shipment === null && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }

        if (this._shipment !== null) {
            if (this._shipment.status === 'draft') {
                return <ShipmentEdit id={vnode.attrs.id} />;
            }

            if (this.edit) {
                return <ShipmentEdit id={vnode.attrs.id} />;
            }
        }

        return (
            <div class="my-2">
                <div class={this.error_shipment_not_found ? 'block' : 'hidden'}>
                    <div class="my-6 w-full text-center">
                        No such shipment <span class="text-gray-500 ml-2">{this.id}</span>
                    </div>
                </div>
                <div class={(!this.loading && this._shipment !== null) ? 'flex flex-col' : 'hidden'}>
                    <div class="my-2 flex justify-between items-start">
                        <div class="flex flex-col">
                            <div class="px-2 rounded font-bold bg-yellow-100 text-black">
                                Shipment information
                            </div>
                            <div class="my-1 px-2 whitespace-nowrap text-sm text-gray-400">
                                created {Utils.relative_date(this._shipment.created_at)}
                                {this.created_at !== this.updated_at ?
                                    'last updated ' + Utils.relative_date(this._shipment.updated_at) : ''}
                            </div>
                        </div>
                        <div class="flex items-center whitespace-nowrap text-sm">
                            <button class="flex flex-col items-center whitespace-nowrap
                                text-gray-700 border-b border-dotted border-gray-700"
                                // onclick={(e) => this.show_download = !this.show_download}
                                onclick={(e) => this.download_shipment('pdf')}>
                                <div class="flex items-center">
                                    <Icon name="message-circle" class="w-4 h-4" />
                                    <span class="mx-1">
                                        Message client
                                    </span>
                                    {/* <Icon name="chevron-down" class="w-4 h-4" /> */}
                                </div>
                            </button>
                            <div class="relative ml-4">
                                <button class="flex flex-col items-center whitespace-nowrap
                                    text-gray-700 border-b border-dotted border-gray-700"
                                    // onclick={(e) => this.show_download = !this.show_download}
                                    onclick={(e) => this.download_shipment('pdf')}>
                                    <div class="flex items-center">
                                        <Icon name="download" class="w-4 h-4" />
                                        <span class="mx-1">
                                            Download PDF
                                        </span>
                                        {/* <Icon name="chevron-down" class="w-4 h-4" /> */}
                                    </div>
                                    {/* <div class={this.show_download ? 'block' : 'hidden'}>
                                        <Dropdown values={['PDF', 'HTML', 'Text']}
                                            callback={(v) => this.download_shipment(v.toLowerCase())} />
                                    </div> */}
                                </button>
                            </div>
                            <div class={!this.access_token ? 'block' : 'hidden'}>
                                <div class="relative flex flex-col">
                                    <button class="ml-6 flex items-center whitespace-nowrap
                                        text-gray-700 border-b border-dotted border-gray-700"
                                        onclick={(e) => this.show_more_actions = !this.show_more_actions}>
                                        <Icon name="chevron-down" class="w-4 h-4" />
                                        <span class="mx-1">More</span>
                                    </button>
                                    <div class={this.show_more_actions ? 'block' : 'hidden'}>
                                        {/* <Dropdown values={['Edit', 'Delete']}
                                            callback={(v) => this.handle_action_dropdown(v.toLowerCase())} /> */}
                                    </div>
                                </div>
                            </div>
                            {/* <button class="ml-6 flex items-center whitespace-nowrap
                                text-gray-700 border-b border-dotted border-gray-700"
                                onclick={(e) => this.edit = !this.edit}>
                                <Icon name="edit-3" class="w-4 h-4" />
                                <span class="ml-1">
                                    Edit
                                </span>
                            </button>
                            <button class="ml-6 flex items-center whitespace-nowrap
                                text-red-700 border-b border-dotted border-red-700"
                                onclick={(e) => m.route.set('/shipments')}>
                                <Icon name="trash-2" class="w-4 h-4" />
                                <span class="ml-1">
                                    Delete
                                </span>
                            </button> */}
                        </div>
                    </div>
                    <div class="my-2 flex flex-col">
                        <div class="my-2">
                            {/* <div class="my-2 flex justify-between items-start">
                                <div class="px-2 rounded font-bold bg-yellow-100 text-black">
                                    Shipment information
                                </div>
                                <div class="whitespace-nowrap text-sm text-gray-400">
                                    created {Utils.relative_date(this._shipment.created_at)}
                                    {this.created_at !== this.updated_at ?
                                        'last updated ' + Utils.relative_date(this._shipment.updated_at) : ''}
                                </div>
                            </div> */}
                            <div class="flex justify-between px-4">
                                <div class="flex flex-col">
                                    <div class="my-1">
                                        <div class="text-gray-600">
                                            Pickup address
                                        </div>
                                        <div class="my-1 text-black">
                                            {this._shipment.pickup_address_long}
                                        </div>
                                    </div>
                                    <div class="my-1">
                                        <div class="text-gray-600">
                                            Delivery address
                                        </div>
                                        <div class="my-1 text-black">
                                            {this._shipment.delivery_address_long}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col ml-4">
                                    <div class={!this.access_token ? 'block' : 'hidden'}>
                                        <div class="my-1">
                                            <div class="text-gray-600">
                                                Status
                                            </div>
                                            <div class="my-1">
                                                <div class={this.status_style}>
                                                    {this._shipment.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="my-1">
                                        <div class="text-gray-600">
                                            Total value
                                        </div>
                                        <div class="my-1">
                                            <span class="font-bold text-lg text-black">
                                                {this._shipment.total_value_fmt}
                                            </span>
                                            <span class="ml-2 uppercase text-gray-400">
                                                {this._shipment.currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 mb-6 flex flex-col rounded shadow bg-gray-50">
                            <button class="px-4 py-2 flex items-center whitespace-nowrap"
                                onclick={(e) => this.show_items = !this.show_items}>
                                <div class={this.show_items ? 'inline-block' : 'hidden'}>
                                    <Icon name="chevron-down" class="w-4 h-4" />
                                </div>
                                <div class={!this.show_items ? 'inline-block' : 'hidden'}>
                                    <Icon name="chevron-right" class="w-4 h-4" />
                                </div>
                                <span class="px-1 rounded font-bold text-black ">
                                    Shipment content
                                </span>
                                <span class="p-1 text-gray-600">
                                    ({this._shipment.items.length} {this._shipment.items.length === 1 ? 'item' : 'items'},
                                    {this._shipment.items.map(item => item.weight).reduce((a, c) => a + c)} kg)
                                </span>
                            </button>
                            <div class={this.show_items ? 'flex flex-col' : 'hidden'}>
                                <div class="py-2 px-4">
                                    {this._shipment.items.map((item, i) => {
                                        return (
                                            <div class="my-2 py-2 px-4 bg-white rounded border border-gray-100">
                                                <div class="my-1 flex items-center">
                                                    <div class="w-full font-bold">
                                                        Item {i + 1}
                                                    </div>
                                                    <div class="font-bold text-gray-600">
                                                        <code>x{item.quantity}</code>
                                                    </div>
                                                </div>
                                                <div class="my-2 flex flex-col">
                                                    <div class="text-gray-600 leading-relaxed">
                                                        Description
                                                    </div>
                                                    <div class="my-1 text-black italic">
                                                        {item.description}
                                                    </div>
                                                </div>
                                                <div class="my-2 flex justify-between">
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Length
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.length}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                {item.dim_unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Width
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.width}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                {item.dim_unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Height
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.height}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                {item.dim_unit}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex flex-col">
                                                        <div class="text-gray-600">
                                                            Weight
                                                        </div>
                                                        <div class="text-black">
                                                            <code>
                                                                {item.weight}
                                                            </code>
                                                            <span class="ml-1 text-sm text-gray-500">
                                                                kg
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div class="my-2 flex flex-col sm:flex-row justify-between items-start">
                            <div class="flex flex-col">
                                <div class="my-1">
                                    <span class="p-1 rounded font-bold text-black whitespace-nowrap">
                                        Additional comments
                                    </span>
                                </div>
                                <div class="py-2 px-4 leading-relaxed text-gray-800">
                                    {this.show_comments ? this._shipment.comments : this._shipment.comments_short}
                                    <div class={this._shipment.comments_short ? 'inline-block' : 'hidden'}>
                                        <button class="leading-tight ml-2 text-gray-500 border-b border-gray-500 border-dotted"
                                            onclick={() => this.show_comments = !this.show_comments}>
                                            {this.show_comments ? 'less' : 'more'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col sm:ml-4">
                                <div class="my-1">
                                    <span class="p-1 rounded font-bold text-black whitespace-nowrap">
                                        Services requested
                                    </span>
                                    <span class="text-gray-600">
                                        ({[this._shipment.need_packing ? 1 : 0, this._shipment.need_insurance ? 1 : 0].reduce((a, c) => a + c) + 1})
                                    </span>
                                </div>
                                <div class="my-2 flex items-center px-4 text-center">
                                    <div class="text-green-500">
                                        <Icon name="check-square" class="w-4 h-4" />
                                    </div>
                                    <span class="ml-4 uppercase font-bold text-sm text-green-500">
                                        Shipping
                                    </span>
                                </div>
                                <div class="my-2 flex items-center px-4 text-center">
                                    <div class={!this._shipment.need_packing ? 'block text-gray-400' : 'hidden'}>
                                        <Icon name="x-square" class="w-4 h-4" />
                                    </div>
                                    <div class={this._shipment.need_packing ? 'block text-green-500' : 'hidden'}>
                                        <Icon name="check-square" class="w-4 h-4" />
                                    </div>
                                    <span class="ml-4 uppercase font-bold text-sm">
                                        <span class={this._shipment.need_packing ? 'text-green-500' : 'text-gray-400 line-through'}>
                                            Packing
                                        </span>
                                    </span>
                                </div>
                                <div class="my-2 flex items-center px-4 text-center">
                                    <div class={!this._shipment.need_insurance ? 'block text-gray-400' : 'hidden'}>
                                        <Icon name="x-square" class="w-4 h-4" />
                                    </div>
                                    <div class={this._shipment.need_insurance ? 'block text-green-500' : 'hidden'}>
                                        <Icon name="check-square" class="w-4 h-4" />
                                    </div>
                                    <span class="ml-4 uppercase font-bold text-sm">
                                        <span class={this._shipment.need_insurance ? 'text-green-500' : 'text-gray-400 line-through'}>
                                            Insurance
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="my-2 flex flex-col">
                        <div class="my-2 flex">
                            <div class="px-2 rounded font-bold bg-yellow-100 text-black whitespace-nowrap">
                                Quotes
                            </div>
                        </div>
                        {/* <div class={this.show_quote_form ? 'hidden' : 'block'}>
                            <div class="flex justify-center">
                                <div class="flex flex-col items-center">
                                    <div class="my-4 text-gray-200">
                                        <Icon name="clock" class="w-12 h-12" />
                                    </div>
                                    <div class="my-1 text-gray-600">
                                        No quotes yet.
                                    </div>
                                    <div class={this.access_token ? 'block' : 'hidden'}>
                                        <button class="mt-8 bg-yellow-100 font-bold font-lg px-4 py-1 rounded shadow-lg border border-gray-500"
                                            onclick={() => {this.show_quote_form = true}}>
                                            Place a quote
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div class={this.show_quote_form ? 'block' : 'block'}>
                            <div class="my-4">
                                <QuoteEdit shipment_id={this.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}