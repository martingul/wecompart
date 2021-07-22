export default class ShipmentStorage {
    static shipments = [];
    static fetched = false;

    static add(shipment) {
        ShipmentStorage.shipments.push(shipment);
    }

    static remove(shipment) {
        ShipmentStorage.shipments = ShipmentStorage.shipments
            .filter(s => s.uuid !== shipment.uuid);
    }

    static get_by_id(id) {
        const shipments = ShipmentStorage.shipments.filter(s => s.uuid === id);
        if (shipments.length === 0) {
            return null;
        } else {
            return shipments[0];
        }
    }
}