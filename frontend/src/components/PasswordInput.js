import m from 'mithril';
import Icon from './Icon';

export default class PasswordInput {
    constructor(vnode) {
        this.model = vnode.attrs.bind;
        this.placeholder = vnode.attrs.placeholder ? vnode.attrs.placeholder : '';
        this.requirements = vnode.attrs.requirements ? vnode.attrs.requirements : false;
        this.show_password = false;
        this.show_requirements = false; // XXX move to model validation
    }

    view(vnode) {
        return (
            <div class="flex flex-col">
                <div class="relative">
                    <input id="password-input" spellcheck="false" minlength="6" required
                        type={this.show_password ? 'text' : 'password'}
                        placeholder={this.placeholder}
                        value={this.model.value}
                        oninput={(e) => {
                            this.model.value = e.target.value;
                            if (this.model.value.length >= 6) {
                                this.show_requirements = false;
                            } else {
                                this.show_requirements = true;
                            }
                        }}
                        onfocus={() => {
                            if (this.model.value.length < 6) {
                                this.show_requirements = true;
                            }
                        }}
                        onblur={() => {
                            this.show_requirements = false;
                        }}/>
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
                <div class="h-4 mt-0.5">
                    <div class={this.requirements && this.show_requirements ? 'block' : 'hidden'}>
                        <span class="text-gray-500 text-sm">
                            Your password must be at least 6 characters
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}