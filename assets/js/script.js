/* ============================================================
   CUSTOM CURSOR  (desktop / hover-capable devices only)
   ============================================================ */
function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    document.body.style.cursor = 'none';

    let mx = -200, my = -200;
    let dx = mx,   dy = my;
    let rx = mx,   ry = my;
    let visible = false;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!visible) {
            dot.style.opacity  = '1';
            ring.style.opacity = '0.75';
            visible = true;
        }
    });

    document.querySelectorAll('a, button, [role="button"], input, textarea, .project-card, .skill-category').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
    });

    (function tick() {
        dx += (mx - dx) * 0.15;
        dy += (my - dy) * 0.15;
        dot.style.left = dx + 'px';
        dot.style.top  = dy + 'px';

        rx += (mx - rx) * 0.08;
        ry += (my - ry) * 0.08;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';

        requestAnimationFrame(tick);
    })();
}

/* ============================================================
   PARTICLE CANVAS  (hero background)
   ============================================================ */
let _particlesActive = true;

function initParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const COUNT = 60;
    const LINK  = 120;

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.4 + Math.random() * 1.4,
    }));

    function draw() {
        if (_particlesActive) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0)            p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0)             p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.18)';
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const ddx = particles[i].x - particles[j].x;
                    const ddy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (dist < LINK) {
                        const alpha = (1 - dist / LINK) * 0.14;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(draw);
    }

    draw();

    document.addEventListener('visibilitychange', () => {
        _particlesActive = !document.hidden;
    });
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    const update = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ============================================================
   SKILLS 3D FLIP CASCADE
   ============================================================ */
function initSkillFlip() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.skill-category').forEach(c => c.classList.add('flip-in'));
        return;
    }
    const cards = Array.from(document.querySelectorAll('.skill-category'));
    if (!cards.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const idx = cards.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('flip-in'), idx * 90);
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    cards.forEach(c => obs.observe(c));
}

/* ============================================================
   PROJECT CARD 3D TILT + SHINE
   ============================================================ */
function initProjectTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const MAX = 12;

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top)  / rect.height;
            const rotX =  (0.5 - y) * MAX;
            const rotY =  (x - 0.5) * MAX;
            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
            card.style.setProperty('--mouse-x', (x * 100) + '%');
            card.style.setProperty('--mouse-y', (y * 100) + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        });
    });
}

/* ============================================================
   ABOUT CLIP-PATH REVEAL
   ============================================================ */
function initAboutReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.about-reveal').forEach(el => el.classList.add('revealed'));
        return;
    }
    const els = document.querySelectorAll('.about-reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    els.forEach(el => obs.observe(el));
}

/* ============================================================
   SVG CONTACT SEPARATOR
   ============================================================ */
function initSvgSeparator() {
    const svg = document.querySelector('.contact-divider');
    if (!svg) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        svg.classList.add('drawn');
        return;
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('drawn');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    obs.observe(svg);
}

/* ============================================================
   FLOATING LABELS — has-value class
   ============================================================ */
function initFloatingLabels() {
    document.querySelectorAll('.form-field input, .form-field textarea').forEach(input => {
        const sync = () => input.closest('.form-field').classList.toggle('has-value', input.value.trim() !== '');
        input.addEventListener('input', sync);
        input.addEventListener('blur',  sync);
        sync();
    });
}

/* ============================================================
   BUTTON RIPPLE
   ============================================================ */
function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute;border-radius:50%;
                width:${size}px;height:${size}px;
                left:${e.clientX - rect.left - size / 2}px;
                top:${e.clientY - rect.top  - size / 2}px;
                pointer-events:none;
            `;
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* ============================================================
   GLITCH TRIGGER
   ============================================================ */
function triggerGlitch(element) {
    if (!element) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.classList.add('is-glitching');
    setTimeout(() => element.classList.remove('is-glitching'), 1600);
}

/* ============================================================
   i18n DATA
   ============================================================ */
let currentLanguage = 'es';
let heroTypingTimer = null;
let heroTypingRun   = 0;

const i18n = {
    es: {
        siteTitle: 'JavierM - Portfolio',
        skipLink: 'Saltar al contenido principal',
        nav: { home:'Inicio', about:'Sobre Mí', skills:'Habilidades', studies:'Estudios', work:'Trabajo', projects:'Proyectos', contact:'Contacto' },
        map: { home:'Inicio', about:'Sobre mí', skills:'Habilidades', studies:'Estudios', work:'Trabajo', projects:'Proyectos', contact:'Contacto' },
        heroPrefix: 'Hola, soy ',
        heroHighlight: 'Manzano',
        heroSubtitle: 'Desarrollador creativo y apasionado por la tecnología',
        heroDescription: 'Especializado en crear experiencias digitales únicas y soluciones innovadoras',
        heroPills: ['Full Stack Junior', 'Aprendizaje rápido', 'Trabajo en equipo'],
        heroButtons: ['Ver Proyectos', 'Contactar'],
        sectionTitles: ['Sobre Mí', 'Habilidades', 'Estudios', 'Trabajo', 'Proyectos Destacados', 'Contacto'],
        profileLocation: 'Sevilla',
        about: {
            paragraphs: [
                'Soy estudiante de DAW y me metí en la programación gracias a un amigo que me abrió este mundo. Desde entonces me gusta explorar distintas formas de programar y entender cómo funciona todo por dentro.',
                'Fuera del código, me encanta escuchar música (rap, rock y española), ver anime y jugar videojuegos. También juego al pádel y hago parkour.'
            ],
            panelTitle: 'Perfil resumido',
            points: [
                '2º de DAW, mejorando cada semana con práctica constante.',
                'Me gusta entender arquitectura, lógica y cómo escalan los proyectos.',
                'Buen encaje en equipo, comunicación directa y ganas de aportar.'
            ],
            socialTitle: 'Social Skills',
            socialItems: ['Trabajo en equipo','Resolución de problemas','Responsabilidad en el equipo','Buenas habilidades de comunicación','Organización y puntualidad','Liderazgo'],
            focus: ['Objetivo: primer rol como dev junior','Intereses: anime, gaming y música','Extra: parkour y pádel']
        },
        skills: {
            categoryTitles: ['Frontend', 'Backend y lógica', 'Herramientas'],
            items: [
                'HTML semántico y CSS responsive para interfaces web.',
                'JavaScript para interacción de UI y consumo de APIs.',
                'React con React Router en proyectos de frontend.',
                'Vite como entorno de desarrollo y build en React.',
                'TypeScript y Next.js en prácticas recientes.',
                'Node.js y Express en APIs REST y middleware.',
                'MongoDB con Mongoose (modelado y consultas).',
                'Autenticación por token y control de roles (JWT).',
                'Documentación de APIs con OpenAPI y Swagger UI.',
                'Servicios SMTP con Nodemailer y Mailhog.',
                'Git y GitHub para versionado y trabajo en equipo.',
                'Docker y Docker Compose (Node, Nginx, Mongo).',
                'Testing con Jest y Vitest en ejercicios y APIs.',
                'NPM, Bash y PowerShell para flujo diario de desarrollo.',
                'Bases de PHP/Drupal en entorno Docker de prácticas.'
            ]
        },
        studies: {
            titles: ['Grado Medio TECO','Grado Superior Enseñanza y Animación','Grado Superior ADAITS Desarrollo de Aplicaciones Web','Idiomas'],
            descriptions: ['2017-09 - 2019-06 · CESUR, Sevilla.','2019-09 - 2021-06 · CESUR, Sevilla.','2024 - 2026 · ADAITS.','Español nativo, Inglés B2.']
        },
        work: {
            dates: ['2023-02 - 2023-05 / 2018-09 - 2019-05','2020-08 - 2023-01','2023-04 - 2024-09','2021-11 - Actualidad'],
            titles: ['Monitor de tiempo libre - BOSQUE SUSPENDIDO, Sevilla','Monitor de tiempo libre - Universo Parkour, Sevilla','Carretillero - RHENUS LOGISTICS (EUROFIRMS), Sevilla','Camarero - Asador Montequinto, Sevilla'],
            descriptions: [
                'Montura y recogida de material de trabajo, supervisión durante las actividades, apoyo y orientación a participantes y planificación de contingencias.',
                'Orientación y apoyo en etapa deportiva, planificación de actividades, alimentación y retroalimentación, supervisión de emergencias, adaptación a nuevas situaciones y participación en proyectos de gran escala.',
                'Control de maquinaria, carga y descarga de camiones y uso de pistola de picking.',
                'Colocación y recogida de mesas, servicio de menús para 15-30 personas, bebidas y comidas en mesa, apoyo de limpieza en cocina y preparación de menús.'
            ]
        },
        projects: {
            badges: ['Web App','API','Diseño Web'],
            titles: ['Alquiler de Coches Programación','OnePiece API','Alquier de Coches Lenguaje De Marca'],
            descriptions: [
                'Trabajo de programación sobre alquileres de coches, centrado en la gestión básica de reservas y catálogo.',
                'API para consultar informacion del universo One Piece con endpoints dedicados a personajes, tripulaciones y busquedas.',
                'Proyecto final de Lenguaje de Marcas con foco en HTML y CSS, maquetación limpia y estructura semántica.'
            ],
            codeButton: 'Código'
        },
        contact: { heading:'¡Trabajemos juntos!', description:'Estoy siempre interesado en nuevos proyectos y oportunidades. No dudes en contactarme.', location:'Sevilla, España' },
        footer: '© 2025 Javier Manzano Oliveros. Todos los derechos reservados.',
        form: { name:'Tu nombre', email:'Tu email', subject:'Asunto', message:'Tu mensaje', submit:'Enviar Mensaje', openMail:'Abriendo correo...', empty:'Por favor, completa todos los campos.', invalidEmail:'Por favor, ingresa un email válido.', mailName:'Nombre', mailEmail:'Email' },
        navToggleLabel: 'Abrir menú de navegación',
        navAria: 'Navegación principal',
        mapAria: 'Mapa de secciones',
        profileAlt: 'JManzanoO - Foto de perfil',
        themeToggleLight: 'Cambiar a modo claro',
        themeToggleDark: 'Cambiar a modo oscuro',
        langToggleLabel: 'Switch language to English'
    },
    en: {
        siteTitle: 'JavierM - Portfolio',
        skipLink: 'Skip to main content',
        nav: { home:'Home', about:'About', skills:'Skills', studies:'Studies', work:'Work', projects:'Projects', contact:'Contact' },
        map: { home:'Home', about:'About', skills:'Skills', studies:'Studies', work:'Work', projects:'Projects', contact:'Contact' },
        heroPrefix: 'Hi, I am ',
        heroHighlight: 'Manzano',
        heroSubtitle: 'Creative developer passionate about technology',
        heroDescription: 'Focused on building unique digital experiences and innovative solutions',
        heroPills: ['Junior Full Stack','Fast learner','Team player'],
        heroButtons: ['View Projects','Contact'],
        sectionTitles: ['About Me','Skills','Studies','Work','Featured Projects','Contact'],
        profileLocation: 'Seville',
        about: {
            paragraphs: [
                'I am a DAW student and I got into programming thanks to a friend who introduced me to this world. Since then, I enjoy exploring different ways of coding and understanding how everything works under the hood.',
                'Outside of code, I love listening to music (rap, rock and Spanish music), watching anime and playing videogames. I also play padel and do parkour.'
            ],
            panelTitle: 'Quick profile',
            points: [
                'Second year DAW student, improving every week with constant practice.',
                'I like understanding architecture, logic and how projects scale.',
                'Strong team fit, direct communication and willingness to contribute.'
            ],
            socialTitle: 'Social Skills',
            socialItems: ['Teamwork','Problem solving','Team responsibility','Strong communication skills','Organization and punctuality','Leadership'],
            focus: ['Goal: first junior developer role','Interests: anime, gaming and music','Extra: parkour and padel']
        },
        skills: {
            categoryTitles: ['Frontend','Backend and logic','Tools'],
            items: [
                'Semantic HTML and responsive CSS for web interfaces.',
                'JavaScript for UI interactivity and API consumption.',
                'React with React Router in frontend projects.',
                'Vite as development and build environment for React.',
                'TypeScript and Next.js in recent practice projects.',
                'Node.js and Express in REST APIs and middleware.',
                'MongoDB with Mongoose (modeling and queries).',
                'Token authentication and role-based access control (JWT).',
                'API documentation with OpenAPI and Swagger UI.',
                'SMTP services with Nodemailer and Mailhog.',
                'Git and GitHub for version control and teamwork.',
                'Docker and Docker Compose (Node, Nginx, Mongo).',
                'Testing with Jest and Vitest in exercises and APIs.',
                'NPM, Bash and PowerShell for daily development workflow.',
                'PHP/Drupal basics in Docker-based practice environments.'
            ]
        },
        studies: {
            titles: ['Intermediate Vocational Degree TECO','Higher Vocational Degree Sports Teaching and Animation','Higher Vocational Degree ADAITS Web Application Development','Languages'],
            descriptions: ['2017-09 - 2019-06 · CESUR, Seville.','2019-09 - 2021-06 · CESUR, Seville.','2024 - 2026 · ADAITS.','Native Spanish, English B2.']
        },
        work: {
            dates: ['2023-02 - 2023-05 / 2018-09 - 2019-05','2020-08 - 2023-01','2023-04 - 2024-09','2021-11 - Present'],
            titles: ['Leisure Activity Instructor - BOSQUE SUSPENDIDO, Seville','Leisure Activity Instructor - Universo Parkour, Seville','Forklift Operator - RHENUS LOGISTICS (EUROFIRMS), Seville','Waiter - Asador Montequinto, Seville'],
            descriptions: [
                'Work material setup and collection, activity supervision, participant support and contingency planning.',
                'Sports support and guidance, activity planning, nutrition and feedback, emergency supervision, adaptation support and participation in large-scale projects.',
                'Machinery control, truck loading/unloading and picking gun usage.',
                'Table setup and clearing, service for 15-30 person menus, food and drinks service, kitchen cleaning support and menu preparation.'
            ]
        },
        projects: {
            badges: ['Web App','API','Web Design'],
            titles: ['Car Rental Programming','OnePiece API','Car Rental Markup Language'],
            descriptions: [
                'Programming assignment about car rentals, focused on basic reservation and catalog management.',
                'API to explore the One Piece universe with dedicated endpoints for characters, crews and searches.',
                'Final Markup Language project focused on HTML and CSS, clean layout and semantic structure.'
            ],
            codeButton: 'Code'
        },
        contact: { heading:'Let us work together!', description:'I am always interested in new projects and opportunities. Feel free to contact me.', location:'Seville, Spain' },
        footer: '© 2025 Javier Manzano Oliveros. All rights reserved.',
        form: { name:'Your name', email:'Your email', subject:'Subject', message:'Your message', submit:'Send Message', openMail:'Opening email...', empty:'Please complete all fields.', invalidEmail:'Please enter a valid email.', mailName:'Name', mailEmail:'Email' },
        navToggleLabel: 'Open navigation menu',
        navAria: 'Main navigation',
        mapAria: 'Section map',
        profileAlt: 'JManzanoO - Profile photo',
        themeToggleLight: 'Switch to light mode',
        themeToggleDark: 'Switch to dark mode',
        langToggleLabel: 'Cambiar idioma a español'
    }
};

/* ============================================================
   i18n DOM HELPERS
   ============================================================ */
function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
}

function setLabel(forAttr, value) {
    const el = document.querySelector(`label[for="${forAttr}"]`);
    if (el) el.textContent = value;
}

function setTextList(selector, values) {
    document.querySelectorAll(selector).forEach((el, i) => {
        if (values[i] !== undefined) el.textContent = values[i];
    });
}

function setIconTextList(selector, values) {
    document.querySelectorAll(selector).forEach((el, i) => {
        if (values[i] === undefined) return;
        const icon = el.querySelector('i');
        el.innerHTML = icon ? `${icon.outerHTML} ${values[i]}` : values[i];
    });
}

function updateLanguageToggle() {
    langToggles.forEach(t => {
        t.textContent = currentLanguage === 'en' ? 'ES' : 'EN';
        t.setAttribute('aria-label', i18n[currentLanguage].langToggleLabel);
    });
}

/* ============================================================
   TYPEWRITER + GLITCH
   ============================================================ */
function addAnimatedHighlight(element, text) {
    const highlight = document.createElement('span');
    highlight.className = 'highlight highlight-animated';
    highlight.setAttribute('aria-label', text);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        highlight.textContent = text;
        element.appendChild(highlight);
        return;
    }

    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'highlight-char';
        span.textContent = char === ' ' ? ' ' : char;
        span.style.animationDelay = `${index * 75}ms`;
        highlight.appendChild(span);
    });

    element.appendChild(highlight);

    // Trigger glitch after all chars animate in
    const glitchDelay = text.length * 75 + 580;
    setTimeout(() => triggerGlitch(highlight), glitchDelay);
}

function typeWriterHeading(element, prefixText, highlightText, speed = 48) {
    heroTypingRun += 1;
    const runId = heroTypingRun;
    if (heroTypingTimer) { clearTimeout(heroTypingTimer); heroTypingTimer = null; }

    let i = 0;
    element.textContent = '';
    const textNode = document.createTextNode('');
    element.appendChild(textNode);

    function type() {
        if (runId !== heroTypingRun) return;
        if (i < prefixText.length) {
            textNode.textContent += prefixText.charAt(i++);
            heroTypingTimer = setTimeout(type, speed);
        } else if (highlightText) {
            addAnimatedHighlight(element, highlightText);
        }
    }
    type();
}

function renderHeroTitle() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    typeWriterHeading(heroTitle, i18n[currentLanguage].heroPrefix, i18n[currentLanguage].heroHighlight);
}

/* ============================================================
   APPLY LANGUAGE
   ============================================================ */
function applyLanguage(lang) {
    currentLanguage = lang === 'en' ? 'en' : 'es';
    document.documentElement.lang = currentLanguage;
    const t = i18n[currentLanguage];

    document.title = t.siteTitle;
    setText('.skip-link', t.skipLink);

    const nav = document.querySelector('.navbar');
    if (nav) nav.setAttribute('aria-label', t.navAria);
    if (sectionMap) sectionMap.setAttribute('aria-label', t.mapAria);
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) profileImage.setAttribute('alt', t.profileAlt);

    setText('.nav-link[href="#home"]',     t.nav.home);
    setText('.nav-link[href="#about"]',    t.nav.about);
    setText('.nav-link[href="#skills"]',   t.nav.skills);
    setText('.nav-link[href="#studies"]',  t.nav.studies);
    setText('.nav-link[href="#work"]',     t.nav.work);
    setText('.nav-link[href="#projects"]', t.nav.projects);
    setText('.nav-link[href="#contact"]',  t.nav.contact);

    setText('[data-map-link="home"] .map-label',     t.map.home);
    setText('[data-map-link="about"] .map-label',    t.map.about);
    setText('[data-map-link="skills"] .map-label',   t.map.skills);
    setText('[data-map-link="studies"] .map-label',  t.map.studies);
    setText('[data-map-link="work"] .map-label',     t.map.work);
    setText('[data-map-link="projects"] .map-label', t.map.projects);
    setText('[data-map-link="contact"] .map-label',  t.map.contact);

    setText('.hero-subtitle',    t.heroSubtitle);
    setText('.hero-description', t.heroDescription);

    document.querySelectorAll('.hero-pill').forEach((pill, i) => {
        const icon = pill.querySelector('i');
        if (!icon || !t.heroPills[i]) return;
        pill.innerHTML = `${icon.outerHTML} ${t.heroPills[i]}`;
    });

    document.querySelectorAll('.hero-buttons .btn').forEach((btn, i) => {
        if (t.heroButtons[i]) btn.textContent = t.heroButtons[i];
    });

    document.querySelectorAll('.section-title').forEach((title, i) => {
        if (t.sectionTitles[i]) title.textContent = t.sectionTitles[i];
    });

    setIconTextList('.profile-badge', [t.profileLocation]);
    setTextList('.about-text > p', t.about.paragraphs);
    setText('.about-panel h3', t.about.panelTitle);
    setIconTextList('.profile-points li', t.about.points);
    setText('.about-panel--skills h3', t.about.socialTitle);
    setIconTextList('.social-skills-list li', t.about.socialItems);
    setIconTextList('.about-focus span', t.about.focus);

    document.querySelectorAll('.skill-category h3').forEach((title, i) => {
        if (t.skills.categoryTitles[i] === undefined) return;
        const icon = title.querySelector('i');
        title.innerHTML = icon ? `${icon.outerHTML} ${t.skills.categoryTitles[i]}` : t.skills.categoryTitles[i];
    });
    setIconTextList('.skill-info-item', t.skills.items);

    setTextList('#studies .milestone-card h3', t.studies.titles);
    setTextList('#studies .milestone-card p',  t.studies.descriptions);
    setTextList('#work .timeline-date',         t.work.dates);
    setTextList('#work .timeline-card h3',      t.work.titles);
    setTextList('#work .timeline-description',  t.work.descriptions);

    setTextList('.project-badge',       t.projects.badges);
    setTextList('.project-content h3',  t.projects.titles);
    setTextList('.project-content p',   t.projects.descriptions);
    document.querySelectorAll('.project-links .btn').forEach(btn => { btn.textContent = t.projects.codeButton; });

    setText('.contact-info h3', t.contact.heading);
    setText('.contact-info p',  t.contact.description);
    const contactItems = document.querySelectorAll('.contact-item span');
    if (contactItems[2]) contactItems[2].textContent = t.contact.location;
    setText('.footer p', t.footer);

    // Floating labels — set label text, keep placeholder as " "
    setLabel('name',    t.form.name);
    setLabel('email',   t.form.email);
    setLabel('subject', t.form.subject);
    setLabel('message', t.form.message);
    setText('.contact-form button[type="submit"]', t.form.submit);

    if (navToggle) navToggle.setAttribute('aria-label', t.navToggleLabel);

    updateThemeToggle(document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    renderHeroTitle();
    updateLanguageToggle();
}

function setLanguage(lang, persist = true) {
    applyLanguage(lang);
    if (persist) localStorage.setItem('language', currentLanguage);
}

/* ============================================================
   THEME
   ============================================================ */
function updateThemeToggle(theme) {
    const isLight = theme === 'light';
    themeToggles.forEach(t => {
        t.setAttribute('aria-pressed', String(isLight));
        t.setAttribute('aria-label', isLight ? i18n[currentLanguage].themeToggleDark : i18n[currentLanguage].themeToggleLight);
        t.innerHTML = isLight ? '<i class="fas fa-moon" aria-hidden="true"></i>' : '<i class="fas fa-sun" aria-hidden="true"></i>';
    });
}

function setTheme(theme, persist = true) {
    document.body.setAttribute('data-theme', theme);
    updateThemeToggle(theme);
    if (persist) localStorage.setItem('theme', theme);
}

/* ============================================================
   NAVBAR — smart hide/show on scroll direction
   ============================================================ */
let _lastScrollY = 0;

function updateNavbarState() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const currentY = window.scrollY;

    navbar.classList.toggle('is-scrolled', currentY > 50);

    if (currentY > _lastScrollY && currentY > 120 && !navMenu.classList.contains('active')) {
        navbar.classList.add('is-hidden');
    } else {
        navbar.classList.remove('is-hidden');
    }
    _lastScrollY = currentY;

    if (sectionMap) sectionMap.classList.toggle('is-visible', currentY > 180);
    setActiveSection(getCurrentSectionId());
}

/* ============================================================
   ACTIVE SECTION
   ============================================================ */
function setActiveSection(id) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    mapLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('data-map-link') === id);
    });
}

function getCurrentSectionId() {
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 68;
    const probe = window.scrollY + navH + window.innerHeight * 0.28;
    let active = pageSections[0] ? pageSections[0].id : 'home';
    pageSections.forEach((section, i) => {
        const next = pageSections[i + 1] ? pageSections[i + 1].offsetTop : Infinity;
        if (probe >= section.offsetTop && probe < next) active = section.id;
    });
    return active;
}

/* ============================================================
   DOM READY — WIRE EVERYTHING UP
   ============================================================ */
const navToggle   = document.getElementById('nav-toggle');
const navMenu     = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const langToggle  = document.getElementById('lang-toggle');
const mapThemeToggle = document.getElementById('map-theme-toggle');
const mapLangToggle  = document.getElementById('map-lang-toggle');
const sectionMap  = document.getElementById('section-map');
const mapLinks    = document.querySelectorAll('[data-map-link]');
const pageSections = document.querySelectorAll('main section[id]');
const themeToggles = [themeToggle, mapThemeToggle].filter(Boolean);
const langToggles  = [langToggle, mapLangToggle].filter(Boolean);

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Mobile nav
navToggle && navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(open));
    document.querySelector('.navbar').classList.remove('is-hidden');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Theme init
if (themeToggles.length) {
    const stored = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
    setTheme(stored || (prefersLight.matches ? 'light' : 'dark'), false);

    themeToggles.forEach(t => t.addEventListener('click', () => {
        setTheme(document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    }));

    if (!stored) {
        prefersLight.addEventListener('change', e => setTheme(e.matches ? 'light' : 'dark', false));
    }
}

// Language init
const storedLang = localStorage.getItem('language');
setLanguage(storedLang || 'es', false);

langToggles.forEach(t => t.addEventListener('click', () => {
    setLanguage(currentLanguage === 'es' ? 'en' : 'es');
}));

// Scroll listeners
window.addEventListener('scroll', updateNavbarState, { passive: true });
window.addEventListener('resize', updateNavbarState);
updateNavbarState();

// Contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const t = i18n[currentLanguage];
        const name    = this.name.value.trim();
        const email   = this.email.value.trim();
        const subject = this.subject.value.trim();
        const message = this.message.value.trim();

        if (!name || !email || !subject || !message) { alert(t.form.empty); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert(t.form.invalidEmail); return; }

        const btn = this.querySelector('button[type="submit"]');
        btn.textContent = t.form.openMail;
        btn.disabled = true;

        const body = `${t.form.mailName}: ${name}\n${t.form.mailEmail}: ${email}\n\n${message}`;
        window.location.href = `mailto:jmanzano3010@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        setTimeout(() => {
            btn.textContent = t.form.submit;
            btn.disabled = false;
            this.reset();
            document.querySelectorAll('.form-field').forEach(f => f.classList.remove('has-value'));
        }, 800);
    });
}

// DOMContentLoaded — observers + feature inits
document.addEventListener('DOMContentLoaded', () => {
    // Scroll-reveal for remaining elements (skills handled by initSkillFlip, panels by initAboutReveal)
    const revealEls = document.querySelectorAll(
        '.skill-info-item, .project-card, .about-text > p, .timeline-item, .milestone-card, .contact-content'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
        el.classList.add('slide-up');
        el.style.transitionDelay = `${Math.min(i * 45, 280)}ms`;
        observer.observe(el);
    });

    initCursor();
    initParticles();
    initScrollProgress();
    initSkillFlip();
    initProjectTilt();
    initAboutReveal();
    initSvgSeparator();
    initFloatingLabels();
    initRipple();
});

// Page load fade-in
window.addEventListener('load', () => document.body.classList.add('loaded'));
const _loadStyle = document.createElement('style');
_loadStyle.textContent = 'body{opacity:0;transition:opacity .45s ease}body.loaded{opacity:1}';
document.head.appendChild(_loadStyle);
