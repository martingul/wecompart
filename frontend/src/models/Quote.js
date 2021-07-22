import Api from "../Api";

export default class Quote {
    static status_colors = {
        'pending': 'blue',
        'accepted': 'green',
        'declined': 'red,'
    };

    constructor({
        uuid = '',
        owner_uuid = '',
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
        this.owner_uuid = owner_uuid;
        this.shipment_uuid = shipment_uuid;
        this.status = status;
        this.delivery_date = {value: delivery_date};
        this.comments = comments;
        this.bids = bids;
        this.stripe_quote_id = stripe_quote_id;
        this.stripe_data = stripe_data;
        this.created_at = created_at;
        this.updated_at = updated_at;

        this.is_cheapest = false;
        this.is_earliest = false;
    }

    get_total_bid() {
        return this.bids.map(bid => bid.amount).reduce((a, c) => a + c, 0);
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

    serialize() {
        return {
            shipment_uuid: this.shipment_uuid,
            status: this.status,
            delivery_date: this.delivery_date.value,
            comments: this.comments,
            bids: this.bids,
        };
    }

    create() {
        return Api.create_quote({
            quote: this.serialize()
        });
    }

    update() {
        return Api.update_quote({
            quote_id: this.uuid,
            patch: this.serialize()
        });
    }

    delete() {
        return Api.delete_quote({
            quote_id: this.uuid,
        });
    }
}