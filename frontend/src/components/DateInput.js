import m from 'mithril';

export default class DateInput {
    constructor(vnode) {
        this.model = vnode.attrs.bind;
        this.input_id = vnode.attrs.id;
        this.min = vnode.attrs.min ? vnode.attrs.min : '';
    }

    view(vnode) {
        return (
            <input type="date" id={this.input_id} min={this.min} value={this.model.value}
                oninput={(e) => {this.model.value = e.target.value}} />
        );
    }
}