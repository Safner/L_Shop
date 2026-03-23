/**
 * Участник A: загрузка каталога и корзины с сервера (GET работают).
 * Кнопки добавления/удаления покажут сообщение, пока B и C не подключат API.
 */
const apiProducts = '/api/products';
const apiCart = '/api/cart';

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

async function readError(r) {
  try {
    const j = await r.json();
    return j.error || r.statusText;
  } catch {
    return r.statusText;
  }
}

async function loadProducts() {
  const err = document.getElementById('err-products');
  err.textContent = '';
  const r = await fetch(apiProducts);
  const data = await r.json();
  const grid = document.getElementById('product-grid');
  const emptyHint = document.getElementById('empty-catalog');
  grid.innerHTML = '';
  if (data.length === 0) {
    emptyHint.classList.remove('hidden');
  } else {
    emptyHint.classList.add('hidden');
  }
  for (const p of data) {
    const letter = p.name && p.name[0] ? p.name[0].toUpperCase() : '?';
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML =
      '<div class="product-card-inner">' +
      '<div class="product-avatar" aria-hidden="true">' +
      escapeHtml(letter) +
      '</div>' +
      '<div class="product-body">' +
      '<h3 class="product-name">' +
      escapeHtml(p.name) +
      '</h3>' +
      '<p class="product-price">' +
      escapeHtml(String(p.price)) +
      ' <span class="byn">Br</span></p>' +
      '<div class="product-actions">' +
      '<button type="button" class="btn btn-primary btn-cart" data-product-id="' +
      p.id +
      '">В корзину</button>' +
      '<button type="button" class="btn-link btn-del" data-id="' +
      p.id +
      '">Удалить</button>' +
      '</div></div></div>';
    grid.appendChild(card);
  }

  grid.onclick = async (e) => {
    const addBtn = e.target.closest('button.btn-cart');
    if (addBtn) {
      const productId = Number(addBtn.getAttribute('data-product-id'));
      document.getElementById('err-products').textContent = '';
      const r2 = await fetch(apiCart + '/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, qty: 1 }),
      });
      if (!r2.ok) {
        document.getElementById('err-products').textContent = await readError(r2);
        return;
      }
      loadCart();
      addBtn.classList.add('btn-pulse');
      setTimeout(() => addBtn.classList.remove('btn-pulse'), 400);
      return;
    }
    const delBtn = e.target.closest('button.btn-del');
    if (!delBtn) return;
    const id = delBtn.getAttribute('data-id');
    const r3 = await fetch(apiProducts + '/' + id, { method: 'DELETE' });
    if (!r3.ok) {
      document.getElementById('err-products').textContent = await readError(r3);
      return;
    }
    loadProducts();
    loadCart();
  };
}

document.getElementById('add-products').onclick = async () => {
  const err = document.getElementById('err-products');
  err.textContent = '';
  const name = document.getElementById('name-products').value.trim();
  const price = document.getElementById('price-products').value;
  const r = await fetch(apiProducts, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price: Number(price) }),
  });
  if (!r.ok) {
    err.textContent = await readError(r);
    return;
  }
  document.getElementById('name-products').value = '';
  document.getElementById('price-products').value = '';
  loadProducts();
};

async function loadCart() {
  document.getElementById('err-cart').textContent = '';
  const r = await fetch(apiCart);
  const data = await r.json();
  const ul = document.getElementById('cart-lines');
  const empty = document.getElementById('cart-empty');
  const footer = document.getElementById('cart-footer');
  ul.innerHTML = '';
  let count = 0;
  for (const row of data.items) {
    count += row.qty;
    const li = document.createElement('li');
    li.className = 'cart-line';
    li.innerHTML =
      '<span class="cart-line-name">' +
      escapeHtml(row.name) +
      '</span>' +
      '<span class="cart-line-meta">' +
      row.qty +
      ' × ' +
      row.price +
      ' Br</span>' +
      '<span class="cart-line-sum">' +
      row.lineTotal +
      ' Br</span>';
    ul.appendChild(li);
  }
  document.getElementById('total-cart').textContent = String(data.total);
  document.getElementById('cart-count').textContent = String(count);
  if (data.items.length === 0) {
    empty.classList.remove('hidden');
    footer.classList.add('hidden');
  } else {
    empty.classList.add('hidden');
    footer.classList.remove('hidden');
  }
}

document.getElementById('clear-cart').onclick = async () => {
  const r = await fetch(apiCart + '/clear', { method: 'DELETE' });
  if (!r.ok) {
    document.getElementById('err-cart').textContent = await readError(r);
    return;
  }
  loadCart();
};

loadProducts();
loadCart();
