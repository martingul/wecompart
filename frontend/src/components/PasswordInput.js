import m from 'mithril';
import Icon from './Icon';

export default class PasswordInput {
    constructor(vnode) {
        this.show_password = false;
    }

    view(vnode) {
        return (
            <div class="relative">
                <input class="mt-1 border transition duration-150 border-gray-300 bg-gray-50 rounded"
                    id="password-input" spellcheck="false" minlength="6" required
                    type={this.show_password ? 'text' : 'password'}
                    placeholder={vnode.attrs.placeholder}
                    value={vnode.attrs.value}
                    oninput={vnode.attrs.oninput}/>
                <div class="absolute inset-y-0 right-0 flex items-center px-3 mt-1 cursor-pointer text-gray-600 hover:text-gray-700"
                    onclick={() => this.show_password = !this.show_password}>
                    <div class={this.show_password ? 'hidden' : ''}>
                        <Icon name="eye" class="w-5" />
                    </div>
                    <div class={this.show_password ? '' : 'hidden'}>
                        <Icon name="eye-off" class="w-5" />
                    </div>
                </div>
            </div>
        );
    }
}