import Api from '../Api';
import User from './User';

export default class Auth {
    constructor(action) {
        this.fullname = {value: ''};
        this.company = {value: ''};
        this.email = {value: ''};
        this.password = {value: ''};
        this.role = 'standard';
        
        this.action = action;
        this.error = '';
        this.loading = false;
    }

    switch_action() {
        this.password.value = '';
        this.error = '';
        this.action = this.action === 'signup' ? 'signin' : 'signup'; 
    }

    validate_fullname() {
        return this.fullname.value && (String(this.fullname.value).length > 0);
    }

    validate_company() {
        return this.role === 'shipper'
            ? this.company.value && (String(this.fullname.value).length > 0)
            : true;
    }

    validate_email() {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return this.email.value && re.test(String(this.email.value).toLowerCase());
    }

    validate_password() {
        return this.password.value && (String(this.password.value).length >= 6);
    }

    is_valid() {
        return this.email.value !== ''
            && this.password.value !== '';
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

        if (this.role === 'shipper') {
            if (!this.validate_company()) {
                this.error = 'Please enter a valid company name.';
                return Promise.reject(new Error('invalid_company'));
            }
        } else {
            this.company.value = '';
        }

        const user = {
            username: this.email.value,
            password: this.password.value,
            fullname: this.fullname.value,
            company: this.company.value,
            role: this.role,
        };

        this.loading = true;
        return Api.create_user({user})
            .then(res => this.authenticate())
            // .then(res => {
            //     if (user.role === 'shipper') {
            //         return Api.onboard_user({})
            //     }
            // })
            // .then(onboard_url => {
            //     if (onboard_url) {
            //         window.location.replace(onboard_url);
            //     } else {
            //         return true;
            //     }
            // })
            .then(() => true)
            .catch(e => {
                this.loading = false;
                if (e.response.detail === 'error_username_taken') {
                    this.error = 'An account with this email already exists.';
                }
                return false;
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