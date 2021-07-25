import m from 'mithril';
import Icon from './Icon';
import PasswordInput from './PasswordInput';
import Button from './Button';
import ButtonLink from './ButtonLink';

export default class SignUpForm {
    constructor(vnode) {
        this.auth = vnode.attrs.auth;
    }

    signup(e) {
        e.preventDefault();
        this.auth.signup().then(res => {
            console.log(res);
            if (res) {
                m.route.set('/');
            }
        }).catch(_ => {});
    }

    oncreate(vnode) {
        vnode.dom.querySelector('#fullname-input').focus();
    }

    view(vnode) {
        return (
            <form onsubmit={(e) => this.signup(e)}>
                <div class="font-bold text-xl">
                    Sign up
                </div>
                <div class="mt-4 flex flex-col">
                    <label class="text-gray-600">
                        You are
                    </label>
                    <div class="mt-2 flex justify-evenly items-center">
                        <div class={`py-1 px-4 font-bold cursor-pointer
                            ${this.auth.role !== 'shipper'
                                ? 'bg-blue-600 text-white border border-white hover:bg-blue-700'
                                : 'bg-white text-blue-600 border border-blue-600 hover:text-blue-700 hover:border-blue-700'}`}
                            onclick={() => this.auth.switch_role()}>
                            Customer
                        </div>
                        <div class="text-gray-400">
                            or
                        </div>
                        <div class={`py-1 px-4 font-bold cursor-pointer
                            ${this.auth.role === 'shipper'
                                ? 'bg-blue-600 text-white border border-white hover:bg-blue-700'
                                : 'bg-white text-blue-600 border border-blue-600 hover:text-blue-700 hover:border-blue-700'}`}
                            onclick={() => this.auth.switch_role()}>
                            Shipper
                        </div>
                    </div>
                </div>
                <div class="mt-4 flex flex-col">
                    <label class="text-gray-600 mb-1" for="fullname-input">
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
                <div class="mt-2 flex flex-col">
                    <label class="text-gray-600 mb-1" for="email-input">
                        Email
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
                <div class="mt-2 flex flex-col">
                    <label class="text-gray-600 mb-1" for="password-input">
                        Choose a password
                    </label>
                    <PasswordInput bind={this.auth.password} requirements={true} />
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
                    <Button callback={(e) => this.signup(e)}>
                        {this.auth.loading ? (
                            <Loading color="light" class="w-8" /> 
                        ) : (
                            <Icon name="arrow-right" class="w-5 mr-1.5" />
                        )}
                        <span>
                            Continue
                        </span>
                    </Button>
                    <div class="mt-4 text-center">
                        <span class="text-gray-700 mr-2">
                             Have an account?
                        </span>
                        <ButtonLink callback={() => {
                            this.auth.switch_action();
                            m.route.set('/auth/login');
                        }}>
                            Log in
                        </ButtonLink>
                    </div>
                </div>
            </form>
        );
    }
}