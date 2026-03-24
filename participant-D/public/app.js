/**
 * Каталог и корзина. Добавление товаров, корзина и удаление — только после входа.
 */
const apiProducts = '/api/products';
const apiCart = '/api/cart';
const TOKEN_KEY = 'shop_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  const t = getToken();
  const h = { 'Content-Type': 'application/json' };
  if (t) h.Authorization = 'Bearer ' + t;
  return h;
}

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

function setGuestMode(isGuest) {
  document.body.classList.toggle('body--guest', isGuest);
  const hint = document.getElementById('guest-hint');
  if (hint) hint.classList.toggle('hidden', !isGuest);
}

function setAuthUI(user) {
  const guest = document.getElementById('auth-guest');
  const userEl = document.getElementById('auth-user');
  const label = document.getElementById('auth-user-label');
  document.getElementById('auth-err').textContent = '';
  if (user) {
    guest.classList.add('hidden');
    userEl.classList.remove('hidden');
    label.textContent = user.username;
    setGuestMode(false);
  } else {
    guest.classList.remove('hidden');
    userEl.classList.add('hidden');
    setGuestMode(true);
  }
}

async function refreshAuth() {
  const token = getToken();
  if (!token) {
    setAuthUI(null);
    return;
  }
  const r = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + token } });
  if (!r.ok) {
    localStorage.removeItem(TOKEN_KEY);
    setAuthUI(null);
    return;
  }
  const data = await r.json();
  setAuthUI(data.user);
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
      if (!getToken()) {
        document.getElementById('err-products').textContent = 'Войдите, чтобы добавить в корзину';
        return;
      }
      const productId = Number(addBtn.getAttribute('data-product-id'));
      document.getElementById('err-products').textContent = '';
      const r2 = await fetch(apiCart + '/add', {
        method: 'POST',
        headers: authHeaders(),
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
    if (!getToken()) {
      document.getElementById('err-products').textContent = 'Войдите, чтобы удалить товар';
      return;
    }
    const id = delBtn.getAttribute('data-id');
    const r3 = await fetch(apiProducts + '/' + id, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!r3.ok) {
      document.getElementById('err-products').textContent = await readError(r3);
      return;
    }
    loadProducts();
    loadCart();
  };
}

document.getElementById('add-products').onclick = async () => {
  if (!getToken()) {
    document.getElementById('err-products').textContent = 'Войдите, чтобы добавить товар';
    return;
  }
  const err = document.getElementById('err-products');
  err.textContent = '';
  const name = document.getElementById('name-products').value.trim();
  const price = document.getElementById('price-products').value;
  const r = await fetch(apiProducts, {
    method: 'POST',
    headers: authHeaders(),
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
  if (!getToken()) {
    document.getElementById('err-cart').textContent = 'Войдите, чтобы очистить корзину';
    return;
  }
  const r = await fetch(apiCart + '/clear', {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!r.ok) {
    document.getElementById('err-cart').textContent = await readError(r);
    return;
  }
  loadCart();
};

async function doLogin() {
  const err = document.getElementById('auth-err');
  err.textContent = '';
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value;
  const r = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) {
    err.textContent = await readError(r);
    return;
  }
  const data = await r.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  document.getElementById('auth-password').value = '';
  setAuthUI(data.user);
  loadProducts();
  loadCart();
}

async function doRegister() {
  const err = document.getElementById('auth-err');
  err.textContent = '';
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value;
  const r = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!r.ok) {
    err.textContent = await readError(r);
    return;
  }
  const data = await r.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  document.getElementById('auth-password').value = '';
  setAuthUI(data.user);
  loadProducts();
  loadCart();
}

document.getElementById('btn-login').onclick = () => doLogin();
document.getElementById('btn-register').onclick = () => doRegister();
document.getElementById('btn-logout').onclick = () => {
  localStorage.removeItem(TOKEN_KEY);
  setAuthUI(null);
  loadProducts();
  loadCart();
};

refreshAuth().then(() => {
  loadProducts();
  loadCart();
});
