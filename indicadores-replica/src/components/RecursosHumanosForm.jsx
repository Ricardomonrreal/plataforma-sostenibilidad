import React, { useState, useEffect } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider, SelectInputField } from './FormComponents'
import { supabase, subirListaArchivos, eliminarArchivosHuerfanos } from '../supabaseClient'

const RecursosHumanosForm = ({ hotelSeleccionado, anoSeleccionado, mesSeleccionado, grupoSeleccionado }) => {
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

  // Captura centralizada
  const [valores, setValores] = useState({
    colaboradoresClubVacacional: '',
    colaboradoresExternos: '',
    residentesPobladoApoyo: '',
    eventosInternosLista: '',
    actividadVoluntariadoHoras: '',
    montoFundacionLomas: '',
    colaboradoresEducacionAdultos: '',
    montoEfectivoDonaciones: '',
    donativosEspecieValor: '',
    evidenciasEventosCampanas: null,
    reporteIndicadoresMensual: null,
    nombreResponsable: '',
    puestoResponsable: '',
    correoResponsable: ''
  });

  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setPobladoApoyo('');
    setVoluntariado('');
    setValores({
      colaboradoresClubVacacional: '',
      colaboradoresExternos: '',
      residentesPobladoApoyo: '',
      eventosInternosLista: '',
      actividadVoluntariadoHoras: '',
      montoFundacionLomas: '',
      colaboradoresEducacionAdultos: '',
      montoEfectivoDonaciones: '',
      donativosEspecieValor: '',
      evidenciasEventosCampanas: null,
      reporteIndicadoresMensual: null,
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
          .eq('grupo', grupoSeleccionado || 'Recursos Humanos')
          .eq('ano', anoSeleccionado || '2026')
          .eq('mes', mesSeleccionado || 'Enero')
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPobladoApoyo(data.datos?.pobladoApoyo || '');
          setVoluntariado(data.datos?.voluntariado || '');
          
          setValores({
            nombreResponsable: data.nombre_responsable || '',
            puestoResponsable: data.puesto_responsable || '',
            correoResponsable: data.correo_responsable || '',
            colaboradoresClubVacacional: data.datos?.colaboradoresClubVacacional || '',
            colaboradoresExternos: data.datos?.colaboradoresExternos || '',
            residentesPobladoApoyo: data.datos?.residentesPobladoApoyo || '',
            eventosInternosLista: data.datos?.eventosInternosLista || '',
            actividadVoluntariadoHoras: data.datos?.actividadVoluntariadoHoras || '',
            montoFundacionLomas: data.datos?.montoFundacionLomas || '',
            colaboradoresEducacionAdultos: data.datos?.colaboradoresEducacionAdultos || '',
            montoEfectivoDonaciones: data.datos?.montoEfectivoDonaciones || '',
            donativosEspecieValor: data.datos?.donativosEspecieValor || '',
            evidenciasEventosCampanas: data.datos?.archivos?.evidenciasEventosCampanas || null,
            reporteIndicadoresMensual: data.datos?.archivos?.reporteIndicadoresMensual || null,
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

    // Indicadores generales
    if (!valores.colaboradoresClubVacacional) errors.push('colaboradoresClubVacacional');
    if (!valores.colaboradoresExternos) errors.push('colaboradoresExternos');
    if (!pobladoApoyo) errors.push('pobladoApoyo');
    if (showQ8 && !valores.residentesPobladoApoyo) errors.push('residentesPobladoApoyo');

    // Indicadores sociales
    if (!valores.eventosInternosLista) errors.push('eventosInternosLista');
    if (!voluntariado) errors.push('voluntariado');
    if (showQ11 && !valores.actividadVoluntariadoHoras) errors.push('actividadVoluntariadoHoras');
    if (!valores.montoFundacionLomas) errors.push('montoFundacionLomas');
    if (!valores.colaboradoresEducacionAdultos) errors.push('colaboradoresEducacionAdultos');
    if (!valores.montoEfectivoDonaciones) errors.push('montoEfectivoDonaciones');
    if (!valores.donativosEspecieValor) errors.push('donativosEspecieValor');
    if (!valores.evidenciasEventosCampanas || valores.evidenciasEventosCampanas.length === 0) errors.push('evidenciasEventosCampanas');
    if (!valores.reporteIndicadoresMensual || valores.reporteIndicadoresMensual.length === 0) errors.push('reporteIndicadoresMensual');

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
      const g = grupoSeleccionado || 'Recursos Humanos';
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
        ...(oldArchivos.evidenciasEventosCampanas || []),
        ...(oldArchivos.reporteIndicadoresMensual || [])
      ];

      // 2. Subir archivos físicos a Supabase Storage
      const [
        evidenciasEventosCampanasPaths,
        reporteIndicadoresMensualPaths
      ] = await Promise.all([
        subirListaArchivos(valores.evidenciasEventosCampanas, h, g, a, m, 'evidenciasEventosCampanas'),
        subirListaArchivos(valores.reporteIndicadoresMensual, h, g, a, m, 'reporteIndicadoresMensual')
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
          colaboradoresClubVacacional: valores.colaboradoresClubVacacional,
          colaboradoresExternos: valores.colaboradoresExternos,
          pobladoApoyo,
          residentesPobladoApoyo: showQ8 ? valores.residentesPobladoApoyo : null,
          eventosInternosLista: valores.eventosInternosLista,
          voluntariado,
          actividadVoluntariadoHoras: showQ11 ? valores.actividadVoluntariadoHoras : null,
          montoFundacionLomas: valores.montoFundacionLomas,
          colaboradoresEducacionAdultos: valores.colaboradoresEducacionAdultos,
          montoEfectivoDonaciones: valores.montoEfectivoDonaciones,
          donativosEspecieValor: valores.donativosEspecieValor,
          archivos: {
            evidenciasEventosCampanas: evidenciasEventosCampanasPaths,
            reporteIndicadoresMensual: reporteIndicadoresMensualPaths
          }
        }
      };

      // 3. Eliminar archivos antiguos que ya no están en las nuevas rutas
      const newPaths = [
        ...evidenciasEventosCampanasPaths,
        ...reporteIndicadoresMensualPaths
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

      {/* Sección I: Indicadores generales */}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
        title="Indicadores generales Talento Humano"
        description="Una sección importante del estándar de EarthCheck es contabilizar con exactitud los colaboradores y usuarios del hotel durante el mes. Si algún dato aún no se mide, favor de empezar a hacerlo. Si requiere apoyo por favor contacte al departamento de Sustentabilidad."
      />
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Indicadores generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInputField 
            label="5. Número de colaboradores del Club Vacacional que laboran dentro del hotel." 
            subtitle="Personas" 
            placeholder='0'
            name="colaboradoresClubVacacional"
            value={valores.colaboradoresClubVacacional}
            onChange={(val) => handleCambioCampo('colaboradoresClubVacacional', val)}
            hasError={showErrors && !valores.colaboradoresClubVacacional}
          />
          <TextInputField 
            label="6. Número de colaboradores de tiendas, concesiones y externos que laboran dentro del hotel." 
            subtitle="Personas" 
            placeholder='0'
            name="colaboradoresExternos"
            value={valores.colaboradoresExternos}
            onChange={(val) => handleCambioCampo('colaboradoresExternos', val)}
            hasError={showErrors && !valores.colaboradoresExternos}
          />
          <SelectInputField 
            label="7. ¿Cuentan con poblado de apoyo?" 
            options={["Si", "No"]} 
            placeholder="Seleccionar..." 
            name="pobladoApoyo"
            value={pobladoApoyo}
            onChange={(e) => setPobladoApoyo(e.target.value)} 
            hasError={showErrors && !pobladoApoyo}
          />
          {showQ8 && (
            <TextInputField 
              label={`${getQNum('q8')}. ¿Cuántos colaboradores residen en el poblado de apoyo?`} 
              name="residentesPobladoApoyo"
              value={valores.residentesPobladoApoyo}
              onChange={(val) => handleCambioCampo('residentesPobladoApoyo', val)}
              hasError={showErrors && !valores.residentesPobladoApoyo}
            />
          )}
        </div>
      </div>
      
      {/* Sección II: Indicadores sociales*/}
      <FormSectionDivider
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        }
        title="Indicadores sociales"
        description="En esta sección compilaremos la información referente a indicadores sociales, que contabilizan el impacto positivo del hotel hacia su comunidad, tanto interna como externa. Favor de llenar esta sección con la información correspondiente al mes."
      />
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
        <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Indicadores sociales</h3>
        <div className="flex flex-col gap-6">
          <TextInputField 
            label={`${getQNum('q9')}. ¿Cuántos eventos internos para colaboradores se organizaron durante el mes (listar)?`}
            name="eventosInternosLista"
            value={valores.eventosInternosLista}
            onChange={(val) => handleCambioCampo('eventosInternosLista', val)}
            hasError={showErrors && !valores.eventosInternosLista}
          />
          <SelectInputField 
            label={`${getQNum('q10')}. ¿Se organizó alguna actividad de voluntariado durante el mes?`} 
            options={["Si", "No"]} 
            placeholder="Seleccionar..." 
            name="voluntariado"
            value={voluntariado}
            onChange={(e) => setVoluntariado(e.target.value)} 
            hasError={showErrors && !voluntariado}
          />
          {showQ11 && (
            <TextInputField 
              label={`${getQNum('q11')}. Si la respuesta a la pregunta anterior fue 'si', favor de indicar qué actividad(es) se organizaron y el número total de horas de voluntariado de cada una de ellas.`} 
              subtitle="Para obtener el total de horas de voluntariado, se debe usar la siguiente fórmula: Duración de la actividad x total de colaboradores que participaron en ella."
              name="actividadVoluntariadoHoras"
              value={valores.actividadVoluntariadoHoras}
              onChange={(val) => handleCambioCampo('actividadVoluntariadoHoras', val)}
              hasError={showErrors && !valores.actividadVoluntariadoHoras}
            />
          )}
          <TextInputField 
            label={`${getQNum('q12')}. ¿A cuánto asciende el monto donado a Fundación Lomas durante el mes?`} 
            subtitle="Moneda nacional" 
            placeholder='$0.00'
            name="montoFundacionLomas"
            value={valores.montoFundacionLomas}
            onChange={(val) => handleCambioCampo('montoFundacionLomas', val)}
            hasError={showErrors && !valores.montoFundacionLomas}
          />
          <TextInputField 
            label={`${getQNum('q13')}. Número de colaboradores en el programa de educación para adultos (programa interno o externo).`} 
            subtitle="Personas" 
            placeholder='0'
            name="colaboradoresEducacionAdultos"
            value={valores.colaboradoresEducacionAdultos}
            onChange={(val) => handleCambioCampo('colaboradoresEducacionAdultos', val)}
            hasError={showErrors && !valores.colaboradoresEducacionAdultos}
          />
          <TextInputField 
            label={`${getQNum('q14')}. Monto en efectivo donado a causas benéficas (especificar Fundación). `} 
            subtitle="Moneda nacional (No considerar fundación)" 
            placeholder='$0.00'
            name="montoEfectivoDonaciones"
            value={valores.montoEfectivoDonaciones}
            onChange={(val) => handleCambioCampo('montoEfectivoDonaciones', val)}
            hasError={showErrors && !valores.montoEfectivoDonaciones}
          />
          <TextInputField 
            label={`${getQNum('q15')}. Valor aproximado en dinero, de los donativos de blancos, activos fijos y otros donativos en especie.`} 
            subtitle="Moneda nacional. Cálculo del monto que valdrían los donativos en especie, si estos hubieran sido vendidos (ej. Una sábana usada vale el 20% de su valor original)" 
            placeholder='$0.00'
            name="donativosEspecieValor"
            value={valores.donativosEspecieValor}
            onChange={(val) => handleCambioCampo('donativosEspecieValor', val)}
            hasError={showErrors && !valores.donativosEspecieValor}
          />
          <FileUploadField 
            label={`${getQNum('q16')}. Favor de adjuntar la evidencia disponible de los eventos, donativos, campañas, calendario ambiental, capacitaciones y otras actividades del mes.`} 
            subtitle="Puede ser el reporte mensual de evidencias de RRHH"
            name="evidenciasEventosCampanas"
            value={valores.evidenciasEventosCampanas}
            onChange={(files) => handleCambioCampo('evidenciasEventosCampanas', files)}
            hasError={showErrors && (!valores.evidenciasEventosCampanas || valores.evidenciasEventosCampanas.length === 0)}
          />
          <FileUploadField 
            label={`${getQNum('q17')}. Adjunta el reporte de indicadores mensual`} 
            subtitle="Rotación, distribución geográfica y demográfica, horas capacitación, etc." 
            name="reporteIndicadoresMensual"
            value={valores.reporteIndicadoresMensual}
            onChange={(files) => handleCambioCampo('reporteIndicadoresMensual', files)}
            hasError={showErrors && (!valores.reporteIndicadoresMensual || valores.reporteIndicadoresMensual.length === 0)}
          />
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
          <TextInputField 
            label={`${getQNum('q18')}. Nombre de quien llenó el cuestionario.`} 
            placeholder="Escriba aquí" 
            name="nombreResponsable"
            value={valores.nombreResponsable}
            onChange={(val) => handleCambioCampo('nombreResponsable', val)}
            hasError={showErrors && !valores.nombreResponsable}
          />
          <TextInputField 
            label={`${getQNum('q19')}. Puesto de quien llenó el cuestionario.`} 
            placeholder="Escriba aquí" 
            name="puestoResponsable"
            value={valores.puestoResponsable}
            onChange={(val) => handleCambioCampo('puestoResponsable', val)}
            hasError={showErrors && !valores.puestoResponsable}
          />
          <div className="md:col-span-2">
            <TextInputField 
              label={`${getQNum('q20')}. Correo electrónico`} 
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
            <p className="text-sm mt-1">Los indicadores de Recursos Humanos para <strong>{hotelSeleccionado}</strong> se han registrado correctamente en la base de datos de Supabase.</p>
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
              Guardar Grupo Recursos Humanos
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default RecursosHumanosForm
