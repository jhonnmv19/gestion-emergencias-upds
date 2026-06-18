import { client } from '../config/supabase.js';

export const incidenteModel = {
    async obtenerTodos() {
        const { data, error } = await client
            .from('incidentes_upds')
            .select('*')
            .order('fecha_hora', { ascending: false });
        if (error) throw error;
        return data;
    },

    async crear(incidente) {
        const { data, error } = await client
            .from('incidentes_upds')
            .insert([incidente]);
        if (error) throw error;
        return data;
    },

    async actualizarEstado(id, nuevoEstado) {
        const { data, error } = await client
            .from('incidentes_upds')
            .update({ estado: nuevoEstado, updated_at: new Date() })
            .eq('id', id);
        if (error) throw error;
        return data;
    }
};