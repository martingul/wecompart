import m from 'mithril';
import Utils from '../Utils';
import Button from './Button';
import DateInput from './DateInput';
import Loading from './Loading';
import Quote from '../models/Quote';

export default class QuoteEdit {
    constructor(vnode) {
        console.log('construct QuoteEdit');
        this.shipment = vnode.attrs.shipment;
        this.close = vnode.attrs.close ? vnode.attrs.close : () => {};
        this.create_loading = false;
        // this.add_fee = true;

        this.quote = new Quote({
            shipment_uuid: this.shipment.uuid,
            status: 'pending',
            bids: this.shipment.services.map(s => ({
                service_uuid: s.uuid,
                amount: 0,
            }))
        });
    }

    submit(e) {
        if (e){
            e.preventDefault();
        }
        this.create_loading = true;
        this.quote.create().then(q => {
            this.shipment.add_quote(new Quote(q))
            this.close(true);
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            this.create_loading = false;
        });
    }

    // oncreate(vnode) {
    //     vnode.dom.querySelector('#...-input').focus();
    // }

    view(vnode) {
        return (
            <form class="flex flex-col"
                onsubmit={(e) => e.preventDefault()}>
                <div class="flex flex-col">
                    <div class="flex flex-col">
                        <label class="mb-1" for="delivery-date-input">
                            Expected delivery date
                        </label>
                        <DateInput id="delivery-date-input" bind={this.quote.delivery_date}
                            min={(new Date(this.shipment.pickup_date.value - (24*60*60*1000))).toISOString().split('T')[0]} />
                    </div>
                    {this.shipment.services.map(s => (
                        <div class="mt-2 flex flex-col">
                            <label for={`${s.name}-input`}>
                                {Utils.capitalize(s.name)} service cost
                            </label>
                            <input type="number" class="mt-1"
                                value={this.quote.bids.filter(b => b.service_uuid === s.uuid)[0].amount}
                                oninput={(e) => {
                                    this.quote.bids.filter(b => b.service_uuid === s.uuid)[0].amount = e.target.value;
                                }} />
                        </div>
                    ))}
                </div>
                <div class="mt-6 flex justify-end">
                    <Button active={false} callback={() => this.close(false)}>
                        Cancel
                    </Button>
                    <div class="ml-3">
                        <Button callback={() => this.submit()}>
                            {this.create_loading ? (
                                <Loading color="light" class="w-8" />
                            ) : ''}
                            Submit quote
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}