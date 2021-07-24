import m from 'mithril'

export default class Title {
    view(vnode) {
        return (
            <span class="font-semibold text-3xl text-gray-800">
                {vnode.children}
            </span>
        );
    }
}