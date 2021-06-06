import m from 'mithril';
import Api from '../api';

export default class ShipperList {
    constructor(vnode) {
        this.shippers = [];
    }

    oninit(vnode) {
        Api.read_shippers().then(res => {
            console.log(res);
            this.shippers = res;
        }).catch(e => {
            console.log(e);
        });
    }

    view(vnode) {
        return (
            <div>
                {this.shippers.map(shipper => {
                    return (
                        <div>
                            <div class="flex items-center whitespace-nowrap">
                                <div class="text-gray-600 w-full">
                                    {shipper.name}
                                </div>
                                <div>
                                    {shipper.countries}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}