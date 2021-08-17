export default class Item {
    static dim_units = ['cm', 'in'];

    constructor({
        index = 0,
        key = null,
        uuid = null,
        description = '',
        quantity = 1,
        dim_unit = 'cm',
        length = 0,
        width = 0,
        height = 0,
        weight = 0,
    }) {
        this.index = index;
        this.key = key;
        this.delete = false;

        this.uuid = uuid;
        this.description = {
            value: description,
            validate: () => this.description.value.length > 0,
        };
        this.quantity = Number(quantity);
        this.dim_unit = {
            value: dim_unit,
            validate: () => Item.dim_units.includes(this.dim_unit.value),
        };
        this.length = Number(length);
        this.width = Number(width);
        this.height = Number(height);
        this.weight = Number(weight);
        this.error = '';
    }

    serialize() {
        return {
            description: this.description.value,
            quantity: this.quantity,
            dim_unit: this.dim_unit.value,
            length: this.length,
            width: this.width,
            height: this.height,
            weight: this.weight,
        };
    }
}