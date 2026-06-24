import { supabase } from './supabaseClient';
import { authService } from './authService';

export interface InscriptionStatus {
  aforoActual: number;
  aforoRestante: number;
  aforoCompleto: boolean;
  usuarioApuntado: boolean;
}

export interface InscriptionData {
  ruta_id: number;
  dni: string;
  email_contacto: string;
  telefono_contacto: string;
  telefono_emergencias: string;
  solicita_federacion: boolean;
  fecha_ruta: string; // To calculate the insurance duration
}

export interface InscriptionPreviousData {
  dni: string;
  email_contacto: string;
  telefono_contacto: string;
  telefono_emergencias: string;
}

export const inscriptionService = {
  async checkEstadoRuta(ruta_id: number): Promise<InscriptionStatus> {
    if (!supabase) throw new Error("Supabase is not configured.");

    const user = await authService.getCurrentUser();
    let usuarioApuntado = false;

    // Obtener todas las inscripciones para esta ruta
    const { data: inscripciones, error } = await supabase
      .from('inscripciones')
      .select('usuario_id')
      .eq('ruta_id', ruta_id);

    if (error) throw error;

    const aforoActual = inscripciones ? inscripciones.length : 0;
    const aforoRestante = Math.max(0, 15 - aforoActual);
    const aforoCompleto = aforoActual >= 15;

    if (user) {
      // Ver si el usuario actual está en la lista
      usuarioApuntado = inscripciones?.some(inscripcion => inscripcion.usuario_id === user.id) || false;
    }

    return {
      aforoActual,
      aforoRestante,
      aforoCompleto,
      usuarioApuntado
    };
  },

  async inscribirseARuta(data: InscriptionData): Promise<boolean> {
    if (!supabase) throw new Error("Supabase is not configured.");

    const user = await authService.getCurrentUser();
    if (!user) throw new Error("Debes iniciar sesión para inscribirte.");

    // Lógica FEMECV: 
    // Sábado o Domingo = 2 días
    // Lunes a Viernes = 7 días
    let duracion_federacion = 0;
    if (data.solicita_federacion) {
      const routeDate = new Date(data.fecha_ruta);
      const dayOfWeek = routeDate.getDay(); // 0 is Sunday, 6 is Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        duracion_federacion = 2; // Fin de semana
      } else {
        duracion_federacion = 7; // Semanal
      }
    }

    // Generar código de pegatina
    const { data: rutaData } = await supabase
      .from('rutas')
      .select('codigo_prefijo')
      .eq('id', data.ruta_id)
      .single();

    let prefijoLimpio = 'RUTA';
    if (rutaData?.codigo_prefijo) {
      prefijoLimpio = rutaData.codigo_prefijo.split('.')[0].toUpperCase();
    }

    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const codigoPegatina = `${prefijoLimpio}-${randomChars}`;

    const { error } = await supabase
      .from('inscripciones')
      .insert([
        {
          usuario_id: user.id,
          ruta_id: data.ruta_id,
          dni: data.dni,
          email_contacto: data.email_contacto,
          telefono_contacto: data.telefono_contacto,
          telefono_emergencias: data.telefono_emergencias,
          solicita_federacion: data.solicita_federacion,
          duracion_federacion: data.solicita_federacion ? duracion_federacion : null
        }
      ]);

    if (error) {
      if (error.message.includes('Aforo completo') || error.code === 'P0001') {
        throw new Error('Aforo completo para esta ruta. Máximo 15 participantes.');
      }
      if (error.code === '23505') { // Unique violation
        throw new Error('Ya estás inscrito en esta ruta.');
      }
      throw error;
    }

    // Insertar el código vinculado al usuario, pero no canjeado
    const { error: errorCodigo } = await supabase
      .from('codigos_pegatinas')
      .insert([
        {
          codigo: codigoPegatina,
          ruta_id: data.ruta_id,
          usuario_id: user.id,
          canjeado_el: null
        }
      ]);

    if (errorCodigo) {
      console.error("Error al generar el código de pegatina:", errorCodigo);
    }

    return true;
  },

  async desapuntarseDeRuta(ruta_id: number): Promise<boolean> {
    if (!supabase) throw new Error("Supabase is not configured.");

    const user = await authService.getCurrentUser();
    if (!user) throw new Error("Debes iniciar sesión para desapuntarte.");

    // Eliminar la inscripción (esto requiere una política RLS de DELETE)
    const { error } = await supabase
      .from('inscripciones')
      .delete()
      .eq('usuario_id', user.id)
      .eq('ruta_id', ruta_id);

    if (error) {
      throw error;
    }

    // Intentar eliminar también el código de pegatina si no está canjeado
    const { error: errorCodigo } = await supabase
      .from('codigos_pegatinas')
      .delete()
      .eq('usuario_id', user.id)
      .eq('ruta_id', ruta_id)
      .is('canjeado_el', null);

    if (errorCodigo) {
      console.error("Error al eliminar el código de pegatina:", errorCodigo);
    }

    return true;
  },

  async getUltimaInscripcion(): Promise<InscriptionPreviousData | null> {
    if (!supabase) return null;

    const user = await authService.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('inscripciones')
      .select('dni, email_contacto, telefono_contacto, telefono_emergencias')
      .eq('usuario_id', user.id)
      .order('fecha_inscripcion', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
  }
};
