import React, { useRef, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'


export const FileUploadField = ({ id, label, subtitle, name, hasError, onChange, value }) => {
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

  const getFileType = (fileName) => {
    if (!fileName) return 'application/octet-stream';
    const ext = fileName.toLowerCase().split('.').pop();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image/jpeg';
    if (ext === 'pdf') return 'application/pdf';
    return 'application/octet-stream';
  };

  useEffect(() => {
    if (value && Array.isArray(value) && value.length > 0) {
      const currentNames = files.map(f => f.file?.name);
      const incomingNames = value.map(f => typeof f === 'string' ? f : f.name);
      
      const isSame = currentNames.length === incomingNames.length && 
                     currentNames.every((name, index) => name === incomingNames[index]);
                     
      if (!isSame) {
        const mockFiles = value.map(item => {
          if (item && typeof item === 'object' && item.name) {
            return {
              id: Math.random().toString(36).substring(7),
              file: item,
              preview: item instanceof File ? URL.createObjectURL(item) : null
            };
          }
          const fileName = String(item);
          let previewUrl = null;
          if (fileName.includes('/')) {
            const { data } = supabase.storage.from('soportes').getPublicUrl(fileName);
            previewUrl = data?.publicUrl || null;
          }
          return {
            id: Math.random().toString(36).substring(7),
            file: { name: fileName, type: getFileType(fileName) },
            preview: previewUrl
          };
        });
        setFiles(mockFiles);
      }
    } else {
      if (files.length > 0) {
        setFiles([]);
      }
    }
  }, [value, files]);

  useEffect(() => {
    if (onChange) {
      onChange(files.map(f => f.file));
    }
  }, [files]);

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
      if (fileToRem && fileToRem.preview) URL.revokeObjectURL(fileToRem.preview)
      return prev.filter(f => f.id !== idToRemove)
    })
  }

  return (
    <div className="flex flex-col w-full gap-1 mb-2">
      <label className="text-sm md:text-base text-slate-700 font-semibold">{label}</label>
      {subtitle && <span className="text-xs text-teal-700 font-bold mb-2">{subtitle}</span>}
      <div
        className={`border-dashed rounded-2xl w-full min-h-[120px] flex items-center justify-center cursor-pointer transition-all duration-300 p-4 ${isDragging
            ? 'border-2 border-teal-500 bg-teal-50/80 scale-[1.02]'
            : hasError
            ? 'border-2 border-red-500 bg-red-50/50 hover:bg-red-50 scale-[1.01]'
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
                {f.file.type.startsWith('image/') && f.preview ? (
                  <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                ) : f.file.type === 'application/pdf' ? (
                  <div className="flex flex-col items-center justify-center text-rose-500 gap-1 select-none">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                    </svg>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-rose-50 px-1 py-0.5 rounded text-rose-600 border border-rose-100">PDF</span>
                  </div>
                ) : f.file.name.toLowerCase().endsWith('.xlsx') || f.file.name.toLowerCase().endsWith('.xls') ? (
                  <div className="flex flex-col items-center justify-center text-emerald-500 gap-1 select-none">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                    </svg>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-emerald-50 px-1 py-0.5 rounded text-emerald-600 border border-emerald-100">EXCEL</span>
                  </div>
                ) : f.file.type.startsWith('image/') ? (
                  <div className="flex flex-col items-center justify-center text-teal-500 gap-1 select-none">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z"></path>
                    </svg>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-teal-50 px-1 py-0.5 rounded text-teal-600 border border-teal-100">IMG</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-1 select-none">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                    </svg>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-slate-100 px-1 py-0.5 rounded text-slate-600 border border-slate-200">DOC</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 w-full truncate text-center font-medium px-1" title={f.file.name.split('/').pop()}>
                {f.file.name.split('/').pop()}
              </span>
            </div>
          ))}
        </div>
      )}

      <input type="file" id={id || name} ref={fileInputRef} className="hidden" name={name} multiple onChange={handleFileChange} />

      {previewFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-10" onClick={() => setPreviewFile(null)}>
          <div className="relative w-full max-w-5xl h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800 truncate pr-4">{previewFile.file.name.split('/').pop()}</h3>
              <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-slate-200" title="Cerrar">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100/50 flex items-center justify-center p-4 relative">
              {(() => {
                const isNewUpload = previewFile.preview && previewFile.preview.startsWith('blob:');
                const isSimulado = !isNewUpload && [
                  'bitacora_impresa.pdf', 'bitacora_excel.xlsx', 'fauna.pdf', 'esterilizacion.pdf', 
                  'reciclables.pdf', 'control.xlsx', 'aceite.pdf', 'salidas.pdf', 'electronicos.pdf', 
                  'evidencia_campana.pdf', 'reporte_rrhh.pdf', 'recibo_cfe.pdf', 'factura_gas.pdf', 
                  'bitacora_gas.xlsx', 'factura_diesel.pdf', 'bitacora_diesel.xlsx', 'factura_gasolina.pdf', 
                  'bitacora_gasolina.xlsx', 'factura_lena.pdf', 'factura_carbon.pdf', 'bitacora_agua.xlsx', 
                  'gestores.pdf', 'reporte_mensual.pdf', 'carcamos.pdf', 'campanas.pdf', 'peligrosos.pdf', 
                  'escombros.pdf', 'manifiesto_sargazo.pdf', 'bitacora_sargazo.xlsx'
                ].includes(previewFile.file.name.toLowerCase());

                if (isSimulado) {
                  return (
                    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                        </svg>
                      </div>
                      <h4 className="font-bold text-slate-800 text-base">Archivo de Simulación Histórica</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Este documento es un marcador de posición demostrativo generado por la **simulación histórica (2023 - 2026)** y no corresponde a un archivo físico real en Supabase Storage.
                      </p>
                      <div className="text-[11px] bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-slate-500 font-medium leading-normal">
                        💡 <strong>Tip</strong>: Puedes eliminar este marcador de posición y subir tu propio PDF o foto real en el formulario. Al guardar, se subirá físicamente y podrás previsualizarlo aquí de manera 100% interactiva.
                      </div>
                    </div>
                  );
                }

                if (previewFile.preview) {
                  if (previewFile.file.type.startsWith('image/')) {
                    return <img src={previewFile.preview} alt={previewFile.file.name} className="max-w-full max-h-full object-contain drop-shadow-md" />;
                  } else if (previewFile.file.type === 'application/pdf') {
                    return <object data={`${previewFile.preview}#toolbar=1&navpanes=0`} type="application/pdf" className="w-full h-full rounded shadow-sm"></object>;
                  } else {
                    return (
                      <div className="flex flex-col items-center text-slate-400">
                        <svg className="w-20 h-20 mb-4 text-teal-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                        <p>Previsualización no disponible para este tipo de archivo</p>
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="flex flex-col items-center text-slate-500">
                      <svg className="w-20 h-20 mb-4 text-teal-600/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      <p className="font-semibold text-slate-700">Archivo Guardado en Supabase</p>
                      <p className="text-xs text-slate-400 mt-1">Este archivo fue guardado en una sesión previa y no está cargado localmente.</p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const TextInputField = ({ label, subtitle, value: propValue, defaultValue, placeholder = "", isNumeric = false, isTextArea = false, onChange, name, hasError }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(propValue !== undefined ? propValue : (defaultValue || ''));
  }, [propValue, defaultValue]);

  const isCurrency = placeholder.includes('$');

  const numericMode = isNumeric ||
    placeholder.includes('0.00') ||
    isCurrency ||
    (subtitle && (
      subtitle.toLowerCase().includes('litros') ||
      subtitle.toLowerCase().includes('nacional') ||
      subtitle.toLowerCase().includes('kilogramos') ||
      subtitle.toLowerCase().includes('metros cúbicos') ||
      subtitle.toLowerCase().includes('personas') ||
      subtitle.toLowerCase().includes('número')
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
      {isTextArea ? (
        <textarea
          name={name}
          className={`border w-full rounded-xl h-28 px-4 py-3 text-slate-800 transition-all duration-300 focus:outline-none resize-none ${(error || hasError)
              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100'
            }`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ) : (
        <input
          type="text"
          name={name}
          className={`border w-full rounded-xl h-12 px-4 py-2 text-slate-800 transition-all duration-300 focus:outline-none ${(error || hasError)
              ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100'
            }`}
          placeholder={placeholder}
          value={isFocused ? value : displayValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
      {error && <span className="text-xs text-red-500 font-semibold mt-1">Por favor ingrese un valor numérico válido.</span>}
    </div>
  )
}

export const SelectInputField = ({ label, subtitle, options, value, placeholder = "Seleccionar...", onChange, name, hasError }) => {
  return (
    <div className="flex flex-col w-full gap-1 mb-2">
      <div className="flex flex-col">
        <label className="text-sm md:text-base text-slate-700 font-semibold flex items-center gap-2">
          {label}
        </label>
        {subtitle && <span className="text-xs text-teal-700 font-bold mb-1">{subtitle}</span>}
      </div>
      <div className="relative">
        <select 
          name={name}
          className={`border w-full rounded-xl h-12 px-4 py-2 text-slate-800 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${hasError
            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-200 focus:border-teal-400 focus:ring-teal-100'
          }`}
          onChange={onChange}
          {...(value !== undefined ? { value } : { defaultValue: "" })}>
          <option value="" disabled>{placeholder}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
        </div>
      </div>
    </div>
  )
}

export const CellInput = ({ value, placeholder, onChange }) => {
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const rawVal = e.target.value;
    const cleanedVal = rawVal.replace(/[$ ]/g, '').replace(',', '.');
    if (cleanedVal !== "" && isNaN(Number(cleanedVal))) {
      setError(true);
    } else {
      setError(false);
    }
    onChange(rawVal);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        className={`w-full bg-white rounded-xl h-11 px-3 text-slate-800 text-sm border focus:outline-none transition-all duration-300 ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
            : 'border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 bg-white hover:bg-slate-50/50'
          }`}
        placeholder={placeholder || "0.00"}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export const TableCaptureCard = ({ title, subtitle, columns, values, onChange, children }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/40 space-y-4">
      <div>
        <h3 className="text-teal-700 font-bold form-section-title">{title}</h3>
        {subtitle && <p className="text-xs text-teal-700 font-semibold mt-1">{subtitle}</p>}
      </div>
      {children}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl scrollbar-thin">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm text-slate-600">
          <thead className="bg-teal-50/30 text-teal-800 uppercase font-semibold text-[11px] border-b border-teal-100/50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{col.label}</span>
                    {col.unit && <span className="text-xs text-teal-600/80 font-semibold normal-case mt-0.5">{col.unit}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="divide-x divide-slate-100">
              {columns.map((col, idx) => (
                <td key={idx} className="px-3 py-4 bg-slate-50/20 min-w-[140px]">
                  <CellInput
                    value={values[col.key] || ''}
                    placeholder={col.placeholder}
                    onChange={(val) => onChange(col.key, val)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const FormSectionDivider = ({ icon, title, description }) => {
  return (
    <div className="pt-8 pb-2 flex flex-col gap-1 border-t border-slate-200/50 first:border-0 first:pt-0 mt-8 first:mt-0">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 text-teal-600 bg-teal-50/80 p-2.5 rounded-2xl border border-teal-100/30 shadow-sm flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-teal-600/80 uppercase tracking-widest">Sección</span>
          <h4 className="text-slate-800 font-bold text-base md:text-lg -mt-0.5">{title}</h4>
        </div>
      </div>
      {description && (
        <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed max-w-2xl pl-1">
          {description}
        </p>
      )}
    </div>
  );
};
