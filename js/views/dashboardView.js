export const dashboardView = {
    renderUserBadge(usuario) {
        const badge = document.getElementById('userBadge');
        if (badge) badge.textContent = `${usuario.nombre} (${usuario.rol})`;
    },

    renderTabla(incidentes, esCoordinador, onCambioEstado) {
        const tbody = document.getElementById('listaIncidentes');
        tbody.innerHTML = '';

        if (incidentes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay incidentes registrados.</td></tr>`;
            return;
        }

        incidentes.forEach(inc => {
            const tr = document.createElement('tr');
            

            let accionesHTML = `<span class="text-muted">Sin permisos</span>`;
            if (esCoordinador) {
                accionesHTML = `
                    <select class="cambiar-estado-sel" data-id="${inc.id}">
                        <option value="Pendiente" ${inc.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="En proceso" ${inc.estado === 'En proceso' ? 'selected' : ''}>En proceso</option>
                        <option value="Resuelto" ${inc.estado === 'Resuelto' ? 'selected' : ''}>Resuelto</option>
                    </select>
                `;
            }

            tr.innerHTML = `
                <td>${inc.id}</td>
                <td><span class="badge-status ${inc.estado.replace(' ', '')}">${inc.tipo_emergencia}</span></td>
                <td><strong>${inc.titulo}</strong><br><small>${inc.descripcion}</small></td>
                <td>Espacio #${inc.espacio_id}</td>
                <td>${new Date(inc.fecha_hora).toLocaleString()}</td>
                <td><span class="badge-status ${inc.estado.replace(' ', '')}">${inc.estado}</span></td>
                <td>${accionesHTML}</td>
            `;
            tbody.appendChild(tr);
        });


        if (esCoordinador) {
            document.querySelectorAll('.cambiar-estado-sel').forEach(select => {
                select.addEventListener('change', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const nuevoEstado = e.target.value;
                    onCambioEstado(id, nuevoEstado);
                });
            });
        }
    }
};