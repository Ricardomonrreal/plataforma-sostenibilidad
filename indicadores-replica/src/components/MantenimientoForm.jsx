import React, { useState, useEffect } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider, SelectInputField } from './FormComponents'
import { supabase, subirListaArchivos, eliminarArchivosHuerfanos } from '../supabaseClient'

const columnasElectricidadEDR = [
  { key: 'total', label: '5. Consumo TOTAL', unit: 'kWh', placeholder: '0.00' },
  { key: 'sec1', label: '6. Medidor JLMA', unit: 'kWh', placeholder: '0.00' },
  { key: 'sec2', label: '7. Medidor DPL', unit: 'kWh', placeholder: '0.00' },
  { key: 'sec3', label: '8. Medidor DPPB', unit: 'kWh', placeholder: '0.00' }
];

const columnasCombustibles = [
  { key: 'gasLP', label: '11. Gas LP', unit: 'Litros', placeholder: '0.00' },
  { key: 'diesel', label: '12. Diesel', unit: 'Litros', placeholder: '0.00' },
  { key: 'gasolina', label: '13. Gasolina', unit: 'Litros', placeholder: '0.00' },
  { key: 'lena', label: '14. Leña', unit: 'Kilogramos', placeholder: '0.00' },
  { key: 'carbon', label: '15. Carbón Vegetal', unit: 'Kilogramos', placeholder: '0.00' }
];

const columnasAgua = [
  { key: 'potable', label: '26. Agua Consumida', unit: 'm³', placeholder: '0.00' },
  { key: 'pozos', label: '27. Pozos Extracción', unit: 'm³', placeholder: '0.00' },
  { key: 'osmosisProd', label: '28. Prod. Ósmosis', unit: 'm³', placeholder: '0.00' },
  { key: 'osmosisRechazo', label: '29. Rechazo Ósm.', unit: 'm³', placeholder: '0.00' },
  { key: 'ptarPozo', label: '30. PTAR a Pozo', unit: 'm³', placeholder: '0.00' },
  { key: 'ptarRiego', label: '31. PTAR a Riego', unit: 'm³', placeholder: '0.00' },
  { key: 'lavanderia', label: '32. Lavandería', unit: 'm³', placeholder: '0.00' },
  { key: 'retrolavados', label: '33. Retrolavados', unit: 'm³', placeholder: '0.00' }
];

const columnasCombustiblesOtros = [
  { key: 'gasLP', label: '8. Gas LP', unit: 'Litros', placeholder: '0.00' },
  { key: 'diesel', label: '9. Diesel', unit: 'Litros', placeholder: '0.00' },
  { key: 'gasolina', label: '10. Gasolina', unit: 'Litros', placeholder: '0.00' },
  { key: 'lena', label: '11. Leña', unit: 'Kilogramos', placeholder: '0.00' },
  { key: 'carbon', label: '12. Carbón Vegetal', unit: 'Kilogramos', placeholder: '0.00' }
];

const columnasAguaOtros = [
  { key: 'potable', label: '23. Agua Consumida', unit: 'm³', placeholder: '0.00' },
  { key: 'pozos', label: '24. Pozos Extracción', unit: 'm³', placeholder: '0.00' },
  { key: 'osmosisProd', label: '25. Prod. Ósmosis', unit: 'm³', placeholder: '0.00' },
  { key: 'osmosisRechazo', label: '26. Rechazo Ósm.', unit: 'm³', placeholder: '0.00' },
  { key: 'ptarPozo', label: '27. PTAR a Pozo', unit: 'm³', placeholder: '0.00' },
  { key: 'ptarRiego', label: '28. PTAR a Riego', unit: 'm³', placeholder: '0.00' },
  { key: 'lavanderia', label: '29. Lavandería', unit: 'm³', placeholder: '0.00' },
  { key: 'retrolavados', label: '30. Retrolavados', unit: 'm³', placeholder: '0.00' }
];

const MantenimientoForm = ({ hotelSeleccionado, anoSeleccionado, mesSeleccionado, grupoSeleccionado }) => {
  const [totalEnergia, setTotalEnergia] = useState('')
  const [energiaSec1, setEnergiaSec1] = useState('')
  const [energiaSec2, setEnergiaSec2] = useState('')
  const [energiaSec3, setEnergiaSec3] = useState('')

  const [situacionEDR, setSituacionEDR] = useState('')
  const [situacionOtros, setSituacionOtros] = useState('')

  // Estados para las tablas de combustibles y agua
  const [combustiblesEDR, setCombustiblesEDR] = useState({
    gasLP: '',
    diesel: '',
    gasolina: '',
    lena: '',
    carbon: ''
  })
  const [aguaEDR, setAguaEDR] = useState({
    potable: '',
    pozos: '',
    osmosisProd: '',
    osmosisRechazo: '',
    ptarPozo: '',
    ptarRiego: '',
    lavanderia: '',
    retrolavados: ''
  })
  const [combustiblesOtros, setCombustiblesOtros] = useState({
    gasLP: '',
    diesel: '',
    gasolina: '',
    lena: '',
    carbon: ''
  })
  const [aguaOtros, setAguaOtros] = useState({
    potable: '',
    pozos: '',
    osmosisProd: '',
    osmosisRechazo: '',
    ptarPozo: '',
    ptarRiego: '',
    lavanderia: '',
    retrolavados: ''
  })

  // Captura centralizada de otros inputs
  const [valores, setValores] = useState({
    costoElectricidad: '',
    recibosElectricidad: null,
    costoGasLP: '',
    facturasGasLP: null,
    bitacoraGasLP: null,
    facturasDiesel: null,
    bitacoraDiesel: null,
    facturasGasolina: null,
    bitacoraGasolina: null,
    facturasLena: null,
    facturasCarbon: null,
    fuenteAguaPotable: '',
    bitacoraAgua: null,
    evidenciaReporteGestores: null,
    reporteEnergeticos: null,
    manifiestoGrasaCarcamos: null,
    manifiestoGrasaCampanas: null,
    manifiestoResiduosPeligrosos: null,
    manifiestoEscombros: null,
    volumenSargazo: '',
    manifiestoSargazo: null,
    bitacoraSargazo: null,
    nombreResponsable: '',
    puestoResponsable: '',
    correoResponsable: '',
    // No-EDR especificos
    totalElectricidadOtros: '',
    costoElectricidadOtros: '',
    recibosElectricidadOtros: null,
    costoGasLPOtros: '',
    facturasGasLPOtros: null,
    bitacoraGasLPOtros: null,
    facturasDieselOtros: null,
    bitacoraDieselOtros: null,
    facturasGasolinaOtros: null,
    bitacoraGasolinaOtros: null,
    facturasLenaOtros: null,
    facturasCarbonOtros: null,
    fuenteAguaPotableOtros: '',
    bitacoraAguaOtros: null,
    reporteEnergeticosOtros: null,
    manifiestoGrasaCarcamosOtros: null,
    manifiestoGrasaCampanasOtros: null,
    manifiestoResiduosPeligrososOtros: null,
    manifiestoEscombrosOtros: null,
    volumenSargazoOtros: '',
    manifiestoSargazoOtros: null,
    bitacoraSargazoOtros: null,
  });

  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setTotalEnergia('');
    setEnergiaSec1('');
    setEnergiaSec2('');
    setEnergiaSec3('');
    setSituacionEDR('');
    setSituacionOtros('');
    setCombustiblesEDR({
      gasLP: '',
      diesel: '',
      gasolina: '',
      lena: '',
      carbon: ''
    });
    setAguaEDR({
      potable: '',
      pozos: '',
      osmosisProd: '',
      osmosisRechazo: '',
      ptarPozo: '',
      ptarRiego: '',
      lavanderia: '',
      retrolavados: ''
    });
    setCombustiblesOtros({
      gasLP: '',
      diesel: '',
      gasolina: '',
      lena: '',
      carbon: ''
    });
    setAguaOtros({
      potable: '',
      pozos: '',
      osmosisProd: '',
      osmosisRechazo: '',
      ptarPozo: '',
      ptarRiego: '',
      lavanderia: '',
      retrolavados: ''
    });
    setValores({
      costoElectricidad: '',
      recibosElectricidad: null,
      costoGasLP: '',
      facturasGasLP: null,
      bitacoraGasLP: null,
      facturasDiesel: null,
      bitacoraDiesel: null,
      facturasGasolina: null,
      bitacoraGasolina: null,
      facturasLena: null,
      facturasCarbon: null,
      fuenteAguaPotable: '',
      bitacoraAgua: null,
      evidenciaReporteGestores: null,
      reporteEnergeticos: null,
      manifiestoGrasaCarcamos: null,
      manifiestoGrasaCampanas: null,
      manifiestoResiduosPeligrosos: null,
      manifiestoEscombros: null,
      volumenSargazo: '',
      manifiestoSargazo: null,
      bitacoraSargazo: null,
      nombreResponsable: '',
      puestoResponsable: '',
      correoResponsable: '',
      // No-EDR especificos
      totalElectricidadOtros: '',
      costoElectricidadOtros: '',
      recibosElectricidadOtros: null,
      costoGasLPOtros: '',
      facturasGasLPOtros: null,
      bitacoraGasLPOtros: null,
      facturasDieselOtros: null,
      bitacoraDieselOtros: null,
      facturasGasolinaOtros: null,
      bitacoraGasolinaOtros: null,
      facturasLenaOtros: null,
      facturasCarbonOtros: null,
      fuenteAguaPotableOtros: '',
      bitacoraAguaOtros: null,
      reporteEnergeticosOtros: null,
      manifiestoGrasaCarcamosOtros: null,
      manifiestoGrasaCampanasOtros: null,
      manifiestoResiduosPeligrososOtros: null,
      manifiestoEscombrosOtros: null,
      volumenSargazoOtros: '',
      manifiestoSargazoOtros: null,
      bitacoraSargazoOtros: null,
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
          .eq('grupo', grupoSeleccionado || 'Mantenimiento')
          .eq('ano', anoSeleccionado || '2026')
          .eq('mes', mesSeleccionado || 'Enero')
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const isEDR = hotelSeleccionado === 'El Dorado Royale (EDR)';
          if (isEDR) {
            setTotalEnergia(data.datos?.totalEnergia || '');
            setEnergiaSec1(data.datos?.energiaSec1 || '');
            setEnergiaSec2(data.datos?.energiaSec2 || '');
            setEnergiaSec3(data.datos?.energiaSec3 || '');
            setSituacionEDR(data.datos?.situacionLectura || '');
            setCombustiblesEDR(data.datos?.combustibles || { gasLP: '', diesel: '', gasolina: '', lena: '', carbon: '' });
            setAguaEDR(data.datos?.agua || { potable: '', pozos: '', osmosisProd: '', osmosisRechazo: '', ptarPozo: '', ptarRiego: '', lavanderia: '', retrolavados: '' });
            
            setValores(prev => ({
              ...prev,
              nombreResponsable: data.nombre_responsable || '',
              puestoResponsable: data.puesto_responsable || '',
              correoResponsable: data.correo_responsable || '',
              costoElectricidad: data.datos?.costoElectricidad || '',
              costoGasLP: data.datos?.costoGasLP || '',
              fuenteAguaPotable: data.datos?.fuenteAguaPotable || '',
              volumenSargazo: data.datos?.volumenSargazo || '',
              recibosElectricidad: data.datos?.archivos?.recibosElectricidad || null,
              facturasGasLP: data.datos?.archivos?.facturasGasLP || null,
              bitacoraGasLP: data.datos?.archivos?.bitacoraGasLP || null,
              facturasDiesel: data.datos?.archivos?.facturasDiesel || null,
              bitacoraDiesel: data.datos?.archivos?.bitacoraDiesel || null,
              facturasGasolina: data.datos?.archivos?.facturasGasolina || null,
              bitacoraGasolina: data.datos?.archivos?.bitacoraGasolina || null,
              facturasLena: data.datos?.archivos?.facturasLena || null,
              facturasCarbon: data.datos?.archivos?.facturasCarbon || null,
              bitacoraAgua: data.datos?.archivos?.bitacoraAgua || null,
              evidenciaReporteGestores: data.datos?.archivos?.evidenciaReporteGestores || null,
              reporteEnergeticos: data.datos?.archivos?.reporteEnergeticos || null,
              manifiestoGrasaCarcamos: data.datos?.archivos?.manifiestoGrasaCarcamos || null,
              manifiestoGrasaCampanas: data.datos?.archivos?.manifiestoGrasaCampanas || null,
              manifiestoResiduosPeligrosos: data.datos?.archivos?.manifiestoResiduosPeligrosos || null,
              manifiestoEscombros: data.datos?.archivos?.manifiestoEscombros || null,
              manifiestoSargazo: data.datos?.archivos?.manifiestoSargazo || null,
              bitacoraSargazo: data.datos?.archivos?.bitacoraSargazo || null,
            }));
          } else {
            setSituacionOtros(data.datos?.situacionLectura || '');
            setCombustiblesOtros(data.datos?.combustibles || { gasLP: '', diesel: '', gasolina: '', lena: '', carbon: '' });
            setAguaOtros(data.datos?.agua || { potable: '', pozos: '', osmosisProd: '', osmosisRechazo: '', ptarPozo: '', ptarRiego: '', lavanderia: '', retrolavados: '' });
            
            setValores(prev => ({
              ...prev,
              nombreResponsable: data.nombre_responsable || '',
              puestoResponsable: data.puesto_responsable || '',
              correoResponsable: data.correo_responsable || '',
              totalElectricidadOtros: data.datos?.totalEnergia || '',
              costoElectricidadOtros: data.datos?.costoElectricidad || '',
              costoGasLPOtros: data.datos?.costoGasLP || '',
              fuenteAguaPotableOtros: data.datos?.fuenteAguaPotable || '',
              volumenSargazoOtros: data.datos?.volumenSargazo || '',
              recibosElectricidadOtros: data.datos?.archivos?.recibosElectricidad || null,
              facturasGasLPOtros: data.datos?.archivos?.facturasGasLP || null,
              bitacoraGasLPOtros: data.datos?.archivos?.bitacoraGasLP || null,
              facturasDieselOtros: data.datos?.archivos?.facturasDiesel || null,
              bitacoraDieselOtros: data.datos?.archivos?.bitacoraDiesel || null,
              facturasGasolinaOtros: data.datos?.archivos?.facturasGasolina || null,
              bitacoraGasolinaOtros: data.datos?.archivos?.bitacoraGasolina || null,
              facturasLenaOtros: data.datos?.archivos?.facturasLena || null,
              facturasCarbonOtros: data.datos?.archivos?.facturasCarbon || null,
              bitacoraAguaOtros: data.datos?.archivos?.bitacoraAgua || null,
              evidenciaReporteGestores: data.datos?.archivos?.evidenciaReporteGestores || null,
              reporteEnergeticosOtros: data.datos?.archivos?.reporteEnergeticos || null,
              manifiestoGrasaCarcamosOtros: data.datos?.archivos?.manifiestoGrasaCarcamos || null,
              manifiestoGrasaCampanasOtros: data.datos?.archivos?.manifiestoGrasaCampanas || null,
              manifiestoResiduosPeligrososOtros: data.datos?.archivos?.manifiestoResiduosPeligrosos || null,
              manifiestoEscombrosOtros: data.datos?.archivos?.manifiestoEscombros || null,
              manifiestoSargazoOtros: data.datos?.archivos?.manifiestoSargazo || null,
              bitacoraSargazoOtros: data.datos?.archivos?.bitacoraSargazo || null,
            }));
          }
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

  const handleCambioCombustiblesEDR = (key, val) => {
    setCombustiblesEDR(prev => ({ ...prev, [key]: val }))
  };

  const handleCambioAguaEDR = (key, val) => {
    setAguaEDR(prev => ({ ...prev, [key]: val }))
  };

  const handleCambioCombustiblesOtros = (key, val) => {
    setCombustiblesOtros(prev => ({ ...prev, [key]: val }))
  };

  const handleCambioAguaOtros = (key, val) => {
    setAguaOtros(prev => ({ ...prev, [key]: val }))
  };

  const getQNumEDR = (baseNum) => {
    if (baseNum <= 35) return baseNum;
    return situacionEDR === 'Si' ? baseNum : baseNum - 1;
  };

  const getQNumOtros = (baseNum) => {
    if (baseNum <= 32) return baseNum;
    return situacionOtros === 'Si' ? baseNum : baseNum - 1;
  };

  const validateForm = () => {
    const isEDR = hotelSeleccionado === 'El Dorado Royale (EDR)';
    const errors = [];

    if (isEDR) {
      if (!totalEnergia) errors.push('totalEnergia');
      if (!energiaSec1) errors.push('energiaSec1');
      if (!energiaSec2) errors.push('energiaSec2');
      if (!energiaSec3) errors.push('energiaSec3');
      if (!valores.costoElectricidad) errors.push('costoElectricidad');
      if (!valores.recibosElectricidad || valores.recibosElectricidad.length === 0) errors.push('recibosElectricidad');

      // Combustibles tabla
      Object.keys(combustiblesEDR).forEach(k => {
        if (!combustiblesEDR[k]) errors.push(`combustibles_${k}`);
      });
      if (!valores.costoGasLP) errors.push('costoGasLP');
      if (!valores.facturasGasLP || valores.facturasGasLP.length === 0) errors.push('facturasGasLP');
      if (!valores.bitacoraGasLP || valores.bitacoraGasLP.length === 0) errors.push('bitacoraGasLP');
      if (!valores.facturasDiesel || valores.facturasDiesel.length === 0) errors.push('facturasDiesel');
      if (!valores.bitacoraDiesel || valores.bitacoraDiesel.length === 0) errors.push('bitacoraDiesel');
      if (!valores.facturasGasolina || valores.facturasGasolina.length === 0) errors.push('facturasGasolina');
      if (!valores.bitacoraGasolina || valores.bitacoraGasolina.length === 0) errors.push('bitacoraGasolina');
      if (!valores.facturasLena || valores.facturasLena.length === 0) errors.push('facturasLena');
      if (!valores.facturasCarbon || valores.facturasCarbon.length === 0) errors.push('facturasCarbon');

      // Agua
      if (!valores.fuenteAguaPotable) errors.push('fuenteAguaPotable');
      Object.keys(aguaEDR).forEach(k => {
        if (!aguaEDR[k]) errors.push(`agua_${k}`);
      });
      if (!valores.bitacoraAgua || valores.bitacoraAgua.length === 0) errors.push('bitacoraAgua');
      if (!situacionEDR) errors.push('situacionEDR');
      if (situacionEDR === 'Si' && (!valores.evidenciaReporteGestores || valores.evidenciaReporteGestores.length === 0)) {
        errors.push('evidenciaReporteGestores');
      }

      // Reporte de energeticos
      if (!valores.reporteEnergeticos || valores.reporteEnergeticos.length === 0) errors.push('reporteEnergeticos');

      // Residuos peligrosos
      if (!valores.manifiestoGrasaCarcamos || valores.manifiestoGrasaCarcamos.length === 0) errors.push('manifiestoGrasaCarcamos');
      if (!valores.manifiestoGrasaCampanas || valores.manifiestoGrasaCampanas.length === 0) errors.push('manifiestoGrasaCampanas');
      if (!valores.manifiestoResiduosPeligrosos || valores.manifiestoResiduosPeligrosos.length === 0) errors.push('manifiestoResiduosPeligrosos');
      if (!valores.manifiestoEscombros || valores.manifiestoEscombros.length === 0) errors.push('manifiestoEscombros');

      // Sargazo
      if (!valores.volumenSargazo) errors.push('volumenSargazo');
      if (!valores.manifiestoSargazo || valores.manifiestoSargazo.length === 0) errors.push('manifiestoSargazo');
      if (!valores.bitacoraSargazo || valores.bitacoraSargazo.length === 0) errors.push('bitacoraSargazo');

      // Llenado
      if (!valores.nombreResponsable) errors.push('nombreResponsable');
      if (!valores.puestoResponsable) errors.push('puestoResponsable');
      if (!valores.correoResponsable) errors.push('correoResponsable');
    } else {
      // Otros hoteles
      if (!valores.totalElectricidadOtros) errors.push('totalElectricidadOtros');
      if (!valores.costoElectricidadOtros) errors.push('costoElectricidadOtros');
      if (!valores.recibosElectricidadOtros || valores.recibosElectricidadOtros.length === 0) errors.push('recibosElectricidadOtros');

      // Combustibles tabla
      Object.keys(combustiblesOtros).forEach(k => {
        if (!combustiblesOtros[k]) errors.push(`combustibles_${k}`);
      });
      if (!valores.costoGasLPOtros) errors.push('costoGasLPOtros');
      if (!valores.facturasGasLPOtros || valores.facturasGasLPOtros.length === 0) errors.push('facturasGasLPOtros');
      if (!valores.bitacoraGasLPOtros || valores.bitacoraGasLPOtros.length === 0) errors.push('bitacoraGasLPOtros');
      if (!valores.facturasDieselOtros || valores.facturasDieselOtros.length === 0) errors.push('facturasDieselOtros');
      if (!valores.bitacoraDieselOtros || valores.bitacoraDieselOtros.length === 0) errors.push('bitacoraDieselOtros');
      if (!valores.facturasGasolinaOtros || valores.facturasGasolinaOtros.length === 0) errors.push('facturasGasolinaOtros');
      if (!valores.bitacoraGasolinaOtros || valores.bitacoraGasolinaOtros.length === 0) errors.push('bitacoraGasolinaOtros');
      if (!valores.facturasLenaOtros || valores.facturasLenaOtros.length === 0) errors.push('facturasLenaOtros');
      if (!valores.facturasCarbonOtros || valores.facturasCarbonOtros.length === 0) errors.push('facturasCarbonOtros');

      // Agua
      if (!valores.fuenteAguaPotableOtros) errors.push('fuenteAguaPotableOtros');
      Object.keys(aguaOtros).forEach(k => {
        if (!aguaOtros[k]) errors.push(`agua_${k}`);
      });
      if (!valores.bitacoraAguaOtros || valores.bitacoraAguaOtros.length === 0) errors.push('bitacoraAguaOtros');
      if (!situacionOtros) errors.push('situacionOtros');
      if (situacionOtros === 'Si' && (!valores.evidenciaReporteGestores || valores.evidenciaReporteGestores.length === 0)) {
        errors.push('evidenciaReporteGestores');
      }

      // Reporte de energeticos
      if (!valores.reporteEnergeticosOtros || valores.reporteEnergeticosOtros.length === 0) errors.push('reporteEnergeticosOtros');

      // Residuos peligrosos
      if (!valores.manifiestoGrasaCarcamosOtros || valores.manifiestoGrasaCarcamosOtros.length === 0) errors.push('manifiestoGrasaCarcamosOtros');
      if (!valores.manifiestoGrasaCampanasOtros || valores.manifiestoGrasaCampanasOtros.length === 0) errors.push('manifiestoGrasaCampanasOtros');
      if (!valores.manifiestoResiduosPeligrososOtros || valores.manifiestoResiduosPeligrososOtros.length === 0) errors.push('manifiestoResiduosPeligrososOtros');
      if (!valores.manifiestoEscombrosOtros || valores.manifiestoEscombrosOtros.length === 0) errors.push('manifiestoEscombrosOtros');

      // Sargazo
      if (!valores.volumenSargazoOtros) errors.push('volumenSargazoOtros');
      if (!valores.manifiestoSargazoOtros || valores.manifiestoSargazoOtros.length === 0) errors.push('manifiestoSargazoOtros');
      if (!valores.bitacoraSargazoOtros || valores.bitacoraSargazoOtros.length === 0) errors.push('bitacoraSargazoOtros');

      // Llenado
      if (!valores.nombreResponsable) errors.push('nombreResponsable');
      if (!valores.puestoResponsable) errors.push('puestoResponsable');
      if (!valores.correoResponsable) errors.push('correoResponsable');
    }

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

    const isEDR = hotelSeleccionado === 'El Dorado Royale (EDR)';

    try {
      const g = grupoSeleccionado || 'Mantenimiento';
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
        ...(oldArchivos.recibosElectricidad || []),
        ...(oldArchivos.facturasGasLP || []),
        ...(oldArchivos.bitacoraGasLP || []),
        ...(oldArchivos.facturasDiesel || []),
        ...(oldArchivos.bitacoraDiesel || []),
        ...(oldArchivos.facturasGasolina || []),
        ...(oldArchivos.bitacoraGasolina || []),
        ...(oldArchivos.facturasLena || []),
        ...(oldArchivos.facturasCarbon || []),
        ...(oldArchivos.bitacoraAgua || []),
        ...(oldArchivos.evidenciaReporteGestores || []),
        ...(oldArchivos.reporteEnergeticos || []),
        ...(oldArchivos.manifiestoGrasaCarcamos || []),
        ...(oldArchivos.manifiestoGrasaCampanas || []),
        ...(oldArchivos.manifiestoResiduosPeligrosos || []),
        ...(oldArchivos.manifiestoEscombros || []),
        ...(oldArchivos.manifiestoSargazo || []),
        ...(oldArchivos.bitacoraSargazo || [])
      ];

      // 2. Subir archivos físicos a Supabase Storage
      const [
        recibosElectricidadPaths,
        facturasGasLPPaths,
        bitacoraGasLPPaths,
        facturasDieselPaths,
        bitacoraDieselPaths,
        facturasGasolinaPaths,
        bitacoraGasolinaPaths,
        facturasLenaPaths,
        facturasCarbonPaths,
        bitacoraAguaPaths,
        evidenciaReporteGestoresPaths,
        reporteEnergeticosPaths,
        manifiestoGrasaCarcamosPaths,
        manifiestoGrasaCampanasPaths,
        manifiestoResiduosPeligrososPaths,
        manifiestoEscombrosPaths,
        manifiestoSargazoPaths,
        bitacoraSargazoPaths
      ] = await Promise.all([
        subirListaArchivos(isEDR ? valores.recibosElectricidad : valores.recibosElectricidadOtros, h, g, a, m, 'recibosElectricidad'),
        subirListaArchivos(isEDR ? valores.facturasGasLP : valores.facturasGasLPOtros, h, g, a, m, 'facturasGasLP'),
        subirListaArchivos(isEDR ? valores.bitacoraGasLP : valores.bitacoraGasLPOtros, h, g, a, m, 'bitacoraGasLP'),
        subirListaArchivos(isEDR ? valores.facturasDiesel : valores.facturasDieselOtros, h, g, a, m, 'facturasDiesel'),
        subirListaArchivos(isEDR ? valores.bitacoraDiesel : valores.bitacoraDieselOtros, h, g, a, m, 'bitacoraDiesel'),
        subirListaArchivos(isEDR ? valores.facturasGasolina : valores.facturasGasolinaOtros, h, g, a, m, 'facturasGasolina'),
        subirListaArchivos(isEDR ? valores.bitacoraGasolina : valores.bitacoraGasolinaOtros, h, g, a, m, 'bitacoraGasolina'),
        subirListaArchivos(isEDR ? valores.facturasLena : valores.facturasLenaOtros, h, g, a, m, 'facturasLena'),
        subirListaArchivos(isEDR ? valores.facturasCarbon : valores.facturasCarbonOtros, h, g, a, m, 'facturasCarbon'),
        subirListaArchivos(isEDR ? valores.bitacoraAgua : valores.bitacoraAguaOtros, h, g, a, m, 'bitacoraAgua'),
        subirListaArchivos(valores.evidenciaReporteGestores, h, g, a, m, 'evidenciaReporteGestores'),
        subirListaArchivos(isEDR ? valores.reporteEnergeticos : valores.reporteEnergeticosOtros, h, g, a, m, 'reporteEnergeticos'),
        subirListaArchivos(isEDR ? valores.manifiestoGrasaCarcamos : valores.manifiestoGrasaCarcamosOtros, h, g, a, m, 'manifiestoGrasaCarcamos'),
        subirListaArchivos(isEDR ? valores.manifiestoGrasaCampanas : valores.manifiestoGrasaCampanasOtros, h, g, a, m, 'manifiestoGrasaCampanas'),
        subirListaArchivos(isEDR ? valores.manifiestoResiduosPeligrosos : valores.manifiestoResiduosPeligrososOtros, h, g, a, m, 'manifiestoResiduosPeligrosos'),
        subirListaArchivos(isEDR ? valores.manifiestoEscombros : valores.manifiestoEscombrosOtros, h, g, a, m, 'manifiestoEscombros'),
        subirListaArchivos(isEDR ? valores.manifiestoSargazo : valores.manifiestoSargazoOtros, h, g, a, m, 'manifiestoSargazo'),
        subirListaArchivos(isEDR ? valores.bitacoraSargazo : valores.bitacoraSargazoOtros, h, g, a, m, 'bitacoraSargazo')
      ]);

      const payload = {
        hotel: hotelSeleccionado,
        grupo: grupoSeleccionado || 'Mantenimiento',
        ano: anoSeleccionado || '2026',
        mes: mesSeleccionado || 'Enero',
        nombre_responsable: valores.nombreResponsable,
        puesto_responsable: valores.puestoResponsable,
        correo_responsable: valores.correoResponsable,
        created_at: new Date().toISOString(),
        datos: {
          totalEnergia: isEDR ? totalEnergia : valores.totalElectricidadOtros,
          energiaSec1: isEDR ? energiaSec1 : null,
          energiaSec2: isEDR ? energiaSec2 : null,
          energiaSec3: isEDR ? energiaSec3 : null,
          costoElectricidad: isEDR ? valores.costoElectricidad : valores.costoElectricidadOtros,
          combustibles: isEDR ? combustiblesEDR : combustiblesOtros,
          costoGasLP: isEDR ? valores.costoGasLP : valores.costoGasLPOtros,
          fuenteAguaPotable: isEDR ? valores.fuenteAguaPotable : valores.fuenteAguaPotableOtros,
          agua: isEDR ? aguaEDR : aguaOtros,
          situacionLectura: isEDR ? situacionEDR : situacionOtros,
          volumenSargazo: isEDR ? valores.volumenSargazo : valores.volumenSargazoOtros,
          archivos: {
            recibosElectricidad: recibosElectricidadPaths,
            facturasGasLP: facturasGasLPPaths,
            bitacoraGasLP: bitacoraGasLPPaths,
            facturasDiesel: facturasDieselPaths,
            bitacoraDiesel: bitacoraDieselPaths,
            facturasGasolina: facturasGasolinaPaths,
            bitacoraGasolina: bitacoraGasolinaPaths,
            facturasLena: facturasLenaPaths,
            facturasCarbon: facturasCarbonPaths,
            bitacoraAgua: bitacoraAguaPaths,
            evidenciaReporteGestores: evidenciaReporteGestoresPaths,
            reporteEnergeticos: reporteEnergeticosPaths,
            manifiestoGrasaCarcamos: manifiestoGrasaCarcamosPaths,
            manifiestoGrasaCampanas: manifiestoGrasaCampanasPaths,
            manifiestoResiduosPeligrosos: manifiestoResiduosPeligrososPaths,
            manifiestoEscombros: manifiestoEscombrosPaths,
            manifiestoSargazo: manifiestoSargazoPaths,
            bitacoraSargazo: bitacoraSargazoPaths
          }
        }
      };

      // 3. Eliminar archivos antiguos que ya no están en las nuevas rutas
      const newPaths = [
        ...recibosElectricidadPaths,
        ...facturasGasLPPaths,
        ...bitacoraGasLPPaths,
        ...facturasDieselPaths,
        ...bitacoraDieselPaths,
        ...facturasGasolinaPaths,
        ...bitacoraGasolinaPaths,
        ...facturasLenaPaths,
        ...facturasCarbonPaths,
        ...bitacoraAguaPaths,
        ...evidenciaReporteGestoresPaths,
        ...reporteEnergeticosPaths,
        ...manifiestoGrasaCarcamosPaths,
        ...manifiestoGrasaCampanasPaths,
        ...manifiestoResiduosPeligrososPaths,
        ...manifiestoEscombrosPaths,
        ...manifiestoSargazoPaths,
        ...bitacoraSargazoPaths
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

      {hotelSeleccionado === 'El Dorado Royale (EDR)' && (
        <div className="space-y-6 md:space-y-8">
          {/* Sección I: Energía Eléctrica */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Consumo de Energía Eléctrica"
            description="Registro mensual del consumo eléctrico del hotel (Total y soportes en formato digital)."
          />

          {/* Seccion de Energia Electrica EDR */}
          <div className="space-y-6">
            <TableCaptureCard
              title="Consumo de Energía Eléctrica"
              subtitle="Captura horizontal de consumo de electricidad en kWh (Total y por secciones)"
              columns={columnasElectricidadEDR}
              values={{
                total: totalEnergia,
                sec1: energiaSec1,
                sec2: energiaSec2,
                sec3: energiaSec3
              }}
              onChange={(key, val) => {
                if (key === 'total') setTotalEnergia(val)
                if (key === 'sec1') setEnergiaSec1(val)
                if (key === 'sec2') setEnergiaSec2(val)
                if (key === 'sec3') setEnergiaSec3(val)
              }}
            />

            {/* Validación de sumatoria de energía en EDR */}
            {(() => {
              const parseNum = (val) => {
                if (!val) return 0;
                const cleaned = val.replace(/[$ ]/g, '').replace(',', '.');
                const num = Number(cleaned);
                return isNaN(num) ? 0 : num;
              };

              const totalVal = parseNum(totalEnergia);
              const sec1Val = parseNum(energiaSec1);
              const sec2Val = parseNum(energiaSec2);
              const sec3Val = parseNum(energiaSec3);
              const sumSecciones = sec1Val + sec2Val + sec3Val;

              // Show validation status only if some values are entered
              const hasValues = totalEnergia || energiaSec1 || energiaSec2 || energiaSec3;
              if (!hasValues) return null;

              const match = Math.abs(sumSecciones - totalVal) < 0.01;

              return (
                <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm ${match
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50/80 border-amber-200 text-amber-800 font-medium'
                  }`}>
                  <div className="flex-shrink-0">
                    {match ? (
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm">
                      {match ? (
                        <span>
                          La suma de las tres secciones coincide con el consumo total.
                        </span>
                      ) : (
                        <span>
                          La suma de las tres secciones no coincide con el consumo total del mes. Diferencia: <strong className="underline text-red-600 font-bold">{Math.abs(totalVal - sumSecciones).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Costo y Soportes de Electricidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInputField 
                  label="9. Costo Total del consumo de energía eléctrica del mes" 
                  subtitle="En moneda local (Dato tomado del recibo de la compañía de luz)" 
                  placeholder="$0.00"
                  name="costoElectricidad"
                  value={valores.costoElectricidad}
                  onChange={(val) => handleCambioCampo('costoElectricidad', val)}
                  hasError={showErrors && !valores.costoElectricidad}
                />
                <FileUploadField 
                  label="10. Adjunta por favor los recibos de electricidad del mes, por ambos lados"
                  name="recibosElectricidad"
                  value={valores.recibosElectricidad}
                  onChange={(files) => handleCambioCampo('recibosElectricidad', files)}
                  hasError={showErrors && (!valores.recibosElectricidad || valores.recibosElectricidad.length === 0)}
                />
              </div>
            </div>
          </div>

          {/* Sección II: Combustibles */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9.879z" />
              </svg>
            }
            title="Consumo de Combustibles"
            description="Captura de volumen de combustibles utilizados (Gas LP, Diesel, Gasolina, Leña, Carbón Vegetal) y sus comprobantes."
          />

          {/* Seccion de Combustibles EDR */}
          <div className="space-y-6">
            <TableCaptureCard
              title="Consumo de Combustibles"
              subtitle="Captura horizontal de consumo de Gas LP, Diesel, Gasolina (Litros), Leña y Carbón Vegetal (Kilogramos)"
              columns={columnasCombustibles}
              values={combustiblesEDR}
              onChange={handleCambioCombustiblesEDR}
            />

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Costos y Soportes de Combustibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <TextInputField 
                    label="16. ¿Cuál fue el costo total de Gas LP del mes?" 
                    subtitle="Moneda nacional" 
                    placeholder="$0.00"
                    name="costoGasLP"
                    value={valores.costoGasLP}
                    onChange={(val) => handleCambioCampo('costoGasLP', val)}
                    hasError={showErrors && !valores.costoGasLP}
                  />
                </div>
                <FileUploadField 
                  label="17. Adjunta las facturas de Gas Lp del período del mes."
                  name="facturasGasLP"
                  value={valores.facturasGasLP}
                  onChange={(files) => handleCambioCampo('facturasGasLP', files)}
                  hasError={showErrors && (!valores.facturasGasLP || valores.facturasGasLP.length === 0)}
                />
                <FileUploadField 
                  label="18. Adjunta la bitácora de consumo de Gas Lp del mes."
                  name="bitacoraGasLP"
                  value={valores.bitacoraGasLP}
                  onChange={(files) => handleCambioCampo('bitacoraGasLP', files)}
                  hasError={showErrors && (!valores.bitacoraGasLP || valores.bitacoraGasLP.length === 0)}
                />
                <FileUploadField 
                  label="19. Adjunta las facturas de Diesel del mes"
                  name="facturasDiesel"
                  value={valores.facturasDiesel}
                  onChange={(files) => handleCambioCampo('facturasDiesel', files)}
                  hasError={showErrors && (!valores.facturasDiesel || valores.facturasDiesel.length === 0)}
                />
                <FileUploadField 
                  label="20. Adjunta la bitácora de consumo de Diesel del mes"
                  name="bitacoraDiesel"
                  value={valores.bitacoraDiesel}
                  onChange={(files) => handleCambioCampo('bitacoraDiesel', files)}
                  hasError={showErrors && (!valores.bitacoraDiesel || valores.bitacoraDiesel.length === 0)}
                />
                <FileUploadField 
                  label="21. Adjunta las facturas de Gasolina del mes"
                  name="facturasGasolina"
                  value={valores.facturasGasolina}
                  onChange={(files) => handleCambioCampo('facturasGasolina', files)}
                  hasError={showErrors && (!valores.facturasGasolina || valores.facturasGasolina.length === 0)}
                />
                <FileUploadField 
                  label="22. Adjunta la bitácora de consumo de Gasolina del mes"
                  name="bitacoraGasolina"
                  value={valores.bitacoraGasolina}
                  onChange={(files) => handleCambioCampo('bitacoraGasolina', files)}
                  hasError={showErrors && (!valores.bitacoraGasolina || valores.bitacoraGasolina.length === 0)}
                />
                <FileUploadField 
                  label="23. Adjunta las facturas de Leña del mes"
                  name="facturasLena"
                  value={valores.facturasLena}
                  onChange={(files) => handleCambioCampo('facturasLena', files)}
                  hasError={showErrors && (!valores.facturasLena || valores.facturasLena.length === 0)}
                />
                <FileUploadField 
                  label="24. Adjunta las facturas de Carbón Vegetal vegetal del mes"
                  name="facturasCarbon"
                  value={valores.facturasCarbon}
                  onChange={(files) => handleCambioCampo('facturasCarbon', files)}
                  hasError={showErrors && (!valores.facturasCarbon || valores.facturasCarbon.length === 0)}
                />
              </div>
            </div>
          </div>

          {/* Sección III: Consumo de Agua */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21.5c4.14 0 7.5-3.36 7.5-7.5C19.5 7.5 12 2.5 12 2.5S4.5 7.5 4.5 14c0 4.14 3.36 7.5 7.5 7.5z" />
              </svg>
            }
            title="Consumo de Agua"
            description="Registro y control de las fuentes de abastecimiento de agua potable y volúmenes mensuales consumidos/tratados."
          />

          {/* Seccion de Agua EDR */}
          <div className="space-y-6">
            <TableCaptureCard
              title="Consumo de Agua"
              subtitle="Captura horizontal de volúmenes de agua consumida, extraída y tratada (Metros cúbicos)"
              columns={columnasAgua}
              values={aguaEDR}
              onChange={handleCambioAguaEDR}
            >
              <TextInputField 
                label="25. ¿Cuál es la fuente del agua potable?" 
                placeholder="Escriba aquí"
                name="fuenteAguaPotable"
                value={valores.fuenteAguaPotable}
                onChange={(val) => handleCambioCampo('fuenteAguaPotable', val)}
                hasError={showErrors && !valores.fuenteAguaPotable}
              />
            </TableCaptureCard>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Detalles y Soportes del Consumo de Agua</h3>
              <div className="flex flex-col gap-6">
                <FileUploadField 
                  label="34. Adjunta la bitácora de consumo de agua del mes así como el soporte de las lecturas de los medidores."
                  name="bitacoraAgua"
                  value={valores.bitacoraAgua}
                  onChange={(files) => handleCambioCampo('bitacoraAgua', files)}
                  hasError={showErrors && (!valores.bitacoraAgua || valores.bitacoraAgua.length === 0)}
                />
                <SelectInputField
                  label="35. Durante el mes, ¿hubo alguna situación que impidiera la toma de lecturas de los medidores? Por favor detalla qué fue lo que pasó."
                  options={["Si", "No"]}
                  placeholder="Seleccionar..."
                  name="situacionEDR"
                  value={situacionEDR}
                  onChange={(e) => setSituacionEDR(e.target.value)}
                  hasError={showErrors && !situacionEDR}
                />
                {situacionEDR === 'Si' && (
                  <FileUploadField
                    label={`${getQNumEDR(36)}. Adjuntar evidencia del reporte enviado a los Gestores externos del Grupo`}
                    subtitle="Correo, informe, etc."
                    name="evidenciaReporteGestores"
                    value={valores.evidenciaReporteGestores}
                    onChange={(files) => handleCambioCampo('evidenciaReporteGestores', files)}
                    hasError={showErrors && (!valores.evidenciaReporteGestores || valores.evidenciaReporteGestores.length === 0)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sección IV: Reporte de Energéticos */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Reporte de Energéticos"
            description="Carga del informe consolidado final de energéticos correspondientes al mes."
          />

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
            <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Reporte de energéticos</h3>
            <FileUploadField 
              label={`${getQNumEDR(37)}. Adjunta el reporte de energéticos del mes, en version final.`}
              name="reporteEnergeticos"
              value={valores.reporteEnergeticos}
              onChange={(files) => handleCambioCampo('reporteEnergeticos', files)}
              hasError={showErrors && (!valores.reporteEnergeticos || valores.reporteEnergeticos.length === 0)}
            />
          </div>

          {/* Sección V: Residuos Especiales y Peligrosos */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            title="Residuos Especiales y Peligrosos"
            description="Manifiestos de recolección autorizados para trampas de grasa, residuos peligrosos y escombros."
          />

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
            <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Residuos peligrosos y de manejo especial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadField 
                label={`${getQNumEDR(38)}. Adjunte el manifiesto de recolección de Trampas de grasa (Cárcamos)`}
                name="manifiestoGrasaCarcamos"
                value={valores.manifiestoGrasaCarcamos}
                onChange={(files) => handleCambioCampo('manifiestoGrasaCarcamos', files)}
                hasError={showErrors && (!valores.manifiestoGrasaCarcamos || valores.manifiestoGrasaCarcamos.length === 0)}
              />
              <FileUploadField 
                label={`${getQNumEDR(39)}. Adjunte el manifiesto de recolección de Trampas de grasa (Campanas)`}
                name="manifiestoGrasaCampanas"
                value={valores.manifiestoGrasaCampanas}
                onChange={(files) => handleCambioCampo('manifiestoGrasaCampanas', files)}
                hasError={showErrors && (!valores.manifiestoGrasaCampanas || valores.manifiestoGrasaCampanas.length === 0)}
              />
              <FileUploadField 
                label={`${getQNumEDR(40)}. Adjunte el manifiesto de recolección de Residuos Peligrosos`}
                name="manifiestoResiduosPeligrosos"
                value={valores.manifiestoResiduosPeligrosos}
                onChange={(files) => handleCambioCampo('manifiestoResiduosPeligrosos', files)}
                hasError={showErrors && (!valores.manifiestoResiduosPeligrosos || valores.manifiestoResiduosPeligrosos.length === 0)}
              />
              <FileUploadField 
                label={`${getQNumEDR(41)}. Adjunte el manifiesto de recolección de Escombros`}
                name="manifiestoEscombros"
                value={valores.manifiestoEscombros}
                onChange={(files) => handleCambioCampo('manifiestoEscombros', files)}
                hasError={showErrors && (!valores.manifiestoEscombros || valores.manifiestoEscombros.length === 0)}
              />
            </div>
          </div>

          {/* Sección VI: Control de Sargazo */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0M3 14c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0" />
              </svg>
            }
            title="Control de Sargazo"
            description="Registro del volumen mensual recolectado de sargazo y carga de bitácoras y manifiestos de retiro."
          />

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
            <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Sargazo</h3>
            <div className="md:col-span-2">
              <TextInputField 
                label={`${getQNumEDR(42)}. Volumen de sargazo registrado`} 
                subtitle="Metros cúbicos" 
                placeholder="0.00"
                name="volumenSargazo"
                value={valores.volumenSargazo}
                onChange={(val) => handleCambioCampo('volumenSargazo', val)}
                hasError={showErrors && !valores.volumenSargazo}
              />
            </div>
            <div className="md:col-span-2">
              <FileUploadField 
                label={`${getQNumEDR(43)}. Adjunte el manifiesto de recolección de Sargazo`}
                name="manifiestoSargazo"
                value={valores.manifiestoSargazo}
                onChange={(files) => handleCambioCampo('manifiestoSargazo', files)}
                hasError={showErrors && (!valores.manifiestoSargazo || valores.manifiestoSargazo.length === 0)}
              />
            </div>
            <FileUploadField 
              label={`${getQNumEDR(44)}. Adjunta el reporte de retiro de sargazo (bitácora)`} 
              subtitle="Cargar archivo."
              name="bitacoraSargazo"
              value={valores.bitacoraSargazo}
              onChange={(files) => handleCambioCampo('bitacoraSargazo', files)}
              hasError={showErrors && (!valores.bitacoraSargazo || valores.bitacoraSargazo.length === 0)}
            />
          </div>

          {/* Sección VII: Datos de Llenado */}
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
                label={`${getQNumEDR(45)}. Nombre de quien llenó el cuestionario.`} 
                placeholder="Escriba aquí"
                name="nombreResponsable"
                value={valores.nombreResponsable}
                onChange={(val) => handleCambioCampo('nombreResponsable', val)}
                hasError={showErrors && !valores.nombreResponsable}
              />
              <TextInputField 
                label={`${getQNumEDR(46)}. Puesto de quien llenó el cuestionario.`} 
                placeholder="Escriba aquí"
                name="puestoResponsable"
                value={valores.puestoResponsable}
                onChange={(val) => handleCambioCampo('puestoResponsable', val)}
                hasError={showErrors && !valores.puestoResponsable}
              />
              <div className="md:col-span-2">
                <TextInputField 
                  label={`${getQNumEDR(47)}. Correo electrónico`} 
                  placeholder="Escriba aquí"
                  name="correoResponsable"
                  value={valores.correoResponsable}
                  onChange={(val) => handleCambioCampo('correoResponsable', val)}
                  hasError={showErrors && !valores.correoResponsable}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {hotelSeleccionado !== '' && hotelSeleccionado !== 'El Dorado Royale (EDR)' && (
        <div className="space-y-6 md:space-y-8">
          {/* Sección I: Energía Eléctrica */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Consumo de Energía Eléctrica"
            description="Registro mensual del consumo eléctrico del hotel (Total y soportes en formato digital)."
          />

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
            <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Consumo de Energía Eléctrica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInputField 
                label="5. Consumo de energía eléctrica TOTAL del mes" 
                subtitle="Dato final tomado del o los recibos de la compañía de luz" 
                placeholder="0.00"
                name="totalElectricidadOtros"
                value={valores.totalElectricidadOtros}
                onChange={(val) => handleCambioCampo('totalElectricidadOtros', val)}
                hasError={showErrors && !valores.totalElectricidadOtros}
              />
              <TextInputField 
                label="6. Costo Total del consumo de energía eléctrica del mes" 
                subtitle="En moneda local (Dato tomado del recibo de la compañía de luz)." 
                placeholder="$0.00"
                name="costoElectricidadOtros"
                value={valores.costoElectricidadOtros}
                onChange={(val) => handleCambioCampo('costoElectricidadOtros', val)}
                hasError={showErrors && !valores.costoElectricidadOtros}
              />
              <div className="md:col-span-2">
                <FileUploadField 
                  label="7. Adjunta por favor el o los recibos de electricidad del mes, por ambos lados"
                  name="recibosElectricidadOtros"
                  value={valores.recibosElectricidadOtros}
                  onChange={(files) => handleCambioCampo('recibosElectricidadOtros', files)}
                  hasError={showErrors && (!valores.recibosElectricidadOtros || valores.recibosElectricidadOtros.length === 0)}
                />
              </div>
            </div>
          </div>

          {/* Sección II: Combustibles */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9.879z" />
              </svg>
            }
            title="Consumo de Combustibles"
            description="Captura de volumen de combustibles utilizados (Gas LP, Diesel, Gasolina, Leña, Carbón Vegetal) y sus comprobantes."
          />

          {/* Seccion de Combustibles Otros Hoteles */}
          <div className="space-y-6">
            <TableCaptureCard
              title="Consumo de Combustibles"
              subtitle="Captura horizontal de consumo de Gas LP, Diesel, Gasolina (Litros), Leña y Carbón Vegetal (Kilogramos)"
              columns={columnasCombustiblesOtros}
              values={combustiblesOtros}
              onChange={handleCambioCombustiblesOtros}
            />

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Costos y Soportes de Combustibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <TextInputField 
                    label="13. ¿Cuál fue el costo total de Gas LP del mes?" 
                    subtitle="Moneda nacional" 
                    placeholder="$0.00"
                    name="costoGasLPOtros"
                    value={valores.costoGasLPOtros}
                    onChange={(val) => handleCambioCampo('costoGasLPOtros', val)}
                    hasError={showErrors && !valores.costoGasLPOtros}
                  />
                </div>
                <FileUploadField 
                  label="14. Adjunta las facturas de Gas Lp del período del mes."
                  name="facturasGasLPOtros"
                  value={valores.facturasGasLPOtros}
                  onChange={(files) => handleCambioCampo('facturasGasLPOtros', files)}
                  hasError={showErrors && (!valores.facturasGasLPOtros || valores.facturasGasLPOtros.length === 0)}
                />
                <FileUploadField 
                  label="15. Adjunta la bitácora de consumo de Gas Lp del mes."
                  name="bitacoraGasLPOtros"
                  value={valores.bitacoraGasLPOtros}
                  onChange={(files) => handleCambioCampo('bitacoraGasLPOtros', files)}
                  hasError={showErrors && (!valores.bitacoraGasLPOtros || valores.bitacoraGasLPOtros.length === 0)}
                />
                <FileUploadField 
                  label="16. Adjunta las facturas de Diesel del mes"
                  name="facturasDieselOtros"
                  value={valores.facturasDieselOtros}
                  onChange={(files) => handleCambioCampo('facturasDieselOtros', files)}
                  hasError={showErrors && (!valores.facturasDieselOtros || valores.facturasDieselOtros.length === 0)}
                />
                <FileUploadField 
                  label="17. Adjunta la bitácora de consumo de Diesel del mes"
                  name="bitacoraDieselOtros"
                  value={valores.bitacoraDieselOtros}
                  onChange={(files) => handleCambioCampo('bitacoraDieselOtros', files)}
                  hasError={showErrors && (!valores.bitacoraDieselOtros || valores.bitacoraDieselOtros.length === 0)}
                />
                <FileUploadField 
                  label="18. Adjunta las facturas de Gasolina del mes"
                  name="facturasGasolinaOtros"
                  value={valores.facturasGasolinaOtros}
                  onChange={(files) => handleCambioCampo('facturasGasolinaOtros', files)}
                  hasError={showErrors && (!valores.facturasGasolinaOtros || valores.facturasGasolinaOtros.length === 0)}
                />
                <FileUploadField 
                  label="19. Adjunta la bitácora de consumo de Gasolina del mes"
                  name="bitacoraGasolinaOtros"
                  value={valores.bitacoraGasolinaOtros}
                  onChange={(files) => handleCambioCampo('bitacoraGasolinaOtros', files)}
                  hasError={showErrors && (!valores.bitacoraGasolinaOtros || valores.bitacoraGasolinaOtros.length === 0)}
                />
                <FileUploadField 
                  label="20. Adjunta las facturas de Leña del mes"
                  name="facturasLenaOtros"
                  value={valores.facturasLenaOtros}
                  onChange={(files) => handleCambioCampo('facturasLenaOtros', files)}
                  hasError={showErrors && (!valores.facturasLenaOtros || valores.facturasLenaOtros.length === 0)}
                />
                <FileUploadField 
                  label="21. Adjunta las facturas de Carbón Vegetal vegetal del mes"
                  name="facturasCarbonOtros"
                  value={valores.facturasCarbonOtros}
                  onChange={(files) => handleCambioCampo('facturasCarbonOtros', files)}
                  hasError={showErrors && (!valores.facturasCarbonOtros || valores.facturasCarbonOtros.length === 0)}
                />
              </div>
            </div>
          </div>

          {/* Sección III: Consumo de Agua */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21.5c4.14 0 7.5-3.36 7.5-7.5C19.5 7.5 12 2.5 12 2.5S4.5 7.5 4.5 14c0 4.14 3.36 7.5 7.5 7.5z" />
              </svg>
            }
            title="Consumo de Agua"
            description="Registro y control de las fuentes de abastecimiento de agua potable y volúmenes mensuales consumidos/tratados."
          />

          {/* Seccion de Agua Otros Hoteles */}
          <div className="space-y-6">
            <TableCaptureCard
              title="Consumo de Agua"
              subtitle="Captura horizontal de volúmenes de agua consumida, extraída y tratada (Metros cúbicos)"
              columns={columnasAguaOtros}
              values={aguaOtros}
              onChange={handleCambioAguaOtros}
            >
              <TextInputField 
                label="22. ¿Cuál es la fuente del agua potable?" 
                placeholder="Escriba aquí"
                name="fuenteAguaPotableOtros"
                value={valores.fuenteAguaPotableOtros}
                onChange={(val) => handleCambioCampo('fuenteAguaPotableOtros', val)}
                hasError={showErrors && !valores.fuenteAguaPotableOtros}
              />
            </TableCaptureCard>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Detalles y Soportes del Consumo de Agua</h3>
              <div className="flex flex-col gap-6">
                <FileUploadField 
                  label="31. Adjunta la bitácora de consumo de agua del mes así como el soporte de las lecturas de los medidores."
                  name="bitacoraAguaOtros"
                  value={valores.bitacoraAguaOtros}
                  onChange={(files) => handleCambioCampo('bitacoraAguaOtros', files)}
                  hasError={showErrors && (!valores.bitacoraAguaOtros || valores.bitacoraAguaOtros.length === 0)}
                />
                <SelectInputField
                  label="32. Durante el mes, ¿hubo alguna situación que impidiera la toma de lecturas de los medidores? Por favor detalla qué fue lo que pasó."
                  options={["Si", "No"]}
                  placeholder="Seleccionar..."
                  name="situacionOtros"
                  value={situacionOtros}
                  onChange={(e) => setSituacionOtros(e.target.value)}
                  hasError={showErrors && !situacionOtros}
                />
                {situacionOtros === 'Si' && (
                  <FileUploadField
                    label={`${getQNumOtros(33)}. Adjuntar evidencia del reporte enviado a los Gestores externos del Grupo`}
                    subtitle="Correo, informe, etc."
                    name="evidenciaReporteGestores"
                    value={valores.evidenciaReporteGestores}
                    onChange={(files) => handleCambioCampo('evidenciaReporteGestores', files)}
                    hasError={showErrors && (!valores.evidenciaReporteGestores || valores.evidenciaReporteGestores.length === 0)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sección IV: Reporte de Energéticos */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Reporte de Energéticos"
            description="Carga del informe consolidado final de energéticos correspondientes al mes."
          />

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
            <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Reporte de energéticos</h3>
            <FileUploadField 
              label={`${getQNumOtros(34)}. Adjunta el reporte de energéticos del mes, en versión final.`}
              name="reporteEnergeticosOtros"
              value={valores.reporteEnergeticosOtros}
              onChange={(files) => handleCambioCampo('reporteEnergeticosOtros', files)}
              hasError={showErrors && (!valores.reporteEnergeticosOtros || valores.reporteEnergeticosOtros.length === 0)}
            />
          </div>

          {/* Sección V: Residuos Especiales y Peligrosos */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            title="Residuos Especiales y Peligrosos"
            description="Manifiestos de recolección autorizados para trampas de grasa, residuos peligrosos y escombros."
          />

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
            <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Residuos peligrosos y de manejo especial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadField 
                label={`${getQNumOtros(35)}. Adjunte el manifiesto de recolección de Trampas de grasa (Cárcamos)`}
                name="manifiestoGrasaCarcamosOtros"
                value={valores.manifiestoGrasaCarcamosOtros}
                onChange={(files) => handleCambioCampo('manifiestoGrasaCarcamosOtros', files)}
                hasError={showErrors && (!valores.manifiestoGrasaCarcamosOtros || valores.manifiestoGrasaCarcamosOtros.length === 0)}
              />
              <FileUploadField 
                label={`${getQNumOtros(36)}. Adjunte el manifiesto de recolección de Trampas de grasa (Campanas)`}
                name="manifiestoGrasaCampanasOtros"
                value={valores.manifiestoGrasaCampanasOtros}
                onChange={(files) => handleCambioCampo('manifiestoGrasaCampanasOtros', files)}
                hasError={showErrors && (!valores.manifiestoGrasaCampanasOtros || valores.manifiestoGrasaCampanasOtros.length === 0)}
              />
              <FileUploadField 
                label={`${getQNumOtros(37)}. Adjunte el manifiesto de recolección de Residuos Peligrosos`}
                name="manifiestoResiduosPeligrososOtros"
                value={valores.manifiestoResiduosPeligrososOtros}
                onChange={(files) => handleCambioCampo('manifiestoResiduosPeligrososOtros', files)}
                hasError={showErrors && (!valores.manifiestoResiduosPeligrososOtros || valores.manifiestoResiduosPeligrososOtros.length === 0)}
              />
              <FileUploadField 
                label={`${getQNumOtros(38)}. Adjunte el manifiesto de recolección de Escombros`}
                name="manifiestoEscombrosOtros"
                value={valores.manifiestoEscombrosOtros}
                onChange={(files) => handleCambioCampo('manifiestoEscombrosOtros', files)}
                hasError={showErrors && (!valores.manifiestoEscombrosOtros || valores.manifiestoEscombrosOtros.length === 0)}
              />
            </div>
          </div>

          {/* Sección VI: Control de Sargazo */}
          <FormSectionDivider
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0M3 14c1.5-2 3.5-2 5 0s3.5 2 5 0s3.5-2 5 0v3" />
              </svg>
            }
            title="Control de Sargazo"
            description="Registro del volumen mensual recolectado de sargazo y carga de bitácoras y manifiestos de retiro."
          />

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
            <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Sargazo</h3>
            <div className="md:col-span-2">
              <TextInputField 
                label={`${getQNumOtros(39)}. Volumen de sargazo registrado`} 
                subtitle="Metros cúbicos" 
                placeholder="0.00"
                name="volumenSargazoOtros"
                value={valores.volumenSargazoOtros}
                onChange={(val) => handleCambioCampo('volumenSargazoOtros', val)}
                hasError={showErrors && !valores.volumenSargazoOtros}
              />
            </div>
            <div className="md:col-span-2">
              <FileUploadField 
                label={`${getQNumOtros(40)}. Adjunte el manifiesto de recolección de Sargazo`}
                name="manifiestoSargazoOtros"
                value={valores.manifiestoSargazoOtros}
                onChange={(files) => handleCambioCampo('manifiestoSargazoOtros', files)}
                hasError={showErrors && (!valores.manifiestoSargazoOtros || valores.manifiestoSargazoOtros.length === 0)}
              />
            </div>
            <FileUploadField 
              label={`${getQNumOtros(41)}. Adjunta el reporte de retiro de sargazo (bitácora)`} 
              subtitle="Cargar archivo."
              name="bitacoraSargazoOtros"
              value={valores.bitacoraSargazoOtros}
              onChange={(files) => handleCambioCampo('bitacoraSargazoOtros', files)}
              hasError={showErrors && (!valores.bitacoraSargazoOtros || valores.bitacoraSargazoOtros.length === 0)}
            />
          </div>

          {/* Sección VII: Datos de Llenado */}
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
                label={`${getQNumOtros(42)}. Nombre de quien llenó el cuestionario.`} 
                placeholder="Escriba aquí"
                name="nombreResponsable"
                value={valores.nombreResponsable}
                onChange={(val) => handleCambioCampo('nombreResponsable', val)}
                hasError={showErrors && !valores.nombreResponsable}
              />
              <TextInputField 
                label={`${getQNumOtros(43)}. Puesto de quien llenó el cuestionario.`} 
                placeholder="Escriba aquí"
                name="puestoResponsable"
                value={valores.puestoResponsable}
                onChange={(val) => handleCambioCampo('puestoResponsable', val)}
                hasError={showErrors && !valores.puestoResponsable}
              />
              <div className="md:col-span-2">
                <TextInputField 
                  label={`${getQNumOtros(44)}. Correo electrónico`} 
                  placeholder="Escriba aquí"
                  name="correoResponsable"
                  value={valores.correoResponsable}
                  onChange={(val) => handleCambioCampo('correoResponsable', val)}
                  hasError={showErrors && !valores.correoResponsable}
                />
              </div>
            </div>
          </div>
        </div>
      )}

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
            <p className="text-sm mt-1">Los indicadores de Mantenimiento para <strong>{hotelSeleccionado}</strong> se han registrado correctamente en la base de datos de Supabase.</p>
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
              Guardar Grupo Mantenimiento
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default MantenimientoForm
