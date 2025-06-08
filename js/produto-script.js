// js/produto-script.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Carrossel de Imagens do Produto ---
    const productCarousel = document.getElementById('productImageCarousel');
    const carouselItems = productCarousel ? productCarousel.querySelectorAll('.carousel-item') : [];
    const productCarouselDotsContainer = document.getElementById('productCarouselDots');
    let currentProductSlide = 0;
    const totalProductSlides = carouselItems.length;

    function updateProductCarousel() {
        if (!productCarousel || totalProductSlides === 0) return;
        productCarousel.style.transform = `translateX(-${currentProductSlide * 100}%)`;
        
        // Atualizar dots
        if (productCarouselDotsContainer) {
            const dots = productCarouselDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentProductSlide);
            });
        }
    }

    function createCarouselDots() {
        if (!productCarouselDotsContainer || totalProductSlides === 0) return;
        productCarouselDotsContainer.innerHTML = ''; // Limpa dots existentes
        for (let i = 0; i < totalProductSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentProductSlide) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => goToProductSlide(i));
            productCarouselDotsContainer.appendChild(dot);
        }
    }

    function moveProductCarousel(direction) {
        if (totalProductSlides === 0) return;
        currentProductSlide = (currentProductSlide + direction + totalProductSlides) % totalProductSlides;
        updateProductCarousel();
    }

    function goToProductSlide(slideIndex) {
        if (totalProductSlides === 0) return;
        currentProductSlide = slideIndex;
        updateProductCarousel();
    }

    // Event listeners para botões do carrossel
    const prevButton = document.querySelector('.carousel-nav.prev');
    const nextButton = document.querySelector('.carousel-nav.next');

    if (prevButton) {
        prevButton.addEventListener('click', () => moveProductCarousel(-1));
    }
    if (nextButton) {
        nextButton.addEventListener('click', () => moveProductCarousel(1));
    }

    // Inicializar carrossel e dots
    if (totalProductSlides > 0) {
        createCarouselDots();
        updateProductCarousel(); // Define o estado inicial
    }
    
    // Carrossel automático (opcional)
    let autoSlideInterval = setInterval(() => {
     moveProductCarousel(1);
    }, 5000);
    // Se o carrossel for interativo, pode ser bom pausar o auto-slide ao interagir
    productCarousel?.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    productCarousel?.addEventListener('mouseleave', () => autoSlideInterval = setInterval(() => moveProductCarousel(1), 5000));


    // --- Abas de Informação do Produto ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContentPanels = document.querySelectorAll('.tab-content-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class de todos os botões e painéis
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'text-primary', 'border-primary');
                btn.classList.add('hover:text-dark/70', 'hover:border-gray-300', 'border-transparent');
            });
            tabContentPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Adiciona active class ao botão clicado e ao painel correspondente
            this.classList.add('active', 'text-primary', 'border-primary');
            this.classList.remove('hover:text-dark/70', 'hover:border-gray-300', 'border-transparent');
            
            const targetTabId = this.getAttribute('data-tab-target');
            const targetPanel = document.querySelector(targetTabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // --- Seletor de Quantidade ---
    const quantityInput = document.getElementById('productQuantityInput');
    const incrementBtn = document.getElementById('quantityIncrementBtn');
    const decrementBtn = document.getElementById('quantityDecrementBtn');

    if (quantityInput && incrementBtn && decrementBtn) {
        incrementBtn.addEventListener('click', function() {
            let currentQuantity = parseInt(quantityInput.value);
            quantityInput.value = currentQuantity + 1;
        });

        decrementBtn.addEventListener('click', function() {
            let currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1;
            }
        });
    }
    
    // --- Atualizar ano no rodapé ---
    const footerCurrentYearSpan = document.getElementById('footerCurrentYear');
    if (footerCurrentYearSpan) {
        footerCurrentYearSpan.textContent = new Date().getFullYear();
    }

});