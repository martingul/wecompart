import m from 'mithril';
import Icon from './Icon';
import PasswordInput from './PasswordInput';
import Button from './Button';

export default class SignInForm {
    constructor(vnode) {
        this.auth = vnode.attrs.auth;
    }

    signin(e) {
        e.preventDefault();
        this.auth.signin().then(res => {
            if (res) m.route.set('/');
        }).catch(_ => {});
    }

    oncreate(vnode) {
        vnode.dom.querySelector('#email-input').focus();
    }

    view(vnode) {
        return (
            <form onsubmit={(e) => this.signin(e)}>
                <div class="font-bold text-xl">
                    Log in
                </div>
                {this.auth.error !== '' ? (
                    <div class="mt-2">
                        <div class="flex items-center px-4 py-1 rounded bg-red-100 text-red-600" id="form-error">
                            <Icon name="alert-triangle" class="w-4" />
                            <span class="ml-4">
                                {this.auth.error}
                            </span>
                        </div>
                    </div>
                ) : ''}
                <div class="mt-4 flex flex-col">
                    <label class="text-gray-600 mb-1" for="email-input">
                        Email
                    </label>
                    <input id="email-input" type="email" spellcheck="false" required
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
                <div class="mt-2 flex flex-col">
                    <div class="flex">
                        <label class="text-gray-600 mb-1" for="password-input">
                            Password
                        </label>
                        {/* <div class="flex flex-grow justify-end">
                            <button type="button" class=" text-indigo-500 hover:text-indigo-600"
                                type="button" id="forgot-password-btn" tabindex="-1">
                                Forgot password?
                            </button>
                        </div> */}
                    </div>
                    <PasswordInput bind={this.auth.password} />
                </div>
                <input class="hidden" type="submit"/>
                <div class="mt-4 flex flex-col">
                    <Button icon="arrow-right" loading={() => this.auth.loading}
                        callback={(e) => this.signin(e)}>
                        Log in
                    </Button>
                    <div class="mt-4 text-center">
                        <span class="text-gray-700">
                            Don't have an account?
                        </span>
                        <m.route.Link href="/auth/signup" options={{replace: true}}
                            onclick={() => this.auth.switch_action()}>
                            <button type="button" class="ml-2 text-indigo-500 hover:text-indigo-600">
                                Sign up
                            </button>
                        </m.route.Link>
                    </div>
                </div>
            </form>
        );
    }
}