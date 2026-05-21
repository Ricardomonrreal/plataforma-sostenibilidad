import React from 'react'

const RecursosHumanosForm = ({ hotelSeleccionado }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 text-center space-y-4 py-12">
      <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-slate-800 text-lg md:text-xl">Formulario de Recursos Humanos</h3>
        <p className="text-sm text-teal-700 font-semibold">{hotelSeleccionado}</p>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Este módulo está listo para recibir el cuestionario específico del grupo de Recursos Humanos. Próximamente se integrarán las preguntas correspondientes aquí.
        </p>
      </div>
    </div>
  )
}

export default RecursosHumanosForm
