const grid = document.getElementsByClassName('products-grid')[0];
const cartCount = document.querySelector('.cart span');
const searchBar = document.querySelector('nav input');
let cart = {};



function GetItemData(product) {
    const { _id, name, description, price, image } = product;   
    return  `<div class="card" data-id="${_id}">
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

async function UpdatedCount() {
  const ElementsInCart = await fetch('/cart/gettotal');         //This is json
  const ElementsInJsonFile = await ElementsInCart.json();
  const ItemsCount = ElementsInJsonFile['Quantity'];
  cartCount.textContent = ItemsCount;
}
 UpdatedCount();

async function UpdatedFields(e) {
  
  const res = await fetch('/api/quantity');
  const data = await res.json();

  const quantities = data.EachQuantity;

  const quantityMap = {};
  quantities.forEach(item => {
    quantityMap[item.ProductId] = item.Quantity;
  });

  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const id = card.dataset.id;
    const count = card.querySelector('.count');

    count.textContent = quantityMap[id] || 0;
  });
}



async function LoadItemData() {
    const res = await fetch('api/products');
    const data = await res.json();           // Await here since res.json() does not parse all the data at once.
    grid.innerHTML = data.map(GetItemData).join('');
    await UpdatedFields();
    UpdatedCount();
}

async function increaseItem(e) {
  const card  = e.target.closest('.card');
  const id    = card.dataset.id;
  const price = card.querySelector('.price').textContent.replace('$', '');
  const count = card.querySelector('.count');

  let Quantity = parseInt(count.textContent) + 1;
  count.textContent = Quantity;

  await fetch('/cart/increase', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, price, count: Quantity })
  });
  await UpdatedFields();
  UpdatedCount();
  
}

async function decreaseItem(e) {
  const card  = e.target.closest('.card');
  const id    = card.dataset.id;
  const price = card.querySelector('.price').textContent.replace('$', '');
  const count = card.querySelector('.count');

  if (parseInt(count.textContent) <= 0) return;
  let Quantity = parseInt(count.textContent) - 1;
  count.textContent = Quantity;

  await fetch('/cart/decrease', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, price, count: Quantity })
  });
  
  await UpdatedFields();
  UpdatedCount();
}

grid.addEventListener('click', async (e) => {
    if (e.target.classList.contains('increase')) {
    await increaseItem(e);
  }

  if (e.target.classList.contains('decrease')) {
    await decreaseItem(e);
  }
});

// Let's make the search bar responsvie.

searchBar.addEventListener('input', async (e)  => {
  const query = e.target.value;
  const res = await fetch(`/api/products/search?query=${query}`);
  const datta = await res.json();
  grid.innerHTML = datta.map(GetItemData).join("");
  await UpdatedFields();
});


LoadItemData();











