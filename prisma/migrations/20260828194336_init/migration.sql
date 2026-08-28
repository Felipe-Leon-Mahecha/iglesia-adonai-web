-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "roles" TEXT[],
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuentas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "cuentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_verificacion" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_verificacion_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "mensajes_contacto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "lugar" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "imagen" TEXT,
    "slug" TEXT NOT NULL,
    "requiere_inscripcion" BOOLEAN NOT NULL DEFAULT false,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones_eventos" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "comentario" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sermones" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "texto_biblico" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "imagen" TEXT,
    "link_audio" TEXT,
    "link_video" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sermones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohortes_casas_oasis" (
    "id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "cupo" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cohortes_casas_oasis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones_casas_oasis" (
    "id" TEXT NOT NULL,
    "cohorte_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "comentario" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'INSCRITO',
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_casas_oasis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento_bautismo" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lugar" TEXT NOT NULL,
    "requisitos" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_bautismo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones_bautismo" (
    "id" TEXT NOT NULL,
    "evento_bautismo_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "contacto" TEXT NOT NULL,
    "tomo_charla" BOOLEAN NOT NULL DEFAULT false,
    "comentario" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'NUEVO',
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_bautismo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_transaccion" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categorias_transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacciones" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "nota" TEXT,
    "registrado_por" TEXT,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servidores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "correo" TEXT,
    "roles_servicio" TEXT[],
    "usuario_id" TEXT,

    CONSTRAINT "servidores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones" (
    "id" TEXT NOT NULL,
    "servicio_id" TEXT NOT NULL,
    "servidor_id" TEXT NOT NULL,
    "rol_servicio" TEXT NOT NULL,

    CONSTRAINT "asignaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canciones" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "tono" TEXT,
    "link_letra" TEXT,
    "link_pista" TEXT,

    CONSTRAINT "canciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setlists" (
    "id" TEXT NOT NULL,
    "servicio_id" TEXT NOT NULL,

    CONSTRAINT "setlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setlist_canciones" (
    "id" TEXT NOT NULL,
    "setlist_id" TEXT NOT NULL,
    "cancion_id" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "setlist_canciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etapas_discipulado" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "etapas_discipulado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discipulos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "etapa_id" TEXT NOT NULL,

    CONSTRAINT "discipulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimiento_discipulado" (
    "id" TEXT NOT NULL,
    "discipulo_id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nota" TEXT NOT NULL,

    CONSTRAINT "seguimiento_discipulado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeria_fotos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galeria_fotos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cuentas_provider_providerAccountId_key" ON "cuentas"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_sessionToken_key" ON "sesiones"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "eventos_slug_key" ON "eventos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_transaccion_tipo_nombre_key" ON "categorias_transaccion"("tipo", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "servidores_usuario_id_key" ON "servidores"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "asignaciones_servicio_id_servidor_id_rol_servicio_key" ON "asignaciones"("servicio_id", "servidor_id", "rol_servicio");

-- CreateIndex
CREATE UNIQUE INDEX "setlists_servicio_id_key" ON "setlists"("servicio_id");

-- CreateIndex
CREATE UNIQUE INDEX "setlist_canciones_setlist_id_cancion_id_key" ON "setlist_canciones"("setlist_id", "cancion_id");

-- AddForeignKey
ALTER TABLE "cuentas" ADD CONSTRAINT "cuentas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_eventos" ADD CONSTRAINT "inscripciones_eventos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_casas_oasis" ADD CONSTRAINT "inscripciones_casas_oasis_cohorte_id_fkey" FOREIGN KEY ("cohorte_id") REFERENCES "cohortes_casas_oasis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_bautismo" ADD CONSTRAINT "inscripciones_bautismo_evento_bautismo_id_fkey" FOREIGN KEY ("evento_bautismo_id") REFERENCES "evento_bautismo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias_transaccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servidores" ADD CONSTRAINT "servidores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_servidor_id_fkey" FOREIGN KEY ("servidor_id") REFERENCES "servidores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setlists" ADD CONSTRAINT "setlists_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setlist_canciones" ADD CONSTRAINT "setlist_canciones_setlist_id_fkey" FOREIGN KEY ("setlist_id") REFERENCES "setlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setlist_canciones" ADD CONSTRAINT "setlist_canciones_cancion_id_fkey" FOREIGN KEY ("cancion_id") REFERENCES "canciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discipulos" ADD CONSTRAINT "discipulos_etapa_id_fkey" FOREIGN KEY ("etapa_id") REFERENCES "etapas_discipulado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimiento_discipulado" ADD CONSTRAINT "seguimiento_discipulado_discipulo_id_fkey" FOREIGN KEY ("discipulo_id") REFERENCES "discipulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
