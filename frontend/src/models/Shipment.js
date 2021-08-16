import Api from '../Api';
import Utils from '../Utils';
import Item from './Item';
import Quote from './Quote';
import Service from './Service';

export default class Shipment {
    static status_colors = {
        'draft': 'gray',
        'pending': 'blue',
        'booked': 'green',
    };

    static service_icons = {
        'shipping': 'truck',
        'packaging': 'box',
        'insurance': 'shield',
    };

    constructor({
        uuid = null,
        owner = {},
        map_url = '',
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
        quotes = [],
        created_at = '',
        updated_at = '',
    }) {
        // TODO instead of having *.value, pass field as {field} for reference?
        this.uuid = uuid;
        this.owner = owner;
        this.map_url = map_url;
        this.status = status
        this.pickup_address = {
            value: pickup_address_long,
            place_id: pickup_address_id,
        };
        this.pickup_address_short = pickup_address_short;
        this.pickup_address_formatted = Utils.format_address(pickup_address_long);
        this.delivery_address = {
            value: delivery_address_long,
            place_id: delivery_address_id,
        };
        this.delivery_address_short = delivery_address_short;
        this.delivery_address_formatted = Utils.format_address(delivery_address_long);
        this.pickup_date = {value: new Date(pickup_date)};
        this.currency = {value: currency};
        this.total_value = {value: total_value};
        this.comments = {value: comments};
        this.services = services.map(service => new Service(service));
        this.items = items.map(item => new Item(item));
        this.quotes = quotes.map(quote => new Quote(quote));
        this.created_at = created_at;
        this.updated_at = updated_at;

        this.accepted_quote = this.get_accepted_quote();
        this.flag_quotes();
    }

    serialize() {
        console.log(this.services)
        return {
            status: this.status,
            pickup_address_id: this.pickup_address.place_id,
            delivery_address_id: this.delivery_address.place_id,
            pickup_date: this.pickup_date.value,
            currency: this.currency.value,
            total_value: parseFloat(this.total_value.value),
            comments: this.comments.value,
            services: this.services.map(service => service.serialize()),
            items: this.items.map(item => item.serialize()),
        };
    }

    is_draft() {
        return this.status === 'draft';
    }

    is_booked() {
        return this.status === 'booked';
    }

    get_total_item_quantity() {
        return this.items.map(item => item.quantity).reduce((a, c) => a + c, 0);
    }

    get_total_item_weight() {
        return this.items.map(item => item.weight).reduce((a, c) => a + c, 0);
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

    checkout(quote_id) {
        return Api.checkout_quote({ quote_id: quote_id });
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

    add_quote(quote) {
        this.quotes.push(quote);
        this.flag_quotes(quote.user_uuid);
    }

    remove_quote(quote) {
        this.quotes = this.quotes.filter(q => q.uuid !== quote.uuid);
        this.flag_quotes(quote.user_uuid);
    }

    flag_quotes(user_uuid) {
        if (this.quotes.length <= 1) {
            return;
        }
        
        const earliest_quote_old = this.quotes.filter(q => q.is_earliest);
        if (earliest_quote_old.length > 0) {
            earliest_quote_old.is_earliest = false;
        }
        const earliest_quote = this.quotes.sort((l, r) => new Date(l.delivery_date.value) - new Date(r.delivery_date.value))[0];
        if (earliest_quote) {
            earliest_quote.is_earliest = true;
        }

        const cheapest_quote_old = this.quotes.filter(q => q.is_cheapest);
        if (cheapest_quote_old.length > 0) {
            cheapest_quote_old.is_cheapest = false;
        }
        const cheapest_quote = this.quotes.sort((l, r) => l.bid.value - r.bid.value)[0];
        if (cheapest_quote) {
            cheapest_quote.is_cheapest = true;
        }
    }

    get_accepted_quote() {
        const quotes = this.quotes.filter(q => q.is_accepted());
        if (quotes.length === 0) {
            return null;
        }
        return quotes[0];
    }

    paid_quote() {
        const quotes = this.quotes.filter(q => (q.is_accepted() && q.is_paid()));
        if (quotes.length === 0) {
            return null;
        }
        return quotes[0];
    }

    has_quote_with_owner(user_uuid) {
        return this.quotes.filter(q => q.owner.uuid === user_uuid).length > 0;
    }
}