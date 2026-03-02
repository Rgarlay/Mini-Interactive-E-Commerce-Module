const cartGrid = document.querySelector('.cart-grid');
const cartCountNav = document.querySelector('.cart span'); // Select the nav counter
let cart = JSON.parse(localStorage.getItem('cart')) || {};

async function fetchProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}


function updateLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  
  const totalItems = Object.values(cart).reduce((acc, item) => acc + (item.quantity || 0), 0);
  if (cartCountNav) cartCountNav.textContent = totalItems;
}

function createCartCard(product, quantity) {
  const { _id, name, image, price } = product;
  const total = (price * quantity).toFixed(2);
  return `
    <div class="cart-card" data-id="${_id}" data-price="${price}">
      <img src="${image}" alt="${name}" />
      <div class="cart-card-info">
        <h3>${name}</h3>
        <div class="quantity">
          <button class="decrease">−</button>
          <span class="count">${quantity}</span>
          <button class="increase">+</button>
        </div>
        <div class="item-price">$${price}</div>
      </div>
      <p class="total-price">$${total}</p>
    </div>`;
}

async function loadCart() {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    cartGrid.innerHTML = '<p>Your cart is empty.</p>';
    if (cartCountNav) cartCountNav.textContent = '0';
    return;
  }

  const cards = await Promise.all(
    ids.map(id => fetchProduct(id).then(product => createCartCard(product, cart[id].quantity)))
  );

  cartGrid.innerHTML = cards.join('');
  updateLocalStorage(); 
}

cartGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.cart-card');
  if (!card) return;

  const id = card.dataset.id;
  const price = parseFloat(card.dataset.price);
  const countSpan = card.querySelector('.count');
  const totalRow = card.querySelector('.total-price');

  if (e.target.classList.contains('increase')) {
    cart[id].quantity += 1;
    countSpan.textContent = cart[id].quantity;
    totalRow.textContent = `$${(price * cart[id].quantity).toFixed(2)}`;
  } 
  
  else if (e.target.classList.contains('decrease')) {
    if (cart[id].quantity > 1) {
      cart[id].quantity -= 1;
      countSpan.textContent = cart[id].quantity;
      totalRow.textContent = `$${(price * cart[id].quantity).toFixed(2)}`;
    } else {
      delete cart[id];
      card.remove();
      if (Object.keys(cart).length === 0) cartGrid.innerHTML = '<p>Your cart is empty.</p>';
    }
  }

  updateLocalStorage();
});

function updateLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  
  const totalItems = Object.values(cart).reduce((acc, item) => acc + (item.quantity || 0), 0);
  if (cartCountNav) cartCountNav.textContent = totalItems;

  const grandTotal = Object.keys(cart).reduce((acc, id) => {

    const card = document.querySelector(`.cart-card[data-id="${id}"]`);
    const price = card ? parseFloat(card.dataset.price) : 0;
    return acc + (price * cart[id].quantity);
  }, 0);

  const totalDisplay = document.getElementById('grand-total');
  if (totalDisplay) totalDisplay.textContent = `$${grandTotal.toFixed(2)}`;
}

loadCart();