import React, { useState, useEffect } from 'react';
import { adminService, UsuarioPasaporte, RutaAdmin } from '../services/adminService';
import { Users, Map, Plus, Edit2, Trash2, ChevronLeft, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopBanner } from '../components/TopBanner';

type Tab = 'usuarios' | 'rutas';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('usuarios');
  
  // Data states
  const [usuarios, setUsuarios] = useState<UsuarioPasaporte[]>([]);
  const [rutas, setRutas] = useState<RutaAdmin[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Routes form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRuta, setEditingRuta] = useState<RutaAdmin | null>(null);
  const [formData, setFormData] = useState<Partial<RutaAdmin>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (activeTab === 'usuarios') {
      fetchUsuarios();
    } else {
      fetchRutas();
    }
  }, [activeTab]);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsuariosYPasaportes();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRutas = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllRutasAdmin();
      setRutas(data);
    } catch (error) {
      console.error(error);
      showToast('Error al cargar rutas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (ruta?: RutaAdmin) => {
    if (ruta) {
      setEditingRuta(ruta);
      setFormData(ruta);
    } else {
      setEditingRuta(null);
      setFormData({
        nombre: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: '',
        notas: '',
        tipo_ruta: 'Gravel',
        distancia_km: 0,
        desnivel_positivo: 0,
        wikiloc_id: '',
        wikiloc_url: ''
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRuta(null);
    setFormData({});
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingRuta) {
        await adminService.updateRuta(editingRuta.id, formData);
        showToast('Ruta actualizada con éxito', 'success');
      } else {
        await adminService.createRuta(formData as Omit<RutaAdmin, 'id'>);
        showToast('Ruta creada con éxito', 'success');
      }
      handleCloseForm();
      fetchRutas();
    } catch (error) {
      console.error(error);
      showToast('Error al guardar la ruta', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRuta = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta ruta? Se borrarán las conexiones.')) return;
    try {
      await adminService.deleteRuta(id);
      showToast('Ruta eliminada con éxito', 'success');
      fetchRutas();
    } catch (error) {
      console.error(error);
      showToast('Error al eliminar la ruta', 'error');
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.email?.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col font-sans text-black">
      <TopBanner />
      <div className="flex-1 flex">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-white animate-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-brand-green text-brand-forest' : 'bg-brand-purple'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-brand-dark-purple">Admin Panel</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">La Rutalopó</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'usuarios' ? 'bg-brand-dark-purple text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Users className="w-5 h-5" />
            Usuarios & Pass
          </button>
          <button 
            onClick={() => setActiveTab('rutas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'rutas' ? 'bg-brand-dark-purple text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Map className="w-5 h-5" />
            Rutas Wikiloc
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link to="/" className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-brand-dark-purple font-medium transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Volver a la Web
          </Link>
        </div>
      </aside>

      {/* Mobile Nav (Simple) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-40">
        <button onClick={() => setActiveTab('usuarios')} className={`p-3 rounded-full ${activeTab === 'usuarios' ? 'bg-brand-dark-purple text-white' : 'text-gray-500'}`}>
          <Users className="w-6 h-6" />
        </button>
        <button onClick={() => setActiveTab('rutas')} className={`p-3 rounded-full ${activeTab === 'rutas' ? 'bg-brand-dark-purple text-white' : 'text-gray-500'}`}>
          <Map className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto pb-24 md:pb-10">
        {activeTab === 'usuarios' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Usuarios Registrados</h2>
                <p className="text-gray-500 font-medium">Gestiona el progreso del pasaporte de la comunidad.</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <input 
                  type="text" 
                  placeholder="Buscar por email..." 
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                />
                <div className="bg-white px-5 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                  <span className="text-gray-500 font-medium">Total:</span>
                  <span className="text-xl font-bold text-brand-dark-purple">{usuarios.length}</span>
                </div>
              </div>
            </header>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-dark-purple"></div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                        <th className="p-4 pl-6">Usuario (Email)</th>
                        <th className="p-4">Progreso</th>
                        <th className="p-4 pr-6">Pegatinas Canjeadas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 pl-6 font-medium text-gray-900">
                            {u.email || 'Sin Email (ID)'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-brand-dark-purple transition-all duration-1000" 
                                  style={{ width: `${Math.min((u.rutasCompletadas / 6) * 100, 100)}%` }}
                                ></div>
                              </div>
                              <span className="font-bold text-gray-700">{u.rutasCompletadas} / 6</span>
                            </div>
                          </td>
                          <td className="p-4 pr-6">
                            <div className="flex flex-wrap gap-2">
                              {u.codigos.length === 0 ? (
                                <span className="text-gray-400 font-medium text-sm">Ninguna</span>
                              ) : (
                                u.codigos.map(cod => (
                                  <span key={cod} className="px-2.5 py-1 rounded-md bg-brand-dark-purple/10 text-brand-dark-purple font-semibold text-xs border border-brand-dark-purple/20">
                                    {cod}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsuarios.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-gray-500 font-medium">
                            No se encontraron usuarios.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rutas' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Gestor de Rutas</h2>
                <p className="text-gray-500 font-medium">Administra las rutas conectadas con Wikiloc.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="bg-brand-dark-purple hover:bg-brand-purple text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-md"
              >
                <Plus className="w-5 h-5" />
                Añadir Nueva Ruta
              </button>
            </header>

            {isFormOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-2xl font-bold text-brand-dark-purple">
                      {editingRuta ? 'Editar Ruta' : 'Nueva Ruta'}
                    </h3>
                    <button onClick={handleCloseForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nombre de la Ruta</label>
                        <input 
                          type="text" required
                          value={formData.nombre || ''}
                          onChange={e => setFormData({...formData, nombre: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Fecha Límite/Objetivo</label>
                        <input 
                          type="date" required
                          value={formData.fecha || ''}
                          onChange={e => setFormData({...formData, fecha: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Hora</label>
                        <input 
                          type="time"
                          value={formData.hora || ''}
                          onChange={e => setFormData({...formData, hora: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Tipo de Actividad</label>
                        <select
                          value={formData.tipo_ruta || ''}
                          onChange={e => setFormData({...formData, tipo_ruta: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium bg-white"
                        >
                          <option value="Gravel">Gravel</option>
                          <option value="Montaña">Montaña</option>
                          <option value="Carretera">Carretera</option>
                          <option value="Senderismo">Senderismo</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Distancia (km)</label>
                        <input 
                          type="number" step="0.01" required
                          value={formData.distancia_km || ''}
                          onChange={e => setFormData({...formData, distancia_km: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Desnivel Positivo (m)</label>
                        <input 
                          type="number" required
                          value={formData.desnivel_positivo || ''}
                          onChange={e => setFormData({...formData, desnivel_positivo: parseInt(e.target.value, 10)})}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">ID de Wikiloc</label>
                        <input 
                          type="text"
                          value={formData.wikiloc_id || ''}
                          onChange={e => setFormData({...formData, wikiloc_id: e.target.value})}
                          placeholder="ej. 1423456"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">URL de Wikiloc</label>
                        <input 
                          type="url"
                          value={formData.wikiloc_url || ''}
                          onChange={e => setFormData({...formData, wikiloc_url: e.target.value})}
                          placeholder="https://es.wikiloc.com/..."
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-gray-700">Notas / Anotaciones</label>
                        <textarea 
                          value={formData.notas || ''}
                          onChange={e => setFormData({...formData, notas: e.target.value})}
                          placeholder="Información extra o anotaciones detalladas para el cronograma..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-dark-purple focus:border-transparent font-medium resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                      <button 
                        type="button" 
                        onClick={handleCloseForm}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-brand-dark-purple hover:bg-brand-purple text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Guardar
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isLoading && !isFormOpen ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-dark-purple"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rutas.map(ruta => (
                  <div key={ruta.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col group">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-xs font-bold tracking-wider text-gray-600 uppercase">
                          {ruta.tipo_ruta || 'Ruta'}
                        </span>
                        <span className="text-sm font-medium text-gray-400">
                          {ruta.fecha} {ruta.hora && `| ${ruta.hora}`}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                        {ruta.nombre}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-brand-beige p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Distancia</p>
                          <p className="font-black text-brand-dark-purple">{ruta.distancia_km ? `${ruta.distancia_km} km` : '-'}</p>
                        </div>
                        <div className="bg-brand-beige p-3 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Desnivel</p>
                          <p className="font-black text-brand-dark-purple">{ruta.desnivel_positivo ? `+${ruta.desnivel_positivo}m` : '-'}</p>
                        </div>
                      </div>
                      
                      {ruta.wikiloc_url && (
                        <a href={ruta.wikiloc_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-dark-purple hover:underline flex items-center gap-1">
                          <Map className="w-4 h-4" />
                          Ver en Wikiloc
                        </a>
                      )}
                    </div>
                    <div className="border-t border-gray-100 bg-gray-50 p-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenForm(ruta)}
                        className="p-2 text-gray-600 hover:text-brand-dark-purple hover:bg-brand-dark-purple/10 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
                      >
                        <Edit2 className="w-4 h-4" /> Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteRuta(ruta.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                {rutas.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                    <Map className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No hay rutas creadas todavía.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
