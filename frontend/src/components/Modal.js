import m from 'mithril';
import Button from './Button';
import IconButton from './IconButton';

export default class Modal {
    static create({
        title = '',
        content = '',
        confirm_label = '',
        confirm_color = '',
        confirm = () => {},
        loading = () => {},
    }) {
        // TODO handle click outside
        const modal = document.createElement('div');
        const event_controller = new AbortController();

        modal.id = 'modal';
        modal.className = 'fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'
        modal.close = () => modal.parentNode.removeChild(modal);
        
        document.body.appendChild(modal);
        document.addEventListener('click', (e) => {
            // const _modal = document.getElementById('modal');
            const modal_content = document.getElementById('modal-content');
            if (modal_content) {
                if (modal.contains(e.target) && !modal_content.contains(e.target)) {
                    modal.parentNode.removeChild(modal);
                }
            } else {
                event_controller.abort();
            }
        }, { signal: event_controller.signal });

        m.mount(modal, {view: () => {
            return (
                <div id="modal-content" class="flex flex-col w-1/2 md:w-1/3 bg-white shadow-lg rounded">
                    <div class="px-6 py-2 flex justify-between items-center border-b border-gray-200">
                        <span class="font-bold">
                            {title}
                        </span>
                        <IconButton icon="x" callback={() => modal.close()} />
                    </div>
                    <div class="px-8 py-2">
                        {content}
                    </div>
                    <div class="px-6 py-2 flex justify-between border-t border-gray-200">
                        <Button active={false} callback={() => modal.close()}>
                            Cancel
                        </Button>
                        <Button loading={() => loading()} callback={() => {
                            Promise.resolve(confirm()).then(_ => {
                                modal.close();
                            }).catch(e => {
                                console.log(e);
                            });;
                        }}>
                            {confirm_label}
                        </Button>
                    </div>
                </div>
            );
        }});
    }
}