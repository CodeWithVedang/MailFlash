const API_BASE = "https://api.mail.tm";
const emailEl = document.getElementById("tempEmail");
const emailDisplay = document.getElementById("emailDisplay");
const emailLoader = document.getElementById("emailLoader");
const inboxEl = document.getElementById("inbox");
const themeToggleBtn = document.getElementById("themeToggle");
const notificationContainer = document.getElementById("notificationContainer");

let account = JSON.parse(localStorage.getItem("mailAccount")) || null;
let token = localStorage.getItem("mailToken") || null;
let pollInterval = null;

// In-memory cache of all messages (id -> full message object)
let messageCache = new Map();
// Set of known message IDs (for fast lookup)
let knownMessageIds = new Set();

// Theme
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
(async () => {
  if (!account || !token) {
    await createAccount();
  } else {
    emailEl.textContent = account.address;
    emailLoader.style.display = "none";
    emailDisplay.style.opacity = "1";
    await loadInitialInbox();
    startPolling();
  }
})();

async function createAccount() {
  emailLoader.style.display = "flex";
  emailDisplay.style.opacity = "0";

  try {
    const randomName = Math.random().toString(36).substring(2, 10);
    const domain = await getDomain();
    const address = `${randomName}@${domain}`;
    const password = Math.random().toString(36);

    await fetch(`${API_BASE}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password })
    });

    const tokenRes = await fetch(`${API_BASE}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password })
    });
    const tokenData = await tokenRes.json();

    token = tokenData.token;
    account = { address, password };
    localStorage.setItem("mailAccount", JSON.stringify(account));
    localStorage.setItem("mailToken", token);

    // Reset cache
    messageCache.clear();
    knownMessageIds.clear();

    emailEl.textContent = address;
    emailLoader.style.display = "none";
    emailDisplay.style.opacity = "1";
    await loadInitialInbox();
    startPolling();
  } catch (err) {
    console.error("Account creation failed:", err);
    showToast("Failed to create email. Retrying...");
    setTimeout(createAccount, 1500);
  }
}

async function getDomain() {
  const res = await fetch(`${API_BASE}/domains`);
  const data = await res.json();
  return data["hydra:member"][0].domain;
}

// Load all messages on first load
async function loadInitialInbox() {
  inboxEl.innerHTML = `
    <div class="skeleton">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE}/messages?sort=createdAt&order=desc`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const messages = data["hydra:member"] || [];

    if (messages.length === 0) {
      inboxEl.classList.add("empty");
      inboxEl.innerHTML = `<p>No messages yet</p>`;
      return;
    }

    inboxEl.classList.remove("empty");
    inboxEl.innerHTML = "";

    // Clear cache
    messageCache.clear();
    knownMessageIds.clear();

    // Fetch full content for each and render
    for (const msg of messages) {
      const fullMsg = await fetchFullMessage(msg.id);
      if (fullMsg) {
        messageCache.set(msg.id, fullMsg);
        knownMessageIds.add(msg.id);
        const item = createMessageElement(fullMsg);
        inboxEl.appendChild(item);
      }
    }
  } catch (err) {
    console.error("Initial inbox load failed:", err);
    inboxEl.classList.add("empty");
    inboxEl.innerHTML = `<p style="color:var(--danger);">Failed to load inbox</p>`;
  }
}

// Poll only for new message IDs
function startPolling() {
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(checkForNewMessages, 2000);
}

async function checkForNewMessages() {
  try {
    const res = await fetch(`${API_BASE}/messages?sort=createdAt&order=desc&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const messages = data["hydra:member"] || [];

    const newMessages = messages.filter(msg => !knownMessageIds.has(msg.id));

    if (newMessages.length > 0) {
      // Process from oldest to newest so they prepend in correct order
      for (let i = newMessages.length - 1; i >= 0; i--) {
        const msg = newMessages[i];
        const fullMsg = await fetchFullMessage(msg.id);
        if (fullMsg) {
          messageCache.set(msg.id, fullMsg);
          knownMessageIds.add(msg.id);

          const item = createMessageElement(fullMsg);
          // Prepend to top (newest first)
          if (inboxEl.querySelector(".skeleton") || inboxEl.classList.contains("empty")) {
            inboxEl.innerHTML = "";
            inboxEl.classList.remove("empty");
          }
          inboxEl.insertBefore(item, inboxEl.firstChild);

          showNotification(`New email from ${fullMsg.from?.address || 'unknown'}`);
        }
      }
    }
  } catch (err) {
    console.warn("Polling error (non-critical):", err);
  }
}

// Fetch full message by ID
async function fetchFullMessage(id) {
  try {
    const res = await fetch(`${API_BASE}/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch full message:", id);
    return null;
  }
}

// Extract OTP
function extractOTP(text) {
  if (!text) return null;
  const otpMatch = text.match(/\b(?:code|otp|pin|verification|verify)[\s:]*#?(\d{4,8})\b/i);
  if (otpMatch) return otpMatch[1];
  const fallback = text.match(/\b\d{4,8}\b/);
  return fallback ? fallback[0] : null;
}

// Extract confirmation link
function extractConfirmationLink(html, text) {
  let fullContent = (html || "") + " " + (text || "");
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html || ""}</div>`, "text/html");
  const linksInHtml = Array.from(doc.querySelectorAll("a[href]")).map(a => a.href);
  const urlRegex = /https?:\/\/[^\s<>"')\]]+/gi;
  const rawUrls = (fullContent.match(urlRegex) || []);
  const allUrls = [...new Set([...linksInHtml, ...rawUrls])];
  const keywords = ['verify', 'confirm', 'activate', 'validate', 'register', 'signup', 'email', 'token', 'account'];
  return allUrls.find(url => {
    const lower = url.toLowerCase();
    return keywords.some(kw => lower.includes(kw));
  }) || null;
}

// Create DOM element for a message
function createMessageElement(msg) {
  const subject = msg.subject || "(no subject)";
  const from = msg.from?.address || "unknown";
  const date = new Date(msg.createdAt).toLocaleString();
  const textBody = msg.text || "";
  const htmlBody = msg.html || "";

  const otp = extractOTP(textBody + " " + subject);
  const confirmLink = extractConfirmationLink(htmlBody, textBody);

  const item = document.createElement("div");
  item.className = "message-item";
  item.innerHTML = `
    <div class="message-item-header">
      <div>
        <div class="message-from">${from}</div>
        <div class="message-subject">${subject}</div>
        <small class="message-date">${date}</small>
      </div>
    </div>
    <div class="message-actions"></div>
  `;

  const actionsDiv = item.querySelector(".message-actions");
  if (otp) {
    const otpBtn = document.createElement("button");
    otpBtn.className = "action-button copy-otp-btn";
    otpBtn.textContent = "Copy Code";
    otpBtn.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(otp).then(() => showToast("Code copied!"));
    };
    actionsDiv.appendChild(otpBtn);
  }

  if (confirmLink) {
    const linkBtn = document.createElement("button");
    linkBtn.className = "action-button confirm-btn";
    linkBtn.textContent = "Activate Account";
    linkBtn.onclick = (e) => {
      e.stopPropagation();
      window.open(confirmLink, "_blank", "noopener,noreferrer");
    };
    actionsDiv.appendChild(linkBtn);
  }

  item.addEventListener("click", () => openMessageModal(msg));
  return item;
}

// Open modal with full message
function openMessageModal(msg) {
  const modal = document.createElement("div");
  modal.className = "modal";
  const from = msg.from?.address || "unknown";
  const date = new Date(msg.createdAt).toLocaleString();
  const bodyContent = msg.html || (msg.text ? msg.text.replace(/\n/g, "<br>") : "(empty)");

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${msg.subject || "(no subject)"}</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-meta">
        <p><strong>From:</strong> ${from}</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>
      <div class="modal-body">${bodyContent}</div>
    </div>
  `;

  document.body.appendChild(modal);
  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Notifications
function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  notificationContainer.appendChild(notif);
  setTimeout(() => notif.classList.add("show"), 10);
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// UI Event Handlers
document.getElementById("copyBtn").addEventListener("click", () => {
  if (account?.address) {
    navigator.clipboard.writeText(account.address).then(() => showToast("Email copied!"));
  }
});

document.getElementById("refreshBtn").addEventListener("click", async () => {
  showToast("Refreshing inbox...");
  await loadInitialInbox();
});

document.getElementById("deleteBtn").addEventListener("click", async () => {
  localStorage.removeItem("mailAccount");
  localStorage.removeItem("mailToken");
  account = null;
  token = null;
  messageCache.clear();
  knownMessageIds.clear();
  if (pollInterval) clearInterval(pollInterval);
  inboxEl.innerHTML = "";
  await createAccount();
  showToast("New email created!");
});

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }, 2200);
}