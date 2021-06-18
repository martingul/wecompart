import m from 'mithril';
import Api from '../api';
import Logo from '../components/logo';
import AuthForm from '../components/auth-form';

import google from '../assets/google.svg';
import facebook from '../assets/facebook.svg';

export default class AuthView {
    constructor(vnode) {
        this.valid_actions = ['signin', 'signup'];
        this.action = vnode.attrs.action;
        if (!this.valid_actions.includes(this.action)) {
            m.route.set('/auth/signup');
        }
        console.log(`construct AuthView (${this.action})`);

        this.signed_in = false;

        // const access_token = localStorage.getItem('access_token');
        // console.log(access_token);
    }

    oninit(vnode) {
        Api.read_self().then(res => {
            // m.route.set('/');
        }).catch(_ => null);
    }

    view(vnode) {
        return (
            <div class="flex flex-col items-center">
                <div class="px-8 w-full sm:w-1/2 lg:w-1/3">
                    <div class="my-6 p-4">
                        <m.route.Link href="/" options={{replace: true}}>
                            <Logo />
                        </m.route.Link>
                    </div>
                    <div class="flex flex-col items-center flex-grow mx-2">
                        <button type="button" class="w-full flex p-2 items-center bg-white border border-gray-300 hover:shadow-md rounded
                            transition duration-150">
                            <img src={google} class="w-5 ml-2" />
                            <span class="w-1/2 flex-grow text-gray-800">
                                Continue with Google
                            </span>
                        </button>
                        {/* <button type="button" class="w-full flex mt-3 p-2 items-center bg-white border border-gray-300 hover:shadow-md rounded
                            transition duration-150">
                            <img src={facebook} class="w-5 ml-2" />
                            <span class="w-1/2 flex-grow text-gray-800">
                                Continue with Facebook
                            </span>
                        </button> */}
                        <div class="my-4 text-gray-600">
                            —&nbsp; or &nbsp;—
                        </div>
                    </div>
                    <div class="flex flex-col mx-2 p-4 rounded border border-gray-300">
                        <AuthForm action={this.action} />
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        );
    }
}