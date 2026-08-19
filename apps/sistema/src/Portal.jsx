import { useState, useEffect } from "react";
import { apiGet } from "./api";

/* ============================================================
   Portal · vista personal para estudiantes y docentes
   Consume las tres vistas con security_invoker=on, de modo que
   el filtrado por persona lo resuelve el RLS en la base y no el
   cliente: la consulta es "select *" y Postgres devuelve solo
   las filas que le corresponden a quien tiene la sesión abierta.
   ============================================================ */

const DIAS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

const hhmm = (t) => (t ? String(t).slice(0, 5) : "—");

const fmtFecha = (f) =>
  f ? new Date(f).toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" }) : "—";

const ESTADO_COLOR = {
  activa: "#1E9AD7",
  completada: "#43B02A",
  retirada: "#7C889E",
  reprobada: "#EF5350",
};

export function Portal({ session, onCertificado }) {
  const [cursos, setCursos] = useState(null);
  const [horario, setHorario] = useState(null);
  const [certs, setCerts] = useState(null);
  const [err, setErr] = useState(null);

  const esDocente = session?.rol === "docente";

  useEffect(() => {
    apiGet("vw_mis_cursos?select=*&order=fecha_inicio.desc")
      .then(setCursos)
      .catch((e) => setErr(e.message));
    apiGet("vw_mi_horario?select=*&order=dia_semana.asc,hora_inicio.asc")
      .then(setHorario)
      .catch(() => setHorario([]));
    apiGet("vw_mis_certificados?select=*&order=fecha_emision.desc")
      .then(setCerts)
      .catch(() => setCerts([]));
  }, []);

  /* --- Resumen --- */
  const activos = (cursos || []).filter((c) => c.mi_estado_inscripcion === "activa" || esDocente).length;
  const completados = (cursos || []).filter((c) => c.mi_estado_inscripcion === "completada").length;
  const notas = (cursos || []).map((c) => c.mi_calificacion).filter((n) => n != null);
  const promedio = notas.length ? (notas.reduce((a, b) => a + Number(b), 0) / notas.length).toFixed(2) : "—";

  const cards = esDocente
    ? [
        { n: activos, label: "Cursos a mi cargo", c: "#1E9AD7" },
        { n: (horario || []).length, label: "Clases en la semana", c: "#5E2D8E" },
        {
          n: (cursos || []).reduce((a, c) => a + (c.inscritos || 0), 0),
          label: "Estudiantes inscritos",
          c: "#43B02A",
        },
      ]
    : [
        { n: activos, label: "Cursos en progreso", c: "#1E9AD7" },
        { n: completados, label: "Cursos completados", c: "#43B02A" },
        { n: promedio, label: "Promedio general", c: "#F5811F" },
        { n: (certs || []).length, label: "Certificados", c: "#5E2D8E" },
      ];

  /* --- Horario agrupado por día --- */
  const porDia = DIAS.map((d, i) => ({
    dia: d,
    clases: (horario || []).filter((h) => h.dia_semana === i + 1),
  })).filter((x) => x.clases.length);

  return (
    <div>
      <PortalStyles />

      <div className="fb-header">
        <div>
          <h1 className="fb-title">
            Hola, {session?.nombres || "bienvenido"}
          </h1>
          <p className="fb-subtitle">
            {esDocente
              ? "Tus cursos, tu horario de clases y el avance de tus grupos."
              : "Tu progreso académico, tu horario y tus certificados."}
          </p>
        </div>
      </div>

      {err && <div className="fb-error">No se pudo cargar tu información: {err}</div>}

      <div className="fb-stat-grid">
        {cards.map((c) => (
          <div className="fb-card fb-stat" key={c.label} style={{ borderTop: `3px solid ${c.c}` }}>
            <div className="fb-stat-num" style={{ color: c.c }}>
              {cursos ? c.n : "·"}
            </div>
            <div className="fb-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* ---------- Horario ---------- */}
      <div className="fb-card fb-mb">
        <div className="fb-card-title">Mi horario semanal</div>
        {horario === null ? (
          <div className="fb-empty">Cargando…</div>
        ) : porDia.length === 0 ? (
          <div className="fb-empty">No tienes clases programadas esta semana.</div>
        ) : (
          <div className="pt-week">
            {porDia.map((d) => (
              <div className="pt-day" key={d.dia}>
                <div className="pt-day-name">{d.dia}</div>
                {d.clases.map((h) => (
                  <div className="pt-class" key={h.id}>
                    <div className="pt-hora">
                      {hhmm(h.hora_inicio)} – {hhmm(h.hora_fin)}
                    </div>
                    <div className="pt-curso">{h.curso}</div>
                    <div className="pt-meta">
                      {h.aula || "Aula por definir"} · {h.modalidad}
                      {!esDocente && h.docente ? ` · ${h.docente}` : ""}
                    </div>
                    {h.modalidad !== "presencial" && h.url_clase && (
                      <a className="pt-link" href={h.url_clase} target="_blank" rel="noreferrer">
                        Entrar a la clase virtual
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Cursos ---------- */}
      <div className="fb-card fb-mb">
        <div className="fb-card-title">{esDocente ? "Cursos a mi cargo" : "Mis cursos"}</div>
        {cursos === null ? (
          <div className="fb-empty">Cargando…</div>
        ) : cursos.length === 0 ? (
          <div className="fb-empty">
            {esDocente ? "Todavía no tienes cursos asignados." : "Aún no estás inscrito en ningún curso."}
          </div>
        ) : (
          <div className="fb-table-wrap">
            <table className="fb-table">
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Nivel</th>
                  <th>{esDocente ? "Inscritos" : "Docente"}</th>
                  <th>Periodo</th>
                  {!esDocente && <th>Estado</th>}
                  {!esDocente && <th>Calificación</th>}
                </tr>
              </thead>
              <tbody>
                {cursos.map((c) => (
                  <tr key={c.curso_id + c.mi_relacion}>
                    <td>
                      <strong>{c.nombre}</strong>
                      {c.descripcion && <div className="pt-desc">{c.descripcion}</div>}
                    </td>
                    <td>{c.nivel || "—"}</td>
                    <td>{esDocente ? c.inscritos ?? 0 : c.docente}</td>
                    <td className="pt-nowrap">
                      {c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleDateString("es-EC") : "—"}
                      {" — "}
                      {c.fecha_fin ? new Date(c.fecha_fin).toLocaleDateString("es-EC") : "—"}
                    </td>
                    {!esDocente && (
                      <td>
                        <span
                          className="fb-badge"
                          style={{ background: ESTADO_COLOR[c.mi_estado_inscripcion] || "#7C889E" }}
                        >
                          {c.mi_estado_inscripcion}
                        </span>
                      </td>
                    )}
                    {!esDocente && (
                      <td>
                        {c.mi_calificacion == null ? (
                          <span className="pt-sin">En curso</span>
                        ) : (
                          <strong style={{ color: Number(c.mi_calificacion) >= 7 ? "#43B02A" : "#EF5350" }}>
                            {Number(c.mi_calificacion).toFixed(2)}
                          </strong>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---------- Certificados (solo estudiantes) ---------- */}
      {!esDocente && (
        <div className="fb-card">
          <div className="fb-card-title">Mis certificados</div>
          {certs === null ? (
            <div className="fb-empty">Cargando…</div>
          ) : certs.length === 0 ? (
            <div className="fb-empty">Todavía no tienes certificados emitidos.</div>
          ) : (
            <div className="pt-certs">
              {certs.map((c) => (
                <div className="pt-cert" key={c.id}>
                  <div className="pt-cert-curso">{c.curso || "Certificado FractalBots"}</div>
                  <div className="pt-cert-fecha">Emitido el {fmtFecha(c.fecha_emision)}</div>
                  <div className="pt-cert-cod">
                    Código de verificación: <code>{c.codigo_verificacion}</code>
                  </div>
                  <button
                    className="fb-btn fb-btn-primary fb-btn-block"
                    onClick={() =>
                      onCertificado?.({
                        codigo_verificacion: c.codigo_verificacion,
                        fecha_emision: c.fecha_emision,
                        estudiantes: { nombres: c.estudiante, apellidos: "" },
                        cursos: { nombre: c.curso },
                      })
                    }
                  >
                    Ver / descargar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Estilos propios del portal ---------- */
function PortalStyles() {
  return (
    <style>{`
      .pt-week { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:14px; }
      .pt-day-name { font-weight:700; font-size:.82rem; letter-spacing:.06em; text-transform:uppercase;
                     color:#5E2D8E; margin-bottom:8px; }
      .pt-class { background:#F6F8FB; border-left:3px solid #1E9AD7; border-radius:8px;
                  padding:10px 12px; margin-bottom:8px; }
      .pt-hora { font-weight:700; color:#1E9AD7; font-size:.9rem; }
      .pt-curso { font-weight:600; margin:2px 0; font-size:.94rem; }
      .pt-meta { font-size:.8rem; color:#6B7684; }
      .pt-link { display:inline-block; margin-top:6px; font-size:.8rem; color:#5E2D8E; font-weight:600; }
      .pt-desc { font-size:.8rem; color:#6B7684; margin-top:2px; max-width:420px; }
      .pt-nowrap { white-space:nowrap; font-size:.86rem; }
      .pt-sin { color:#7C889E; font-size:.86rem; }
      .pt-certs { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
      .pt-cert { border:1px solid #E4E9F0; border-radius:10px; padding:14px;
                 border-top:3px solid #F5811F; background:#fff; }
      .pt-cert-curso { font-weight:700; margin-bottom:4px; }
      .pt-cert-fecha { font-size:.82rem; color:#6B7684; }
      .pt-cert-cod { font-size:.78rem; color:#6B7684; margin:8px 0 10px; }
      .pt-cert-cod code { background:#F1F4F8; padding:2px 6px; border-radius:4px; font-size:.78rem; }
    `}</style>
  );
}
