import m from 'mithril';
import RootView from './views/Root';
import AuthView from './views/Auth';

m.route(document.body, '/', {
    '/': {render: () => <RootView />},
    '/auth/signup': {render: () => <AuthView action="signup" />},
    '/auth/signin': {render: () => <AuthView action="signin" />},
    // '/shipments': {render: () => <LayoutView><ShipmentList /></LayoutView>},
    // '/shipments/new': {render: () => <LayoutView><ShipmentEdit /></LayoutView>},
    // '/shipments/:id': {render: (vnode) => <LayoutView><ShipmentView id={vnode.attrs.id} /></LayoutView>},
    // '/messages': {render: () => <LayoutView><MessagesView /></LayoutView>}
    // '/:404...': errorPageComponent
});