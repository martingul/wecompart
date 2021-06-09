import m from 'mithril';

export default class QuoteEdit {
    constructor(vnode) {
        console.log('construct QuoteEdit');
        this.price = 0;
    }

    place_quote(price) {
        
    }

    view(vnode) {
        return (
            <form class="py-2 px-4 bg-yellow-50 rounded shadow" onsubmit={(e) => {e.preventDefault()}}>
                <div class="flex items-center">
                    <label for="quote-price-input">Price</label>
                    <input class="ml-4 py-1 border border-gray-200"
                        id="quote-price-input" type="number" min="0" step="any"
                        oninput={(e) => this.price = e.target.value} />
                    <button class="ml-4"
                        onclick={() => place_quote(this.price)}>
                        Place
                    </button>
                </div>
            </form>
        );
    }
}