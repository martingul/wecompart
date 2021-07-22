import m from 'mithril';
import Api from '../Api';
import AppView from './App';
import LandingView from './Landing';
import User from '../models/User';
import Button from '../components/Button';

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
                    <ul>
                        <li>Verify email address</li>
                        <li>Link bank account</li>
                    </ul>
                    {this.user.role === 'shipper' ? (
                        // Maybe prefetch the onboard url before and show this
                        // as a link so that user can open in new tab (and quicker response)
                        // but this would send a request to stripe each time
                        <Button callback={() => {
                            Api.onboard_user({}).then(onboard_url => {
                                console.log(onboard_url);
                                window.location.replace(onboard_url);
                            }).catch(e => {
                                console.log(e);
                            })
                        }}>
                            Complete profile
                        </Button>
                    ) : ''}
                </div>
            </AppView>
        );
    }
}