import React from 'react'

const SeguridadForm = ({ hotelSeleccionado }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 text-center space-y-4 py-12">
      <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.952 11.952 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-slate-800 text-lg md:text-xl">Formulario de Seguridad</h3>
        <p className="text-sm text-teal-700 font-semibold">{hotelSeleccionado}</p>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Este módulo está listo para recibir el cuestionario específico del grupo de Seguridad. Próximamente se integrarán las preguntas correspondientes aquí.
        </p>
      </div>
    </div>
  )
}

export default SeguridadForm
