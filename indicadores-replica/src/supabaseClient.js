import { createClient } from '@supabase/supabase-js'

// Utilizar variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Sube un archivo físico al bucket de Storage de Supabase
 * @param {File} file Objeto File del navegador
 * @param {string} path Ruta de destino en el bucket (ej. hotel/grupo/ano/mes/campo/archivo.pdf)
 * @returns {Promise<string>} Ruta del archivo guardado
 */
export const subirArchivo = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('soportes')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) throw error;
  return data.path;
};

/**
 * Limpia y normaliza una ruta para que contenga solo caracteres ASCII válidos (sin acentos, espacios ni especiales)
 */
export const limpiarRuta = (texto) => {
  if (!texto) return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
};

/**
 * Limpia el nombre del archivo preservando puntos para las extensiones
 */
export const limpiarNombreArchivo = (nombre) => {
  if (!nombre) return '';
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_');
};

/**
 * Sube una lista de archivos (o mantiene los existentes) a una ruta estructurada en Supabase Storage.
 * @param {Array<File|string|object>} files Array de archivos (objetos File) o strings/objetos (rutas ya subidas)
 * @param {string} hotel Nombre del hotel (para la ruta)
 * @param {string} grupo Nombre del grupo (para la ruta)
 * @param {string} ano Año (para la ruta)
 * @param {string} mes Mes (para la ruta)
 * @param {string} campo Nombre del campo (para la ruta)
 * @returns {Promise<Array<string>>} Promesa que resuelve a un array con las rutas de los archivos guardados
 */
export const subirListaArchivos = async (files, hotel, grupo, ano, mes, campo) => {
  if (!files || !Array.isArray(files)) return [];
  
  const cleanHotel = limpiarRuta(hotel);
  const cleanGrupo = limpiarRuta(grupo);
  const cleanAno = limpiarRuta(ano);
  const cleanMes = limpiarRuta(mes);
  const cleanCampo = limpiarRuta(campo);
  
  const uploadPromises = files.map(async (file) => {
    if (!file) return null;
    
    // Si ya es una ruta/URL de string guardada, mantenerla
    if (typeof file === 'string') {
      return file;
    }
    
    // Si es un objeto File físico recién cargado por el navegador
    if (file instanceof File) {
      const cleanFileName = limpiarNombreArchivo(file.name);
      const path = `${cleanHotel}/${cleanGrupo}/${cleanAno}/${cleanMes}/${cleanCampo}/${cleanFileName}`;
      await subirArchivo(file, path);
      return path;
    }
    
    // Si es un objeto simulado de carga previa { name: '...', type: '...' }
    if (typeof file === 'object' && file.name) {
      if (file.name.includes('/')) {
        return file.name;
      }
      return file.name;
    }
    
    return null;
  });
  
  const results = await Promise.all(uploadPromises);
  return results.filter(Boolean);
};

/**
 * Elimina físicamente de Supabase Storage los archivos que existían previamente pero ya no están en la lista nueva.
 * @param {Array<string>} oldPaths Lista de rutas de archivos guardadas anteriormente
 * @param {Array<string>} newPaths Lista de rutas de archivos nuevas a guardar
 */
export const eliminarArchivosHuerfanos = async (oldPaths, newPaths) => {
  if (!oldPaths || !Array.isArray(oldPaths)) return;
  
  // Filtrar rutas válidas que ya no existan en la nueva lista de archivos a guardar
  const pathsToDelete = oldPaths.filter(
    (path) => path && typeof path === 'string' && path.includes('/') && !newPaths.includes(path)
  );
  
  if (pathsToDelete.length > 0) {
    try {
      const { error } = await supabase.storage.from('soportes').remove(pathsToDelete);
      if (error) {
        console.warn('Error al eliminar archivos huérfanos de Storage:', error);
      } else {
        console.log('Archivos obsoletos eliminados de Storage:', pathsToDelete);
      }
    } catch (err) {
      console.error('Excepción al eliminar de Storage:', err);
    }
  }
};



