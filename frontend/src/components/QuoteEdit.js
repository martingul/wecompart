import m from 'mithril';
import Utils from '../Utils';
import Api from '../Api';
import Button from './Button';
import Badge from './Badge';
import DateInput from './DateInput';
import Quote from '../models/Quote';

export default class QuoteEdit {
    constructor(vnode) {
        console.log('construct QuoteEdit');
        this.shipment = vnode.attrs.shipment;
        this.close = vnode.attrs.close ? vnode.attrs.close : () => {};
        this.add_fee = true;
        this.loading = false;

        this.quote = new Quote({
            shipment_uuid: this.shipment.uuid,
        });
    }

    is_loading() {
        return this.loading;
    }

    calculate_fee() {
        // TODO get fee from backend
        return 0.10 * Number(this.quote.price.value);
    }

    submit(e) {
        e.preventDefault();
        console.log(this.quote);
        this.loading = true;
        this.quote.create().then(q => {
            const quote = new Quote(q);
            this.shipment.quotes.push(quote);
            this.close(true);
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            this.loading = false;
        });
    }

    oncreate(vnode) {
        vnode.dom.querySelector('#quote-bid-input').focus();
    }

    view(vnode) {
        return (
            <form class="w-full md:w-1/2 flex flex-col"
                onsubmit={(e) => this.submit(e)}>
                <div class="w-full flex flex-col py-2 px-4 rounded border border-gray-200">
                    <div class="flex mb-4 items-center justify-between">
                        <span class="font-bold text-lg text-black">
                            Place a quote
                        </span>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex flex-col w-full">
                            <div class="flex flex-col">
                                <label class="mb-1" for="quote-bid-input">
                                    Bid
                                </label>
                                <input id="quote-bid-input" type="number" min="0" step="any"
                                    oninput={(e) => this.quote.price.value = e.target.value} />
                            </div>
                            {/* <div class="my-1 flex">
                                <input class="filter grayscale" type="checkbox" id="add-fee" value="add-fee"
                                    checked={this.add_fee}
                                    oninput={(e) => this.add_fee = !this.add_fee} />
                                <label class="ml-2 text-gray-600 text-sm" for="add-fee">
                                    Add service fee to show total bid seen by client
                                </label>
                            </div> */}
                        </div>
                        <div class="mt-2 flex flex-col w-full">
                            <div class="flex flex-col">
                                <label class="mb-1" for="delivery-date-input">
                                    Delivery date
                                </label>
                                <DateInput id="delivery-date-input" bind={this.quote.delivery_date}
                                    min={(new Date(this.shipment.pickup_date.value - (24*60*60*1000))).toISOString().split('T')[0]} />
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end mt-4 pt-2 border-t border-gray-200">
                        <span class="text-gray-800">
                            <span>
                                Your bid:
                            </span>
                            <code class="ml-2 font-bold">
                                {Utils.format_money(this.quote.price.value, 'usd')}
                            </code>
                        </span>
                        <span class="mt-1 text-sm text-gray-600">
                            <span>
                                Service fee:
                            </span>
                            <code class="ml-2 font-bold">
                                +{Utils.format_money(this.calculate_fee(), 'usd')}
                            </code>
                        </span>
                        <span class="mt-2 text-black">
                            <span>
                                Total bid:
                            </span>
                            <code class="ml-2 font-bold">
                                {Utils.format_money(Number(this.quote.price.value) + this.calculate_fee(), 'usd')}
                            </code>
                        </span>
                    </div>
                </div>
                <div class="mt-4 flex items-center justify-end">
                    <Button active={false} callback={() => this.close(false)}>
                        Cancel
                    </Button>
                    <div class="ml-2">
                        <Button loading={() => this.is_loading()}
                            callback={(e) => this.submit(e)}>
                            Create
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}