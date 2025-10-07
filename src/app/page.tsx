import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-sky-600">
          RetratAI
        </h1>
        <p className="text-2xl mb-8 text-gray-700 dark:text-gray-300">
          Fotografías profesionales generadas por IA en segundos
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-sky-400 to-sky-600 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
            Comenzar ahora
          </button>
          <button className="border border-sky-200 text-sky-600 font-semibold py-3 px-8 rounded-full hover:bg-sky-100 transition-colors">
            Ver demo en vivo
          </button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            icon: "✨",
            title: "Calidad profesional",
            copy: "Fotos de alta resolución listas para usar en cualquier medio"
          }, {
            icon: "⚡",
            title: "Generación instantánea",
            copy: "Obtén resultados en segundos, sin esperas ni sesiones"
          }, {
            icon: "🎨",
            title: "Personalización total",
            copy: "Define estilos, fondos y vestuarios específicos"
          }].map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="text-sky-500 text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sky-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ejemplos de fotos generadas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {["Professional+Portrait", "Business+Photo", "Creative+Shot"].map((label) => (
              <div key={label} className="relative aspect-square rounded-lg shadow-md overflow-hidden">
                <Image
                  src={`https://placehold.co/600x600/sky/white?text=${label}`}
                  alt={`${label.replace("+", " ")} example`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Planes y precios</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[{
            name: "Básico",
            price: "$9.99",
            bullets: ["50 fotos al mes", "Resolución estándar", "Soporte básico"],
            cta: "Seleccionar plan"
          }, {
            name: "Pro",
            price: "$24.99",
            featured: true,
            bullets: ["200 fotos al mes", "Alta resolución", "Soporte prioritario", "Estilos personalizados"],
            cta: "Elegir plan Pro"
          }, {
            name: "Empresas",
            price: "$99.99",
            bullets: ["Fotos ilimitadas", "Máxima resolución", "Soporte 24/7", "Integración API"],
            cta: "Contactar ventas"
          }].map((plan) => (
            <div
              key={plan.name}
              className={`p-8 rounded-xl shadow-lg border transition-transform hover:-translate-y-1 ${
                plan.featured
                  ? "bg-gradient-to-b from-sky-400 to-sky-600 text-white border-transparent"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <h3 className="font-bold text-xl mb-4">{plan.name}</h3>
              <p className={`text-3xl font-bold mb-4 ${plan.featured ? "text-white" : "text-gray-900"}`}>
                {plan.price}
                <span className={`${plan.featured ? "text-gray-100" : "text-gray-500"} text-sm`}>/mes</span>
              </p>
              <ul className="space-y-3 mb-8">
                {plan.bullets.map((item) => (
                  <li key={item} className={plan.featured ? "text-white" : "text-gray-700 dark:text-gray-300"}>
                    ✓ {item}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-full font-semibold transition-opacity ${
                  plan.featured ? "bg-white text-sky-600 hover:opacity-90" : "bg-sky-900 dark:bg-sky-700 text-white hover:opacity-90"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-sky-400 to-sky-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Comienza a crear fotos profesionales hoy</h2>
          <p className="mb-8 text-lg">
            Únete a cientos de empresas que ya confían en RetratAI para renovar su imagen.
          </p>
          <button className="bg-white text-sky-600 font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
            Prueba gratis por 7 días
          </button>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© 2024 RetratAI. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
