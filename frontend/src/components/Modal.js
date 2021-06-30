import m from 'mithril';
import Icon from './Icon';
import IconButton from './IconButton';

export default class Modal {
    static create({
        message = '',
        confirm_label = '',
        confirm_color = '',
        confirm,
    }) {
        const modal = document.createElement('div');
        modal.id = 'modal';
        modal.className = 'fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'
        document.body.appendChild(modal);

        m.mount(modal, {view: () => {
            return (
                <div class="flex flex-col bg-white shadow-lg rounded py-4 px-6">
                    <div class="flex justify-end">
                        <IconButton icon="x" callback={() => {
                            console.log('close');
                            const _modal = document.getElementById('modal');
                            if (_modal) {
                                _modal.parentNode.removeChild(_modal);
                            }
                        }} />
                    </div>
                    <div class="flex my-10 px-2 text-base">
                        {message}
                    </div>
                    <div class="flex justify-between mt-2">
                        <button class="flex justify-center items-center whitespace-nowrap px-4 py-1 rounded hover:shadow transition-all
                            text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300"
                            onclick={() => {
                                console.log('cancel');
                                const _modal = document.getElementById('modal');
                                if (_modal) {
                                    _modal.parentNode.removeChild(_modal);
                                }
                            }}>
                            Cancel
                        </button>
                        <button class="flex justify-center items-center whitespace-nowrap px-4 py-1 rounded hover:shadow transition-all
                            text-red-600 hover:text-red-800 bg-red-200 hover:bg-red-300"
                            onclick={() => {
                                console.log('confirm');
                                confirm();
                                const _modal = document.getElementById('modal');
                                if (_modal) {
                                    _modal.parentNode.removeChild(_modal);
                                }
                            }}>
                            {confirm_label}
                        </button>
                    </div>
                </div>
            );
        }});
    }
}