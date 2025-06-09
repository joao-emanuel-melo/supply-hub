const SUPABASE_URL = 'https://fvzvspqvcxwlwfctmtdt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2enZzcHF2Y3h3bHdmY3RtdGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzM3NDcsImV4cCI6MjA2NTAwOTc0N30.cDyPMw6u5mW7CBjImHfxlV0qmJ1hMtwQ9c0kT-vKibc';

// Verifica se as credenciais foram inseridas
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Erro: As credenciais do Supabase (URL e Key) não foram definidas.");
    alert("Erro de configuração. Verifique o console para mais detalhes.");
}

// Inicializa o cliente Supabase
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- SELEÇÃO DOS ELEMENTOS DO HTML ---
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');
const showRegisterLink = document.querySelector('#showRegisterLink');
const showLoginLink = document.querySelector('#showLoginLink');
const generalErrorDiv = document.querySelector('#generalError');

// --- ALTERNÂNCIA ENTRE FORMULÁRIOS ---
// Mostra o formulário de cadastro
showRegisterLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

// Mostra o formulário de login
showLoginLink.addEventListener('click', (event) => {
    event.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// --- AUTENTICAÇÃO DE USUÁRIO ---
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#password').value;

    try {
        console.log('Tentando fazer login com:', email);
        
        // Primeiro tenta fazer login com as credenciais
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        if (error) {
            console.error('Erro de autenticação:', error);
            throw new Error(error.message || 'Credenciais inválidas');
        }

        if (!data || !data.user) {
            console.error('Dados de usuário não encontrados');
            throw new Error('Erro ao autenticar usuário');
        }

        console.log('Login bem-sucedido, dados:', data);

        // Login realizado com sucesso
        alert('Login realizado com sucesso!');
        window.location.href = '/home.html';

        const { data: dadosPerfil, error: erroPerfil } = await _supabase
            .from('perfis')
            .select('*')
            .eq('id', data.user.id)
            .single();


    } catch (erro) {
        console.error('Erro detalhado no login:', erro);
        generalErrorDiv.textContent = erro.message;
        generalErrorDiv.classList.remove('hidden');
    }
});

// --- CADASTRO DE NOVO USUÁRIO ---
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeEmpresa = document.querySelector('#registerCompany').value;
    const cnpj = document.querySelector('#registerCnpj').value;
    const email = document.querySelector('#registerEmail').value;
    const senha = document.querySelector('#registerPassword').value;
    const confirmarSenha = document.querySelector('#registerPasswordConfirm').value;

    try {
        // Verifica se as senhas coincidem
        if (senha !== confirmarSenha) {
            throw new Error('As senhas não coincidem');
        }

        // Verifica se o email já está cadastrado
        const { data: usuarioExistente, error: erroVerificacao } = await _supabase
            .from('perfis')
            .select('email')
            .eq('email', email)
            .single();

        if (usuarioExistente) {
            throw new Error('Este e-mail já está cadastrado');
        }

        // Cadastra o usuário no sistema de autenticação
        const { data: dadosAuth, error: erroAuth } = await _supabase.auth.signUp({
            email: email,
            password: senha,
        });

        if (erroAuth) {
            throw new Error(erroAuth.message);
        }

        // Salva os dados do perfil no banco
        const { error: erroPerfil } = await _supabase
            .from('perfis')
            .insert([
                {
                    id: dadosAuth.user.id,
                    nome_completo: nomeEmpresa,
                    email: email,
                    data_criacao: new Date().toISOString(),
                    data_atualizacao: new Date().toISOString()
                },
            ]);

        if (erroPerfil) {
            throw new Error('Erro ao salvar o perfil: ' + erroPerfil.message);
        }

        // Cadastro concluído com sucesso
        alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');

    } catch (erro) {
        console.error('Erro no cadastro:', erro.message);
        alert('Erro no cadastro: ' + erro.message);
    }
});

// Máscaras para os campos
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CPF
    const cpfInput = document.getElementById('registerCpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            }
        });
    }

    // Máscara para CNPJ
    const cnpjInput = document.getElementById('registerCnpj');
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
    const phoneInput = document.getElementById('registerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                e.target.value = value;
            }
        });
    }

    // Máscara para Inscrição Estadual
    const ieInput = document.getElementById('registerIe');
    if (ieInput) {
        ieInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 12) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4');
                e.target.value = value;
            }
        });
    }

    // Máscara para Inscrição Municipal
    const imInput = document.getElementById('registerIm');
    if (imInput) {
        imInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = value;
            }
        });
    }
});

// Validação do formulário de registro
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validar senhas
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (password !== passwordConfirm) {
        alert('As senhas não coincidem!');
        return;
    }

    const formData = {
        nome: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        cpf: document.getElementById('registerCpf').value.replace(/\D/g, ''),
        telefone: document.getElementById('registerPhone').value.replace(/\D/g, ''),
        nome_empresa: document.getElementById('registerCompany').value,
        cnpj: document.getElementById('registerCnpj').value.replace(/\D/g, ''),
        inscricao_estadual: document.getElementById('registerIe').value.replace(/\D/g, ''),
        inscricao_municipal: document.getElementById('registerIm').value.replace(/\D/g, ''),
        endereco: document.getElementById('registerAddress').value,
        site: document.getElementById('registerSite').value,
        senha: password
    };

    try {
        // Criar usuário no Supabase
        const { data: authData, error: authError } = await _supabase.auth.signUp({
            email: formData.email,
            password: formData.senha,
            options: {
                data: {
                    nome: formData.nome,
                    cpf: formData.cpf,
                    telefone: formData.telefone
                }
            }
        });

        if (authError) throw authError;

        // Criar perfil do fornecedor
        const { data: fornecedorData, error: fornecedorError } = await _supabase
            .from('fornecedores')
            .insert([
                {
                    nome: formData.nome_empresa,
                    cnpj: formData.cnpj,
                    inscricao_estadual: formData.inscricao_estadual,
                    inscricao_municipal: formData.inscricao_municipal,
                    endereco: formData.endereco,
                    site: formData.site,
                    telefone: formData.telefone,
                    email: formData.email,
                    usuario_id: authData.user.id
                }
            ]);

        if (fornecedorError) throw fornecedorError;

        alert('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
        document.getElementById('showLoginLink').click();
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao realizar cadastro. Por favor, tente novamente.');
    }
});

// Validação do formulário de login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        window.location.href = 'home.html';
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
});