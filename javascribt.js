document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.getElementById('category-filter');
    const productCards = document.querySelectorAll('.product-card');
    const cartCountSpans = document.querySelectorAll('.cart-icon span');
    
    let cart = JSON.parse(localStorage.getItem('eliteCart')) || [];
    updateGlobalCartCount();

    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const selectedValue = filterSelect.value;
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                card.style.display = (selectedValue === 'all' || category === selectedValue) ? 'block' : 'none';
            });
        });
    }

    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const name = card.querySelector('h3').innerText;
            const priceStr = card.querySelector('p').innerText;
            const priceValue = parseFloat(priceStr.replace('$', ''));
            const size = card.querySelector('.size-select').value;
            const quantity = parseInt(card.querySelector('.qty-input').value);

            const existingItem = cart.find(item => item.name === name && item.size === size);

            if (existingItem) {
                if (existingItem.quantity + quantity > 5) {
                    alert("Maximum limit of 5 per item reached.");
                    return;
                }
                existingItem.quantity += quantity;
            } else {
                cart.push({ name, priceStr, priceValue, size, quantity });
            }
            
            localStorage.setItem('eliteCart', JSON.stringify(cart));
            updateGlobalCartCount();

            button.innerText = 'Added';
            setTimeout(() => { button.innerText = 'Add to Cart'; }, 1000);
        });
    });

    function updateGlobalCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpans.forEach(span => {
            span.innerText = `Cart (${totalItems})`;
        });
    }
});