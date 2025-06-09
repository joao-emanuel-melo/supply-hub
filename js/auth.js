const SUPABASE_URL = 'https://rqwxplbqeltiujgvhvsf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxd3hwbGJxZWx0aXVqZ3ZodnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDkwNTcsImV4cCI6MjA2NDk4NTA1N30.X3kPH27jJBiK7S8JWqlI_530dN24q2auDM2hc56OogE';

// Verifica se as credenciais foram inseridas
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Erro: As credenciais do Supabase (URL e Key) não foram definidas.");
    alert("Erro de configuração. Verifique o console para mais detalhes.");
}

// Inicializa o cliente Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// --- PASSO 2: SELEÇÃO DOS ELEMENTOS DO HTML ---
// Selecionamos todos os formulários, links e campos que vamos usar.
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');

const showRegisterLink = document.querySelector('#showRegisterLink');
const showLoginLink = document.querySelector('#showLoginLink');

// Mensagem de erro geral para o formulário de login
const generalErrorDiv = document.querySelector('#generalError');


// --- PASSO 3: LÓGICA PARA ALTERNAR ENTRE FORMULÁRIOS ---
// Quando o usuário clica em "Cadastre-se agora"
showRegisterLink.addEventListener('click', (event) => {
    event.preventDefault(); // Impede o link de navegar
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

// Quando o usuário clica em "Faça o login"
showLoginLink.addEventListener('click', (event) => {
    event.preventDefault(); // Impede o link de navegar
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});


// --- PASSO 4: LÓGICA DO FORMULÁRIO DE LOGIN ---
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o formulário de recarregar a página

    // Pega os valores dos campos de login pelo ID
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    // Usa a função de login do Supabase
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Erro no login:', error.message);
        generalErrorDiv.textContent = 'E-mail ou senha inválidos. Tente novamente.';
        generalErrorDiv.classList.remove('hidden');
    } else {
        // Se o login for bem-sucedido, redireciona para o painel
        console.log('Login bem-sucedido:', data);
        alert('Login realizado com sucesso!');
        // Altere '/dashboard.html' para a sua página protegida
        window.location.href = '/dashboard.html';
    }
});


// --- PASSO 5: LÓGICA DO FORMULÁRIO DE CADASTRO ---
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Pega os valores dos campos de cadastro pelo ID
    const name = document.querySelector('#registerName').value;
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;

    // ETAPA A: Cadastra o usuário no sistema de autenticação do Supabase
    const { data: authData, error: authError } = await _supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        console.error('Erro no cadastro (Auth):', authError.message);
        alert('Erro no cadastro: ' + authError.message);
        return; // Para a execução se o cadastro falhar
    }

    // Se o cadastro no 'auth' funcionou, vamos salvar os dados extras
    if (authData.user) {
        console.log('Usuário criado no Auth:', authData.user);

        // ETAPA B: Salva o nome completo na sua tabela 'profiles'
        // IMPORTANTE: Você precisa ter criado a tabela 'profiles' no Supabase!
        const { error: profileError } = await _supabase
            .from('profiles') // O nome da sua tabela de perfis
            .insert([
                {
                    id: authData.user.id, // ID do usuário recém-criado (ESSENCIAL)
                    full_name: name,      // Nome completo do formulário
                    // Se você tiver outros campos, como 'username', adicione aqui
                },
            ]);

        if (profileError) {
            console.error('Erro ao salvar o perfil:', profileError.message);
            // Mesmo que o perfil falhe, o usuário foi criado. Avise-o.
            alert('Sua conta foi criada, mas houve um erro ao salvar seu nome. Por favor, contate o suporte.');
        } else {
            console.log('Perfil salvo com sucesso!');
            alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
            // Opcional: Volta para a tela de login
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    }
});