// ── CART STATE (localStorage) ──────────────────────────────────
const CART_KEY = 'lumiere_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(c => c.id === product.id);
  if (idx > -1) cart[idx].qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  updateCartBadge();
  showToast('Added to bag ✦');
}
function removeFromCart(id) {
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}
function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}
function updateCartBadge() {
  const count = getCart().reduce((s, c) => s + c.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── CART DRAWER ──────────────────────────────────────────────────
function toggleCart(force) {
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  const isOpen = drawer.classList.contains('open');
  const open = force !== undefined ? force : !isOpen;
  overlay.classList.toggle('open', open);
  drawer.classList.toggle('open', open);
  if (open) renderCartDrawer();
}
function renderCartDrawer() {
  const cart = getCart();
  const body = document.getElementById('cartBody');
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  document.getElementById('cartTotalVal').textContent = '₹' + total.toLocaleString('en-IN');
  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛍️</div>Your bag is empty</div>`;
    return;
  }
  body.innerHTML = cart.map(item => `
    <div class="c-item">
      <div class="c-img">${item.icon}</div>
      <div class="c-info">
        <div class="c-name">${item.name}</div>
        <div class="c-sub">${item.sub}</div>
        <div class="c-row">
          <div class="c-qty">
            <button onclick="changeCartQty(${item.id},-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeCartQty(${item.id},1)">+</button>
          </div>
          <span class="c-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
          <button class="c-remove" onclick="removeFromCart(${item.id})">×</button>
        </div>
      </div>
    </div>`).join('');
}

// ── TOAST ──────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── NAVBAR SCROLL EFFECT ───────────────────────────────────────
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', scrollY > 40);
});

// ── INIT ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  // Mark active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
