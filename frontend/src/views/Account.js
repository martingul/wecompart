import m from 'mithril';
import Api from '../Api';
import AppView from './App';
import Title from '../components/Title';
import Button from '../components/Button';

export default class AccountView {
    constructor(vnode) {
        console.log('construct AccountView');
    }

    view(vnode) {
        return (
            <AppView>
                <div class="flex flex-col">
                    <Title>
                        Account
                    </Title>
                    <div class="mt-4">
                        <Button active={false} callback={() => {
                            Api.signout().finally(() => {
                                localStorage.clear();
                                m.route.set('/auth/login');
                            });
                        }}>
                            Sign out
                        </Button>
                    </div>
                </div>
            </AppView>
        );
    }
}