import m from 'mithril';
import Api from '../Api';
import LandingView from './Landing';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import User from '../models/User';

export default class AppView {
    static initialized = false;

    constructor(vnode) {
        console.log('construct AppView');
        this.user = User.load();
    }

    view(vnode) {
        if (!this.user) {
            return <LandingView />;
        }

        return (
            <div class="flex flex-col items-center">
                <div class="w-full px-4 md:w-4/5 lg:w-1/2">
                    <Header />
                    <div class="flex justify-between">
                        <Navigation />
                        <div class="w-full m-8">
                            {vnode.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}