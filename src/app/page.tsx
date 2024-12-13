import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Image
                src="/next.svg"
                alt="Logo"
                width={120}
                height={30}
              />
            </div>
            <div className="flex gap-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-sky-100 text-sm font-medium rounded-md text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Bienvenido a</span>
              <span className="block text-sky-500">Nuestra Plataforma</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Descubre una nueva forma de gestionar tus proyectos. Únete a nosotros y comienza tu viaje hoy mismo.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 md:text-lg transition-colors"
              >
                Comenzar Ahora
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 border border-sky-100 text-base font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50 md:text-lg transition-colors"
              >
                Saber Más
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
