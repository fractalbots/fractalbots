# Fractal-Bots

Monorepo del ecosistema Fractal-Bots: Centro de Robótica Educativa, Tecnología e Innovación.
Quito, Ecuador.

```
fractalbots/
├── apps/
│   ├── web/        Web pública      React 18 · Vite · Tailwind · GSAP
│   ├── sistema/    Plataforma       React 19 · Vite · Supabase (PostgREST)
│   └── tienda/     ToboTech         HTML estático · React por CDN · Supabase
└── .gitignore
```

Las tres aplicaciones son independientes: cada una tiene su `package.json` y su
propio `node_modules`. No hay workspaces ni herramientas de monorepo, así que
puedes trabajar en una sin instalar ni compilar las otras.

---

## Levantar en local

```bash
# Web pública          → http://localhost:5174
cd apps/web && npm install && npm run dev

# Plataforma           → http://localhost:5173
cd apps/sistema && npm install && npm run dev

# Tienda (estática, sin build)
cd apps/tienda && npx serve .
```

La tienda es un único `index.html` que carga React desde unpkg y compila JSX en
el navegador con Babel standalone. No necesita `npm install`: basta abrir el
archivo con cualquier servidor estático.

---

## Despliegue en Vercel

Un solo repositorio, tres proyectos de Vercel. Lo que los distingue es el
**Root Directory**.

| Proyecto Vercel | Root Directory | Framework | Build | Output |
|---|---|---|---|---|
| Web pública | `apps/web` | Vite | `npm run build` | `dist` |
| Plataforma | `apps/sistema` | Vite | `npm run build` | `dist` |
| Tienda | `apps/tienda` | Other | *(vacío)* | `.` |

### Si el proyecto ya existe en Vercel

No lo borres ni crees uno nuevo: perderías las variables de entorno y el dominio.

1. *Settings → Git* → conectar este repositorio
2. *Settings → General → Root Directory* → la carpeta de la tabla
3. *Deployments → Redeploy*

### Evitar builds innecesarios

Por defecto, cualquier push recompila las tres aplicaciones. En cada proyecto:

*Settings → Git → Ignored Build Step* → **Custom**:

```bash
git diff --quiet HEAD^ HEAD -- .
```

Se ejecuta desde el Root Directory de ese proyecto. Si esa carpeta no cambió,
Vercel cancela el build.

---

## Enlaces entre aplicaciones

Los botones de la web pública que llevan al sistema y a la tienda salen de un
solo sitio, `apps/web/src/data/content.js`:

```js
export const ENLACES = {
  sistema: "https://fractalbots.vercel.app",
  tienda:  "https://tobotech.vercel.app",
  repo:    "https://github.com/fractalbots/fractalbots",
};
```

Si cambia un dominio, se edita ahí y se actualizan los seis botones a la vez.

---

## Base de datos

Las tres apps que la usan apuntan al mismo proyecto de Supabase
(`asqtoedpwmrztuzkjqkp`) mediante la clave `anon` y PostgREST.

La clave `anon` está pensada para ser pública: lo que realmente protege los
datos son las políticas RLS de cada tabla, no el secreto de la clave. Por eso
funciona estando escrita en el código del cliente.

Dos reglas que no se pueden romper:

- **RLS activo en toda tabla accesible.** Sin política, `anon` con la clave
  pública puede leer o escribir lo que quiera. Compruébalo en Supabase →
  *Authentication → Policies*.
- **`service_role` jamás en el frontend.** Esa clave ignora RLS por completo.
  Solo va en un servidor o en una función, nunca en código que llegue al navegador.

---

## Primer push a GitHub

```bash
cd fractalbots
git init
git add .
git commit -m "chore: monorepo con web, sistema y tienda"
git branch -M main
git remote add origin https://github.com/fractalbots/fractalbots.git
git push -u origin main --force
```

`--force` sobrescribe lo que hubiera en el repositorio. Si quieres conservar el
historial anterior, clona el repo primero y copia estas carpetas dentro en vez
de empezar de cero.
