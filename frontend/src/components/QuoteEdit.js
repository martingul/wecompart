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
        this.shipment_id = vnode.attrs.shipment_id;
        this.close = vnode.attrs.close ? vnode.attrs.close : () => {};
        this.add_fee = false;

        this.quote = new Quote({
            shipment_uuid: this.shipment_id,
        });
    }

    calculate_fee() {
        // TODO get fee from backend
        return 0.10 * Number(this.quote.price.value);
    }

    submit() {
        console.log(this.quote);
        this.quote.create().then(res => {
            console.log(res);
            this.close();
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            
        });
    }

    view(vnode) {
        return (
            <form class="w-full md:w-1/2 flex flex-col" onsubmit={(e) => {e.preventDefault()}}>
                <div class="w-full flex flex-col py-2 px-4 rounded border border-gray-200">
                    <div class="flex mb-4 items-center justify-between">
                        <span class="font-bold text-black">
                            Place a quote
                        </span>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex flex-col w-full">
                            <div class="flex flex-col">
                                <label class="mb-1" for="delivery-date-input">
                                    Delivery date
                                </label>
                                <DateInput id="delivery-date-input" 
                                    bind={this.quote.delivery_date} />
                            </div>
                        </div>
                        <div class="mt-2 flex flex-col w-full">
                            <div class="flex flex-col">
                                <label class="mb-1" for="quote-price-input">
                                    Bid
                                </label>
                                <input id="quote-price-input" type="number" min="0" step="any"
                                    oninput={(e) => this.quote.price.value = e.target.value} />
                            </div>
                            <div class="mt-1 flex">
                                <input type="checkbox" id="add-fee" value="add-fee"
                                    oninput={(e) => this.add_fee = !this.add_fee} />
                                <label class="ml-2 text-gray-600 text-sm" for="add-fee">
                                    Add service fee to show total bid seen by client
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end mt-2 pt-2 border-t border-gray-200">
                        <span class="text-gray-800">
                            <span>
                                Your bid:
                            </span>
                            <span class="ml-2 font-bold">
                                {Utils.format_money(this.quote.price.value, 'usd')}
                            </span>
                        </span>
                        <span class="mt-1 text-sm text-gray-600">
                            <span>
                                Service fee:
                            </span>
                            <span class="ml-2 font-bold">
                                +{this.add_fee
                                    ? Utils.format_money(this.calculate_fee(), 'usd')
                                    : Utils.format_money(0, 'usd')}
                            </span>
                        </span>
                        <span class="mt-2 text-lg">
                            <span>
                                Total bid:
                            </span>
                            <span class="ml-2 font-bold">
                                {this.add_fee
                                    ? Utils.format_money(Number(this.quote.price.value) + this.calculate_fee(), 'usd')
                                    : Utils.format_money(this.quote.price.value, 'usd')}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="mt-4 flex items-center justify-end">
                    <Button text="Cancel" active={false}
                        callback={() => this.close()} />
                    <div class="ml-2">
                        <Button text="Place quote"
                            callback={() => this.submit()} />
                    </div>
                </div>
            </form>
        );
    }
}