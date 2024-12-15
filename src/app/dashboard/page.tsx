'use client';

import { useAuth } from '@/contexts/AuthContext';
import { CpuChipIcon, CreditCardIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.user_metadata?.full_name || 'Usuario'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Este es tu panel de control donde podrás gestionar tus modelos y créditos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de Modelos Entrenados */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CpuChipIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Modelos Entrenados
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">0</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/train"
                className="font-medium text-sky-600 hover:text-sky-500"
              >
                Entrenar nuevo modelo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 