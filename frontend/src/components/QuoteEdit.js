import m from 'mithril';
import Api from '../Api';

export default class QuoteEdit {
    constructor(vnode) {
        console.log('construct QuoteEdit');
        this.shipment_id = vnode.attrs.shipment_id;
        this.close = vnode.attrs.close ? vnode.attrs.close : () => {};
        this.price = 0;
    }

    create_quote(price) {
        Api.create_shipment_quote({
            shipment_id: this.shipment_id,
            quote: {
                price: this.price
            }
        }).then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        });
    }

    view(vnode) {
        return (
            <form class="py-2 px-4 bg-gray-50 rounded shadow" onsubmit={(e) => {e.preventDefault()}}>
                <div class="flex flex-col">
                    <span class="text-lg font-bold text-black mb-4">
                        New quote
                    </span>
                    <label class="mb-1" for="quote-price-input">
                        Price
                    </label>
                    <input id="quote-price-input" type="number" min="0" step="any"
                        oninput={(e) => this.price = e.target.value} />
                    <button class="mt-8 font-bold font-lg px-4 py-1 rounded hover:shadow transition-all border border-gray-500"
                        onclick={() => this.create_quote(this.price)}>
                        Place quote
                    </button>
                </div>
            </form>
        );
    }
}