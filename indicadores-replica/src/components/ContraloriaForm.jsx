import React from 'react'

const ContraloriaForm = ({ hotelSeleccionado }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 text-center space-y-4 py-12">
      <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-slate-800 text-lg md:text-xl">Formulario de Contraloría</h3>
        <p className="text-sm text-teal-700 font-semibold">{hotelSeleccionado}</p>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Este módulo está listo para recibir el cuestionario específico del grupo de Contraloría. Próximamente se integrarán las preguntas correspondientes aquí.
        </p>
      </div>
    </div>
  )
}

export default ContraloriaForm
