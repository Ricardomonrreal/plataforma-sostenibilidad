import React, { useState } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider, SelectInputField } from './FormComponents'

const RecursosHumanosForm = ({ hotelSeleccionado }) => {
  const [pobladoApoyo, setPobladoApoyo] = useState('')
  const [voluntariado, setVoluntariado] = useState('')

  const showQ8 = pobladoApoyo === 'Si';
  const showQ11 = voluntariado === 'Si';

  const getQNum = (qKey) => {
    let num = 8;
    if (qKey === 'q8') return showQ8 ? num : null;
    if (showQ8) num++;

    if (qKey === 'q9') return num;
    num++;

    if (qKey === 'q10') return num;
    num++;

    if (qKey === 'q11') return showQ11 ? num : null;
    if (showQ11) num++;

    if (qKey === 'q12') return num;
    num++;
    
    if (qKey === 'q13') return num;
    num++;

    if (qKey === 'q14') return num;
    num++;

    if (qKey === 'q15') return num;
    num++;

    if (qKey === 'q16') return num;
    num++;

    if (qKey === 'q17') return num;
    num++;

    if (qKey === 'q18') return num;
    num++;

    if (qKey === 'q19') return num;
    num++;

    if (qKey === 'q20') return num;
    num++;

    return num;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Sección I: Indicadores generales */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        }
        title="Indicadores generales Talento Humano"
        description="Una sección importante del estándar de EarthCheck es contabilizar con exactitud los colaboradores y usuarios del hotel durante el mes. Si algún dato aún no se mide, favor de empezar a hacerlo. Si requiere apoyo por favor contacte al departamento de Sostentabilidad."
      />
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Indicadores generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField label="5. Número de colaboradores del Club Vacacional que laboran dentro del hotel." subtitle="Personas" placeholder='0'/>
          <TextInputField label="6. Número de colaboradores de tiendas, concesiones y externos que laboran dentro del hotel."subtitle="Personas" placeholder='0' />
          <SelectInputField 
            label="7. ¿Cuentan con poblado de apoyo?" 
            options={["Si", "No"]} 
            placeholder="Seleccionar..." 
            onChange={(e) => setPobladoApoyo(e.target.value)} 
          />
          {showQ8 && (
            <TextInputField label={`${getQNum('q8')}. ¿Cuántos colaboradores residen en el poblado de apoyo?`} />
          )}
        </div>
      </div>
      
      {/* Sección II: Indicadores sociales*/}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        }
        title="Indicadores sociales"
        description="En esta sección compilaremos la información referente a indicadores sociales, que contabilizan el impacto positivo del hotel hacia su comunidad, tanto interna como externa. Favor de llenar esta sección con la información correspondiente al mes."
      />
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Indicadores sociales</h3>
        <div className="flex flex-col gap-6">
          <TextInputField label={`${getQNum('q9')}. ¿Cuántos eventos internos para colaboradores se organizaron durante el mes (listar)?`}/>
          <SelectInputField 
            label={`${getQNum('q10')}. ¿Se organizó alguna actividad de voluntariado durante el mes?`} 
            options={["Si", "No"]} 
            placeholder="Seleccionar..." 
            onChange={(e) => setVoluntariado(e.target.value)} 
          />
          {showQ11 && (
            <TextInputField label={`${getQNum('q11')}. Si la respuesta a la pregunta anterior fue 'si', favor de indicar qué actividad(es) se organizaron y el número total de horas de voluntariado de cada una de ellas.`} subtitle="Para obtener el total de horas de voluntariado, se debe usar la siguiente fórmula: Duración de la actividad x total de colaboradores que participaron en ella."/>
          )}
          <TextInputField label={`${getQNum('q12')}. ¿A cuánto asciende el monto donado a Fundación Lomas durante el mes?`} subtitle="Moneda nacional" placeholder='$0.00'/>
          <TextInputField label={`${getQNum('q13')}. Número de colaboradores en el programa de educación para adultos (programa interno o externo).`} subtitle="Personas" placeholder='0'/>
          <TextInputField label={`${getQNum('q14')}. Monto en efectivo donado a causas benéficas (especificar Fundación). `} subtitle="Moneda nacional (No considerar fundación)" placeholder='$0.00'/>
          <TextInputField label={`${getQNum('q15')}. Valor aproximado en dinero, de los donativos de blancos, activos fijos y otros donativos en especie.`} subtitle="Moneda nacional. Cálculo del monto que valdrían los donativos en especie, si estos hubieran sido vendidos (ej. Una sábana usada vale el 20% de su valor original)" placeholder='$0.00'/>
          <FileUploadField label={`${getQNum('q16')}. Favor de adjuntar la evidencia disponible de los eventos, donativos, campañas, calendario ambiental, capacitaciones y otras actividades del mes.`} subtitle="Puede ser el reporte mensual de evidencias de RRHH"/>
          <FileUploadField label={`${getQNum('q17')}. Adjunta el reporte de indicadores mensual`} subtitle="Rotación, distribución geográfica y demográfica, horas capacitación, etc." />
        </div>
      </div>

      {/* Sección III: Llenado */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        title="Datos de Llenado"
        description="Identificación de la persona responsable de la veracidad de los datos entregados."
      />

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Datos de llenado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField label={`${getQNum('q18')}. Nombre de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
          <TextInputField label={`${getQNum('q19')}. Puesto de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
          <div className="md:col-span-2">
            <TextInputField label={`${getQNum('q20')}. Correo electrónico`} placeholder="Escriba aquí" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecursosHumanosForm
