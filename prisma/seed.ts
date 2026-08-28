import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admins = [
    { email: process.env.SEED_ADMIN_EMAIL_1 ?? "fmleonm19@gmail.com", nombre: "Felipe", password: process.env.SEED_ADMIN_PASSWORD_1 ?? "Adonai2026!" },
    { email: process.env.SEED_ADMIN_EMAIL_2 ?? "isabelmahechamartinez@gmail.com", nombre: "Isabel", password: process.env.SEED_ADMIN_PASSWORD_2 ?? "Adonai2026!" },
    { email: process.env.SEED_ADMIN_EMAIL_3 ?? "gustavoadolfosanchezr@gmail.com", nombre: "Gustavo", password: process.env.SEED_ADMIN_PASSWORD_3 ?? "Adonai2026!" },
  ];

  for (const a of admins) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    await prisma.user.upsert({
      where: { email: a.email },
      update: { name: a.nombre, roles: ["ADMIN", "EDITOR"] },
      create: { name: a.nombre, email: a.email, passwordHash, roles: ["ADMIN", "EDITOR"] },
    });
    console.log("Admin:", a.email, "(roles: ADMIN, EDITOR)");
  }

  const etapas = [
    "Nuevo creyente",
    "Fundamentos",
    "Discipulado 1",
    "Discipulado 2",
    "Líder en formación",
  ];
  for (const [i, nombre] of etapas.entries()) {
    await prisma.etapaDiscipulado.upsert({
      where: { id: nombre },
      update: { orden: i, activa: true },
      create: { id: nombre, nombre, orden: i, activa: true },
    });
  }
  console.log("Etapas de discipulado listas.");

  const categorias = [
    { tipo: "INGRESO", nombre: "Diezmos", orden: 1 },
    { tipo: "INGRESO", nombre: "Ofrendas", orden: 2 },
    { tipo: "INGRESO", nombre: "Donaciones", orden: 3 },
    { tipo: "INGRESO", nombre: "Otros ingresos", orden: 4 },
    { tipo: "EGRESO", nombre: "Servicios públicos", orden: 1 },
    { tipo: "EGRESO", nombre: "Arriendo", orden: 2 },
    { tipo: "EGRESO", nombre: "Sonido e imagen", orden: 3 },
    { tipo: "EGRESO", nombre: "Apoyo social", orden: 4 },
    { tipo: "EGRESO", nombre: "Otros egresos", orden: 5 },
  ];
  for (const c of categorias) {
    await prisma.categoriaTransaccion.upsert({
      where: { tipo_nombre: { tipo: c.tipo, nombre: c.nombre } },
      update: { orden: c.orden },
      create: c,
    });
  }
  console.log("Categorías de transacciones listas.");

  const bautismosExistentes = await prisma.eventoBautismo.count();
  if (bautismosExistentes === 0) {
    await prisma.eventoBautismo.create({
      data: {
        fecha: new Date("2026-11-08T10:00:00-05:00"),
        lugar: "[PENDIENTE:BRANDA] Lugar del bautismo",
        requisitos:
          "Tener relación personal con Jesús, haber tomado la charla de preparación previa al bautismo y asistir con ropa adecuada. Menores de edad deben venir con un padre o acudiente.",
      },
    });
    console.log("Evento de bautismo de noviembre creado (info provisional).");
  }

  const cohortesExistentes = await prisma.cohorteCasasOasis.count();
  if (cohortesExistentes === 0) {
    await prisma.cohorteCasasOasis.create({
      data: {
        fechaInicio: new Date("2026-10-01T00:00:00-05:00"),
        fechaFin: new Date("2026-12-05T00:00:00-05:00"),
        cupo: 20,
        activa: true,
      },
    });
    console.log("Cohorte de ejemplo creada (fechas provisionales).");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });