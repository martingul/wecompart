import m from 'mithril';
import AppView from './App';
import Title from '../components/Title';

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
                </div>
            </AppView>
        );
    }
}