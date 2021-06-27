import m from 'mithril';
import Api from '../api';
// import AuthForm from '../components/auth-form';
import Auth from '../models/Auth';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';

import google from '../assets/google.svg';

export default class AuthView {
    constructor(vnode) {
        Auth.action = vnode.attrs.action;
        console.log(`construct AuthView (${Auth.action})`);
    }

    oninit(vnode) {
        Api.read_self().then(res => {
            // m.route.set('/');
        }).catch(_ => {});
    }

    view(vnode) {
        return (
            <div class="flex flex-col items-center">
                <div class="px-8 w-full sm:w-1/2 lg:w-1/3">
                    <div class="my-6 p-4">
                        <m.route.Link href="/" options={{replace: true}}
                            class="flex items-center whi=tespace-nowrap text-xl font-bold">
                            wecompart &trade;
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
                        <div class="my-4 text-gray-600">
                            —&nbsp; or &nbsp;—
                        </div>
                    </div>
                    <div class="flex flex-col mx-2 p-4 rounded border border-gray-300">
                        {Auth.action === 'signin' ? <SignInForm /> : <SignUpForm />}
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        );
    }
}