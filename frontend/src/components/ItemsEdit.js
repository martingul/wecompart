import m from 'mithril';
import Utils from '../Utils';
import Icon from './Icon';
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
                <button class="flex justify-center items-center whitespace-nowrap mx-2 px-2 py-1 rounded
                    text-gray-800 hover:text-black bg-green-100 hover:bg-green-200 hover:shadow transition-all"
                    onclick={() => this.create()}>
                    <Icon name="plus" class="w-4" />
                    <span class="ml-2">
                        Add item
                    </span>
                </button>
            </div>
        );
    }
}