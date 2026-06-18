import { authModel } from '../models/authModel.js';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    try {
        const usuario = await authModel.login(email, password);
        localStorage.setItem('usuario_emergencias', JSON.stringify(usuario));
        window.location.href = 'dashboard.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.color = '#e74c3c';
    }
});