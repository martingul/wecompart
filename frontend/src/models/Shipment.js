import Item from "./Item";

export default class Shipment {
    constructor({
        uuid = '',
        owner_uuid = '',
        status = '',
        pickup_address_id = '',
        pickup_address_short = '',
        pickup_address_long = '',
        delivery_address_id = '',
        delivery_address_short = '',
        delivery_address_long = '',
        pickup_date = '',
        currency = 'usd',
        total_value = 0,
        comments = '',
        services = [],
        items = [],
        created_at = '',
        updated_at = '',
    }) {
        this.uuid = uuid;
        this.owner_id = owner_uuid;
        this.status = status

        this.pickup_address = {
            value: pickup_address_long,
            short: pickup_address_short,
            place_id: pickup_address_id,
        };
        this.delivery_address = {
            value: delivery_address_long,
            short: delivery_address_short,
            place_id: delivery_address_id,
        };
        this.pickup_date = {value: pickup_date};
        this.currency = {value: currency};
        this.total_value = {value: total_value};
        this.comments = {value: comments};

        this.services = services;
        this.items = items.map(item => new Item(item));

        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    serialize() {
        return {
            // status: this.save ? 'draft' : 'pending',
            pickup_address_id: this.pickup_address.place_id,
            delivery_address_id: this.delivery_address.place_id,
            pickup_date: this.pickup_date.value,
            currency: this.currency.value,
            total_value: parseFloat(this.total_value.value),
            comments: this.comments.value,
            services: this.services,
            items: this.items.map(item => item.serialize()),
        };
    }
}