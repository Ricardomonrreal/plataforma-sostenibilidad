import React, { useState } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider, SelectInputField } from './FormComponents'

const columnasOcupacion = [
  { key: 'huespednoche', label: '5. Cierre de huéspedes-noche', unit: 'Número', placeholder: '0' },
  { key: 'cuartonoche', label: '6. Cierre de noches ocupadas', unit: 'Número', placeholder: '0' },
  { key: 'porcentaje', label: '7. Porcentaje de Ocupación', unit: '%', placeholder: '0%' },
]
const ContraloriaForm = ({ hotelSeleccionado }) => {
  const [envio, setEnvio] = useState('')

  const [ocupacion, setOcupacion] = useState({
    huespednoche: '',
    cuartonoche: '',
    porcentaje: ''
  })

  const showReciclables = envio === 'Si';

  const getQNum = (qKey) => {
    let num = 17;
    if (qKey === 'q17' || qKey === 'q18') {
      return showReciclables ? (qKey === 'q17' ? 17 : 18) : null;
    }
    if (showReciclables) {
      num += 2;
    }
    
    if (qKey === 'q19') return num;
    num++;

    if (qKey === 'q20') return num;
    num++;

    if (qKey === 'q21') return num;
    num++;

    return num;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Sección I: Ocupación de huéspedes */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        title="Gestión de Ocupación por huéspedes"
        description="Captura de datos mensuales de ocupación."
      />
      <div className="space-y-6">
        <TableCaptureCard
          title="Ocupación por huéspedes"
          subtitle= "En esta sección se recopilarán los datos referentes a la ocupación del hotel. Favor de responder con la mayor exactitud posible y tener el respaldo de bitácoras y/o manifiestos organizados y disponibles para auditoría en el momento que sean requeridos."
          columns={columnasOcupacion}
          values={{
            huespednoche: ocupacion.huespednoche,
            cuartonoche: ocupacion.cuartonoche,
            porcentaje: ocupacion.porcentaje,
          }}
          onChange={(key, val) => {
            if (key === 'huespednoche') setOcupacion(prev => ({ ...prev, huespednoche: val }))
            if (key === 'cuartonoche') setOcupacion(prev => ({ ...prev, cuartonoche: val }))
            if (key === 'porcentaje') setOcupacion(prev => ({ ...prev, porcentaje: val }))
          }}
        />
      </div>

      {/* Sección II: Control de resiudos reciclables */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        title="Control de residuos reciclables"
        description="En esta sección compilaremos la información referente a los volúmenes de recolección de residuos reciclables y/o valorizables. Se cargará el archivo de control provisto por el área de Sustentabilidad con la información de los manifiestos."
      />
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Indicadores sociales</h3>
        <div className="flex flex-col gap-6">
          <TextInputField label= "8. ¿Cuántas recolecciones de residuos RECICLABLES hubo en el mes?"/>
          <TextInputField label= "9. ¿Hubo algún incidente durante las recolecciones de material RECICLABLE?"/>
          <FileUploadField label="10. Adjunta escaneados los manifiestos o recibos de recolección de RESIDUOS RECICLABLES del mes."/>
          <FileUploadField label="11. Adjunta el formato de control de Residuos Reciclables, lleno con la información del mes."/>
          <TextInputField label= "12. Número de day pass vendidos en el mes | Number of day passes sold in the month" subtitle="Número" placeholder='0'/>
          <TextInputField label= "13. Pregunta para ALMACÉN: ¿Cuántos litros de aceite vegetal comestible salieron de almacén durante el mes? (Número de contenedores multiplicado por la capacidad de los mismos)." subtitle="Litros" placeholder='0'/>
          <FileUploadField label="14. Adjunta los manifiestos de recolección de ACEITE Y MANTECA VEGETAL del mes."/>
          <FileUploadField label="15. PREGUNTA PARA ALMACEN: Adjunta un reporte de las salidas de almacén por departamento del mes."/>
          <SelectInputField 
            label= "16. En este mes, ¿se envió a reciclar equipos electrónicos?" 
            options={["Si", "No"]} 
            placeholder="Seleccionar..." 
            onChange={(e) => setEnvio(e.target.value)} 
          />
          {showReciclables && (
            <>
              <TextInputField label={`${getQNum('q17')}. Especifica cuántos kilogramos.`} subtitle="kilogramos" placeholder='0.00'/>
              <FileUploadField label={`${getQNum('q18')}. Adjunta los manifiestos de recolección de ELECTRÓNICOS del mes.`}/>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Datos de llenado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField label={`${getQNum('q19')}. Nombre de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
          <TextInputField label={`${getQNum('q20')}. Puesto de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
          <div className="md:col-span-2">
            <TextInputField label={`${getQNum('q21')}. Correo electrónico`} placeholder="Escriba aquí" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContraloriaForm
