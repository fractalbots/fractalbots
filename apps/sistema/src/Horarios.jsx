import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

/* ============================================================
   Horarios · planificación semanal de clases
   El administrador arma aquí la malla que después consumen las
   vistas vw_mi_horario del portal de docentes y estudiantes.
   ============================================================ */

const DIAS = [
  { n: 1, corto: "Lun", largo: "Lunes" },
  { n: 2, corto: "Mar", largo: "Martes" },
  { n: 3, corto: "Mié", largo: "Miércoles" },
  { n: 4, corto: "Jue", largo: "Jueves" },
  { n: 5, corto: "Vie", largo: "Viernes" },
  { n: 6, corto: "Sáb", largo: "Sábado" },
  { n: 7, corto: "Dom", largo: "Domingo" },
];

const MODALIDADES = ["presencial", "virtual", "hibrida"];

const MOD_COLOR = {
  presencial: "#43B02A",
  virtual: "#1E9AD7",
  hibrida: "#5E2D8E",
};

const hhmm = (t) => (t ? String(t).slice(0, 5) : "");
const aMin = (t) => {
  const [h, m] = hhmm(t).split(":").map(Number);
  return h * 60 + m;
};
const docenteDe = (curso) =>
  curso?.docentes ? `${curso.docentes.nombres} ${curso.docentes.apellidos}` : "Por asignar";

export function Horarios() {
  const [rows, setRows] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [err, setErr] = useState(null);
  const [modal, setModal] = useState(null);
  const [verInactivos, setVerInactivos] = useState(false);

  const load = useCallback(() => {
    setErr(null);
    apiGet(
      "horarios?select=*,cursos(id,nombre,activo,docente_id,docentes(nombres,apellidos))&order=dia_semana.asc,hora_inicio.asc"
    )
      .then(setRows)
      .catch((e) => setErr(e.message));
  }, []);

  useEffect(() => {
    load();
    apiGet("cursos?select=id,nombre,activo,docente_id,docentes(nombres,apellidos)&order=nombre.asc")
      .then(setCursos)
      .catch(() => {});
  }, [load]);

  async function guardar(form) {
    const body = {
      curso_id: form.curso_id,
      dia_semana: Number(form.dia_semana),
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      aula: form.aula || null,
      modalidad: form.modalidad,
      url_clase: form.url_clase || null,
      activo: form.activo,
    };
    try {
      if (modal.row) await apiPatch("horarios", modal.row.id, body);
      else await apiPost("horarios", body);
      setModal(null);
      load();
    } catch (e) {
      // El índice único (curso_id, dia_semana, hora_inicio) evita duplicar
      // la misma clase; traducimos el error de Postgres a algo legible.
      if (String(e.message).includes("horarios_curso_dia_hora_uniq"))
        alert("Ese curso ya tiene una clase registrada ese día a esa misma hora.");
      else alert("No se pudo guardar: " + e.message);
    }
  }

  async function alternarActivo(h) {
    try {
      await apiPatch("horarios", h.id, { activo: !h.activo });
      load();
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  async function eliminar(h) {
    if (!confirm(`¿Eliminar la clase de "${h.cursos?.nombre}" del ${DIAS[h.dia_semana - 1]?.largo}?`)) return;
    try {
      await apiDelete("horarios", h.id);
      load();
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  const visibles = (rows || []).filter((h) => verInactivos || h.activo);
  const diasConDatos = DIAS.filter((d) => d.n <= 6 || visibles.some((h) => h.dia_semana === 7));
  const aulasConocidas = [...new Set((rows || []).map((h) => h.aula).filter(Boolean))].sort();
  const horasSemana = visibles.reduce(
    (acc, h) => acc + Math.max(0, (aMin(h.hora_fin) - aMin(h.hora_inicio)) / 60),
    0
  );

  return (
    <div>
      <HorariosStyles />
      <Header
        title="Horarios"
        subtitle={
          rows
            ? `${visibles.length} clase(s) · ${horasSemana.toFixed(1)} h a la semana`
            : "Cargando…"
        }
        action={
          <div className="fb-actions">
            <label className="fb-check" style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={verInactivos}
                onChange={(e) => setVerInactivos(e.target.checked)}
              />
              Ver inactivos
            </label>
            <button className="fb-btn fb-btn-primary" onClick={() => setModal({ row: null })}>
              + Nueva clase
            </button>
          </div>
        }
      />

      {err && <div className="fb-error">No se pudieron cargar los horarios: {err}</div>}

      {rows === null ? (
        <div className="fb-card fb-pad fb-empty">Cargando…</div>
      ) : visibles.length === 0 ? (
        <div className="fb-card fb-pad fb-empty">
          Todavía no hay clases programadas. Crea la primera con “+ Nueva clase”.
        </div>
      ) : (
        <div className="hr-semana">
          {diasConDatos.map((d) => {
            const clases = visibles
              .filter((h) => h.dia_semana === d.n)
              .sort((a, b) => aMin(a.hora_inicio) - aMin(b.hora_inicio));
            return (
              <div className="hr-col" key={d.n}>
                <div className="hr-dia">
                  {d.largo}
                  <span className="hr-dia-n">{clases.length}</span>
                </div>
                {clases.length === 0 && <div className="hr-libre">Sin clases</div>}
                {clases.map((h) => (
                  <div
                    className={`hr-clase ${h.activo ? "" : "inactiva"}`}
                    key={h.id}
                    style={{ borderLeftColor: MOD_COLOR[h.modalidad] || "#7C889E" }}
                  >
                    <div className="hr-hora">
                      {hhmm(h.hora_inicio)} – {hhmm(h.hora_fin)}
                    </div>
                    <div className="hr-curso">{h.cursos?.nombre || "Curso eliminado"}</div>
                    <div className="hr-meta">{docenteDe(h.cursos)}</div>
                    <div className="hr-meta">
                      {h.aula || "Aula por definir"}
                      <span className="hr-mod" style={{ color: MOD_COLOR[h.modalidad] }}>
                        {" · "}
                        {h.modalidad}
                      </span>
                    </div>
                    {!h.activo && <div className="hr-off">Inactiva</div>}
                    <div className="hr-acc">
                      <button className="fb-btn-mini" onClick={() => setModal({ row: h })}>
                        Editar
                      </button>
                      <button className="fb-btn-mini" onClick={() => alternarActivo(h)}>
                        {h.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button className="fb-btn-mini no" onClick={() => eliminar(h)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <HorarioModal
          row={modal.row}
          cursos={cursos}
          horarios={rows || []}
          aulas={aulasConocidas}
          onClose={() => setModal(null)}
          onSave={guardar}
        />
      )}
    </div>
  );
}

/* ---------- Alta y edición de una clase ---------- */
function HorarioModal({ row, cursos, horarios, aulas, onClose, onSave }) {
  const [form, setForm] = useState({
    curso_id: row?.curso_id || "",
    dia_semana: row?.dia_semana || 1,
    hora_inicio: hhmm(row?.hora_inicio) || "17:00",
    hora_fin: hhmm(row?.hora_fin) || "19:00",
    aula: row?.aula || "",
    modalidad: row?.modalidad || "presencial",
    url_clase: row?.url_clase || "",
    activo: row?.activo ?? true,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const cursoSel = cursos.find((c) => c.id === form.curso_id);

  /* --- Validaciones --- */
  const ini = aMin(form.hora_inicio);
  const fin = aMin(form.hora_fin);
  const rangoMal = !!(form.hora_inicio && form.hora_fin && fin <= ini);

  /* Dos clases chocan si comparten día y sus rangos se solapan. Se compara
     contra las clases activas del mismo día, excluyendo la que se edita. */
  const solapan = (h) =>
    h.activo &&
    h.id !== row?.id &&
    h.dia_semana === Number(form.dia_semana) &&
    ini < aMin(h.hora_fin) &&
    fin > aMin(h.hora_inicio);

  const choqueAula = form.aula
    ? horarios.find((h) => solapan(h) && h.aula === form.aula)
    : null;

  const choqueDocente =
    cursoSel?.docente_id
      ? horarios.find((h) => solapan(h) && h.cursos?.docente_id === cursoSel.docente_id)
      : null;

  const puedeGuardar = form.curso_id && !rangoMal && !choqueAula && !choqueDocente;

  function submit() {
    if (!form.curso_id) return alert("Selecciona un curso.");
    if (rangoMal) return alert("La hora de fin debe ser posterior a la de inicio.");
    onSave(form);
  }

  return (
    <div className="fb-modal-overlay" onClick={onClose}>
      <div className="fb-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fb-modal-head">
          <h3>{row ? "Editar clase" : "Nueva clase"}</h3>
          <button className="fb-x" onClick={onClose}>✕</button>
        </div>

        <div className="fb-modal-body">
          <div className="fb-field">
            <label className="fb-label">Curso <span style={{ color: "#EF5350" }}>*</span></label>
            <select className="fb-input" value={form.curso_id} onChange={(e) => set("curso_id", e.target.value)}>
              <option value="">— seleccionar —</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}{c.activo ? "" : " (inactivo)"}
                </option>
              ))}
            </select>
            {cursoSel && <div className="fb-hint" style={{ margin: "6px 0 0" }}>Docente: {docenteDe(cursoSel)}</div>}
          </div>

          <div className="fb-field">
            <label className="fb-label">Día de la semana</label>
            <div className="hr-dias-pick">
              {DIAS.map((d) => (
                <button
                  key={d.n}
                  type="button"
                  className={`hr-dia-btn ${Number(form.dia_semana) === d.n ? "on" : ""}`}
                  onClick={() => set("dia_semana", d.n)}
                >
                  {d.corto}
                </button>
              ))}
            </div>
          </div>

          <div className="fb-row-2">
            <div className="fb-field">
              <label className="fb-label">Hora de inicio</label>
              <input
                className={`fb-input ${rangoMal ? "fb-input-error" : ""}`}
                type="time"
                value={form.hora_inicio}
                onChange={(e) => set("hora_inicio", e.target.value)}
              />
            </div>
            <div className="fb-field">
              <label className="fb-label">Hora de fin</label>
              <input
                className={`fb-input ${rangoMal ? "fb-input-error" : ""}`}
                type="time"
                value={form.hora_fin}
                onChange={(e) => set("hora_fin", e.target.value)}
              />
            </div>
          </div>

          <div className="fb-row-2">
            <div className="fb-field">
              <label className="fb-label">Aula</label>
              <input
                className="fb-input"
                list="hr-aulas"
                value={form.aula}
                onChange={(e) => set("aula", e.target.value)}
                placeholder="ej. Taller de Robótica"
              />
              <datalist id="hr-aulas">
                {aulas.map((a) => <option key={a} value={a} />)}
              </datalist>
            </div>
            <div className="fb-field">
              <label className="fb-label">Modalidad</label>
              <select className="fb-input" value={form.modalidad} onChange={(e) => set("modalidad", e.target.value)}>
                {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {form.modalidad !== "presencial" && (
            <div className="fb-field">
              <label className="fb-label">Enlace de la clase virtual</label>
              <input
                className="fb-input"
                value={form.url_clase}
                onChange={(e) => set("url_clase", e.target.value)}
                placeholder="https://meet.google.com/…"
              />
            </div>
          )}

          <label className="fb-check">
            <input type="checkbox" checked={form.activo} onChange={(e) => set("activo", e.target.checked)} />
            Clase activa (aparece en el portal de docentes y estudiantes)
          </label>

          {rangoMal && (
            <div className="fb-error">La hora de fin debe ser posterior a la de inicio.</div>
          )}
          {choqueAula && (
            <div className="fb-error">
              El aula “{form.aula}” ya está ocupada ese día de {hhmm(choqueAula.hora_inicio)} a{" "}
              {hhmm(choqueAula.hora_fin)} por {choqueAula.cursos?.nombre}.
            </div>
          )}
          {choqueDocente && !choqueAula && (
            <div className="fb-warn">
              {docenteDe(cursoSel)} ya dicta {choqueDocente.cursos?.nombre} ese día de{" "}
              {hhmm(choqueDocente.hora_inicio)} a {hhmm(choqueDocente.hora_fin)}.
            </div>
          )}
        </div>

        <div className="fb-modal-foot">
          <button className="fb-btn fb-btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="fb-btn fb-btn-primary" onClick={submit} disabled={!puedeGuardar}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Header local (mismo formato que el resto del panel) ---------- */
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

function HorariosStyles() {
  return (
    <style>{`
      .hr-semana { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); align-items:start; }
      .hr-col { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px; }
      .hr-dia { display:flex; justify-content:space-between; align-items:center; font-weight:700; font-size:.78rem;
                letter-spacing:.06em; text-transform:uppercase; color:#5E2D8E; margin-bottom:10px; }
      .hr-dia-n { background:var(--surface2); border:1px solid var(--border); border-radius:99px;
                  padding:1px 7px; font-size:.7rem; color:var(--muted); }
      .hr-libre { font-size:.78rem; color:var(--muted); padding:10px 0; text-align:center; }
      .hr-clase { background:var(--surface2); border-left:3px solid #1E9AD7; border-radius:8px;
                  padding:10px 11px; margin-bottom:9px; }
      .hr-clase.inactiva { opacity:.55; }
      .hr-hora { font-weight:700; font-size:.85rem; color:var(--text); }
      .hr-curso { font-weight:600; font-size:.9rem; margin:3px 0 2px; }
      .hr-meta { font-size:.76rem; color:var(--muted); }
      .hr-mod { font-weight:600; text-transform:capitalize; }
      .hr-off { display:inline-block; margin-top:5px; font-size:.68rem; font-weight:700;
                text-transform:uppercase; letter-spacing:.06em; color:#96500D; }
      .hr-acc { display:flex; gap:5px; flex-wrap:wrap; margin-top:9px; }
      .hr-acc .fb-btn-mini { padding:4px 9px; font-size:.7rem; }
      .hr-dias-pick { display:flex; gap:6px; flex-wrap:wrap; }
      .hr-dia-btn { padding:8px 13px; border-radius:8px; border:1px solid var(--border);
                    background:var(--surface); color:var(--muted); font-family:inherit;
                    font-size:.82rem; font-weight:600; cursor:pointer; transition:.15s; }
      .hr-dia-btn:hover { border-color:#1E9AD7; color:#1E9AD7; }
      .hr-dia-btn.on { background:rgba(94,45,142,.08); border-color:#5E2D8E; color:#5E2D8E; }
    `}</style>
  );
}
