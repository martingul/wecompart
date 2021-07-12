import m from 'mithril';
import Icon from './Icon';
import PasswordInput from './PasswordInput';
import Button from './Button';

export default class SignUpForm {
    constructor(vnode) {
        this.auth = vnode.attrs.auth;
    }

    signup(e) {
        e.preventDefault();
        this.auth.signup().then(res => {
            if (res) m.route.set('/');
        }).catch(_ => {});
    }

    oncreate(vnode) {
        vnode.dom.querySelector('#fullname-input').focus();
    }

    view(vnode) {
        return (
            <form onsubmit={(e) => this.signup(e)}>
                <div class="mb-4 font-bold text-xl">
                    Sign up
                </div>
                <div class="flex flex-col">
                    <label class="text-gray-600 mb-1" for="email-input">
                        Full name
                    </label>
                    <input id="fullname-input" type="text" spellcheck="false" required
                        value={this.auth.fullname.value}
                        oninput={(e) => this.auth.fullname.value = e.target.value}
                        onblur={() => {
                            if (this.auth.validate_fullname() || this.auth.fullname.value === '') {
                                this.auth.error = '';
                            } else {
                                this.auth.error = 'Please enter your full name.';
                            }
                        }}/>
                </div>
                <div class="mt-4 flex flex-col">
                    <label class="text-gray-600 mb-1" for="email-input">
                        Enter your email
                    </label>
                    <input id="email-input" type="email" placeholder="user@example.com" spellcheck="false" required
                        value={this.auth.email.value}
                        oninput={(e) => this.auth.email.value = e.target.value}
                        onblur={() => {
                            if (this.auth.validate_email() || this.auth.email.value === '') {
                                this.auth.error = '';
                            } else {
                                this.auth.error = 'Please enter a valid email address.';
                            }
                        }}/>
                </div>
                <div class="mt-4 flex flex-col">
                    <label class="text-gray-600 mb-1" for="password-input">
                        Choose a password
                    </label>
                    <PasswordInput bind={this.auth.password} requirements={true} />
                </div>
                <input class="hidden" type="submit"/>
                <div class="mt-4 flex flex-col">
                    <Button icon="arrow-right" loading={() => this.auth.loading}
                        callback={(e) => this.signup(e)}>
                        Continue
                    </Button>
                    <div class="mt-4">
                        <div class={this.auth.error !== '' ? 'block' : 'hidden'}>
                            <div class="flex items-center px-4 py-1 rounded bg-red-100 text-red-600" id="form-error">
                                <Icon name="alert-triangle" class="w-4" />
                                <span class="ml-4">
                                    {this.auth.error}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <span class="text-gray-700">
                             Have an account?
                        </span>
                        <m.route.Link href="/auth/login" options={{replace: true}}
                            onclick={() => this.auth.switch_action()}>
                            <button type="button" class="ml-2 text-indigo-500 hover:text-indigo-600">
                                Log in
                            </button>
                        </m.route.Link>
                    </div>
                </div>
            </form>
        );
    }
}