import m from 'mithril'

export default class Title {
    view(vnode) {
        return (
            <span class="font-semibold text-3xl text-black">
                {vnode.children}
            </span>
        );
    }
}