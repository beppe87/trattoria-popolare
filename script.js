/*
  COME AGGIORNARE GLI EVENTI DA GOOGLE SHEET
  1) Crea un Google Sheet con colonne: DATA | ORA | EVENTO
  2) File > Condividi > Pubblica sul web > CSV
  3) Incolla qui sotto il link CSV pubblicato in SHEET_CSV_URL
  4) Lascia una riga vuota per non mostrarla sul sito
*/

const SHEET_CSV_URL = ""; // esempio: "https://docs.google.com/spreadsheets/d/e/XXXXX/pub?output=csv"
const MAX_EVENTS = 8;

const fallbackEvents = [
  { data: "12 LUG", ora: "20:30", evento: "Cena popolare + musica live" },
  { data: "18 LUG", ora: "19:00", evento: "Aperitivo resistente" },
  { data: "25 LUG", ora: "21:00", evento: "DJ set nel cortile" },
  { data: "30 LUG", ora: "20:00", evento: "Presentazione libro" },
  { data: "05 AGO", ora: "19:30", evento: "Serata di cucina regionale" }
];

const list = document.getElementById("events-list");

document.addEventListener("DOMContentLoaded", loadEvents);

async function loadEvents() {
  try {
    const events = SHEET_CSV_URL.trim()
      ? await fetchEventsFromSheet(SHEET_CSV_URL)
      : fallbackEvents;

    renderEvents(events.slice(0, MAX_EVENTS));
  } catch (error) {
    console.error(error);
    renderError("Non riesco a caricare gli eventi dal Google Sheet.", "Controlla che il foglio sia pubblicato come CSV e che il link sia corretto.");
  }
}

async function fetchEventsFromSheet(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Errore CSV: ${response.status}`);

  const csv = await response.text();
  const rows = parseCsv(csv);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);

  const dataIndex = headers.indexOf("data");
  const oraIndex = headers.indexOf("ora");
  const eventoIndex = headers.indexOf("evento");

  if (dataIndex === -1 || oraIndex === -1 || eventoIndex === -1) {
    throw new Error("Il Google Sheet deve avere le colonne DATA, ORA, EVENTO");
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

    if (char === "," && !inQuotes) {
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
