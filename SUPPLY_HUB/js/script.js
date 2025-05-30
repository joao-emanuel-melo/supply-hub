// js/script.js
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const mainContent = document.getElementById('mainContent');
    // const sidebarTexts = sidebar.querySelectorAll('.sidebar-text'); // Alternativa: Usar classes CSS

    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    // Função para atualizar a visibilidade do texto do sidebar e classes do mainContent
    function toggleSidebarState(expand) {
        if (expand) {
            sidebar.classList.remove('sidebar-collapsed');
            sidebar.classList.add('sidebar-expanded');
            mainContent.classList.remove('main-content-normal');
            mainContent.classList.add('main-content-shifted');
            toggleSidebarBtn.setAttribute('aria-expanded', 'true');
            // Se estiver usando a abordagem de classes CSS para textos, não precisa do loop abaixo
            // sidebarTexts.forEach(text => text.style.display = 'inline');
        } else {
            sidebar.classList.remove('sidebar-expanded');
            sidebar.classList.add('sidebar-collapsed');
            mainContent.classList.remove('main-content-shifted');
            mainContent.classList.add('main-content-normal');
            toggleSidebarBtn.setAttribute('aria-expanded', 'false');
            // Se estiver usando a abordagem de classes CSS para textos, não precisa do loop abaixo
            // sidebarTexts.forEach(text => text.style.display = 'none');
        }
    }

    // Toggle sidebar
    if (toggleSidebarBtn && sidebar && mainContent) {
        toggleSidebarBtn.addEventListener('click', function() {
            const isCurrentlyExpanded = sidebar.classList.contains('sidebar-expanded');
            toggleSidebarState(!isCurrentlyExpanded);
        });
    }
    
    // Toggle view (grid/list)
    if (gridViewBtn && listViewBtn && gridView && listView) {
        gridViewBtn.addEventListener('click', function() {
            gridView.classList.remove('hidden');
            listView.classList.add('hidden');
            
            gridViewBtn.classList.remove('bg-gray-200', 'text-gray-600');
            gridViewBtn.classList.add('bg-primary', 'text-white');
            gridViewBtn.setAttribute('aria-pressed', 'true');
            
            listViewBtn.classList.remove('bg-primary', 'text-white');
            listViewBtn.classList.add('bg-gray-200', 'text-gray-600');
            listViewBtn.setAttribute('aria-pressed', 'false');
        });
        
        listViewBtn.addEventListener('click', function() {
            gridView.classList.add('hidden');
            listView.classList.remove('hidden');

            listViewBtn.classList.remove('bg-gray-200', 'text-gray-600');
            listViewBtn.classList.add('bg-primary', 'text-white');
            listViewBtn.setAttribute('aria-pressed', 'true');

            gridViewBtn.classList.remove('bg-primary', 'text-white');
            gridViewBtn.classList.add('bg-gray-200', 'text-gray-600');
            gridViewBtn.setAttribute('aria-pressed', 'false');
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Initial sidebar state setup (exemplo: expandido por padrão)
    // Se você tiver uma lógica para lembrar o estado (localStorage) ou baseada no tamanho da tela, ela entraria aqui.
    if (sidebar && mainContent && toggleSidebarBtn) {
        const initialSidebarExpanded = sidebar.classList.contains('sidebar-expanded'); // Verifica a classe inicial
        if(initialSidebarExpanded) {
             mainContent.classList.add('main-content-shifted');
             mainContent.classList.remove('main-content-normal');
             toggleSidebarBtn.setAttribute('aria-expanded', 'true');
        } else { // Se começar colapsado (se você mudar a classe padrão no HTML)
             mainContent.classList.add('main-content-normal');
             mainContent.classList.remove('main-content-shifted');
             toggleSidebarBtn.setAttribute('aria-expanded', 'false');
        }
        // A visibilidade do texto agora é controlada pelas classes .sidebar-collapsed/.sidebar-expanded no CSS
    }
});