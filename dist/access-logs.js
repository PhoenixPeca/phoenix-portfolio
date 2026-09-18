const logRows = document.querySelector("#access-log-rows");
const login = document.querySelector("#access-login");
const loginForm = document.querySelector("#access-login-form");
const loginMessage = document.querySelector("#access-login-message");
const dashboard = document.querySelector("#access-dashboard");
const clearLogsButton = document.querySelector("#clear-access-logs");

function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.append(cell);
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString();
}

async function loadAccessLogs() {
  try {
    const response = await fetch("/api/access-logs", { cache: "no-store", credentials: "same-origin" });
    if (response.status === 401) return false;
    if (!response.ok) throw new Error("Could not load access logs.");
    const records = await response.json();
    logRows.replaceChildren();

    if (!records.length) {
      const row = document.createElement("tr");
      addCell(row, "No tracked external-link requests yet.");
      row.firstChild.colSpan = 5;
      logRows.append(row);
      return true;
    }

    for (const record of records) {
      const row = document.createElement("tr");
      addCell(row, formatTime(record.timestamp));
      addCell(row, record.accessed);
      addCell(row, record.source);
      addCell(row, record.ipAddress);
      addCell(row, record.userAgent);
      logRows.append(row);
    }
    return true;
  } catch (error) {
    logRows.replaceChildren();
    const row = document.createElement("tr");
    addCell(row, error.message || "Could not load access logs.");
    row.firstChild.colSpan = 5;
    logRows.append(row);
    return false;
  }
}

async function revealDashboard() {
  const isAuthenticated = await loadAccessLogs();
  if (!isAuthenticated) return;
  login.hidden = true;
  dashboard.hidden = false;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = loginForm.querySelector("button");
  submit.disabled = true;
  loginMessage.textContent = "Checking password…";
  try {
    const password = new FormData(loginForm).get("password");
    const response = await fetch("/api/access-logs/session", {
      body: JSON.stringify({ password }),
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw new Error((await response.json()).error || "Incorrect password.");
    await revealDashboard();
  } catch (error) {
    loginMessage.textContent = error.message || "Could not sign in.";
  } finally {
    submit.disabled = false;
  }
});

clearLogsButton.addEventListener("click", async () => {
  if (!window.confirm("Clear all access logs? This cannot be undone.")) return;
  clearLogsButton.disabled = true;
  try {
    const response = await fetch("/api/access-logs", {
      credentials: "same-origin",
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Could not clear access logs.");
    await loadAccessLogs();
  } catch (error) {
    window.alert(error.message || "Could not clear access logs.");
  } finally {
    clearLogsButton.disabled = false;
  }
});

revealDashboard();
