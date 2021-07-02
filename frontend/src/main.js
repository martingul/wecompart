import m from 'mithril';
import HomeView from './views/Home';
import AuthView from './views/Auth';
import ShipmentsView from './views/Shipments';
import ShipmentEditView from './views/ShipmentEdit';
import ShipmentView from './views/Shipment';

m.route(document.body, '/', {
    '/': {render: () => <HomeView />},
    '/auth/signup': {render: () => <AuthView action="signup" />},
    '/auth/login': {render: () => <AuthView action="signin" />},
    '/shipments': {render: () => <ShipmentsView />},
    '/shipments/new': {render: () => <ShipmentEditView />},
    '/shipments/:id': {render: (vnode) => <ShipmentView id={vnode.attrs.id} />},
    '/shipments/:id/edit': {render: (vnode) => <ShipmentEditView id={vnode.attrs.id} />}
    // '/messages': {render: () => <LayoutView><MessagesView /></LayoutView>}
    // '/:404...': errorPageComponent
});