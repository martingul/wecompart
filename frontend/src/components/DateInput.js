import m from 'mithril';

export default class DateInput {
    constructor(vnode) {
        this.model = vnode.attrs.bind;
        this.input_id = vnode.attrs.id;
        this.future = vnode.attrs.future ? vnode.attrs.future : true;
        this.today = new Date(Date.now()).toISOString().split('T')[0];
    }

    view(vnode) {
        return (
            <input type="date"
                min={this.future ? this.today : ''}
                id={this.input_id}
                value={this.model.value}
                oninput={(e) => {this.model.value = e.target.value}} />
        );
    }
}