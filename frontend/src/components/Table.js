import m from 'mithril';

export default class Table {
    constructor(vnode) {
        console.log('construct Table');
        this.collection = vnode.attrs.collection ? vnode.attrs.collection : [];
        this.fields = vnode.attrs.fields ? vnode.attrs.fields : [];
        this.callback = vnode.attrs.callback ? vnode.attrs.callback : () => {};

        this.sortable = this.fields.map(field => {
            if (field.type === undefined) {
                field.active = false;
                field.desc = true;
                return field;
            }

            if (field.attr === undefined) {
                field.attr = field.label;
            }

            if (field.type === 'string') {
                field.cmp = (l, r) => {
                    let l_value = l[field.attr];
                    if (l_value.value !== undefined) {
                        l_value = l_value.value;
                    }

                    let r_value = r[field.attr];
                    if (r_value.value !== undefined) {
                        r_value = r_value.value;
                    }

                    return l_value.localeCompare(r_value)
                }
            }
            if (field.type === 'number') {
                field.cmp = (l, r) => {
                    let l_value = l[field.attr];
                    if (l_value.value !== undefined) {
                        l_value = l_value.value;
                    }

                    let r_value = r[field.attr];
                    if (r_value.value !== undefined) {
                        r_value = r_value.value;
                    }

                    return l_value - r_value;
                }
            }

            if (field.type === 'date') {
                field.cmp = (l, r) => {
                    let l_value = l[field.attr];
                    if (l_value.value !== undefined) {
                        l_value = l_value.value;
                    }

                    let r_value = r[field.attr];
                    if (r_value.value !== undefined) {
                        r_value = r_value.value;
                    }

                    if (!l_value instanceof Date) {
                        l_value = Date.parse(l_value)
                    }

                    if (!r_value instanceof Date) {
                        r_value = Date.parse(r_value)
                    }

                    return l_value - r_value;
                }
            }

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
            <table class="w-full">
                <tr class="whitespace-nowrap text-xs">
                    {this.sortable.map(s => {
                        if (s.label === '') {
                            return <th class="w-auto py-2"></th>
                        }
                        
                        return (
                            <th class={`w-auto py-1., ${s.type === 'number' ? 'text-right' : 'text-left'}`}>
                                {this.collection.length > 0 ?
                                    <button class="text-gray-600"
                                        onclick={() => this.sort_state = s}>
                                        <span class="mr-1 text-xs uppercase border-b border-dotted border-gray-600">
                                            {s.label}
                                        </span>
                                        <span class={s.active && this.sort_state.desc ? 'inline' : 'hidden'}>
                                            ▾
                                        </span>
                                        <span class={s.active && !this.sort_state.desc ? 'inline' : 'hidden'}>
                                            ▴
                                        </span>
                                    </button>
                                    :
                                    <span class="font-normal text-gray-600 text-xs uppercase">
                                        {s.label}
                                    </span>
                                }
                            </th>
                        );
                    })}
                </tr>
                {vnode.children}
            </table>
        );
    }
}