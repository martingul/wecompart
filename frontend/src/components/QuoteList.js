import m from 'mithril';
import Quote from './Quote';

export default class QuoteList {
    constructor(vnode) {
        this.quotes = vnode.attrs.quotes ? vnode.attrs.quotes : [];
    }

    view(vnode) {
        return (
            <div>
                {this.quotes.map(q => <Quote quote={q} />)}
            </div>
        );
    }
}