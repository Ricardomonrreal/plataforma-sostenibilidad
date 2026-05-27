import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from '../supabaseClient'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  FaBolt,
  FaDollarSign,
  FaFire,
  FaGasPump,
  FaTree,
  FaBurn,
  FaMoneyBillWave,
  FaTint,
  FaWater,
  FaFlask,
  FaFaucet,
  FaRecycle,
  FaSeedling,
  FaTshirt,
  FaSyncAlt,
  FaLeaf,
  FaTrash,
  FaPaw,
  FaHospital,
  FaExclamationTriangle,
  FaBus,
  FaRoad,
  FaUsers,
  FaHandshake,
  FaHome,
  FaHandsHelping,
  FaUniversity,
  FaBook,
  FaHeart,
  FaGift,
  FaBed,
  FaDoorOpen,
  FaChartBar,
  FaTicketAlt,
  FaOilCan,
  FaMobileAlt,
  FaInbox
} from './Icons'

/* ───────────────────────── constantes ───────────────────────── */

const GRUPOS = ['Mantenimiento', 'Seguridad', 'Recursos Humanos', 'Contraloría']
const HOTELES = [
  'El Dorado Royale (EDR)', 'El Dorado Seaside Suites (EDS)',
  'El Dorado Maroma (EDM)', 'Generations Riviera Maya (GRM)',
  'Corporativo (CORP)', 'Maison México Roma', 'Maroma Beach'
]
const ANOS = ['2023', '2024', '2025', '2026']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MES_INDEX = Object.fromEntries(MESES.map((m, i) => [m, i]))

const PALETTE = [
  '#03105e', // Navy blue
  '#00a09d', // Teal
  '#ffae00', // Yellow
  '#cd003b', // Crimson red
  '#76777a'  // Grey
]

/* ─── helpers para extraer métricas del JSONB ─── */

const num = (v) => {
  if (v === null || v === undefined || v === '') return 0
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? 0 : n
}

const METRIC_DEFS = {
  Mantenimiento: [
    { key: 'totalEnergia', label: 'Energía Total', unit: 'kWh', path: d => d?.totalEnergia, color: '#ffae00', icon: <FaBolt /> },
    { key: 'costoElectricidad', label: 'Costo Electricidad', unit: '$', path: d => d?.costoElectricidad, color: '#cd003b', icon: <FaDollarSign /> },
    { key: 'gasLP', label: 'Gas LP', unit: 'L', path: d => d?.combustibles?.gasLP, color: '#00a09d', icon: <FaFire /> },
    { key: 'diesel', label: 'Diesel', unit: 'L', path: d => d?.combustibles?.diesel, color: '#03105e', icon: <FaGasPump /> },
    { key: 'gasolina', label: 'Gasolina', unit: 'L', path: d => d?.combustibles?.gasolina, color: '#76777a', icon: <FaGasPump /> },
    { key: 'lena', label: 'Leña', unit: 'kg', path: d => d?.combustibles?.lena, color: '#ffae00', icon: <FaTree /> },
    { key: 'carbon', label: 'Carbón Vegetal', unit: 'kg', path: d => d?.combustibles?.carbon, color: '#76777a', icon: <FaBurn /> },
    { key: 'costoGasLP', label: 'Costo Gas LP', unit: '$', path: d => d?.costoGasLP, color: '#cd003b', icon: <FaMoneyBillWave /> },
    { key: 'aguaPotable', label: 'Agua Consumida', unit: 'm³', path: d => d?.agua?.potable, color: '#00a09d', icon: <FaTint /> },
    { key: 'aguaPozos', label: 'Pozos Extracción', unit: 'm³', path: d => d?.agua?.pozos, color: '#03105e', icon: <FaWater /> },
    { key: 'osmosisProd', label: 'Prod. Ósmosis', unit: 'm³', path: d => d?.agua?.osmosisProd, color: '#ffae00', icon: <FaFlask /> },
    { key: 'osmosisRechazo', label: 'Rechazo Ósmosis', unit: 'm³', path: d => d?.agua?.osmosisRechazo, color: '#76777a', icon: <FaFaucet /> },
    { key: 'ptarPozo', label: 'PTAR a Pozo', unit: 'm³', path: d => d?.agua?.ptarPozo, color: '#cd003b', icon: <FaRecycle /> },
    { key: 'ptarRiego', label: 'PTAR a Riego', unit: 'm³', path: d => d?.agua?.ptarRiego, color: '#00a09d', icon: <FaSeedling /> },
    { key: 'lavanderia', label: 'Lavandería', unit: 'm³', path: d => d?.agua?.lavanderia, color: '#03105e', icon: <FaTshirt /> },
    { key: 'retrolavados', label: 'Retrolavados', unit: 'm³', path: d => d?.agua?.retrolavados, color: '#76777a', icon: <FaSyncAlt /> },
    { key: 'volumenSargazo', label: 'Volumen Sargazo', unit: '', path: d => d?.volumenSargazo, color: '#00a09d', icon: <FaLeaf /> },
  ],
  Seguridad: [
    { key: 'residuosOrganicos', label: 'Residuos Orgánicos', unit: '', path: d => d?.residuos?.organicos, color: '#00a09d', icon: <FaRecycle /> },
    { key: 'residuosInorganicos', label: 'Residuos Inorgánicos', unit: '', path: d => d?.residuos?.inorganicos, color: '#76777a', icon: <FaTrash /> },
    { key: 'residuosGranja', label: 'Residuos Org. Granja', unit: '', path: d => d?.residuos?.organicosgranja, color: '#ffae00', icon: <FaPaw /> },
    { key: 'accidentesHuespedes', label: 'Accidentes Huéspedes', unit: '', path: d => d?.accidentes?.huespedes, color: '#cd003b', icon: <FaHospital /> },
    { key: 'accidentesColaboradores', label: 'Accidentes Colaboradores', unit: '', path: d => d?.accidentes?.colaboradores, color: '#03105e', icon: <FaExclamationTriangle /> },
    { key: 'transporteR1', label: 'Transporte R1', unit: '', path: d => d?.transporte?.r1, color: '#00a09d', icon: <FaBus /> },
    { key: 'transporteR2', label: 'Transporte R2', unit: '', path: d => d?.transporte?.r2, color: '#03105e', icon: <FaBus /> },
    { key: 'transporteR3', label: 'Transporte R3', unit: '', path: d => d?.transporte?.r3, color: '#ffae00', icon: <FaBus /> },
    { key: 'transporteR4', label: 'Transporte R4', unit: '', path: d => d?.transporte?.r4, color: '#76777a', icon: <FaBus /> },
    { key: 'rutasTransporteCantidad', label: 'Rutas Transporte Cantidad', unit: '', path: d => d?.rutasTransporteCantidad, color: '#cd003b', icon: <FaRoad /> },
  ],
  'Recursos Humanos': [
    { key: 'colaboradoresClubVacacional', label: 'Colaboradores Club Vacacional', unit: '', path: d => d?.colaboradoresClubVacacional, color: '#03105e', icon: <FaUsers /> },
    { key: 'colaboradoresExternos', label: 'Colaboradores Externos', unit: '', path: d => d?.colaboradoresExternos, color: '#00a09d', icon: <FaHandshake /> },
    { key: 'residentesPobladoApoyo', label: 'Residentes Poblado Apoyo', unit: '', path: d => d?.residentesPobladoApoyo, color: '#76777a', icon: <FaHome /> },
    { key: 'actividadVoluntariadoHoras', label: 'Voluntariado (Horas)', unit: 'hrs', path: d => d?.actividadVoluntariadoHoras, color: '#ffae00', icon: <FaHandsHelping /> },
    { key: 'montoFundacionLomas', label: 'Monto Fundación Lomas', unit: '$', path: d => d?.montoFundacionLomas, color: '#cd003b', icon: <FaUniversity /> },
    { key: 'colaboradoresEducacionAdultos', label: 'Educación Adultos', unit: '', path: d => d?.colaboradoresEducacionAdultos, color: '#00a09d', icon: <FaBook /> },
    { key: 'montoEfectivoDonaciones', label: 'Monto Donaciones', unit: '$', path: d => d?.montoEfectivoDonaciones, color: '#cd003b', icon: <FaHeart /> },
    { key: 'donativosEspecieValor', label: 'Donativos Especie', unit: '$', path: d => d?.donativosEspecieValor, color: '#03105e', icon: <FaGift /> },
  ],
  'Contraloría': [
    { key: 'huespednoche', label: 'Huésped-Noche', unit: '', path: d => d?.ocupacion?.huespednoche, color: '#03105e', icon: <FaBed /> },
    { key: 'cuartonoche', label: 'Cuarto-Noche', unit: '', path: d => d?.ocupacion?.cuartonoche, color: '#00a09d', icon: <FaDoorOpen /> },
    { key: 'porcentajeOcupacion', label: '% Ocupación', unit: '%', path: d => d?.ocupacion?.porcentaje, color: '#ffae00', icon: <FaChartBar /> },
    { key: 'recoleccionesReciclables', label: 'Recolecciones Reciclables', unit: '', path: d => d?.recoleccionesReciclablesCantidad, color: '#76777a', icon: <FaRecycle /> },
    { key: 'dayPassVendidos', label: 'Day Pass Vendidos', unit: '', path: d => d?.dayPassVendidosCantidad, color: '#cd003b', icon: <FaTicketAlt /> },
    { key: 'litrosAceite', label: 'Litros Aceite Salida', unit: 'L', path: d => d?.litrosAceiteSalidaAlmacen, color: '#00a09d', icon: <FaOilCan /> },
    { key: 'reciclablesElectronicosPeso', label: 'Electrónicos Reciclados', unit: 'kg', path: d => d?.reciclablesElectronicosPeso, color: '#03105e', icon: <FaMobileAlt /> },
  ],
}

/* Sub-secciones para Mantenimiento */
const MANTENIMIENTO_SECTIONS = [
  { title: 'Energía Eléctrica', keys: ['totalEnergia', 'costoElectricidad'] },
  { title: 'Combustibles', keys: ['gasLP', 'diesel', 'gasolina', 'lena', 'carbon', 'costoGasLP'] },
  { title: 'Agua', keys: ['aguaPotable', 'aguaPozos', 'osmosisProd', 'osmosisRechazo', 'ptarPozo', 'ptarRiego', 'lavanderia', 'retrolavados'] },
  { title: 'Otros', keys: ['volumenSargazo'] },
]

const SEGURIDAD_SECTIONS = [
  { title: 'Residuos', keys: ['residuosOrganicos', 'residuosInorganicos', 'residuosGranja'] },
  { title: 'Accidentes', keys: ['accidentesHuespedes', 'accidentesColaboradores'] },
  { title: 'Transporte', keys: ['transporteR1', 'transporteR2', 'transporteR3', 'transporteR4', 'rutasTransporteCantidad'] },
]

const GROUP_SECTIONS = {
  Mantenimiento: MANTENIMIENTO_SECTIONS,
  Seguridad: SEGURIDAD_SECTIONS,
  'Recursos Humanos': [{ title: 'Indicadores Talento Humano', keys: METRIC_DEFS['Recursos Humanos'].map(m => m.key) }],
  'Contraloría': [{ title: 'Indicadores Contraloría', keys: METRIC_DEFS['Contraloría'].map(m => m.key) }],
}

/* ───────────────────────── Componentes Premium ───────────────────────── */

const FilterDropdown = ({ label, options, value, onChange, allLabel = 'Todos' }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 text-sm
                 focus:ring-2 focus:ring-[#00a09d]/20 focus:border-[#00a09d] outline-none transition-all
                 cursor-pointer shadow-sm hover:border-[#00a09d]/50 font-medium"
    >
      <option value="">{allLabel}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

const getBgColor = (hex) => {
  if (hex === '#ffae00') return 'rgba(255, 174, 0, 0.08)'
  if (hex === '#76777a') return 'rgba(118, 119, 122, 0.08)'
  if (hex === '#00a09d') return 'rgba(0, 160, 157, 0.08)'
  if (hex === '#03105e') return 'rgba(3, 16, 94, 0.08)'
  if (hex === '#cd003b') return 'rgba(205, 0, 59, 0.08)'
  return 'rgba(0, 160, 157, 0.08)'
}

const KpiCard = ({ icon, label, value, unit, color, animDelay = 0 }) => (
  <div
    className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-5 flex items-center justify-between gap-4
               hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
    style={{ animationDelay: `${animDelay}ms` }}
  >
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight group-hover:text-slate-500 transition-colors truncate block" title={label}>{label}</span>
      <div className="flex items-baseline gap-1 mt-1 truncate">
        <span className="text-2xl font-black tracking-tight" style={{ color }}>{value.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
        {unit && <span className="text-xs font-bold text-slate-400 ml-1">{unit}</span>}
      </div>
    </div>
    <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl shadow-sm transition-transform duration-300 group-hover:scale-105" style={{ color: color, backgroundColor: getBgColor(color) }}>
      {icon}
    </div>
  </div>
)

const SectionTitle = ({ icon, children }) => (
  <div className="flex items-center gap-3 mt-10 mb-5">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#03105e] to-[#00a09d] flex items-center justify-center text-white text-sm shadow-md shadow-[#00a09d]/20 flex-shrink-0">
      {icon}
    </div>
    <h3 className="text-lg font-extrabold text-slate-700 tracking-tight">{children}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-[#00a09d]/20 to-transparent" />
  </div>
)

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 hover:shadow-md transition-all duration-300">
    <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-3 mb-5 leading-none">{title}</h4>
    {children}
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 p-4 text-xs font-medium">
      <p className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1.5">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <span className="text-slate-500 font-semibold">{p.name}:</span>
            </div>
            <span className="font-bold text-slate-800">{Number(p.value).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── Dashboard principal ───────────────────────── */

const Dashboard = () => {
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)

  // filtros
  const [fHotel, setFHotel] = useState('')
  const [fAno, setFAno] = useState('')
  const [fMes, setFMes] = useState('')

  // tab para grupo visible
  const [tabGrupo, setTabGrupo] = useState('Mantenimiento')

  /* ─── fetch ─── */
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('respuestas_formularios')
          .select('*')
        if (error) throw error
        setRawData(data || [])
      } catch (err) {
        console.error('Error cargando datos para dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  /* ─── datos filtrados ─── */
  const filtered = useMemo(() => {
    let d = rawData
    if (fHotel) d = d.filter(r => r.hotel === fHotel)
    if (fAno) d = d.filter(r => r.ano === fAno)
    if (fMes) d = d.filter(r => r.mes === fMes)
    return d
  }, [rawData, fHotel, fAno, fMes])

  /* ─── datos por grupo activo ─── */
  const grupoData = useMemo(() => filtered.filter(r => r.grupo === tabGrupo), [filtered, tabGrupo])

  const metrics = METRIC_DEFS[tabGrupo] || []

  /* ─── KPI totals ─── */
  const kpiTotals = useMemo(() => {
    const totals = {}
    metrics.forEach(m => {
      totals[m.key] = grupoData.reduce((sum, row) => sum + num(m.path(row.datos)), 0)
    })
    return totals
  }, [grupoData, metrics])

  /* ─── Bar chart data: comparación por hotel ─── */
  const barData = useMemo(() => {
    const hotelMap = {}
    grupoData.forEach(row => {
      if (!hotelMap[row.hotel]) hotelMap[row.hotel] = { hotel: row.hotel }
      metrics.forEach(m => {
        hotelMap[row.hotel][m.key] = (hotelMap[row.hotel][m.key] || 0) + num(m.path(row.datos))
      })
    })
    return Object.values(hotelMap)
  }, [grupoData, metrics])

  /* ─── Line chart data: evolución mensual ─── */
  const lineData = useMemo(() => {
    const mesMap = {}
    grupoData.forEach(row => {
      const key = `${row.ano}-${String(MES_INDEX[row.mes] ?? 0).padStart(2, '0')}`
      const label = `${row.mes?.substring(0, 3)} ${row.ano?.slice(-2)}`
      if (!mesMap[key]) mesMap[key] = { sortKey: key, mes: label }
      metrics.forEach(m => {
        mesMap[key][m.key] = (mesMap[key][m.key] || 0) + num(m.path(row.datos))
      })
    })
    return Object.values(mesMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  }, [grupoData, metrics])

  /* ─── Pie chart: distribución por hotel ─── */
  const pieData = useMemo(() => {
    const hotelTotals = {}
    grupoData.forEach(row => {
      hotelTotals[row.hotel] = (hotelTotals[row.hotel] || 0) + 1
    })
    return Object.entries(hotelTotals).map(([name, value]) => ({ name, value }))
  }, [grupoData])

  /* ─── resumen global ─── */
  const resumen = useMemo(() => ({
    totalRegistros: filtered.length,
    hotelesUnicos: new Set(filtered.map(r => r.hotel)).size,
    gruposUnicos: new Set(filtered.map(r => r.grupo)).size,
    anosUnicos: new Set(filtered.map(r => r.ano)).size,
  }), [filtered])

  const sections = GROUP_SECTIONS[tabGrupo] || []

  /* ─── render ─── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#00a09d] rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-semibold">Cargando datos del dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50/50 py-8 px-4 md:px-8 font-sans min-h-full">
      <div className="max-w-7xl w-full mx-auto space-y-6">

        {/* ══════ Header Premium Minimalista ══════ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Dashboard de Sostenibilidad
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Análisis y monitoreo histórico de indicadores ambientales y sociales
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#00a09d]/8 text-[#00a09d] px-3.5 py-2 rounded-2xl font-bold text-xs border border-[#00a09d]/20 shadow-sm shadow-slate-100/50">
              <span className="w-2 h-2 bg-[#00a09d] rounded-full animate-pulse" />
              {resumen.totalRegistros} Registros
            </span>
            <span className="inline-flex items-center bg-white text-slate-600 px-3.5 py-2 rounded-2xl font-bold text-xs border border-slate-200 shadow-sm shadow-slate-100/50">
              {resumen.hotelesUnicos} Hoteles Activos
            </span>
          </div>
        </div>

        {/* ══════ Filtros ══════ */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <svg className="w-4 h-4 text-[#00a09d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-bold text-slate-700 tracking-tight">Filtros de Búsqueda</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FilterDropdown label="Hotel" options={HOTELES} value={fHotel} onChange={setFHotel} />
            <FilterDropdown label="Año" options={ANOS} value={fAno} onChange={setFAno} />
            <FilterDropdown label="Mes" options={MESES} value={fMes} onChange={setFMes} />
          </div>
        </div>

        {/* ══════ Tabs de Grupo ══════ */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GRUPOS.map(g => (
            <button
              key={g}
              onClick={() => setTabGrupo(g)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                tabGrupo === g
                  ? 'bg-gradient-to-r from-[#03105e] to-[#00a09d] text-white shadow-md shadow-[#00a09d]/20 scale-[1.01]'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:border-[#00a09d] hover:text-[#00a09d]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* ══════ Sin datos ══════ */}
        {grupoData.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
              <FaInbox className="text-2xl" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Sin registros disponibles</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
              No se encontraron registros de <strong>{tabGrupo}</strong> con los criterios seleccionados.
            </p>
          </div>
        )}

        {grupoData.length > 0 && (
          <>
            {/* ══════ Distribución por hotel (pie) ══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <ChartCard title={`Registros por Hotel — ${tabGrupo}`}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart margin={{ left: 15, right: 10, top: 0, bottom: 0 }}>
                    <Pie
                      data={pieData} cx="40%" cy="50%" innerRadius={40} outerRadius={65}
                      paddingAngle={3} dataKey="value" nameKey="name"
                      stroke="none"
                    >
                      {pieData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      wrapperStyle={{ fontSize: '9px', width: '45%', paddingLeft: '5px' }}
                      formatter={(v) => (
                        <span className="text-slate-500 font-bold whitespace-nowrap overflow-hidden text-ellipsis block max-w-[120px]" title={v}>
                          {v}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* mini resumen del grupo */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.slice(0, 6).map((m, i) => (
                  <KpiCard
                    key={m.key}
                    icon={m.icon}
                    label={m.label}
                    value={kpiTotals[m.key]}
                    unit={m.unit}
                    color={m.color}
                    animDelay={i * 60}
                  />
                ))}
              </div>
            </div>

            {/* ══════ Secciones con gráficos ══════ */}
            {sections.map((section, si) => {
              const sectionMetrics = metrics.filter(m => section.keys.includes(m.key))
              if (sectionMetrics.length === 0) return null

              const sectionIcon = sectionMetrics[0]?.icon || <FaChartBar />

              return (
                <div key={si}>
                  <SectionTitle icon={sectionIcon}>{section.title}</SectionTitle>

                  {/* KPI cards para esta sección */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {sectionMetrics.map((m, i) => (
                      <KpiCard
                        key={m.key}
                        icon={m.icon}
                        label={m.label}
                        value={kpiTotals[m.key]}
                        unit={m.unit}
                        color={m.color}
                        animDelay={i * 60}
                      />
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar: comparación por hotel */}
                    <ChartCard title={`${section.title} — Comparativa por Hotel`}>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 45 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            dataKey="hotel"
                            tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                            tickFormatter={v => v?.length > 15 ? v.substring(0, 15) + '…' : v}
                            angle={-25}
                            textAnchor="end"
                            interval={0}
                          />
                          <YAxis tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} verticalAlign="bottom" />
                          {sectionMetrics.map(m => (
                            <Bar key={m.key} dataKey={m.key} name={m.label} fill={m.color} radius={[3, 3, 0, 0]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Line: evolución mensual */}
                    <ChartCard title={`${section.title} — Evolución Mensual`}>
                      <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="mes" 
                            tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} 
                            interval={Math.ceil(lineData.length / 8)}
                          />
                          <YAxis tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '15px' }} verticalAlign="bottom" />
                          {sectionMetrics.map(m => (
                            <Line
                              key={m.key} type="monotone" dataKey={m.key} name={m.label}
                              stroke={m.color} strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartCard>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* ══════ Footer ══════ */}
        <div className="text-center text-xs text-slate-400 py-8 border-t border-slate-200/50 mt-12 font-medium">
          Plataforma de Sostenibilidad · Generado con Datos en Tiempo Real
        </div>

      </div>
    </div>
  )
}

export default Dashboard
