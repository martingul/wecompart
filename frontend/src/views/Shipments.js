import m from 'mithril';
import mailbox_img from '../../assets/mailbox.svg';
import Api from '../Api';
import Loading from '../components/Loading';
import Title from '../components/Title';
import Table from '../components/Table';
import Button from '../components/Button';
import Icon from '../components/Icon';
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
        if (!ShipmentStorage.fetched) {
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
                ShipmentStorage.fetched = true;
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
                        <div class="w-1/2 my-2 flex flex-col items-center">
                            <img class="w-60" src={mailbox_img} />
                            <div class="flex flex-col">
                                <span class="mt-6 text-xl font-bold text-black">
                                    Create your first shipment
                                </span>
                                <span class="my-1 text-gray-500">
                                    Create a shipment listing to start receiving quotes from shippers.
                                </span>
                                <span class="mt-6 self-end">
                                    <Button callback={() => m.route.set('/shipments/new')}>
                                        <Icon name="plus" class="w-5 mr-1.5" />
                                        <span>
                                            Create shipment
                                        </span>
                                    </Button>
                                </span>
                            </div>
                        </div>
                    </div>
                </AppView>
            );
        }

        return (
            <AppView>
                <div class="flex flex-col">
                    <div class="flex items-center justify-between pb-3 border-b border-gray-300">
                        <Title>
                            Shipments
                        </Title>
                        <Button active={false} callback={() => m.route.set('/shipments/new')}>
                            <Icon name="plus" class="w-5 mr-1.5" />
                            <span>
                                Create shipment
                            </span>
                        </Button>
                    </div>
                    <div class="mt-4">
                        <Table collection={ShipmentStorage.shipments}
                            fields={[
                                {label: 'value', attr: 'total_value', type: 'number'},
                                {label: ''},
                                {label: 'pickup', attr: 'pickup_address_short', type: 'string'},
                                {label: ''},
                                {label: 'delivery', attr: 'delivery_address_short', type: 'string'},
                                {label: 'date', attr: 'pickup_date', type: 'date'},
                            ]}>
                            {ShipmentStorage.shipments.map(s =>
                                <ShipmentTableRow key={s.uuid} shipment={s} />
                            )}
                        </Table>
                    </div>
                    <div class="mt-2">
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