# ADONAI · Sitio web de la iglesia

Sitio público + portal interno (staff) para la iglesia cristiana ADONAI.

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4.
- **Backend**: Next.js route handlers + Server Actions + Prisma 6.
- **Base de datos**: PostgreSQL en **Neon**.
- **Auth**: Auth.js v5 (NextAuth) con correo/contraseña y roles en JWT.
- **Emails**: Resend.
- **Despliegue**: Vercel.

## Estructura

- `/` página principal, `/nosotros`, `/servicios`, `/ministerios`, `/eventos`, `/sermones`, `/dar`, `/contacto` (+ `/jovenes`, `/asesoria`, `/ayuda-espiritual`, `/nuevo`), `/casas-oasis`, `/bautismos`, `/galeria`.
- `/login` acceso al portal.
- `/admin` panel privado: Inbox de contacto, Contabilidad, Servidores/logística, Alabanza, Discipulado, Casas Oasis, Bautismos, Contenido web, Usuarios.

## Roles

`ADMIN`, `CONTABILIDAD`, `LOGISTICA`, `ALABANZA`, `EDITOR`. Los módulos del menú y las Server Actions se validan por rol en el servidor (`src/lib/role.ts` → `requiereRoles`, `asegurarRol`). Solo `ADMIN` gestiona usuarios.

## Setup local

```bash
npm install
cp .env.example .env   # completa los valores
npx prisma migrate dev # crea las tablas
npm run db:seed        # crea el admin y datos de ejemplo
npm run dev            # http://localhost:3000
```

### Variables de entorno (`.env`)

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Conexión pooled de Neon (la usa Prisma para queries). |
| `DIRECT_URL` | Conexión directa de Neon (para migraciones). |
| `AUTH_SECRET` | Genera con `npx auth secret`. |
| `AUTH_URL` | `http://localhost:3000` en local; la URL del deploy en producción. |
| `AUTH_TRUST_HOST` | `true` en local/Vercel. |
| `RESEND_API_KEY` | Clave de Resend para notificaciones por correo. |
| `MAIL_TO_PASTORES` | Correo que recibe las notificaciones de los formularios. |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio. |
| `SEED_ADMIN_EMAIL_1..3` / `SEED_ADMIN_PASSWORD_1..3` | Credenciales de los 3 admins que crea el seed (opcional). |

> Sin `DATABASE_URL` o `RESEND_API_KEY` el sitio funciona degradado: los formularios no guardan ni envían correo, y las páginas del portal muestran vacío. El build no falla.

### Acceso al portal

`npm run db:seed` crea el staff administrador con una **contraseña temporal** `Adonai2026!`
para los tres correos (cambiar tras el primer ingreso):

- `fmleonm19@gmail.com`
- `isabelmahechamartinez@gmail.com`
- `gustavoadolfosanchezr@gmail.com`

Se puede personalizar con las variables `SEED_ADMIN_EMAIL_1..3` y `SEED_ADMIN_PASSWORD_1..3`.
Usuarios adicionales y sus roles se gestionan desde `/admin/usuarios`.

## Comandos útiles

```bash
npm run dev           # desarrollo
npm run typecheck     # tsc --noEmit
npm run lint          # eslint src
npm run build         # next build
npm run db:migrate    # prisma migrate dev
npm run db:push       # prisma db push (sin migraciones)
npm run db:seed       # datos iniciales
npm run db:studio     # prisma studio
npx prisma migrate deploy   # en Vercel build, para aplicar migraciones
```

## Despliegue en Vercel

1. Sube el repo y crea un proyecto en Vercel.
2. Añade todas las variables de entorno anteriores.
3. Build command: `npm run build`; Install command: `npm install`.
4. En **Settings → Environment Variables** define también `AUTH_URL=https://tudominio.com`.
5. Tras el primer deploy, abre `https://tudominio.com/login` y entra con el admin del seed.

## Pendientes de marca

Busca `[PENDIENTE:BRANDA]` en el código — concentrados en `src/lib/site.ts`:
datos de los pastores, WhatsApp, datos de dar (Nequi/PSE), redes sociales
y el correo `MAIL_TO_PASTORES`. El logo ya se copió a `public/logo-adonai.png`.

### Fotos de la iglesia

Las fotos se reemplazan en un solo lugar: `src/lib/site.ts` → `SITE.imagenes`.
Copia tus fotos a `public/fotos/` y escribe su ruta en cada campo (`null` = no se muestra):

| Campo | Dónde se usa | Formato sugerido |
| --- | --- | --- |
| `imagenes.hero` | Fondo suave del inicio | Horizontal, 1600px+ |
| `imagenes.nosotros` | Página Nosotros (historia) | 16:9 |
| `imagenes.pastores` | Nosotros (equipo pastoral) | Panorámico, 21:9 |
| `imagenes.casasOasis` | Página Casas Oasis | 16:9 |

Los ministerios tienen campo `foto` (por ejemplo `ministerios[0].foto`) y los pastores
`pastores[i].foto` en el mismo archivo.

- **Eventos, sermones y galería**: sus fotos no van en `site.ts`; se suben desde el panel
  `/admin/contenido` (gestión de contenido) y las URLs quedan en la base de datos.
- **Dirección**: ya configurada en `SITE.ubicacion` (Av. Libertadores #20-07, frente a los
  lavaderos de autos, Paipa, Boyacá) con mapa embebido en `/servicios`.

## Seguridad

- Contraseñas con `bcrypt.js`; nunca se guardan en texto plano.
- JWT firmado con `AUTH_SECRET`; roles dentro del token.
- Las Server Actions revalidan permisos con `asegurarRol` (no confían en la UI).
- `/admin/*` protegido por `src/proxy.ts` (convención proxy de Next 16) y por `requiereRoles` en cada página.