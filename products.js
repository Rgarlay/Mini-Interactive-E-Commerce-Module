const grid = document.getElementsByClassName('products-grid')[0];
const cartCount = document.querySelector('.cart span');
const cart = {}; 
let totalCart = 0;

function createCard(product) {
  const { _id, name, description, price, image } = product;
  return `
    <div class="card" data-id="${_id}">
      <img src="${image}" alt="${name}" />
      <div class="card-body">
        <h3>${name}</h3>
        <p>${description}</p>
        <div class="card-footer">
          <span class="price">$${price}</span>
          <div class="quantity">
            <button class="decrease">−</button>
            <span class="count">0</span>
            <button class="increase">+</button>
          </div>
        </div>
      </div>
    </div>`;
}

const searchInput = document.querySelector('nav input');

searchInput.addEventListener('input', async () => {
  const keyword = searchInput.value.trim();
  const res = await fetch(`/api/products?search=${keyword}`);
  const products = await res.json();
  grid.innerHTML = products.map(createCard).join('');
  document.querySelectorAll('.card').forEach(attachListeners);
  restoreCounts();
});

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    Object.assign(cart, JSON.parse(saved));
    totalCart = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCart;
  }
}

function attachListeners(card) {
  const increase = card.querySelector('.increase');
  const decrease = card.querySelector('.decrease');
  const count = card.querySelector('.count');
  const id = card.dataset.id;

  increase.addEventListener('click', () => {
    count.textContent = parseInt(count.textContent) + 1;
    cart[id] = { quantity: (cart[id]?.quantity || 0) + 1 };
    cartCount.textContent = ++totalCart;
    console.log(cart);
    saveCart();
  });

  decrease.addEventListener('click', () => {
    if (parseInt(count.textContent) > 0) {
      count.textContent = parseInt(count.textContent) - 1;
      cart[id].quantity--;
      if (cart[id].quantity === 0) delete cart[id];
      cartCount.textContent = --totalCart;
      console.log(cart);
      saveCart();
    }
  });
}

function restoreCounts() {
  document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    if (cart[id]) {
      card.querySelector('.count').textContent = cart[id].quantity;
    }
  });
}

async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  grid.innerHTML = products.map(createCard).join('');
  document.querySelectorAll('.card').forEach(attachListeners);
  loadCart();
  restoreCounts();
}

loadProducts();














