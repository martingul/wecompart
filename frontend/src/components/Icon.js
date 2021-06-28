import m from 'mithril';
import feather from 'feather-icons';

export default class Icon {
    constructor(vnode) {
        this.svg = feather.icons[vnode.attrs.name].toSvg({class: vnode.attrs.class});
    }

    view(vnode) {
        delete vnode.attrs.class;
        return m('div', vnode.attrs, m.trust(this.svg));
    }
}