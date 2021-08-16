export default class Service {
    constructor({
        uuid = '',
        name = '',
        shipment_uuid = '',
        stripe_product_id = '',
    }) {
        this.uuid = uuid;
        this.name = name;
        this.shipment_uuid = shipment_uuid;
        this.stripe_product_id = stripe_product_id;
    }

    serialize() {
        return {
            name: this.name,
        };
    }
}