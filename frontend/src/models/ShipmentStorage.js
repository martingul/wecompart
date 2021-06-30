export default class ShipmentStorage {
    static shipments = [];

    static create_shipment(s) {
        ShipmentStorage.shipments.push(s);
    }

    static delete_shipment(s) {
        ShipmentStorage.shipments = ShipmentStorage.shipments
            .filter(_s => _s.uuid !== s.uuid);
    }
}