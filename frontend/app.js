const API_URL = 'http://localhost:3000/api';

let menus = [];
let categories = [];
let customers = [];
let employees = []; // used for order dropdown
let baristas = [];  // used for barista CRUD
let tables = [];
let orders = [];
let ingredients = [];
let cart = [];

const rupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
}).format(Number(value || 0));

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

// UI Togglers
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-sidebar-overlay');
  
  if (sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
}

function switchView(viewId, element) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('bg-white/10', 'text-white');
    link.classList.add('text-white/70');
  });
  if (element) {
    element.classList.add('bg-white/10', 'text-white');
    element.classList.remove('text-white/70');
  }

  document.querySelectorAll('[data-view]').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(`view-${viewId}`).classList.add('active');

  if (!document.getElementById('sidebar').classList.contains('-translate-x-full') && window.innerWidth < 768) {
    toggleMobileMenu();
  }
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Terjadi kesalahan');
  return result;
}

async function loadAll() {
  await Promise.all([
    loadCategories(),
    loadIngredients(),
    loadMenus(),
    loadCustomers(),
    loadBaristas(),
    loadTables(),
    loadOrders(),
    loadDashboard()
  ]);
  renderSummary();
}

function renderSummary() {
  document.getElementById('dashTotalMenu').textContent = menus.length;
  document.getElementById('dashTotalCustomers').textContent = customers.length;
  document.getElementById('dashTotalOrders').textContent = orders.length;
}

let revChartInstance = null;
let bsChartInstance = null;

async function loadDashboard() {
  const filter = document.getElementById('revenueFilter').value || 'all';
  try {
    const result = await request(`/reports/dashboard?filter=${filter}`);
    const { totalFilteredRevenue, recentRevenue, bestSellers } = result.data;
    document.getElementById('dashTotalRevenue').textContent = rupiah(totalFilteredRevenue);
    
    // Render Revenue Chart
    const revCtx = document.getElementById('revenueChart').getContext('2d');
    if (revChartInstance) revChartInstance.destroy();
    revChartInstance = new Chart(revCtx, {
      type: 'line',
      data: {
        labels: recentRevenue.map(item => item.date_label),
        datasets: [{
          label: 'Pendapatan (Rp)',
          data: recentRevenue.map(item => Number(item.daily_revenue)),
          borderColor: '#8b5cf6', // Violet/Purple line
          backgroundColor: 'rgba(139, 92, 246, 0.15)', // Light purple fill
          borderWidth: 2,
          pointRadius: 0, // Remove dots to look like trading chart
          pointHoverRadius: 5,
          fill: true,
          tension: 0.1 // Slight curve but mostly straight
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' } }
        },
        plugins: {
          legend: { display: false } // Hide legend for cleaner look
        }
      }
    });
    
    // Render Best Sellers Chart
    const bsCtx = document.getElementById('bestSellersChart').getContext('2d');
    if (bsChartInstance) bsChartInstance.destroy();
    bsChartInstance = new Chart(bsCtx, {
      type: 'bar',
      data: {
        labels: bestSellers.map(item => item.menu_name),
        datasets: [{
          label: 'Porsi Terjual',
          data: bestSellers.map(item => Number(item.total_sold)),
          backgroundColor: '#745853'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
    
  } catch (error) {
    console.error('Gagal memuat dashboard:', error);
  }
}

// === CATEGORIES ===
async function loadCategories() {
  const result = await request('/categories');
  categories = result.data;
  const categorySelect = document.getElementById('categoryId');
  
  const defaultCategories = ['Coffee', 'Non-Coffee', 'Tea', 'Snack', 'Food', 'Dessert'];
  const allCategories = new Set(defaultCategories);
  categories.forEach(cat => allCategories.add(cat.category_name));

  categorySelect.innerHTML = '<option value="" disabled selected>Pilih Kategori</option>' + 
    Array.from(allCategories).map(catName => (
      `<option value="${catName}">${catName}</option>`
    )).join('');
}

// === INGREDIENTS ===
async function loadIngredients() {
  const result = await request('/ingredients');
  ingredients = result.data;
  renderIngredientTable();
}

function renderIngredientTable() {
  const table = document.getElementById('ingTable');
  table.innerHTML = ingredients.map(ing => `
    <tr class="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
      <td class="py-3 px-4 text-on-surface-variant text-[12px]">${ing.ing_id}</td>
      <td class="py-3 px-4 font-semibold text-primary">${ing.ing_name}</td>
      <td class="py-3 px-4 text-on-surface-variant">${ing.stock_qty} ${ing.unit}</td>
      <td class="py-3 px-4 text-right">
        <button class="text-xs bg-surface-container-high px-2 py-1 rounded border border-outline-variant mr-1 hover:bg-surface-container-highest transition-colors text-primary" onclick="editIng(${ing.ing_id})">Edit</button>
        <button class="text-xs bg-error-container px-2 py-1 rounded border border-error/20 text-error hover:bg-error-container/80 transition-colors" onclick="deleteIng(${ing.ing_id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function editIng(id) {
  const ing = ingredients.find(item => item.ing_id === id);
  if (!ing) return;
  document.getElementById('ingId').value = ing.ing_id;
  document.getElementById('ingName').value = ing.ing_name;
  document.getElementById('ingStock').value = ing.stock_qty;
  document.getElementById('ingUnit').value = ing.unit;
  switchView('ingredients', document.querySelectorAll('.nav-link')[2]);
}

function resetIngForm() {
  document.getElementById('ingForm').reset();
  document.getElementById('ingId').value = '';
}

async function deleteIng(id) {
  if (!confirm('Yakin hapus bahan baku ini?')) return;
  try {
    await request(`/ingredients/${id}`, { method: 'DELETE' });
    showToast('Bahan baku dihapus');
    await loadIngredients();
  } catch (error) {
    showToast(error.message);
  }
}

document.getElementById('ingForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('ingId').value;
  const payload = {
    ing_name: document.getElementById('ingName').value,
    stock_qty: Number(document.getElementById('ingStock').value),
    unit: document.getElementById('ingUnit').value
  };

  try {
    if (id) {
      await request(`/ingredients/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Bahan baku diubah');
    } else {
      await request('/ingredients', { method: 'POST', body: JSON.stringify(payload) });
      showToast('Bahan baku ditambahkan');
    }
    resetIngForm();
    await loadIngredients();
  } catch (error) {
    showToast(error.message);
  }
});

// === MENUS ===
async function loadMenus() {
  const result = await request('/menus');
  menus = result.data;
  renderMenuTable();
  renderOrderMenuOptions();
  renderSummary();
}

function renderMenuTable() {
  const table = document.getElementById('menuTable');
  table.innerHTML = menus.map(menu => `
    <tr class="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
      <td class="py-3 px-4 text-on-surface-variant text-[12px]">${menu.menu_id}</td>
      <td class="py-3 px-4 font-semibold text-primary">${menu.menu_name}</td>
      <td class="py-3 px-4 text-on-surface-variant">${menu.category_name}</td>
      <td class="py-3 px-4 text-primary">${rupiah(menu.price)}</td>
      <td class="py-3 px-4 text-on-surface-variant">-</td>
      <td class="py-3 px-4">
        <span class="text-[10px] font-bold px-2 py-1 rounded border text-success bg-green-100 border-green-200">
          Tersedia
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <button class="text-xs bg-surface-container-high px-2 py-1 rounded border border-outline-variant mr-1 hover:bg-surface-container-highest transition-colors text-primary" onclick="editMenu('${menu.menu_id}')">Edit</button>
        <button class="text-xs bg-error-container px-2 py-1 rounded border border-error/20 text-error hover:bg-error-container/80 transition-colors" onclick="deleteMenu('${menu.menu_id}')">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function renderOrderMenuOptions() {
  const select = document.getElementById('orderMenu');
  select.innerHTML = menus
    .map(menu => `<option value="${menu.menu_id}">${menu.menu_name} - ${rupiah(menu.price)}</option>`)
    .join('');
}

function getIngOptionsHtml(selectedId = '') {
  return ingredients.map(ing => `<option value="${ing.ing_id}" ${Number(selectedId) === ing.ing_id ? 'selected' : ''}>${ing.ing_name} (${ing.unit})</option>`).join('');
}

function addRecipeRow(ingId = '', qty = '') {
  const builder = document.getElementById('recipeBuilder');
  const div = document.createElement('div');
  div.className = 'flex items-center gap-2 recipe-row';
  div.innerHTML = `
    <select class="recipe-ing flex-1 border border-outline-variant rounded-lg p-2 text-sm outline-none focus:border-primary bg-white">
      <option value="">Pilih Bahan</option>
      ${getIngOptionsHtml(ingId)}
    </select>
    <input type="number" class="recipe-qty w-24 border border-outline-variant rounded-lg p-2 text-sm outline-none focus:border-primary" placeholder="Qty" value="${qty}" />
    <button type="button" class="text-error font-bold px-2" onclick="this.parentElement.remove()">X</button>
  `;
  builder.appendChild(div);
}

async function editMenu(id) {
  const menu = menus.find(item => item.menu_id === id);
  if (!menu) return;
  document.getElementById('menuId').value = menu.menu_id;
  document.getElementById('menuId').readOnly = true;
  document.getElementById('menuName').value = menu.menu_name;
  document.getElementById('categoryId').value = menu.category_id;
  document.getElementById('menuPrice').value = Number(menu.price);
  
  // Fetch detailed menu to get ingredients
  try {
    const detail = await request(`/menus/${id}`);
    document.getElementById('menuDescription').value = detail.data.description || '';
    
    document.getElementById('recipeBuilder').innerHTML = '';
    if (detail.data.ingredients && detail.data.ingredients.length > 0) {
      detail.data.ingredients.forEach(ing => {
        addRecipeRow(ing.ing_id, ing.qty_used);
      });
    }
  } catch (error) {
    showToast('Gagal mengambil detail resep');
  }

  switchView('menu', document.querySelectorAll('.nav-link')[1]);
}

function resetMenuForm() {
  document.getElementById('menuForm').reset();
  document.getElementById('menuId').value = '';
  document.getElementById('menuId').readOnly = false;
  document.getElementById('menuDescription').value = '';
  document.getElementById('recipeBuilder').innerHTML = '';
}

async function deleteMenu(id) {
  if (!confirm('Yakin hapus menu ini?')) return;
  try {
    await request(`/menus/${id}`, { method: 'DELETE' });
    showToast('Menu berhasil dihapus');
    await loadMenus();
  } catch (error) {
    showToast(error.message);
  }
}

document.getElementById('menuForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('menuId').value;
  const isUpdate = document.getElementById('menuId').readOnly;
  
  const recipeRows = document.querySelectorAll('.recipe-row');
  const recipeIngredients = [];
  recipeRows.forEach(row => {
    const ingId = row.querySelector('.recipe-ing').value;
    const qty = row.querySelector('.recipe-qty').value;
    if (ingId && qty) {
      recipeIngredients.push({ ing_id: Number(ingId), qty_used: Number(qty) });
    }
  });

  const payload = {
    menu_id: id,
    menu_name: document.getElementById('menuName').value,
    category_id: document.getElementById('categoryId').value,
    price: Number(document.getElementById('menuPrice').value),
    description: document.getElementById('menuDescription').value,
    ingredients: recipeIngredients
  };

  try {
    if (isUpdate) {
      await request(`/menus/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Menu berhasil diubah');
    } else {
      await request('/menus', { method: 'POST', body: JSON.stringify(payload) });
      showToast('Menu berhasil ditambahkan');
    }
    resetMenuForm();
    await loadMenus();
  } catch (error) {
    showToast(error.message);
  }
});

// === CUSTOMERS ===
async function loadCustomers() {
  const result = await request('/customers');
  customers = result.data;
  renderCustomerTable();
  renderCustomerOptions();
  renderSummary();
}

function renderCustomerTable() {
  const table = document.getElementById('customerTable');
  table.innerHTML = customers.map(customer => `
    <tr class="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
      <td class="py-3 px-4 text-on-surface-variant text-[12px]">${customer.customer_id}</td>
      <td class="py-3 px-4 font-semibold text-primary">${customer.customer_name}</td>
      <td class="py-3 px-4 text-on-surface-variant">${customer.phone || '-'}</td>
      <td class="py-3 px-4 text-on-surface-variant">${customer.email || '-'}</td>
      <td class="py-3 px-4 text-right">
        <button class="text-xs bg-surface-container-high px-2 py-1 rounded border border-outline-variant mr-1 hover:bg-surface-container-highest transition-colors text-primary" onclick="editCustomer(${customer.customer_id})">Edit</button>
        <button class="text-xs bg-error-container px-2 py-1 rounded border border-error/20 text-error hover:bg-error-container/80 transition-colors" onclick="deleteCustomer(${customer.customer_id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function renderCustomerOptions() {
  const select = document.getElementById('orderCustomer');
  select.innerHTML = '<option value="">Guest / Tanpa pelanggan</option>' + customers.map(customer => (
    `<option value="${customer.customer_id}">${customer.customer_name}</option>`
  )).join('');
}

function editCustomer(id) {
  const customer = customers.find(item => item.customer_id === id);
  if (!customer) return;
  document.getElementById('customerId').value = customer.customer_id;
  document.getElementById('customerName').value = customer.customer_name;
  document.getElementById('customerPhone').value = customer.phone || '';
  document.getElementById('customerEmail').value = customer.email || '';
  switchView('customers', document.querySelectorAll('.nav-link')[4]);
}

function resetCustomerForm() {
  document.getElementById('customerForm').reset();
  document.getElementById('customerId').value = '';
}

async function deleteCustomer(id) {
  if (!confirm('Yakin hapus pelanggan ini?')) return;
  try {
    await request(`/customers/${id}`, { method: 'DELETE' });
    showToast('Pelanggan berhasil dihapus');
    await loadCustomers();
  } catch (error) {
    showToast(error.message);
  }
}

document.getElementById('customerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('customerId').value;
  const payload = {
    customer_name: document.getElementById('customerName').value,
    phone: document.getElementById('customerPhone').value,
    email: document.getElementById('customerEmail').value
  };

  try {
    if (id) {
      await request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Pelanggan diubah');
    } else {
      await request('/customers', { method: 'POST', body: JSON.stringify(payload) });
      showToast('Pelanggan ditambahkan');
    }
    resetCustomerForm();
    await loadCustomers();
  } catch (error) {
    showToast(error.message);
  }
});

// === BARISTAS ===
async function loadBaristas() {
  const result = await request('/baristas');
  baristas = result.data;
  renderBaristaTable();
  
  // also update employee dropdown
  const select = document.getElementById('orderEmployee');
  select.innerHTML = baristas.map(barista => (
    `<option value="${barista.barista_id}">${barista.barista_name} - ${barista.shift}</option>`
  )).join('');
}

function renderBaristaTable() {
  const table = document.getElementById('baristaTable');
  table.innerHTML = baristas.map(barista => `
    <tr class="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
      <td class="py-3 px-4 text-on-surface-variant text-[12px]">${barista.barista_id}</td>
      <td class="py-3 px-4 font-semibold text-primary">${barista.barista_name}</td>
      <td class="py-3 px-4 text-on-surface-variant">${barista.shift}</td>
      <td class="py-3 px-4 text-on-surface-variant">${barista.phone_number || '-'}</td>
      <td class="py-3 px-4 text-right">
        <button class="text-xs bg-surface-container-high px-2 py-1 rounded border border-outline-variant mr-1 hover:bg-surface-container-highest transition-colors text-primary" onclick="editBarista(${barista.barista_id})">Edit</button>
        <button class="text-xs bg-error-container px-2 py-1 rounded border border-error/20 text-error hover:bg-error-container/80 transition-colors" onclick="deleteBarista(${barista.barista_id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function editBarista(id) {
  const barista = baristas.find(item => item.barista_id === id);
  if (!barista) return;
  document.getElementById('baristaId').value = barista.barista_id;
  document.getElementById('baristaName').value = barista.barista_name;
  document.getElementById('baristaShift').value = barista.shift;
  document.getElementById('baristaPhone').value = barista.phone_number || '';
  switchView('baristas', document.querySelectorAll('.nav-link')[5]);
}

function resetBaristaForm() {
  document.getElementById('baristaForm').reset();
  document.getElementById('baristaId').value = '';
}

async function deleteBarista(id) {
  if (!confirm('Yakin hapus barista ini?')) return;
  try {
    await request(`/baristas/${id}`, { method: 'DELETE' });
    showToast('Barista dihapus');
    await loadBaristas();
  } catch (error) {
    showToast(error.message);
  }
}

document.getElementById('baristaForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('baristaId').value;
  const payload = {
    barista_name: document.getElementById('baristaName').value,
    shift: document.getElementById('baristaShift').value,
    phone_number: document.getElementById('baristaPhone').value
  };

  try {
    if (id) {
      await request(`/baristas/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Barista diubah');
    } else {
      await request('/baristas', { method: 'POST', body: JSON.stringify(payload) });
      showToast('Barista ditambahkan');
    }
    resetBaristaForm();
    await loadBaristas();
  } catch (error) {
    showToast(error.message);
  }
});

// === TABLES (MEJA) ===
async function loadTables() {
  const result = await request('/tables');
  tables = result.data;
  renderMejaTable();

  const select = document.getElementById('orderMeja');
  select.innerHTML = tables.map(table => (
    `<option value="${table.meja_id}">Meja ${table.nomor_meja || table.meja_id} (${table.kapasitas || 0} pax)</option>`
  )).join('');
}

function renderMejaTable() {
  const tableBody = document.getElementById('mejaTable');
  tableBody.innerHTML = tables.map(table => `
    <tr class="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
      <td class="py-3 px-4 text-on-surface-variant text-[12px]">${table.meja_id}</td>
      <td class="py-3 px-4 font-semibold text-primary">${table.nomor_meja}</td>
      <td class="py-3 px-4 text-on-surface-variant">${table.kapasitas} Orang</td>
      <td class="py-3 px-4">
        <span class="text-[10px] font-bold px-2 py-1 rounded border ${table.status === 'Available' ? 'text-success bg-green-100 border-green-200' : 'text-error bg-error-container border-error/20'}">
          ${table.status}
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <button class="text-xs bg-surface-container-high px-2 py-1 rounded border border-outline-variant mr-1 hover:bg-surface-container-highest transition-colors text-primary" onclick="editTable(${table.meja_id})">Edit</button>
        <button class="text-xs bg-error-container px-2 py-1 rounded border border-error/20 text-error hover:bg-error-container/80 transition-colors" onclick="deleteTable(${table.meja_id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function editTable(id) {
  const table = tables.find(item => item.meja_id === id);
  if (!table) return;
  document.getElementById('tableId').value = table.meja_id;
  document.getElementById('tableNumber').value = table.nomor_meja;
  document.getElementById('tableCapacity').value = table.kapasitas;
  document.getElementById('tableStatus').value = table.status || 'Available';
  switchView('tables', document.querySelectorAll('.nav-link')[3]);
}

function resetTableForm() {
  document.getElementById('tableForm').reset();
  document.getElementById('tableId').value = '';
}

async function deleteTable(id) {
  if (!confirm('Yakin hapus meja ini?')) return;
  try {
    await request(`/tables/${id}`, { method: 'DELETE' });
    showToast('Meja dihapus');
    await loadTables();
  } catch (error) {
    showToast(error.message);
  }
}

document.getElementById('tableForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('tableId').value;
  const payload = {
    nomor_meja: Number(document.getElementById('tableNumber').value),
    kapasitas: Number(document.getElementById('tableCapacity').value),
    status: document.getElementById('tableStatus').value
  };

  try {
    if (id) {
      await request(`/tables/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showToast('Meja diubah');
    } else {
      await request('/tables', { method: 'POST', body: JSON.stringify(payload) });
      showToast('Meja ditambahkan');
    }
    resetTableForm();
    await loadTables();
  } catch (error) {
    showToast(error.message);
  }
});

// === ORDERS ===
async function loadOrders() {
  const result = await request('/orders');
  orders = result.data;
  renderOrderTable();
  renderSummary();
  loadDashboard();
}

function renderOrderTable() {
  const table = document.getElementById('orderTable');
  table.innerHTML = orders.map(order => `
    <tr class="hover:bg-surface-container-low transition-colors border-b border-outline-variant/10">
      <td class="py-3 px-4 text-on-surface-variant text-[12px]">${order.order_id}</td>
      <td class="py-3 px-4 font-semibold text-primary">${order.customer_name}</td>
      <td class="py-3 px-4 text-on-surface-variant">${order.employee_name}</td>
      <td class="py-3 px-4">
        <span class="text-[10px] font-bold px-2 py-1 rounded border text-on-secondary-container bg-secondary-container border-outline-variant/20">
          ${order.order_status}
        </span>
      </td>
      <td class="py-3 px-4 font-bold text-primary">${rupiah(order.total_amount)}</td>
      <td class="py-3 px-4 text-on-surface-variant">${order.payment_method || '-'} / ${order.payment_status || '-'}</td>
      <td class="py-3 px-4 text-right">
        <button class="text-xs bg-surface-container-high px-2 py-1 rounded border border-outline-variant mr-1 hover:bg-surface-container-highest transition-colors text-primary" onclick="showOrderDetail(${order.order_id})">Detail</button>
        <button class="text-xs bg-error-container px-2 py-1 rounded border border-error/20 text-error hover:bg-error-container/80 transition-colors" onclick="deleteOrder(${order.order_id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function addToCart() {
  const menuId = document.getElementById('orderMenu').value;
  const quantity = Number(document.getElementById('orderQuantity').value);
  const menu = menus.find(item => item.menu_id === menuId);

  if (!menu) return showToast('Menu belum dipilih');
  if (quantity <= 0) return showToast('Quantity harus lebih dari 0');

  const existing = cart.find(item => item.menu_id === menuId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      price: Number(menu.price),
      quantity
    });
  }

  renderCart();
}

function renderCart() {
  const list = document.getElementById('cartList');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    list.innerHTML = '<div class="flex items-center justify-center h-full text-on-surface-variant text-sm bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg p-4">Belum ada item.</div>';
  } else {
    list.innerHTML = cart.map((item, index) => `
      <div class="flex justify-between items-center bg-surface-container-low p-2 rounded-lg border border-outline-variant/30">
        <div>
          <strong class="text-primary text-sm">${item.menu_name}</strong><br />
          <small class="text-on-surface-variant">${item.quantity} x ${rupiah(item.price)}</small>
        </div>
        <button class="text-xs bg-error-container px-2 py-1 rounded text-error border border-error/20" onclick="removeCartItem(${index})">X</button>
      </div>
    `).join('');
  }

  document.getElementById('cartTotal').textContent = rupiah(total);
}

function removeCartItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

document.getElementById('orderForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    showToast('Keranjang masih kosong');
    return;
  }

  const payload = {
    customer_id: document.getElementById('orderCustomer').value || null,
    employee_id: Number(document.getElementById('orderEmployee').value),
    meja_id: Number(document.getElementById('orderMeja').value),
    payment_method: document.getElementById('paymentMethod').value,
    items: cart.map(item => ({ menu_id: item.menu_id, quantity: item.quantity }))
  };

  try {
    await request('/orders', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Pesanan berhasil dibuat');
    clearCart();
    await loadOrders();
    await loadIngredients(); // Refresh stok bahan baku
    await loadDashboard(); // Refresh grafik dashboard
  } catch (error) {
    showToast(error.message);
  }
});

async function showOrderDetail(orderId) {
  try {
    const result = await request(`/orders/${orderId}/details`);
    const orderItems = result.data;
    
    document.getElementById('modalOrderId').textContent = orderId;
    const modalList = document.getElementById('modalOrderItems');
    let total = 0;
    
    if (orderItems.length === 0) {
      modalList.innerHTML = '<p>Tidak ada detail pesanan</p>';
    } else {
      modalList.innerHTML = orderItems.map(item => {
        total += Number(item.subtotal);
        return `
          <div class="flex justify-between items-center border-b border-outline-variant/20 pb-2">
            <div>
              <p class="font-bold text-primary">${item.menu_name}</p>
              <p class="text-xs">${item.quantity} x ${rupiah(item.price_at_order)}</p>
            </div>
            <span class="font-bold">${rupiah(item.subtotal)}</span>
          </div>
        `;
      }).join('');
    }
    
    document.getElementById('modalOrderTotal').textContent = rupiah(total);
    
    // Show Modal
    const modal = document.getElementById('orderModal');
    modal.classList.remove('hidden');
    // slight delay to allow display block to process before opacity
    setTimeout(() => {
      modal.classList.add('opacity-100');
    }, 10);
    
  } catch (error) {
    showToast(error.message);
  }
}

function closeModal() {
  const modal = document.getElementById('orderModal');
  modal.classList.add('hidden');
}

function printReceipt() {
  const orderId = document.getElementById('modalOrderId').textContent;
  const itemsHtml = document.getElementById('modalOrderItems').innerHTML;
  const total = document.getElementById('modalOrderTotal').textContent;
  
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt #${orderId}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; width: 300px; margin: 0 auto; }
          h2 { text-align: center; margin-bottom: 5px; font-size: 20px; }
          .header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .item-details { display: flex; flex-direction: column; }
          .item-name { font-weight: bold; }
          .item-qty { font-size: 12px; color: #555; }
          .total { border-top: 1px dashed #000; margin-top: 15px; padding-top: 10px; font-weight: bold; display: flex; justify-content: space-between; font-size: 16px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; border-top: 1px dashed #000; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>EspressoPro</h2>
          <p style="margin:0; font-size:12px;">Order #${orderId}</p>
          <p style="margin:0; font-size:12px;">${new Date().toLocaleString('id-ID')}</p>
        </div>
        <div class="content">
  `);
  
  const itemsDiv = document.createElement('div');
  itemsDiv.innerHTML = itemsHtml;
  const items = itemsDiv.querySelectorAll('.flex.justify-between');
  
  items.forEach(item => {
    const name = item.querySelector('.font-bold.text-primary').textContent;
    const qtyPrice = item.querySelector('.text-xs').textContent;
    const subtotal = item.querySelector('span.font-bold').textContent;
    
    printWindow.document.write(`
      <div class="item">
        <div class="item-details">
          <span class="item-name">${name}</span>
          <span class="item-qty">${qtyPrice}</span>
        </div>
        <span>${subtotal}</span>
      </div>
    `);
  });
  
  printWindow.document.write(`
        </div>
        <div class="total">
          <span>TOTAL</span>
          <span>${total}</span>
        </div>
        <div class="footer">
          <p>Terima kasih atas kunjungan Anda!</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

async function deleteOrder(orderId) {
  if (!confirm('Yakin hapus pesanan ini?')) return;
  try {
    await request(`/orders/${orderId}`, { method: 'DELETE' });
    showToast('Pesanan berhasil dihapus');
    await loadOrders();
  } catch (error) {
    showToast(error.message);
  }
}

loadAll().catch(error => {
  showToast(`Gagal memuat data: ${error.message}`);
});
