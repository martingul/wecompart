import m from 'mithril';
import Api from '../api';
import Icon from './icon';
import Loading from './loading';

export default class AuthForm {
    constructor(vnode) {
        this.action = vnode.attrs.action;
        this.fields = {
            email: '',
            signin_password: '',
            signup_password: ''
        };

        this.show_password = false;
        this.show_loading = false;
        this.show_error = false;
        this.error = '';
    }

    validate_email(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email && re.test(String(email).toLowerCase());
    }

    validate_password(password) {
        return password && (String(password.length) >= 6);
    }

    static get_refresh_token() {
        return localStorage.getItem('refresh_token');
    }

    static set_refresh_token(refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
    }

    authenticate(username, password) {
        this.show_loading = true;
        return Api.authenticate({username, password})
            .then(res => {
                Api.set_session(Api.decode_session(res.session));
                Api.set_username(username);
                m.route.set('/'); 
            }).catch(e => {
                if (e.response) {
                    if (e.response.detail === 'error_invalid_credentials') {
                        this.error = 'Invalid credentials.';
                        this.show_error = true;
                    }
                }
            }).finally(() => {
                this.show_loading = false;
            });
    }

    submit(e) {
        e.preventDefault();

        const email = this.fields.email;
        const password = this.action === 'signin' ?
            this.fields.signin_password : this.fields.signup_password;

        if (!this.validate_email(email)) {
            this.error = 'Please enter a valid email address.';
            this.show_error = true;
            return;
        }
        if (!this.validate_password(password)) {
            this.error = 'Please enter a valid password.';
            this.show_error = true;
            return;
        }

        if (this.action === 'signin') {
            this.authenticate(email, password);
        } else {
            this.show_loading = true;
            Api.create_user({
                username: email,
                password: password
            }).then(res => {
                return this.authenticate(email, password);
            }).catch(e => {
                if (e.response.detail === 'error_username_taken') {
                    this.error = 'An account with this email already exists.';
                    this.show_error = true;
                }
            }).finally(() => {
                this.show_loading = false;
            });
        }
    }

    view(vnode) {
        return (
            <form onsubmit={(e) => this.submit(e)}>
                <div class="flex flex-col">
                    <label class="text-gray-600" for="email-input">
                        {this.action === 'signin' ? 'Email' : 'Enter your email'}
                    </label>
                    <input class="mt-1 border transition duration-150 border-gray-300 bg-gray-100 rounded"
                        id="email-input" type="email" spellcheck="false" required
                        placeholder={this.action === 'signin' ? '' : 'user@example.com'}
                        onchange={(e) => this.fields.email = e.target.value}/>
                </div>
                <div class="flex flex-col mt-4">
                    {this.action === 'signin' ?
                        (
                            <div class="flex">
                                <label class="text-gray-600" for="password-input">
                                    Password
                                </label>
                                {/* <div class="flex flex-grow justify-end">
                                    <button class="cursor-pointer text-indigo-500 hover:text-indigo-600"
                                        type="button" id="forgot-password-btn" tabindex="-1">
                                        Forgot password?
                                    </button>
                                </div> */}
                            </div>
                        ) : (
                            <label class="text-gray-600" for="password-input">
                                Choose a password
                            </label>
                        )
                    }
                    <div class="relative">
                        <input class="mt-1 border transition duration-150 border-gray-300 bg-gray-100 rounded"
                            id="password-input" spellcheck="false" minlength="6" required
                            type={this.show_password ? 'text' : 'password'}
                            value={this.action === 'signin' ? this.fields.signin_password : this.fields.signup_password}
                            placeholder={this.action === 'signin' ? '' : '6 characters min.'}
                            onchange={(e) => {
                                if (this.action === 'signin') this.fields.signin_password = e.target.value;
                                else this.fields.signup_password = e.target.value;
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
                </div>
                <div class={this.show_error ? 'block' : 'hidden'}>
                    <div class="mt-4 flex items-center px-2 py-1 rounded bg-red-100 text-red-600" id="form-error">
                        <Icon name="alert-triangle" class="w-4" />
                        <span class="ml-2">
                            {this.error}
                        </span>
                    </div>
                </div>
                <input class="hidden" type="submit"/>
                <div class="mt-4">
                    <button type="button" class="flex items-center justify-center w-full px-4 xs:px-10 py-2 rounded shadow-md hover:shadow-lg
                        transition duration-150 bg-indigo-500 hover:bg-indigo-400 text-white"
                    onclick={(e) => this.submit(e)}>
                        <div class={this.show_loading ? 'block' : 'hidden'}>
                            <Loading color="light" class="w-8" />
                        </div>
                        <span class="font-bold">
                            {this.action === 'signin' ? 'Login' : 'Continue'}
                        </span>
                        <Icon name="arrow-right" class="w-4 ml-2" />
                    </button>
                    <div class="mt-4 text-center">
                        <span class="text-gray-700">
                            {this.action === 'signin' ? "Don't have an account?" : 'Have an account?'}
                        </span>
                        <m.route.Link
                            href={this.action === 'signin' ? '/auth/signup' : '/auth/signin'} options={{replace: true}}
                            onclick={() => {
                                this.action === 'signin' ? this.action = 'signup' : this.action = 'signin';
                                this.show_error = false;
                            }}>
                            <button type="button" class="ml-2 cursor-pointer text-indigo-500 hover:text-indigo-600">
                                {this.action === 'signin' ? 'Sign up' : 'Sign in'}
                            </button>
                        </m.route.Link>
                    </div>
                </div>
            </form>
        );
    }
}