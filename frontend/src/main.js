import m from 'mithril';
import RootView from './views/Root';
import AuthView from './views/Auth';
import ShipmentRead from './components/ShipmentRead';

m.route(document.body, '/', {
    '/': {render: () => <RootView />},
    '/auth/signup': {render: () => <AuthView action="signup" />},
    '/auth/login': {render: () => <AuthView action="signin" />},
    // '/shipments': {render: () => <LayoutView><ShipmentList /></LayoutView>},
    // '/shipments/new': {render: () => <LayoutView><ShipmentEdit /></LayoutView>},
    '/shipments/:id': {render: (vnode) => <ShipmentRead id={vnode.attrs.id} />},
    // '/messages': {render: () => <LayoutView><MessagesView /></LayoutView>}
    // '/:404...': errorPageComponent
});