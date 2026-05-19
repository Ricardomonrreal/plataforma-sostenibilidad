import React from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import IndicadoresForm from './components/IndicadoresForm'

function App() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="bg-gray-200 flex-grow pl-4 pr-4 md:pl-8 md:pr-10 pt-10 pb-24 overflow-y-auto">
          <div className="grid gap-4 max-w-6xl mx-auto">
            <IndicadoresForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
