const TOKEN_KEY = 'shop_token';

async function readError(r) {
  try {
    const j = await r.json();
    return j.error || r.statusText;
  } catch {
    return r.statusText;
  }
}

function goShop() {
  window.location.href = '/shop';
}

document.getElementById('btn-register').onclick = async () => {
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
  goShop();
};

document.getElementById('btn-login').onclick = async () => {
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
  goShop();
};
