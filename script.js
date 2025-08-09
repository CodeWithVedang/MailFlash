const API_BASE = "https://api.mail.tm";
const emailEl = document.getElementById("tempEmail");
const inboxEl = document.getElementById("inbox");
const themeToggleBtn = document.getElementById("themeToggle");

let account = JSON.parse(localStorage.getItem("mailAccount")) || null;
let token = localStorage.getItem("mailToken") || null;

// Theme handling
const currentTheme = localStorage.getItem("theme") || "light";
document.body.classList.add(`${currentTheme}-theme`);
themeToggleBtn.innerHTML = currentTheme === "light" ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

themeToggleBtn.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${newTheme}-theme`);
  localStorage.setItem("theme", newTheme);
  themeToggleBtn.innerHTML = newTheme === "light" ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Init
(async function init() {
  if (!account || !token) {
    await createAccount();
  } else {
    emailEl.textContent = account.address;
    loadInbox();
  }
})();

// Create random account
async function createAccount() {
  const randomName = Math.random().toString(36).substring(2, 10);
  const address = `${randomName}@${await getDomain()}`;
  const password = Math.random().toString(36);

  // Create account
  await fetch(`${API_BASE}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password })
  });

  // Login to get token
  const tokenData = await fetch(`${API_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, password })
  }).then(res => res.json());

  token = tokenData.token;
  account = { address, password };
  localStorage.setItem("mailAccount", JSON.stringify(account));
  localStorage.setItem("mailToken", token);

  emailEl.textContent = address;
  loadInbox();
}

// Get a domain from API
async function getDomain() {
  const res = await fetch(`${API_BASE}/domains`).then(r => r.json());
  return res["hydra:member"][0].domain;
}

// Load inbox
async function loadInbox() {
  // Show skeleton loading
  inboxEl.innerHTML = `
    <div class="skeleton">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  `;
  const res = await fetch(`${API_BASE}/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const messages = res["hydra:member"];
  if (messages.length === 0) {
    inboxEl.innerHTML = `<p>No messages yet</p>`;
    return;
  }

  inboxEl.innerHTML = "";
  messages.forEach(msg => {
    const item = document.createElement("div");
    item.className = "message-item";
    item.innerHTML = `
      <strong>${msg.from.address}</strong> - ${msg.subject || "(no subject)"}
      <small>${new Date(msg.createdAt).toLocaleString()}</small>
    `;
    item.addEventListener("click", () => openMessage(msg.id));
    inboxEl.appendChild(item);
  });
}

// Open full message
async function openMessage(id) {
  const msg = await fetch(`${API_BASE}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3>${msg.subject || "(no subject)"}</h3>
      <p><strong>From:</strong> ${msg.from.address}</p>
      <p><strong>Date:</strong> ${new Date(msg.createdAt).toLocaleString()}</p>
      <hr>
      <div class="email-body">${msg.html || msg.text || "(empty)"}</div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").addEventListener("click", () => modal.remove());
}

// Copy email
document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(account.address).then(() => showToast("Email copied!"));
});

// Refresh inbox
document.getElementById("refreshBtn").addEventListener("click", loadInbox);

// Delete account and generate new
document.getElementById("deleteBtn").addEventListener("click", async () => {
  localStorage.removeItem("mailAccount");
  localStorage.removeItem("mailToken");
  account = null;
  token = null;
  inboxEl.innerHTML = "";
  await createAccount();
  showToast("New email created!");
});

// Toast
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => toast.classList.remove("show"), 2000);
  setTimeout(() => toast.remove(), 2500);
}