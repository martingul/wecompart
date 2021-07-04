import m from 'mithril';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import User from '../models/User';

export default class AppView {
    static initialized = false;

    constructor(vnode) {
        console.log('construct AppView');
        this.user = User.load();
    }

    view(vnode) {
        if (!this.user) {
            const access_token = localStorage.getItem('access_token');
            if (!access_token) {
                m.route.set('/auth/signup');
            }
        }

        return (
            <div class="flex w-full h-full min-h-screen antialiased">
                <div class={this.user ? 'flex' : 'hidden'}>
                    <Navigation />
                </div>
                <div class="flex flex-col items-center w-full">
                    <Header />
                    <div class="p-12 w-full">
                        {vnode.children}
                    </div>
                </div>
            </div>
        );
    }
}