import Api from '../api';

export default class Auth {
    constructor(action) {
        this.email = '';
        this.password = '';
        
        this.action = action;
        this.error = '';
        this.busy = false;
    }

    validate_email() {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return this.email && re.test(String(this.email).toLowerCase());
    }

    validate_password() {
        return this.password && (String(this.password.length) >= 6);
    }

    authenticate() {
        this.busy = true;
        return Api.authenticate({
            username: this.email,
            password: this.password
        }).then(res => {
            Api.set_session(Api.decode_session(res.session));
            Api.set_username(this.email);
            return true;
            // m.route.set('/'); 
        }).catch(e => {
            if (e.response) {
                if (e.response.detail === 'error_invalid_credentials') {
                    this.error = 'Invalid credentials.';
                }
            }
        }).finally(() => {
            this.busy = false;
        });
    }

    switch_action() {
        this.password = '';
        this.error = '';
        this.action = this.action === 'signup' ? 'signin' : 'signup'; 
    }

    can_submit() {
        return this.email !== '' && this.password !== '';
    }

    submit() {
        console.log(this.email, this.password);
        this.error = '';

        if (!this.validate_email()) {
            this.error = 'Please enter a valid email address.';
            return Promise.reject(new Error('invalid_email'));
        }
        if (!this.validate_password()) {
            this.error = 'Please enter a valid password.';
            return Promise.reject(new Error('invalid_password'));
        }

        if (this.action === 'signin') {
            return this.authenticate();
        } else {
            this.busy = true;
            return Api.create_user({
                username: this.email,
                password: this.password
            }).then(res => {
                return this.authenticate();
            }).catch(e => {
                if (e.response.detail === 'error_username_taken') {
                    this.error = 'An account with this email already exists.';
                }
                return false;
            }).finally(() => {
                this.busy = false;
            });
        }
    }
}