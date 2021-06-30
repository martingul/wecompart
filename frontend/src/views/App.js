import m from 'mithril';
import Api from '../Api';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

export default class AppView {
    constructor(vnode) {
        console.log('construct AppView');
        this.user = vnode.attrs.user;
        this.selected = Navigation.default_view;
    }

    view(vnode) {
        return (
            <div class="flex flex-col items-center">
                <div class="w-full px-4 md:w-4/5 lg:w-1/2">
                    <Header />
                    <div class="flex justify-between">
                        <Navigation navigate={(e) => {this.selected = e}}/>
                        <div class="w-full m-8">
                            <this.selected.view />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}