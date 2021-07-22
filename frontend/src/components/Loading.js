import m from 'mithril';
import loading_light from '../../assets/loading-light.svg';
import loading_dark from '../../assets/loading-dark.svg';

export default class Loading {
    constructor(vnode) {
        this.color = vnode.attrs.color;
    }

    view (vnode) {
        return (
            <img src={this.color === 'light' ? loading_light : loading_dark}
                class={vnode.attrs.class} />
        );
    }
}