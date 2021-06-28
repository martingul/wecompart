import m from 'mithril';
import Auth from '../models/Auth';
import Icon from './Icon';
import Loading from './Loading';
import PasswordInput from './PasswordInput';

export default class SignInForm {
    constructor(vnode) {
        this.auth = vnode.attrs.auth;
    }

    submit(e) {
        e.preventDefault();
        this.auth.submit().then(res => {
            if (res) m.route.set('/');
        }).catch(_ => {});
    }

    oncreate(vnode) {
        vnode.dom.querySelector('#email-input').focus();
    }

    view(vnode) {
        return (
            <form onsubmit={(e) => this.submit(e)}>
                <div class="mb-4 font-bold text-xl">
                    Log in
                </div>
                <div class="flex flex-col">
                    <label class="text-gray-600 mb-1" for="email-input">
                        Email
                    </label>
                    <input id="email-input" type="email" spellcheck="false" required
                        value={this.auth.email.value}
                        oninput={(e) => this.auth.email.value = e.target.value}
                        onblur={() => {
                            if (this.auth.validate_email()) {
                                this.auth.error = '';
                            } else {
                                this.auth.error = 'Please enter a valid email address.';
                            }
                        }}/>
                </div>
                <div class="flex flex-col mt-4">
                    <div class="flex">
                        <label class="text-gray-600 mb-1" for="password-input">
                            Password
                        </label>
                        {/* <div class="flex flex-grow justify-end">
                            <button class="cursor-pointer text-indigo-500 hover:text-indigo-600"
                                type="button" id="forgot-password-btn" tabindex="-1">
                                Forgot password?
                            </button>
                        </div> */}
                    </div>
                    <PasswordInput bind={this.auth.password} />
                </div>
                <input class="hidden" type="submit"/>
                <div class="mt-4">
                    <button type="button" class="my-2 flex items-center justify-center w-full px-4 xs:px-10 py-2 rounded shadow-md hover:shadow-lg
                        transition duration-150 bg-indigo-500 hover:bg-indigo-400 text-white"
                        onclick={(e) => this.submit(e)}
                        disabled={this.auth.can_submit() ? '' : 'disabled'}>
                        <div class={this.auth.busy ? 'block' : 'hidden'}>
                            <Loading color="light" class="w-8" />
                        </div>
                        <span class="font-bold">
                            Log in
                        </span>
                        <Icon name="arrow-right" class="w-4 ml-2" />
                    </button>
                    <div class="mt-4">
                        <div class={this.auth.error !== '' ? 'block' : 'hidden'}>
                            <div class="flex items-center px-2 py-1 rounded bg-red-100 text-red-600" id="form-error">
                                <Icon name="alert-triangle" class="w-4" />
                                <span class="ml-2">
                                    {this.auth.error}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 text-center">
                        <span class="text-gray-700">
                            Don't have an account?
                        </span>
                        <m.route.Link href="/auth/signup" options={{replace: true}}
                            onclick={() => this.auth.switch_action()}>
                            <button type="button" class="ml-2 cursor-pointer text-indigo-500 hover:text-indigo-600">
                                Sign up
                            </button>
                        </m.route.Link>
                    </div>
                </div>
            </form>
        );
    }
}