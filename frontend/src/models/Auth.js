import Api from '../api';

export default class Auth {
    static email = '';
    static password = '';
    
    static action = '';
    static error = '';
    static busy = false;

    static validate_email(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email && re.test(String(email).toLowerCase());
    }

    static validate_password(password) {
        return password && (String(password.length) >= 6);
    }

    static authenticate() {
        Auth.busy = true;
        return Api.authenticate({
            username: Auth.email,
            password: Auth.password
        }).then(res => {
            Api.set_session(Api.decode_session(res.session));
            Api.set_username(Auth.email);
            return true;
            // m.route.set('/'); 
        }).catch(e => {
            if (e.response) {
                if (e.response.detail === 'error_invalid_credentials') {
                    Auth.error = 'Invalid credentials.';
                }
            }
        }).finally(() => {
            Auth.busy = false;
        });
    }

    static switch_action() {
        Auth.password = '';
        Auth.error = '';
        Auth.action = Auth.action === 'signup' ? 'signin' : 'signup'; 
    }

    static can_submit() {
        return Auth.email !== '' && Auth.password !== '';
    }

    static submit() {
        console.log(Auth.email, Auth.password);
        Auth.error = '';
        const email = Auth.email;
        const password = Auth.password;

        if (!Auth.validate_email(email)) {
            Auth.error = 'Please enter a valid email address.';
            return Promise.reject(new Error('invalid_email'));
        }
        if (!Auth.validate_password(password)) {
            Auth.error = 'Please enter a valid password.';
            return Promise.reject(new Error('invalid_password'));
        }

        if (Auth.action === 'signin') {
            return Auth.authenticate(email, password);
        } else {
            Auth.busy = true;
            return Api.create_user({
                username: email,
                password: password
            }).then(res => {
                return Auth.authenticate(email, password);
            }).catch(e => {
                if (e.response.detail === 'error_username_taken') {
                    Auth.error = 'An account with this email already exists.';
                }
                return false;
            }).finally(() => {
                Auth.busy = false;
            });
        }
    }
}