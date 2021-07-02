import m from 'mithril';

export default class SearchInput {
    constructor(vnode) {
        this.event_controller = new AbortController();
    }

    oninit(vnode) {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Slash') { 
                const search_input = document.getElementById('search-input');
                if (search_input) {
                    e.preventDefault();
                    search_input.focus();
                } else {
                    this.event_controller.abort();
                }
            }
        }, { signal: this.event_controller.signal })
    }

    view(vnode) {
        return (
            <input id="search-input" type="text" class="bg-gray-50" placeholder='Search (press "/" to focus)' />
        );
    }
}