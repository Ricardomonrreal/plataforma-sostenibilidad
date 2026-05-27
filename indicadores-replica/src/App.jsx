import React, { useState, lazy, Suspense } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import IndicadoresForm from './components/IndicadoresForm'

const Dashboard = lazy(() => import('./components/Dashboard'))

function App() {
  const [vistaActual, setVistaActual] = useState('formularios')

  return (
    <div className="flex flex-col md:flex-row min-h-screen h-screen">
      <Sidebar vistaActual={vistaActual} onCambiarVista={setVistaActual} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="bg-gray-200 flex-grow pl-4 pr-4 md:pl-8 md:pr-10 pt-10 pb-24 overflow-y-auto">
          <div className="grid gap-4 max-w-6xl mx-auto">
            {vistaActual === 'formularios' && <IndicadoresForm />}
            {vistaActual === 'dashboard' && (
              <Suspense fallback={
                <div className="flex items-center justify-center h-96">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm font-medium">Cargando dashboard…</p>
                  </div>
                </div>
              }>
                <Dashboard />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
