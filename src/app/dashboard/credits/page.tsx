export default function CreditsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Créditos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona tus créditos y adquiere más para entrenar modelos.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Paquetes de Créditos
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Paquete Básico */}
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Básico</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Ideal para comenzar con el entrenamiento de modelos.
                  </p>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">$10</span>
                    <span className="text-base font-medium text-gray-500">/100 créditos</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600"
                >
                  Comprar
                </button>
              </div>
            </div>

            {/* Paquete Pro */}
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pro</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Para usuarios que necesitan entrenar múltiples modelos.
                  </p>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">$25</span>
                    <span className="text-base font-medium text-gray-500">/300 créditos</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600"
                >
                  Comprar
                </button>
              </div>
            </div>

            {/* Paquete Enterprise */}
            <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Enterprise</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Solución empresarial para grandes proyectos.
                  </p>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">$50</span>
                    <span className="text-base font-medium text-gray-500">/700 créditos</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 