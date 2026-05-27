import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Leer credenciales desde el archivo .env de la aplicación
const envPath = path.resolve('.env');
console.log('Cargando credenciales desde:', envPath);

let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (err) {
  console.error('Error al leer el archivo .env:', err);
  process.exit(1);
}

const envVars = {};
envContent.split(/\r?\n/).forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseAnonKey = envVars.VITE_SUPABASE_PUBLISHABLE_KEY || envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: No se encontraron VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env");
  process.exit(1);
}

console.log('Conectando a Supabase:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Definición de parámetros para el llenado
const hoteles = [
  'El Dorado Royale (EDR)',
  'El Dorado Seaside Suites (EDS)',
  'El Dorado Maroma (EDM)',
  'Generations Riviera Maya (GRM)',
  'Corporativo (CORP)',
  'Maison México Roma',
  'Maroma Beach'
];

const grupos = ['Seguridad', 'Mantenimiento', 'Recursos Humanos', 'Contraloría'];

const anos = ['2023', '2024', '2025', '2026'];
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Helper para limpiar nombres y rutas de archivos
const cleanRuta = (texto) => {
  if (!texto) return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
};

// Generador de números aleatorios en string
const rand = (min, max, decimals = 0) => {
  const val = Math.random() * (max - min) + min;
  return decimals === 0 ? Math.floor(val).toString() : val.toFixed(decimals).toString();
};

// Helper para seleccionar elemento aleatorio
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generador de datos específicos para cada grupo
const generateMockDatos = (grupo, hotel, ano, mes) => {
  const cleanHotel = cleanRuta(hotel);
  const cleanGrupo = cleanRuta(grupo);
  
  if (grupo === 'Seguridad') {
    const incidente = randChoice(['Si', 'No']);
    return {
      residuos: {
        organicos: rand(1000, 5000, 2),
        inorganicos: rand(800, 3000, 2),
        organicosgranja: rand(200, 1500, 2)
      },
      accidentes: {
        huespedes: rand(0, 4),
        colaboradores: rand(0, 8)
      },
      incidenteFauna: incidente,
      transporte: {
        r1: rand(10, 45),
        r2: rand(5, 25),
        r3: rand(8, 35),
        r4: rand(0, 15)
      },
      rutasTransporteCantidad: rand(2, 5),
      rutasTransporteDestino: 'Zonas urbanas de personal y comunidades aledañas',
      archivos: {
        bitacoraResiduosImpresa: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/bitacoraResiduosImpresa/bitacora_impresa.pdf`],
        bitacoraResiduosExcel: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/bitacoraResiduosExcel/bitacora_excel.xlsx`],
        reporteIncidenteFauna: incidente === 'Si' ? [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/reporteIncidenteFauna/fauna.pdf`] : [],
        reporteEsterilizacionGatos: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/reporteEsterilizacionGatos/esterilizacion.pdf`]
      }
    };
  }
  
  if (grupo === 'Contraloría') {
    const envio = randChoice(['Si', 'No']);
    const pesoElect = envio === 'Si' ? rand(5, 80, 2) : null;
    const manifiestoElect = envio === 'Si' ? [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestosElectronicosSoporte/electronicos.pdf`] : [];
    
    return {
      ocupacion: {
        huespednoche: rand(3000, 11000),
        cuartonoche: rand(1500, 5500),
        porcentaje: rand(65, 92)
      },
      recoleccionesReciclablesCantidad: rand(4, 10),
      incidentesReciclablesDetalle: 'Ninguno, recolecciones realizadas a tiempo.',
      dayPassVendidosCantidad: rand(15, 150),
      litrosAceiteSalidaAlmacen: rand(80, 350),
      envioEquiposElectronicos: envio,
      reciclablesElectronicosPeso: pesoElect,
      archivos: {
        manifiestosReciclablesSoporte: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestosReciclablesSoporte/reciclables.pdf`],
        formatoControlReciclablesExcel: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/formatoControlReciclablesExcel/control.xlsx`],
        manifiestosAceiteSoporte: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestosAceiteSoporte/aceite.pdf`],
        reporteSalidasAlmacenSoporte: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/reporteSalidasAlmacenSoporte/salidas.pdf`],
        manifiestosElectronicosSoporte: manifiestoElect
      }
    };
  }
  
  if (grupo === 'Recursos Humanos') {
    const apoy = randChoice(['Si', 'No']);
    const resApoy = apoy === 'Si' ? rand(30, 120) : null;
    const volunt = randChoice(['Si', 'No']);
    const voluntHoras = volunt === 'Si' ? rand(50, 250) : null;
    
    return {
      colaboradoresClubVacacional: rand(15, 60),
      colaboradoresExternos: rand(25, 120),
      pobladoApoyo: apoy,
      residentesPobladoApoyo: resApoy,
      eventosInternosLista: 'Celebración mensual de cumpleaños, Capacitación EarthCheck, Torneo de fútbol interno.',
      voluntariado: volunt,
      actividadVoluntariadoHoras: voluntHoras,
      montoFundacionLomas: rand(8000, 45000),
      colaboradoresEducacionAdultos: rand(3, 15),
      montoEfectivoDonaciones: rand(2000, 15000),
      donativosEspecieValor: rand(3000, 25000),
      archivos: {
        evidenciasEventosCampanas: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/evidenciasEventosCampanas/evidencia_campana.pdf`],
        reporteIndicadoresMensual: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/reporteIndicadoresMensual/reporte_rrhh.pdf`]
      }
    };
  }
  
  if (grupo === 'Mantenimiento') {
    const isEDR = hotel === 'El Dorado Royale (EDR)';
    const totalE = rand(60000, 220000, 2);
    let sec1 = null, sec2 = null, sec3 = null;
    if (isEDR) {
      const e1 = parseFloat(totalE) * 0.42;
      const e2 = parseFloat(totalE) * 0.33;
      const e3 = parseFloat(totalE) * 0.25;
      sec1 = e1.toFixed(2);
      sec2 = e2.toFixed(2);
      sec3 = e3.toFixed(2);
    }
    
    const combusts = {
      gasLP: rand(6000, 35000, 2),
      diesel: rand(300, 4000, 2),
      gasolina: rand(150, 1500, 2),
      lena: randChoice(['0.00', rand(10, 80, 2)]),
      carbon: randChoice(['0.00', rand(5, 40, 2)])
    };
    
    const aguas = {
      potable: rand(1500, 6000, 2),
      pozos: rand(2000, 8000, 2),
      osmosisProd: rand(1000, 5000, 2),
      osmosisRechazo: rand(200, 1500, 2),
      ptarPozo: rand(500, 3000, 2),
      ptarRiego: rand(400, 2500, 2),
      lavanderia: rand(300, 1800, 2),
      retrolavados: rand(50, 400, 2)
    };
    
    const situacion = randChoice(['Si', 'No']);
    
    return {
      totalEnergia: totalE,
      energiaSec1: sec1,
      energiaSec2: sec2,
      energiaSec3: sec3,
      costoElectricidad: rand(150000, 750000),
      combustibles: combusts,
      costoGasLP: rand(60000, 250000),
      fuenteAguaPotable: 'Pozos profundos autorizados y red municipal',
      agua: aguas,
      situacionLectura: situacion,
      volumenSargazo: randChoice([null, rand(20, 180, 2)]),
      archivos: {
        recibosElectricidad: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/recibosElectricidad/recibo_cfe.pdf`],
        facturasGasLP: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/facturasGasLP/factura_gas.pdf`],
        bitacoraGasLP: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/bitacoraGasLP/bitacora_gas.xlsx`],
        facturasDiesel: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/facturasDiesel/factura_diesel.pdf`],
        bitacoraDiesel: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/bitacoraDiesel/bitacora_diesel.xlsx`],
        facturasGasolina: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/facturasGasolina/factura_gasolina.pdf`],
        bitacoraGasolina: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/bitacoraGasolina/bitacora_gasolina.xlsx`],
        facturasLena: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/facturasLena/factura_lena.pdf`],
        facturasCarbon: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/facturasCarbon/factura_carbon.pdf`],
        bitacoraAgua: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/bitacoraAgua/bitacora_agua.xlsx`],
        evidenciaReporteGestores: situacion === 'Si' ? [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/evidenciaReporteGestores/gestores.pdf`] : [],
        reporteEnergeticos: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/reporteEnergeticos/reporte_mensual.pdf`],
        manifiestoGrasaCarcamos: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestoGrasaCarcamos/carcamos.pdf`],
        manifiestoGrasaCampanas: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestoGrasaCampanas/campanas.pdf`],
        manifiestoResiduosPeligrosos: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestoResiduosPeligrosos/peligrosos.pdf`],
        manifiestoEscombros: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestoEscombros/escombros.pdf`],
        manifiestoSargazo: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/manifiestoSargazo/manifiesto_sargazo.pdf`],
        bitacoraSargazo: [`${cleanHotel}/${cleanGrupo}/${ano}/${mes}/bitacoraSargazo/bitacora_sargazo.xlsx`]
      }
    };
  }
};

// 3. Compilación de todos los registros en un array
const payloads = [];

for (const hotel of hoteles) {
  for (const grupo of grupos) {
    for (const ano of anos) {
      for (const mes of meses) {
        // Si el año es 2026, solo rellenar hasta Mayo de 2026
        if (ano === '2026' && !['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'].includes(mes)) {
          continue;
        }
        
        payloads.push({
          hotel,
          grupo,
          ano,
          mes,
          nombre_responsable: 'Simulador de Datos',
          puesto_responsable: 'Script de Llenado Histórico',
          correo_responsable: 'simulador@plataforma-sostenibilidad.com',
          created_at: new Date().toISOString(),
          datos: generateMockDatos(grupo, hotel, ano, mes)
        });
      }
    }
  }
}

console.log(`Generados ${payloads.length} registros simulados. Subiendo en lotes a Supabase...`);

// 4. Subir por lotes a Supabase para evitar límites de tamaño de request
const TAMANO_LOTE = 100;

const sembrarDatos = async () => {
  for (let i = 0; i < payloads.length; i += TAMANO_LOTE) {
    const lote = payloads.slice(i, i + TAMANO_LOTE);
    console.log(`Subiendo lote ${Math.floor(i / TAMANO_LOTE) + 1} de ${Math.ceil(payloads.length / TAMANO_LOTE)} (${lote.length} registros)...`);
    
    const { data, error } = await supabase
      .from('respuestas_formularios')
      .upsert(lote, { onConflict: 'hotel,grupo,ano,mes' });
      
    if (error) {
      console.error('Error al subir lote a la base de datos:', error);
      process.exit(1);
    }
  }
  
  console.log('¡Siembra de datos e histórico (2023 - Mayo 2026) completados de manera exitosa!');
};

sembrarDatos();
