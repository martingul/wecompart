import Api from "../Api";

export default class Quote {
    constructor({
        uuid = '',
        owner_uuid = '',
        shipment_uuid = '',
        status = '',
        bid = 0,
        delivery_date = '',
        created_at = '',
        updated_at = '',
    }) {
        this.uuid = uuid;
        this.owner_uuid = owner_uuid;
        this.shipment_uuid = shipment_uuid;
        this.status = status;
        this.bid = {value: bid};
        this.delivery_date = {value: delivery_date};
        this.created_at = created_at;
        this.updated_at = updated_at;

        this.is_cheapest = false;
        this.is_earliest = false;
        this.is_user = false;
    }

    serialize() {
        return {
            bid: this.bid.value,
            delivery_date: this.delivery_date.value,
        };
    }

    create() {
        console.log(this.serialize())
        return Api.create_shipment_quote({
            shipment_id: this.shipment_uuid,
            quote: this.serialize()
        });
    }


}