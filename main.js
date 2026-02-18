// Integraciones
const LEAD_CONFIG = {
  whatsappNumber: '56971415245',
  scriptURL: 'https://script.google.com/macros/s/AKfycbwQAzSOTSDBq_kwbBufi0QaIvfqT1wtIJsZKguu8fYDEfk30DzzCGYpo2EJDGp3APCj/exec',
  leadOrigin: 'Defy Website'
};

function normalizePhone(value) {
  return String(value || '').replace(/[^\d+]/g, '');
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${LEAD_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function populateLeadTrackingFields() {
  const form = document.getElementById('leadForm');
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  const urlField = form.querySelector('input[name="url"]');
  const sourceField = form.querySelector('input[name="utm_source"]');
  const mediumField = form.querySelector('input[name="utm_medium"]');
  const campaignField = form.querySelector('input[name="utm_campaign"]');

  if (urlField) urlField.value = window.location.href;
  if (sourceField) sourceField.value = params.get('utm_source') || '';
  if (mediumField) mediumField.value = params.get('utm_medium') || '';
  if (campaignField) campaignField.value = params.get('utm_campaign') || '';
}

function syncWhatsAppLinks() {
  const links = document.querySelectorAll('[data-wa-link]');
  links.forEach((link) => {
    const template = link.getAttribute('data-wa-text') || 'Hola, me interesa DEFY';
    link.href = buildWhatsAppUrl(template);
  });
}

syncWhatsAppLinks();
populateLeadTrackingFields();

// Logo config (Parte A - URLs oficiales)
// Reemplazar por SVG oficial provisto por el usuario si necesitas una versión de marca específica.
const BRAND_LOGO_ASSETS = {
  google: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
  hubspot: 'https://www.hubspot.com/hubfs/HubSpot_Logos/HSLogo_color.svg',
  shopify: 'https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg',
  woocommerce: 'https://woocommerce.com/wp-content/themes/woo/images/woo-logo.svg',
  ga4: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
  gtm: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_tag_manager.svg',
  looker: 'https://www.gstatic.com/analytics-lego/svg/ic_looker_studio.svg',
  brevo: 'https://corp-backend.brevo.com/wp-content/uploads/2025/07/Brevo_logo.svg',
  zoho: 'https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg',
  zapier: 'https://cdn.zapier.com/zapier/images/logo_zapier_black.svg',
  clarity: 'https://clarity.microsoft.com/static/clarity-logo.svg'
};

const BRAND_LOGOS = [
  { name: 'Google', url: BRAND_LOGO_ASSETS.google, href: 'https://ads.google.com/', alt: 'Logo de Google' },
  { name: 'HubSpot', url: BRAND_LOGO_ASSETS.hubspot, href: 'https://www.hubspot.com/', alt: 'Logo de HubSpot' },
  { name: 'Shopify', url: BRAND_LOGO_ASSETS.shopify, href: 'https://www.shopify.com/', alt: 'Logo de Shopify' },
  { name: 'WooCommerce', url: BRAND_LOGO_ASSETS.woocommerce, href: 'https://woocommerce.com/', alt: 'Logo de WooCommerce' },
  { name: 'Google Analytics 4', url: BRAND_LOGO_ASSETS.ga4, href: 'https://marketingplatform.google.com/about/analytics/', alt: 'Logo de Google Analytics 4' },
  { name: 'Google Tag Manager', url: BRAND_LOGO_ASSETS.gtm, href: 'https://tagmanager.google.com/', alt: 'Logo de Google Tag Manager' },
  { name: 'Looker Studio', url: BRAND_LOGO_ASSETS.looker, href: 'https://lookerstudio.google.com/', alt: 'Logo de Looker Studio' },
  { name: 'Brevo', url: BRAND_LOGO_ASSETS.brevo, href: 'https://www.brevo.com/', alt: 'Logo de Brevo' },
  { name: 'Zoho CRM', url: BRAND_LOGO_ASSETS.zoho, href: 'https://www.zoho.com/crm/', alt: 'Logo de Zoho CRM' },
  { name: 'Zapier', url: BRAND_LOGO_ASSETS.zapier, href: 'https://zapier.com/', alt: 'Logo de Zapier' },
  { name: 'Microsoft Clarity', url: BRAND_LOGO_ASSETS.clarity, href: 'https://clarity.microsoft.com/', alt: 'Logo de Microsoft Clarity' }
];

function createBrandLogoItem(brand, isClone) {
  const link = document.createElement('a');
  const brandId = (brand.name || 'brand').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.className = 'brand-logo-link';
  link.href = brand.href || '#';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.dataset.brand = brandId;
  link.setAttribute('aria-label', brand.name || 'Logo de marca');

  if (isClone) {
    link.setAttribute('aria-hidden', 'true');
    link.tabIndex = -1;
  }

  const img = document.createElement('img');
  img.className = 'brand-logo-media';
  img.src = brand.url || '';
  img.alt = isClone ? '' : (brand.alt || `Logo de ${brand.name || 'marca'}`);
  img.loading = 'lazy';
  img.decoding = 'async';

  // Si no se consigue imagen, se elimina la marca del carrusel.
  img.addEventListener('error', () => {
    document.querySelectorAll(`.brand-logo-link[data-brand="${brandId}"]`).forEach((node) => node.remove());
  });

  link.appendChild(img);
  return link;
}

function renderBrandLogos() {
  const row = document.getElementById('logosRow');
  if (!row || !Array.isArray(BRAND_LOGOS)) return;

  row.innerHTML = '';
  const validBrands = BRAND_LOGOS.filter((brand) => brand && brand.name && brand.url && brand.href);
  if (!validBrands.length) return;

  const setA = document.createDocumentFragment();
  const setB = document.createDocumentFragment();
  validBrands.forEach((brand) => setA.appendChild(createBrandLogoItem(brand, false)));
  validBrands.forEach((brand) => setB.appendChild(createBrandLogoItem(brand, true)));

  row.appendChild(setA);
  row.appendChild(setB);
}

renderBrandLogos();
function applyMotionPreferences() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroVideo = document.querySelector('.hero-video-bg video');

  if (!heroVideo) return;

  if (prefersReducedMotion) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
    heroVideo.style.display = 'none';
  } else {
    heroVideo.style.display = '';
    heroVideo.setAttribute('autoplay', '');
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }
}

applyMotionPreferences();

function animateValue(el, from, to, duration) {
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(from + (to - from) * eased);
    el.textContent = String(value);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initHeroCounters() {
  const counters = Array.from(document.querySelectorAll('.hero .counter'));
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroCard = document.querySelector('.hero-card');

  const revealFinalValues = () => {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.count || 0);
      counter.textContent = String(target);
    });
  };

  if (prefersReducedMotion || !heroCard) {
    revealFinalValues();
    return;
  }

  let countersAnimated = false;
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countersAnimated = true;
      counters.forEach((counter) => {
        const target = Number(counter.dataset.count || 0);
        animateValue(counter, 0, target, 900);
      });
      counterObserver.disconnect();
    });
  }, { threshold: 0.45 });

  counterObserver.observe(heroCard);
  setTimeout(() => {
    if (!countersAnimated) revealFinalValues();
  }, 1400);
}

initHeroCounters();
// Header interactions
const mainNav = document.getElementById('mainNav');
const mobileMenu = document.getElementById('mobileMenu');
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

function setMobileMenuState(isOpen) {
  if (!mobileMenu || !mobileToggle || !mobileMenuBackdrop) return;
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenuBackdrop.classList.toggle('open', isOpen);
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
  mainNav?.classList.toggle('menu-open', isOpen);
}

function toggleMobile() {
  const isOpen = mobileMenu?.classList.contains('open');
  setMobileMenuState(!isOpen);
}

function closeMobile() {
  setMobileMenuState(false);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobile();
});
window.addEventListener('resize', () => {
  if (window.innerWidth >= 900) closeMobile();
});

function updateNavOnScroll() {
  if (!mainNav) return;
  mainNav.classList.toggle('scrolled', window.scrollY > 8);
}

window.addEventListener('scroll', updateNavOnScroll, { passive: true });
updateNavOnScroll();

const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta-btn)'));
const navSections = navLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.section);

if (navSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => link.dataset.active = String(link.getAttribute('href') === id));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

  navSections.forEach(({ section }) => sectionObserver.observe(section));
}

// FAQ
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// Form
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;

  const formData = new FormData(form);
  const payload = {
    nombre: String(formData.get('nombre') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    telefono: normalizePhone(formData.get('telefono')),
    empresa: String(formData.get('empresa') || '').trim(),
    mensaje: String(formData.get('mensaje') || '').trim()
  };

  if (!payload.nombre || !payload.email || !payload.telefono || !payload.empresa || !payload.mensaje) {
    alert('Completa nombre, email, teléfono, empresa y mensaje para enviar el lead.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  payload.origen = String(formData.get('origen') || LEAD_CONFIG.leadOrigin).trim();
  payload.url = window.location.href;
  payload.utm_source = params.get('utm_source') || '';
  payload.utm_medium = params.get('utm_medium') || '';
  payload.utm_campaign = params.get('utm_campaign') || '';

  btn.disabled = true;
  btn.textContent = 'Enviando...';
  btn.style.opacity = '0.6';

  const queryString = new URLSearchParams({
    nombre: payload.nombre,
    email: payload.email,
    telefono: payload.telefono,
    empresa: payload.empresa,
    mensaje: payload.mensaje,
    origen: payload.origen,
    url: payload.url,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign
  }).toString();
  const endpoint = `${LEAD_CONFIG.scriptURL}?${queryString}`;

  fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors'
  })
    .then(() => {
      form.innerHTML = `
      <div style="text-align:center;padding:32px 0;">
        <div style="width:56px;height:56px;border-radius:50%;background:#059669;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style="font-size:1.25rem;font-weight:700;color:white;margin-bottom:8px;">¡Listo!</h3>
        <p style="color:rgba(255,255,255,0.6);font-size:0.9375rem;margin-bottom:16px;">Gracias por tu solicitud. Pronto te contactaremos para agendar una evaluación estratégica.</p>
        <button type="button" class="btn-wa" onclick="window.location.reload()">Enviar otra solicitud</button>
      </div>
    `;
    })
    .catch((error) => {
      console.error(error);
      btn.disabled = false;
      btn.textContent = 'Quiero mi diagnóstico comercial';
      btn.style.opacity = '1';
      alert('No se pudo enviar. Intenta nuevamente.');
    });
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const t = document.querySelector(targetId);
    if (!t) return;
    e.preventDefault();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navOffset = (mainNav?.offsetHeight || 72) + 18;
    const top = t.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });

    if (mobileMenu?.classList.contains('open')) closeMobile();
  });
});

// Sticky CTA
const stickyCta = document.getElementById('stickyCta');
let stickyHidden = false;

window.addEventListener('scroll', () => {
  if (stickyHidden) return;
  const hero = document.querySelector('.hero');
  stickyCta.classList.toggle('visible', window.scrollY > hero.offsetHeight * 0.6);
});

// Hide sticky when reaching CTA section
const ctaSection = document.getElementById('diagnostico');
const ctaObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    stickyCta.classList.remove('visible');
  } else if (window.scrollY > document.querySelector('.hero').offsetHeight * 0.6) {
    stickyCta.classList.add('visible');
  }
}, { threshold: 0.3 });
ctaObserver.observe(ctaSection);

// Hero floating particles
(function initHeroParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  let w, h;

  function resize() {
    const hero = canvas.parentElement;
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.2 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.008
    };
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(w * h / 18000), 60);
    particles = [];
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 197, 253, ${a})`;
      ctx.fill();

      // glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96, 165, 250, ${a * 0.15})`;
      ctx.fill();
    });

    // Draw subtle connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    draw();
  });

  // Pause when not visible
  const heroEl = document.querySelector('.hero');
  const particleObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) draw();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.05 });
  particleObserver.observe(heroEl);
})();

// 3D tilt card enhancement
(function initTiltCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale3d(1.02,1.02,1.02)`;
      card.style.boxShadow = `${-x * 20}px ${y * 20}px 60px rgba(0,0,0,0.35)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

// Magnetic button effect
(function initMagneticBtns() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const btns = document.querySelectorAll('.magnetic-btn');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// ===== MAPA DE CONCIENCIA =====
(function initConciencia() {
  const LEVELS = [
    {
      name: 'Inconsciente',
      accent: '#3b82f6',
      hint: 'La mayoría de tus prospectos están aquí y no los estás alcanzando.',
      stage: 'Nivel 1 — No sabe que tiene un problema',
      thinks: '"Todo está bien, no necesito nada nuevo."',
      reality: 'Tu prospecto ni siquiera sabe que existe una solución como la tuya. No te está buscando. Si le hablas de tu producto ahora, te ignora.',
      opportunity: 'No le vendes. Le muestras un problema que no sabía que tenía. Un mensaje que lo haga parar y pensar "¿me estará pasando esto?".',
      ctaText: 'Descubre lo que estás perdiendo',
      ctaStyle: 'outline'
    },
    {
      name: 'Frustrado',
      accent: '#f59e0b',
      hint: 'Aquí hay plata sobre la mesa. Estos prospectos necesitan que los guíes.',
      stage: 'Nivel 2 — Siente que algo anda mal',
      thinks: '"Algo no está funcionando, pero no sé exactamente qué."',
      reality: 'Tu prospecto siente la frustración — sus resultados no son los que espera, pero no sabe por qué. Si le hablas con jerga técnica o le mandas un brochure, lo pierdes.',
      opportunity: 'Validas su dolor. Le pones nombre a lo que siente. Y te posicionas como alguien que entiende su situación, no que le quiere vender.',
      ctaText: 'Cómo captamos en esta etapa',
      ctaStyle: 'outline'
    },
    {
      name: 'Explorando',
      accent: '#f97316',
      hint: 'Está buscando opciones. Si no apareces aquí, tu competencia sí.',
      stage: 'Nivel 3 — Busca solución, no te conoce',
      thinks: '"Necesito resolver esto. ¿Qué opciones hay?"',
      reality: 'Tu prospecto está comparando. Busca en Google, pregunta en su red, ve contenido. Si tu marca no aparece con un mensaje claro y diferente, elige a otro.',
      opportunity: 'Rompes creencias falsas. Le muestras por qué las soluciones que está considerando no van a funcionar — y cuál es el enfoque correcto.',
      ctaText: 'Cómo diferenciamos tu mensaje',
      ctaStyle: 'solid'
    },
    {
      name: 'Evaluando',
      accent: '#22c55e',
      hint: 'Ya te conoce. Si no le das confianza ahora, se va con otro.',
      stage: 'Nivel 4 — Te conoce, pero duda',
      thinks: '"Me interesa, pero ¿realmente funciona? ¿Vale la pena el riesgo?"',
      reality: 'Ya vio tu contenido, visitó tu web, quizás hasta habló con tu equipo. Pero tiene miedo de gastar y no ver retorno. Necesita pruebas, no promesas.',
      opportunity: 'Le bajas la fricción con casos reales, transparencia total y un modelo que le diga "si no funciona, nosotros también perdemos".',
      ctaText: 'Convierte dudas en reuniones',
      ctaStyle: 'solid'
    },
    {
      name: 'Decidiendo',
      accent: '#059669',
      hint: 'Este prospecto está listo. Si no le das el empujón, se enfría.',
      stage: 'Nivel 5 — Listo para comprar',
      thinks: '"Necesito resolver esto ya. Solo necesito estar seguro."',
      reality: 'Tu prospecto tiene el dolor claro, la urgencia real y el presupuesto. Solo necesita un siguiente paso concreto y la seguridad de que está tomando la decisión correcta.',
      opportunity: 'Cero fricción. Mensaje directo. Un CTA que no deje lugar a dudas. Si aquí no cierras, es porque tu proceso final no está diseñado para convertir.',
      ctaText: 'Solicita tu diagnóstico ahora',
      ctaStyle: 'solid'
    }
  ];

  const ICONS = {
    thinks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    reality: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    opportunity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  };

  const timeline = document.getElementById('concienciaTimeline');
  const progressFill = document.getElementById('concienciaProgress');
  const mobileWrap = document.getElementById('concienciaMobile');
  const card = document.getElementById('concienciaCard');
  const cardInner = document.getElementById('concienciaCardInner');
  const hint = document.getElementById('concienciaHint');

  if (!card || !cardInner) return;

  let currentLevel = 0;

  function renderCard(level) {
    const data = LEVELS[level];
    const prevDisabled = level === 0 ? 'disabled' : '';
    const nextDisabled = level === LEVELS.length - 1 ? 'disabled' : '';
    const prevName = level > 0 ? LEVELS[level - 1].name : '';
    const nextName = level < LEVELS.length - 1 ? LEVELS[level + 1].name : '';

    cardInner.innerHTML = `
      <div class="conciencia-card-stage">${data.stage}</div>
      <div class="conciencia-card-grid">
        <div class="conciencia-card-block">
          <div class="conciencia-card-block-icon">${ICONS.thinks}</div>
          <h4>Lo que piensa tu prospecto</h4>
          <p>${data.thinks}</p>
        </div>
        <div class="conciencia-card-block">
          <div class="conciencia-card-block-icon">${ICONS.reality}</div>
          <h4>Lo que realmente pasa</h4>
          <p>${data.reality}</p>
        </div>
        <div class="conciencia-card-block">
          <div class="conciencia-card-block-icon">${ICONS.opportunity}</div>
          <h4>Qué mensaje necesita</h4>
          <p>${data.opportunity}</p>
        </div>
      </div>
      <a href="#diagnostico" class="conciencia-card-cta ${data.ctaStyle}">${data.ctaText}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <div class="conciencia-nav">
        <button class="conciencia-nav-btn" id="concienciaPrev" ${prevDisabled}>
          <svg viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${prevName}
        </button>
        <span class="conciencia-nav-counter">${level + 1} / ${LEVELS.length}</span>
        <button class="conciencia-nav-btn" id="concienciaNext" ${nextDisabled}>
          ${nextName}
          <svg viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `;

    // Attach nav listeners
    const prevBtn = document.getElementById('concienciaPrev');
    const nextBtn = document.getElementById('concienciaNext');
    if (prevBtn) prevBtn.addEventListener('click', () => setLevel(currentLevel - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setLevel(currentLevel + 1));
  }

  function updateProgress(level) {
    if (!progressFill || !timeline) return;
    const nodes = timeline.querySelectorAll('.conciencia-node');
    if (nodes.length < 1) return;
    // Slide the highlight to the active tab position
    progressFill.style.transform = `translateX(${level * 100}%)`;
  }

  function setLevel(level) {
    if (level < 0 || level >= LEVELS.length) return;
    if (level === currentLevel && cardInner.innerHTML !== '') return;
    const data = LEVELS[level];

    // Update accent color
    document.documentElement.style.setProperty('--conciencia-accent', data.accent);

    // Hint
    if (hint) {
      hint.textContent = data.hint;
      hint.classList.add('visible');
    }

    // Desktop nodes — active + visited
    if (timeline) {
      timeline.classList.add('has-active');
      timeline.querySelectorAll('.conciencia-node').forEach((node, i) => {
        node.classList.toggle('active', i === level);
        node.classList.toggle('visited', i < level);
      });
      updateProgress(level);
    }

    // Mobile pills
    if (mobileWrap) {
      mobileWrap.querySelectorAll('.conciencia-pill-mobile').forEach((pill, i) => {
        pill.classList.toggle('active', i === level);
      });
      // Scroll active pill into view
      const activePill = mobileWrap.querySelector('.conciencia-pill-mobile.active');
      if (activePill) activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Card transition
    cardInner.classList.add('transitioning');
    setTimeout(() => {
      renderCard(level);
      cardInner.classList.remove('transitioning');
    }, 250);

    currentLevel = level;
  }

  // Init first level
  renderCard(0);
  document.documentElement.style.setProperty('--conciencia-accent', LEVELS[0].accent);
  if (hint) {
    hint.textContent = LEVELS[0].hint;
    hint.classList.add('visible');
  }
  if (timeline) {
    timeline.classList.add('has-active');
    timeline.querySelector('.conciencia-node').classList.add('active');
  }

  // Desktop click
  if (timeline) {
    timeline.querySelectorAll('.conciencia-node').forEach(node => {
      node.addEventListener('click', () => {
        setLevel(Number(node.dataset.level));
      });
    });
  }

  // Mobile click
  if (mobileWrap) {
    mobileWrap.querySelectorAll('.conciencia-pill-mobile').forEach(pill => {
      pill.addEventListener('click', () => {
        setLevel(Number(pill.dataset.level));
      });
    });
  }

  // Touch swipe on card for mobile
  let touchStartX = 0;
  card.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  card.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
      const next = diff < 0
        ? Math.min(currentLevel + 1, LEVELS.length - 1)
        : Math.max(currentLevel - 1, 0);
      setLevel(next);
    }
  }, { passive: true });
})();
