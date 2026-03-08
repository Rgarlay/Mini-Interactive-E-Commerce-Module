const cartGrid = document.querySelector('.cart-grid');
const cartCountNav = document.querySelector('.cart span');

async function fetchProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}

async function fetchCartData() {
  const res = await fetch('/api/quantity');
  const data = await res.json();
  return data.EachQuantity || [];
}

function createCartCard(product, quantity) {
  const { _id, name, image, price } = product;
  const total = (price * quantity).toFixed(2);
  return `
    <div class="cart-card" data-id="${_id}" data-price="${price}">
      <img src="${image}" alt="${name}" />
      <div class="cart-card-info">
        <h3>${name}</h3>
        <p>Price: $${price}</p>
        <div class="quantity-controls">
          <button class="decrease-btn">−</button>
          <span class="count">${quantity}</span>
          <button class="increase-btn">+</button>
        </div>
      </div>
      <div class="cart-card-total">
        <p>Total: $${total}</p>
      </div>
    </div>`;
}

async function loadCart() {
  try {
    const cartItems = await fetchCartData();
    
    if (!cartItems || cartItems.length === 0) {
      cartGrid.innerHTML = '<p>Your cart is empty.</p>';
      if (cartCountNav) cartCountNav.textContent = '0';
      return;
    }

    const cards = await Promise.all(
      cartItems.map(item => 
        fetchProduct(item.ProductId).then(product => 
          createCartCard(product, item.Quantity)
        )
      )
    );

    cartGrid.innerHTML = cards.join('');
    updateCartDisplay(cartItems);
  } catch (error) {
    console.error('Error loading cart:', error);
    cartGrid.innerHTML = '<p>Error loading cart. Please refresh the page.</p>';
  }
}

async function updateCartDisplay(cartItems) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.Quantity, 0);
  if (cartCountNav) cartCountNav.textContent = totalItems;

  const grandTotal = cartItems.reduce((acc, item) => {
    const card = document.querySelector(`.cart-card[data-id="${item.ProductId}"]`);
    const price = card ? parseFloat(card.dataset.price) : 0;
    return acc + (price * item.Quantity);
  }, 0);

  const totalDisplay = document.getElementById('grand-total');
  if (totalDisplay) totalDisplay.textContent = `$${grandTotal.toFixed(2)}`;
}

cartGrid.addEventListener('click', async (e) => {
  const card = e.target.closest('.cart-card');
  if (!card) return;

  const id = card.dataset.id;
  const price = parseFloat(card.dataset.price);
  const countSpan = card.querySelector('.count');
  const currentQuantity = parseInt(countSpan.textContent);

  if (e.target.classList.contains('increase-btn')) {
    const newQuantity = currentQuantity + 1;
    
    await fetch('/cart/increase', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price, count: newQuantity })
    });
    
    countSpan.textContent = newQuantity;
    card.querySelector('.cart-card-total p').textContent = `Total: $${(price * newQuantity).toFixed(2)}`;
  } 
  else if (e.target.classList.contains('decrease-btn')) {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      
      await fetch('/cart/decrease', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price, count: newQuantity })
      });
      
      countSpan.textContent = newQuantity;
      card.querySelector('.cart-card-total p').textContent = `Total: $${(price * newQuantity).toFixed(2)}`;
    } else {
      // Remove item if quantity is 1
      await fetch('/cart/decrease', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price, count: 0 })
      });
      
      card.remove();
      const remainingCards = document.querySelectorAll('.cart-card');
      if (remainingCards.length === 0) {
        cartGrid.innerHTML = '<p>Your cart is empty.</p>';
      }
    }
  }

  // Refresh cart display
  const refreshedCart = await fetchCartData();
  await updateCartDisplay(refreshedCart);
});

// Load cart when page loads
loadCart();
