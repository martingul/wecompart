import m from 'mithril';
import AppView from './App';
import User from '../models/User';

export default class HomeView {
    constructor(vnode) {
        console.log('construct HomeView');
        this.user = User.load();
        if (!this.user) {
            m.route.set('/auth/login');
        }
    }

    view(vnode) {
        return (
            <AppView>
                <div>
                    Home
                </div>
            </AppView>
        );
    }
}