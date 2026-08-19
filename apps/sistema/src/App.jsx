import { useState, useEffect, useCallback, useRef } from "react";
import {
  SB_URL, SB_KEY, api, apiGet, apiPost, apiPatch, apiDelete,
  apiInsertMinimal, apiRpc, authHeaders, setToken,
} from "./api";
import { Torneos, InscripcionPublica } from "./Torneos";
import { Portal } from "./Portal";
import { Horarios } from "./Horarios";


/* ============================================================
   FractalBots · Panel de gestión (avance funcional)
   Conectado en vivo a Supabase (PostgREST) con la clave pública.
   Paleta basada en la identidad de marca: azul / verde / morado / naranja
   sobre degradado morado→turquesa.
   ============================================================ */

const LOGO = "https://fractalbots2016.web.app/images/logo.png";

// --- Autenticación (Supabase Auth / GoTrue) ---
async function login(email, password) {
  const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SB_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Credenciales inválidas");
  setToken(data.access_token);
  const perfil = await apiGet(`perfiles?id=eq.${data.user.id}&select=nombres,apellidos,rol`);
  return { email: data.user.email, ...(perfil?.[0] || {}) };
}
function logout() { setToken(null); }

const fmtMs = (ms) => (ms == null ? "—" : (ms / 1000).toFixed(3) + " s");
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : s);

/* ---------- Config de entidades CRUD ---------- */
const ESTADO_CLIENTE = ["prospecto", "contactado", "en_negociacion", "convertido", "descartado"];

/* ---------- Generación de certificado (diploma horizontal, imprimible a PDF) ---------- */
function buildCertHTML({ nombre, curso, codigo, fecha }) {
  const verifyUrl = `https://fractalbots2016.web.app/verificar?codigo=${encodeURIComponent(codigo)}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(verifyUrl)}`;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<title>Certificado · ${nombre}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4 landscape; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; color:#20263A; }
  .sheet { width:297mm; height:210mm; padding:12mm; position:relative; }
  .frame { width:100%; height:100%; border:2px solid #E4E8F1; border-radius:10px; position:relative;
    display:flex; flex-direction:column; align-items:center; text-align:center; padding:14mm 20mm; overflow:hidden; }
  .bar { position:absolute; top:0; left:0; right:0; height:8px; display:flex; }
  .bar i { flex:1; } .bar i:nth-child(1){background:#1E9AD7} .bar i:nth-child(2){background:#43B02A}
  .bar i:nth-child(3){background:#5E2D8E} .bar i:nth-child(4){background:#F5811F}
  .corner { position:absolute; width:26px; height:26px; }
  .corner.tl{top:14px;left:14px;border-top:3px solid #5E2D8E;border-left:3px solid #5E2D8E}
  .corner.tr{top:14px;right:14px;border-top:3px solid #F5811F;border-right:3px solid #F5811F}
  .corner.bl{bottom:14px;left:14px;border-bottom:3px solid #1E9AD7;border-left:3px solid #1E9AD7}
  .corner.br{bottom:14px;right:14px;border-bottom:3px solid #43B02A;border-right:3px solid #43B02A}
  .logo { width:66px; height:66px; border-radius:50%; object-fit:contain; margin-top:4mm; }
  .eyebrow { margin-top:6px; font-size:11px; letter-spacing:4px; text-transform:uppercase; color:#7C889E; }
  .title { font-family:'Space Grotesk',sans-serif; font-size:44px; font-weight:700; letter-spacing:10px; color:#5E2D8E; margin-top:10px; }
  .rule { width:90px; height:3px; background:#F5811F; border-radius:2px; margin:12px auto 0; }
  .lead { margin-top:26px; font-size:15px; color:#5b6577; }
  .name { font-family:'Playfair Display',serif; font-size:52px; font-weight:700; color:#20263A; margin-top:8px; line-height:1.1; }
  .name-underline { width:60%; max-width:420px; height:1px; background:#E4E8F1; margin:14px auto 0; }
  .body { margin-top:22px; font-size:15px; color:#5b6577; }
  .course { font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:600; color:#17A2A2; margin-top:8px; }
  .footer { position:absolute; left:20mm; right:20mm; bottom:16mm; display:flex; align-items:flex-end; justify-content:space-between; }
  .col { flex:1; }
  .col.center { text-align:center; }
  .col.right { text-align:center; }
  .qr { width:74px; height:74px; }
  .code { font-family:'JetBrains Mono',monospace; font-size:10px; color:#7C889E; margin-top:4px; letter-spacing:1px; }
  .sign-line { width:200px; height:1px; background:#20263A; margin:0 auto 6px; }
  .sign-role { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:14px; }
  .sign-org { font-size:11px; color:#7C889E; }
  .place { font-size:12px; color:#7C889E; text-align:left; }
</style></head>
<body>
  <div class="sheet"><div class="frame">
    <div class="bar"><i></i><i></i><i></i><i></i></div>
    <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
    <img class="logo" src="${LOGO}" alt="">
    <div class="eyebrow">Centro de Robótica Educativa</div>
    <div class="title">CERTIFICADO</div>
    <div class="rule"></div>
    <div class="lead">Se otorga el presente certificado a</div>
    <div class="name">${nombre}</div>
    <div class="name-underline"></div>
    <div class="body">por haber culminado satisfactoriamente el curso</div>
    <div class="course">${curso || "—"}</div>
    <div class="footer">
      <div class="col place">Quito – Ecuador<br>${fecha}</div>
      <div class="col center"><img class="qr" src="${qr}" alt="QR"><div class="code">${codigo}</div></div>
      <div class="col right"><div class="sign-line"></div><div class="sign-role">Director</div><div class="sign-org">Centro de Robótica FractalBots</div></div>
    </div>
  </div></div>
  <script>window.onload=function(){setTimeout(function(){window.print();},400);};<\/script>
</body></html>`;
}

function openCertificado(r) {
  const data = {
    nombre: r.estudiantes ? `${r.estudiantes.nombres} ${r.estudiantes.apellidos}` : "Estudiante",
    curso: r.cursos?.nombre || "",
    codigo: r.codigo_verificacion,
    fecha: new Date(r.fecha_emision).toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" }),
  };
  const w = window.open("", "_blank");
  if (!w) { alert("El navegador bloqueó la ventana. Permite las ventanas emergentes e inténtalo de nuevo."); return; }
  w.document.write(buildCertHTML(data));
  w.document.close();
}

const ENTITIES = {
  estudiantes: {
    label: "Estudiantes",
    select: "*",
    order: "creado_en.desc",
    columns: [
      { key: "nombres", label: "Nombres", render: (r) => `${r.nombres} ${r.apellidos}` },
      { key: "cedula", label: "Cédula" },
      { key: "correo", label: "Correo" },
      { key: "telefono", label: "Teléfono" },
    ],
    fields: [
      { key: "nombres", label: "Nombres", required: true },
      { key: "apellidos", label: "Apellidos", required: true },
      { key: "cedula", label: "Cédula" },
      { key: "correo", label: "Correo", type: "email" },
      { key: "telefono", label: "Teléfono" },
      { key: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date" },
      { key: "representante", label: "Representante" },
      { key: "telefono_representante", label: "Teléfono del representante" },
    ],
  },
  docentes: {
    label: "Docentes",
    select: "*",
    order: "creado_en.desc",
    columns: [
      { key: "nombres", label: "Nombres", render: (r) => `${r.nombres} ${r.apellidos}` },
      { key: "especialidad", label: "Especialidad" },
      { key: "correo", label: "Correo" },
      { key: "telefono", label: "Teléfono" },
    ],
    fields: [
      { key: "nombres", label: "Nombres", required: true },
      { key: "apellidos", label: "Apellidos", required: true },
      { key: "cedula", label: "Cédula" },
      { key: "correo", label: "Correo", type: "email" },
      { key: "telefono", label: "Teléfono" },
      { key: "especialidad", label: "Especialidad" },
    ],
  },
  clientes: {
    label: "Clientes",
    select: "*",
    order: "creado_en.desc",
    columns: [
      { key: "nombres", label: "Nombre", render: (r) => `${r.nombres} ${r.apellidos || ""}` },
      { key: "institucion", label: "Institución" },
      { key: "interes", label: "Interés" },
      { key: "estado", label: "Estado", badge: true },
    ],
    fields: [
      { key: "nombres", label: "Nombres", required: true },
      { key: "apellidos", label: "Apellidos" },
      { key: "institucion", label: "Institución" },
      { key: "correo", label: "Correo", type: "email" },
      { key: "telefono", label: "Teléfono" },
      { key: "interes", label: "Interés" },
      { key: "estado", label: "Estado", type: "enum", options: ESTADO_CLIENTE },
      { key: "observaciones", label: "Observaciones", type: "textarea" },
    ],
  },
  cursos: {
    label: "Cursos",
    select: "*,docentes(nombres,apellidos)",
    order: "creado_en.desc",
    columns: [
      { key: "nombre", label: "Curso" },
      { key: "nivel", label: "Nivel" },
      { key: "docente", label: "Docente", render: (r) => (r.docentes ? `${r.docentes.nombres} ${r.docentes.apellidos}` : "—") },
      { key: "cupo", label: "Cupo" },
    ],
    fields: [
      { key: "nombre", label: "Nombre del curso", required: true },
      { key: "descripcion", label: "Descripción", type: "textarea" },
      { key: "nivel", label: "Nivel", type: "enum", options: ["básico", "intermedio", "avanzado"] },
      { key: "docente_id", label: "Docente", type: "select", from: { table: "docentes", label: (d) => `${d.nombres} ${d.apellidos}` } },
      { key: "cupo", label: "Cupo", type: "number" },
      { key: "fecha_inicio", label: "Fecha de inicio", type: "date" },
      { key: "fecha_fin", label: "Fecha de fin", type: "date" },
    ],
  },
};

const BADGE_COLORS = {
  prospecto: "#7C889E",
  contactado: "#1E9AD7",
  en_negociacion: "#F5811F",
  convertido: "#43B02A",
  descartado: "#EF5350",
};

/* ============================================================
   App
   ============================================================ */
export default function App() {
  const [session, setSession] = useState(null); // {email,nombres,apellidos,rol}
  const [view, setView] = useState("dashboard");

  // Ruta pública: si la URL trae ?formulario=<slug>, se muestra el formulario para llenar (sin login)
  const params = new URLSearchParams(window.location.search);
  const publicSlug = params.get("formulario");
  if (publicSlug) return <><Styles /><FormFill slug={publicSlug} /></>;

  // Inscripción pública a un torneo: ?torneo=<slug>, sin sesión
  const torneoSlug = params.get("torneo");
  if (torneoSlug) return <><Styles /><InscripcionPublica slug={torneoSlug} /></>;

  /* El menú se arma según el rol del perfil. El RLS de Supabase ya impide
     que un estudiante lea datos ajenos, pero la barra lateral tampoco debe
     ofrecerle módulos administrativos: la restricción se ve, no solo se aplica. */
  const NAV_ADMIN = [
    { id: "dashboard", label: "Dashboard", icon: "◉" },
    { id: "estudiantes", label: "Estudiantes", icon: "◈" },
    { id: "docentes", label: "Docentes", icon: "✦" },
    { id: "clientes", label: "Clientes", icon: "◇" },
    { id: "cursos", label: "Cursos", icon: "▤" },
    { id: "horarios", label: "Horarios", icon: "◷" },
    { id: "certificados", label: "Certificados", icon: "❖" },
    { id: "formularios", label: "Formularios", icon: "▦" },
    { id: "torneos", label: "Torneos", icon: "🏆" },
    { id: "torneo", label: "Torneo en vivo", icon: "⏱" },
  ];
  const NAV_DOCENTE = [
    { id: "portal", label: "Mi portal", icon: "◉" },
    { id: "torneos", label: "Torneos", icon: "🏆" },
    { id: "torneo", label: "Torneo en vivo", icon: "⏱" },
  ];
  const NAV_ESTUDIANTE = [
    { id: "portal", label: "Mi portal", icon: "◉" },
  ];

  const nav =
    session?.rol === "admin" ? NAV_ADMIN :
    session?.rol === "docente" ? NAV_DOCENTE :
    NAV_ESTUDIANTE;

  function entrar(perfil) {
    setSession(perfil);
    setView(perfil?.rol === "admin" ? "dashboard" : "portal");
  }

  if (!session) return <><Styles /><Login onLogin={entrar} /></>;

  function salir() { logout(); setSession(null); setView("dashboard"); }

  /* Cinturón de seguridad: si por cualquier vía la vista activa no pertenece
     al menú del rol, se cae al primer módulo permitido. */
  const vistaValida = nav.some((n) => n.id === view) ? view : nav[0].id;

  return (
    <div className="fb-app">
      <Styles />
      <aside className="fb-sidebar">
        <div className="fb-brand">
          <img className="fb-logo-img" src={LOGO} alt="FractalBots"
               onError={(e) => { e.currentTarget.style.display = "none"; }} />
          <div>
            <div className="fb-brand-name">FractalBots</div>
            <div className="fb-brand-sub">Panel de gestión</div>
          </div>
        </div>
        <nav>
          {nav.map((n) => (
            <button key={n.id} className={`fb-nav-item ${vistaValida === n.id ? "active" : ""}`} onClick={() => setView(n.id)}>
              <span className="fb-nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="fb-user">
          <div className="fb-user-av">{(session.nombres || session.email || "U").charAt(0).toUpperCase()}</div>
          <div className="fb-user-info">
            <div className="fb-user-name">{session.nombres ? `${session.nombres} ${session.apellidos || ""}` : session.email}</div>
            <div className="fb-user-role">{cap(session.rol || "usuario")}</div>
          </div>
        </div>
        <button className="fb-logout" onClick={salir}>Cerrar sesión</button>
        <div className="fb-sidebar-foot">
          <span className="fb-dot" /> Conectado a Supabase
        </div>
      </aside>

      <main className="fb-main">
        {vistaValida === "portal" && <Portal session={session} onCertificado={openCertificado} />}
        {vistaValida === "dashboard" && <Dashboard />}
        {ENTITIES[vistaValida] && <ResourceView key={vistaValida} entityKey={vistaValida} config={ENTITIES[vistaValida]} />}
        {vistaValida === "certificados" && <Certificados />}
        {vistaValida === "horarios" && <Horarios />}
        {vistaValida === "formularios" && <Formularios />}
        {vistaValida === "torneos" && <Torneos />}
        {vistaValida === "torneo" && <Torneo />}
      </main>
    </div>
  );
}

/* ============================================================
   Login
   ============================================================ */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function entrar() {
    setErr(null); setBusy(true);
    try {
      const perfil = await login(email.trim(), password);
      onLogin(perfil);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fb-login">
      <div className="fb-login-card">
        <img className="fb-login-logo" src={LOGO} alt="FractalBots"
             onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <h1 className="fb-login-title">FractalBots</h1>
        <p className="fb-login-sub">Panel de gestión · Acceso</p>
        {err && <div className="fb-error" style={{ marginBottom: 14 }}>{err}</div>}
        <div className="fb-field">
          <label className="fb-label">Correo</label>
          <input className="fb-input" type="email" value={email} autoFocus
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()} placeholder="correo@ejemplo.com" />
        </div>
        <div className="fb-field">
          <label className="fb-label">Contraseña</label>
          <input className="fb-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()} placeholder="••••••••" />
        </div>
        <button className="fb-btn fb-btn-primary fb-login-btn" onClick={entrar} disabled={busy}>
          {busy ? "Ingresando…" : "Ingresar"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Dashboard
   ============================================================ */
function Dashboard() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    apiGet("vw_dashboard?select=*")
      .then((r) => setD(r?.[0] || {}))
      .catch((e) => setErr(e.message));
  }, []);

  const cards = [
    { k: "estudiantes_activos", label: "Estudiantes activos", accent: "#1E9AD7" },
    { k: "docentes_activos", label: "Docentes", accent: "#F5811F" },
    { k: "prospectos", label: "Prospectos", accent: "#5E2D8E" },
    { k: "cursos_activos", label: "Cursos activos", accent: "#43B02A" },
    { k: "inscripciones_activas", label: "Inscripciones activas", accent: "#1E9AD7" },
    { k: "certificados_emitidos", label: "Certificados emitidos", accent: "#F5811F" },
    { k: "eventos_vigentes", label: "Eventos vigentes", accent: "#5E2D8E" },
  ];

  return (
    <div>
      <Header title="Dashboard" subtitle="Resumen general del centro" />
      {err && <div className="fb-error">No se pudo cargar el resumen: {err}</div>}
      <div className="fb-stat-grid">
        {cards.map((c) => (
          <div className="fb-card fb-stat" key={c.k} style={{ borderTop: `3px solid ${c.accent}` }}>
            <div className="fb-stat-num" style={{ color: c.accent }}>
              {d ? d[c.k] ?? 0 : "·"}
            </div>
            <div className="fb-stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   ResourceView (CRUD genérico)
   ============================================================ */
function ResourceView({ entityKey, config }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  const [modal, setModal] = useState(null);
  const [options, setOptions] = useState({});

  const load = useCallback(() => {
    setErr(null);
    apiGet(`${entityKey}?select=${encodeURIComponent(config.select)}&order=${config.order}`)
      .then(setRows)
      .catch((e) => setErr(e.message));
  }, [entityKey, config]);

  useEffect(() => {
    load();
    config.fields.filter((f) => f.type === "select").forEach((f) => {
      apiGet(`${f.from.table}?select=*&order=nombres.asc`)
        .then((data) => setOptions((o) => ({ ...o, [f.key]: data })))
        .catch(() => {});
    });
  }, [load, config]);

  async function save(form) {
    const body = {};
    config.fields.forEach((f) => {
      let v = form[f.key];
      if (v === "" || v === undefined) v = null;
      if (f.type === "number" && v != null) v = Number(v);
      body[f.key] = v;
    });
    try {
      if (modal.row) await apiPatch(entityKey, modal.row.id, body);
      else await apiPost(entityKey, body);
      setModal(null);
      load();
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  }

  async function remove(row) {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      await apiDelete(entityKey, row.id);
      load();
    } catch (e) {
      alert("Error al eliminar: " + e.message);
    }
  }

  return (
    <div>
      <Header
        title={config.label}
        subtitle={rows ? `${rows.length} registro(s)` : "Cargando…"}
        action={<button className="fb-btn fb-btn-primary" onClick={() => setModal({ row: null })}>+ Nuevo</button>}
      />
      {err && <div className="fb-error">Error: {err}</div>}
      <div className="fb-card fb-table-wrap">
        <table className="fb-table">
          <thead>
            <tr>
              {config.columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows &&
              rows.map((r) => (
                <tr key={r.id}>
                  {config.columns.map((c) => (
                    <td key={c.key}>
                      {c.badge ? (
                        <span className="fb-badge" style={{ background: (BADGE_COLORS[r[c.key]] || "#7C889E") + "22", color: BADGE_COLORS[r[c.key]] || "#7C889E" }}>
                          {cap(r[c.key])}
                        </span>
                      ) : c.render ? (
                        c.render(r)
                      ) : (
                        r[c.key] ?? "—"
                      )}
                    </td>
                  ))}
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="fb-btn fb-btn-ghost" onClick={() => setModal({ row: r })}>Editar</button>
                    <button className="fb-btn fb-btn-danger" onClick={() => remove(r)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            {rows && rows.length === 0 && (
              <tr>
                <td colSpan={config.columns.length + 1} className="fb-empty">
                  Aún no hay registros. Crea el primero con “+ Nuevo”.
                </td>
              </tr>
            )}
            {!rows && (
              <tr>
                <td colSpan={config.columns.length + 1} className="fb-empty">Cargando…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <FormModal
          title={modal.row ? `Editar ${config.label.slice(0, -1).toLowerCase()}` : `Nuevo registro`}
          fields={config.fields}
          initial={modal.row || {}}
          options={options}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

/* ---------- Modal de formulario ---------- */
function FormModal({ title, fields, initial, options, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    const o = {};
    fields.forEach((f) => (o[f.key] = initial[f.key] ?? ""));
    return o;
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function submit() {
    for (const f of fields) if (f.required && !form[f.key]) return alert(`Falta: ${f.label}`);
    onSave(form);
  }

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-head">
          <h3>{title}</h3>
          <button className="fb-x" onClick={onClose}>✕</button>
        </div>
        <div className="fb-modal-body">
          {fields.map((f) => (
            <div className="fb-field" key={f.key}>
              <label className="fb-label">
                {f.label} {f.required && <span style={{ color: "#EF5350" }}>*</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea className="fb-input" rows={3} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              ) : f.type === "enum" ? (
                <select className="fb-input" value={form[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                  <option value="">— seleccionar —</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>{cap(o)}</option>
                  ))}
                </select>
              ) : f.type === "select" ? (
                <select className="fb-input" value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}>
                  <option value="">— seleccionar —</option>
                  {(options[f.key] || []).map((o) => (
                    <option key={o.id} value={o.id}>{f.from.label(o)}</option>
                  ))}
                </select>
              ) : (
                <input className="fb-input" type={f.type || "text"} value={form[f.key]} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
        <div className="fb-modal-foot">
          <button className="fb-btn fb-btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="fb-btn fb-btn-primary" onClick={submit}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Certificados
   ============================================================ */
function Certificados() {
  const [rows, setRows] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({ estudiante_id: "", curso_id: "" });
  const [codigo, setCodigo] = useState("");
  const [verif, setVerif] = useState(null);

  const load = useCallback(() => {
    apiGet("certificados?select=*,estudiantes(nombres,apellidos),cursos(nombre)&order=fecha_emision.desc").then(setRows).catch(() => {});
  }, []);
  useEffect(() => {
    load();
    apiGet("estudiantes?select=id,nombres,apellidos&order=nombres.asc").then(setEstudiantes).catch(() => {});
    apiGet("cursos?select=id,nombre&order=nombre.asc").then(setCursos).catch(() => {});
  }, [load]);

  async function emitir() {
    if (!form.estudiante_id) return alert("Selecciona un estudiante");
    try {
      await apiPost("certificados", { estudiante_id: form.estudiante_id, curso_id: form.curso_id || null });
      setForm({ estudiante_id: "", curso_id: "" });
      load();
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  async function verificar() {
    setVerif(null);
    if (!codigo.trim()) return;
    const r = await apiGet(`certificados?codigo_verificacion=eq.${codigo.trim()}&select=*,estudiantes(nombres,apellidos),cursos(nombre)`);
    setVerif(r && r.length ? r[0] : "invalido");
  }

  return (
    <div>
      <Header title="Certificados" subtitle={rows ? `${rows.length} emitido(s)` : "Cargando…"} />

      <div className="fb-two-col">
        <div className="fb-card fb-pad">
          <h4 className="fb-card-title">Emitir certificado</h4>
          <div className="fb-field">
            <label className="fb-label">Estudiante</label>
            <select className="fb-input" value={form.estudiante_id} onChange={(e) => setForm({ ...form, estudiante_id: e.target.value })}>
              <option value="">— seleccionar —</option>
              {estudiantes.map((e) => (
                <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>
              ))}
            </select>
          </div>
          <div className="fb-field">
            <label className="fb-label">Curso</label>
            <select className="fb-input" value={form.curso_id} onChange={(e) => setForm({ ...form, curso_id: e.target.value })}>
              <option value="">— seleccionar —</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <button className="fb-btn fb-btn-primary" onClick={emitir}>Emitir certificado</button>
        </div>

        <div className="fb-card fb-pad">
          <h4 className="fb-card-title">Verificar por código</h4>
          <div className="fb-field">
            <label className="fb-label">Código de verificación</label>
            <input className="fb-input" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="ej. a3f9c1d2e4b7" />
          </div>
          <button className="fb-btn fb-btn-ghost" onClick={verificar}>Verificar</button>
          {verif === "invalido" && <div className="fb-error" style={{ marginTop: 12 }}>Código no encontrado.</div>}
          {verif && verif !== "invalido" && (
            <div className="fb-verif-ok">
              ✓ Válido — {verif.estudiantes?.nombres} {verif.estudiantes?.apellidos}
              {verif.cursos ? ` · ${verif.cursos.nombre}` : ""}
            </div>
          )}
        </div>
      </div>

      <div className="fb-card fb-table-wrap" style={{ marginTop: 18 }}>
        <table className="fb-table">
          <thead>
            <tr><th>Estudiante</th><th>Curso</th><th>Código</th><th>Emitido</th><th style={{ textAlign: "right" }}>Certificado</th></tr>
          </thead>
          <tbody>
            {rows && rows.map((r) => (
              <tr key={r.id}>
                <td>{r.estudiantes ? `${r.estudiantes.nombres} ${r.estudiantes.apellidos}` : "—"}</td>
                <td>{r.cursos?.nombre || "—"}</td>
                <td className="mono">{r.codigo_verificacion}</td>
                <td>{new Date(r.fecha_emision).toLocaleDateString()}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="fb-btn fb-btn-primary" onClick={() => openCertificado(r)}>Ver / Descargar PDF</button>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 && <tr><td colSpan={5} className="fb-empty">Aún no hay certificados emitidos.</td></tr>}
            {!rows && <tr><td colSpan={5} className="fb-empty">Cargando…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   Torneo · marcador en vivo
   ============================================================ */
function Torneo() {
  const [categorias, setCategorias] = useState([]);
  const [catId, setCatId] = useState("");
  const [marcador, setMarcador] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [ronda, setRonda] = useState(null);
  const [tSel, setTSel] = useState("");
  const [tiempo, setTiempo] = useState("");
  const timer = useRef(null);

  const cat = categorias.find((c) => c.id === catId);

  useEffect(() => {
    apiGet("categorias?select=*,eventos(nombre)&order=nombre.asc").then((c) => {
      setCategorias(c || []);
      if (c && c.length) setCatId(c[0].id);
    });
  }, []);

  const loadMarcador = useCallback(() => {
    if (!catId || !cat) return;
    const orderCol = cat.medicion === "tiempo" ? "mejor_tiempo_ms.asc" : "mejor_puntaje.desc";
    apiGet(`vw_marcador?categoria_id=eq.${catId}&order=${orderCol}`).then(setMarcador).catch(() => {});
  }, [catId, cat]);

  useEffect(() => {
    if (!catId) return;
    loadMarcador();
    apiGet(`inscripciones_torneo?categoria_id=eq.${catId}&select=equipos(id,nombre)`).then((r) => setEquipos((r || []).map((x) => x.equipos)));
    apiGet(`rondas?categoria_id=eq.${catId}&order=numero.asc&limit=1`).then((r) => setRonda(r?.[0] || null));
    clearInterval(timer.current);
    timer.current = setInterval(loadMarcador, 3000);
    return () => clearInterval(timer.current);
  }, [catId, loadMarcador]);

  async function registrar() {
    if (!ronda) return alert("No hay ronda configurada para esta categoría.");
    if (!tSel) return alert("Selecciona un equipo.");
    const body = { ronda_id: ronda.id, equipo_id: tSel, estado: "finalizado", dispositivo_id: "manual" };
    if (cat.medicion === "tiempo") body.tiempo_ms = Math.round(parseFloat(tiempo || "0") * 1000);
    else body.puntos = parseFloat(tiempo || "0");
    try {
      await apiPost("registros_tiempo", body);
      setTiempo("");
      loadMarcador();
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  const medals = ["#F5811F", "#1E9AD7", "#43B02A"];

  return (
    <div>
      <Header
        title="Torneo en vivo"
        subtitle={cat?.eventos?.nombre || "Cronometría IoT"}
        action={<div className="fb-live"><span className="fb-dot" /> En vivo</div>}
      />

      <div className="fb-cat-tabs">
        {categorias.map((c) => (
          <button key={c.id} className={`fb-cat-tab ${c.id === catId ? "active" : ""}`} onClick={() => setCatId(c.id)}>
            {c.nombre} <span className="fb-cat-medicion">{c.medicion === "tiempo" ? "⏱ tiempo" : "★ puntos"}</span>
          </button>
        ))}
      </div>

      <div className="fb-two-col">
        <div className="fb-card fb-pad fb-scoreboard">
          {marcador.length === 0 && <div className="fb-empty">Sin registros todavía. Registra un tiempo para ver el marcador.</div>}
          {marcador.map((m, i) => (
            <div className={`fb-rank ${i < 3 ? "podium" : ""}`} key={m.equipo_id} style={i < 3 ? { borderLeft: `4px solid ${medals[i]}` } : {}}>
              <div className="fb-rank-pos" style={{ color: medals[i] || "#7C889E" }}>{i + 1}</div>
              <div className="fb-rank-team">
                <div className="fb-rank-name">{m.equipo}</div>
                <div className="fb-rank-inst">{m.institucion || ""}</div>
              </div>
              <div className="fb-rank-time mono">
                {cat?.medicion === "tiempo" ? fmtMs(m.mejor_tiempo_ms) : (m.mejor_puntaje ?? "—") + " pts"}
              </div>
            </div>
          ))}
        </div>

        <div className="fb-card fb-pad">
          <h4 className="fb-card-title">Registrar {cat?.medicion === "tiempo" ? "tiempo" : "puntaje"}</h4>
          <p className="fb-hint">Simula el dato que enviaría el ESP32 por MQTT. Se refleja en el marcador al instante.</p>
          <div className="fb-field">
            <label className="fb-label">Equipo</label>
            <select className="fb-input" value={tSel} onChange={(e) => setTSel(e.target.value)}>
              <option value="">— seleccionar —</option>
              {equipos.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div className="fb-field">
            <label className="fb-label">{cat?.medicion === "tiempo" ? "Tiempo (segundos)" : "Puntaje"}</label>
            <input className="fb-input" type="number" step="0.001" value={tiempo} onChange={(e) => setTiempo(e.target.value)} placeholder={cat?.medicion === "tiempo" ? "ej. 17.250" : "ej. 8"} />
          </div>
          <button className="fb-btn fb-btn-primary" onClick={registrar}>Registrar</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Formularios (constructor + respuestas)
   ============================================================ */
const TIPOS_CAMPO = [
  { v: "text", l: "Texto corto" },
  { v: "textarea", l: "Párrafo" },
  { v: "email", l: "Correo" },
  { v: "tel", l: "Teléfono" },
  { v: "number", l: "Número" },
  { v: "select", l: "Lista desplegable" },
  { v: "checkbox", l: "Casilla (sí/no)" },
];

function Formularios() {
  const [rows, setRows] = useState(null);
  const [screen, setScreen] = useState({ name: "list" }); // list | edit | respuestas

  const load = useCallback(() => {
    apiGet("formularios?select=*&order=creado_en.desc").then(setRows).catch(() => setRows([]));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function publicar(f, valor) {
    await apiPatch("formularios", f.id, { publicado: valor });
    load();
  }
  async function eliminar(f) {
    if (!confirm("¿Eliminar este formulario y todas sus respuestas?")) return;
    await apiDelete("formularios", f.id);
    load();
  }
  function copiarLink(f) {
    const url = `${window.location.origin}${window.location.pathname}?formulario=${f.slug}`;
    navigator.clipboard?.writeText(url).then(() => alert("Link copiado:\n" + url), () => prompt("Copia el link:", url));
  }

  if (screen.name === "edit")
    return <FormBuilder form={screen.form} onDone={() => { setScreen({ name: "list" }); load(); }} onCancel={() => setScreen({ name: "list" })} />;
  if (screen.name === "respuestas")
    return <FormRespuestas form={screen.form} onBack={() => setScreen({ name: "list" })} />;

  return (
    <div>
      <Header
        title="Formularios"
        subtitle={rows ? `${rows.length} formulario(s)` : "Cargando…"}
        action={<button className="fb-btn fb-btn-primary" onClick={() => setScreen({ name: "edit", form: null })}>+ Nuevo formulario</button>}
      />
      <div className="fb-card fb-table-wrap">
        <table className="fb-table">
          <thead><tr><th>Título</th><th>Campos</th><th>Estado</th><th style={{ textAlign: "right" }}>Acciones</th></tr></thead>
          <tbody>
            {rows && rows.map((f) => (
              <tr key={f.id}>
                <td>{f.titulo}</td>
                <td>{(f.campos || []).length}</td>
                <td>
                  <span className="fb-badge" style={{ background: (f.publicado ? "#43B02A" : "#7C889E") + "22", color: f.publicado ? "#43B02A" : "#7C889E" }}>
                    {f.publicado ? "Publicado" : "Borrador"}
                  </span>
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button className="fb-btn fb-btn-ghost" onClick={() => setScreen({ name: "edit", form: f })}>Editar</button>
                  <button className="fb-btn fb-btn-ghost" onClick={() => setScreen({ name: "respuestas", form: f })}>Respuestas</button>
                  {f.publicado
                    ? <button className="fb-btn fb-btn-ghost" onClick={() => copiarLink(f)}>Copiar link</button>
                    : null}
                  {f.publicado
                    ? <button className="fb-btn fb-btn-ghost" onClick={() => publicar(f, false)}>Despublicar</button>
                    : <button className="fb-btn fb-btn-primary" onClick={() => publicar(f, true)}>Publicar</button>}
                  <button className="fb-btn fb-btn-danger" onClick={() => eliminar(f)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 && <tr><td colSpan={4} className="fb-empty">Aún no hay formularios. Crea el primero.</td></tr>}
            {!rows && <tr><td colSpan={4} className="fb-empty">Cargando…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Constructor de formulario ---------- */
function FormBuilder({ form, onDone, onCancel }) {
  const [titulo, setTitulo] = useState(form?.titulo || "");
  const [descripcion, setDescripcion] = useState(form?.descripcion || "");
  const [campos, setCampos] = useState(form?.campos || []);
  const [busy, setBusy] = useState(false);

  const addCampo = () => setCampos([...campos, { id: "c" + Date.now(), label: "", type: "text", required: false, options: [] }]);
  const setCampo = (i, patch) => setCampos(campos.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const delCampo = (i) => setCampos(campos.filter((_, j) => j !== i));
  const moveCampo = (i, dir) => {
    const j = i + dir; if (j < 0 || j >= campos.length) return;
    const arr = [...campos]; [arr[i], arr[j]] = [arr[j], arr[i]]; setCampos(arr);
  };

  async function guardar() {
    if (!titulo.trim()) return alert("Ponle un título al formulario.");
    if (campos.length === 0) return alert("Agrega al menos un campo.");
    for (const c of campos) if (!c.label.trim()) return alert("Todos los campos necesitan una etiqueta.");
    setBusy(true);
    const body = { titulo, descripcion, campos };
    try {
      if (form) await apiPatch("formularios", form.id, body);
      else await apiPost("formularios", body);
      onDone();
    } catch (e) { alert("Error: " + e.message); setBusy(false); }
  }

  return (
    <div>
      <Header
        title={form ? "Editar formulario" : "Nuevo formulario"}
        subtitle="Diseña los campos que las personas van a llenar"
        action={<div><button className="fb-btn fb-btn-ghost" onClick={onCancel}>Cancelar</button><button className="fb-btn fb-btn-primary" onClick={guardar} disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button></div>}
      />
      <div className="fb-two-col">
        <div>
          <div className="fb-card fb-pad" style={{ marginBottom: 16 }}>
            <div className="fb-field">
              <label className="fb-label">Título del formulario</label>
              <input className="fb-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="ej. Inscripción al taller de robótica" />
            </div>
            <div className="fb-field">
              <label className="fb-label">Descripción (opcional)</label>
              <textarea className="fb-input" rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
          </div>

          {campos.map((c, i) => (
            <div className="fb-card fb-pad fb-campo" key={c.id}>
              <div className="fb-campo-head">
                <span className="fb-campo-num">Campo {i + 1}</span>
                <div>
                  <button className="fb-btn fb-btn-ghost" onClick={() => moveCampo(i, -1)}>↑</button>
                  <button className="fb-btn fb-btn-ghost" onClick={() => moveCampo(i, 1)}>↓</button>
                  <button className="fb-btn fb-btn-danger" onClick={() => delCampo(i)}>Quitar</button>
                </div>
              </div>
              <div className="fb-field">
                <label className="fb-label">Etiqueta (la pregunta)</label>
                <input className="fb-input" value={c.label} onChange={(e) => setCampo(i, { label: e.target.value })} placeholder="ej. Nombre completo" />
              </div>
              <div className="fb-campo-row">
                <div className="fb-field" style={{ flex: 1 }}>
                  <label className="fb-label">Tipo</label>
                  <select className="fb-input" value={c.type} onChange={(e) => setCampo(i, { type: e.target.value })}>
                    {TIPOS_CAMPO.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
                  </select>
                </div>
                <label className="fb-check">
                  <input type="checkbox" checked={c.required} onChange={(e) => setCampo(i, { required: e.target.checked })} /> Obligatorio
                </label>
              </div>
              {c.type === "select" && (
                <div className="fb-field">
                  <label className="fb-label">Opciones (una por línea)</label>
                  <textarea className="fb-input" rows={3} value={(c.options || []).join("\n")}
                    onChange={(e) => setCampo(i, { options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                    placeholder={"Opción 1\nOpción 2"} />
                </div>
              )}
            </div>
          ))}
          <button className="fb-btn fb-btn-ghost fb-add-campo" onClick={addCampo}>+ Agregar campo</button>
        </div>

        <div className="fb-card fb-pad">
          <h4 className="fb-card-title">Vista previa</h4>
          <FormPreview titulo={titulo} descripcion={descripcion} campos={campos} />
        </div>
      </div>
    </div>
  );
}

function FormPreview({ titulo, descripcion, campos }) {
  return (
    <div className="fb-preview">
      <div className="fb-preview-title">{titulo || "Título del formulario"}</div>
      {descripcion && <div className="fb-preview-desc">{descripcion}</div>}
      {campos.length === 0 && <div className="fb-empty" style={{ padding: 20 }}>Agrega campos para ver la vista previa.</div>}
      {campos.map((c) => (
        <div className="fb-field" key={c.id}>
          <label className="fb-label">{c.label || "Campo"} {c.required && <span style={{ color: "#EF5350" }}>*</span>}</label>
          <CampoInput campo={c} value="" onChange={() => {}} preview />
        </div>
      ))}
    </div>
  );
}

/* ---------- Respuestas de un formulario ---------- */
function FormRespuestas({ form, onBack }) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    apiGet(`formulario_respuestas?formulario_id=eq.${form.id}&select=*&order=enviado_en.desc`).then(setRows).catch(() => setRows([]));
  }, [form.id]);
  const campos = form.campos || [];

  return (
    <div>
      <Header title={`Respuestas · ${form.titulo}`} subtitle={rows ? `${rows.length} respuesta(s)` : "Cargando…"}
        action={<button className="fb-btn fb-btn-ghost" onClick={onBack}>← Volver</button>} />
      <div className="fb-card fb-table-wrap">
        <table className="fb-table">
          <thead><tr><th>Enviado</th>{campos.map((c) => <th key={c.id}>{c.label}</th>)}</tr></thead>
          <tbody>
            {rows && rows.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.enviado_en).toLocaleString()}</td>
                {campos.map((c) => <td key={c.id}>{formatRespuesta(r.datos?.[c.id])}</td>)}
              </tr>
            ))}
            {rows && rows.length === 0 && <tr><td colSpan={campos.length + 1} className="fb-empty">Aún no hay respuestas.</td></tr>}
            {!rows && <tr><td colSpan={campos.length + 1} className="fb-empty">Cargando…</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const formatRespuesta = (v) => (v === true ? "Sí" : v === false ? "No" : v == null || v === "" ? "—" : String(v));

/* ---------- Input reutilizable de un campo ---------- */
function CampoInput({ campo, value, onChange, preview }) {
  const p = preview ? { disabled: true } : {};
  if (campo.type === "textarea")
    return <textarea className="fb-input" rows={3} value={value} onChange={(e) => onChange(e.target.value)} {...p} />;
  if (campo.type === "select")
    return (
      <select className="fb-input" value={value} onChange={(e) => onChange(e.target.value)} {...p}>
        <option value="">— seleccionar —</option>
        {(campo.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  if (campo.type === "checkbox")
    return <label className="fb-check"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} {...p} /> Sí</label>;
  return <input className="fb-input" type={campo.type} value={value} onChange={(e) => onChange(e.target.value)} {...p} />;
}

/* ============================================================
   FormFill · página pública para llenar un formulario
   ============================================================ */
function FormFill({ slug }) {
  const [form, setForm] = useState(undefined); // undefined=cargando, null=no existe
  const [ans, setAns] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiGet(`formularios?slug=eq.${slug}&publicado=eq.true&select=id,titulo,descripcion,campos`)
      .then((r) => setForm(r && r.length ? r[0] : null))
      .catch(() => setForm(null));
  }, [slug]);

  async function enviar() {
    for (const c of form.campos) {
      if (c.required && (ans[c.id] === undefined || ans[c.id] === "" || ans[c.id] === false))
        return alert(`Falta: ${c.label}`);
    }
    setBusy(true);
    try {
      await apiInsertMinimal("formulario_respuestas", { formulario_id: form.id, datos: ans });
      setEnviado(true);
    } catch (e) { alert("No se pudo enviar: " + e.message); setBusy(false); }
  }

  return (
    <div className="fb-public">
      <div className="fb-public-card">
        <img className="fb-public-logo" src={LOGO} alt="FractalBots" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        {form === undefined && <div className="fb-empty">Cargando…</div>}
        {form === null && <div className="fb-empty">Este formulario no está disponible.</div>}
        {enviado && <div className="fb-verif-ok" style={{ fontSize: 15, textAlign: "center", padding: 20 }}>✓ ¡Gracias! Tu respuesta fue registrada.</div>}
        {form && !enviado && (
          <>
            <div className="fb-preview-title">{form.titulo}</div>
            {form.descripcion && <div className="fb-preview-desc">{form.descripcion}</div>}
            {form.campos.map((c) => (
              <div className="fb-field" key={c.id}>
                <label className="fb-label">{c.label} {c.required && <span style={{ color: "#EF5350" }}>*</span>}</label>
                <CampoInput campo={c} value={ans[c.id] ?? (c.type === "checkbox" ? false : "")} onChange={(v) => setAns({ ...ans, [c.id]: v })} />
              </div>
            ))}
            <button className="fb-btn fb-btn-primary fb-login-btn" onClick={enviar} disabled={busy}>{busy ? "Enviando…" : "Enviar"}</button>
            <div className="fb-public-foot">FractalBots · Robótica Educativa</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Header reutilizable ---------- */
function Header({ title, subtitle, action }) {
  return (
    <div className="fb-header">
      <div>
        <h1 className="fb-title">{title}</h1>
        {subtitle && <p className="fb-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ============================================================
   Estilos — identidad FractalBots
   ============================================================ */
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

      * { box-sizing: border-box; }
      .fb-app {
        --bg:#F3F5FB; --surface:#FFFFFF; --surface2:#EEF1F8; --border:#E4E8F1;
        --text:#20263A; --muted:#7C889E;
        --blue:#1E9AD7; --green:#43B02A; --purple:#5E2D8E; --orange:#F5811F; --teal:#17A2A2;
        --grad:linear-gradient(165deg,#5E2D8E 0%,#453aa0 42%,#17A2A2 100%);
        display:grid; grid-template-columns:250px 1fr; min-height:100vh;
        font-family:'Inter',system-ui,sans-serif; background:var(--bg); color:var(--text);
      }
      .fb-sidebar { background:var(--grad); padding:22px 14px; display:flex; flex-direction:column; }
      .fb-brand { display:flex; align-items:center; gap:12px; padding:4px 6px 22px; }
      .fb-logo-img { width:44px; height:44px; border-radius:50%; background:#fff; object-fit:contain; padding:2px; }
      .fb-brand-name { font-family:'Space Grotesk'; font-weight:700; font-size:18px; letter-spacing:-.5px; color:#fff; }
      .fb-brand-sub { font-size:11px; color:rgba(255,255,255,.72); text-transform:uppercase; letter-spacing:1.5px; }
      .fb-nav-item { display:flex; align-items:center; gap:11px; width:100%; text-align:left; background:none; border:none;
        color:rgba(255,255,255,.8); font-size:14px; font-weight:500; padding:11px 12px; border-radius:9px; cursor:pointer; margin-bottom:2px; font-family:inherit; transition:.15s; }
      .fb-nav-item:hover { background:rgba(255,255,255,.12); color:#fff; }
      .fb-nav-item.active { background:rgba(255,255,255,.18); color:#fff; box-shadow:inset 3px 0 0 var(--orange); }
      .fb-nav-icon { width:20px; text-align:center; font-size:14px; color:rgba(255,255,255,.9); }
      .fb-sidebar-foot { margin-top:14px; font-size:11px; color:rgba(255,255,255,.8); display:flex; align-items:center; gap:7px; padding:10px 8px 0; }

      .fb-user { margin-top:auto; display:flex; align-items:center; gap:10px; padding:12px 8px 4px; }
      .fb-user-av { width:34px; height:34px; border-radius:50%; background:var(--orange); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-family:'Space Grotesk',sans-serif; }
      .fb-user-name { font-size:13px; color:#fff; font-weight:600; }
      .fb-user-role { font-size:11px; color:rgba(255,255,255,.7); }
      .fb-logout { margin-top:8px; width:100%; background:rgba(255,255,255,.1); color:#fff; border:1px solid rgba(255,255,255,.2); border-radius:8px; padding:9px; font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; transition:.15s; }
      .fb-logout:hover { background:rgba(255,255,255,.18); }

      .fb-check { display:inline-flex; align-items:center; gap:7px; font-size:13px; color:var(--text); cursor:pointer; }
      .fb-check input { width:16px; height:16px; accent-color:var(--purple); }
      .fb-campo { margin-bottom:14px; }
      .fb-campo-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
      .fb-campo-num { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:13px; color:var(--purple); }
      .fb-campo-row { display:flex; gap:16px; align-items:flex-end; }
      .fb-add-campo { width:100%; border-style:dashed; }
      .fb-preview { background:var(--surface2); border-radius:10px; padding:16px; }
      .fb-preview-title { font-family:'Space Grotesk',sans-serif; font-size:20px; font-weight:700; margin-bottom:4px; }
      .fb-preview-desc { font-size:13px; color:var(--muted); margin-bottom:16px; }

      .fb-public { min-height:100vh; background:var(--grad); display:flex; align-items:flex-start; justify-content:center; padding:40px 20px; font-family:'Inter',sans-serif; }
      .fb-public-card { background:#fff; border-radius:18px; padding:34px 30px; width:100%; max-width:560px; box-shadow:0 24px 70px rgba(20,15,45,.35); }
      .fb-public-logo { width:64px; height:64px; border-radius:50%; object-fit:contain; display:block; margin:0 auto 18px; }
      .fb-public-foot { text-align:center; font-size:11px; color:var(--muted); margin-top:18px; text-transform:uppercase; letter-spacing:1.5px; }

      .fb-login { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--grad); padding:20px; font-family:'Inter',sans-serif; }
      .fb-login-card { background:#fff; border-radius:18px; padding:38px 34px; width:100%; max-width:380px; text-align:center; box-shadow:0 24px 70px rgba(20,15,45,.35); }
      .fb-login-logo { width:76px; height:76px; border-radius:50%; object-fit:contain; }
      .fb-login-title { font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:700; color:#5E2D8E; margin:14px 0 2px; letter-spacing:-.5px; }
      .fb-login-sub { color:#7C889E; font-size:12.5px; margin:0 0 24px; text-transform:uppercase; letter-spacing:1.5px; }
      .fb-login-card .fb-field { text-align:left; }
      .fb-login-btn { width:100%; margin-top:8px; padding:11px; font-size:14px; }
      .fb-login-btn:disabled { opacity:.6; cursor:default; }


      /* ═══ MÓDULO DE TORNEOS ═══════════════════════════════════ */
      .fb-grid-cards{ display:grid; gap:14px; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); }
      .fb-torneo-card{ cursor:pointer; transition:transform .25s, box-shadow .25s, border-color .25s; }
      .fb-torneo-card:hover{ transform:translateY(-3px); box-shadow:0 12px 30px rgba(32,38,58,.10); border-color:var(--blue); }
      .fb-torneo-top{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px; }
      .fb-torneo-name{ margin:0 0 6px; font-family:'Space Grotesk',sans-serif; font-size:1.05rem; font-weight:700; color:var(--text); }

      .fb-chip{ display:inline-block; padding:4px 10px; border-radius:99px; background:var(--surface2);
                border:1px solid var(--border); font-size:.68rem; font-weight:600; color:var(--muted);
                text-transform:uppercase; letter-spacing:.06em; white-space:nowrap; }
      .fb-chip.ok{ background:rgba(67,176,42,.10); border-color:rgba(67,176,42,.35); color:#2F7D1E; }
      .fb-chip.no{ background:rgba(226,73,73,.10); border-color:rgba(226,73,73,.35); color:#B93030; }

      .fb-actions{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
      .fb-mb{ margin-bottom:14px; }
      .fb-sep{ margin:18px 0 10px; padding-top:14px; border-top:1px solid var(--border);
               font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); }

      .fb-row-2{ display:grid; gap:12px; grid-template-columns:1fr 1fr; }
      .fb-row-3{ display:grid; gap:12px; grid-template-columns:repeat(3,1fr); }
      @media (max-width:640px){ .fb-row-2,.fb-row-3{ grid-template-columns:1fr; } }

      .fb-check{ display:flex; align-items:center; gap:9px; margin:12px 0; font-size:.9rem; cursor:pointer; }
      .fb-check input{ width:17px; height:17px; accent-color:var(--blue); }

      .fb-link-box{ display:flex; justify-content:space-between; align-items:center; gap:18px;
                    flex-wrap:wrap; margin-bottom:16px; }
      .fb-code-inline{ display:inline-block; margin-top:8px; padding:7px 11px; border-radius:7px;
                       background:var(--surface2); border:1px solid var(--border);
                       font-family:'JetBrains Mono',monospace; font-size:.74rem; color:var(--text);
                       word-break:break-all; }

      .fb-warn{ padding:12px 15px; border-radius:9px; margin:12px 0; font-size:.87rem;
                background:rgba(245,129,31,.09); border:1px solid rgba(245,129,31,.32); color:#96500D; }
      .fb-error{ padding:11px 14px; border-radius:9px; margin:12px 0; font-size:.87rem;
                 background:rgba(226,73,73,.09); border:1px solid rgba(226,73,73,.32); color:#B93030; }
      .fb-ok{ padding:11px 14px; border-radius:9px; margin:12px 0; font-size:.87rem;
              background:rgba(67,176,42,.09); border:1px solid rgba(67,176,42,.32); color:#2F7D1E; }

      .fb-insc-row{ display:flex; align-items:center; gap:14px; padding:14px 18px;
                    border-bottom:1px solid var(--border); }
      .fb-insc-row:last-child{ border-bottom:none; }
      .fb-insc-main{ flex:1; min-width:0; cursor:pointer; }
      .fb-insc-name{ font-weight:600; color:var(--text); }
      .fb-insc-robot{ color:var(--muted); font-weight:400; }

      .fb-btn-mini{ padding:6px 13px; border-radius:7px; border:1px solid var(--border);
                    background:var(--surface); color:var(--text); font-size:.76rem; font-weight:600;
                    cursor:pointer; transition:.2s; white-space:nowrap; }
      .fb-btn-mini:hover{ border-color:var(--blue); color:var(--blue); }
      .fb-btn-mini.ok{ background:var(--green); border-color:var(--green); color:#fff; }
      .fb-btn-mini.ok:hover{ opacity:.86; color:#fff; }
      .fb-btn-mini.no{ background:transparent; border-color:rgba(226,73,73,.45); color:#B93030; }
      .fb-btn-mini.no:hover{ background:rgba(226,73,73,.08); color:#B93030; }
      .fb-btn-block{ width:100%; justify-content:center; margin-top:8px; }

      .fb-limites{ margin-bottom:14px; }
      .fb-limites-row{ display:flex; flex-wrap:wrap; gap:16px; margin:8px 0; font-size:.82rem; color:var(--text); }
      .fb-input-error{ border-color:#E24949 !important; background:rgba(226,73,73,.05); }
      .fb-input-ok{ border-color:rgba(67,176,42,.55) !important; }

      .fb-dato{ display:flex; justify-content:space-between; gap:14px; padding:8px 0;
                border-bottom:1px solid var(--border); font-size:.88rem; }
      .fb-dato:last-of-type{ border-bottom:none; }

      /* ── Ventanas modales ── */
      .fb-modal-bg{ position:fixed; inset:0; z-index:900; background:rgba(20,24,38,.55);
                    backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:20px; }
      .fb-modal{ width:100%; max-height:92vh; overflow-y:auto; background:var(--surface);
                 border-radius:16px; box-shadow:0 24px 60px rgba(20,24,38,.28); }
      .fb-modal-head{ position:sticky; top:0; z-index:2; display:flex; justify-content:space-between;
                      align-items:center; gap:14px; padding:18px 22px; background:var(--surface);
                      border-bottom:1px solid var(--border); }
      .fb-modal-head h3{ margin:0; font-family:'Space Grotesk',sans-serif; font-size:1.02rem; font-weight:700; }
      .fb-modal-x{ width:32px; height:32px; border-radius:50%; border:1px solid var(--border);
                   background:transparent; cursor:pointer; color:var(--muted); font-size:.9rem; }
      .fb-modal-x:hover{ border-color:var(--blue); color:var(--blue); }
      .fb-modal-body{ padding:20px 22px 24px; }
      .fb-modal-actions{ display:flex; justify-content:flex-end; gap:9px; margin-top:20px; flex-wrap:wrap; }

      /* ── Pantalla pública de inscripción ── */
      .fb-pub-bg{ min-height:100vh; padding:32px 18px; background:var(--grad);
                  display:flex; align-items:center; justify-content:center;
                  font-family:'Inter',system-ui,sans-serif; }
      .fb-pub-card{ width:100%; max-width:660px; background:#fff; border-radius:20px;
                    padding:clamp(24px,4vw,42px); box-shadow:0 26px 70px rgba(20,24,38,.28); }
      .fb-pub-eyebrow{ font-size:.68rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
                       color:var(--blue); margin-bottom:9px; }
      .fb-pub-title{ margin:0 0 8px; font-family:'Space Grotesk',sans-serif; font-size:clamp(1.4rem,3.4vw,2rem);
                     font-weight:700; color:var(--text); line-height:1.15; }
      .fb-pub-desc{ margin:14px 0 20px; font-size:.92rem; color:var(--text); line-height:1.65; }
      .fb-reglas{ margin:16px 0; padding:15px 17px; border-radius:11px;
                  background:var(--surface2); border:1px solid var(--border); }
      .fb-reglas ul{ margin:8px 0 6px; padding-left:19px; font-size:.87rem; line-height:1.75; }
      .fb-ok-mark{ width:56px; height:56px; margin-bottom:16px; border-radius:50%;
                   display:grid; place-items:center; font-size:1.6rem; color:#fff; background:var(--green); }

      @media (max-width:820px){ .fb-app{ grid-template-columns:1fr; } .fb-sidebar{ flex-direction:row; overflow:auto; } .fb-two-col{ grid-template-columns:1fr; } .fb-main{ padding:20px; } .fb-user{ margin-top:0; } }
      .fb-dot { width:8px; height:8px; border-radius:50%; background:#7CF0D8; animation:pulse 1.8s infinite; }
      @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(124,240,216,.6);} 70%{box-shadow:0 0 0 7px rgba(124,240,216,0);} 100%{box-shadow:0 0 0 0 rgba(124,240,216,0);} }

      .fb-main { padding:30px 38px; overflow:auto; }
      .fb-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; gap:16px; }
      .fb-title { font-family:'Space Grotesk'; font-size:27px; font-weight:700; margin:0; letter-spacing:-.6px; color:var(--text); }
      .fb-subtitle { color:var(--muted); font-size:13px; margin:5px 0 0; }

      .fb-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; box-shadow:0 1px 3px rgba(30,38,58,.04); }
      .fb-pad { padding:20px; }
      .fb-card-title { font-family:'Space Grotesk'; font-size:15px; margin:0 0 14px; font-weight:600; }
      .fb-hint { font-size:12px; color:var(--muted); margin:-6px 0 14px; }

      .fb-stat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px; }
      .fb-stat { padding:20px 22px; }
      .fb-stat-num { font-family:'Space Grotesk'; font-size:38px; font-weight:700; line-height:1; letter-spacing:-1px; }
      .fb-stat-label { color:var(--muted); font-size:12.5px; margin-top:8px; }

      .fb-table-wrap { overflow:hidden; }
      .fb-table { width:100%; border-collapse:collapse; font-size:13.5px; }
      .fb-table th { text-align:left; color:var(--muted); font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:.8px;
        padding:14px 18px; border-bottom:1px solid var(--border); }
      .fb-table td { padding:13px 18px; border-bottom:1px solid #F0F2F7; }
      .fb-table tr:last-child td { border-bottom:none; }
      .fb-table tbody tr:hover { background:var(--surface2); }
      .fb-empty { text-align:center; color:var(--muted); padding:34px !important; }

      .fb-badge { padding:4px 10px; border-radius:20px; font-size:11.5px; font-weight:600; }

      .fb-btn { font-family:inherit; font-size:13px; font-weight:600; padding:8px 14px; border-radius:8px; border:1px solid transparent; cursor:pointer; transition:.15s; }
      .fb-btn-primary { background:var(--purple); color:#fff; }
      .fb-btn-primary:hover { background:#6f3aa5; }
      .fb-btn-ghost { background:transparent; color:var(--muted); border-color:var(--border); margin-right:6px; }
      .fb-btn-ghost:hover { color:var(--text); border-color:var(--muted); }
      .fb-btn-danger { background:transparent; color:#EF5350; border-color:rgba(239,83,80,.3); }
      .fb-btn-danger:hover { background:rgba(239,83,80,.1); }

      .fb-modal-overlay { position:fixed; inset:0; background:rgba(32,38,58,.5); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px; }
      .fb-modal { background:var(--surface); border-radius:16px; width:100%; max-width:520px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(32,38,58,.25); }
      .fb-modal-head { display:flex; justify-content:space-between; align-items:center; padding:18px 22px; border-bottom:1px solid var(--border); }
      .fb-modal-head h3 { margin:0; font-family:'Space Grotesk'; font-size:17px; }
      .fb-x { background:none; border:none; color:var(--muted); font-size:16px; cursor:pointer; }
      .fb-modal-body { padding:20px 22px; overflow:auto; }
      .fb-modal-foot { padding:16px 22px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; }

      .fb-field { margin-bottom:14px; }
      .fb-label { display:block; font-size:12px; color:var(--muted); margin-bottom:6px; font-weight:500; }
      .fb-input { width:100%; background:#fff; border:1px solid var(--border); border-radius:8px; padding:9px 12px; color:var(--text); font-family:inherit; font-size:13.5px; }
      .fb-input:focus { outline:none; border-color:var(--purple); box-shadow:0 0 0 3px rgba(94,45,142,.12); }
      textarea.fb-input { resize:vertical; }

      .fb-two-col { display:grid; grid-template-columns:1.4fr 1fr; gap:18px; align-items:start; }
      .fb-verif-ok { margin-top:12px; background:rgba(67,176,42,.12); color:var(--green); padding:11px 14px; border-radius:9px; font-size:13px; font-weight:500; }
      .fb-error { background:rgba(239,83,80,.1); color:#EF5350; padding:11px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; }

      .mono { font-family:'JetBrains Mono',monospace; }

      .fb-live { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--teal); font-weight:600; text-transform:uppercase; letter-spacing:1px; }
      .fb-cat-tabs { display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
      .fb-cat-tab { background:var(--surface); border:1px solid var(--border); color:var(--muted); padding:10px 16px; border-radius:10px; cursor:pointer; font-family:inherit; font-size:13.5px; font-weight:600; }
      .fb-cat-tab.active { border-color:var(--purple); color:var(--purple); background:rgba(94,45,142,.06); }
      .fb-cat-medicion { font-size:11px; color:var(--muted); font-weight:500; margin-left:5px; }

      .fb-scoreboard { display:flex; flex-direction:column; gap:8px; }
      .fb-rank { display:flex; align-items:center; gap:16px; padding:14px 16px; background:var(--surface2); border:1px solid var(--border); border-radius:11px; }
      .fb-rank.podium { background:#fff; }
      .fb-rank-pos { font-family:'Space Grotesk'; font-size:26px; font-weight:700; width:34px; text-align:center; }
      .fb-rank-team { flex:1; }
      .fb-rank-name { font-weight:600; font-size:15px; }
      .fb-rank-inst { font-size:12px; color:var(--muted); }
      .fb-rank-time { font-size:20px; font-weight:700; color:var(--teal); }


      /* ═══ MÓDULO DE TORNEOS ═══════════════════════════════════ */
      .fb-grid-cards{ display:grid; gap:14px; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); }
      .fb-torneo-card{ cursor:pointer; transition:transform .25s, box-shadow .25s, border-color .25s; }
      .fb-torneo-card:hover{ transform:translateY(-3px); box-shadow:0 12px 30px rgba(32,38,58,.10); border-color:var(--blue); }
      .fb-torneo-top{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px; }
      .fb-torneo-name{ margin:0 0 6px; font-family:'Space Grotesk',sans-serif; font-size:1.05rem; font-weight:700; color:var(--text); }

      .fb-chip{ display:inline-block; padding:4px 10px; border-radius:99px; background:var(--surface2);
                border:1px solid var(--border); font-size:.68rem; font-weight:600; color:var(--muted);
                text-transform:uppercase; letter-spacing:.06em; white-space:nowrap; }
      .fb-chip.ok{ background:rgba(67,176,42,.10); border-color:rgba(67,176,42,.35); color:#2F7D1E; }
      .fb-chip.no{ background:rgba(226,73,73,.10); border-color:rgba(226,73,73,.35); color:#B93030; }

      .fb-actions{ display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
      .fb-mb{ margin-bottom:14px; }
      .fb-sep{ margin:18px 0 10px; padding-top:14px; border-top:1px solid var(--border);
               font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); }

      .fb-row-2{ display:grid; gap:12px; grid-template-columns:1fr 1fr; }
      .fb-row-3{ display:grid; gap:12px; grid-template-columns:repeat(3,1fr); }
      @media (max-width:640px){ .fb-row-2,.fb-row-3{ grid-template-columns:1fr; } }

      .fb-check{ display:flex; align-items:center; gap:9px; margin:12px 0; font-size:.9rem; cursor:pointer; }
      .fb-check input{ width:17px; height:17px; accent-color:var(--blue); }

      .fb-link-box{ display:flex; justify-content:space-between; align-items:center; gap:18px;
                    flex-wrap:wrap; margin-bottom:16px; }
      .fb-code-inline{ display:inline-block; margin-top:8px; padding:7px 11px; border-radius:7px;
                       background:var(--surface2); border:1px solid var(--border);
                       font-family:'JetBrains Mono',monospace; font-size:.74rem; color:var(--text);
                       word-break:break-all; }

      .fb-warn{ padding:12px 15px; border-radius:9px; margin:12px 0; font-size:.87rem;
                background:rgba(245,129,31,.09); border:1px solid rgba(245,129,31,.32); color:#96500D; }
      .fb-error{ padding:11px 14px; border-radius:9px; margin:12px 0; font-size:.87rem;
                 background:rgba(226,73,73,.09); border:1px solid rgba(226,73,73,.32); color:#B93030; }
      .fb-ok{ padding:11px 14px; border-radius:9px; margin:12px 0; font-size:.87rem;
              background:rgba(67,176,42,.09); border:1px solid rgba(67,176,42,.32); color:#2F7D1E; }

      .fb-insc-row{ display:flex; align-items:center; gap:14px; padding:14px 18px;
                    border-bottom:1px solid var(--border); }
      .fb-insc-row:last-child{ border-bottom:none; }
      .fb-insc-main{ flex:1; min-width:0; cursor:pointer; }
      .fb-insc-name{ font-weight:600; color:var(--text); }
      .fb-insc-robot{ color:var(--muted); font-weight:400; }

      .fb-btn-mini{ padding:6px 13px; border-radius:7px; border:1px solid var(--border);
                    background:var(--surface); color:var(--text); font-size:.76rem; font-weight:600;
                    cursor:pointer; transition:.2s; white-space:nowrap; }
      .fb-btn-mini:hover{ border-color:var(--blue); color:var(--blue); }
      .fb-btn-mini.ok{ background:var(--green); border-color:var(--green); color:#fff; }
      .fb-btn-mini.ok:hover{ opacity:.86; color:#fff; }
      .fb-btn-mini.no{ background:transparent; border-color:rgba(226,73,73,.45); color:#B93030; }
      .fb-btn-mini.no:hover{ background:rgba(226,73,73,.08); color:#B93030; }
      .fb-btn-block{ width:100%; justify-content:center; margin-top:8px; }

      .fb-limites{ margin-bottom:14px; }
      .fb-limites-row{ display:flex; flex-wrap:wrap; gap:16px; margin:8px 0; font-size:.82rem; color:var(--text); }
      .fb-input-error{ border-color:#E24949 !important; background:rgba(226,73,73,.05); }
      .fb-input-ok{ border-color:rgba(67,176,42,.55) !important; }

      .fb-dato{ display:flex; justify-content:space-between; gap:14px; padding:8px 0;
                border-bottom:1px solid var(--border); font-size:.88rem; }
      .fb-dato:last-of-type{ border-bottom:none; }

      /* ── Ventanas modales ── */
      .fb-modal-bg{ position:fixed; inset:0; z-index:900; background:rgba(20,24,38,.55);
                    backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:20px; }
      .fb-modal{ width:100%; max-height:92vh; overflow-y:auto; background:var(--surface);
                 border-radius:16px; box-shadow:0 24px 60px rgba(20,24,38,.28); }
      .fb-modal-head{ position:sticky; top:0; z-index:2; display:flex; justify-content:space-between;
                      align-items:center; gap:14px; padding:18px 22px; background:var(--surface);
                      border-bottom:1px solid var(--border); }
      .fb-modal-head h3{ margin:0; font-family:'Space Grotesk',sans-serif; font-size:1.02rem; font-weight:700; }
      .fb-modal-x{ width:32px; height:32px; border-radius:50%; border:1px solid var(--border);
                   background:transparent; cursor:pointer; color:var(--muted); font-size:.9rem; }
      .fb-modal-x:hover{ border-color:var(--blue); color:var(--blue); }
      .fb-modal-body{ padding:20px 22px 24px; }
      .fb-modal-actions{ display:flex; justify-content:flex-end; gap:9px; margin-top:20px; flex-wrap:wrap; }

      /* ── Pantalla pública de inscripción ── */
      .fb-pub-bg{ min-height:100vh; padding:32px 18px; background:var(--grad);
                  display:flex; align-items:center; justify-content:center;
                  font-family:'Inter',system-ui,sans-serif; }
      .fb-pub-card{ width:100%; max-width:660px; background:#fff; border-radius:20px;
                    padding:clamp(24px,4vw,42px); box-shadow:0 26px 70px rgba(20,24,38,.28); }
      .fb-pub-eyebrow{ font-size:.68rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
                       color:var(--blue); margin-bottom:9px; }
      .fb-pub-title{ margin:0 0 8px; font-family:'Space Grotesk',sans-serif; font-size:clamp(1.4rem,3.4vw,2rem);
                     font-weight:700; color:var(--text); line-height:1.15; }
      .fb-pub-desc{ margin:14px 0 20px; font-size:.92rem; color:var(--text); line-height:1.65; }
      .fb-reglas{ margin:16px 0; padding:15px 17px; border-radius:11px;
                  background:var(--surface2); border:1px solid var(--border); }
      .fb-reglas ul{ margin:8px 0 6px; padding-left:19px; font-size:.87rem; line-height:1.75; }
      .fb-ok-mark{ width:56px; height:56px; margin-bottom:16px; border-radius:50%;
                   display:grid; place-items:center; font-size:1.6rem; color:#fff; background:var(--green); }

      @media (max-width:820px){ .fb-app{ grid-template-columns:1fr; } .fb-sidebar{ flex-direction:row; overflow:auto; } .fb-two-col{ grid-template-columns:1fr; } .fb-main{ padding:20px; } }
    `}</style>
  );
}