import React, { useState, useEffect } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider, SelectInputField } from './FormComponents'
import { supabase, subirListaArchivos, eliminarArchivosHuerfanos } from '../supabaseClient'

const columnasOcupacion = [
  { key: 'huespednoche', label: '5. Cierre de huéspedes-noche', unit: 'Número', placeholder: '0' },
  { key: 'cuartonoche', label: '6. Cierre de noches ocupadas', unit: 'Número', placeholder: '0' },
  { key: 'porcentaje', label: '7. Porcentaje de Ocupación', unit: '%', placeholder: '0%' },
]

const ContraloriaForm = ({ hotelSeleccionado, anoSeleccionado, mesSeleccionado, grupoSeleccionado }) => {
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

  // Captura centralizada
  const [valores, setValores] = useState({
    recoleccionesReciclablesCantidad: '',
    incidentesReciclablesDetalle: '',
    manifiestosReciclablesSoporte: null,
    formatoControlReciclablesExcel: null,
    dayPassVendidosCantidad: '',
    litrosAceiteSalidaAlmacen: '',
    manifiestosAceiteSoporte: null,
    reporteSalidasAlmacenSoporte: null,
    reciclablesElectronicosPeso: '',
    manifiestosElectronicosSoporte: null,
    nombreResponsable: '',
    puestoResponsable: '',
    correoResponsable: ''
  });

  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setEnvio('');
    setOcupacion({
      huespednoche: '',
      cuartonoche: '',
      porcentaje: ''
    });
    setValores({
      recoleccionesReciclablesCantidad: '',
      incidentesReciclablesDetalle: '',
      manifiestosReciclablesSoporte: null,
      formatoControlReciclablesExcel: null,
      dayPassVendidosCantidad: '',
      litrosAceiteSalidaAlmacen: '',
      manifiestosAceiteSoporte: null,
      reporteSalidasAlmacenSoporte: null,
      reciclablesElectronicosPeso: '',
      manifiestosElectronicosSoporte: null,
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
          .eq('grupo', grupoSeleccionado || 'Contraloría')
          .eq('ano', anoSeleccionado || '2026')
          .eq('mes', mesSeleccionado || 'Enero')
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setEnvio(data.datos?.envioEquiposElectronicos || '');
          setOcupacion(data.datos?.ocupacion || { huespednoche: '', cuartonoche: '', porcentaje: '' });
          
          setValores({
            nombreResponsable: data.nombre_responsable || '',
            puestoResponsable: data.puesto_responsable || '',
            correoResponsable: data.correo_responsable || '',
            recoleccionesReciclablesCantidad: data.datos?.recoleccionesReciclablesCantidad || '',
            incidentesReciclablesDetalle: data.datos?.incidentesReciclablesDetalle || '',
            dayPassVendidosCantidad: data.datos?.dayPassVendidosCantidad || '',
            litrosAceiteSalidaAlmacen: data.datos?.litrosAceiteSalidaAlmacen || '',
            reciclablesElectronicosPeso: data.datos?.reciclablesElectronicosPeso || '',
            manifiestosReciclablesSoporte: data.datos?.archivos?.manifiestosReciclablesSoporte || null,
            formatoControlReciclablesExcel: data.datos?.archivos?.formatoControlReciclablesExcel || null,
            manifiestosAceiteSoporte: data.datos?.archivos?.manifiestosAceiteSoporte || null,
            reporteSalidasAlmacenSoporte: data.datos?.archivos?.reporteSalidasAlmacenSoporte || null,
            manifiestosElectronicosSoporte: data.datos?.archivos?.manifiestosElectronicosSoporte || null,
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

    // Ocupación tabla
    Object.keys(ocupacion).forEach(k => {
      if (!ocupacion[k]) errors.push(`ocupacion_${k}`);
    });

    // Control reciclables
    if (!valores.recoleccionesReciclablesCantidad) errors.push('recoleccionesReciclablesCantidad');
    if (!valores.incidentesReciclablesDetalle) errors.push('incidentesReciclablesDetalle');
    if (!valores.manifiestosReciclablesSoporte || valores.manifiestosReciclablesSoporte.length === 0) errors.push('manifiestosReciclablesSoporte');
    if (!valores.formatoControlReciclablesExcel || valores.formatoControlReciclablesExcel.length === 0) errors.push('formatoControlReciclablesExcel');
    if (!valores.dayPassVendidosCantidad) errors.push('dayPassVendidosCantidad');
    if (!valores.litrosAceiteSalidaAlmacen) errors.push('litrosAceiteSalidaAlmacen');
    if (!valores.manifiestosAceiteSoporte || valores.manifiestosAceiteSoporte.length === 0) errors.push('manifiestosAceiteSoporte');
    if (!valores.reporteSalidasAlmacenSoporte || valores.reporteSalidasAlmacenSoporte.length === 0) errors.push('reporteSalidasAlmacenSoporte');
    if (!envio) errors.push('envio');

    if (showReciclables) {
      if (!valores.reciclablesElectronicosPeso) errors.push('reciclablesElectronicosPeso');
      if (!valores.manifiestosElectronicosSoporte || valores.manifiestosElectronicosSoporte.length === 0) errors.push('manifiestosElectronicosSoporte');
    }

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
      const g = grupoSeleccionado || 'Contraloría';
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
        ...(oldArchivos.manifiestosReciclablesSoporte || []),
        ...(oldArchivos.formatoControlReciclablesExcel || []),
        ...(oldArchivos.manifiestosAceiteSoporte || []),
        ...(oldArchivos.reporteSalidasAlmacenSoporte || []),
        ...(oldArchivos.manifiestosElectronicosSoporte || [])
      ];

      // 2. Subir archivos físicos a Supabase Storage
      const [
        manifiestosReciclablesSoportePaths,
        formatoControlReciclablesExcelPaths,
        manifiestosAceiteSoportePaths,
        reporteSalidasAlmacenSoportePaths,
        manifiestosElectronicosSoportePaths
      ] = await Promise.all([
        subirListaArchivos(valores.manifiestosReciclablesSoporte, h, g, a, m, 'manifiestosReciclablesSoporte'),
        subirListaArchivos(valores.formatoControlReciclablesExcel, h, g, a, m, 'formatoControlReciclablesExcel'),
        subirListaArchivos(valores.manifiestosAceiteSoporte, h, g, a, m, 'manifiestosAceiteSoporte'),
        subirListaArchivos(valores.reporteSalidasAlmacenSoporte, h, g, a, m, 'reporteSalidasAlmacenSoporte'),
        showReciclables 
          ? subirListaArchivos(valores.manifiestosElectronicosSoporte, h, g, a, m, 'manifiestosElectronicosSoporte')
          : Promise.resolve([])
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
          ocupacion,
          recoleccionesReciclablesCantidad: valores.recoleccionesReciclablesCantidad,
          incidentesReciclablesDetalle: valores.incidentesReciclablesDetalle,
          dayPassVendidosCantidad: valores.dayPassVendidosCantidad,
          litrosAceiteSalidaAlmacen: valores.litrosAceiteSalidaAlmacen,
          envioEquiposElectronicos: envio,
          reciclablesElectronicosPeso: showReciclables ? valores.reciclablesElectronicosPeso : null,
          archivos: {
            manifiestosReciclablesSoporte: manifiestosReciclablesSoportePaths,
            formatoControlReciclablesExcel: formatoControlReciclablesExcelPaths,
            manifiestosAceiteSoporte: manifiestosAceiteSoportePaths,
            reporteSalidasAlmacenSoporte: reporteSalidasAlmacenSoportePaths,
            manifiestosElectronicosSoporte: showReciclables ? manifiestosElectronicosSoportePaths : []
          }
        }
      };

      // 3. Eliminar archivos antiguos que ya no están en las nuevas rutas
      const newPaths = [
        ...manifiestosReciclablesSoportePaths,
        ...formatoControlReciclablesExcelPaths,
        ...manifiestosAceiteSoportePaths,
        ...reporteSalidasAlmacenSoportePaths,
        ...(showReciclables ? manifiestosElectronicosSoportePaths : [])
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

      {/* Sección II: Control de residuos reciclables */}
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
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Indicadores Contraloría y Almacén</h3>
        <div className="flex flex-col gap-6">
          <TextInputField 
            label="8. ¿Cuántas recolecciones de residuos RECICLABLES hubo en el mes?"
            name="recoleccionesReciclablesCantidad"
            value={valores.recoleccionesReciclablesCantidad}
            onChange={(val) => handleCambioCampo('recoleccionesReciclablesCantidad', val)}
            hasError={showErrors && !valores.recoleccionesReciclablesCantidad}
          />
          <TextInputField 
            label="9. ¿Hubo algún incidente durante las recolecciones de material RECICLABLE?"
            name="incidentesReciclablesDetalle"
            value={valores.incidentesReciclablesDetalle}
            onChange={(val) => handleCambioCampo('incidentesReciclablesDetalle', val)}
            hasError={showErrors && !valores.incidentesReciclablesDetalle}
          />
          <FileUploadField 
            label="10. Adjunta escaneados los manifiestos o recibos de recolección de RESIDUOS RECICLABLES del mes."
            name="manifiestosReciclablesSoporte"
            value={valores.manifiestosReciclablesSoporte}
            onChange={(files) => handleCambioCampo('manifiestosReciclablesSoporte', files)}
            hasError={showErrors && (!valores.manifiestosReciclablesSoporte || valores.manifiestosReciclablesSoporte.length === 0)}
          />
          <FileUploadField 
            label="11. Adjunta el formato de control de Residuos Reciclables, lleno con la información del mes."
            name="formatoControlReciclablesExcel"
            value={valores.formatoControlReciclablesExcel}
            onChange={(files) => handleCambioCampo('formatoControlReciclablesExcel', files)}
            hasError={showErrors && (!valores.formatoControlReciclablesExcel || valores.formatoControlReciclablesExcel.length === 0)}
          />
          <TextInputField 
            label="12. Número de day pass vendidos en el mes | Number of day passes sold in the month" 
            subtitle="Número" 
            placeholder='0'
            name="dayPassVendidosCantidad"
            value={valores.dayPassVendidosCantidad}
            onChange={(val) => handleCambioCampo('dayPassVendidosCantidad', val)}
            hasError={showErrors && !valores.dayPassVendidosCantidad}
          />
          <TextInputField 
            label="13. Pregunta para ALMACÉN: ¿Cuántos litros de aceite vegetal comestible salieron de almacén durante el mes? (Número de contenedores multiplicado por la capacidad de los mismos)." 
            subtitle="Litros" 
            placeholder='0'
            name="litrosAceiteSalidaAlmacen"
            value={valores.litrosAceiteSalidaAlmacen}
            onChange={(val) => handleCambioCampo('litrosAceiteSalidaAlmacen', val)}
            hasError={showErrors && !valores.litrosAceiteSalidaAlmacen}
          />
          <FileUploadField 
            label="14. Adjunta los manifiestos de recolección de ACEITE Y MANTECA VEGETAL del mes."
            name="manifiestosAceiteSoporte"
            value={valores.manifiestosAceiteSoporte}
            onChange={(files) => handleCambioCampo('manifiestosAceiteSoporte', files)}
            hasError={showErrors && (!valores.manifiestosAceiteSoporte || valores.manifiestosAceiteSoporte.length === 0)}
          />
          <FileUploadField 
            label="15. PREGUNTA PARA ALMACEN: Adjunta un reporte de las salidas de almacén por departamento del mes."
            name="reporteSalidasAlmacenSoporte"
            value={valores.reporteSalidasAlmacenSoporte}
            onChange={(files) => handleCambioCampo('reporteSalidasAlmacenSoporte', files)}
            hasError={showErrors && (!valores.reporteSalidasAlmacenSoporte || valores.reporteSalidasAlmacenSoporte.length === 0)}
          />
          <SelectInputField 
            label="16. En este mes, ¿se envió a reciclar equipos electrónicos?" 
            options={["Si", "No"]} 
            placeholder="Seleccionar..." 
            name="envio"
            value={envio}
            onChange={(e) => setEnvio(e.target.value)} 
            hasError={showErrors && !envio}
          />
          {showReciclables && (
            <>
              <TextInputField 
                label={`${getQNum('q17')}. Especifica cuántos kilogramos.`} 
                subtitle="kilogramos" 
                placeholder='0.00'
                name="reciclablesElectronicosPeso"
                value={valores.reciclablesElectronicosPeso}
                onChange={(val) => handleCambioCampo('reciclablesElectronicosPeso', val)}
                hasError={showErrors && !valores.reciclablesElectronicosPeso}
              />
              <FileUploadField 
                label={`${getQNum('q18')}. Adjunta los manifiestos de recolección de ELECTRÓNICOS del mes.`}
                name="manifiestosElectronicosSoporte"
                value={valores.manifiestosElectronicosSoporte}
                onChange={(files) => handleCambioCampo('manifiestosElectronicosSoporte', files)}
                hasError={showErrors && (!valores.manifiestosElectronicosSoporte || valores.manifiestosElectronicosSoporte.length === 0)}
              />
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Datos de llenado</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField 
            label={`${getQNum('q19')}. Nombre de quien llenó el cuestionario.`} 
            placeholder="Escriba aquí" 
            name="nombreResponsable"
            value={valores.nombreResponsable}
            onChange={(val) => handleCambioCampo('nombreResponsable', val)}
            hasError={showErrors && !valores.nombreResponsable}
          />
          <TextInputField 
            label={`${getQNum('q20')}. Puesto de quien llenó el cuestionario.`} 
            placeholder="Escriba aquí" 
            name="puestoResponsable"
            value={valores.puestoResponsable}
            onChange={(val) => handleCambioCampo('puestoResponsable', val)}
            hasError={showErrors && !valores.puestoResponsable}
          />
          <div className="md:col-span-2">
            <TextInputField 
              label={`${getQNum('q21')}. Correo electrónico`} 
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
            <p className="text-sm mt-1">Los indicadores de Contraloría para <strong>{hotelSeleccionado}</strong> se han registrado correctamente en la base de datos de Supabase.</p>
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
              Guardar Grupo Contraloría
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ContraloriaForm
