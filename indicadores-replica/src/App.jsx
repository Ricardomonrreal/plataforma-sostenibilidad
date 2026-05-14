import React from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Filters from './components/Filters'
import IndicadoresForm from './components/IndicadoresForm'

function App() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="bg-gray-200 flex-grow pl-4 pr-4 md:pl-8 md:pr-10 pt-10 pb-24 overflow-y-auto">
          <div className="grid gap-4 max-w-6xl mx-auto">
            <Filters />
            <IndicadoresForm />
          </div>
        </div>
      </div>
      
      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          className="bg-aqua-700 text-white rounded-lg px-8 py-3 font-bold text-lg shadow-lg hover:bg-aqua-900 hover:scale-105 transition-all transform" 
          type="button"
        >
          Guardar cambios 
        </button>
      </div>
    </div>
  )
}

export default App
