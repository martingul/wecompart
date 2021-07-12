import Api from '../Api';
import User from './User';

export default class Auth {
    constructor(action) {
        this.fullname = {value: ''};
        this.email = {value: ''};
        this.password = {value: ''};
        
        this.action = action;
        this.error = '';
        this.loading = false;
    }

    is_loading() {
        return this.loading;
    }

    switch_action() {
        this.password.value = '';
        this.error = '';
        this.action = this.action === 'signup' ? 'signin' : 'signup'; 
    }

    validate_fullname() {
        return this.fullname.value && (String(this.fullname.value).length > 0);
    }

    validate_email() {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return this.email.value && re.test(String(this.email.value).toLowerCase());
    }

    validate_password() {
        return this.password.value && (String(this.password.value).length >= 6);
    }

    is_valid() {
        return this.email.value !== '' && this.password.value !== '';
    }

    authenticate() {
        this.loading = true;
        return Api.authenticate({
            username: this.email.value,
            password: this.password.value
        }).then(res => {
            Api.set_session(Api.decode_session(res.session));
            return Api.read_self();
        }).then(res => {
            const user = new User(res);
            user.save();
            return true;
        }).catch(e => {
            if (e.response) {
                if (e.response.detail === 'error_invalid_credentials') {
                    this.error = 'Invalid credentials.';
                }
            }
        }).finally(() => {
            this.loading = false;
        });
    }

    signup() {
        this.error = '';
        if (!this.validate_fullname()) {
            this.error = 'Please enter your full name.';
            return Promise.reject(new Error('invalid_fullname'));
        }
        if (!this.validate_email()) {
            this.error = 'Please enter a valid email address.';
            return Promise.reject(new Error('invalid_email'));
        }
        if (!this.validate_password()) {
            this.error = 'Please enter a valid password.';
            return Promise.reject(new Error('invalid_password'));
        }

        this.loading = true;
        return Api.create_user({
            fullname: this.fullname.value,
            username: this.email.value,
            password: this.password.value
        }).then(res => {
            return this.authenticate();
        }).catch(e => {
            if (e.response.detail === 'error_username_taken') {
                this.error = 'An account with this email already exists.';
            }
            return false;
        }).finally(() => {
            this.loading = false;
        });
    }

    signin() {
        this.error = '';
        if (!this.validate_email()) {
            this.error = 'Please enter a valid email address.';
            return Promise.reject(new Error('invalid_email'));
        }
        if (!this.validate_password()) {
            this.error = 'Please enter a valid password.';
            return Promise.reject(new Error('invalid_password'));
        }

        return this.authenticate();
    }
}