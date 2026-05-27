import React from 'react'
import { FaCog, FaUser, FaBook, FaCheckSquare, FaChartBar } from './Icons'

const Sidebar = ({ vistaActual, onCambiarVista }) => {
  return (
    <div className="bg-sidebar w-full md:min-h-screen md:w-64 p-4 flex flex-col gap-6 relative transition-width duration-300 md:overflow-y-auto">
      <div className="flex justify-between md:justify-center md:flex-row gap-4 items-center">
        <button className="bg-aqua-100 w-7 h-7 rounded border-2 border-aqua-300 focus:outline-none hidden md:flex items-center justify-center text-aqua-700">
          ☰
        </button>
        <button className="bg-aqua-100 w-7 h-7 rounded border-2 border-aqua-300 focus:outline-none flex md:hidden items-center justify-center z-20 relative text-aqua-700">
          ☰
        </button>
        <a href="#">
          <div className="w-14 h-14 bg-gray-500 rounded flex items-center justify-center text-white text-xs">Logo</div>
        </a>
      </div>
      
      <div className="text-white flex-col gap-2.5 hidden md:flex md:relative md:top-auto md:z-auto pb-5">
        <div className="h-8 rounded-[1px] cursor-pointer text-gray-400 flex items-center mt-2 mb-2 px-2 bg-white">Buscar</div>
        
        {/* Menu Item 1 */}
        <div>
          <div className="flex items-center py-1 px-2 gap-3 cursor-pointer select-none hover:bg-white hover:bg-opacity-5">
            <div className="min-w-5"><FaCog /></div>
            <div className="w-full flex justify-between items-center">
              <span className="text-sm font-bold">Administración</span>
              <span>▼</span>
            </div>
          </div>
        </div>

        {/* Menu Item 2 */}
        <div>
          <div className="flex items-center py-1 px-2 gap-3 cursor-pointer select-none hover:bg-white hover:bg-opacity-5">
            <div className="min-w-5"><FaUser /></div>
            <div className="w-full flex justify-between items-center">
              <span className="text-sm font-bold">Perfil</span>
            </div>
          </div>
        </div>

        {/* Menu Item 3 */}
        <div>
          <div className="flex items-center py-1 px-2 gap-3 cursor-pointer select-none hover:bg-white hover:bg-opacity-5">
            <div className="min-w-5"><FaBook /></div>
            <div className="w-full flex justify-between items-center">
              <span className="text-sm font-bold">Catalogos</span>
            </div>
          </div>
        </div>

        {/* Menu Item 4: Indicadores (expandido) */}
        <div>
          <div className="flex items-center py-1 px-2 gap-3 cursor-pointer select-none hover:bg-white hover:bg-opacity-5">
            <div className="min-w-5"><FaCheckSquare /></div>
            <div className="w-full flex justify-between items-center">
              <span className="text-sm font-bold">Indicadores</span>
              <span className="text-yellow-300">▼</span>
            </div>
          </div>
          <div className="pl-6">
            {/* Sub-item: Formulario */}
            <div
              onClick={() => onCambiarVista?.('formularios')}
              className={`flex items-center py-1 px-2 gap-3 border-l border-white cursor-pointer select-none transition-all duration-200 ${
                vistaActual === 'formularios' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'
              }`}
            >
              <div className="w-full flex justify-between items-center">
                <span className="text-sm">Formulario Indicadores</span>
              </div>
            </div>
            {/* Sub-item: Dashboard */}
            <div
              onClick={() => onCambiarVista?.('dashboard')}
              className={`flex items-center py-1 px-2 gap-3 border-l border-white cursor-pointer select-none transition-all duration-200 ${
                vistaActual === 'dashboard' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-5'
              }`}
            >
              <div className="min-w-4"><FaChartBar className="text-xs" /></div>
              <div className="w-full flex justify-between items-center">
                <span className="text-sm">Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
