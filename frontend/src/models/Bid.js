import Service from './Service';

export default class Bid {
    constructor({
        uuid = '',
        service_uuid = '',
        service = null,
        amount = 0,
        stripe_price_id = ''
    }) {
        this.uuid = uuid;
        this.service_uuid = service_uuid;
        this.service = new Service(service);
        this.amount = amount / 100;
        this.stripe_price_id = stripe_price_id;
    }

    serialize() {
        return {
            amount: parseInt(this.amount*100),
            service_uuid: this.service_uuid,
        };
    }
}