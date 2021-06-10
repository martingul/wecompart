import m from 'mithril';
import Api from '../api';

export default class QuoteEdit {
    constructor(vnode) {
        console.log('construct QuoteEdit');
        this.shipment_id = vnode.attrs.shipment_id;
        this.price = 0;
    }

    create_quote(price) {
        Api.create_shiptment_quote({
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
            <form class="py-2 px-4 bg-yellow-50 rounded shadow" onsubmit={(e) => {e.preventDefault()}}>
                <div class="flex items-center">
                    <label for="quote-price-input">Price</label>
                    <input class="ml-4 py-1 border border-gray-200 rounded-sm"
                        id="quote-price-input" type="number" min="0" step="any"
                        oninput={(e) => this.price = e.target.value} />
                    <button class="ml-4"
                        onclick={() => this.create_quote(this.price)}>
                        Create
                    </button>
                </div>
            </form>
        );
    }
}