import m from 'mithril';

export default class Quote {
    constructor(vnode) {
        this.quote = vnode.attrs.quote;
        console.log('construct Quote', this.quote);
    }

    view(vnode) {
        return (
            <div>
                {this.quote.price}
            </div>    
        );
    }
}