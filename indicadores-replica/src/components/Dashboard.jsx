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
} from 'react-icons/fa'

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
  '#0d9488', '#0ea5e9', '#8b5cf6', '#f59e0b',
  '#ef4444', '#10b981', '#ec4899', '#6366f1'
]

/* ─── helpers para extraer métricas del JSONB ─── */

const num = (v) => {
  if (v === null || v === undefined || v === '') return 0
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''))
  return isNaN(n) ? 0 : n
}

const METRIC_DEFS = {
  Mantenimiento: [
    { key: 'totalEnergia', label: 'Energía Total', unit: 'kWh', path: d => d?.totalEnergia, color: '#f59e0b', icon: <FaBolt /> },
    { key: 'costoElectricidad', label: 'Costo Electricidad', unit: '$', path: d => d?.costoElectricidad, color: '#ef4444', icon: <FaDollarSign /> },
    { key: 'gasLP', label: 'Gas LP', unit: 'L', path: d => d?.combustibles?.gasLP, color: '#8b5cf6', icon: <FaFire /> },
    { key: 'diesel', label: 'Diesel', unit: 'L', path: d => d?.combustibles?.diesel, color: '#6366f1', icon: <FaGasPump /> },
    { key: 'gasolina', label: 'Gasolina', unit: 'L', path: d => d?.combustibles?.gasolina, color: '#ec4899', icon: <FaGasPump /> },
    { key: 'lena', label: 'Leña', unit: 'kg', path: d => d?.combustibles?.lena, color: '#a16207', icon: <FaTree /> },
    { key: 'carbon', label: 'Carbón Vegetal', unit: 'kg', path: d => d?.combustibles?.carbon, color: '#57534e', icon: <FaBurn /> },
    { key: 'costoGasLP', label: 'Costo Gas LP', unit: '$', path: d => d?.costoGasLP, color: '#dc2626', icon: <FaMoneyBillWave /> },
    { key: 'aguaPotable', label: 'Agua Consumida', unit: 'm³', path: d => d?.agua?.potable, color: '#0ea5e9', icon: <FaTint /> },
    { key: 'aguaPozos', label: 'Pozos Extracción', unit: 'm³', path: d => d?.agua?.pozos, color: '#0891b2', icon: <FaWater /> },
    { key: 'osmosisProd', label: 'Prod. Ósmosis', unit: 'm³', path: d => d?.agua?.osmosisProd, color: '#06b6d4', icon: <FaFlask /> },
    { key: 'osmosisRechazo', label: 'Rechazo Ósmosis', unit: 'm³', path: d => d?.agua?.osmosisRechazo, color: '#94a3b8', icon: <FaFaucet /> },
    { key: 'ptarPozo', label: 'PTAR a Pozo', unit: 'm³', path: d => d?.agua?.ptarPozo, color: '#22d3ee', icon: <FaRecycle /> },
    { key: 'ptarRiego', label: 'PTAR a Riego', unit: 'm³', path: d => d?.agua?.ptarRiego, color: '#10b981', icon: <FaSeedling /> },
    { key: 'lavanderia', label: 'Lavandería', unit: 'm³', path: d => d?.agua?.lavanderia, color: '#a78bfa', icon: <FaTshirt /> },
    { key: 'retrolavados', label: 'Retrolavados', unit: 'm³', path: d => d?.agua?.retrolavados, color: '#38bdf8', icon: <FaSyncAlt /> },
    { key: 'volumenSargazo', label: 'Volumen Sargazo', unit: '', path: d => d?.volumenSargazo, color: '#84cc16', icon: <FaLeaf /> },
  ],
  Seguridad: [
    { key: 'residuosOrganicos', label: 'Residuos Orgánicos', unit: '', path: d => d?.residuos?.organicos, color: '#10b981', icon: <FaRecycle /> },
    { key: 'residuosInorganicos', label: 'Residuos Inorgánicos', unit: '', path: d => d?.residuos?.inorganicos, color: '#6366f1', icon: <FaTrash /> },
    { key: 'residuosGranja', label: 'Residuos Org. Granja', unit: '', path: d => d?.residuos?.organicosgranja, color: '#84cc16', icon: <FaPaw /> },
    { key: 'accidentesHuespedes', label: 'Accidentes Huéspedes', unit: '', path: d => d?.accidentes?.huespedes, color: '#ef4444', icon: <FaHospital /> },
    { key: 'accidentesColaboradores', label: 'Accidentes Colaboradores', unit: '', path: d => d?.accidentes?.colaboradores, color: '#f97316', icon: <FaExclamationTriangle /> },
    { key: 'transporteR1', label: 'Transporte R1', unit: '', path: d => d?.transporte?.r1, color: '#0ea5e9', icon: <FaBus /> },
    { key: 'transporteR2', label: 'Transporte R2', unit: '', path: d => d?.transporte?.r2, color: '#8b5cf6', icon: <FaBus /> },
    { key: 'transporteR3', label: 'Transporte R3', unit: '', path: d => d?.transporte?.r3, color: '#ec4899', icon: <FaBus /> },
    { key: 'transporteR4', label: 'Transporte R4', unit: '', path: d => d?.transporte?.r4, color: '#f59e0b', icon: <FaBus /> },
    { key: 'rutasTransporteCantidad', label: 'Rutas Transporte Cantidad', unit: '', path: d => d?.rutasTransporteCantidad, color: '#14b8a6', icon: <FaRoad /> },
  ],
  'Recursos Humanos': [
    { key: 'colaboradoresClubVacacional', label: 'Colaboradores Club Vacacional', unit: '', path: d => d?.colaboradoresClubVacacional, color: '#0d9488', icon: <FaUsers /> },
    { key: 'colaboradoresExternos', label: 'Colaboradores Externos', unit: '', path: d => d?.colaboradoresExternos, color: '#0ea5e9', icon: <FaHandshake /> },
    { key: 'residentesPobladoApoyo', label: 'Residentes Poblado Apoyo', unit: '', path: d => d?.residentesPobladoApoyo, color: '#8b5cf6', icon: <FaHome /> },
    { key: 'actividadVoluntariadoHoras', label: 'Voluntariado (Horas)', unit: 'hrs', path: d => d?.actividadVoluntariadoHoras, color: '#f59e0b', icon: <FaHandsHelping /> },
    { key: 'montoFundacionLomas', label: 'Monto Fundación Lomas', unit: '$', path: d => d?.montoFundacionLomas, color: '#ef4444', icon: <FaUniversity /> },
    { key: 'colaboradoresEducacionAdultos', label: 'Educación Adultos', unit: '', path: d => d?.colaboradoresEducacionAdultos, color: '#10b981', icon: <FaBook /> },
    { key: 'montoEfectivoDonaciones', label: 'Monto Donaciones', unit: '$', path: d => d?.montoEfectivoDonaciones, color: '#ec4899', icon: <FaHeart /> },
    { key: 'donativosEspecieValor', label: 'Donativos Especie', unit: '$', path: d => d?.donativosEspecieValor, color: '#6366f1', icon: <FaGift /> },
  ],
  'Contraloría': [
    { key: 'huespednoche', label: 'Huésped-Noche', unit: '', path: d => d?.ocupacion?.huespednoche, color: '#0d9488', icon: <FaBed /> },
    { key: 'cuartonoche', label: 'Cuarto-Noche', unit: '', path: d => d?.ocupacion?.cuartonoche, color: '#0ea5e9', icon: <FaDoorOpen /> },
    { key: 'porcentajeOcupacion', label: '% Ocupación', unit: '%', path: d => d?.ocupacion?.porcentaje, color: '#8b5cf6', icon: <FaChartBar /> },
    { key: 'recoleccionesReciclables', label: 'Recolecciones Reciclables', unit: '', path: d => d?.recoleccionesReciclablesCantidad, color: '#10b981', icon: <FaRecycle /> },
    { key: 'dayPassVendidos', label: 'Day Pass Vendidos', unit: '', path: d => d?.dayPassVendidosCantidad, color: '#f59e0b', icon: <FaTicketAlt /> },
    { key: 'litrosAceite', label: 'Litros Aceite Salida', unit: 'L', path: d => d?.litrosAceiteSalidaAlmacen, color: '#ef4444', icon: <FaOilCan /> },
    { key: 'reciclablesElectronicosPeso', label: 'Electrónicos Reciclados', unit: 'kg', path: d => d?.reciclablesElectronicosPeso, color: '#6366f1', icon: <FaMobileAlt /> },
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

/* ───────────────────────── Componentes ───────────────────────── */

const FilterDropdown = ({ label, options, value, onChange, allLabel = 'Todos' }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white border border-slate-200 text-slate-700 rounded-xl px-3 py-2.5 text-sm
                 focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none transition-all
                 cursor-pointer shadow-sm hover:border-teal-300"
    >
      <option value="">{allLabel}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
)

const KpiCard = ({ icon, label, value, unit, color, animDelay = 0 }) => (
  <div
    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-2
               hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    style={{ animationDelay: `${animDelay}ms` }}
  >
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider leading-tight">{label}</span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl font-bold" style={{ color }}>{value.toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
      {unit && <span className="text-xs text-slate-400">{unit}</span>}
    </div>
  </div>
)

const SectionTitle = ({ icon, children }) => (
  <div className="flex items-center gap-3 mt-8 mb-4">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm shadow-sm">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-700">{children}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-teal-100 to-transparent" />
  </div>
)

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-300">
    <h4 className="text-sm font-semibold text-slate-600 mb-4">{title}</h4>
    {children}
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100 p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-700">{Number(p.value).toLocaleString('es-MX', { maximumFractionDigits: 1 })}</span>
        </div>
      ))}
    </div>
  )
}

/* ───────────────────────── Dashboard principal ───────────────────────── */

const Dashboard = () => {
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)

  // filtros
  const [fGrupo, setFGrupo] = useState('')
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
    if (fGrupo) d = d.filter(r => r.grupo === fGrupo)
    if (fHotel) d = d.filter(r => r.hotel === fHotel)
    if (fAno) d = d.filter(r => r.ano === fAno)
    if (fMes) d = d.filter(r => r.mes === fMes)
    return d
  }, [rawData, fGrupo, fHotel, fAno, fMes])

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
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Cargando datos del dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 py-8 px-4 md:px-8 font-sans min-h-full">
      <div className="max-w-7xl w-full mx-auto space-y-6">

        {/* ══════ Header ══════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              Dashboard de Sostenibilidad
            </h1>
            <p className="text-sm text-slate-500 mt-1">Métricas y comparativas de indicadores registrados</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full font-medium">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              {resumen.totalRegistros} registros
            </span>
            <span className="bg-slate-100 px-3 py-1.5 rounded-full">{resumen.hotelesUnicos} hoteles</span>
          </div>
        </div>

        {/* ══════ Filtros ══════ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-semibold text-slate-600">Filtros</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FilterDropdown label="Grupo" options={GRUPOS} value={fGrupo} onChange={setFGrupo} />
            <FilterDropdown label="Hotel" options={HOTELES} value={fHotel} onChange={setFHotel} />
            <FilterDropdown label="Año" options={ANOS} value={fAno} onChange={setFAno} />
            <FilterDropdown label="Mes" options={MESES} value={fMes} onChange={setFMes} />
          </div>
        </div>

        {/* ══════ Tabs de Grupo ══════ */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {GRUPOS.map(g => (
            <button
              key={g}
              onClick={() => setTabGrupo(g)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                tabGrupo === g
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-200/50'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* ══════ Sin datos ══════ */}
        {grupoData.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="mx-auto w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FaInbox className="text-2xl" />
            </div>
            <h3 className="font-semibold text-slate-700 text-lg">Sin datos disponibles</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              No se encontraron registros para <strong>{tabGrupo}</strong> con los filtros seleccionados.
            </p>
          </div>
        )}

        {grupoData.length > 0 && (
          <>
            {/* ══════ Distribución por hotel (pie) ══════ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <ChartCard title={`Registros por Hotel — ${tabGrupo}`}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={3} dataKey="value" nameKey="name"
                      stroke="none"
                    >
                      {pieData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px' }}
                      formatter={(v) => <span className="text-slate-500">{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* mini resumen del grupo */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Bar: comparación por hotel */}
                    <ChartCard title={`${section.title} — Comparativa por Hotel`}>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis
                            dataKey="hotel"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickFormatter={v => v?.length > 12 ? v.substring(0, 12) + '…' : v}
                          />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                          {sectionMetrics.map(m => (
                            <Bar key={m.key} dataKey={m.key} name={m.label} fill={m.color} radius={[4, 4, 0, 0]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartCard>

                    {/* Line: evolución mensual */}
                    <ChartCard title={`${section.title} — Evolución Mensual`}>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                          {sectionMetrics.map(m => (
                            <Line
                              key={m.key} type="monotone" dataKey={m.key} name={m.label}
                              stroke={m.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }}
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
        <div className="text-center text-xs text-slate-400 py-6">
          Plataforma de Sostenibilidad · Dashboard generado con datos en tiempo real
        </div>

      </div>
    </div>
  )
}

export default Dashboard
