import m from 'mithril';
import AppView from './App';
import Api from '../Api';
import ShipmentStorage from '../models/ShipmentStorage';
import Shipment from '../models/Shipment';
import Quote from '../models/Quote';
import Button from '../components/Button';
import DateInput from '../components/DateInput';
import Loading from '../components/Loading';

export default class QuoteEditView {
    constructor(vnode) {
        this.shipment_id = vnode.attrs.shipment_id;
        console.log('construct QuoteEditView', this.shipment_id);
        this.shipment = ShipmentStorage.get_by_id(this.shipment_id);
        this.loading = false;
        this.quote = null;
    }

    submit(e) {
        if (e){
            e.preventDefault();
        }
        this.loading = true;
        this.quote.create().then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            this.loading = false;
        });
    }

    oninit(vnode) {
        if (!this.shipment) {    
            this.loading = true;        
            Api.read_shipment({
                shipment_id: this.shipment_id
            }).then(s => {
                this.shipment = new Shipment(s);
                this.quote = new Quote({
                    shipment_uuid: this.shipment.uuid,
                    status: 'pending',
                });
                this.quote.bids = this.shipment.services.map(s => ({
                    service_uuid: s.uuid,
                    amount: 0,
                }));
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    view(vnode) {
        if (this.loading || !this.quote) {
            return (
                <AppView>
                    <div class="flex justify-center">
                        <div class="my-8 flex items-center text-gray-600">
                            <Loading class="w-12" />
                        </div>
                    </div>
                </AppView>
            );
        }

        return (
            <AppView>
                <form class="flex flex-col"
                    onsubmit={(e) => e.preventDefault()}>
                        <div class="flex flex-col">
                            <label class="mb-1" for="delivery-date-input">
                                Delivery date
                            </label>
                            <DateInput id="delivery-date-input" bind={this.quote.delivery_date}
                                min={(new Date(this.shipment.pickup_date.value - (24*60*60*1000))).toISOString().split('T')[0]} />
                        </div>
                        {this.shipment.services.map(s => (
                            <div class="flex flex-col">
                                <label for={`${s.name}-input`}>
                                    {s.name}
                                </label>
                                <input type="number"
                                    value={this.quote.bids.filter(b => b.service_uuid === s.uuid)[0].amount}
                                    oninput={(e) => {
                                        this.quote.bids.filter(b => b.service_uuid === s.uuid)[0].amount = e.target.value;
                                    }} />
                            </div>
                        ))}
                    <div class="mt-2 flex justify-end">
                        <Button callback={() => {
                            console.log('new quote');
                            this.submit();
                        }}>
                            Create
                        </Button>
                    </div>
                </form>
            </AppView>
        )
    }
}