export default class Quote {
    constructor({
        uuid = '',
        owner_uuid = '',
        shipment_uuid = '',
        price = 0,
    }) {
        this.uuid = uuid;
        this.owner_uuid = owner_uuid;
        this.shipment_uuid = shipment_uuid;
        this.price = price;
    }
}