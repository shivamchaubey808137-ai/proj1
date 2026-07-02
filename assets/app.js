(function() {
  // ---------- MENU DATA ----------
  const menuItems = [
    { id: 1, name: 'Margherita', desc: 'Classic tomato sauce, mozzarella, fresh basil.', price: 299, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=250&fit=crop&crop=center' },
    { id: 2, name: 'Pepperoni', desc: 'Loaded with pepperoni, mozzarella, and oregano.', price: 399, img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=250&fit=crop&crop=center' },
    { id: 3, name: 'Farmhouse', desc: 'Bell peppers, onions, mushrooms, sweet corn.', price: 349, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop&crop=center' },
    { id: 4, name: 'Cheese Burst', desc: 'Extra mozzarella, cheddar, parmesan cheese melt.', price: 459, img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=250&fit=crop&crop=center' },
    { id: 5, name: 'BBQ Chicken', desc: 'Tandoori chicken, BBQ sauce, red onions.', price: 429, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=250&fit=crop&crop=center' },
    { id: 6, name: 'Veggie Supreme', desc: 'Zucchini, bell peppers, olives, mushrooms.', price: 379, img: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&h=250&fit=crop&crop=center' }
  ];

  // ---------- CART STATE ----------
  let cart = [];

  // DOM refs
  const menuGrid = document.getElementById('menuGrid');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartBadge = document.getElementById('cartBadge');
  const cartIcon = document.getElementById('cartIcon');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');

  // ---------- RENDER MENU ----------
  function renderMenu() {
    menuGrid.innerHTML = menuItems.map(item => `
      <div class="menu-card">
        <img src="${item.img}" alt="${item.name}" loading="lazy" />
        <div class="menu-card-body">
          <h3>${item.name}</h3>
          <p class="desc">${item.desc}</p>
          <div class="menu-card-footer">
            <span class="price">₹${item.price}</span>
            <button class="btn-add" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
              <i class="fas fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach add-to-cart events
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = parseInt(this.dataset.id);
        const name = this.dataset.name;
        const price = parseInt(this.dataset.price);
        addToCart(id, name, price);
      });
    });
  }

  // ---------- CART LOGIC ----------
  function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    updateCartUI();
    // open cart briefly to show feedback
    openCart();
  }

  function removeItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);
      }
    }
    updateCartUI();
  }

  function deleteItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
  }

  function getTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  function getTotalItems() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function updateCartUI() {
    // Badge
    const count = getTotalItems();
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';

    // Render cart items
    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<div class="empty-cart-msg"><i class="fas fa-shopping-bag" style="font-size:2rem; color:#ddd0c4; margin-bottom:0.5rem; display:block;"></i> Your cart is empty.<br> <span style="font-size:0.85rem;">Add some delicious pizzas!</span></div>`;
    } else {
      cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">₹${item.price} each</span>
          </div>
          <div class="cart-item-controls">
            <button class="btn-qty" data-id="${item.id}" data-action="remove">−</button>
            <span class="cart-item-qty">${item.qty}</span>
            <button class="btn-qty" data-id="${item.id}" data-action="add">+</button>
            <button class="btn-qty remove" data-id="${item.id}" data-action="delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `).join('');

      // Attach cart control events
      document.querySelectorAll('.btn-qty').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const id = parseInt(this.dataset.id);
          const action = this.dataset.action;
          if (action === 'add') {
            const item = menuItems.find(i => i.id === id);
            if (item) addToCart(item.id, item.name, item.price);
          } else if (action === 'remove') {
            removeItem(id);
          } else if (action === 'delete') {
            deleteItem(id);
          }
        });
      });
    }

    // Update total
    cartTotalPrice.textContent = `₹${getTotal()}`;

    // Enable/disable checkout buttons
    const hasItems = cart.length > 0;
    document.getElementById('swiggyCheckout').disabled = !hasItems;
    document.getElementById('zomatoCheckout').disabled = !hasItems;
  }

  // ---------- CART SIDEBAR TOGGLE ----------
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartIcon.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // ---------- CHECKOUT (Swiggy / Zomato) ----------
  function redirectToDelivery(platform) {
    if (cart.length === 0) return;

    const swiggyUrl = 'https://www.swiggy.com/search?query=Neopolitan%20Pizza%20Waghodia%20Road';
    const zomatoUrl = 'https://www.zomato.com/search?q=Neopolitan%20Pizza%20Waghodia%20Road';
    const url = platform === 'swiggy' ? swiggyUrl : zomatoUrl;

    window.open(url, '_blank');
    closeCart();
  }

  document.getElementById('swiggyCheckout').addEventListener('click', function() {
    redirectToDelivery('swiggy');
  });
  document.getElementById('zomatoCheckout').addEventListener('click', function() {
    redirectToDelivery('zomato');
  });

  // ---------- INIT ----------
  renderMenu();
  updateCartUI();

  // close cart on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCart();
  });
})();

