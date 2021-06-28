import m from 'mithril';
import Api from '../Api';
import Loading from './Loading';
import Utils from '../Utils';

export default class LocationInput {
    constructor(vnode) {
        console.log('construct LocationInput');
        this.model = vnode.attrs.bind;
        this.input_id = vnode.attrs.id;
        this.placeholder = vnode.attrs.placeholder;
        this.id = Utils.generate_key();
        this.event_controller = new AbortController();

        this.values = [];
        this.timeout = null;
        this.loading = false;
        this.show_dropdown = false;
        this.callback = null;
    }

    handle_input(e) {
        this.model.value = e.target.value;
        this.dropdown = null;

        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }

        if (this.model.value.length === 0) {
            this.show_dropdown = false;
            this.loading = false;
            return;
        } else {
            this.loading = true;
            this.timeout = setTimeout(() => {
                this.timeout = null;
                this.loading = false;

                Api.read_locations({ q: this.model.value }).then(locations => {
                    this.values = locations.map(l => l.address_long);;
                    this.values_map = Object.fromEntries(
                        locations.map(l => [l.address_long, l.address_id])
                    );
                    this.show_dropdown = true;
                    this.callback = (v) => {
                        this.model.value = v;
                        this.model.place_id = this.values_map[v];
                        this.loading = false;
                        this.show_dropdown = false;
                    }
                    m.redraw();
                }).catch(e => {
                    console.log(e);
                });
            }, 1000, this);
        }
    }

    oninit(vnode) {
        document.addEventListener('click', (e) => {
            const input = document.getElementById('location-input-' + this.id);
            if (input) {
                if (input && !input.contains(e.target)) {
                    this.show_dropdown = false;
                    m.redraw();
                }
            } else {
                this.event_controller.abort();
            }
        }, { signal: this.event_controller.signal });
    }
    
    view(vnode) {
        return (
            <div id={'location-input-' + this.id} class="relative">
                <input id={this.input_id} type="text" placeholder={this.placeholder} autocomplete="off" spellcheck="false"
                    value={this.model.value}
                    oninput={(e) => this.handle_input(e)}  />
                <div class={this.loading ? '' : 'hidden'}>
                    <div class="absolute inset-y-0 right-0 flex items-center">
                        <Loading class="w-8" />
                    </div>
                </div>
                <div class={this.show_dropdown ? 'block' : 'hidden'}>
                    <div class="w-full absolute overflow-y-auto z-10 mt-1 shadow border border-gray-200 bg-white">
                    {this.values.map(value => (
                        <div class="w-full cursor-pointer py-1 px-2 border-b last:border-b-0 hover:bg-gray-100 whitespace-nowrap overflow-hidden"
                            onclick={(e) => this.callback(value)}>
                            {value}
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        );
    }
}