import m from 'mithril';
import Api from '../Api';
import AppView from './App';
import LandingView from './Landing';
import User from '../models/User';
import Loading from '../components/Loading';

export default class RootView {
    constructor(vnode) {
        this.loading = false;
        this.signed_in = false;
        this.user = null;
    }

    oninit(vnode) {
        this.loading = true;
        
        Api.read_self().then(res => {
            this.signed_in = true;
            this.user = new User(res);
            // TODO connect websocket here
        }).catch(e => {
            Api.clear_storage();
            this.signed_in = false;
        }).finally(() => {
            console.log('signed in: ', this.signed_in);
            this.loading = false;
        });
    }

    view(vnode) {
        if (this.loading) {
            return (
                <div class="flex justify-center">
                    <div class="my-8 flex items-center text-gray-600">
                        <Loading class="w-12" />
                    </div>
                </div>
          );
        } else if (this.signed_in) {
            return <AppView user={this.user} />;
        } else {
            return <LandingView />;
        }
    }
}