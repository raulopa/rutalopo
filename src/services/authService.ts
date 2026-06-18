import { supabase } from './supabaseClient';

export const authService = {
  async registerUser(email: string, password: string) {
    if (!supabase) throw new Error("Supabase is not configured.");
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  async loginUser(email: string, password: string) {
    if (!supabase) throw new Error("Supabase is not configured.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async getCurrentUser() {
    if (!supabase) return null;
    
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async logoutUser() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }
};
