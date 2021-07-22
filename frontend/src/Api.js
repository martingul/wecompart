import m from 'mithril';

export default class Api {
    static API_ROOT = 'http://localhost:5000';

    static websocket = new WebSocket(
        `ws://localhost:5000/?key=${Api.encode_session(Api.get_session())}`
    );

    static websocket_handlers = [];

    static register_websocket_handler(handler) {
        if (Api.websocket_handlers.filter(h => h.name === handler.name).length === 0) {
            Api.websocket_handlers.push(handler);
        }
    }

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
        });
    }

    static create_user(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/users/`,
            body: args.user,
        });
    }

    static read_user(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/users/${args.user_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static onboard_user(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/users/onboard`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static read_locations(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/locations`,
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
        let url = `${Api.API_ROOT}/shipments/${args.shipment_id}`;
        if (args.access_token) {
            url += `?access_token=${args.access_token}`;
        }
        return m.request({
            method: 'GET',
            url: url,
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
        return;
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

    static create_quote(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/quotes/`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.quote,
        });
    }

    static read_quote(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/quotes/${args.quote_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static update_quote(args) {
        return m.request({
            method: 'PATCH',
            url: `${Api.API_ROOT}/quotes/${args.quote_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.patch,
        });
    }

    static delete_quote(args) {
        return m.request({
            method: 'DELETE',
            url: `${Api.API_ROOT}/quotes/${args.quote_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static checkout_quote(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/quotes/${args.quote_id}/checkout`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static release_quote(args) {
        return m.request({
            method: 'POST',
            url: `${Api.API_ROOT}/quotes/${args.quote_id}/release`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
        });
    }

    static download_quote(args) {
        return m.request({
            method: 'GET',
            url: `${Api.API_ROOT}/quotes/${args.quote_id}/download`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            responseType: 'blob',
            extract: (xhr) => {
                const header = xhr.getResponseHeader('content-disposition');
                const filename_regex = /(?<=").*[.]pdf(?=")/;
                const filename_match = header.match(filename_regex);
                let filename = 'Quote';
                if (filename_match.length > 0) {
                    filename = filename_match[0];
                }
                return {
                    filename: filename,
                    blob: xhr.response,
                };
            },
        });
    }

    static download_quote_url(args) {
        return `${Api.API_ROOT}/quotes/${args.quote_id}/download`;
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

    static update_notification(args) {
        return m.request({
            method: 'PATCH',
            url: `${Api.API_ROOT}/notifications/${args.notification_id}`,
            headers: {'Authorization': `Bearer ${Api.encode_session(Api.get_session())}`},
            body: args.patch,
        });
    }
}