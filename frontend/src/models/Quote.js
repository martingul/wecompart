export default class Quote {
    constructor({
        uuid = '',
        owner_uuid = '',
        shipment_uuid = '',
        price = 0,
        created_at = '',
        updated_at = '',
    }) {
        this.uuid = uuid;
        this.owner_uuid = owner_uuid;
        this.shipment_uuid = shipment_uuid;
        this.price = price;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}