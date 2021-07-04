import m from 'mithril';
import Utils from '../Utils';
import Api from '../Api';
import Button from './Button';

export default class QuoteEdit {
    constructor(vnode) {
        console.log('construct QuoteEdit');
        this.shipment_id = vnode.attrs.shipment_id;
        this.close = vnode.attrs.close ? vnode.attrs.close : () => {};
        this.price = 0;
        this.fee = 10;
        this.add_fee = false;
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
            <form class="py-2 px-4 rounded shadow"
                onsubmit={(e) => {e.preventDefault()}}>
                <div class="flex flex-col">
                    <span class="text-lg font-bold text-black mb-4">
                        Place a quote
                    </span>
                    <div class="flex w-full">
                        <div class="flex flex-col w-1/2 mr-2">
                            <div class="flex flex-col">
                                <label class="mb-1" for="quote-price-input">
                                    Bid
                                </label>
                                <input id="quote-price-input" type="number" min="0" step="any"
                                    oninput={(e) => this.price = e.target.value} />
                            </div>
                            <div class="mt-1 flex">
                                <input type="checkbox" id="add-fee" value="add-fee"
                                    oninput={(e) => this.add_fee = !this.add_fee} />
                                <label class="ml-2" for="add-fee">
                                    Add service fee
                                </label>
                            </div>
                            <div class="mt-2 flex items-center justify-end pt-2 border-t border-gray-200">
                                <span class="font-bold text-lg">
                                    Total:
                                </span>
                                <span class="ml-2">
                                    {Utils.format_money(this.price, 'usd')}
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-col w-1/2 ml-2 border-l border-gray-200">
                            <div>
                                Lowest active bid: $10
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center justify-end">
                        <Button text="Cancel" active={false}
                            callback={() => this.close()} />
                        <div class="ml-2">
                            <Button text="Place quote"
                                callback={() => this.create_quote(this.price)} />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}