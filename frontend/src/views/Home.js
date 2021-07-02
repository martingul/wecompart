import m from 'mithril';
import AppView from './App';
import LandingView from './Landing';
import User from '../models/User';

export default class HomeView {
    constructor(vnode) {
        console.log('construct HomeView');
        this.user = User.load();
    }

    view(vnode) {
        if (!this.user) {
            return <LandingView />;
        }

        return (
            <AppView>
                <div>
                    Home
                </div>
            </AppView>
        );
    }
}