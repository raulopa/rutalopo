import { supabase } from './supabaseClient';

export interface UsuarioPasaporte {
  id: string;
  email: string;
  codigos: string[];
  rutasCompletadas: number;
}

export interface RutaAdmin {
  id: number;
  nombre: string;
  fecha: string;
  hora: string | null;
  notas: string | null;
  wikiloc_id: string | null;
  wikiloc_url: string | null;
  distancia_km: number | null;
  desnivel_positivo: number | null;
  tipo_ruta: string | null;
}

export const adminService = {
  async getUsuariosYPasaportes(): Promise<UsuarioPasaporte[]> {
    if (!supabase) throw new Error("Supabase is not configured.");

    // Fetch all profiles
    const { data: perfiles, error: errorPerfiles } = await supabase
      .from('perfiles')
      .select('*');

    if (errorPerfiles) throw errorPerfiles;

    // Fetch all redeemed codes
    const { data: codigos, error: errorCodigos } = await supabase
      .from('codigos_pegatinas')
      .select('usuario_id, codigo')
      .not('usuario_id', 'is', null);

    if (errorCodigos) throw errorCodigos;

    // Map them together
    const mapUsuarios = new Map<string, UsuarioPasaporte>();

    perfiles.forEach(p => {
      mapUsuarios.set(p.id, {
        id: p.id,
        email: p.email,
        codigos: [],
        rutasCompletadas: 0
      });
    });

    codigos.forEach(c => {
      if (c.usuario_id && mapUsuarios.has(c.usuario_id)) {
        const user = mapUsuarios.get(c.usuario_id)!;
        user.codigos.push(c.codigo);
        user.rutasCompletadas += 1;
      }
    });

    return Array.from(mapUsuarios.values());
  },

  async getAllRutasAdmin(): Promise<RutaAdmin[]> {
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data, error } = await supabase
      .from('rutas')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createRuta(ruta: Omit<RutaAdmin, 'id'>) {
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data, error } = await supabase
      .from('rutas')
      .insert([ruta])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRuta(id: number, ruta: Partial<Omit<RutaAdmin, 'id'>>) {
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data, error } = await supabase
      .from('rutas')
      .update(ruta)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRuta(id: number) {
    if (!supabase) throw new Error("Supabase is not configured.");

    const { error } = await supabase
      .from('rutas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
