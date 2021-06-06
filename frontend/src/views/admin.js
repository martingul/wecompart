import m from 'mithril';
import Api from '../api';
import ShipperList from '../components/shipper-list';

export default class AdminView {
    constructor(vnode) {
        console.log('construct AdminView');
    }

    view(vnode) {
        return (
            <main>
                <div class="flex flex-col items-center">
                    <div class="w-full px-4 md:w-4/5 lg:w-1/2">
                        <div>admin</div>
                        <ShipperList />
                    </div>
                </div>
            </main>
        );
    }
}

