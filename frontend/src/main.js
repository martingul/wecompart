import m from 'mithril';
import Api from './api';
import Loading from './components/loading';
import LandingView from './views/landing';
import AuthView from './views/auth';
import AdminView from './views/admin';
import ShipmentView from './views/shipment';
import ShipmentList from './components/shipment-list';
import ShipmentEdit from './components/shipment-edit';
import LayoutView from './views/layout';

// import css from './style.css';

// m.route.prefix = ''

class Main {
    constructor(vnode) {
        this.signed_in = false;
        this.loading = false;
    }

    oninit(vnode) {
        this.loading = true;
        Api.echo().then(res => {
            console.log(res);
            this.signed_in = true;
        }).catch(e => {
            console.log(e.response);
            this.signed_in = false;
        }).finally(() => {
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
    '/auth/:action': {render: () => <AuthView action={m.route.param('action')}/>},
    '/admin': {render: () => <AdminView />},
    '/shipments': {render: () => <LayoutView><ShipmentList /></LayoutView>},
    '/shipments/new': {render: () => <LayoutView><ShipmentEdit /></LayoutView>},
    '/shipments/:id': {render: (vnode) => <LayoutView><ShipmentView id={vnode.attrs.id} /></LayoutView>},
    // '/:404...': errorPageComponent
});