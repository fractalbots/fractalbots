import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPatch, apiInsertMinimal, apiRpc, SB_URL, SB_KEY } from "./api";

/* ════════════════════════════════════════════════════════════════
   MÓDULO DE TORNEOS
   Flujo: crear torneo → inscripción pública → aprobación → check-in

   La numeración de pasos corresponde al recorrido real del evento:
   el admin abre el torneo, el público se inscribe, el admin revisa
   los datos y, el día de la competencia, mide el robot.
   ════════════════════════════════════════════════════════════════ */

const MODALIDADES = [
  { v: "minisumo", t: "Mini Sumo" },
  { v: "seguidor_linea", t: "Seguidor de línea" },
  { v: "laberinto", t: "Laberinto" },
  { v: "libre", t: "Libre / Otra" },
];

const FORMATOS = [
  { v: "por_tiempo", t: "Por tiempo o puntaje", d: "Cada equipo corre solo. Gana el mejor registro." },
  { v: "doble_eliminacion", t: "Doble eliminación", d: "Un fallo eléctrico no elimina: se cae a la llave de perdedores." },
  { v: "eliminacion_simple", t: "Eliminación simple", d: "Quien pierde queda fuera. Torneo más corto." },
  { v: "round_robin", t: "Round robin (grupos)", d: "Todos contra todos dentro de cada grupo." },
];

/* Valores sugeridos por modalidad, tomados de los reglamentos habituales.
   Son un punto de partida editable, no una imposición. */
const LIMITES_SUGERIDOS = {
  minisumo: { peso_max_g: 500, largo_max_mm: 100, ancho_max_mm: 100, alto_max_mm: null, voltaje_max_v: 12 },
  seguidor_linea: { peso_max_g: 1000, largo_max_mm: 250, ancho_max_mm: 200, alto_max_mm: null, voltaje_max_v: 12 },
  laberinto: { peso_max_g: 1500, largo_max_mm: 250, ancho_max_mm: 250, alto_max_mm: null, voltaje_max_v: 12 },
  libre: {},
};

const hoy = () => new Date().toISOString().slice(0, 10);

/* ════════════════════════════════════════════════════════════════
   1 · CREAR Y ADMINISTRAR TORNEOS
   ════════════════════════════════════════════════════════════════ */
export function Torneos() {
  const [eventos, setEventos] = useState([]);
  const [sel, setSel] = useState(null);
  const [creando, setCreando] = useState(false);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const r = await apiGet("eventos?select=*&order=fecha.desc");
      setEventos(r || []);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  if (sel) return <DetalleTorneo evento={sel} onVolver={() => { setSel(null); cargar(); }} />;

  return (
    <div>
      <Header
        title="Torneos"
        subtitle="Crea el evento, abre inscripciones y administra las categorías"
        action={<button className="fb-btn" onClick={() => setCreando(true)}>+ Nuevo torneo</button>}
      />

      {cargando && <div className="fb-empty">Cargando…</div>}

      {!cargando && eventos.length === 0 && (
        <div className="fb-card fb-pad fb-empty">
          Todavía no hay torneos. Crea el primero para abrir inscripciones.
        </div>
      )}

      <div className="fb-grid-cards">
        {eventos.map((e) => (
          <div key={e.id} className="fb-card fb-pad fb-torneo-card" onClick={() => setSel(e)}>
            <div className="fb-torneo-top">
              <span className={`fb-chip ${e.inscripciones_abiertas ? "ok" : ""}`}>
                {e.inscripciones_abiertas ? "Inscripciones abiertas" : "Inscripciones cerradas"}
              </span>
              <span className="fb-hint mono">{e.fecha || "sin fecha"}</span>
            </div>
            <h3 className="fb-torneo-name">{e.nombre}</h3>
            <p className="fb-hint">{e.lugar || "Lugar por definir"}</p>
            {e.url_transmision && <p className="fb-hint mono">▶ transmisión configurada</p>}
          </div>
        ))}
      </div>

      {creando && <ModalTorneo onClose={() => setCreando(false)} onSaved={() => { setCreando(false); cargar(); }} />}
    </div>
  );
}

/* ---------- Formulario de creación / edición del torneo ---------- */
function ModalTorneo({ evento, onClose, onSaved }) {
  const [f, setF] = useState(
    evento || {
      nombre: "", lugar: "", fecha: hoy(), descripcion: "",
      url_transmision: "", fecha_limite_inscripcion: "",
      inscripciones_abiertas: true, estado: "inscripciones_abiertas",
    }
  );
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  async function guardar() {
    if (!f.nombre.trim()) return setErr("El nombre del torneo es obligatorio.");
    setBusy(true); setErr(null);
    try {
      const body = { ...f };
      // Los campos de fecha vacíos deben viajar como null, no como cadena vacía
      ["fecha", "fecha_limite_inscripcion"].forEach((k) => { if (!body[k]) body[k] = null; });
      delete body.id; delete body.creado_en; delete body.actualizado_en; delete body.slug_inscripcion;
      if (evento) await apiPatch("eventos", evento.id, body);
      else await apiPost("eventos", body);
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={evento ? "Editar torneo" : "Nuevo torneo"} onClose={onClose}>
      <Campo label="Nombre del torneo">
        <input className="fb-input" value={f.nombre} onChange={(e) => set("nombre", e.target.value)}
               placeholder="ej. Copa Fractal-Bots 2026" />
      </Campo>
      <div className="fb-row-2">
        <Campo label="Lugar">
          <input className="fb-input" value={f.lugar || ""} onChange={(e) => set("lugar", e.target.value)}
                 placeholder="ej. Plaza Real de Calderón" />
        </Campo>
        <Campo label="Fecha del evento">
          <input className="fb-input" type="date" value={f.fecha || ""} onChange={(e) => set("fecha", e.target.value)} />
        </Campo>
      </div>
      <div className="fb-row-2">
        <Campo label="Cierre de inscripciones">
          <input className="fb-input" type="date" value={f.fecha_limite_inscripcion || ""}
                 onChange={(e) => set("fecha_limite_inscripcion", e.target.value)} />
        </Campo>
        <Campo label="Estado">
          <select className="fb-input" value={f.estado} onChange={(e) => set("estado", e.target.value)}>
            <option value="planificado">Planificado</option>
            <option value="inscripciones_abiertas">Inscripciones abiertas</option>
            <option value="en_curso">En curso</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </Campo>
      </div>
      <Campo label="Enlace de transmisión en vivo (YouTube, Twitch…)">
        <input className="fb-input" value={f.url_transmision || ""} onChange={(e) => set("url_transmision", e.target.value)}
               placeholder="https://youtube.com/live/…" />
      </Campo>
      <Campo label="Descripción o bases del torneo">
        <textarea className="fb-input" rows={3} value={f.descripcion || ""}
                  onChange={(e) => set("descripcion", e.target.value)} />
      </Campo>
      <label className="fb-check">
        <input type="checkbox" checked={!!f.inscripciones_abiertas}
               onChange={(e) => set("inscripciones_abiertas", e.target.checked)} />
        <span>Permitir inscripciones desde el formulario público</span>
      </label>

      {err && <div className="fb-error">{err}</div>}
      <div className="fb-modal-actions">
        <button className="fb-btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="fb-btn" disabled={busy} onClick={guardar}>
          {busy ? "Guardando…" : "Guardar torneo"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Detalle: categorías, enlace público e inscripciones ---------- */
function DetalleTorneo({ evento, onVolver }) {
  const [ev, setEv] = useState(evento);
  const [cats, setCats] = useState([]);
  const [tab, setTab] = useState("categorias");
  const [editCat, setEditCat] = useState(null);
  const [editEv, setEditEv] = useState(false);

  const cargar = useCallback(async () => {
    const [e, c] = await Promise.all([
      apiGet(`eventos?id=eq.${evento.id}&select=*`),
      apiGet(`categorias?evento_id=eq.${evento.id}&select=*&order=nombre.asc`),
    ]);
    if (e?.[0]) setEv(e[0]);
    setCats(c || []);
  }, [evento.id]);

  useEffect(() => { cargar(); }, [cargar]);

  const urlPublica = `${window.location.origin}${window.location.pathname}?torneo=${ev.slug_inscripcion}`;

  return (
    <div>
      <Header
        title={ev.nombre}
        subtitle={`${ev.lugar || "Sin lugar"} · ${ev.fecha || "sin fecha"}`}
        action={
          <div className="fb-actions">
            <button className="fb-btn-ghost" onClick={onVolver}>← Torneos</button>
            <button className="fb-btn-ghost" onClick={() => setEditEv(true)}>Editar</button>
          </div>
        }
      />

      {/* Enlace público para difundir */}
      <div className="fb-card fb-pad fb-link-box">
        <div>
          <div className="fb-label">Enlace público de inscripción</div>
          <div className="fb-hint">
            Compártelo por WhatsApp o redes. Quien lo abra puede inscribir su equipo sin necesidad de cuenta.
          </div>
          <code className="fb-code-inline">{urlPublica}</code>
        </div>
        <div className="fb-actions">
          <button className="fb-btn-ghost" onClick={() => { navigator.clipboard.writeText(urlPublica); alert("Enlace copiado"); }}>
            Copiar
          </button>
          <a className="fb-btn-ghost" href={urlPublica} target="_blank" rel="noopener">Abrir</a>
        </div>
      </div>

      {!ev.inscripciones_abiertas && (
        <div className="fb-warn">
          Las inscripciones están cerradas: el formulario público mostrará un aviso y no aceptará registros.
        </div>
      )}

      <div className="fb-cat-tabs">
        <button className={`fb-cat-tab ${tab === "categorias" ? "active" : ""}`} onClick={() => setTab("categorias")}>
          Categorías <span className="fb-cat-medicion">{cats.length}</span>
        </button>
        <button className={`fb-cat-tab ${tab === "inscripciones" ? "active" : ""}`} onClick={() => setTab("inscripciones")}>
          Inscripciones
        </button>
        <button className={`fb-cat-tab ${tab === "checkin" ? "active" : ""}`} onClick={() => setTab("checkin")}>
          Check-in técnico
        </button>
      </div>

      {tab === "categorias" && (
        <>
          <div className="fb-actions fb-mb">
            <button className="fb-btn" onClick={() => setEditCat({ evento_id: ev.id })}>+ Nueva categoría</button>
          </div>
          {cats.length === 0 && (
            <div className="fb-card fb-pad fb-empty">
              Sin categorías. Crea al menos una (Mini Sumo, Seguidor de línea, Laberinto…) para que el público pueda inscribirse.
            </div>
          )}
          <div className="fb-grid-cards">
            {cats.map((c) => (
              <div key={c.id} className="fb-card fb-pad fb-torneo-card" onClick={() => setEditCat(c)}>
                <div className="fb-torneo-top">
                  <span className="fb-chip">{MODALIDADES.find((m) => m.v === c.modalidad)?.t || c.modalidad}</span>
                  {!c.activo && <span className="fb-chip">inactiva</span>}
                </div>
                <h3 className="fb-torneo-name">{c.nombre}</h3>
                <p className="fb-hint">
                  {FORMATOS.find((f) => f.v === c.formato)?.t || c.formato}
                  {c.cupo_maximo ? ` · cupo ${c.cupo_maximo}` : ""}
                </p>
                <p className="fb-hint mono">
                  {c.peso_max_g ? `≤${c.peso_max_g} g` : ""}
                  {c.largo_max_mm ? ` · ≤${c.largo_max_mm}×${c.ancho_max_mm || "?"} mm` : ""}
                  {c.voltaje_max_v ? ` · ≤${c.voltaje_max_v} V` : ""}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "inscripciones" && <Aprobaciones eventoId={ev.id} categorias={cats} />}
      {tab === "checkin" && <CheckIn eventoId={ev.id} categorias={cats} />}

      {editCat && (
        <ModalCategoria categoria={editCat} onClose={() => setEditCat(null)}
                        onSaved={() => { setEditCat(null); cargar(); }} />
      )}
      {editEv && (
        <ModalTorneo evento={ev} onClose={() => setEditEv(false)}
                     onSaved={() => { setEditEv(false); cargar(); }} />
      )}
    </div>
  );
}

/* ---------- Categoría con límites técnicos del reglamento ---------- */
function ModalCategoria({ categoria, onClose, onSaved }) {
  const nueva = !categoria.id;
  const [f, setF] = useState({
    evento_id: categoria.evento_id,
    nombre: categoria.nombre || "",
    modalidad: categoria.modalidad || "minisumo",
    medicion: categoria.medicion || "puntos",
    formato: categoria.formato || "doble_eliminacion",
    rondas_por_combate: categoria.rondas_por_combate ?? 3,
    intentos_max: categoria.intentos_max ?? 3,
    cupo_maximo: categoria.cupo_maximo ?? "",
    peso_max_g: categoria.peso_max_g ?? "",
    largo_max_mm: categoria.largo_max_mm ?? "",
    ancho_max_mm: categoria.ancho_max_mm ?? "",
    alto_max_mm: categoria.alto_max_mm ?? "",
    voltaje_max_v: categoria.voltaje_max_v ?? "",
    reglamento: categoria.reglamento || "",
    activo: categoria.activo ?? true,
  });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  /* Al cambiar de modalidad se sugieren los límites habituales,
     solo si el campo está vacío: nunca pisa lo que el usuario escribió. */
  function cambiarModalidad(v) {
    const s = LIMITES_SUGERIDOS[v] || {};
    setF((p) => {
      const n = { ...p, modalidad: v };
      Object.entries(s).forEach(([k, val]) => {
        if ((p[k] === "" || p[k] == null) && val != null) n[k] = val;
      });
      if (v === "seguidor_linea" || v === "laberinto") {
        n.medicion = "tiempo"; n.formato = "por_tiempo";
      }
      if (v === "minisumo") { n.medicion = "puntos"; n.formato = "doble_eliminacion"; }
      return n;
    });
  }

  async function guardar() {
    if (!f.nombre.trim()) return setErr("Ponle un nombre a la categoría.");
    setBusy(true); setErr(null);
    try {
      const body = { ...f };
      // Los numéricos vacíos van como null para no romper el tipo en Postgres
      ["cupo_maximo", "peso_max_g", "largo_max_mm", "ancho_max_mm", "alto_max_mm", "voltaje_max_v"]
        .forEach((k) => { body[k] = body[k] === "" ? null : Number(body[k]); });
      if (nueva) await apiPost("categorias", body);
      else await apiPatch("categorias", categoria.id, body);
      onSaved();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  const fmtSel = FORMATOS.find((x) => x.v === f.formato);

  return (
    <Modal title={nueva ? "Nueva categoría" : "Editar categoría"} onClose={onClose} ancho={760}>
      <div className="fb-row-2">
        <Campo label="Nombre visible">
          <input className="fb-input" value={f.nombre} onChange={(e) => set("nombre", e.target.value)}
                 placeholder="ej. Mini Sumo 500 g" />
        </Campo>
        <Campo label="Modalidad">
          <select className="fb-input" value={f.modalidad} onChange={(e) => cambiarModalidad(e.target.value)}>
            {MODALIDADES.map((m) => <option key={m.v} value={m.v}>{m.t}</option>)}
          </select>
        </Campo>
      </div>

      <Campo label="Formato de competencia">
        <select className="fb-input" value={f.formato} onChange={(e) => set("formato", e.target.value)}>
          {FORMATOS.map((x) => <option key={x.v} value={x.v}>{x.t}</option>)}
        </select>
        {fmtSel && <div className="fb-hint">{fmtSel.d}</div>}
      </Campo>

      <div className="fb-row-3">
        <Campo label="Se mide por">
          <select className="fb-input" value={f.medicion} onChange={(e) => set("medicion", e.target.value)}>
            <option value="tiempo">Tiempo</option>
            <option value="puntos">Puntos</option>
          </select>
        </Campo>
        <Campo label="Rounds por combate">
          <select className="fb-input" value={f.rondas_por_combate}
                  onChange={(e) => set("rondas_por_combate", Number(e.target.value))}>
            {[1, 3, 5, 7].map((n) => <option key={n} value={n}>Al mejor de {n}</option>)}
          </select>
        </Campo>
        <Campo label="Cupo máximo">
          <input className="fb-input" type="number" min="0" value={f.cupo_maximo}
                 onChange={(e) => set("cupo_maximo", e.target.value)} placeholder="sin límite" />
        </Campo>
      </div>

      <div className="fb-sep">Límites del reglamento (se verifican en el check-in)</div>
      <div className="fb-row-3">
        <Campo label="Peso máximo (g)">
          <input className="fb-input" type="number" value={f.peso_max_g} onChange={(e) => set("peso_max_g", e.target.value)} />
        </Campo>
        <Campo label="Largo máximo (mm)">
          <input className="fb-input" type="number" value={f.largo_max_mm} onChange={(e) => set("largo_max_mm", e.target.value)} />
        </Campo>
        <Campo label="Ancho máximo (mm)">
          <input className="fb-input" type="number" value={f.ancho_max_mm} onChange={(e) => set("ancho_max_mm", e.target.value)} />
        </Campo>
      </div>
      <div className="fb-row-2">
        <Campo label="Alto máximo (mm)">
          <input className="fb-input" type="number" value={f.alto_max_mm} onChange={(e) => set("alto_max_mm", e.target.value)}
                 placeholder="opcional" />
        </Campo>
        <Campo label="Voltaje máximo de batería (V)">
          <input className="fb-input" type="number" step="0.1" value={f.voltaje_max_v}
                 onChange={(e) => set("voltaje_max_v", e.target.value)} />
        </Campo>
      </div>

      <Campo label="Notas del reglamento">
        <textarea className="fb-input" rows={2} value={f.reglamento} onChange={(e) => set("reglamento", e.target.value)}
                  placeholder="ej. Prohibidos elementos cortantes. Autonomía obligatoria." />
      </Campo>

      <label className="fb-check">
        <input type="checkbox" checked={!!f.activo} onChange={(e) => set("activo", e.target.checked)} />
        <span>Categoría activa y visible en el formulario público</span>
      </label>

      {err && <div className="fb-error">{err}</div>}
      <div className="fb-modal-actions">
        <button className="fb-btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="fb-btn" disabled={busy} onClick={guardar}>{busy ? "Guardando…" : "Guardar"}</button>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   2 · FORMULARIO PÚBLICO DE INSCRIPCIÓN
   Se abre con ?torneo=<slug>. No requiere sesión.
   ════════════════════════════════════════════════════════════════ */
export function InscripcionPublica({ slug }) {
  const [ev, setEv] = useState(undefined);
  const [cats, setCats] = useState([]);
  const [f, setF] = useState({
    nombre: "", institucion: "", responsable: "", correo: "", telefono: "",
    categoria_id: "", nombre_robot: "", integrantes: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    apiGet(`eventos?slug_inscripcion=eq.${slug}&select=*`)
      .then((r) => {
        const e = r?.[0] || null;
        setEv(e);
        if (e) {
          apiGet(`categorias?evento_id=eq.${e.id}&activo=eq.true&select=*&order=nombre.asc`)
            .then((c) => setCats(c || []));
        }
      })
      .catch(() => setEv(null));
  }, [slug]);

  const cat = cats.find((c) => c.id === f.categoria_id);
  const cerrado = ev && (!ev.inscripciones_abiertas ||
    (ev.fecha_limite_inscripcion && ev.fecha_limite_inscripcion < hoy()));

  async function enviar() {
    if (!f.nombre.trim()) return setErr("Escribe el nombre del equipo.");
    if (!f.categoria_id) return setErr("Elige una categoría.");
    if (!f.responsable.trim()) return setErr("Indica quién es el responsable del equipo.");
    setBusy(true); setErr(null);
    try {
      // El equipo se crea primero; se pide la fila de vuelta para conocer su id.
      const eq = await apiPost("equipos", {
        nombre: f.nombre.trim(), institucion: f.institucion.trim() || null,
        responsable: f.responsable.trim(), correo: f.correo.trim() || null,
        telefono: f.telefono.trim() || null,
      });
      const equipoId = Array.isArray(eq) ? eq[0]?.id : eq?.id;
      if (!equipoId) throw new Error("No se pudo registrar el equipo.");

      // La inscripción se manda sin pedir respuesta: el anónimo no necesita
      // permiso de lectura sobre la tabla para inscribirse.
      await apiInsertMinimal("inscripciones_torneo", {
        equipo_id: equipoId,
        categoria_id: f.categoria_id,
        nombre_robot: f.nombre_robot.trim() || null,
        datos: { integrantes: f.integrantes.trim() || null },
      });
      setEnviado(true);
    } catch (e) {
      setErr("No se pudo completar la inscripción: " + e.message);
    } finally { setBusy(false); }
  }

  if (ev === undefined) return <PantallaPublica><div className="fb-empty">Cargando…</div></PantallaPublica>;
  if (ev === null) return (
    <PantallaPublica>
      <h2 className="fb-pub-title">Torneo no encontrado</h2>
      <p className="fb-hint">El enlace no es válido o el torneo fue retirado.</p>
    </PantallaPublica>
  );

  if (enviado) return (
    <PantallaPublica>
      <div className="fb-ok-mark">✓</div>
      <h2 className="fb-pub-title">Inscripción enviada</h2>
      <p className="fb-hint">
        Recibimos el registro de <b>{f.nombre}</b> en {cat?.nombre}. Queda <b>pendiente de revisión</b>:
        el equipo organizador validará los datos y te confirmará por correo o WhatsApp.
      </p>
      <p className="fb-hint">
        Recuerda que el día del evento hay <b>inspección técnica</b>: se mide peso, dimensiones y voltaje
        de la batería antes de competir.
      </p>
      <button className="fb-btn" onClick={() => { setEnviado(false); setF({ ...f, nombre: "", nombre_robot: "", integrantes: "" }); }}>
        Inscribir otro equipo
      </button>
    </PantallaPublica>
  );

  return (
    <PantallaPublica>
      <div className="fb-pub-eyebrow">Inscripción de equipos</div>
      <h2 className="fb-pub-title">{ev.nombre}</h2>
      <p className="fb-hint">
        {ev.lugar ? `${ev.lugar} · ` : ""}{ev.fecha || ""}
        {ev.fecha_limite_inscripcion ? ` · cierre de inscripciones: ${ev.fecha_limite_inscripcion}` : ""}
      </p>
      {ev.descripcion && <p className="fb-pub-desc">{ev.descripcion}</p>}

      {cerrado ? (
        <div className="fb-warn">
          Las inscripciones para este torneo están cerradas. Escríbenos si necesitas más información.
        </div>
      ) : cats.length === 0 ? (
        <div className="fb-warn">Todavía no hay categorías publicadas. Vuelve a intentarlo más tarde.</div>
      ) : (
        <>
          <Campo label="Categoría en la que compite">
            <select className="fb-input" value={f.categoria_id} onChange={(e) => set("categoria_id", e.target.value)}>
              <option value="">— elegir categoría —</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </Campo>

          {cat && (cat.peso_max_g || cat.largo_max_mm || cat.voltaje_max_v) && (
            <div className="fb-reglas">
              <div className="fb-label">Requisitos técnicos de esta categoría</div>
              <ul>
                {cat.peso_max_g && <li>Peso máximo: <b>{cat.peso_max_g} g</b></li>}
                {cat.largo_max_mm && <li>Dimensiones máximas: <b>{cat.largo_max_mm} × {cat.ancho_max_mm || "?"} mm</b>
                  {cat.alto_max_mm ? <> (alto ≤ {cat.alto_max_mm} mm)</> : null}</li>}
                {cat.voltaje_max_v && <li>Voltaje máximo de batería: <b>{cat.voltaje_max_v} V</b></li>}
              </ul>
              {cat.reglamento && <p className="fb-hint">{cat.reglamento}</p>}
              <p className="fb-hint">Se verifica el día del evento. Un robot fuera de norma no puede competir.</p>
            </div>
          )}

          <div className="fb-row-2">
            <Campo label="Nombre del equipo *">
              <input className="fb-input" value={f.nombre} onChange={(e) => set("nombre", e.target.value)} />
            </Campo>
            <Campo label="Nombre del robot">
              <input className="fb-input" value={f.nombre_robot} onChange={(e) => set("nombre_robot", e.target.value)} />
            </Campo>
          </div>
          <Campo label="Institución o club">
            <input className="fb-input" value={f.institucion} onChange={(e) => set("institucion", e.target.value)} />
          </Campo>
          <Campo label="Responsable del equipo *">
            <input className="fb-input" value={f.responsable} onChange={(e) => set("responsable", e.target.value)}
                   placeholder="Nombre de quien coordina" />
          </Campo>
          <div className="fb-row-2">
            <Campo label="Correo de contacto">
              <input className="fb-input" type="email" value={f.correo} onChange={(e) => set("correo", e.target.value)} />
            </Campo>
            <Campo label="Teléfono / WhatsApp">
              <input className="fb-input" value={f.telefono} onChange={(e) => set("telefono", e.target.value)} />
            </Campo>
          </div>
          <Campo label="Integrantes">
            <textarea className="fb-input" rows={2} value={f.integrantes}
                      onChange={(e) => set("integrantes", e.target.value)}
                      placeholder="Un nombre por línea" />
          </Campo>

          {err && <div className="fb-error">{err}</div>}
          <button className="fb-btn fb-btn-block" disabled={busy} onClick={enviar}>
            {busy ? "Enviando…" : "Enviar inscripción"}
          </button>
          <p className="fb-hint">La inscripción queda pendiente hasta que la organización la apruebe.</p>
        </>
      )}
    </PantallaPublica>
  );
}

/* ════════════════════════════════════════════════════════════════
   3 · APROBACIÓN DE INSCRIPCIONES
   ════════════════════════════════════════════════════════════════ */
function Aprobaciones({ eventoId, categorias }) {
  const [items, setItems] = useState([]);
  const [filtro, setFiltro] = useState("pendiente");
  const [cargando, setCargando] = useState(true);
  const [detalle, setDetalle] = useState(null);

  const catIds = categorias.map((c) => c.id);

  const cargar = useCallback(async () => {
    if (catIds.length === 0) { setItems([]); setCargando(false); return; }
    setCargando(true);
    try {
      const r = await apiGet(
        `inscripciones_torneo?categoria_id=in.(${catIds.join(",")})` +
        `&select=*,equipos(id,nombre,institucion,responsable,correo,telefono),categorias(id,nombre,cupo_maximo)` +
        `&order=creado_en.desc`
      );
      setItems(r || []);
    } finally { setCargando(false); }
  }, [catIds.join(",")]);

  useEffect(() => { cargar(); }, [cargar]);

  async function cambiarEstado(id, estado) {
    try {
      await apiPatch("inscripciones_torneo", id, { estado, revisado_en: new Date().toISOString() });
      cargar();
    } catch (e) { alert("No se pudo actualizar: " + e.message); }
  }

  const mostrar = items.filter((i) => filtro === "todas" || i.estado === filtro);
  const cuenta = (e) => items.filter((i) => i.estado === e).length;

  return (
    <div>
      <div className="fb-cat-tabs">
        {[["pendiente", "Pendientes"], ["aprobada", "Aprobadas"], ["rechazada", "Rechazadas"], ["todas", "Todas"]].map(([v, t]) => (
          <button key={v} className={`fb-cat-tab ${filtro === v ? "active" : ""}`} onClick={() => setFiltro(v)}>
            {t} <span className="fb-cat-medicion">{v === "todas" ? items.length : cuenta(v)}</span>
          </button>
        ))}
      </div>

      {cargando && <div className="fb-empty">Cargando…</div>}
      {!cargando && mostrar.length === 0 && (
        <div className="fb-card fb-pad fb-empty">
          {filtro === "pendiente" ? "No hay inscripciones pendientes de revisar." : "Sin registros en este filtro."}
        </div>
      )}

      <div className="fb-card">
        {mostrar.map((i) => (
          <div key={i.id} className="fb-insc-row">
            <div className="fb-insc-main" onClick={() => setDetalle(i)}>
              <div className="fb-insc-name">
                {i.equipos?.nombre || "—"}
                {i.nombre_robot && <span className="fb-insc-robot"> · {i.nombre_robot}</span>}
              </div>
              <div className="fb-hint">
                {i.categorias?.nombre} · {i.equipos?.institucion || "sin institución"} · {i.equipos?.responsable || ""}
              </div>
            </div>
            <EstadoChip estado={i.estado} />
            {i.estado === "pendiente" ? (
              <div className="fb-actions">
                <button className="fb-btn-mini ok" onClick={() => cambiarEstado(i.id, "aprobada")}>Aprobar</button>
                <button className="fb-btn-mini no" onClick={() => cambiarEstado(i.id, "rechazada")}>Rechazar</button>
              </div>
            ) : (
              <button className="fb-btn-mini" onClick={() => cambiarEstado(i.id, "pendiente")}>Revertir</button>
            )}
          </div>
        ))}
      </div>

      {detalle && <ModalDetalleInscripcion item={detalle} onClose={() => setDetalle(null)}
                                           onGuardado={() => { setDetalle(null); cargar(); }} />}
    </div>
  );
}

function ModalDetalleInscripcion({ item, onClose, onGuardado }) {
  const [obs, setObs] = useState(item.observaciones || "");
  const eq = item.equipos || {};
  const integrantes = item.datos?.integrantes;

  async function guardar() {
    try { await apiPatch("inscripciones_torneo", item.id, { observaciones: obs }); onGuardado(); }
    catch (e) { alert(e.message); }
  }

  return (
    <Modal title={eq.nombre || "Inscripción"} onClose={onClose}>
      <Dato k="Categoría" v={item.categorias?.nombre} />
      <Dato k="Robot" v={item.nombre_robot} />
      <Dato k="Institución" v={eq.institucion} />
      <Dato k="Responsable" v={eq.responsable} />
      <Dato k="Correo" v={eq.correo} />
      <Dato k="Teléfono" v={eq.telefono} />
      {integrantes && <Dato k="Integrantes" v={integrantes} />}
      <Dato k="Estado" v={item.estado} />
      <Campo label="Observaciones internas">
        <textarea className="fb-input" rows={3} value={obs} onChange={(e) => setObs(e.target.value)} />
      </Campo>
      <div className="fb-modal-actions">
        <button className="fb-btn-ghost" onClick={onClose}>Cerrar</button>
        <button className="fb-btn" onClick={guardar}>Guardar nota</button>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════
   4 · CHECK-IN TÉCNICO
   Se mide el robot y se compara con los límites de la categoría.
   ════════════════════════════════════════════════════════════════ */
function CheckIn({ categorias }) {
  const [catId, setCatId] = useState(categorias[0]?.id || "");
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [medir, setMedir] = useState(null);

  useEffect(() => { if (!catId && categorias[0]) setCatId(categorias[0].id); }, [categorias, catId]);

  const cargar = useCallback(async () => {
    if (!catId) return;
    setCargando(true);
    try {
      // Solo tiene sentido inspeccionar a quien ya fue aprobado administrativamente
      const r = await apiGet(
        `inscripciones_torneo?categoria_id=eq.${catId}&estado=eq.aprobada` +
        `&select=*,equipos(nombre,institucion)&order=creado_en.asc`
      );
      setItems(r || []);
    } finally { setCargando(false); }
  }, [catId]);

  useEffect(() => { cargar(); }, [cargar]);

  const cat = categorias.find((c) => c.id === catId);

  if (categorias.length === 0)
    return <div className="fb-card fb-pad fb-empty">Crea primero una categoría.</div>;

  const pendientes = items.filter((i) => i.inspeccion === "pendiente").length;
  const aprobados = items.filter((i) => i.inspeccion === "aprobado").length;

  return (
    <div>
      <div className="fb-cat-tabs">
        {categorias.map((c) => (
          <button key={c.id} className={`fb-cat-tab ${c.id === catId ? "active" : ""}`} onClick={() => setCatId(c.id)}>
            {c.nombre}
          </button>
        ))}
      </div>

      {cat && (
        <div className="fb-card fb-pad fb-limites">
          <div className="fb-label">Límites de {cat.nombre}</div>
          <div className="fb-limites-row mono">
            <span>Peso ≤ {cat.peso_max_g ?? "—"} g</span>
            <span>Largo ≤ {cat.largo_max_mm ?? "—"} mm</span>
            <span>Ancho ≤ {cat.ancho_max_mm ?? "—"} mm</span>
            {cat.alto_max_mm && <span>Alto ≤ {cat.alto_max_mm} mm</span>}
            <span>Batería ≤ {cat.voltaje_max_v ?? "—"} V</span>
          </div>
          <div className="fb-hint">
            {aprobados} de {items.length} robots aprobados · {pendientes} sin inspeccionar
          </div>
        </div>
      )}

      {cargando && <div className="fb-empty">Cargando…</div>}
      {!cargando && items.length === 0 && (
        <div className="fb-card fb-pad fb-empty">
          No hay equipos aprobados en esta categoría. Apruébalos primero en la pestaña de inscripciones.
        </div>
      )}

      <div className="fb-card">
        {items.map((i) => (
          <div key={i.id} className="fb-insc-row">
            <div className="fb-insc-main">
              <div className="fb-insc-name">
                {i.equipos?.nombre}
                {i.nombre_robot && <span className="fb-insc-robot"> · {i.nombre_robot}</span>}
              </div>
              <div className="fb-hint mono">
                {i.inspeccion === "pendiente" ? "sin medir" :
                  `${i.peso_g ?? "?"} g · ${i.largo_mm ?? "?"}×${i.ancho_mm ?? "?"} mm · ${i.voltaje_v ?? "?"} V`}
              </div>
            </div>
            <InspeccionChip valor={i.inspeccion} />
            <button className="fb-btn-mini" onClick={() => setMedir(i)}>
              {i.inspeccion === "pendiente" ? "Medir" : "Revisar"}
            </button>
          </div>
        ))}
      </div>

      {medir && (
        <ModalCheckIn item={medir} cat={cat} onClose={() => setMedir(null)}
                      onGuardado={() => { setMedir(null); cargar(); }} />
      )}
    </div>
  );
}

function ModalCheckIn({ item, cat, onClose, onGuardado }) {
  const [f, setF] = useState({
    peso_g: item.peso_g ?? "", largo_mm: item.largo_mm ?? "", ancho_mm: item.ancho_mm ?? "",
    alto_mm: item.alto_mm ?? "", voltaje_v: item.voltaje_v ?? "", inspeccion_notas: item.inspeccion_notas || "",
  });
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  /* Verificación en vivo: cada medida se compara con su límite.
     El sistema avisa, pero la decisión final es del juez: puede
     aprobar con observación o rechazar aunque cumpla. */
  const chequeos = [
    { k: "peso_g", lim: cat?.peso_max_g, label: "Peso", u: "g" },
    { k: "largo_mm", lim: cat?.largo_max_mm, label: "Largo", u: "mm" },
    { k: "ancho_mm", lim: cat?.ancho_max_mm, label: "Ancho", u: "mm" },
    { k: "alto_mm", lim: cat?.alto_max_mm, label: "Alto", u: "mm" },
    { k: "voltaje_v", lim: cat?.voltaje_max_v, label: "Voltaje", u: "V" },
  ].map((c) => {
    const val = f[c.k] === "" ? null : Number(f[c.k]);
    const excede = c.lim != null && val != null && val > Number(c.lim);
    return { ...c, val, excede, medido: val != null };
  });

  const algunoExcede = chequeos.some((c) => c.excede);
  const faltanMedidas = chequeos.filter((c) => c.lim != null && !c.medido);

  async function registrar(resultado) {
    setBusy(true); setErr(null);
    try {
      const body = { inspeccion: resultado, inspeccion_notas: f.inspeccion_notas || null,
                     inspeccion_en: new Date().toISOString() };
      ["peso_g", "largo_mm", "ancho_mm", "alto_mm", "voltaje_v"].forEach((k) => {
        body[k] = f[k] === "" ? null : Number(f[k]);
      });
      await apiPatch("inscripciones_torneo", item.id, body);
      onGuardado();
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <Modal title={`Check-in · ${item.equipos?.nombre || ""}`} onClose={onClose} ancho={620}>
      <p className="fb-hint">
        Mide el robot y registra los valores. El sistema compara con el reglamento de {cat?.nombre}.
      </p>

      <div className="fb-row-3">
        <MedidaCampo c={chequeos[0]} onChange={(v) => set("peso_g", v)} />
        <MedidaCampo c={chequeos[1]} onChange={(v) => set("largo_mm", v)} />
        <MedidaCampo c={chequeos[2]} onChange={(v) => set("ancho_mm", v)} />
      </div>
      <div className="fb-row-2">
        <MedidaCampo c={chequeos[3]} onChange={(v) => set("alto_mm", v)} />
        <MedidaCampo c={chequeos[4]} onChange={(v) => set("voltaje_v", v)} step="0.1" />
      </div>

      {algunoExcede && (
        <div className="fb-error">
          Fuera de norma: {chequeos.filter((c) => c.excede).map((c) => `${c.label} ${c.val}${c.u} > ${c.lim}${c.u}`).join(" · ")}
        </div>
      )}
      {!algunoExcede && faltanMedidas.length > 0 && (
        <div className="fb-warn">Faltan medidas: {faltanMedidas.map((c) => c.label).join(", ")}</div>
      )}
      {!algunoExcede && faltanMedidas.length === 0 && (
        <div className="fb-ok">Todas las medidas están dentro del reglamento.</div>
      )}

      <Campo label="Observaciones del juez">
        <textarea className="fb-input" rows={2} value={f.inspeccion_notas}
                  onChange={(e) => set("inspeccion_notas", e.target.value)}
                  placeholder="ej. batería reemplazada antes de la medición" />
      </Campo>

      {err && <div className="fb-error">{err}</div>}
      <div className="fb-modal-actions">
        <button className="fb-btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="fb-btn-mini no" disabled={busy} onClick={() => registrar("rechazado")}>Rechazar</button>
        <button className="fb-btn" disabled={busy} onClick={() => registrar("aprobado")}>
          Aprobar para competir
        </button>
      </div>
      {algunoExcede && (
        <p className="fb-hint">
          Puedes aprobar igualmente si el reglamento del evento lo permite; queda constancia en las observaciones.
        </p>
      )}
    </Modal>
  );
}

function MedidaCampo({ c, onChange, step = "1" }) {
  return (
    <Campo label={`${c.label}${c.lim != null ? ` (≤ ${c.lim} ${c.u})` : ` (${c.u})`}`}>
      <input
        className={`fb-input ${c.excede ? "fb-input-error" : c.medido && c.lim != null ? "fb-input-ok" : ""}`}
        type="number" step={step} value={c.val ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={c.lim != null ? `máx. ${c.lim}` : "—"}
      />
    </Campo>
  );
}

/* ════════════════════════════════════════════════════════════════
   Piezas compartidas
   ════════════════════════════════════════════════════════════════ */
function Header({ title, subtitle, action }) {
  return (
    <div className="fb-header">
      <div>
        <h2 className="fb-title">{title}</h2>
        {subtitle && <p className="fb-sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div className="fb-field">
      <label className="fb-label">{label}</label>
      {children}
    </div>
  );
}

function Dato({ k, v }) {
  if (!v) return null;
  return <div className="fb-dato"><span className="fb-label">{k}</span><span>{v}</span></div>;
}

function Modal({ title, children, onClose, ancho = 540 }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fb-modal-bg" onClick={onClose}>
      <div className="fb-modal" style={{ maxWidth: ancho }} onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-head">
          <h3>{title}</h3>
          <button className="fb-modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="fb-modal-body">{children}</div>
      </div>
    </div>
  );
}

function PantallaPublica({ children }) {
  return (
    <div className="fb-pub-bg">
      <div className="fb-pub-card">{children}</div>
    </div>
  );
}

function EstadoChip({ estado }) {
  const m = { pendiente: "", aprobada: "ok", rechazada: "no", retirada: "" };
  return <span className={`fb-chip ${m[estado] || ""}`}>{estado}</span>;
}

function InspeccionChip({ valor }) {
  const m = { pendiente: "", aprobado: "ok", rechazado: "no" };
  const t = { pendiente: "sin inspeccionar", aprobado: "apto", rechazado: "no apto" };
  return <span className={`fb-chip ${m[valor] || ""}`}>{t[valor] || valor}</span>;
}
