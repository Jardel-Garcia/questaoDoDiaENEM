// ==========================================================================
// Configuração — Questão do Dia ENEM
// ==========================================================================
// Depois de publicar o Apps Script como Web App (ver backend/README.md),
// cole a URL de implantação aqui. Ela termina em "/exec".
//
// Exemplo:
// const API_URL = "https://script.google.com/macros/s/AKfycb.../exec";

const API_URL = "https://script.google.com/macros/s/AKfycbxA_9pwsxnYpYOfepJUWF6MNB5AWlJKMAXoWYkLy-xCeOIGUWMUNKIeTvu-h6mW29IX/exec"; // <-- troque pela sua URL real, terminando em /exec

function verificarUrlConfigurada_() {
  if (!API_URL || API_URL === "COLE_AQUI_A_URL_DO_APPS_SCRIPT") {
    throw new Error(
      "A URL do backend ainda não foi configurada. Abra frontend/js/config.js e troque " +
      "API_URL pela URL do seu Apps Script publicado (terminando em /exec)."
    );
  }
}

/**
 * Wrapper para chamadas GET ao backend (Apps Script).
 * action: nome da ação (ver backend/Code.gs)
 * params: objeto com parâmetros extras da query string
 */
async function apiGet(action, params = {}) {
  verificarUrlConfigurada_();
  const url = new URL(API_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const resp = await fetch(url.toString());
  const data = await resp.json();
  if (data.erro) throw new Error(data.erro);
  return data;
}

/**
 * Wrapper para chamadas POST ao backend (Apps Script).
 * Enviamos como text/plain de propósito: isso evita o preflight OPTIONS do
 * CORS, que o Apps Script Web App não responde bem. O backend faz
 * JSON.parse(e.postData.contents) manualmente.
 */
async function apiPost(action, payload = {}) {
  verificarUrlConfigurada_();
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await resp.json();
  if (data.erro) throw new Error(data.erro);
  return data;
}
