import m from 'mithril';

export default class Table {
    constructor(vnode) {
        console.log('construct Table');
        this.collection = vnode.attrs.collection ? vnode.attrs.collection : [];
        this.fields = vnode.attrs.fields ? vnode.attrs.fields : [];
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};

        this.sortable = this.fields.map(field => {
            if (field.type === 'string') {
                field.cmp = (l, r) => l.localeCompare(r)
            }
            if (field.type === 'number' || field.type === 'date') {
                field.cmp = (l, r) => r - l;
            }
            field.active = false;
            field.desc = true;
            return field;
        });

        this._sort_state = null;
    }

    get sort_state() {
        return this._sort_state;
    }

    set sort_state(sort_state) {
        if (this._sort_state && this._sort_state !== sort_state) {
            this._sort_state.desc = true;
            this._sort_state.active = false;
        }

        this._sort_state = sort_state;

        if (this._sort_state.active) {
            this._sort_state.desc = !this._sort_state.desc;
            this.collection.reverse();
            return;
        }

        this._sort_state.active = true;
        this.collection.sort(this._sort_state.cmp);
    }

    view(vnode) {
        return (               
            <table>
                <tr class="whitespace-nowrap text-xs">
                    {this.sortable.map(s => {
                        if (s.label === '') {
                            return <th class="w-auto py-2"></th>
                        }
                        
                        return (
                            <th class="w-auto py-2">
                                <button class="w-full flex items-center"
                                    onclick={() => this.sort_state = s}>
                                    <span class={`w-full text-xs uppercase font-bold ${s.type === 'number' ? 'text-right' : 'text-left'}`}>
                                        <span class="border-b border-dotted border-gray-600">
                                            {s.label}
                                        </span>
                                    </span>
                                    <div class={s.active && this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">
                                            ▾
                                        </span>
                                    </div>
                                    <div class={s.active && !this.sort_state.desc ? 'block' : 'hidden'}>
                                        <span class="ml-2">
                                            ▴
                                        </span>
                                    </div>
                                </button>
                            </th>
                        );
                    })}
                </tr>
                {vnode.children}
            </table>
        );
    }
}