import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex flex-col items-center justify-center py-24 text-center">
      <p className="kicker">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-navy">Página no encontrada</h1>
      <p className="mt-3 max-w-md text-navy/65">
        No encontramos lo que buscas. Puede que el enlace haya cambiado o se haya movido.
      </p>
      <Link href="/" className="btn-primary mt-6">Volver al inicio</Link>
    </div>
  );
}