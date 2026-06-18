import { supabase } from './supabaseClient';
import { authService } from './authService';

export interface RutaPasaporte {
  id: number;
  nombre: string;
  fecha: string;
  completada: boolean;
  codigoPegatina: string | null;
}

export const passportService = {
  async getPasaporteUsuario(): Promise<RutaPasaporte[]> {
    if (!supabase) {
      console.warn("Supabase not configured, returning empty passport.");
      return [];
    }

    const user = await authService.getCurrentUser();
    if (!user) {
      // If not logged in, we might just want to return the available routes but none completed.
      const { data: rutas, error: errorRutas } = await supabase
        .from('rutas')
        .select('*')
        .order('fecha', { ascending: true });
        
      if (errorRutas) throw errorRutas;
      
      return rutas.map(r => ({
        id: r.id,
        nombre: r.nombre,
        fecha: r.fecha,
        completada: false,
        codigoPegatina: null
      }));
    }

    // 1. Fetch all routes
    const { data: rutas, error: errorRutas } = await supabase
      .from('rutas')
      .select('*')
      .order('fecha', { ascending: true });

    if (errorRutas) throw errorRutas;

    // 2. Fetch redeemed codes for current user
    const { data: codigos, error: errorCodigos } = await supabase
      .from('codigos_pegatinas')
      .select('codigo, ruta_id')
      .eq('usuario_id', user.id);

    if (errorCodigos) throw errorCodigos;

    // 3. Map to unified structure
    const canjeadosMap = new Map<number, string>();
    codigos.forEach(c => canjeadosMap.set(c.ruta_id, c.codigo));

    return rutas.map(r => ({
      id: r.id,
      nombre: r.nombre,
      fecha: r.fecha,
      completada: canjeadosMap.has(r.id),
      codigoPegatina: canjeadosMap.get(r.id) || null
    }));
  },

  async canjearCodigoPegatina(codigoIntroducido: string): Promise<boolean> {
    if (!supabase) throw new Error("Supabase is not configured.");
    
    const user = await authService.getCurrentUser();
    if (!user) throw new Error("Debes iniciar sesión para validar tu pegatina.");

    // First, verify the code is available
    const { data: codigoData, error: errorCheck } = await supabase
      .from('codigos_pegatinas')
      .select('usuario_id')
      .eq('codigo', codigoIntroducido)
      .single();

    if (errorCheck || !codigoData) {
      throw new Error("El código no existe o es incorrecto.");
    }

    if (codigoData.usuario_id !== null) {
      if (codigoData.usuario_id === user.id) {
        throw new Error("Ya has validado este código anteriormente.");
      }
      throw new Error("Este código ya ha sido canjeado por otro usuario.");
    }

    // It's available, let's claim it via UPDATE
    const { error: updateError } = await supabase
      .from('codigos_pegatinas')
      .update({
        usuario_id: user.id,
        canjeado_el: new Date().toISOString()
      })
      .eq('codigo', codigoIntroducido);

    if (updateError) {
      throw updateError;
    }

    return true;
  }
};
