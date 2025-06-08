document.addEventListener('DOMContentLoaded', function() {
    // Formulários e Links de alternância
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');

    // Elementos do formulário de login
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const generalError = document.getElementById('generalError');

    // --- LÓGICA PARA ALTERNAR OS FORMULÁRIOS ---
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }
    
    // --- LÓGICA DE VALIDAÇÃO ---
    
    // Validação em tempo real para o formulário de login
    emailInput.addEventListener('input', () => validateEmail(emailInput, emailError));
    passwordInput.addEventListener('input', () => validatePassword(passwordInput, passwordError));

    // Validação do formulário de LOGIN no envio
    // No seu arquivo /js/script-login.js

loginForm.addEventListener('submit', function(e) {
    // 1. Garante que o formulário não recarregue a página
    e.preventDefault(); 
    
    console.log("Botão 'Entrar' clicado, validação iniciada."); // LOG 1

    const isEmailValid = validateEmail(emailInput, emailError);
    const isPasswordValid = validatePassword(passwordInput, passwordError);

    console.log("E-mail é válido?", isEmailValid); // LOG 2
    console.log("Senha é válida?", isPasswordValid); // LOG 3

    if (isEmailValid && isPasswordValid) {
        console.log("Validação bem-sucedida! Redirecionando..."); // LOG 4
        
        // 2. Corrija o caminho para ser mais explícito
        window.location.href = "./home.html"; 
    } else {
        console.log("Falha na validação. O redirecionamento não ocorrerá."); // LOG 5
    }
});

    // Validação do formulário de CADASTRO no envio
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Adicione aqui a lógica de validação para os campos de cadastro
        // Ex: const isNameValid = validateName(...);
        alert('Formulário de cadastro enviado!');
    });
    
    // --- FUNÇÕES DE VALIDAÇÃO ---
    function validateEmail(inputElement, errorElement) {
        const email = inputElement.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showError(errorElement, 'E-mail é obrigatório');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(errorElement, 'Digite um e-mail válido');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validatePassword(inputElement, errorElement) {
        const password = inputElement.value;
        
        if (password === '') {
            showError(errorElement, 'Senha é obrigatória');
            return false;
        } else if (password.length < 6) {
            showError(errorElement, 'A senha deve ter pelo menos 6 caracteres');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }
    
    function hideError(element) {
        element.textContent = '';
        element.classList.remove('show');
    }
});