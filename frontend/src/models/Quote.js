import Api from '../Api';
import Bid from './Bid';

export default class Quote {
    static status_colors = {
        'pending': 'blue',
        'accepted': 'green',
        'declined': 'red,'
    };

    constructor({
        uuid = '',
        owner = {},
        shipment_uuid = '',
        status = '',
        delivery_date = '',
        comments = '',
        bids = [],
        stripe_quote_id = '',
        stripe_data = {},
        created_at = '',
        updated_at = '',
    }) {
        this.uuid = uuid;
        this.owner = owner;
        this.shipment_uuid = shipment_uuid;
        this.status = status;
        this.delivery_date = {value: delivery_date};
        this.comments = {value: comments};
        this.bids = bids.map(bid => new Bid(bid));
        this.stripe_quote_id = stripe_quote_id;
        this.stripe_data = stripe_data;
        this.created_at = created_at;
        this.updated_at = updated_at;

        this.is_cheapest = false;
        this.is_earliest = false;
    }

    serialize() {
        return {
            shipment_uuid: this.shipment_uuid,
            status: this.status,
            delivery_date: this.delivery_date.value,
            comments: this.comments.value,
            bids: this.bids.map(bid => bid.serialize()),
        };
    }

    get_total_bid() {
        return this.bids.map(bid => bid.amount).reduce((a, c) => a + c, 0);
    }

    get_bid_by_service_uuid(service_uuid) {
        const bid = this.bids.filter(b => b.service.uuid === service_uuid);
        return bid.length > 0 ? bid[0] : null;
    }

    get_status_color() {
        return Quote.status_colors[this.status];
    }

    is_pending() {
        return this.status === 'pending';
    }

    is_accepted() {
        return this.status === 'accepted';
    }

    is_declined() {
        return this.status === 'declined';
    }

    is_paid() {
        if (this.stripe_data) {
            return this.stripe_data.stripe_paid;
        } else {
            return null;
        }
    }

    create() {
        return Api.create_quote({
            quote: this.serialize()
        });
    }

    update(patch = {}) {
        if (!patch) {
            patch = this.serialize();
        }
        return Api.update_quote({
            quote_id: this.uuid,
            patch: patch
        });
    }

    delete() {
        return Api.delete_quote({
            quote_id: this.uuid,
        });
    }
}