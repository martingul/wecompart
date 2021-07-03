import m from 'mithril';
import Api from '../Api';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import Title from '../components/Title';
import Table from '../components/Table';
import Button from '../components/Button';
import ShipmentTableRow from '../components/ShipmentTableRow';
import Shipment from '../models/Shipment';
import ShipmentStorage from '../models/ShipmentStorage';
import AppView from './App';

export default class ShipmentsView {
    constructor(vnode) {
        console.log('construct ShipmentsView');
        this.loading = false;
    }

    oninit(vnode) {
        if (ShipmentStorage.shipments.length === 0) {
            this.loading = true;
            Api.read_shipments().then(res => {
                if (res === null) {
                    ShipmentStorage.shipments = [];
                } else {
                    ShipmentStorage.shipments = res.map(s => new Shipment(s));
                }
            }).catch(e => {
                console.log(e);
                m.route.set('/auth/login');
            }).finally(() => {
                this.loading = false;
            });
        }
    }

    view(vnode) {
        if (ShipmentStorage.shipments.length === 0 && this.loading) {
            return (
                <AppView>
                    <div class="flex justify-center">
                        <div class="my-8 flex items-center text-gray-600">
                            <Loading class="w-12" />
                        </div>
                    </div>
                </AppView>
            );
        }

        if (ShipmentStorage.shipments.length === 0 && !this.loading) {
            return (
                <AppView>
                    <div class="flex justify-center">
                        <div class="my-2 flex flex-col items-center">
                            <div class="my-4 text-gray-200">
                                <Icon name="wind" class="w-12 h-12" />
                            </div>
                            <div class="mt-1 mb-6 text-gray-600">
                                <span>
                                    No shipments yet.
                                </span>
                            </div>
                            <Button icon="plus" text="New shipment"
                                callback={() => m.route.set('/shipments/new')} />
                        </div>
                    </div>
                </AppView>
            );
        }

        return (
            <AppView>
                <div class="flex flex-col">
                    <div class="mb-6 flex items-start justify-between">
                        <Title>
                            Shipments
                        </Title>
                        <Button icon="plus" text="Create shipment"
                            callback={() => m.route.set('/shipments/new')} />
                    </div>
                    <Table collection={ShipmentStorage.shipments}
                        fields={[
                            {label: 'value', attr: 'total_value', type: 'number'},
                            {label: '', attr: 'currency', type: 'string'},
                            {label: '', attr: 'status', type: 'string'},
                            {label: 'pickup', attr: 'pickup_address_short', type: 'string'},
                            {label: 'delivery', attr: 'delivery_address_short', type: 'string'},
                            {label: 'date', attr: 'pickup_date', type: 'date'},
                        ]}>
                        {ShipmentStorage.shipments.map(s =>
                            <ShipmentTableRow key={s.uuid} shipment={s} 
                                callback={(s) => {
                                    if (s.status === 'draft') {
                                        m.route.set('/shipments/:id/edit', {id: s.uuid});
                                    } else {
                                        m.route.set('/shipments/:id', {id: s.uuid});
                                    }
                                }}
                            />
                        )}
                    </Table>
                    <div class="my-2">
                        <span class="text-black">
                            {ShipmentStorage.shipments.length}
                        </span>
                        <span class="text-gray-600 ml-1.5">
                            {ShipmentStorage.shipments.length === 1 ? 'shipment' : 'shipments'}
                        </span>
                    </div>
                </div>
            </AppView>
        );
    }
}