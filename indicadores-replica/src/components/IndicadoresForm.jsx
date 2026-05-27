import React, { useState } from 'react'
import { SelectInputField } from './FormComponents'
import MantenimientoForm from './MantenimientoForm'
import SeguridadForm from './SeguridadForm'
import RecursosHumanosForm from './RecursosHumanosForm'
import ContraloriaForm from './ContraloriaForm'

const IndicadoresForm = () => {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('')
  const [hotelSeleccionado, setHotelSeleccionado] = useState('')
  const [anoSeleccionado, setAnoSeleccionado] = useState('')
  const [mesSeleccionado, setMesSeleccionado] = useState('')

  const manejarCambioGrupo = (e) => {
    setGrupoSeleccionado(e.target.value)
  }

  const manejarCambioHotel = (e) => {
    setHotelSeleccionado(e.target.value)
  }

  const manejarCambioAno = (e) => {
    setAnoSeleccionado(e.target.value)
  }

  const manejarCambioMes = (e) => {
    setMesSeleccionado(e.target.value)
  }

  return (
    <div className="bg-slate-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl w-full mx-auto space-y-6 md:space-y-8">
        
        {/* Cabecera de Botones de Acción */}
        <div className="w-full flex flex-col sm:flex-row justify-end gap-3 mb-2">
          <button className="bg-teal-600 text-white rounded-xl px-5 py-2.5 hover:bg-teal-700 transition-all shadow-sm font-medium focus:ring-4 focus:ring-teal-100" type="button">Descargar archivos</button>
          <div className="cursor-pointer px-5 py-2.5 bg-white text-teal-700 rounded-xl flex justify-center items-center gap-2 hover:bg-teal-50 transition-all font-medium border border-teal-100/50 shadow-sm">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Historial
          </div>
        </div> 

        {/* Tarjeta de Datos generales */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
          <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Datos generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <SelectInputField 
              label="1. Grupo"
              placeholder="Seleccione a qué grupo va a capturar"
              options={['Seguridad', 'Mantenimiento', 'Recursos Humanos', 'Contraloría']}
              onChange={manejarCambioGrupo}
            />
            <SelectInputField 
              label="2. Hotel (México)"
              placeholder="Seleccione el hotel"
              options={['El Dorado Royale (EDR)', 'El Dorado Seaside Suites (EDS)', 'El Dorado Maroma (EDM)', 'Generations Riviera Maya (GRM)', 'Corporativo (CORP)', 'Maison México Roma', 'Maroma Beach']}
              onChange={manejarCambioHotel}
            />
            <SelectInputField 
              label="3. Año de Reporte" 
              placeholder="Seleccione el año" 
              options={['2023', '2024', '2025', '2026']} 
              onChange={manejarCambioAno}
            />
            <SelectInputField 
              label="4. Mes de Reporte" 
              placeholder="Seleccione el mes" 
              options={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']} 
              onChange={manejarCambioMes}
            />
          </div>
        </div>

        {/* Carga Condicional del Formulario de Captura por Grupo */}
        {hotelSeleccionado && grupoSeleccionado === 'Mantenimiento' && (
          <MantenimientoForm 
            hotelSeleccionado={hotelSeleccionado} 
            anoSeleccionado={anoSeleccionado} 
            mesSeleccionado={mesSeleccionado} 
            grupoSeleccionado={grupoSeleccionado} 
          />
        )}

        {hotelSeleccionado && grupoSeleccionado === 'Seguridad' && (
          <SeguridadForm 
            hotelSeleccionado={hotelSeleccionado} 
            anoSeleccionado={anoSeleccionado} 
            mesSeleccionado={mesSeleccionado} 
            grupoSeleccionado={grupoSeleccionado} 
          />
        )}

        {hotelSeleccionado && grupoSeleccionado === 'Recursos Humanos' && (
          <RecursosHumanosForm 
            hotelSeleccionado={hotelSeleccionado} 
            anoSeleccionado={anoSeleccionado} 
            mesSeleccionado={mesSeleccionado} 
            grupoSeleccionado={grupoSeleccionado} 
          />
        )}

        {hotelSeleccionado && grupoSeleccionado === 'Contraloría' && (
          <ContraloriaForm 
            hotelSeleccionado={hotelSeleccionado} 
            anoSeleccionado={anoSeleccionado} 
            mesSeleccionado={mesSeleccionado} 
            grupoSeleccionado={grupoSeleccionado} 
          />
        )}

        {/* Mensaje Informativo de Selección Inicial */}
        {(!hotelSeleccionado || !grupoSeleccionado) && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-3 py-12">
            <div className="mx-auto w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="font-semibold text-slate-800 text-base md:text-lg">Seleccione un Grupo y Hotel</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Para visualizar y capturar el cuestionario correspondiente, por favor seleccione el grupo operativo y el hotel a reportar en la tarjeta de Datos Generales.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default IndicadoresForm
