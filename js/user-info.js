// Inicialização do Supabase
const supabaseUrl = 'https://fvzvspqvcxwlwfctmtdt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2enZzcHF2Y3h3bHdmY3RtdGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzM3NDcsImV4cCI6MjA2NTAwOTc0N30.cDyPMw6u5mW7CBjImHfxlV0qmJ1hMtwQ9c0kT-vKibc'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// Função para obter as iniciais do nome
function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Função para atualizar as informações do usuário no menu lateral
async function atualizarInfoUsuario() {
    try {
        // Obter o usuário atual
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) {
            console.error('Usuário não autenticado');
            window.location.href = '/index.html';
            return;
        }

        // Buscar informações do perfil
        const { data: perfil, error: perfilError } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', user.id)
            .single();

        if (perfilError) throw perfilError;

        // Atualizar elementos do menu lateral usando IDs
        const userInitials = document.getElementById('userInitials');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');

        if (userInitials) {
            userInitials.textContent = getInitials(perfil.nome_completo);
        }

        if (userName) {
            userName.textContent = perfil.nome_completo;
        }

        if (userRole) {
            userRole.textContent = 'Produtor'; // Você pode ajustar isso baseado no tipo de usuário
        }

        console.log('Informações do usuário atualizadas com sucesso:', perfil);

    } catch (error) {
        console.error('Erro ao atualizar informações do usuário:', error);
    }
}

// Atualizar informações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', atualizarInfoUsuario); 