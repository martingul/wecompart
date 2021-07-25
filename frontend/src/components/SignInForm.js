import m from 'mithril';
import Icon from './Icon';
import PasswordInput from './PasswordInput';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Loading from './Loading';

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
                            Forgot password?
                        </div> */}
                    </div>
                    <PasswordInput bind={this.auth.password} />
                </div>
                <input class="hidden" type="submit"/>
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
                    <Button callback={(e) => this.signin(e)}>
                        {this.auth.loading ? (
                            <Loading color="light" class="w-8" /> 
                        ) : (
                            <Icon name="arrow-right" class="w-5 mr-1.5" />
                        )}
                        <span>
                            Log in
                        </span>
                    </Button>
                    <div class="mt-4 text-center">
                        <span class="text-gray-700 mr-2">
                            Don't have an account?
                        </span>
                        <ButtonLink callback={() => {
                            this.auth.switch_action();
                            m.route.set('/auth/signup');
                        }}>
                            Sign up
                        </ButtonLink>
                    </div>
                </div>
            </form>
        );
    }
}