import m from 'mithril';
import Api from '../Api';
import Button from './Button';

export default class Payment {
    constructor(vnode) {
        console.log('construct Payment');
        this.quote_id = vnode.attrs.quote_id;
        this.close = vnode.attrs.close;
        this.loading = true;

        this.stripe = null;
        this.card = null;
        this.secret = null;
    }

    submit() {
        if (!this.stripe || !this.card || !this.secret) {
            console.log('init not finished');
            return;
        }

        this.stripe.confirmCardPayment(this.secret, {
            payment_method: {
                card: this.card,
                billing_details: {
                    name: 'Jenny Rosen',
                },
            },
        }).then(res => {
            console.log(res);
            if (res && res.paymentIntent) {
                return Api.release_payment({
                    payment_id: res.paymentIntent.id,
                });
            }
        }).then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        });;
    }

    oncreate(vnode) {
        this.loading = true;
        import('@stripe/stripe-js')
        .then(module => module.loadStripe('pk_test_51HQv03K6ue4fIDgfb8OLq9yVLnE4w22Aycf6GHjgqh4mLpdvO31rkn8PXlGN0P9qaX3Nya4jCY9fL2SGWxYzuEuc00Nv0OYTrx'))
        .then(stripe => {
            this.stripe = stripe;
            const elements = stripe.elements();
            const style = {
                base: { color: '#32325d' }
            }
            this.card = elements.create('card', { style });

            this.card.on('change', (e) => {
                let error_dom = document.getElementById('card-errors');
                if (error_dom){
                    if (e.error) {
                        error_dom.textContent = e.error.message;
                    } else {
                        error_dom.textContent = '';
                    }
                }
            });

            this.card.mount('#card-element');
            return Api.create_payment({
                quote_id: this.quote_id
            });
        })
        .then(res => {
            console.log(res);
            if (res) {
                this.secret = res.secret;
            }
        })
        .catch(e => {
            console.log(e);
        })
        .finally(() => {
            this.loading = false;
            m.redraw();
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