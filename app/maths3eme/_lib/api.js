// Toutes les pages partagent le proxy Next.js, jamais une clé d'administration.
export const API_BASE = "/api/segpa";
export async function api(path, { body, headers: extraHeaders, ...options } = {}) {
  const headers = new Headers(extraHeaders);
  if (body !== undefined) headers.set("Content-Type", "application/json");
  let response;
  try {
    response = await fetch(API_BASE + path, {
      ...options, headers, credentials: "include", cache: "no-store",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Le serveur est injoignable. Réessaie dans un instant.");
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw Object.assign(new Error(data?.error || `Erreur ${response.status}`), { status: response.status });
  if (!data) throw new Error("Réponse inattendue du serveur. Vérifiez la configuration du proxy.");
  return data;
}
