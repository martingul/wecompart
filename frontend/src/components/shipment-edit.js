import m from 'mithril';
import Api from '../api';
import Icon from './icon';
import Loading from './loading';
import Dropdown from './dropdown';
import ItemEdit from './item-edit';

export default class ShipmentEdit {
    constructor(vnode) {
        this.id = vnode.attrs.id;
        this.new = this.id === undefined;
        console.log('contruct ShipmentEdit', this.id, this.new);

        this.fields = {
            from: {value: '', place_id: null, loading: false, dropdown: null, timeout: null},
            to: {value: '', place_id: null, loading: false, dropdown: null, timeout: null},
            pickup_date: {value: ''},
            currency: {value: 'usd'},
            total_value: {value: 0.0},
            need_packing: {value: false},
            need_insurance: {value: false},
            comments: {value: ''},
        };
        this.items = [];
        this.items_dom = [];

        if (this.new) {
            this.items.push({key: this.generate_key(), _item: null});
        }

        this.loading = false;
        this.error_shipment_not_found = false;
        this.save = false;
        this._shipment = null;
    }

    generate_key() {
        return Math.random().toString(36).substr(2, 5);
    }

    handle_dropdown_input(e, field) {
        field.value = e.target.value;
        field.dropdown = null;

        if (field.timeout !== null) {
            clearTimeout(field.timeout);
        }

        if (field.value.length === 0) {
            delete field.dropdown;
            field.loading = false;
            return;
        } else {
            field.loading = true;
            field.timeout = setTimeout(this.handle_dropdown_timeout, 1000, field);
        }
    }

    handle_dropdown_timeout(field) {
        field.timeout = null;
        field.loading = false;

        console.log('calling API');
        Api.read_locations({q: field.value}).then(locations => {
            const values = locations.map(l => l.address_long);
            const values_map = Object.fromEntries(
                locations.map(l => [l.address_long, l.address_id])
            );

            field.dropdown = <Dropdown values={values}
                callback={(v) => {
                    field.value = v;
                    field.place_id = values_map[v];
                    field.loading = false;
                    delete field.dropdown;
                }}
            />;
            m.redraw();
        }).catch(e => {
            console.log(e);
        });
    }

    handle_item_delete() {
        return (key) => {
            if (this.items.length === 1) return;
            this.items = this.items.filter(item => item.key !== key);
            this.items.forEach((item, i) => {
                document.getElementById(`item-index-${item.key}`).innerText = i + 1;
            });
        }
    }

    create() {
        console.log('create');
    }

    edit() {
        console.log('edit');
    }

    delete() {
        console.log('delete');
        Api.delete_shipment({shipment_id: this._shipment.uuid}).then(res => {
            console.log(res);
            m.route.set('/shipments');
        }).catch(e => {
            console.log(e);
        });
    }

    submit(e) {
        e.preventDefault();
        console.log('submit shipment', this.save);

        console.log(this.fields.pickup_date.value);

        /* TODO validate */
        const items = this.items_dom.map(item => item.state._item).map(item => {
            return {
                id: item.id,
                description: item.description,
                dim_unit: item.dim_unit,
                length: parseFloat(item.length),
                width: parseFloat(item.width),
                height: parseFloat(item.height),
                weight: parseFloat(item.weight),
            };
        });

        const shipment = {
            // status: this.save ? 'draft' : 'pending',
            pickup_address_id: this.fields.from.place_id,
            delivery_address_id: this.fields.to.place_id,
            pickup_date: this.fields.pickup_date.value,
            currency: this.fields.currency.value,
            total_value: parseFloat(this.fields.total_value.value),
            need_packing: this.fields.need_packing.value,
            need_insurance: this.fields.need_insurance.value,
            comments: this.fields.comments.value,
        };

        if (this.save) {
            if (this.new) {
                console.log('save new draft');
                shipment.items = items;
                shipment.status = 'draft';
                Api.create_shipment({shipment}).then(res => {
                    console.log(res);
                    m.route.set(`/shipments/${res.uuid}`);
                }).catch(e => {
                    console.log(e);
                });
            } else {
                console.log('edit current shipment');
                Api.update_shipment({
                    shipment_id: this._shipment.uuid,
                    patch: shipment
                }).then(res => {
                    console.log(res);
                }).catch(e => {
                    console.log(e);
                });

                items.filter(item => item.id === null).forEach(item => {
                    Api.create_shipment_item({
                        shipment_id: this._shipment.uuid,
                        item: item
                    }).then(res => {
                        console.log(res);
                    }).catch(e => {
                        console.log(e);
                    });
                });

                items.filter(item => item.id !== null).forEach(item => {
                    Api.update_shipment_item({
                        shipment_id: this._shipment.uuid,
                        item_id: item.id,
                        patch: item
                    }).then(res => {
                        console.log(res);
                    }).catch(e => {
                        console.log(e);
                    });
                });
                
                const items_before = new Set(this._shipment.items.map(item => item.uuid));
                const items_after = new Set(items.map(item => item.id));
                const items_diff = new Set([...items_before].filter(x => !items_after.has(x)));

                items_diff.forEach(item_id => {
                    Api.delete_shipment_item({
                        shipment_id: this._shipment.uuid,
                        item_id: item_id
                    }).then(res => {
                        console.log(res);
                        m.route.set(`/shipments/${this._shipment.uuid}`);
                    }).catch(e => {
                        console.log(e);
                    });
                });

                // m.route.set(`/shipments/${this._shipment.uuid}`);
            }
        } else {
            if (this.new) {
                /* TODO add progress bar and undo option, makes user feel there
                is a lot of stuff going on in the back scene
                not saying there isn't */
                console.log('create new');
                shipment.items = items;
                shipment.status = 'pending';
                Api.create_shipment({shipment}).then(res => {
                    console.log(res);
                    m.route.set(`/shipments/${res.uuid}`);
                }).catch(e => {
                    console.log(e);
                });
            } else {
                console.log('create from draft');
                Api.update_shipment({
                    shipment_id: this._shipment.uuid,
                    patch: {status: 'pending'}
                }).then(res => {
                    console.log(res);
                    m.route.set(`/shipments/${res.uuid}`);
                }).catch(e => {
                    console.log(e);
                });
            }
        }
    }

    oninit(vnode) {
        if (this.id) {
            this.loading = true;
            Api.read_shipment({ shipment_id: this.id}).then(res => {
                console.log(res);
                this._shipment = res;
                
                this.fields.from.value = this._shipment.pickup_address_long;
                this.fields.from.place_id = this._shipment.pickup_address_id;

                this.fields.to.value = this._shipment.delivery_address_long;
                this.fields.to.place_id = this._shipment.delivery_address_id;

                this.fields.currency.value = this._shipment.currency;
                this.fields.total_value.value = this._shipment.total_value;
                this.fields.need_packing.value = this._shipment.need_packing;
                this.fields.need_insurance.value = this._shipment.need_insurance;
                this.fields.comments.value = this._shipment.comments;

                this.items = this._shipment.items.map(item => {
                    return {key: this.generate_key(), _item: item}
                });
            }).catch(e => {
                console.log(e);
                this.error_shipment_not_found = true;
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    view(vnode) {
        if (!this._shipment && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }
        
        return (
            <div class="my-2 flex flex-col">
                <div class="my-2 flex justify-between">
                    <div class="px-2 rounded font-bold bg-yellow-100 text-black">
                        <div class={this.new ? 'block' : 'hidden'}>
                            New Shipment
                        </div>
                        <div class={!this.new ? 'block' : 'hidden'}>
                            Edit Shipment
                        </div>
                    </div>
                    <m.route.Link class="flex items-center text-gray-600 border-b border-gray-500 border-dotted"
                        href="/shipments">
                        <Icon name="chevron-left" class="w-4" />
                        <div class="ml-1">
                            back
                        </div>
                    </m.route.Link>
                </div>
                {/* <div class={this.new ? 'flex' : 'hidden'}>
                    <div class="w-full my-2 px-4 py-2 flex items-center rounded shadow bg-gray-100">
                        message...
                    </div>
                </div> */}
                <form class="flex flex-col" onsubmit={(e) => e.preventDefault()}>
                    <div class="my-2 text-gray-600">
                        Shipment information
                    </div>
                    <div class="m-2 flex justify-between">
                        <div class="mr-4 w-full flex flex-col">
                            <label class="mb-1 whitespace-nowrap overflow-hidden overflow-ellipsis" for="from-input">
                                Pickup address
                            </label>
                            <div class="relative">
                                <input class="w-full h-8 pl-2 py-1 pr-10 box-border border border-gray-400 focus:border-gray-500
                                    disabled:opacity-50 disabled:bg-gray-200"
                                    id="from-input" type="text" placeholder="Pickup address" autocomplete="off" spellcheck="false"
                                    value={this.fields.from.value}
                                    oninput={(e) => this.handle_dropdown_input(e, this.fields.from)}
                                    disabled={!this.new ? 'disabled' : ''} />
                                <div class={this.fields.from.loading ? '' : 'hidden'}>
                                    <div class="absolute inset-y-0 right-0 flex items-center">
                                        <Loading class="w-8" />
                                    </div>
                                </div>
                                {this.fields.from.dropdown}
                            </div>
                        </div>
                        <div class="ml-4 w-full flex flex-col">
                            <label class="mb-1 whitespace-nowrap overflow-hidden overflow-ellipsis" for="to-input">
                                Delivery address
                            </label>
                            <div class="relative">
                                <input class="w-full h-8 pl-2 py-1 pr-10 border border-gray-400 focus:border-gray-500
                                    disabled:opacity-50 disabled:bg-gray-200"
                                    id="to-input" type="text" placeholder="Delivery address" autocomplete="off" spellcheck="false"
                                    value={this.fields.to.value}
                                    oninput={(e) => this.handle_dropdown_input(e, this.fields.to)}
                                    disabled={!this.new ? 'disabled' : ''} />
                                <div class={this.fields.to.loading ? '' : 'hidden'}>
                                    <div class="absolute inset-y-0 right-0 flex items-center">
                                        <Loading class="w-8" />
                                    </div>
                                </div>
                                {this.fields.to.dropdown}
                            </div>
                        </div>
                    </div>
                    <div class="m-2 flex flex-col items-center">
                        <div class="w-full my-2 px-4 py-2 flex items-center rounded shadow bg-gray-100 text-gray-600">
                            <Icon name="info" class="w-4" />
                            <span class="ml-4">
                                Exact pickup date and time will be set once you accept a shipper's quote.
                            </span>
                        </div>
                        <div class="my-2 flex flex-col w-full">
                            <label class="mb-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                Desired pickup date
                            </label>
                            <input type="date" class="w-full h-8 pl-2 py-1 border border-gray-400 focus:border-gray-500"
                                oninput={(e) => {this.fields.pickup_date.value = e.target.value}}
                                value={this.fields.pickup_date.value} />
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex flex-row items-center">
                            <div class="my-2 text-gray-600 w-full">
                                What items are you shipping? <span class="italic">({this.items.length} total)</span>
                            </div>
                            <button class="whitespace-nowrap text-green-700 border-b border-dotted border-green-700"
                                onclick={(e) => {this.items.push({key: this.generate_key(), _item: null})}}>
                                + add item
                            </button>
                        </div>
                        <div class="flex flex-col p-2">
                            {this.items_dom = this.items.map((item, i) => {
                                const key = item.key;
                                item = item._item;
                                return (
                                    <ItemEdit key={key} index={i} ondelete={this.handle_item_delete()}
                                        id={item ? item.uuid : null}
                                        description={item ? item.description : ''}
                                        quantity={item ? item.quantity : 1}
                                        dim_unit={item ? item.dim_unit : 'cm'}
                                        length={item ? item.length : 1}
                                        width={item ? item.width : 1}
                                        height={item ? item.height : 1}
                                        weight={item ? item.weight : 1} />
                                );
                            })}
                        </div>
                    </div>
                    <div class="my-4">
                        <div class="text-gray-600 w-full">
                            What is the total commercial value of your items?
                        </div>
                        <div class="flex items-center w-full my-1 py-2 px-4">
                            <div class="inline-block relative min-w-max">
                                <select class="w-full block appearance-none py-1 pl-4 pr-10 cursor-pointer 
                                    bg-white border border-gray-400 focus:border-gray-500"
                                    oninput={(e) => this.fields.currency.value = e.target.value}
                                    value={this.fields.currency.value}>
                                    <option value="usd">$</option>
                                    <option value="eur">€</option>
                                    <option value="gbp">£</option>
                                </select>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ml-4 text-gray-600">
                                    <Icon name="chevron-down" class="w-4" />
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                        class="fill-current h-4 w-4">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg> */}
                                </div>
                            </div>
                            <input class="w-full ml-2 px-2 py-1 border border-gray-400 focus:border-gray-500"
                                type="number" step="any" placeholder="Total value"
                                oninput={(e) => this.fields.total_value.value = e.target.value}
                                value={this.fields.total_value.value} />
                        </div>
                    </div>
                    <div class="my-2">
                        <div class="text-gray-600 w-full">
                            Do your items need to be packed?
                        </div>
                        <div class="flex items-center w-full my-1 py-2 px-4">
                            <button class={this.fields.need_packing.value
                                ? 'border-b border-dotted border-gray-800 text-gray-800 font-bold'
                                : 'border-b border-dotted border-white text-gray-600'}
                                onclick={() => this.fields.need_packing.value = true}>
                                Yes
                            </button>
                            <button class={!this.fields.need_packing.value
                                ? 'ml-8 border-b border-dotted border-gray-800 text-gray-800 font-bold'
                                : 'ml-8 border-b border-dotted border-white text-gray-600'}
                                onclick={() => this.fields.need_packing.value = false}>
                                No
                            </button>
                        </div>
                    </div>
                    <div class="my-2">
                        <div class="text-gray-600 w-full">
                            Do you need insurance?
                        </div>
                        <div class="flex items-center w-full my-1 py-2 px-4">
                            <button class={this.fields.need_insurance.value
                                ? 'border-b border-dotted border-gray-800 text-gray-800 font-bold'
                                : 'border-b border-dotted border-white text-gray-600'}
                                onclick={() => this.fields.need_insurance.value = true}>
                                Yes
                            </button>
                            <button class={!this.fields.need_insurance.value
                                ? 'ml-8 border-b border-dotted border-gray-800 text-gray-800 font-bold'
                                : 'ml-8 border-b border-dotted border-white text-gray-600'}
                                onclick={() => this.fields.need_insurance.value = false}>
                                No
                            </button>
                        </div>
                    </div>
                    <div class="my-4">
                        <div class="text-gray-600 w-full">
                            Anything else to add?
                        </div>
                        <div class="my-2 py-2 px-4">
                            <textarea class="appearance-none w-full h-24 p-2 rounded-sm border border-gray-400 focus:border-gray-500"
                                placeholder="Additional comments..."
                                oninput={(e) => this.fields.comments.value = e.target.value}
                                value={this.fields.comments.value}>
                            </textarea>	
                        </div>
                    </div>
                    <div class="my-2">
                        <div class="flex">
                            <div class={!this.new ? 'block' : 'hidden'}>
                                <button class="flex items-center whitespace-nowrap
                                    border-b text-red-700 border-dotted border-red-700"
                                    onclick={(e) => {this.delete(e)}}>
                                    <Icon name="trash-2" class="w-4 h-4" />
                                    <span class="ml-1">
                                        delete
                                    </span>
                                </button>
                            </div>
                            <div class="flex justify-end w-full select-none">
                                <button class="flex items-center whitespace-nowrap
                                    border-b border-dotted border-gray-500 text-gray-500 hover:border-gray-600 hover:text-gray-600"
                                    onclick={(e) => {this.save = true; this.submit(e)}}>
                                    <Icon name="save" class="w-4 h-4" />
                                    <span class="ml-2">
                                        save <span class={this.new ? '' : 'hidden'}>as draft</span>
                                    </span>
                                </button>
                                <div class={!this._shipment || this._shipment.status === 'draft' ? 'block' : 'hidden'}>
                                    <button class="flex items-center whitespace-nowrap ml-8 font-bold
                                        border-b border-dotted border-gray-800"
                                        onclick={(e) => {this.save = false; this.submit(e)}}>
                                        <Icon name="arrow-right" class="w-4 h-4" />
                                        <span class="ml-1">
                                            create
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}``