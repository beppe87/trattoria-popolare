/*
  EVENTI DA GOOGLE SHEET
  - Il sito legge il foglio Google tramite Google Visualization JSONP
  - Nessun backend, nessun GitHub da toccare per aggiornare gli eventi
  - Colonne richieste: DATA | ORA | EVENTO
  - DATA consigliata: YYYY-MM-DD, esempio 2026-06-24
  - Colonna opzionale: LINK
  - Se LINK è compilato, tutta la riga diventa cliccabile
  - Per Facebook usare link lunghi, es. https://www.facebook.com/events/1412314397614563/
*/

const GOOGLE_SHEET_ID = "1XH-7Ybu7jMdrivr-IArc9lSifkRflmAr8yBI0kwJs6I";
const GOOGLE_SHEET_GID = "0";

const MAX_UPCOMING_EVENTS = 8;
const PAST_EVENTS_STEP = 10;

const upcomingList = document.getElementById("upcoming-events-list");
const pastList = document.getElementById("past-events-list");
const loadMorePastButton = document.getElementById("load-more-past");

let pastEventsCache = [];
let visiblePastEvents = PAST_EVENTS_STEP;

document.addEventListener("DOMContentLoaded", loadEvents);

if (loadMorePastButton) {
  loadMorePastButton.addEventListener("click", () => {
    visiblePastEvents += PAST_EVENTS_STEP;
    renderPastEvents();
  });
}

async function loadEvents() {
  try {
    const rows = await fetchEventsFromGoogleSheet();
    const events = normalizeSheetRows(rows);
    const today = getTodayDateOnly();

    const upcoming = events
      .filter(item => item.dateObject >= today)
      .sort((a, b) => a.dateObject - b.dateObject || a.ora.localeCompare(b.ora))
      .slice(0, MAX_UPCOMING_EVENTS);

    pastEventsCache = events
      .filter(item => item.dateObject < today)
      .sort((a, b) => b.dateObject - a.dateObject || b.ora.localeCompare(a.ora));

    visiblePastEvents = PAST_EVENTS_STEP;

    renderEvents(upcomingList, upcoming, "Nessun evento in programma.");
    renderPastEvents();
  } catch (error) {
    console.error(error);
    renderError(
      upcomingList,
      "Non riesco a caricare gli eventi.",
      "Controlla che il Google Sheet sia pubblico in lettura e abbia le colonne DATA, ORA, EVENTO."
    );
    pastEventsCache = [];
    renderPastEvents();
  }
}

function fetchEventsFromGoogleSheet() {
  return new Promise((resolve, reject) => {
    const callbackName = `sheetCallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const url = new URL(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq`);
    url.searchParams.set("gid", GOOGLE_SHEET_GID);
    url.searchParams.set("headers", "1");
    url.searchParams.set("tqx", `responseHandler:${callbackName}`);
    url.searchParams.set("_", Date.now());

    const script = document.createElement("script");
    script.src = url.toString();
    script.async = true;

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout caricamento Google Sheet"));
    }, 10000);

    window[callbackName] = response => {
      cleanup();

      if (!response || response.status === "error") {
        reject(new Error(response?.errors?.[0]?.detailed_message || "Errore Google Sheet"));
        return;
      }

      resolve(readGoogleTable(response.table));
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Google Sheet non raggiungibile"));
    };

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    document.body.appendChild(script);
  });
}

function readGoogleTable(table) {
  if (!table || !table.cols || !table.rows) return [];

  const headers = table.cols.map(col => normalizeHeader(col.label || col.id || ""));
  const rows = table.rows.map(row =>
    (row.c || []).map(cell => cellToString(cell))
  );

  return { headers, rows };
}

function normalizeSheetRows(sheetData) {
  const headers = sheetData.headers;
  const rows = sheetData.rows;

  const dataIndex = findFirstIndex(headers, ["data", "data_iso", "dataiso"]);
  const oraIndex = headers.indexOf("ora");
  const eventoIndex = headers.indexOf("evento");
  const linkIndex = findFirstIndex(headers, ["link", "linkevento", "link_fb", "facebook", "evento_fb"]);

  if (dataIndex === -1 || oraIndex === -1 || eventoIndex === -1) {
    throw new Error("Il Google Sheet deve avere le colonne DATA, ORA, EVENTO");
  }

  return rows
    .map(row => {
      const rawDate = clean(row[dataIndex]);
      const dateObject = parseSheetDate(rawDate);

      return {
        data: dateObject ? formatDateIt(dateObject) : rawDate,
        dateObject,
        ora: clean(row[oraIndex]),
        evento: clean(row[eventoIndex]),
        link: linkIndex === -1 ? "" : normalizeUrl(row[linkIndex])
      };
    })
    .filter(item => item.dateObject && item.ora && item.evento);
}

function cellToString(cell) {
  if (!cell) return "";

  if (typeof cell.v === "string" && cell.v.startsWith("Date(")) {
    return cell.v;
  }

  if (cell.v !== null && cell.v !== undefined) {
    return String(cell.v);
  }

  return cell.f || "";
}

function renderEvents(target, events, emptyMessage) {
  target.innerHTML = "";

  if (!events.length) {
    target.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  events.forEach(item => {
    const row = item.link ? document.createElement("a") : document.createElement("div");

    row.className = item.link ? "board-row board-row-link" : "board-row";
    row.setAttribute("role", "row");

    if (item.link) {
      row.href = item.link;
      row.target = "_blank";
      row.rel = "noopener noreferrer";
      row.setAttribute("aria-label", `${item.data} ${item.ora}: ${item.evento}`);
      row.title = "Apri evento";
    }

    row.innerHTML = `
      <div class="event-date" role="cell">${escapeHtml(item.data)}</div>
      <div class="event-time" role="cell">${escapeHtml(item.ora)}</div>
      <div class="event-title" role="cell">${escapeHtml(item.evento)}</div>
    `;
    fragment.appendChild(row);
  });

  target.appendChild(fragment);
}

function renderPastEvents() {
  const visibleEvents = pastEventsCache.slice(0, visiblePastEvents);

  renderEvents(pastList, visibleEvents, "Nessun evento passato da mostrare.");

  if (!loadMorePastButton) return;

  const remaining = pastEventsCache.length - visiblePastEvents;

  if (remaining > 0) {
    loadMorePastButton.hidden = false;
    loadMorePastButton.textContent = `Mostra altri eventi (${Math.min(PAST_EVENTS_STEP, remaining)})`;
  } else {
    loadMorePastButton.hidden = true;
  }
}


function renderError(target, message, detail) {
  target.innerHTML = `<div class="error-state">${escapeHtml(message)}<small>${escapeHtml(detail)}</small></div>`;
}

function getTodayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseSheetDate(value) {
  const text = clean(value);

  // Formato consigliato nel foglio: 2026-06-24
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) return makeDate(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));

  // Formato Google Visualization per celle data: Date(2026,5,24)
  const googleDate = text.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2})\)$/);
  if (googleDate) return makeDate(Number(googleDate[1]), Number(googleDate[2]), Number(googleDate[3]));

  // Fallback se qualcuno scrive 24/06/2026
  const italian = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (italian) return makeDate(Number(italian[3]), Number(italian[2]) - 1, Number(italian[1]));

  return null;
}

function makeDate(year, month, day) {
  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

function formatDateIt(date) {
  const weekday = new Intl.DateTimeFormat("it-IT", { weekday: "short" }).format(date);
  const day = new Intl.DateTimeFormat("it-IT", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("it-IT", { month: "short" }).format(date);

  return `${weekday} ${day} ${month}`
    .replaceAll(".", "")
    .toUpperCase();
}

function findFirstIndex(values, candidates) {
  for (const candidate of candidates) {
    const index = values.indexOf(candidate);
    if (index !== -1) return index;
  }
  return -1;
}

function normalizeHeader(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/-/g, "_");
}

function normalizeUrl(value) {
  const url = clean(value);
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) return url;
  return "";
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
