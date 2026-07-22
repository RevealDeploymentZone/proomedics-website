(function () {
  'use strict';

  // ── Cart Storage ───────────────────────────────────────────
  function getCart() {
    try { return JSON.parse(localStorage.getItem('promedic_cart') || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem('promedic_cart', JSON.stringify(cart));
  }
  function cartTotal(cart) {
    return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
  }
  function cartCount(cart) {
    return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  // ── Add to Cart ────────────────────────────────────────────
  window.addToCart = function (id, name, price, image) {
    var cart = getCart();
    var existing = cart.find(function (i) { return i.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: id, name: name, price: price, image: image, qty: 1 });
    }
    saveCart(cart);
    renderCartBadge();
    renderCartItems();
    openCart();
  };

  // ── Cart Badge ─────────────────────────────────────────────
  function renderCartBadge() {
    var badge = document.getElementById('cart-badge');
    var count = cartCount(getCart());
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // ── Open / Close Drawer ────────────────────────────────────
  function openCart() {
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('visible');
  }
  function closeCart() {
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.getElementById('cart-overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  }

  // ── Render Drawer Items ────────────────────────────────────
  function renderCartItems() {
    var cart = getCart();
    var container = document.getElementById('cart-items-list');
    var totalEl = document.getElementById('cart-total-price');
    var checkoutBtn = document.getElementById('cart-checkout-btn');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      if (totalEl) totalEl.textContent = '$0.00';
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    container.innerHTML = cart.map(function (item) {
      return '<div class="cart-item" data-id="' + item.id + '">' +
        '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img" onerror="this.style.display=\'none\'">' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-price">$' + (item.price * item.qty).toFixed(2) + '</div>' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn qty-dec" data-id="' + item.id + '">&#8722;</button>' +
            '<span>' + item.qty + '</span>' +
            '<button class="qty-btn qty-inc" data-id="' + item.id + '">&#43;</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" data-id="' + item.id + '" aria-label="Remove item">&#10005;</button>' +
      '</div>';
    }).join('');

    if (totalEl) totalEl.textContent = '$' + cartTotal(cart).toFixed(2);

    // Qty and remove listeners
    container.querySelectorAll('.qty-dec').forEach(function (btn) {
      btn.addEventListener('click', function () { changeQty(btn.dataset.id, -1); });
    });
    container.querySelectorAll('.qty-inc').forEach(function (btn) {
      btn.addEventListener('click', function () { changeQty(btn.dataset.id, 1); });
    });
    container.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () { removeItem(btn.dataset.id); });
    });
  }

  function changeQty(id, delta) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    saveCart(cart);
    renderCartBadge();
    renderCartItems();
  }

  function removeItem(id) {
    var cart = getCart().filter(function (i) { return i.id !== id; });
    saveCart(cart);
    renderCartBadge();
    renderCartItems();
  }

  // ── Inject Drawer HTML ─────────────────────────────────────
  function injectDrawer() {
    if (document.getElementById('cart-drawer')) return;

    var overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.addEventListener('click', closeCart);

    var drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.innerHTML =
      '<div class="cart-drawer-header">' +
        '<h3>Your Cart</h3>' +
        '<button id="cart-close-btn" aria-label="Close cart">&#10005;</button>' +
      '</div>' +
      '<div id="cart-items-list" class="cart-items-list"></div>' +
      '<div class="cart-drawer-footer">' +
        '<div class="cart-footer-total">' +
          '<span>Total</span>' +
          '<span id="cart-total-price">$0.00</span>' +
        '</div>' +
        '<p class="cart-rx-note">Rx items require valid prescription at checkout</p>' +
        '<a id="cart-checkout-btn" href="/checkout" class="cart-checkout-btn">Checkout</a>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    document.getElementById('cart-close-btn').addEventListener('click', closeCart);
  }

  // ── Inject Cart Icon into Navbar ───────────────────────────
  function injectCartIcon() {
    var container = document.querySelector('.navbar .container');
    if (!container || document.getElementById('cart-icon-btn')) return;

    var btn = document.createElement('button');
    btn.id = 'cart-icon-btn';
    btn.setAttribute('aria-label', 'Open cart');
    btn.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
        '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' +
      '</svg>' +
      '<span id="cart-badge" style="display:none">0</span>';

    btn.addEventListener('click', function () {
      renderCartItems();
      openCart();
    });

    // Insert before hamburger or at end
    var hamburger = container.querySelector('.hamburger');
    if (hamburger) {
      container.insertBefore(btn, hamburger);
    } else {
      container.appendChild(btn);
    }
  }

  // ── Wire up Add to Cart buttons ────────────────────────────
  function wireButtons() {
    document.querySelectorAll('[data-cart-product]').forEach(function (btn) {
      if (btn._cartWired) return;
      btn._cartWired = true;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.dataset.cartId || btn.dataset.cartProduct;
        var name = btn.dataset.cartName;
        var price = parseFloat(btn.dataset.cartPrice);
        var image = btn.dataset.cartImage || '';
        addToCart(id, name, price, image);
      });
    });
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    injectDrawer();
    injectCartIcon();
    renderCartBadge();
    wireButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
