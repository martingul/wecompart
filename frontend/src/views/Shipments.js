import m from 'mithril';
import Api from '../Api';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import Title from '../components/Title';
import Table from '../components/Table';
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
                            <div class="my-1 text-gray-600">
                                <span>
                                    No shipments yet.
                                </span>
                            </div>
                            <button class="flex items-center mt-6 px-4 py-1 rounded
                                text-gray-800 hover:text-black bg-green-100 hover:bg-green-200 hover:shadow transition-all"
                                onclick={() => m.route.set('/shipments/new')}>
                                <Icon name="plus" class="w-4" />
                                <span class="ml-2">
                                    New shipment
                                </span>
                            </button>
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
                        <button class="flex items-center py-1 px-2 rounded whitespace-nowrap font-bold
                            text-white bg-indigo-500 hover:bg-indigo-600 hover:shadow transition-all"
                            onclick={() => m.route.set('/shipments/new')}>
                            <Icon name="plus" class="w-5" />
                            <span class="ml-2">
                                Create shipment
                            </span>
                        </button>
                    </div>
                    <Table collection={ShipmentStorage.shipments}
                        fields={[
                            {label: 'value', type: 'number'},
                            {label: '', type: 'string'},
                            {label: '', type: 'string'},
                            {label: 'pickup', type: 'string'},
                            {label: 'delivery', type: 'string'},
                            {label: 'date', type: 'date'},
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