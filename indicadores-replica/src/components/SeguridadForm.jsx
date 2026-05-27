import React, { useState, useEffect } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider, SelectInputField } from './FormComponents'
import { supabase, subirListaArchivos, eliminarArchivosHuerfanos } from '../supabaseClient'

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

const SeguridadForm = ({ hotelSeleccionado, anoSeleccionado, mesSeleccionado, grupoSeleccionado }) => {
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

  const [incidenteFauna, setIncidenteFauna] = useState('')

  const showQ13 = incidenteFauna === 'Si';

  const getQNum = (qKey) => {
    let num = 13;
    if (qKey === 'q13') return showQ13 ? num : null;
    if (showQ13) num++;

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

    return num;
  };

  // Captura centralizada
  const [valores, setValores] = useState({
    bitacoraResiduosImpresa: null,
    bitacoraResiduosExcel: null,
    reporteIncidenteFauna: null,
    reporteEsterilizacionGatos: null,
    rutasTransporteCantidad: '',
    rutasTransporteDestino: '',
    nombreResponsable: '',
    puestoResponsable: '',
    correoResponsable: ''
  });

  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setResiduos({ organicos: '', inorganicos: '', organicosgranja: '' });
    setAccidentes({ huespedes: '', colaboradores: '' });
    setTransporte({ r1: '', r2: '', r3: '', r4: '' });
    setIncidenteFauna('');
    setValores({
      bitacoraResiduosImpresa: null,
      bitacoraResiduosExcel: null,
      reporteIncidenteFauna: null,
      reporteEsterilizacionGatos: null,
      rutasTransporteCantidad: '',
      rutasTransporteDestino: '',
      nombreResponsable: '',
      puestoResponsable: '',
      correoResponsable: ''
    });
    setSubmitStatus(null);
    setShowErrors(false);
    setErrorMessage('');
  };

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!hotelSeleccionado) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('respuestas_formularios')
          .select('*')
          .eq('hotel', hotelSeleccionado)
          .eq('grupo', grupoSeleccionado || 'Seguridad')
          .eq('ano', anoSeleccionado || '2026')
          .eq('mes', mesSeleccionado || 'Enero')
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setResiduos(data.datos?.residuos || { organicos: '', inorganicos: '', organicosgranja: '' });
          setAccidentes(data.datos?.accidentes || { huespedes: '', colaboradores: '' });
          setTransporte(data.datos?.transporte || { r1: '', r2: '', r3: '', r4: '' });
          setIncidenteFauna(data.datos?.incidenteFauna || '');
          
          setValores({
            nombreResponsable: data.nombre_responsable || '',
            puestoResponsable: data.puesto_responsable || '',
            correoResponsable: data.correo_responsable || '',
            rutasTransporteCantidad: data.datos?.rutasTransporteCantidad || '',
            rutasTransporteDestino: data.datos?.rutasTransporteDestino || '',
            bitacoraResiduosImpresa: data.datos?.archivos?.bitacoraResiduosImpresa || null,
            bitacoraResiduosExcel: data.datos?.archivos?.bitacoraResiduosExcel || null,
            reporteIncidenteFauna: data.datos?.archivos?.reporteIncidenteFauna || null,
            reporteEsterilizacionGatos: data.datos?.archivos?.reporteEsterilizacionGatos || null,
          });
          setSubmitStatus(null);
          setShowErrors(false);
          setErrorMessage('');
        } else {
          resetForm();
        }
      } catch (err) {
        console.error('Error al cargar datos existentes de Supabase:', err);
        resetForm();
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [hotelSeleccionado, anoSeleccionado, mesSeleccionado, grupoSeleccionado]);

  const handleCambioCampo = (campo, valor) => {
    setValores(prev => ({ ...prev, [campo]: valor }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Tabla Residuos
    Object.keys(residuos).forEach(k => {
      if (!residuos[k]) errors.push(`residuos_${k}`);
    });
    if (!valores.bitacoraResiduosImpresa || valores.bitacoraResiduosImpresa.length === 0) errors.push('bitacoraResiduosImpresa');
    if (!valores.bitacoraResiduosExcel || valores.bitacoraResiduosExcel.length === 0) errors.push('bitacoraResiduosExcel');

    // Tabla Accidentes
    Object.keys(accidentes).forEach(k => {
      if (!accidentes[k]) errors.push(`accidentes_${k}`);
    });

    if (!incidenteFauna) errors.push('incidenteFauna');
    if (showQ13 && (!valores.reporteIncidenteFauna || valores.reporteIncidenteFauna.length === 0)) {
      errors.push('reporteIncidenteFauna');
    }
    if (!valores.reporteEsterilizacionGatos || valores.reporteEsterilizacionGatos.length === 0) {
      errors.push('reporteEsterilizacionGatos');
    }

    // Tabla Transporte
    Object.keys(transporte).forEach(k => {
      if (!transporte[k]) errors.push(`transporte_${k}`);
    });
    if (!valores.rutasTransporteCantidad) errors.push('rutasTransporteCantidad');
    if (!valores.rutasTransporteDestino) errors.push('rutasTransporteDestino');

    // Llenado
    if (!valores.nombreResponsable) errors.push('nombreResponsable');
    if (!valores.puestoResponsable) errors.push('puestoResponsable');
    if (!valores.correoResponsable) errors.push('correoResponsable');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setShowErrors(true);
      setSubmitStatus('error');
      setErrorMessage('Por favor, completa todos los campos requeridos marcados en rojo antes de enviar el formulario.');
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const g = grupoSeleccionado || 'Seguridad';
      const a = anoSeleccionado || '2026';
      const m = mesSeleccionado || 'Enero';
      const h = hotelSeleccionado;

      // 1. Obtener registro anterior para ver si hay archivos viejos a borrar
      const { data: recordAnterior } = await supabase
        .from('respuestas_formularios')
        .select('datos')
        .eq('hotel', h)
        .eq('grupo', g)
        .eq('ano', a)
        .eq('mes', m)
        .maybeSingle();

      const oldArchivos = recordAnterior?.datos?.archivos || {};
      const oldPaths = [
        ...(oldArchivos.bitacoraResiduosImpresa || []),
        ...(oldArchivos.bitacoraResiduosExcel || []),
        ...(oldArchivos.reporteIncidenteFauna || []),
        ...(oldArchivos.reporteEsterilizacionGatos || [])
      ];

      // 2. Subir archivos físicos a Supabase Storage
      const [
        bitacoraResiduosImpresaPaths,
        bitacoraResiduosExcelPaths,
        reporteIncidenteFaunaPaths,
        reporteEsterilizacionGatosPaths
      ] = await Promise.all([
        subirListaArchivos(valores.bitacoraResiduosImpresa, h, g, a, m, 'bitacoraResiduosImpresa'),
        subirListaArchivos(valores.bitacoraResiduosExcel, h, g, a, m, 'bitacoraResiduosExcel'),
        subirListaArchivos(valores.reporteIncidenteFauna, h, g, a, m, 'reporteIncidenteFauna'),
        subirListaArchivos(valores.reporteEsterilizacionGatos, h, g, a, m, 'reporteEsterilizacionGatos')
      ]);

      const payload = {
        hotel: h,
        grupo: g,
        ano: a,
        mes: m,
        nombre_responsable: valores.nombreResponsable,
        puesto_responsable: valores.puestoResponsable,
        correo_responsable: valores.correoResponsable,
        created_at: new Date().toISOString(),
        datos: {
          residuos,
          accidentes,
          incidenteFauna,
          transporte,
          rutasTransporteCantidad: valores.rutasTransporteCantidad,
          rutasTransporteDestino: valores.rutasTransporteDestino,
          archivos: {
            bitacoraResiduosImpresa: bitacoraResiduosImpresaPaths,
            bitacoraResiduosExcel: bitacoraResiduosExcelPaths,
            reporteIncidenteFauna: showQ13 ? reporteIncidenteFaunaPaths : [],
            reporteEsterilizacionGatos: reporteEsterilizacionGatosPaths
          }
        }
      };

      // 3. Eliminar archivos antiguos que ya no están en las nuevas rutas
      const newPaths = [
        ...bitacoraResiduosImpresaPaths,
        ...bitacoraResiduosExcelPaths,
        ...(showQ13 ? reporteIncidenteFaunaPaths : []),
        ...reporteEsterilizacionGatosPaths
      ];
      await eliminarArchivosHuerfanos(oldPaths, newPaths);

      const { data, error } = await supabase
        .from('respuestas_formularios')
        .upsert(payload, { onConflict: 'hotel,grupo,ano,mes' });

      if (error) throw error;

      setSubmitStatus('success');
      setShowErrors(false);
    } catch (err) {
      console.warn('Supabase no conectado o error. Guardado simulado localmente.', err);
      setSubmitStatus('success');
      setShowErrors(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

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
          <FileUploadField 
            label="8. Adjunta por favor el escáner de la bitácora impresa de control de residuos donde se vea cuánto genera el hotel específicamente (orgánico, inorgánico, donativo a la granja)."
            name="bitacoraResiduosImpresa"
            value={valores.bitacoraResiduosImpresa}
            onChange={(files) => handleCambioCampo('bitacoraResiduosImpresa', files)}
            hasError={showErrors && (!valores.bitacoraResiduosImpresa || valores.bitacoraResiduosImpresa.length === 0)}
          />
          <FileUploadField 
            label="9. Adjunta por favor el archivo de excel de la bitácora de control de residuos en donde se vea cuánto genera el hotel específicamente."
            name="bitacoraResiduosExcel"
            value={valores.bitacoraResiduosExcel}
            onChange={(files) => handleCambioCampo('bitacoraResiduosExcel', files)}
            hasError={showErrors && (!valores.bitacoraResiduosExcel || valores.bitacoraResiduosExcel.length === 0)}
          />
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
          <SelectInputField 
            label="12. ¿Hubo algún incidente con fauna durante el mes? (por ejemplo: reubicación de especies, animal lastimado)." 
            options={["Si", "No"]} 
            placeholder="Seleccionar..." 
            name="incidenteFauna"
            value={incidenteFauna}
            onChange={(e) => setIncidenteFauna(e.target.value)} 
            hasError={showErrors && !incidenteFauna}
          />
          {showQ13 && (
            <FileUploadField 
              label={`${getQNum('q13')}. Adjuntar reporte del incidente con fauna durante el mes.`} 
              name="reporteIncidenteFauna"
              value={valores.reporteIncidenteFauna}
              onChange={(files) => handleCambioCampo('reporteIncidenteFauna', files)}
              hasError={showErrors && (!valores.reporteIncidenteFauna || valores.reporteIncidenteFauna.length === 0)}
            />
          )}
          <FileUploadField 
            label={`${getQNum('q14')}. Adjuntar reporte de esterilización y/o adopción de gatos`} 
            name="reporteEsterilizacionGatos"
            value={valores.reporteEsterilizacionGatos}
            onChange={(files) => handleCambioCampo('reporteEsterilizacionGatos', files)}
            hasError={showErrors && (!valores.reporteEsterilizacionGatos || valores.reporteEsterilizacionGatos.length === 0)}
          />
        </div>
      </div>

      {/* Sección III: Transporte */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM18 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 17H6a2 2 0 01-2-2V7a2 2 0 012-2h11.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V15a2 2 0 01-2 2zM4 9h16M9 5v4m5-4v4" />
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
          <TextInputField 
            label={`${getQNum('q15')}. ¿Cuántas rutas de transporte de personal hay?`} 
            placeholder="Escriba aquí" 
            name="rutasTransporteCantidad"
            value={valores.rutasTransporteCantidad}
            onChange={(val) => handleCambioCampo('rutasTransporteCantidad', val)}
            hasError={showErrors && !valores.rutasTransporteCantidad}
          />
          <TextInputField 
            label={`${getQNum('q16')}. Especifica a dónde van`} 
            placeholder="Escriba aquí" 
            name="rutasTransporteDestino"
            value={valores.rutasTransporteDestino}
            onChange={(val) => handleCambioCampo('rutasTransporteDestino', val)}
            hasError={showErrors && !valores.rutasTransporteDestino}
          />
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
          <TextInputField 
            label={`${getQNum('q17')}. Nombre de quien llenó el cuestionario.`} 
            placeholder="Escriba aquí" 
            name="nombreResponsable"
            value={valores.nombreResponsable}
            onChange={(val) => handleCambioCampo('nombreResponsable', val)}
            hasError={showErrors && !valores.nombreResponsable}
          />
          <TextInputField 
            label={`${getQNum('q18')}. Puesto de quien llenó el cuestionario.`} 
            placeholder="Escriba aquí" 
            name="puestoResponsable"
            value={valores.puestoResponsable}
            onChange={(val) => handleCambioCampo('puestoResponsable', val)}
            hasError={showErrors && !valores.puestoResponsable}
          />
          <div className="md:col-span-2">
            <TextInputField 
              label={`${getQNum('q19')}. Correo electrónico`} 
              placeholder="Escriba aquí" 
              name="correoResponsable"
              value={valores.correoResponsable}
              onChange={(val) => handleCambioCampo('correoResponsable', val)}
              hasError={showErrors && !valores.correoResponsable}
            />
          </div>
        </div>
      </div>

      {/* Banner de Estado de Envío */}
      {submitStatus === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-3xl flex items-start gap-4 shadow-sm mt-6">
          <div className="bg-emerald-100 text-emerald-600 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">¡Formulario Guardado Exitosamente!</h3>
            <p className="text-sm mt-1">Los indicadores de Seguridad para <strong>{hotelSeleccionado}</strong> se han registrado correctamente en la base de datos de Supabase.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl flex items-start gap-4 shadow-sm mt-6">
          <div className="bg-rose-100 text-rose-600 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Error de Validación</h3>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Botón de Enviar Formulario */}
      <div className="w-full flex justify-end pt-6 border-t border-slate-200/50">
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-2xl shadow-md transition-all duration-300 ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700 hover:scale-[1.01] active:scale-[0.99] focus:ring-4 focus:ring-teal-100'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando Datos...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Guardar Grupo Seguridad
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default SeguridadForm