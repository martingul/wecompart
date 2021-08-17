import m from 'mithril';
import Icon from './Icon';

export default class ErrorMessage {
    view(vnode) {
        return (
            <span class="inline-flex items-center px-4 py-1 rounded bg-red-100 text-red-600" id="form-error">
                <Icon name="alert-triangle" class="w-4" />
                <span class="ml-4">
                    {vnode.children}
                </span>
            </span>
        );
    }
}