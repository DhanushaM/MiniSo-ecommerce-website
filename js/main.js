// main.js - utility functions, auth helpers, product render helpers, cart functions

// Auth helpers
function getUsers(){
  return JSON.parse(localStorage.getItem('miniso_users') || '[]');
}
function saveUsers(users){
  localStorage.setItem('miniso_users', JSON.stringify(users));
}
function setCurrentUser(user){
  localStorage.setItem('miniso_current_user', JSON.stringify(user));
  updateAuthLink();
}
function getCurrentUser(){
  return JSON.parse(localStorage.getItem('miniso_current_user') || 'null');
}
function logout(){
  localStorage.removeItem('miniso_current_user');
  updateAuthLink();
}

// Update header auth link
function updateAuthLink(){
  const link = document.getElementById('auth-link');
  const user = getCurrentUser();
  if(link){
    if(user){
      link.textContent = 'Hi, ' + (user.name || user.email);
      link.href = '#';
      link.onclick = (e) => {
        e.preventDefault();
        if(confirm('Logout?')) { logout(); location.reload(); }
      };
    } else {
      link.textContent = 'Sign In';
      link.href = 'signin.html';
      link.onclick = null;
    }
  }
}

// Product render helpers
function renderProductGrid(elementId, productArray){
  const container = document.getElementById(elementId);
  if(!container) return;
  container.innerHTML = '';
  productArray.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="muted">${p.short}</p>
      <div class="price">₹${p.price}</div>
      <div class="actions">
        <button class="view" data-id="${p.id}">View</button>
        <button class="add" data-id="${p.id}">Add</button>
      </div>
    `;
    container.appendChild(card);
  });
  // attach listeners
  document.querySelectorAll('.card .view').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      location.href = 'product.html?id=' + id;
    });
  });
  document.querySelectorAll('.card .add').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = parseInt(e.currentTarget.dataset.id);
      addProductToCart(id, 1);
    });
  });
}

// Cart functions
function loadCart(){
  return JSON.parse(localStorage.getItem('miniso_cart') || '[]');
}
function saveCart(cart){
  localStorage.setItem('miniso_cart', JSON.stringify(cart));
}
function addProductToCart(id, qty){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const cart = loadCart();
  const existing = cart.find(x=>x.id===id);
  if(existing){
    existing.qty += qty;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: qty });
  }
  saveCart(cart);
  alert(p.name + ' added to cart');
  updateCartCount();
}
function clearCart(){
  localStorage.removeItem('miniso_cart');
  updateCartCount();
}
function updateCartCount(){
  const cnt = loadCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.cart-count').forEach(el=>el.textContent = cnt);
}

// Render cart list (used on cart page)
function renderCartList(){
  const container = document.getElementById('cart-list');
  if(!container) return;
  const cart = loadCart();
  container.innerHTML = '';
  if(cart.length === 0){
    container.innerHTML = '<p>Your cart is empty. <a href="products.html">Shop now</a></p>';
    document.getElementById('cart-total').textContent = '0';
    return;
  }
  let total = 0;
  cart.forEach((item, idx)=>{
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <strong>${item.name}</strong><br><span class="muted">₹${item.price} each</span>
      </div>
      <div>
        <label>Qty <input class="qty-input" data-idx="${idx}" type="number" min="1" value="${item.qty}"></label>
        <div style="margin-top:8px"><button class="remove-btn" data-idx="${idx}">Remove</button></div>
      </div>
    `;
    container.appendChild(div);
  });
  document.getElementById('cart-total').textContent = total;
  // attach qty change & remove
  document.querySelectorAll('.qty-input').forEach(inp=>{
    inp.addEventListener('change', e=>{
      const idx = parseInt(e.currentTarget.dataset.idx);
      const val = parseInt(e.currentTarget.value) || 1;
      const cart = loadCart();
      cart[idx].qty = val;
      saveCart(cart);
      renderCartList();
      updateCartCount();
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const idx = parseInt(e.currentTarget.dataset.idx);
      const cart = loadCart();
      cart.splice(idx,1);
      saveCart(cart);
      renderCartList();
      updateCartCount();
    });
  });
}

// Initialize header and auth link on all pages
document.addEventListener('DOMContentLoaded', () => {
  updateAuthLink();
  updateCartCount();
});
