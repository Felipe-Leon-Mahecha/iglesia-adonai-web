import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Portal interno",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="container-site flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Image src="/logo-adonai.png" alt="Logo" width={64} height={64} className="mx-auto h-16 w-16 rounded-full object-cover" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal">Área privada</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}