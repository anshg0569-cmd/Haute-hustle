"use strict";

const csrfToken = document.body.dataset.csrf;
const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[character]);
let inventory = [];
let orders = [];
let toastTimer = 0;

function showStatus(message, isError = false) {
  const status = document.querySelector("#adminStatus");
  status.textContent = message;
  status.classList.toggle("is-error", isError);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body) {
    headers["X-CSRF-Token"] = csrfToken;
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  }
  const response = await fetch(path, { credentials: "same-origin", ...options, headers });
  const result = await response.json();
  if (response.status === 401) {
    window.location.assign("login.php");
    throw new Error("Your admin session expired. Sign in again.");
  }
  if (!response.ok) throw new Error(result.error || "The request could not be completed.");
  return result;
}

function renderInventory() {
  document.querySelector("#adminProductCount").textContent = inventory.length.toLocaleString("en-IN");
  document.querySelector("#statProducts").textContent = inventory.length.toLocaleString("en-IN");
  const target = document.querySelector("#adminProductRows");
  const search = document.querySelector("#inventorySearch").value.trim().toLocaleLowerCase();
  const category = document.querySelector("#inventoryCategoryFilter").value;
  const visibleProducts = inventory.filter((product) => {
    const matchesSearch = !search || `${product.name} ${product.description}`.toLocaleLowerCase().includes(search);
    return matchesSearch && (category === "all" || product.category === category);
  });
  if (!visibleProducts.length) {
    const message = inventory.length ? "No products match these filters." : "No active products.";
    target.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
    return;
  }
  target.innerHTML = visibleProducts.map((product) => `<tr>
    <td><div class="inventory-item"><img src="${escapeHTML(product.image)}" alt="" loading="lazy"><span>${escapeHTML(product.name)}</span></div></td>
    <td>${money(product.price)}</td><td>${Number(product.stock)}</td>
    <td><div class="inventory-actions"><button type="button" data-edit-product="${escapeHTML(product.id)}">Edit</button><button type="button" data-delete-product="${escapeHTML(product.id)}">Delete</button></div></td>
  </tr>`).join("");
}

function renderOrders(stats) {
  document.querySelector("#statOrders").textContent = Number(stats.orders).toLocaleString("en-IN");
  document.querySelector("#statSales").textContent = money(stats.sales);
  const target = document.querySelector("#adminOrderRows");
  if (!orders.length) {
    target.innerHTML = '<tr><td colspan="6">No customer orders have been placed.</td></tr>';
    return;
  }
  const statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  target.innerHTML = orders.map((order) => {
    const date = new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const itemList = order.items.map((item) =>
      `${Number(item.quantity)} × ${escapeHTML(item.name)} (${escapeHTML(item.size)})`).join("<br>");
    const address = `${escapeHTML(order.address)}, ${escapeHTML(order.city)} ${escapeHTML(order.postalCode)}`;
    return `<tr>
      <td><strong>${escapeHTML(order.orderNumber)}</strong><br>${escapeHTML(order.customer)}<br><small>${escapeHTML(order.email)} · ${escapeHTML(order.phone)}</small><br><small>${address} · ${escapeHTML(date)}</small></td>
      <td>${itemList}</td>
      <td>${money(order.total)}</td>
      <td>${escapeHTML(order.paymentMethod)}<br>${escapeHTML(order.paymentProvider)}<br><small>${escapeHTML(order.paymentStatus)}</small></td>
      <td>${escapeHTML(order.status)}</td>
      <td><div class="order-status-actions"><select aria-label="Status for ${escapeHTML(order.orderNumber)}" data-order-status="${order.id}">${statuses.map((status) =>
        `<option value="${status}"${status === order.status ? " selected" : ""}>${status}</option>`).join("")}</select>
        <button class="button button-outline" type="button" data-save-order="${order.id}">Save</button></div></td>
    </tr>`;
  }).join("");
}

async function loadDashboard() {
  const [productResult, orderResult] = await Promise.all([
    request("../api/admin-products.php"),
    request("../api/admin-orders.php")
  ]);
  inventory = productResult.products;
  orders = orderResult.orders;
  renderInventory();
  renderOrders(orderResult.stats);
}

function resetForm() {
  document.querySelector("#productForm").reset();
  document.querySelector("#editProductId").value = "";
  document.querySelector("#adminStock").value = "1";
  document.querySelector("#productFormHeading").textContent = "Add a product";
  document.querySelector("#saveProductButton").textContent = "Add product";
  document.querySelector("#cancelEditButton").hidden = true;
  showStatus("");
}

function editProduct(id) {
  const product = inventory.find((entry) => entry.id === id);
  if (!product) return;
  document.querySelector("#editProductId").value = product.id;
  document.querySelector("#adminName").value = product.name;
  document.querySelector("#adminCategory").value = product.category;
  document.querySelector("#adminPrice").value = product.price;
  document.querySelector("#adminSizes").value = product.sizes.join(", ");
  document.querySelector("#adminStock").value = product.stock;
  document.querySelector("#adminCondition").value = product.condition;
  document.querySelector("#adminImage").value = product.image;
  document.querySelector("#adminDescription").value = product.description;
  document.querySelector("#productFormHeading").textContent = "Edit product";
  document.querySelector("#saveProductButton").textContent = "Save changes";
  document.querySelector("#cancelEditButton").hidden = false;
  showStatus("Editing a database product.");
  document.querySelector("#productForm").scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelector("#productForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const data = {
    id: document.querySelector("#editProductId").value,
    name: document.querySelector("#adminName").value.trim(),
    category: document.querySelector("#adminCategory").value,
    price: Number(document.querySelector("#adminPrice").value),
    sizes: document.querySelector("#adminSizes").value.split(",").map((size) => size.trim()).filter(Boolean),
    stock: Number(document.querySelector("#adminStock").value),
    condition: document.querySelector("#adminCondition").value,
    image: document.querySelector("#adminImage").value.trim(),
    description: document.querySelector("#adminDescription").value.trim()
  };
  try {
    await request("../api/admin-products.php", { method: "POST", body: JSON.stringify(data) });
    resetForm();
    await loadDashboard();
    showToast(data.id ? "Product updated." : "Product added.");
  } catch (error) {
    showStatus(error.message, true);
  }
});

document.querySelector("#adminImageUpload").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const file = input.files[0];
  if (!file) return;
  const data = new FormData();
  data.append("image", file);
  try {
    const result = await request("../api/admin-images.php", { method: "POST", body: data });
    document.querySelector("#adminImage").value = result.image;
    showStatus("Image uploaded. Save the product to publish it.");
  } catch (error) {
    showStatus(error.message, true);
  } finally {
    input.value = "";
  }
});

document.querySelector("#inventorySearch").addEventListener("input", renderInventory);
document.querySelector("#inventoryCategoryFilter").addEventListener("change", renderInventory);

document.querySelector("#cancelEditButton").addEventListener("click", resetForm);
document.querySelector("#createAdminForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#adminAccountStatus");
  const password = document.querySelector("#newAdminPassword").value;
  const confirmation = document.querySelector("#newAdminPasswordConfirm").value;
  if (password !== confirmation) {
    status.textContent = "Passwords do not match.";
    status.classList.add("is-error");
    return;
  }
  try {
    await request("../api/admin-users.php", {
      method: "POST",
      body: JSON.stringify({
        username: document.querySelector("#newAdminUsername").value.trim(),
        password
      })
    });
    form.reset();
    status.textContent = "Admin account created.";
    status.classList.remove("is-error");
  } catch (error) {
    status.textContent = error.message;
    status.classList.add("is-error");
  }
});

document.querySelector("#changeAdminPasswordForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#adminPasswordStatus");
  const newPassword = document.querySelector("#newOwnAdminPassword").value;
  const confirmation = document.querySelector("#newOwnAdminPasswordConfirm").value;
  if (newPassword !== confirmation) {
    status.textContent = "Passwords do not match.";
    status.classList.add("is-error");
    return;
  }
  try {
    await request("../api/admin-password.php", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: document.querySelector("#currentAdminPassword").value,
        newPassword
      })
    });
    form.reset();
    status.textContent = "Your admin password has been updated.";
    status.classList.remove("is-error");
  } catch (error) {
    status.textContent = error.message;
    status.classList.add("is-error");
  }
});

document.querySelector("#adminProductRows").addEventListener("click", async (event) => {
  const edit = event.target.closest("[data-edit-product]");
  const remove = event.target.closest("[data-delete-product]");
  if (edit) editProduct(edit.dataset.editProduct);
  if (remove) {
    const product = inventory.find((entry) => entry.id === remove.dataset.deleteProduct);
    if (!product || !window.confirm(`Delete "${product.name}" from the store?`)) return;
    try {
      await request(`../api/admin-products.php?id=${encodeURIComponent(product.id)}`, { method: "DELETE", headers: { "X-CSRF-Token": csrfToken } });
      await loadDashboard();
      showToast("Product deleted.");
    } catch (error) {
      showStatus(error.message, true);
    }
  }
});

document.querySelector("#adminOrderRows").addEventListener("click", async (event) => {
  const save = event.target.closest("[data-save-order]");
  if (!save) return;
  const id = Number(save.dataset.saveOrder);
  const status = document.querySelector(`[data-order-status="${id}"]`).value;
  try {
    await request("../api/admin-orders.php", { method: "PATCH", body: JSON.stringify({ id, status }) });
    await loadDashboard();
    showToast("Order status updated.");
  } catch (error) {
    showToast(error.message);
  }
});

loadDashboard().catch((error) => {
  console.error("Admin dashboard could not load.", error);
  showStatus(error.message, true);
  showToast("Could not load admin data. Check the database connection.");
});
