import React, { useRef } from 'react'

const FileUploadField = ({ id, label }) => {
  const fileInputRef = useRef(null)

  return (
    <div className="flex flex-col w-full gap-2">
      <label className="text-base text-gray-700 font-bold">{label}</label>
      <div 
        className="border-2 border-gray-300 border-dashed rounded-lg w-full min-h-32 flex items-center justify-center cursor-pointer hover:border-aqua-500 hover:bg-aqua-100 transition-colors p-4" 
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-full flex flex-col items-center justify-center text-gray-500 gap-2">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="40px" width="40px" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <div className="text-center">
            <div className="text-saitgo-link text-sm font-medium">Subir archivo o foto</div>
            <span className="text-gray-400 text-xs">no mayor a 10 MB</span>
          </div>
        </div>
      </div>
      <input type="file" id={id} ref={fileInputRef} className="hidden" multiple />
    </div>
  )
}

const TextInputField = ({ label, defaultValue, placeholder = "" }) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <label className="text-base text-gray-700 font-bold flex items-center gap-2">
        {label}
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-aqua-700 cursor-pointer" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.043 8 8 119.083 8 256s111.043 248 248 248 248-111.083 248-248S392.997 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
      </label>
      <input type="text" className="border border-gray-300 w-full rounded h-11 px-4 py-2 text-black hover:border-aqua-500 focus:outline-none focus:border-aqua-500 focus:ring-1 focus:ring-aqua-500 transition-colors" placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  )
}

const SelectInputField = ({ label, options, placeholder = "Seleccionar..." }) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <label className="text-base text-gray-700 font-bold flex items-center gap-2">
        {label}
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-aqua-700 cursor-pointer" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.043 8 8 119.083 8 256s111.043 248 248 248 248-111.083 248-248S392.997 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
      </label>
      <select className="border border-gray-300 w-full rounded h-11 px-4 py-2 text-black hover:border-aqua-500 focus:outline-none focus:border-aqua-500 focus:ring-1 focus:ring-aqua-500 transition-colors bg-white" defaultValue="">
        <option value="" disabled>{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

const IndicadoresForm = () => {
  return (
    <div className="bg-white py-10 px-6 grid gap-2 rounded shadow-sm border border-gray-100">
      <div className="max-w-3xl w-full mx-auto">
        <div className="grid gap-8">
          
          <div className="w-full flex flex-col md:flex-row justify-end gap-3 mb-4">
            <button className="bg-aqua-700 text-white rounded px-4 py-2 hover:bg-aqua-900 transition-colors shadow-sm font-medium" type="button">Descargar archivos</button>
            <div className="cursor-pointer px-4 py-2 bg-aqua-100 text-aqua-700 rounded flex justify-center items-center gap-2 hover:bg-aqua-300 transition-colors font-medium">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" className="text-lg" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Historial
            </div>
          </div> 

          <div className="space-y-6">
            <h2 className="text-aqua-700 font-bold text-2xl border-b pb-2">Datos generales del hotel</h2>
              <SelectInputField label="1. Año de Reporte" placeholder="Seleccione el año" options={['2023', '2024', '2025', '2026']} />
              <SelectInputField label="2. Mes de Reporte" placeholder="Seleccione el mes" options={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']} />
              <SelectInputField label="3. Hotel (México)" placeholder="Seleccione el hotel" options={['El Dorado Royale (EDR)', 'El Dorado Seaside Suites (EDS)', 'El Dorado Maroma (EDM)', 'Generations Riviera Maya (GRM)', 'Corporativo (CORP)', 'Maison México Roma', 'Maroma Beach']} />
          </div>

          <div className="space-y-6 mt-4">
            <h2 className="text-aqua-700 font-bold text-2xl border-b pb-2">Consumo de Energia Eléctrica</h2>
              <TextInputField label="4. Consumo de energía eléctrica TOTAL del mes (kWh)" placeholder="0.00" />
              <TextInputField label="5. Costo Total en moneda local del consumo de energía eléctrica del mes" placeholder="$0.00" />
              <FileUploadField id="file-carbon" label="6.- Adjunta por favor el o los recibos de electricidad del mes, por ambos lados." />
          </div>

          <div className="space-y-6 mt-4">
            <h2 className="text-aqua-700 font-bold text-2xl border-b pb-2">Consumo de Combustibles</h2>
              <TextInputField label="6. Consumo total de gas LP del mes para todo el hotel (Litros)" placeholder="0.00" />
              
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndicadoresForm
