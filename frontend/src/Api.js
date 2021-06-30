import m from 'mithril';

export default class Api {
    static API_ROOT = 'http://localhost:5000';

    static websocket = new WebSocket(
        `ws://localhost:5000/?key=${Api.encode_session(Api.get_session())}`
    );

    static get_session() {
        const token = localStorage.getItem('token');
        const uuid = localStorage.getItem('uuid');
        return {token, uuid};
    }

    static set_session(session) {
        localStorage.setItem('token', session.token);
        localStorage.setItem('uuid', session.uuid);
    }

    static remove_session() {
        localStorage.removeItem('token');
        localStorage.removeItem('uuid');
    }

    static encode_session(session_decoded) {
        return btoa(
            [session_decoded.token, session_decoded.uuid].join(':')
        );
    }

    static decode_session(session_encoded) {
        const session = atob(session_encoded).split(':');
        return {
            token: session[0],
            uuid: session[1],
        };
    }

    static get_username() {
        return localStorage.getItem('username');
    }

    static set_username(username) {
        localStorage.setItem('username', username);
    }

    static remove_username() {
        localStorage.removeItem('username');
    }

    static clear_storage() {
        Api.remove_session();
        Api.remove_username();
    }
    
    static authenticate(args) {
        return m.request({
            method: 'POST',
            url: `${this.API_ROOT}/auth/`,
            body: {
                username: args.username,
                password: args.password
            },
        });
    }

    static signout(args) {
        return m.request({
            method: 'DELETE',
            url: `${this.API_ROOT}/auth/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`}
        });
    }

    static read_shippers(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/shippers/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static read_self(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/users/me`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`}
        })
    }

    static create_user(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/users/`,
            body: {
                username: args.username,
                password: args.password,
            },
        });
    }

    static read_user(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/users/${args.user_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static read_locations(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/shipments/locations`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            params: { q: args.q },
        });
    }

    static read_shipments(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/shipments/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static create_shipment(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/shipments/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.shipment,
        });
    }

    static read_shipment(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}?access_token=${args.access_token}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static update_shipment(args) {
        return m.request({
            method: 'PATCH',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.patch,
        });
    }

    static delete_shipment(args) {
        return m.request({
            method: 'DELETE',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static download_shipment(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}/download`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            responseType: 'blob',
            params: {format: args.format}
        });
    }

    static create_shipment_item(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}/items/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.item,
        });
    }
    
    static read_shipment_item(args) {

    }

    static update_shipment_item(args) {
        return m.request({
            method: 'PATCH',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}/items/${args.item_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.patch,
        });
    }

    static delete_shipment_item(args) {
        return m.request({
            method: 'DELETE',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}/items/${args.item_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static create_shiptment_quote(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/shipments/${args.shipment_id}/quotes/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.quote,
        });
    }

    static read_messages(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/messages/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static create_message(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/messages/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.message,
        });
    }

    static read_notifications(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/notifications/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        }); 
    }
}