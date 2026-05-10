document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    initAmbientBackground();
    initHeaderState();
    initMobileMenu();
    initPlanSelection();
    initProgramLightbox();
    initContactForm();
    updateFooterYear();
    initPageTransitions();
    initScrollReveal();
});

function initAmbientBackground() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    const blobs = [];
    const colors = [
        'rgba(16, 168, 213, 0.34)',
        'rgba(15, 111, 255, 0.28)',
        'rgba(118, 186, 230, 0.24)',
        'rgba(255, 255, 255, 0.2)'
    ];

    function createBlob() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 260 + 180,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.14
        };
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        blobs.length = 0;
        const blobCount = width < 900 ? 5 : 8;
        for (let i = 0; i < blobCount; i += 1) {
            blobs.push(createBlob());
        }
    }

    function drawBlob(blob) {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function tick() {
        ctx.clearRect(0, 0, width, height);

        for (const blob of blobs) {
            if (!reduceMotion) {
                blob.x += blob.vx;
                blob.y += blob.vy;

                if (blob.x < -blob.radius) blob.x = width + blob.radius;
                if (blob.x > width + blob.radius) blob.x = -blob.radius;
                if (blob.y < -blob.radius) blob.y = height + blob.radius;
                if (blob.y > height + blob.radius) blob.y = -blob.radius;
            }

            drawBlob(blob);
        }

        if (!reduceMotion) {
            requestAnimationFrame(tick);
        }
    }

    window.addEventListener('resize', resize);
    resize();
    tick();
}

function initHeaderState() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 12) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    const setMenuState = (isOpen) => {
        nav.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('nav-open', isOpen);
    };

    const closeMenu = () => {
        setMenuState(false);
    };

    toggle.addEventListener('click', () => {
        const isOpen = !nav.classList.contains('open');
        setMenuState(isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!nav.classList.contains('open')) return;
        if (nav.contains(event.target) || toggle.contains(event.target)) return;
        closeMenu();
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('open')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            closeMenu();
        }
    });
}

function initPlanSelection() {
    const planSelect = document.getElementById('plan-select');
    const buttons = document.querySelectorAll('.btn-select');
    if (!planSelect || !buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const plan = button.getAttribute('data-plan');
            if (plan) {
                planSelect.value = plan;
                document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initProgramLightbox() {
    const lightbox = document.getElementById('program-lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    const previewImage = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const photoButtons = document.querySelectorAll('.program-photo');

    if (!lightbox || !closeBtn || !previewImage || !caption || !photoButtons.length) return;

    const openLightbox = (src, altText, description) => {
        previewImage.src = src;
        previewImage.alt = altText || 'Imagem do programa';
        caption.textContent = description || altText || '';

        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
    };

    photoButtons.forEach((button) => {
        const image = button.querySelector('img');
        if (!image) return;

        button.addEventListener('click', () => {
            openLightbox(image.currentSrc || image.src, image.alt, button.dataset.caption);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });
}

function initContactForm() {
    const form = document.getElementById('nexusway-form');
    if (!form) return;

    const productSelect = document.getElementById('product-select');
    const planWrapper = document.getElementById('plan-field-wrapper');
    const planSelect = document.getElementById('plan-select');
    const necWrapper = document.getElementById('necessidade-field-wrapper');
    const necInput = document.getElementById('necessidade-desc');

    if (productSelect) {
        const citySelect = document.getElementById('city-select');
        
        productSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Suporte de TI') {
                planWrapper.style.display = 'none';
                planSelect.required = false;
                planSelect.value = '';
                
                necWrapper.style.display = 'block';
                necInput.required = true;

                // Bloqueia cidade apenas para Três Lagoas
                if (citySelect) {
                    citySelect.value = 'Três Lagoas/MS';
                    Array.from(citySelect.options).forEach(opt => {
                        if (opt.value !== 'Três Lagoas/MS') opt.disabled = true;
                    });
                }
            } else {
                planWrapper.style.display = 'block';
                planSelect.required = true;
                
                necWrapper.style.display = 'none';
                necInput.required = false;
                necInput.value = '';

                // Libera todas as cidades para outros sistemas
                if (citySelect) {
                    Array.from(citySelect.options).forEach(opt => {
                        opt.disabled = false;
                    });
                }
            }
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            produto: formData.get('produto'),
            plano: formData.get('plano'),
            necessidade: formData.get('necessidade'),
            nome: formData.get('nome'),
            comercio: formData.get('comercio'),
            endereco: formData.get('endereco'),
            cidade: formData.get('cidade'),
            whatsapp: formData.get('whatsapp')
        };

        let firstLine = '';
        if (data.produto === 'Suporte de TI') {
            firstLine = `Olá, tenho interesse em ${data.produto}.\nNecessidade: ${data.necessidade}`;
        } else {
            firstLine = `Olá, tenho interesse no ${data.produto} (${data.plano}).`;
        }

        const message = [
            firstLine,
            `Nome: ${data.nome}`,
            `Comercio: ${data.comercio}`,
            `Endereco: ${data.endereco}`,
            `Cidade: ${data.cidade}`,
            `WhatsApp: ${data.whatsapp}`
        ].join('\n');

        const phone = '5567991413940';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
}

function updateFooterYear() {
    const yearEl = document.getElementById('year');
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
}

function initPageTransitions() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
        link.addEventListener('click', e => {
            const target = link.getAttribute('href');
            
            // Ignora links com target="_blank" ou links de ancoragem pura ou links vazios
            if (link.target === '_blank' || target.startsWith('#') || target.startsWith('mailto:') || target.startsWith('tel:')) return;
            
            // Só faz transição de página se o destino não for a mesma página
            if (target && target !== window.location.pathname && target !== window.location.href) {
                e.preventDefault();
                document.body.classList.add('page-transitioning');
                
                setTimeout(() => {
                    window.location.href = target;
                }, 300); // 300ms matches css transition
            }
        });
    });

    // Handle back/forward cache to ensure opacity is restored
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('page-transitioning');
        }
    });
}

function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply scroll-reveal dynamically to main elements
    const elementsToReveal = document.querySelectorAll('.surface-card, .section-head, .stat, .diff-card, .service-card, .roadmap-step, .price-item, .hero-grid > div');
    
    elementsToReveal.forEach((el, index) => {
        el.classList.add('scroll-reveal');
        
        // Add staggered delay to siblings
        if (el.parentNode) {
            const siblings = Array.from(el.parentNode.children).filter(child => child.classList.contains('scroll-reveal'));
            const idx = siblings.indexOf(el);
            if (idx > 0) {
                el.style.transitionDelay = `${idx * 100}ms`;
            }
        }
        
        observer.observe(el);
    });
}
