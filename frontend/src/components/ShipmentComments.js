import m from 'mithril';
import Utils from '../Utils';

// TODO rewrite generic 'LongText' component
export default class ShipmentComments {
    constructor(vnode) {
        this.comments = vnode.attrs.comments;
        this.comments_short = Utils.truncate(this.comments, 10);
        this.is_long = this.comments !== this.comments_short;
        this.show_more = false;

        if (this.is_long) {
            this.comments_short = this.comments_short + '...';
        } else {
            this.show_more = true;
        }
    }

    view(vnode) {
        return (
            <div class="leading-relaxed text-gray-800">
                {this.show_more ? this.comments : this.comments_short}
                <div class={this.is_long ? 'inline-block' : 'hidden'}>
                    <button class="leading-tight ml-2 text-gray-500 border-b border-gray-500 border-dotted"
                        onclick={() => this.show_more = !this.show_more}>
                        {this.show_more ? 'less' : 'more'}
                    </button>
                </div>
            </div>
        );
    }
}