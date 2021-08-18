import m from 'mithril';
import Api from '../Api';
import Auth from '../models/Auth';
import Logo from '../components/Logo';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';

import google from '../assets/google.svg';

export default class AuthView {
    constructor(vnode) {
        this.action = vnode.attrs.action ? vnode.attrs.action : 'signin';
        this.auth = new Auth(vnode.attrs.action);
        console.log(`construct AuthView (${this.auth.action})`);
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
                        <Logo />
                    </div>
                    <div class="flex flex-col items-center flex-grow mx-2">
                        <button type="button" class="w-full flex p-2 items-center bg-white border border-gray-300 hover:shadow-md rounded
                            transition duration-150">
                            <img src={google} class="w-5 ml-2" />
                            <span class="w-1/2 flex-grow text-gray-800">
                                Continue with Google
                            </span>
                        </button>
                    </div>
                    <div class="flex flex-col mt-6 mx-2 p-4 rounded border border-gray-300">
                        {this.auth.action === 'signin' ? (
                            <SignInForm auth={this.auth} />
                        ) : (
                            <SignUpForm auth={this.auth} />
                        )}
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        );
    }
}