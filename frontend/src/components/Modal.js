import m from 'mithril';
import Icon from './Icon';
import IconButton from './IconButton';

export default class Modal {
    static create({
        title = '',
        message = '',
        confirm_label = '',
        confirm_color = '',
        confirm,
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
                <div id="modal-content" class="flex flex-col bg-white shadow-lg rounded">
                    <div class="px-6 py-2 flex justify-between items-center border-b border-gray-200">
                        <span class="font-bold">
                            {title}
                        </span>
                        <IconButton icon="x" callback={() => modal.close()} />
                    </div>
                    <div class="px-6 flex my-10 text-base">
                        {message}
                    </div>
                    <div class="px-6 py-2 flex justify-between border-t border-gray-200">
                        <button class="flex justify-center items-center whitespace-nowrap px-4 py-1 rounded hover:shadow transition-all
                            text-gray-800 hover:text-black border border-gray-300 hover:border-gray-400"
                            onclick={() => modal.close()}>
                            Cancel
                        </button>
                        <button class="flex justify-center items-center whitespace-nowrap px-4 py-1 rounded hover:shadow transition-all
                            text-red-600 hover:text-red-800 border border-red-300 bg-red-100 hover:bg-red-200"
                            onclick={() => {
                                confirm();
                                modal.close()
                            }}>
                            {confirm_label}
                        </button>
                    </div>
                </div>
            );
        }});
    }
}