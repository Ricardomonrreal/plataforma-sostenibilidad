import React from 'react'

const Filters = () => {
  return (
    <div className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8 px-6 rounded shadow-sm border border-gray-100">
      <div className="relative flex flex-col w-full gap-1">
        <label className="text-base flex flex-row items-center text-gray-700 font-bold">Grupo</label>
        <div className="border border-gray-300 w-full rounded h-10 px-4 py-2 text-black hover:border-aqua-500 focus-within:border-aqua-500 focus-within:ring-1 focus-within:ring-aqua-500 bg-white flex items-center justify-between transition-colors">
          <input type="text" placeholder="Seleccionar..." className="w-full outline-none bg-transparent" defaultValue="Mantenimiento" />
          <span className="ml-2 text-gray-500">▼</span>
        </div>
      </div>
      <div className="relative flex flex-col w-full gap-1">
        <label className="text-base flex flex-row items-center text-gray-700 font-bold">Propiedad</label>
        <div className="border border-gray-300 w-full rounded h-10 px-4 py-2 text-black hover:border-aqua-500 focus-within:border-aqua-500 bg-white flex items-center justify-between transition-colors">
          <input type="text" placeholder="Seleccionar..." className="w-full outline-none bg-transparent" defaultValue="El Dorado Royale" />
          <span className="ml-2 text-gray-500">▼</span>
        </div>
      </div>
      <div className="relative flex flex-col w-full gap-1">
        <label className="text-base flex flex-row items-center text-gray-700 font-bold">Periodo</label>
        <div className="border border-gray-300 w-full rounded h-10 px-4 py-2 text-black hover:border-aqua-500 focus-within:border-aqua-500 bg-white flex items-center justify-between transition-colors">
          <input type="text" placeholder="Seleccionar..." className="w-full outline-none bg-transparent" defaultValue="2023" />
          <span className="ml-2 text-gray-500">▼</span>
        </div>
      </div>
      <div className="relative flex flex-col w-full gap-1">
        <label className="text-base flex flex-row items-center text-gray-700 font-bold">Mes</label>
        <div className="border border-gray-300 w-full rounded h-10 px-4 py-2 text-black hover:border-aqua-500 focus-within:border-aqua-500 bg-white flex items-center justify-between transition-colors">
          <input type="text" placeholder="Seleccionar..." className="w-full outline-none bg-transparent" defaultValue="Enero" />
          <span className="ml-2 text-gray-500">▼</span>
        </div>
      </div>
    </div>
  )
}

export default Filters
