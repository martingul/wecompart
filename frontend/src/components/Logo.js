import m from 'mithril';
import logo from '../assets/logo.png';

export default class Logo {
    view(vnode) {
        return (
            <img src={logo} style="width: 128px;"/>
        )
    }
}