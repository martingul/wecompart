export default class Item {
    constructor({
        index = 0,
        uuid = null, description = '', quantity = 1, dim_unit = 'cm',
        length = 0, width = 0, height = 0, weight = 0,
    }) {
        this.index = index;

        this.uuid = uuid;
        this.description = description;
        this.quantity = quantity;
        this.dim_unit = {value: dim_unit};
        this.length = length;
        this.width = width;
        this.height = height;
        this.weight = weight;
    }

    serialize() {
        return {
            uuid: this.uuid,
            description: this.description,
            quantity: this.quantity,
            dim_unit: this.dim_unit.value,
            length: this.length,
            width: this.width,
            height: this.height,
            weight: this.weight,
        };
    }
}