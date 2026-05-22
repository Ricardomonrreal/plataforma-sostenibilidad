import React, { useState } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider } from './FormComponents'

const columnasResiduos = [
  { key: 'organicos', label: '5. Orgánicos Generados', unit: 'Kg', placeholder: '0.00' },
  { key: 'inorganicos', label: '6. Inorgánicos Generados', unit: 'Kg', placeholder: '0.00' },
  { key: 'organicosgranja', label: '7. Orgánicos Generados Reutilización', unit: 'Kg', placeholder: '0.00' },
];

const columnasAccidentes = [
  { key: 'huespedes', label: '10. Accidentes de huéspedes', unit: 'Número', placeholder: '0' },
  { key: 'colaboradores', label: '11. Accidentes de colaboradores', unit: 'Número', placeholder: '0' },
];

const columnasTransporte = [
  { key: 'r1', label: 'Ruta 1', unit: 'Personas', placeholder: '0' },
  { key: 'r2', label: 'Ruta 2', unit: 'Personas', placeholder: '0' },
  { key: 'r3', label: 'Ruta 3', unit: 'Personas', placeholder: '0' },
  { key: 'r4', label: 'Ruta 4', unit: 'Personas', placeholder: '0' },
];

const SeguridadForm = ({ hotelSeleccionado }) => {
  const [residuos, setResiduos] = useState({
    organicos: '',
    inorganicos: '',
    organicosgranja: ''
  })

  const [accidentes, setAccidentes] = useState({
    huespedes: '',
    colaboradores: ''
  })
  
  const [transporte, setTransporte] = useState({
    r1: '',
    r2: '',
    r3: '',
    r4: ''
  })

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Sección I: Residuos */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        }
        title="Gestión de Residuos"
        description="Captura de datos mensuales de residuos generados y carga de bitácoras de respaldo."
      />

      <div className="space-y-6">
        <TableCaptureCard
          title="Generación de residuos"
          subtitle= "En esta sección se recopilarán los datos referentes a la producción, manejo y disposición de los residuos generados dentro del hotel. Favor de responder con la mayor exactitud posible y tener el respaldo de bitácoras y/o manifiestos organizados y disponibles para auditoría en el momento que sean requeridos."
          columns={columnasResiduos}
          values={{
            organicos: residuos.organicos,
            inorganicos: residuos.inorganicos,
            organicosgranja: residuos.organicosgranja,
          }}
          onChange={(key, val) => {
            if (key === 'organicos') setResiduos(prev => ({ ...prev, organicos: val }))
            if (key === 'inorganicos') setResiduos(prev => ({ ...prev, inorganicos: val }))
            if (key === 'organicosgranja') setResiduos(prev => ({ ...prev, organicosgranja: val }))
          }}
        />
      </div>
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Soportes de Generación de Residuos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadField label="8. Adjunta por favor el escáner de la bitácora impresa de control de residuos donde se vea cuánto genera el hotel específicamente (orgánico, inorgánico, donativo a la granja)."/>
          <FileUploadField label="9. Adjunta por favor el archivo de excel de la bitácora de control de residuos en donde se vea cuánto genera el hotel específicamente."/>
        </div>
      </div>

      {/* Sección II: Seguridad y Accidentes */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
        title="Seguridad e Incidentes con Fauna"
        description="Información de accidentes internos y control de situaciones relacionadas con fauna local."
      />

      <div className="space-y-6">
        <TableCaptureCard
          title="Accidentes | Accidents"
          subtitle= "En esta sección se compilarán datos generales de los accidentes reportados durante el mes. Favor de llenar de acuerdo con los reportes internos."
          columns={columnasAccidentes}
          values={{
            huespedes: accidentes.huespedes,
            colaboradores: accidentes.colaboradores,
          }}
          onChange={(key, val) => {
            if (key === 'huespedes') setAccidentes(prev => ({ ...prev, huespedes: val }))
            if (key === 'colaboradores') setAccidentes(prev => ({ ...prev, colaboradores: val }))
          }}
        />
      </div>
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Incidentes con fauna</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField label="12. ¿Hubo algún incidente con fauna durante el mes? (por ejemplo: reubicación de especies, animal lastim13o" placeholder="Escriba aquí" isTextArea={true} />
          <FileUploadField label="13. Adjuntar reporte del incidente con fauna durante el mes." />
          <FileUploadField label="14. Adjuntar reporte de esterilización y/o adopción de gatos" />
        </div>
      </div>

      {/* Sección III: Transporte */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="5" width="20" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M7 16a2 2 0 100 4 2 2 0 000-4zM17 16a2 2 0 100 4 2 2 0 000-4z" fill="currentColor" />
          </svg>
        }
        title="Transporte de Personal"
        description="Seguimiento de rutas y uso de vehículos compartidos para estimar la huella de carbono."
      />

      <div className="space-y-6">
        <TableCaptureCard 
          title="Transporte de Personal"
          subtitle= "En esta sección se solicitará información acerca de la cantidad de personal que usa el transporte del hotel y son beneficiados por este servicio. Esto sirve para calcular la huella de carbono de nuestro hotel por transportación de personal."
          columns={columnasTransporte}
          values={{
            r1: transporte.r1,
            r2: transporte.r2,
            r3: transporte.r3,
            r4: transporte.r4,
          }}
          onChange={(key, val) => {
            if (key === 'r1') setTransporte(prev => ({ ...prev, r1: val }))
            if (key === 'r2') setTransporte(prev => ({ ...prev, r2: val }))
            if (key === 'r3') setTransporte(prev => ({ ...prev, r3: val }))
            if (key === 'r4') setTransporte(prev => ({ ...prev, r4: val }))
          }}
        >
          <TextInputField label="15. ¿Cuántas rutas de transporte de personal hay?" placeholder="Escriba aquí" />
          <TextInputField label="16. Especifica a dónde van" placeholder="Escriba aquí" />
        </TableCaptureCard>
      </div>

      {/* Sección IV: Llenado */}
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
          <TextInputField label="17. Nombre de quien llenó el cuestionario." placeholder="Escriba aquí" />
          <TextInputField label="18. Puesto de quien llenó el cuestionario." placeholder="Escriba aquí" />
          <div className="md:col-span-2">
            <TextInputField label="19. Correo electrónico" placeholder="Escriba aquí" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeguridadForm
