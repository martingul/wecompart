import m from 'mithril';
import Api from '../Api';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import ShipmentEdit from '../components/ShipmentEdit';
import ShipmentList from '../components/ShipmentList';
import Shipment from '../models/Shipment';

export default class ShipmentsView {
    constructor(vnode) {
        console.log('construct ShipmentsView');
        this.shipments = [];
        this.loading = false;
        this.new_shipment = false;
    }

    oninit(vnode) {
        this.loading = true;
        Api.read_shipments().then(res => {
            this.shipments = res === null ? [] : res.map(s => new Shipment(s));
            console.log(this.shipments);
        }).catch(e => {
            console.log(e);
            m.route.set('/auth/signin');
        }).finally(() => {
            this.loading = false;
        });
    }
    
    view(vnode) {
        if (this.new_shipment) {
            return <ShipmentEdit close={() => this.new_shipment = false} />
        }

        if (this.shipments.length === 0 && this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
            );
        }

        if (this.shipments.length === 0 && !this.loading) {
            return (
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
                            onclick={() => this.new_shipment = true}>
                            <Icon name="plus" class="w-4" />
                            <span class="ml-2">
                                New shipment
                            </span>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <ShipmentList shipments={this.shipments} />
        );
    }
}