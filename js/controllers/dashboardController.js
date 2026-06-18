import { incidenteModel } from '../models/incidenteModel.js';
import { dashboardView } from '../views/dashboardView.js';

const mapaUbicaciones = {
    central: {
        pisos: {
            "Planta Baja": [
                { id: 1, nombre: "Plataforma de Atención" },
                { id: 2, nombre: "Oficina de Sistemas" }
            ],
            "Piso 1": Array.from({ length: 16 }, (_, i) => ({ id: 10 + i, nombre: `Aula ${101 + i}` })),
            "Piso 2": Array.from({ length: 16 }, (_, i) => {
                const nro = 201 + i;
                const esLab = [203, 204, 208].includes(nro);
                return { id: 30 + i, nombre: esLab ? `Laboratorio de Computación ${nro}` : `Aula ${nro}` };
            }),
            "Piso 3": Array.from({ length: 5 }, (_, i) => ({ id: 50 + i, nombre: `Aula ${301 + i}` }))
        }
    },
    salud: {
        pisos: {
            "Único": Array.from({ length: 5 }, (_, i) => ({ id: 60 + i, nombre: `Aula Salud ${i + 1}` }))
        }
    },
    cafeteria: {
        pisos: {
            "Área Común": [{ id: 70, nombre: "Cafetería Principal" }]
        }
    },
    cancha: {
        pisos: {
            "Área Común": [{ id: 80, nombre: "Cancha Deportiva" }]
        }
    }
};

let cacheIncidentes = [];
let usuarioSesion = null;

document.addEventListener('DOMContentLoaded', async () => {
    usuarioSesion = JSON.parse(localStorage.getItem('usuario_emergencias'));
    if (!usuarioSesion) {
        window.location.href = 'index.html';
        return;
    }

    dashboardView.renderUserBadge(usuarioSesion);

    if (usuarioSesion.rol === 'Operador') {
        document.getElementById('panelRegistro')?.classList.remove('hidden');
    }

    await cargarYMostrarIncidentes();

    const selectSector = document.getElementById('selectSector');
    const selectPiso = document.getElementById('selectPiso');
    const selectEspacio = document.getElementById('selectEspacio');
    const grupoPiso = document.getElementById('grupoPiso');
    const grupoEspacio = document.getElementById('grupoEspacio');

    selectSector?.addEventListener('change', (e) => {
        const sectorSel = e.target.value;
        
        selectPiso.innerHTML = '<option value="">-- Seleccione el Piso --</option>';
        selectEspacio.innerHTML = '<option value="">-- Seleccione la Ubicación --</option>';
        grupoPiso.classList.add('hidden');
        grupoEspacio.classList.add('hidden');

        if (sectorSel && mapaUbicaciones[sectorSel]) {
            const pisosDisponibles = Object.keys(mapaUbicaciones[sectorSel].pisos);
            
            pisosDisponibles.forEach(piso => {
                const opt = document.createElement('option');
                opt.value = piso;
                opt.textContent = piso;
                selectPiso.appendChild(opt);
            });
            
            grupoPiso.classList.remove('hidden');
        }
    });

    selectPiso?.addEventListener('change', (e) => {
        const sectorSel = selectSector.value;
        const pisoSel = e.target.value;

        selectEspacio.innerHTML = '<option value="">-- Seleccione la Ubicación --</option>';
        grupoEspacio.classList.add('hidden');

        if (pisoSel && mapaUbicaciones[sectorSel].pisos[pisoSel]) {
            const espacios = mapaUbicaciones[sectorSel].pisos[pisoSel];
            
            espacios.forEach(esp => {
                const opt = document.createElement('option');
                opt.value = esp.id;
                opt.textContent = esp.nombre;
                selectEspacio.appendChild(opt);
            });
            
            grupoEspacio.classList.remove('hidden');
        }
    });

    document.getElementById('filtroEstado')?.addEventListener('change', (e) => {
        const filtro = e.target.value;
        const incidentesFiltrados = filtro === 'Todos' 
            ? cacheIncidentes 
            : cacheIncidentes.filter(i => i.estado === filtro);
        
        dashboardView.renderTabla(incidentesFiltrados, usuarioSesion.rol === 'Coordinador', ejecutarCambioEstado);
    });

    document.getElementById('incidenteForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nuevoIncidente = {
            titulo: document.getElementById('titulo').value.trim(),
            tipo_emergencia: document.getElementById('tipoEmergencia').value,
            espacio_id: parseInt(document.getElementById('selectEspacio').value),
            descripcion: document.getElementById('descripcion').value.trim(),
            usuario_id: usuarioSesion.id,
            estado: 'Pendiente'
        };

        try {
            await incidenteModel.crear(nuevoIncidente);
            document.getElementById('incidenteForm').reset();
            
            document.getElementById('selectPiso').innerHTML = '<option value="">-- Seleccione el Piso --</option>';
            document.getElementById('selectEspacio').innerHTML = '<option value="">-- Seleccione la Ubicación --</option>';
            document.getElementById('grupoPiso').classList.add('hidden');
            document.getElementById('grupoEspacio').classList.add('hidden');

            await cargarYMostrarIncidentes();
            alert('¡Incidente reportado con éxito!');
        } catch (error) {
            alert('Error al registrar incidente: ' + error.message);
        }
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('usuario_emergencias');
        window.location.href = 'index.html';
    });
});

async function cargarYMostrarIncidentes() {
    try {
        cacheIncidentes = await incidenteModel.obtenerTodos();
        dashboardView.renderTabla(cacheIncidentes, usuarioSesion.rol === 'Coordinador', ejecutarCambioEstado);
    } catch (error) {
        console.error('Error cargando incidentes:', error);
    }
}

async function ejecutarCambioEstado(id, nuevoEstado) {
    try {
        await incidenteModel.actualizarEstado(id, nuevoEstado);
        await cargarYMostrarIncidentes();
    } catch (error) {
        alert('Error al actualizar estado: ' + error.message);
    }
}