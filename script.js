/*
  EVENTI
  - Il sito legge SOLO data/eventi.csv
  - Nessun evento è duplicato o scritto fisso nel JavaScript
  - Colonne richieste: DATA | ORA | EVENTO
  - Il parametro anti-cache fa vedere subito le modifiche dopo il commit su GitHub
*/

const EVENTS_CSV_URL = "data/eventi.csv";
const MAX_EVENTS = 8;

const list = document.getElementById("events-list");

document.addEventListener("DOMContentLoaded", loadEvents);

async function loadEvents() {
  try {
    const events = await fetchEventsFromCsv(EVENTS_CSV_URL);
    renderEvents(events.slice(0, MAX_EVENTS));
  } catch (error) {
    console.error(error);
    renderError(
      "Non riesco a caricare gli eventi.",
      "Controlla che data/eventi.csv esista e abbia le colonne DATA, ORA, EVENTO."
    );
  }
}

async function fetchEventsFromCsv(url) {
  const response = await fetch(addCacheBuster(url), { cache: "no-store" });
  if (!response.ok) throw new Error(`Errore CSV: ${response.status}`);

  const csv = await response.text();
  const rows = parseCsv(csv);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const dataIndex = headers.indexOf("data");
  const oraIndex = headers.indexOf("ora");
  const eventoIndex = headers.indexOf("evento");

  if (dataIndex === -1 || oraIndex === -1 || eventoIndex === -1) {
    throw new Error("Il CSV deve avere le colonne DATA, ORA, EVENTO");
  }

  return rows.slice(1)
    .map(row => ({
      data: clean(row[dataIndex]),
      ora: clean(row[oraIndex]),
      evento: clean(row[eventoIndex])
    }))
    .filter(item => item.data && item.ora && item.evento);
}

function renderEvents(events) {
  list.innerHTML = "";

  if (!events.length) {
    list.innerHTML = `<div class="empty-state">Nessun evento in programma.</div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  events.forEach(item => {
    const row = document.createElement("div");
    row.className = "board-row";
    row.setAttribute("role", "row");
    row.innerHTML = `
      <div class="event-date" role="cell">${escapeHtml(item.data)}</div>
      <div class="event-time" role="cell">${escapeHtml(item.ora)}</div>
      <div class="event-title" role="cell">${escapeHtml(item.evento)}</div>
    `;
    fragment.appendChild(row);
  });

  list.appendChild(fragment);
}

function renderError(message, detail) {
  list.innerHTML = `<div class="error-state">${escapeHtml(message)}<small>${escapeHtml(detail)}</small></div>`;
}

function addCacheBuster(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${Date.now()}`;
}

function normalizeHeader(value) {
  return clean(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function clean(value) {
  return String(value ?? "").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseCsv(csv) {
  const delimiter = detectDelimiter(csv);
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current);
  rows.push(row);
  return rows.filter(r => r.some(cell => clean(cell)));
}

function detectDelimiter(csv) {
  const firstLine = csv.split(/\r?\n/)[0] || "";
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  return semicolons > commas ? ";" : ",";
}
