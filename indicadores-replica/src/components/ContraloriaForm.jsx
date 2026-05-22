import React, { useState } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard } from './FormComponents'

const columnasResiduos = [
  { key: 'organicos', label: '5. Orgánicos Generados', unit: 'Kg', placeholder: '0.00' },
  { key: 'inorganicos', label: '6. Inorgánicos Generados', unit: 'Kg', placeholder: '0.00' },
  { key: 'organicosgranja', label: '7. Orgánicos Generados Reutilización', unit: 'Kg', placeholder: '0.00' },
];

const ContraloriaForm = ({ hotelSeleccionado }) => {
  const [residuos, setResiduos] = useState({
    organicos: '',
    inorganicos: '',
    organicosgranja: ''
  })

  const [comentarios, setComentarios] = useState('')

  const handleCambioResiduos = (key, val) => {
    setResiduos(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Sección de Contraloría */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">
          Cuestionario de Contraloría ({hotelSeleccionado})
        </h2>
        
        <p className="text-xs text-teal-600 font-bold mb-4">
          Modifique este archivo en `src/components/ContraloriaForm.jsx` para ir agregando sus preguntas.
        </p>

        {/* Ejemplos de inputs de Contraloría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField 
            label="1. Observaciones Financieras y de Control del mes" 
            placeholder="Escriba aquí sus comentarios..." 
            isTextArea={true}
            value={comentarios}
            onChange={setComentarios}
          />
          <FileUploadField 
            label="2. Adjuntar reportes de auditoría o facturas de control" 
          />
        </div>
      </div>

      {/* Ejemplo de Tabla de Residuos */}
      <TableCaptureCard 
        title="Generación de Residuos (Contraloría)"
        subtitle="Muestra de captura en formato de tabla para datos numéricos de Contraloría"
        columns={columnasResiduos}
        values={residuos}
        onChange={handleCambioResiduos}
      />
    </div>
  )
}

export default ContraloriaForm
