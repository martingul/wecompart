import m from 'mithril';
import {loadStripe} from '@stripe/stripe-js';
import Button from './Button';

export default class Payment {
    constructor(vnode) {
        console.log('construct Payment');
        this.loading = true;
        this.close = vnode.attrs.close;
    }

    submit() {
        const payment_form = document.getElementById('payment-form');
        if (payment_form) {
            payment_form.submit();
        }
    }

    oncreate(vnode) {
        loadStripe('pk_test_51HQv03K6ue4fIDgfb8OLq9yVLnE4w22Aycf6GHjgqh4mLpdvO31rkn8PXlGN0P9qaX3Nya4jCY9fL2SGWxYzuEuc00Nv0OYTrx')
            .then(stripe => {
                const elements = stripe.elements();
                const style = {
                    base: { color: '#32325d' }
                }
                const card = elements.create('card', { style });
                card.mount('#card-element');
            }).finally(() => {
                this.loading = false;
            });
    }

    view(vnode) {
        return (
            <div class="py-4 px-6 flex flex-col border border-gray-300 rounded">
                <div class="flex flex-col">
                    <div class="flex items-center">
                        <span class="font-bold text-lg text-black mr-2">
                            Book this shipper
                        </span>
                    </div>
                    <span class="mt-2 text-gray-600">
                        Make a payment for this quote by filling in your payment details.
                    </span>
                </div>
                <div class="mt-4">
                    <form class={!this.loading ? 'block' : 'hidden'} id="payment-form">
                        <div class="p-2 shadow">
                            <div id="card-element"></div> 
                        </div>
                        <div id="card-errors" role="alert"></div>
                    </form>
                    <div class={this.loading ? 'block animate-pulse' : 'hidden'}>
                        <div class="bg-gray-200 h-8 rounded"></div>
                    </div>
                    <div class="mt-6 flex justify-between">
                        <div></div>
                        <div class="flex items-center">
                            <div class="mr-2">
                                <Button active={false} callback={() => this.close()}>
                                    Cancel
                                </Button>
                            </div>
                            <Button callback={() => this.submit()}>
                                Pay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}