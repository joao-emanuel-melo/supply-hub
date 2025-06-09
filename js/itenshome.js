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

document.addEventListener('DOMContentLoaded', function() {
        // --- LÓGICA CORRIGIDA ---

        // 1. Pega o caminho da página atual, ex: "/pasta/meus_produtos-produtor.html"
        const fullPath = window.location.pathname;

        // 2. Extrai apenas o nome do arquivo da URL. Ex: "meus_produtos-produtor.html"
        // Se o caminho for apenas "/", como na página inicial, o resultado será "" (vazio).
        let currentPage = fullPath.split('/').pop();

        // Se a página for a inicial (ex: "meusite.com/"), currentPage será vazio.
        // Nesse caso, definimos como "index.html" para corresponder ao link "Início".
        if (currentPage === '') {
            currentPage = 'index.html';
        }

        // 3. Define as classes de estilo para o link ativo e inativo
        const activeClasses = ['bg-primary', 'text-white'];
        const inactiveClasses = ['text-gray-300', 'hover:bg-gray-700', 'hover:text-white'];

        // 4. Seleciona todos os links da navegação
        const navLinks = document.querySelectorAll('nav[aria-label="Navegação principal"] a');

        // 5. Itera sobre cada link para verificar se ele é o link da página atual
        navLinks.forEach(link => {
            // Pega o valor exato do atributo href, ex: "meus_produtos-produtor.html"
            const linkHref = link.getAttribute('href');

            // Ignora links que não levam a lugar algum (ex: href="#" ou href vazio)
            if (!linkHref || linkHref === '#') {
                return; // Pula para o próximo link
            }
            
            // Compara o nome do arquivo da página atual com o nome do arquivo do link
            if (linkHref === currentPage) {
                // Se for o link da página atual:
                link.classList.add(...activeClasses);
                link.classList.remove(...inactiveClasses);
                link.setAttribute('aria-current', 'page');
            }
        });
});

// Seleciona o formulário de filtro
    const filterForm = document.querySelector('form');

    // Executa a função de filtro quando o formulário for enviado (botão "Filtrar" clicado)
    filterForm.addEventListener('submit', function(event) {
        // Impede que a página recarregue, que é o comportamento padrão do formulário
        event.preventDefault();

        // 1. Pega os valores selecionados nos filtros
        const selectedCategory = document.getElementById('filter-category').value;
        const selectedLocation = document.getElementById('filter-location').value;
        const selectedCertification = document.getElementById('filter-certification').value;
        
        // 2. Seleciona todos os cards de produto
        const productCards = document.querySelectorAll('.product-card');

        // 3. Itera sobre cada card para decidir se ele deve ser mostrado ou escondido
        productCards.forEach(card => {
            // Pega os dados do card a partir dos atributos data-*
            const cardCategory = card.dataset.category;
            const cardLocation = card.dataset.location;
            const cardCertification = card.dataset.certification;

            // Variável para controlar a visibilidade. Começa como verdadeiro.
            let shouldShow = true;

            // Verifica a categoria
            // Se uma categoria específica foi escolhida E ela é diferente da categoria do card, não mostre.
            if (selectedCategory !== 'Todas as categorias' && selectedCategory !== cardCategory) {
                shouldShow = false;
            }

            // Verifica a localização
            if (selectedLocation !== 'Todas as localizações' && selectedLocation !== cardLocation) {
                shouldShow = false;
            }

            // Verifica a certificação
            if (selectedCertification !== 'Todas as certificações' && selectedCertification !== cardCertification) {
                shouldShow = false;
            }

            // 4. Aplica o resultado: mostra ou esconde o card
            if (shouldShow) {
                card.classList.remove('hidden'); // 'hidden' é uma classe do Tailwind que aplica 'display: none;'
            } else {
                card.classList.add('hidden');
            }
        });
});

// Inicialização do Supabase
const supabaseUrl = 'https://fvzvspqvcxwlwfctmtdt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2enZzcHF2Y3h3bHdmY3RtdGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzM3NDcsImV4cCI6MjA2NTAwOTc0N30.cDyPMw6u5mW7CBjImHfxlV0qmJ1hMtwQ9c0kT-vKibc'
const supabase = supabase.createClient(supabaseUrl, supabaseKey)

// Função para carregar produtos
async function carregarProdutos() {
    try {
        const { data: listadeProdutos, error: errolistaProdutos } = await supabase
            .from('produtos')
            .select('*')

        if (errolistaProdutos) {
            alert('Erro ao carregar produtos:', errolistaProdutos)
            return
        }

        const listaProdutos = document.getElementById('lista-de-produtos')
        if (!listaProdutos) return

        const produtoHtml = listadeProdutos.map(produto => `
            <article class="product-card bg-white rounded-lg shadow overflow-hidden" 
                     data-category="${produto.categoria || ''}" 
                     data-location="${produto.localizacao || ''}" 
                     data-certification="${produto.certificacao || ''}">
                <div class="h-48 bg-gray-200 relative">
                    <div class="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs font-bold">
                        ${produto.nome}
                    </div>
                    <img src="${produto.imagem || '/imgs/tecido-organico.jpg'}" alt="${produto.nome}" class="absolute inset-0 w-full h-full object-cover">
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-dark">${produto.nome}</h4>
                        <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">${produto.categoria || 'Orgânico'}</span>
                    </div>
                    <p class="text-gray-600 text-sm mt-1">${produto.descricao || ''}</p>
                    <div class="mt-3 flex items-center">
                        <span class="text-primary font-bold">R$ ${produto.preco || '45,00'}</span>
                        <span class="text-xs text-gray-500 ml-1">/metro</span>
                    </div>
                    <div class="mt-3 flex items-center text-sm text-gray-500">
                        <i class="fas fa-map-marker-alt mr-1" aria-hidden="true"></i>
                        <span>${produto.localizacao || 'São Paulo, SP'}</span>
                    </div>
                    <div class="mt-4 flex justify-between">
                        <a href="produto.html?id=${produto.id}">
                            <button class="bg-primary text-white px-3 py-1 rounded-md hover:bg-orange-600 transition-colors text-sm">Ver detalhes</button>
                        </a>
                        <button class="border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white transition-colors text-sm">
                            <i class="fas fa-shopping-cart mr-1" aria-hidden="true"></i> Adicionar
                        </button>
                    </div>
                </div>
            </article>
        `).join('')

        listaProdutos.innerHTML = produtoHtml
    } catch (error) {
        console.error('Erro ao carregar produtos:', error)
    }
}

// Carregar produtos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', carregarProdutos)