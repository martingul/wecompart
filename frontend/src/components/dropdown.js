import m from 'mithril';

export default class Dropdown {
    constructor(vnode) {
        console.log('construct Dropdown');
        this.callback = vnode.attrs.callback;
        this.values = vnode.attrs.values;
        console.log(vnode.attrs.fullwidth);
        this.fullwidth = vnode.attrs.fullwidth !== undefined ? vnode.attrs.fullwidth : true;
    }

    handle_click(e, value) {
        this.callback(value);
    }

    view(vnode) {
        return (
            <div class={(this.fullwidth ? 'w-full' : '')
                + ' absolute overflow-y-auto z-10 mt-1 shadow border border-gray-200 bg-white'}>
                {this.values.map(value => {
                    return (
                        <div class="w-full cursor-pointer py-1 px-2 border-b last:border-b-0 hover:bg-gray-100 whitespace-nowrap overflow-hidden"
                            onclick={(e) => this.handle_click(e, value)}>
                            {value}
                        </div>
                    );
                })}
			</div>
        );
    }
}