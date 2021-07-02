import m from 'mithril';
import LandingView from './Landing';
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
                return <LandingView />;
            }
        }

        return (
            <div class="flex w-full h-full min-h-screen">
                <div class={this.user ? 'block' : 'hidden'}>
                    <Navigation />
                </div>
                <div class="flex flex-col items-center w-full">
                    <Header />
                    <div class="m-8">
                        {vnode.children}
                    </div>
                </div>
            </div>
        );
    }
}