import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';
import Button from './Button';
import ItemEdit from './ItemEdit';
import Item from '../models/Item';

export default class ItemsEdit {
    constructor(vnode) {
        this.items = vnode.attrs.bind;

        if (this.items.length > 1) {
            this.items.forEach((item, i) => item.index = i);
        }
    }

    create() {
        this.items.push(new Item({
            key: Utils.generate_key(),
            index: this.items.length
        }));
    }

    delete() {
        return (index) => {
            if (this.items.length === 1) {
                return;
            }

            const item = this.items[index];

            if (item.uuid) {
                item.delete = !item.delete;
            } else {
                this.items.splice(index, 1);
                this.items.forEach((item, i) => item.index = i);
            }
        }
    }

    view(vnode) {
        return (
            <div class="flex flex-col">
                <div class="flex flex-col p-2">
                    {this.items.map(item => (
                        <ItemEdit key={item.uuid === null ? item.key : item.uuid}
                            item={item} delete={this.delete()} />
                    ))}
                </div>
                <div class="flex justify-start mx-2">
                    <Button text="Add item" icon="plus"
                        callback={() => this.create()}
                    />
                </div>
            </div>
        );
    }
}