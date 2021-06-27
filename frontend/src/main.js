import m from 'mithril';
import Api from './api';
import Loading from './components/Loading';
import LandingView from './views/landing';
import AuthView from './views/Auth';
import ShipmentView from './views/shipment';
import ShipmentList from './components/shipment-list';
import ShipmentEdit from './components/shipment-edit';
import LayoutView from './views/layout';
import MessagesView from './views/messages';

class Main {
    constructor(vnode) {
        this.signed_in = false;
        this.loading = false;
    }

    oninit(vnode) {
        this.loading = true;
        
        Api.read_self().then(res => {
            this.signed_in = true;
            // TODO connect websocket here
        }).catch(e => {
            Api.clear_storage();
            this.signed_in = false;
        }).finally(() => {
            console.log('signed in: ', this.signed_in);
            this.loading = false;
            setTimeout(() => m.redraw(), 2000);
        });
    }

    view(vnode) {
        if (this.loading) {
            return (
                <main>
                    <div class="flex justify-center">
                        <div class="my-8 flex items-center text-gray-600">
                            <Loading class="w-12" />
                        </div>
                    </div>
                </main>
          );
        } else if (this.signed_in) {
            m.route.set('/shipments');
        } else {
            return <LandingView />
        }
    }
}

m.route(document.body, '/', {
    '/': {render: () => <Main />},
    '/auth/signup': {render: () => <AuthView action="signup" />},
    '/auth/signin': {render: () => <AuthView action="signin" />},
    '/shipments': {render: () => <LayoutView><ShipmentList /></LayoutView>},
    '/shipments/new': {render: () => <LayoutView><ShipmentEdit /></LayoutView>},
    '/shipments/:id': {render: (vnode) => <LayoutView><ShipmentView id={vnode.attrs.id} /></LayoutView>},
    '/messages': {render: () => <LayoutView><MessagesView /></LayoutView>}
    // '/:404...': errorPageComponent
});