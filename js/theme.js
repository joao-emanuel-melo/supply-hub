// Função para alternar o modo noturno
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    updateDarkModeButton(isDark);
}

// Função para atualizar o estado do botão de modo noturno
function updateDarkModeButton(isDark) {
    const button = document.getElementById('toggleDarkMode');
    if (!button) return;
    
    if (isDark) {
        button.classList.add('bg-primary');
        button.classList.remove('bg-gray-200');
    } else {
        button.classList.remove('bg-primary');
        button.classList.add('bg-gray-200');
    }
}

// Função para carregar preferências salvas
function loadPreferences() {
    // Carregar modo noturno
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.documentElement.classList.add('dark');
        updateDarkModeButton(true);
    }

    // Carregar idioma
    const language = localStorage.getItem('language') || 'pt-BR';
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = language;
    }
}

// Função para salvar idioma
function saveLanguage(language) {
    localStorage.setItem('language', language);
    // Aqui você pode adicionar a lógica para traduzir o site
    alert('Idioma alterado com sucesso! A página será recarregada.');
    window.location.reload();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();

    // Modo noturno
    const darkModeButton = document.getElementById('toggleDarkMode');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', toggleDarkMode);
    }

    // Idioma
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            saveLanguage(e.target.value);
        });
    }
}); 