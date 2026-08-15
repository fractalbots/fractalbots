/* ============================================================
   Acceso a datos · Supabase (PostgREST)
   Extraído de App.jsx para poder reutilizarlo desde los módulos
   nuevos sin duplicar la configuración ni el token de sesión.
   ============================================================ */

export const SB_URL = "https://asqtoedpwmrztuzkjqkp.supabase.co";
export const SB_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcXRvZWRwd21yenR1emtqcWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNjI4NzAsImV4cCI6MjA5OTYzODg3MH0.wkyBoEDEGYm3QtE3IKSnH7E_Xs4pxAynuFNIu0v9nFw";

/* El token vive en memoria: se llena al iniciar sesión y se borra al salir.
   Mientras está vacío, las peticiones usan la clave pública (rol anónimo),
   que es justo lo que necesita el formulario público de inscripción. */
let AUTH_TOKEN = null;
export const setToken = (t) => { AUTH_TOKEN = t; };
export const getToken = () => AUTH_TOKEN;

export function authHeaders(extra = {}) {
  return {
    apikey: SB_KEY,
    Authorization: `Bearer ${AUTH_TOKEN || SB_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function api(path, opts = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, { headers: authHeaders(), ...opts });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

export const apiGet = (p) => api(p);

export const apiPost = (table, body) =>
  api(table, {
    method: "POST",
    headers: authHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(body),
  });

export const apiPatch = (table, id, body) =>
  api(`${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: authHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify(body),
  });

export const apiDelete = (table, id) =>
  api(`${table}?id=eq.${id}`, { method: "DELETE", headers: authHeaders() });

/* Inserción sin respuesta: PostgREST intenta un SELECT tras el INSERT si se
   pide "return=representation", y eso falla con RLS cuando el anónimo tiene
   permiso de escritura pero no de lectura. Con "return=minimal" no lo intenta. */
export async function apiInsertMinimal(table, body) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: authHeaders({ Prefer: "return=minimal" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}

/* Llamada a funciones de PostgreSQL (generar llaves, calcular posiciones…) */
export async function apiRpc(fn, args = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}
