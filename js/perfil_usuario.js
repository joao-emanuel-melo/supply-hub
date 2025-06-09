// Inicialização do Supabase
const supabaseUrl = 'https://fvzvspqvcxwlwfctmtdt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2enZzcHF2Y3h3bHdmY3RtdGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzM3NDcsImV4cCI6MjA2NTAwOTc0N30.cDyPMw6u5mW7CBjImHfxlV0qmJ1hMtwQ9c0kT-vKibc'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// Elementos do DOM
const perfilForm = document.getElementById('perfilForm');
const senhaForm = document.getElementById('senhaForm');
const btnCancelar = document.getElementById('btnCancelar');

// Função para mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    // Remover notificações existentes
    const notificacoesExistentes = document.querySelectorAll('.notificacao');
    notificacoesExistentes.forEach(notif => notif.remove());

    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        tipo === 'sucesso' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notificacao.textContent = mensagem;

    // Adicionar ao DOM
    document.body.appendChild(notificacao);

    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.remove();
    }, 3000);
}

// Máscaras para os campos
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CNPJ
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
        cnpjInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 14) {
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                e.target.value = value;
            }
        });
    }

    // Máscara para Telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                e.target.value = value;
            }
        });
    }
});

// Carregar dados do perfil
async function carregarPerfil() {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
            console.error('Usuário não autenticado');
            window.location.href = '/index.html';
            return;
        }

        const { data: perfil, error: perfilError } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', user.id)
            .single();

        if (perfilError) throw perfilError;

        // Preencher formulário com dados do perfil
        document.getElementById('nome').value = perfil.nome_completo || '';
        document.getElementById('email').value = perfil.email || '';
        document.getElementById('cnpj').value = perfil.cnpj || '';
        document.getElementById('telefone').value = perfil.telefone || '';

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        mostrarNotificacao('Erro ao carregar dados do perfil. Por favor, tente novamente.', 'erro');
    }
}

// Atualizar perfil
perfilForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Desabilitar botões durante o salvamento
    const submitButton = perfilForm.querySelector('button[type="submit"]');
    const cancelButton = btnCancelar;
    submitButton.disabled = true;
    cancelButton.disabled = true;
    submitButton.textContent = 'Salvando...';

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
            console.error('Usuário não autenticado');
            window.location.href = '/index.html';
            return;
        }

        // Validar campos obrigatórios
        const nome = document.getElementById('nome').value.trim();
        const cnpj = document.getElementById('cnpj').value.replace(/\D/g, '');
        
        if (!nome) {
            throw new Error('O nome é obrigatório');
        }

        if (cnpj && cnpj.length !== 14) {
            throw new Error('CNPJ inválido');
        }

        const formData = {
            nome_completo: nome,
            cnpj: cnpj,
            telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
            data_atualizacao: new Date().toISOString()
        };

        console.log('Dados a serem salvos:', formData);

        const { error: updateError } = await supabase
            .from('perfis')
            .update(formData)
            .eq('id', user.id);

        if (updateError) {
            console.error('Erro na atualização:', updateError);
            throw updateError;
        }

        mostrarNotificacao('Perfil atualizado com sucesso!');
        
        // Recarregar a página após 1 segundo
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        mostrarNotificacao(error.message || 'Erro ao atualizar perfil. Por favor, tente novamente.', 'erro');
        
        // Reabilitar botões em caso de erro
        submitButton.disabled = false;
        cancelButton.disabled = false;
        submitButton.textContent = 'Salvar Alterações';
    }
});

// Alterar senha
senhaForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Desabilitar botão durante o processo
    const submitButton = senhaForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Alterando...';

    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    try {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            throw new Error('Todos os campos são obrigatórios');
        }

        if (novaSenha !== confirmarSenha) {
            throw new Error('As senhas não coincidem');
        }

        if (novaSenha.length < 6) {
            throw new Error('A nova senha deve ter pelo menos 6 caracteres');
        }

        const { error } = await supabase.auth.updateUser({
            password: novaSenha
        });

        if (error) {
            console.error('Erro ao atualizar senha:', error);
            throw error;
        }

        mostrarNotificacao('Senha alterada com sucesso!');
        senhaForm.reset();

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        mostrarNotificacao(error.message || 'Erro ao alterar senha. Por favor, tente novamente.', 'erro');
    } finally {
        // Reabilitar botão
        submitButton.disabled = false;
        submitButton.textContent = 'Alterar Senha';
    }
});

// Botão cancelar
btnCancelar.addEventListener('click', () => {
    window.location.reload();
});

// Carregar perfil quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarPerfil); 