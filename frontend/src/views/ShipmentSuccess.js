import m from 'mithril';
import success_img from '../assets/success.svg';
import Button from '../components/Button';
import InfoMessage from '../components/InfoMessage';
import AppView from './App';

export default class ShipmentSuccessView {
    constructor(vnode) {
        console.log('construct ShipmentSuccess');
        this.shipment_id = vnode.attrs.id;
    }

    view(vnode) {
        return (
            <AppView>
                <div class="flex flex-col items-center">
                    <div class="flex flex-col w-1/2">
                        <img src={success_img} />
                        <InfoMessage class="my-6">
                            Shippers have been notified of your listing and will get back to you soon.
                        </InfoMessage>
                        <div class="flex flex-col">
                            <Button callback={() => m.route.set('/shipments/:id', {id: this.shipment_id})}>
                                View
                            </Button>
                        </div>
                        <div class="mt-2 flex flex-col">
                            <Button active={false} callback={() => m.route.set('/shipments')}>
                                Back to shipments
                            </Button>
                        </div>
                    </div>
                </div>
            </AppView>
        );
    }
}