import React, { useState } from 'react'
import { FileUploadField, TextInputField, TableCaptureCard, FormSectionDivider, SelectInputField } from './FormComponents'

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

const MantenimientoForm = ({ hotelSeleccionado }) => {
  const [totalEnergia, setTotalEnergia] = useState('')
  const [energiaSec1, setEnergiaSec1] = useState('')
  const [energiaSec2, setEnergiaSec2] = useState('')
  const [energiaSec3, setEnergiaSec3] = useState('')

  const [situacionEDR, setSituacionEDR] = useState('')
  const [situacionOtros, setSituacionOtros] = useState('')

  const getQNumEDR = (baseNum) => {
    if (baseNum <= 35) return baseNum;
    return situacionEDR === 'Si' ? baseNum : baseNum - 1;
  }

  const getQNumOtros = (baseNum) => {
    if (baseNum <= 32) return baseNum;
    return situacionOtros === 'Si' ? baseNum : baseNum - 1;
  }

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

  const handleCambioCombustiblesEDR = (key, val) => {
    setCombustiblesEDR(prev => ({ ...prev, [key]: val }))
  }

  const handleCambioAguaEDR = (key, val) => {
    setAguaEDR(prev => ({ ...prev, [key]: val }))
  }

  const handleCambioCombustiblesOtros = (key, val) => {
    setCombustiblesOtros(prev => ({ ...prev, [key]: val }))
  }

  const handleCambioAguaOtros = (key, val) => {
    setAguaOtros(prev => ({ ...prev, [key]: val }))
  }

  return (
    <>
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
                <TextInputField label="9. Costo Total del consumo de energía eléctrica del mes" subtitle="En moneda local (Dato tomado del recibo de la compañía de luz)" placeholder="$0.00" />
                <FileUploadField label="10. Adjunta por favor los recibos de electricidad del mes, por ambos lados" />
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
                  <TextInputField label="16. ¿Cuál fue el costo total de Gas LP del mes?" subtitle="Moneda nacional" placeholder="$0.00" />
                </div>
                <FileUploadField label="17. Adjunta las facturas de Gas Lp del período del mes." />
                <FileUploadField label="18. Adjunta la bitácora de consumo de Gas Lp del mes." />
                <FileUploadField label="19. Adjunta las facturas de Diesel del mes" />
                <FileUploadField label="20. Adjunta la bitácora de consumo de Diesel del mes" />
                <FileUploadField label="21. Adjunta las facturas de Gasolina del mes" />
                <FileUploadField label="22. Adjunta la bitácora de consumo de Gasolina del mes" />
                <FileUploadField label="23. Adjunta las facturas de Leña del mes" />
                <FileUploadField label="24. Adjunta las facturas de Carbón Vegetal vegetal del mes" />
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
              <TextInputField label="25. ¿Cuál es la fuente del agua potable?" placeholder="Escriba aquí" />
            </TableCaptureCard>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Detalles y Soportes del Consumo de Agua</h3>
              <div className="gflex flex-col gap-6">
                <FileUploadField label="34. Adjunta la bitácora de consumo de agua del mes así como el soporte de las lecturas de los medidores." />
                <SelectInputField
                  label="35. Durante el mes, ¿hubo alguna situación que impidiera la toma de lecturas de los medidores? Por favor detalla qué fue lo que pasó."
                  options={["Si", "No"]}
                  placeholder="Seleccionar..."
                  onChange={(e) => setSituacionEDR(e.target.value)}
                />
                {situacionEDR === 'Si' && (
                  <FileUploadField
                    label={`${getQNumEDR(36)}. Adjuntar evidencia del reporte enviado a los Gestores externos del Grupo`}
                    subtitle="Correo, informe, etc."
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
            <FileUploadField label={`${getQNumEDR(37)}. Adjunta el reporte de energéticos del mes, en versión final.`} />
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
              <FileUploadField label={`${getQNumEDR(38)}. Adjunte el manifiesto de recolección de Trampas de grasa (Cárcamos)`} />
              <FileUploadField label={`${getQNumEDR(39)}. Adjunte el manifiesto de recolección de Trampas de grasa (Campanas)`} />
              <FileUploadField label={`${getQNumEDR(40)}. Adjunte el manifiesto de recolección de Residuos Peligrosos`} />
              <FileUploadField label={`${getQNumEDR(41)}. Adjunte el manifiesto de recolección de Escombros`} />
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
              <TextInputField label={`${getQNumEDR(42)}. Volumen de sargazo registrado`} subtitle="Metros cúbicos" placeholder="0.00" />
            </div>
            <div className="md:col-span-2">
              <FileUploadField label={`${getQNumEDR(43)}. Adjunte el manifiesto de recolección de Sargazo`} />
            </div>
            <FileUploadField label={`${getQNumEDR(44)}. Adjunta el reporte de retiro de sargazo (bitácora)`} subtitle="Cargar archivo." />
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
              <TextInputField label={`${getQNumEDR(45)}. Nombre de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
              <TextInputField label={`${getQNumEDR(46)}. Puesto de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
              <div className="md:col-span-2">
                <TextInputField label={`${getQNumEDR(47)}. Correo electrónico`} placeholder="Escriba aquí" />
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
              <TextInputField label="5. Consumo de energía eléctrica TOTAL del mes" subtitle="Dato final tomado del o los recibos de la compañía de luz" placeholder="0.00" />
              <TextInputField label="6. Costo Total del consumo de energía eléctrica del mes" subtitle="En moneda local (Dato tomado del recibo de la compañía de luz)." placeholder="$0.00" />
              <div className="md:col-span-2">
                <FileUploadField label="7. Adjunta por favor el o los recibos de electricidad del mes, por ambos lados" />
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
            description="Captura de volumen de combustibles utilizados (Gas LP, Diesel, Gasolina, Leña, Carbón Vegetal Vegetal) y sus comprobantes."
          />

          {/* Seccion de Combustibles Otros Hoteles */}
          <div className="space-y-6">
            <TableCaptureCard
              title="Consumo de Combustibles"
              subtitle="Captura horizontal de consumo de Gas LP, Diesel, Gasolina (Litros), Leña y Carbón Vegetal Vegetal (Kilogramos)"
              columns={columnasCombustiblesOtros}
              values={combustiblesOtros}
              onChange={handleCambioCombustiblesOtros}
            />

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Costos y Soportes de Combustibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <TextInputField label="13. ¿Cuál fue el costo total de Gas LP del mes?" subtitle="Moneda nacional" placeholder="$0.00" />
                </div>
                <FileUploadField label="14. Adjunta las facturas de Gas Lp del período del mes." />
                <FileUploadField label="15. Adjunta la bitácora de consumo de Gas Lp del mes." />
                <FileUploadField label="16. Adjunta las facturas de Diesel del mes" />
                <FileUploadField label="17. Adjunta la bitácora de consumo de Diesel del mes" />
                <FileUploadField label="18. Adjunta las facturas de Gasolina del mes" />
                <FileUploadField label="19. Adjunta la bitácora de consumo de Gasolina del mes" />
                <FileUploadField label="20. Adjunta las facturas de Leña del mes" />
                <FileUploadField label="21. Adjunta las facturas de Carbón Vegetal vegetal del mes" />
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
              <TextInputField label="22. ¿Cuál es la fuente del agua potable?" placeholder="Escriba aquí" />
            </TableCaptureCard>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h3 className="text-teal-700 font-bold form-section-title border-b border-teal-100/50 pb-2">Detalles y Soportes del Consumo de Agua</h3>
              <div className="gflex flex-col gap-6">
                <FileUploadField label="31. Adjunta la bitácora de consumo de agua del mes así como el soporte de las lecturas de los medidores." />
                <SelectInputField
                  label="32. Durante el mes, ¿hubo alguna situación que impidiera la toma de lecturas de los medidores? Por favor detalla qué fue lo que pasó."
                  options={["Si", "No"]}
                  placeholder="Seleccionar..."
                  onChange={(e) => setSituacionOtros(e.target.value)}
                />
                {situacionOtros === 'Si' && (
                  <FileUploadField
                    label={`${getQNumOtros(33)}. Adjuntar evidencia del reporte enviado a los Gestores externos del Grupo`}
                    subtitle="Correo, informe, etc."
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
            <FileUploadField label={`${getQNumOtros(34)}. Adjunta el reporte de energéticos del mes, en versión final.`} />
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
              <FileUploadField label={`${getQNumOtros(35)}. Adjunte el manifiesto de recolección de Trampas de grasa (Cárcamos)`} />
              <FileUploadField label={`${getQNumOtros(36)}. Adjunte el manifiesto de recolección de Trampas de grasa (Campanas)`} />
              <FileUploadField label={`${getQNumOtros(37)}. Adjunte el manifiesto de recolección de Residuos Peligrosos`} />
              <FileUploadField label={`${getQNumOtros(38)}. Adjunte el manifiesto de recolección de Escombros`} />
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
              <TextInputField label={`${getQNumOtros(39)}. Volumen de sargazo registrado`} subtitle="Metros cúbicos" placeholder="0.00" />
            </div>
            <div className="md:col-span-2">
              <FileUploadField label={`${getQNumOtros(40)}. Adjunte el manifiesto de recolección de Sargazo`} />
            </div>
            <FileUploadField label={`${getQNumOtros(41)}. Adjunta el reporte de retiro de sargazo (bitácora)`} subtitle="Cargar archivo." />
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
              <TextInputField label={`${getQNumOtros(42)}. Nombre de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
              <TextInputField label={`${getQNumOtros(43)}. Puesto de quien llenó el cuestionario.`} placeholder="Escriba aquí" />
              <div className="md:col-span-2">
                <TextInputField label={`${getQNumOtros(44)}. Correo electrónico`} placeholder="Escriba aquí" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MantenimientoForm
