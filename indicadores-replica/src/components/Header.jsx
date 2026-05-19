import React from 'react'

const Header = () => {
  return (
    <header className="h-20 flex justify-between items-center bg-gray-100 border-b border-gray-300 py-4 pl-6 pr-6 md:pr-12 relative gap-10">
      <div className="h-full flex items-center">
        <img src="/grupolomas.png" alt="Grupo Lomas" className="h-full w-auto object-contain" />
      </div>
      <div className="flex gap-10 items-center">
        <div className="flex items-center gap-3 cursor-pointer select-none relative">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-gray-600">
            VA
          </div>
          <div className="hidden md:block">
            <div className="text-gray-800 font-bold text-[16px]">Victor Ake</div>
            <div className="text-aqua-700 font-normal text-sm">Activo</div>
          </div>
          <span className="text-gray-600">▼</span>
        </div>
      </div>
    </header>
  )
}

export default Header
