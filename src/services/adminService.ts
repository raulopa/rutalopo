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
  codigo_prefijo?: string | null;
}

export interface CodigoAdmin {
  id?: number;
  codigo: string;
  ruta_id: number;
  usuario_id: string;
  canjeado_el: string | null;
  ruta_nombre?: string;
  usuario_email?: string;
}

export interface PedidoCamiseta {
  id?: string;
  usuario_id: string | null;
  email_contacto: string;
  telefono_contacto: string;
  talla: string;
  fecha_pedido?: string;
  estado?: string;
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
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true });

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
  },

  async getCodigosPegatinas(): Promise<CodigoAdmin[]> {
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data: codigos, error: errorCodigos } = await supabase
      .from('codigos_pegatinas')
      .select('id, codigo, ruta_id, usuario_id, canjeado_el')
      .order('id', { ascending: false });

    if (errorCodigos) throw errorCodigos;

    const { data: rutas } = await supabase.from('rutas').select('id, nombre');
    const { data: perfiles } = await supabase.from('perfiles').select('id, email');

    const rutasMap = new Map((rutas || []).map(r => [r.id, r.nombre]));
    const perfilesMap = new Map((perfiles || []).map(p => [p.id, p.email]));

    return codigos.map(c => ({
      ...c,
      ruta_nombre: rutasMap.get(c.ruta_id) || 'Ruta desconocida',
      usuario_email: perfilesMap.get(c.usuario_id) || 'Usuario desconocido'
    }));
  },

  async createPedidoCamiseta(pedido: PedidoCamiseta) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from('pedidos_camiseta')
      .insert([pedido]);
      
    if (error) throw error;
    return data;
  },

  async getPedidosCamiseta(): Promise<PedidoCamiseta[]> {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from('pedidos_camiseta')
      .select('*')
      .order('fecha_pedido', { ascending: false });
    if (error) throw error;
    return data || [];
  }
};

