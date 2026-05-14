const authKey = "pomotech-admin-auth";
const loginForm = document.querySelector("[data-login-form]");
const loginError = document.querySelector("[data-login-error]");
const forgotButton = document.querySelector("[data-forgot]");
const dashboardPage = document.body.classList.contains("dashboard-page");
const loader = document.querySelector("[data-loader]");

if (loginForm) {
  if (localStorage.getItem(authKey) === "true") {
    window.location.href = "admin-dashboard.html";
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(loginForm);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    if (!email.includes("@") || password.length < 6) {
      loginError.textContent = "Enter a valid email and a password with 6+ characters.";
      return;
    }

    localStorage.setItem(authKey, "true");
    localStorage.setItem("pomotech-admin-email", email);
    window.location.href = "admin-dashboard.html";
  });
}

if (forgotButton) {
  forgotButton.addEventListener("click", () => {
    loginError.textContent = "Password reset flow can be connected to backend email service.";
  });
}

if (dashboardPage && localStorage.getItem(authKey) !== "true") {
  window.location.href = "admin-login.html";
}

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("hidden"), 450);
  drawCharts();
  animateCounters();
});

const sidebar = document.querySelector("[data-sidebar]");
const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
const menuButtons = document.querySelectorAll("[data-section-target]");
const sections = document.querySelectorAll("[data-section]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const globalSearch = document.querySelector("[data-global-search]");
const tableSearch = document.querySelector("[data-table-search]");
const statusFilter = document.querySelector("[data-status-filter]");
const logoutButtons = document.querySelectorAll("[data-logout]");

sidebarToggle?.addEventListener("click", () => sidebar?.classList.toggle("open"));

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.sectionTarget;
    menuButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    sections.forEach((section) => section.classList.toggle("active", section.id === target));
    sidebar?.classList.remove("open");
    drawCharts();
  });
});

themeToggle?.addEventListener("click", () => {
  const isLight = document.body.dataset.theme === "light";
  document.body.dataset.theme = isLight ? "dark" : "light";
  themeToggle.textContent = isLight ? "Light" : "Dark";
  drawCharts();
});

logoutButtons.forEach((button) => {
  button.addEventListener("click", () => {
    localStorage.removeItem(authKey);
    window.location.href = "admin-login.html";
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "Ready";
    setTimeout(() => {
      button.textContent = button.dataset.action;
    }, 900);
  });
});

globalSearch?.addEventListener("input", () => {
  const query = globalSearch.value.toLowerCase();
  if (!query) return;
  const match = Array.from(menuButtons).find((button) => button.textContent.toLowerCase().includes(query));
  match?.click();
});

tableSearch?.addEventListener("input", filterUsers);
statusFilter?.addEventListener("change", filterUsers);

function filterUsers() {
  const query = (tableSearch?.value || "").toLowerCase();
  const status = statusFilter?.value || "All Status";
  document.querySelectorAll("[data-user-table] tbody tr").forEach((row) => {
    const text = row.textContent.toLowerCase();
    const hasStatus = status === "All Status" || status === "Filter Users" || text.includes(status.toLowerCase());
    row.style.display = text.includes(query) && hasStatus ? "" : "none";
  });
}

function animateCounters() {
  document.querySelectorAll("[data-counter]").forEach((item) => {
    const target = Number(item.dataset.counter);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 48));
    const timer = setInterval(() => {
      current = Math.min(target, current + increment);
      item.textContent = formatMetric(current, item.dataset.counter);
      if (current >= target) clearInterval(timer);
    }, 24);
  });
}

function formatMetric(value, raw) {
  if (Number(raw) >= 1000) return `₹${Math.round(value / 1000)}K`;
  if (raw === "32") return `${value}%`;
  return value;
}

function drawCharts() {
  document.querySelectorAll("[data-line-chart]").forEach(drawLineChart);
  document.querySelectorAll("[data-pie-chart]").forEach(drawPieChart);
}

function chartColors() {
  const light = document.body.dataset.theme === "light";
  return {
    grid: light ? "rgba(17,17,17,.12)" : "rgba(255,255,255,.14)",
    text: light ? "#171717" : "#FFFFFF",
    red: "#B5121B",
    gold: "#D4A238"
  };
}

function drawLineChart(canvas) {
  const ctx = canvas.getContext("2d");
  const { grid, text, red, gold } = chartColors();
  const width = canvas.width;
  const height = canvas.height;
  const values = [18, 24, 19, 34, 42, 39, 58, 64, 72, 88, 82, 104];
  const max = Math.max(...values);
  const pad = 34;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i += 1) {
    const y = pad + i * ((height - pad * 2) / 4);
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(width - pad, y);
    ctx.stroke();
  }

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, red);
  gradient.addColorStop(1, gold);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = pad + index * ((width - pad * 2) / (values.length - 1));
    const y = height - pad - (value / max) * (height - pad * 2);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = text;
  ctx.font = "700 13px Inter, Arial";
  ctx.fillText("Jan", pad, height - 8);
  ctx.fillText("Dec", width - pad - 24, height - 8);
}

function drawPieChart(canvas) {
  const ctx = canvas.getContext("2d");
  const { red, gold, text } = chartColors();
  const values = [38, 26, 20, 16];
  const colors = [gold, red, "#ffffff", "#7D0C13"];
  const labels = ["Web", "Design", "Apps", "Excel"];
  const total = values.reduce((sum, value) => sum + value, 0);
  let start = -Math.PI / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  values.forEach((value, index) => {
    const angle = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(125, 125);
    ctx.arc(125, 125, 88, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();
    start += angle;
  });

  ctx.fillStyle = text;
  ctx.font = "800 13px Inter, Arial";
  labels.forEach((label, index) => {
    ctx.fillText(`${label} ${values[index]}%`, 230, 70 + index * 30);
  });
}
