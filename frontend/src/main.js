import m from 'mithril';
import Api from './Api';
import User from './models/User';
import LandingView from './views/Landing';
import HomeView from './views/Home';
import AuthView from './views/Auth';
import ShipmentsView from './views/Shipments';
import ShipmentSuccessView from './views/ShipmentSuccess';
import ShipmentEditView from './views/ShipmentEdit';
import ShipmentView from './views/Shipment';
import QuoteView from './views/Quote';
import AccountView from './views/Account';

function protected_endpoint(endpoint, user = User.load()) {
    if (user) {
        return endpoint;
    } else {
        m.route.set('/auth/login');
    }  
}

const root_route = {
    onmatch: (args, requested_path, route, user = User.load()) => {
        if (user) {
            return HomeView;
        } else {
            return LandingView;
        } 
    },
};

const auth_routes = {
    '/auth/signup': {
        render: () => m(AuthView, {action: 'signup'})
    },
    '/auth/login': {
        render: () => m(AuthView, {action: 'signin'})
    },
};

const _protected_routes = {
    '/shipments': ShipmentsView,
    '/shipments/new': ShipmentEditView,
    '/shipments/:id': ShipmentView,
    '/shipments/:id/success': ShipmentSuccessView,
    '/shipments/:id/edit': ShipmentEditView,
    '/quotes/:id': QuoteView,
    '/account': AccountView,
    // '/messages': MessagesView,
};

const protected_routes = Object.fromEntries(
    Object.entries(_protected_routes).map(([route, view]) => [
        route, {
            onmatch: (args, requested_path, route) => {
                return protected_endpoint(view);
            },
        }
    ])
);

const routes = {
    '/': root_route,
    ...auth_routes,
    ...protected_routes,
};

Api.websocket.onmessage = (e) => {
    Api.websocket_handlers.forEach(h => h.fn(e));
}

// TODO implement lazy loading
m.route(document.body, '/', routes);