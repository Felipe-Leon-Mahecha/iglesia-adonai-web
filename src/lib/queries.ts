import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

function vacio<T>(): T {
  return [] as unknown as T;
}

export async function getEventosPublicos() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryEventos>>>();
  return queryEventos();
}

async function queryEventos() {
  return db!.evento.findMany({
    where: { publicado: true },
    orderBy: { fecha: "asc" },
    include: { _count: { select: { inscripciones: true } } },
  });
}

export async function getEventoBySlug(slug: string) {
  if (!db) return null;
  return db.evento.findUnique({
    where: { slug },
    include: { _count: { select: { inscripciones: true } } },
  });
}

export async function getSermones() {
  if (!db) return vacio<Awaited<ReturnType<typeof querySermones>>>();
  return querySermones();
}

async function querySermones() {
  const sermones = await db!.sermon.findMany({
    where: { publicado: true },
    orderBy: { fecha: "desc" },
  });
  const porSerie = new Map<string, typeof sermones>();
  for (const s of sermones) {
    const lista = porSerie.get(s.serie) ?? [];
    lista.push(s);
    porSerie.set(s.serie, lista);
  }
  return Array.from(porSerie.entries()).map(([serie, lista]) => ({
    serie,
    sermones: lista,
  }));
}

export async function getCohortesPublicas() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryCohortesPublicas>>>();
  return queryCohortesPublicas();
}

async function queryCohortesPublicas() {
  const ahora = new Date();
  return db!.cohorteCasasOasis.findMany({
    where: {
      activa: true,
      fechaInicio: { gte: ahora },
    },
    orderBy: { fechaInicio: "asc" },
    include: { _count: { select: { inscripciones: true } } },
  });
}

export async function getCohortesAdmin() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryCohortesAdmin>>>();
  return queryCohortesAdmin();
}

async function queryCohortesAdmin() {
  return db!.cohorteCasasOasis.findMany({
    orderBy: { fechaInicio: "desc" },
    include: {
      inscripciones: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function getEventoBautismoActual() {
  if (!db) return null;
  const ahora = new Date();
  const futuro = await db.eventoBautismo.findFirst({
    where: { fecha: { gte: ahora } },
    orderBy: { fecha: "asc" },
    include: { _count: { select: { inscripciones: true } } },
  });
  if (futuro) return futuro;
  return db.eventoBautismo.findFirst({
    orderBy: { fecha: "desc" },
    include: { _count: { select: { inscripciones: true } } },
  });
}

export async function getEventosBautismoAdmin() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryEventosBautismo>>>();
  return queryEventosBautismo();
}

async function queryEventosBautismo() {
  return db!.eventoBautismo.findMany({
    orderBy: { fecha: "desc" },
    include: { inscripciones: { orderBy: { createdAt: "desc" } } },
  });
}

export async function getGaleriaFotos() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryGaleria>>>();
  return queryGaleria();
}

async function queryGaleria() {
  return db!.fotoGaleria.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getMensajesContacto() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryMensajes>>>();
  return queryMensajes();
}

async function queryMensajes() {
  return db!.mensajeContacto.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getUsuarios() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryUsuarios>>>();
  return queryUsuarios();
}

async function queryUsuarios() {
  return db!.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
      createdAt: true,
    },
  });
}

export type CategoriaTransaccionRow = { id: string; tipo: string; nombre: string; orden: number };

export async function getCategoriasTransaccion(): Promise<CategoriaTransaccionRow[]> {
  if (!db) return [];
  return db.categoriaTransaccion.findMany({ orderBy: [{ tipo: "asc" }, { orden: "asc" }] });
}

export async function getTransacciones(filtro?: { mes?: string; categoriaId?: string; tipo?: string }) {
  if (!db) return vacio<Awaited<ReturnType<typeof queryTransacciones>>>();
  return queryTransacciones(filtro);
}

async function queryTransacciones(filtro?: { mes?: string; categoriaId?: string; tipo?: string }) {
  const where: Prisma.TransaccionWhereInput = {};
  if (filtro?.mes) {
    const [anio, mes] = filtro.mes.split("-").map(Number);
    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 1);
    where.fecha = { gte: inicio, lt: fin };
  }
  if (filtro?.categoriaId) where.categoriaId = filtro.categoriaId;
  if (filtro?.tipo) where.tipo = filtro.tipo;
  return db!.transaccion.findMany({
    where,
    orderBy: { fecha: "desc" },
    include: { categoria: true },
  });
}

export async function getServidores() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryServidores>>>();
  return queryServidores();
}

async function queryServidores() {
  return db!.servidor.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { asignaciones: true } } },
  });
}

export async function getServicios() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryServicios>>>();
  return queryServicios();
}

async function queryServicios() {
  return db!.servicio.findMany({
    orderBy: { fecha: "asc" },
    include: {
      asignaciones: { include: { servidor: true } },
      setlist: { include: { canciones: { include: { cancion: true }, orderBy: { orden: "asc" } } } },
      _count: { select: { asignaciones: true } },
    },
  });
}

export async function getCanciones() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryCanciones>>>();
  return queryCanciones();
}

async function queryCanciones() {
  return db!.cancion.findMany({
    orderBy: { titulo: "asc" },
    include: { _count: { select: { setlistCanciones: true } } },
  });
}

export async function getEtapasDiscipulado() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryEtapas>>>();
  return queryEtapas();
}

async function queryEtapas() {
  return db!.etapaDiscipulado.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
  });
}

export async function getDiscipulosPorEtapa() {
  if (!db) return vacio<Awaited<ReturnType<typeof queryDiscipulosPorEtapa>>>();
  return queryDiscipulosPorEtapa();
}

async function queryDiscipulosPorEtapa() {
  const etapas = await db!.etapaDiscipulado.findMany({
    where: { activa: true },
    orderBy: { orden: "asc" },
    include: {
      discipulos: {
        orderBy: { nombre: "asc" },
        include: {
          seguimientos: { orderBy: { fecha: "desc" }, take: 3 },
          _count: { select: { seguimientos: true } },
        },
      },
    },
  });
  return etapas.filter((e) => e.discipulos.length > 0 || true);
}

export async function getDashboardResumen() {
  if (!db) return null;
  const ahora = new Date();
  const [mensajesPendientes, totalMensajes, proximoCulto, inscripcionesRaw, transacciones] =
    await Promise.all([
      db.mensajeContacto.count({ where: { estado: "PENDIENTE" } }),
      db.mensajeContacto.count(),
      db.evento.findFirst({ where: { fecha: { gte: ahora }, publicado: true }, orderBy: { fecha: "asc" } }),
      db.$queryRaw<{ total: bigint }[]>`SELECT COUNT(*)::bigint AS total FROM (SELECT id FROM inscripciones_bautismo UNION ALL SELECT id FROM inscripciones_casas_oasis UNION ALL SELECT id FROM inscripciones_eventos) AS t`,
      db.transaccion.findMany({ select: { tipo: true, monto: true } }),
    ]);
  const totalInscrip = inscripcionesRaw[0] ? Number(inscripcionesRaw[0].total) : 0;
  const ingresos = transacciones.reduce((a, t) => (t.tipo === "INGRESO" ? a + t.monto : a), 0);
  const egresos = transacciones.reduce((a, t) => (t.tipo === "EGRESO" ? a + t.monto : a), 0);
  return {
    mensajesPendientes,
    totalMensajes,
    proximoCulto,
    totalInscripciones: totalInscrip,
    ingresos,
    egresos,
  };
}