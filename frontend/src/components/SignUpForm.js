import m from 'mithril';
import Auth from '../models/Auth';
import Icon from './Icon';
import Loading from './Loading';
import PasswordInput from './PasswordInput';

export default class SignUpForm {
    constructor(vnode) {
        this.auth = vnode.attrs.auth;
    }

    submit(e) {
        e.preventDefault();
        this.auth.submit().then(res => {
            if (res) m.route.set('/');
        }).catch(_ => {});
    }

    view(vnode) {
        return (
            <form onsubmit={(e) => this.submit(e)}>
                <div class="flex flex-col">
                    <label class="text-gray-600" for="email-input">
                        Enter your email
                    </label>
                    <input class="mt-1 border transition duration-150 border-gray-300 bg-gray-50 rounded"
                        id="email-input" type="email" placeholder="user@example.com" spellcheck="false" required
                        value={this.auth.email}
                        oninput={(e) => this.auth.email = e.target.value}/>
                </div>
                <div class="flex flex-col mt-4">
                    <label class="text-gray-600" for="password-input">
                        Choose a password
                    </label>
                    <PasswordInput placeholder="6 characters min."
                        value={this.auth.password}
                        oninput={(e) => this.auth.password = e.target.value}/>
                </div>
                <div class={this.auth.error !== '' ? 'block' : 'hidden'}>
                    <div class="mt-4 flex items-center px-2 py-1 rounded bg-red-100 text-red-600" id="form-error">
                        <Icon name="alert-triangle" class="w-4" />
                        <span class="ml-2">
                            {this.auth.error}
                        </span>
                    </div>
                </div>
                <input class="hidden" type="submit"/>
                <div class="mt-4">
                    <button type="button" class="flex items-center justify-center w-full px-4 xs:px-10 py-2 rounded shadow-md hover:shadow-lg
                        transition duration-150 bg-indigo-500 hover:bg-indigo-400 text-white"
                        onclick={(e) => this.submit(e)}
                        disabled={!this.auth.can_submit()}>
                        <div class={this.auth.busy ? 'block' : 'hidden'}>
                            <Loading color="light" class="w-8" />
                        </div>
                        <span class="font-bold">
                            Continue
                        </span>
                        <Icon name="arrow-right" class="w-4 ml-2" />
                    </button>
                    <div class="mt-4 text-center">
                        <span class="text-gray-700">
                             Have an account?
                        </span>
                        <m.route.Link href="/auth/signin" options={{replace: true}}
                            onclick={() => this.auth.switch_action()}>
                            <button type="button" class="ml-2 cursor-pointer text-indigo-500 hover:text-indigo-600">
                                Sign in
                            </button>
                        </m.route.Link>
                    </div>
                </div>
            </form>
        );
    }
}