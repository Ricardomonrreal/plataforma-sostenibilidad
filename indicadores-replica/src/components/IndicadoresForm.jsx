import React, { useRef, useState } from 'react'

const FileUploadField = ({ id, label, subtitle }) => {
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (idToRemove) => {
    setFiles(prev => {
      const fileToRem = prev.find(f => f.id === idToRemove)
      if (fileToRem) URL.revokeObjectURL(fileToRem.preview)
      return prev.filter(f => f.id !== idToRemove)
    })
  }

  return (
    <div className="flex flex-col w-full gap-1 mb-2">
      <label className="text-sm md:text-base text-slate-700 font-semibold">{label}</label>
      {subtitle && <span className="text-xs text-teal-700 font-bold mb-2">{subtitle}</span>}
      <div 
        className={`border-dashed rounded-2xl w-full min-h-[120px] flex items-center justify-center cursor-pointer transition-all duration-300 p-4 ${
          isDragging 
            ? 'border-2 border-teal-500 bg-teal-50/80 scale-[1.02]' 
            : 'border border-slate-200 hover:border-teal-400 hover:bg-teal-50/30 bg-slate-50/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-full flex flex-col items-center justify-center text-slate-400 gap-3">
          <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" height="36px" width="36px" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path></svg>
          <div className="text-center">
            <div className="text-teal-600 text-sm font-medium mb-1">Subir archivo o foto</div>
            <span className="text-slate-400 text-xs">PDF, JPG, PNG (no mayor a 10 MB)</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map(f => (
            <div key={f.id} onClick={() => setPreviewFile(f)} className="relative group rounded-xl border border-slate-200 bg-white p-2 flex flex-col items-center justify-center gap-2 shadow-sm hover:border-teal-300 transition-colors cursor-pointer">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-transform hover:scale-110 z-10"
                title="Eliminar archivo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
              
              <div className="w-full h-16 flex items-center justify-center overflow-hidden rounded-lg bg-slate-50 relative">
                {f.file.type.startsWith('image/') ? (
                  <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                ) : f.file.type === 'application/pdf' ? (
                  <>
                    <iframe src={`${f.preview}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} className="w-[120%] h-[150%] absolute top-[-10%] left-[-10%] pointer-events-none" frameBorder="0" scrolling="no" title={f.file.name}></iframe>
                    <div className="absolute inset-0 z-10 bg-transparent" title={f.file.name}></div>
                  </>
                ) : (
                  <svg className="w-8 h-8 text-teal-600/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                )}
              </div>
              <span className="text-[10px] text-slate-500 w-full truncate text-center font-medium px-1" title={f.file.name}>
                {f.file.name}
              </span>
            </div>
          ))}
        </div>
      )}

      <input type="file" id={id} ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />

      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-10" onClick={() => setPreviewFile(null)}>
          <div className="relative w-full max-w-5xl h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800 truncate pr-4">{previewFile.file.name}</h3>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-slate-200" title="Cerrar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100/50 flex items-center justify-center p-4 relative">
              {previewFile.file.type.startsWith('image/') ? (
                <img src={previewFile.preview} alt={previewFile.file.name} className="max-w-full max-h-full object-contain drop-shadow-md" />
              ) : previewFile.file.type === 'application/pdf' ? (
                <object data={`${previewFile.preview}#toolbar=1&navpanes=0`} type="application/pdf" className="w-full h-full rounded shadow-sm"></object>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <svg className="w-20 h-20 mb-4 text-teal-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  <p>Previsualización no disponible para este tipo de archivo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const TextInputField = ({ label, subtitle, defaultValue, placeholder = "", isNumeric = false, onChange }) => {
  const [value, setValue] = useState(defaultValue || '');
  const [error, setError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isCurrency = placeholder.includes('$');

  const numericMode = isNumeric || 
    placeholder.includes('0.00') || 
    isCurrency || 
    (subtitle && (
      subtitle.toLowerCase().includes('litros') || 
      subtitle.toLowerCase().includes('nacional') || 
      subtitle.toLowerCase().includes('kilogramos') || 
      subtitle.toLowerCase().includes('metros cúbicos')
    ));

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    
    if (numericMode) {
      const cleanedVal = val.replace(/[$ ]/g, '').replace(',', '.');
      if (cleanedVal !== "" && isNaN(Number(cleanedVal))) {
        setError(true);
      } else {
        setError(false);
      }
    }

    if (onChange) {
      onChange(val);
    }
  };

  let displayValue = value;
  if (!isFocused && isCurrency && value !== '' && !error) {
    const cleanedVal = value.replace(/[$ ,]/g, '');
    const num = Number(cleanedVal);
    if (!isNaN(num)) {
      displayValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(num);
    }
  }

  return (
    <div className="flex flex-col w-full gap-1 mb-2">
      <div className="flex flex-col">
        <label className="text-sm md:text-base text-slate-700 font-semibold flex items-center gap-2">
          {label}
        </label>
        {subtitle && <span className="text-xs text-teal-700 font-bold mb-1">{subtitle}</span>}
      </div>
      <input 
        type="text" 
        className={`border w-full rounded-xl h-12 px-4 py-2 text-slate-800 transition-all duration-300 focus:outline-none ${
          error 
            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100'
        }`} 
        placeholder={placeholder} 
        value={isFocused ? value : displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <span className="text-xs text-red-500 font-semibold mt-1">Por favor ingrese un valor numérico válido.</span>}
    </div>
  )
}

const SelectInputField = ({ label, subtitle, options, placeholder = "Seleccionar...", onChange}) => {
  return (
    <div className="flex flex-col w-full gap-1 mb-2">
      <div className="flex flex-col">
        <label className="text-sm md:text-base text-slate-700 font-semibold flex items-center gap-2">
          {label}
        </label>
        {subtitle && <span className="text-xs text-teal-700 font-bold mb-1">{subtitle}</span>}
      </div>
      <div className="relative">
        <select className="border border-slate-200 w-full rounded-xl h-12 px-4 py-2 text-slate-800 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all duration-300 appearance-none"
                defaultValue=""
                onChange={onChange}>
          <option value="" disabled>{placeholder}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  )
}

const IndicadoresForm = () => {
  const [hotelSeleccionado, setHotelSeleccionado] = useState('')
  const [totalEnergia, setTotalEnergia] = useState('')
  const [energiaSec1, setEnergiaSec1] = useState('')
  const [energiaSec2, setEnergiaSec2] = useState('')
  const [energiaSec3, setEnergiaSec3] = useState('')

  const manejarCambioHotel = (e) => {
    setHotelSeleccionado(e.target.value)
    setTotalEnergia('')
    setEnergiaSec1('')
    setEnergiaSec2('')
    setEnergiaSec3('')
  }
  
  return (
    <div className="bg-slate-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-4xl w-full mx-auto space-y-6 md:space-y-8">
        
        <div className="w-full flex flex-col sm:flex-row justify-end gap-3 mb-2">
          <button className="bg-teal-600 text-white rounded-xl px-5 py-2.5 hover:bg-teal-700 transition-all shadow-sm font-medium focus:ring-4 focus:ring-teal-100" type="button">Descargar archivos</button>
          <div className="cursor-pointer px-5 py-2.5 bg-white text-teal-700 rounded-xl flex justify-center items-center gap-2 hover:bg-teal-50 transition-all font-medium border border-teal-100/50 shadow-sm">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Historial
          </div>
        </div> 

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
          <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Datos generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <SelectInputField 
              label="1. Grupo"
              placeholder="Seleccione a qué grupo va a capturar"
              options={['Seguridad', 'Mantenimiento', 'Recursos Humanos', 'Contraloría']}
            />
            <SelectInputField 
              label="2. Hotel (México)"
              placeholder="Seleccione el hotel"
              options={['El Dorado Royale (EDR)', 'El Dorado Seaside Suites (EDS)', 'El Dorado Maroma (EDM)', 'Generations Riviera Maya (GRM)', 'Corporativo (CORP)', 'Maison México Roma', 'Maroma Beach']}
              onChange={manejarCambioHotel}
            />
            <SelectInputField label="3. Año de Reporte" placeholder="Seleccione el año" options={['2023', '2024', '2025', '2026']} />
            <SelectInputField label="4. Mes de Reporte" placeholder="Seleccione el mes" options={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']} />
          </div>
        </div>

        {hotelSeleccionado === 'El Dorado Royale (EDR)' && (
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Consumo de Energía Eléctrica</h2>
              <TextInputField label="4. Consumo de energía eléctrica TOTAL del mes" subtitle="Dato final tomado del o los recibos de la compañía de luz" placeholder="0.00" onChange={setTotalEnergia} />
              <TextInputField label="5. Costo Total del consumo de energía eléctrica del mes" subtitle="En moneda local (Dato tomado del recibo de la compañía de luz)" placeholder="$0.00" />
              <TextInputField label="6. Primera sección del Hotel a Reportar consumo de energía"/>
              <TextInputField label="7. ¿Cuál es el consumo de energía eléctrica del mes para la primera sección?" placeholder="0.00" onChange={setEnergiaSec1} />
              <TextInputField label="8. Segunda sección del Hotel a reportar consumo de energía" />
              <TextInputField label="9. ¿Cuál es el consumo de energía eléctrica del mes para la segunda sección?" placeholder='0.00' onChange={setEnergiaSec2} />
              <TextInputField label="10. Tercera sección del Hotel a reportar consumo de energía" />
              <TextInputField label="11. ¿Cuál es el consumo de energía eléctrica del mes para la tercera sección?" placeholder='0.00' onChange={setEnergiaSec3} />

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
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm ${
                    match 
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

              <FileUploadField label="12. Adjunta por favor los recibos de electricidad del mes, por ambos lados"/>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Consumo de Combustibles</h2>
              <TextInputField label="13. Consumo total de gas LP del mes para todo el hotel" subtitle="Litros" placeholder="0.00" />
              <TextInputField label="14. ¿Cuál fue el costo total de Gas LP del mes?" subtitle="Moneda nacional" placeholder="$0.00" />
              <FileUploadField label="15. Adjunta las facturas de Gas Lp del período del mes."/>
              <FileUploadField label="16. Adjunta la bitácora de consumo de Gas Lp del mes."/>
              <TextInputField label="17. Consumo total de Diesel del mes" subtitle="Litros" placeholder="0.00" />
              <FileUploadField label="18. Adjunta las facturas de Diesel del mes" />
              <FileUploadField label="19. Adjunta la bitácora de consumo de Diesel del mes" />
              <TextInputField label="20. Consumo total de Gasolina del mes" subtitle="Litros" placeholder="0.00" />
              <FileUploadField label="21. Adjunta las facturas de Gasolina del mes" />
              <FileUploadField label="22. Adjunta la bitácora de consumo de Gasolina del mes" />
              <TextInputField label="23. ¿Cuál fue el consumo de leña del mes?" subtitle="Kilogramos" placeholder="0.00" />
              <FileUploadField label="24. Adjunta las facturas de Leña del mes" />
              <TextInputField label="25. ¿Cuál fue el consumo de carbón vegetal del mes?" subtitle="Kilogramos" placeholder="0.00" />
              <FileUploadField label="26. Adjunta las facturas de carbón vegetal del mes" />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Agua</h2>
              <TextInputField label="27. ¿Cuál es la fuente del agua potable?" />
              <TextInputField label="28. ¿Cuál es el volumen de agua potable QUE FUE CONSUMIDA en el hotel durante el mes?" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="29. Volumen de agua extraída durante el mes de los Pozos de Extracción" subtitle="Metros cúbicos"/>
              <TextInputField label="30. Volumen de agua de producción de ósmosis" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="31. Volumen de agua de rechazo de ósmosis" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="32. Volumen de agua tratada de la PTAR que va a pozo" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="33. Volumen de agua tratada de la PTAR que va a riego" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="34. Volumen de agua usada en la lavandería" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="35. Volumen de agua de retrolavados de alberca(s)" subtitle="Metros cúbicos" placeholder="0.00" />
              <FileUploadField label="36. Adjunta la bitácora de consumo de agua del mes así como el soporte de las lecturas de los medidores." />
              <TextInputField label="37. Durante el mes, ¿hubo alguna situación que impidiera la toma de lecturas de los medidores? Por favor detalla qué fue lo que pasó." placeholder="Escriba aquí" />
              <FileUploadField label="38. Adjuntar evidencia del reporte enviado a los Gestores externos del Grupo" subtitle="Correo, informe, etc." />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Reporte de energéticos</h2>
              <FileUploadField label="39. Adjunta el reporte de energéticos del mes, en versión final."/>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Residuos peligrosos y de manejo especial</h2>
              <FileUploadField label="40. Adjunte el manifiesto de recolección de Trampas de grasa (Cárcamos)" />
              <FileUploadField label="41. Adjunte el manifiesto de recolección de Trampas de grasa (Campanas)" />
              <FileUploadField label="42. Adjunte el manifiesto de recolección de Residuos Peligrosos" />
              <FileUploadField label="43. Adjunte el manifiesto de recolección de Escombros" />
              <TextInputField label="44. Volumen de sargazo registrado" subtitle="Metros cúbicos" placeholder="0.00" />
              <FileUploadField label="45. Adjunte el manifiesto de recolección de Sargazo" />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Sargazo</h2>
              <FileUploadField label="46. Adjunta el reporte de retiro de sargazo (bitácora)" subtitle="Cargar archivo."/>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Datos de llenado</h2>
              <TextInputField label="47. Nombre de quien llenó el cuestionario." placeholder="Escriba aquí" />
              <TextInputField label="48. Puesto de quien llenó el cuestionario." placeholder="Escriba aquí" />
              <TextInputField label="49. Correo electrónico" placeholder="Escriba aquí" />
            </div>
          </div>
        )}

        {hotelSeleccionado !== '' && hotelSeleccionado !== 'El Dorado Royale (EDR)' && (
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Consumo de Energía Eléctrica</h2>
              <TextInputField label="4. Consumo de energía eléctrica TOTAL del mes" subtitle="Dato final tomado del o los recibos de la compañía de luz" placeholder="0.00" />
              <TextInputField label="5. Costo Total del consumo de energía eléctrica del mes" subtitle="En moneda local (Dato tomado del recibo de la compañía de luz)." placeholder="$0.00" />
              <FileUploadField label="6. Adjunta por favor el o los recibos de electricidad del mes, por ambos lados"/>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Consumo de Combustibles</h2>
              <TextInputField label="7. Consumo total de gas LP del mes para todo el hotel" subtitle="Litros" placeholder="0.00" />
              <TextInputField label="8. ¿Cuál fue el costo total de Gas LP del mes?" subtitle="Moneda nacional" placeholder="$0.00" />
              <FileUploadField label="9. Adjunta las facturas de Gas Lp del período del mes."/>
              <FileUploadField label="10. Adjunta la bitácora de consumo de Gas Lp del mes."/>
              <TextInputField label="11. Consumo total de Diesel del mes" subtitle="Litros" placeholder="0.00" />
              <FileUploadField label="12. Adjunta las facturas de Diesel del mes" />
              <FileUploadField label="13. Adjunta la bitácora de consumo de Diesel del mes" />
              <TextInputField label="14. Consumo total de Gasolina del mes" subtitle="Litros" placeholder="0.00" />
              <FileUploadField label="15. Adjunta las facturas de Gasolina del mes" />
              <FileUploadField label="16. Adjunta la bitácora de consumo de Gasolina del mes" />
              <TextInputField label="17. ¿Cuál fue el consumo de leña del mes?" subtitle="Kilogramos" placeholder="0.00" />
              <FileUploadField label="18. Adjunta las facturas de Leña del mes" />
              <TextInputField label="19. ¿Cuál fue el consumo de carbón vegetal del mes?" subtitle="Kilogramos" placeholder="0.00" />
              <FileUploadField label="20. Adjunta las facturas de carbón vegetal del mes" />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Agua</h2>
              <TextInputField label="21. ¿Cuál es la fuente del agua potable?" />
              <TextInputField label="22. ¿Cuál es el volumen de agua potable QUE FUE CONSUMIDA en el hotel durante el mes?" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="23. Volumen de agua extraída durante el mes de los Pozos de Extracción" subtitle="Metros cúbicos"/>
              <TextInputField label="24. Volumen de agua de producción de ósmosis" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="25. Volumen de agua de rechazo de ósmosis" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="26. Volumen de agua tratada de la PTAR que va a pozo" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="27. Volumen de agua tratada de la PTAR que va a riego" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="28. Volumen de agua usada en la lavandería" subtitle="Metros cúbicos" placeholder="0.00" />
              <TextInputField label="29. Volumen de agua de retrolavados de alberca(s)" subtitle="Metros cúbicos" placeholder="0.00" />
              <FileUploadField label="30. Adjunta la bitácora de consumo de agua del mes así como el soporte de las lecturas de los medidores." />
              <TextInputField label="31. Durante el mes, ¿hubo alguna situación que impidiera la toma de lecturas de los medidores? Por favor detalla qué fue lo que pasó." placeholder="Escriba aquí" />
              <FileUploadField label="32. Adjuntar evidencia del reporte enviado a los Gestores externos del Grupo" subtitle="Correo, informe, etc." />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Reporte de energéticos</h2>
              <FileUploadField label="33. Adjunta el reporte de energéticos del mes, en versión final."/>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Residuos peligrosos y de manejo especial</h2>
              <FileUploadField label="34. Adjunte el manifiesto de recolección de Trampas de grasa (Cárcamos)" />
              <FileUploadField label="35. Adjunte el manifiesto de recolección de Trampas de grasa (Campanas)" />
              <FileUploadField label="36. Adjunte el manifiesto de recolección de Residuos Peligrosos" />
              <FileUploadField label="37. Adjunte el manifiesto de recolección de Escombros" />
              <TextInputField label="38. Volumen de sargazo registrado" subtitle="Metros cúbicos" placeholder="0.00" />
              <FileUploadField label="39. Adjunte el manifiesto de recolección de Sargazo" />
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Sargazo</h2>
              <FileUploadField label="40. Adjunta el reporte de retiro de sargazo (bitácora)" subtitle="Cargar archivo."/>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-6">
              <h2 className="text-teal-700 font-bold text-xl md:text-2xl border-b border-teal-100/50 pb-3">Datos de llenado</h2>
              <TextInputField label="41. Nombre de quien llenó el cuestionario." placeholder="Escriba aquí" />
              <TextInputField label="42. Puesto de quien llenó el cuestionario." placeholder="Escriba aquí" />
              <TextInputField label="43. Correo electrónico" placeholder="Escriba aquí" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IndicadoresForm

