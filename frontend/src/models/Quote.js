import Api from "../Api";

export default class Quote {
    constructor({
        uuid = '',
        owner_uuid = '',
        shipment_uuid = '',
        status = '',
        price = 0,
        delivery_date = '',
        created_at = '',
        updated_at = '',
    }) {
        this.uuid = uuid;
        this.owner_uuid = owner_uuid;
        this.shipment_uuid = shipment_uuid;
        this.status = status;
        this.price = {value: price};
        this.delivery_date = {value: delivery_date};
        this.created_at = created_at;
        this.updated_at = updated_at;

        this.is_cheapest = false;
        this.is_earliest = false;
        this.is_user = false;
    }

    serialize() {
        return {
            price: this.price.value,
            delivery_date: this.delivery_date.value,
        };
    }

    create() {
        return Api.create_shipment_quote({
            shipment_id: this.shipment_uuid,
            quote: this.serialize()
        });
    }
}