import Api from '../Api';
import Utils from '../Utils';
import Item from './Item';

export default class Shipment {
    constructor({
        uuid = null,
        owner_uuid = null,
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
        // TODO instead of having *.value, pass field as {field} for reference?
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

    get_total_value_fmt() {
        return Utils.format_money(
            this.total_value.value, this.currency.value
        );
    }

    get_total_item_quantity() {
        return this.items.map(item => item.quantity).reduce((a, c) => a + c);
    }

    get_total_item_weight() {
        return this.items.map(item => item.weight).reduce((a, c) => a + c);
    }

    serialize() {
        return {
            status: this.status,
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

    create() {
        return Api.create_shipment({
            shipment: this.serialize()
        });
    }

    update() {
        return Api.update_shipment({
            shipment_id: this.uuid,
            patch: this.serialize()
        });
    }

    delete() {
        return Api.delete_shipment({
            shipment_id: this.uuid
        });
    }

    create_items() {
        this.items.filter(item => item.uuid === null).forEach(item => {
            Api.create_shipment_item({
                shipment_id: this.uuid,
                item: item.serialize()
            }).then(res => {
                item.uuid = res.uuid;
                console.log(res);
            }).catch(e => {
                console.log(e);
            });
        });
    }

    update_items() {
        /* TODO only update items that have changed? (How to know if it changed) */
        this.items.filter(item => item.uuid !== null).forEach(item => {
            Api.update_shipment_item({
                shipment_id: this.uuid,
                item_id: item.uuid,
                patch: item.serialize()
            }).then(res => {
                console.log(res);
            }).catch(e => {
                console.log(e);
            });
        });
    }

    delete_items() {
        this.items.filter(item => item.delete).forEach(item => {
            Api.delete_shipment_item({
                shipment_id: this.uuid,
                item_id: item.uuid
            }).then(res => {
                console.log(res);
            }).catch(e => {
                console.log(e);
            });
        });
        this.items = this.items.filter(item => !item.delete);
    }
}