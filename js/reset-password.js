const SUPABASE_URL = 'https://fvzvspqvcxwlwfctmtdt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2enZzcHF2Y3h3bHdmY3RtdGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzM3NDcsImV4cCI6MjA2NTAwOTc0N30.cDyPMw6u5mW7CBjImHfxlV0qmJ1hMtwQ9c0kT-vKibc';

// Inicializa o cliente Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Elementos do DOM
const resetPasswordRequestForm = document.querySelector('#resetPasswordRequestForm');
const newPasswordForm = document.querySelector('#newPasswordForm');
const generalErrorDiv = document.querySelector('#generalError');

// Verifica se há um hash na URL (indicando que o usuário clicou no link de redefinição)
const hash = window.location.hash;
if (hash) {
    resetPasswordRequestForm.classList.add('hidden');
    newPasswordForm.classList.remove('hidden');
}

// Função para enviar o email de redefinição de senha
resetPasswordRequestForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;

    try {
        const { error } = await _supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password.html`,
        });

        if (error) throw error;

        alert('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
        generalErrorDiv.textContent = '';
        generalErrorDiv.classList.add('hidden');

    } catch (error) {
        console.error('Erro ao enviar email de redefinição:', error);
        generalErrorDiv.textContent = 'Erro ao enviar email de redefinição. Tente novamente.';
        generalErrorDiv.classList.remove('hidden');
    }
});

// Função para definir a nova senha
newPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newPassword = document.querySelector('#newPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (newPassword !== confirmPassword) {
        generalErrorDiv.textContent = 'As senhas não coincidem.';
        generalErrorDiv.classList.remove('hidden');
        return;
    }

    try {
        const { error } = await _supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        alert('Senha atualizada com sucesso!');
        window.location.href = '/index.html';

    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        generalErrorDiv.textContent = 'Erro ao atualizar senha. Tente novamente.';
        generalErrorDiv.classList.remove('hidden');
    }
}); 