import { client } from '../config/supabase.js';

export const authModel = {
    async login(email, password) {
        const { data, error } = await client
            .from('usuarios_upds')
            .select(`
                id, nombre, email, password,
                roles_upds ( nombre )
            `)
            .eq('email', email)
            .single();

        if (error || !data) throw new Error('Credenciales inválidas');
        if (data.password !== password) throw new Error('Contraseña incorrecta');

        return {
            id: data.id,
            nombre: data.nombre,
            rol: data.roles_upds.nombre
        };
    }
};