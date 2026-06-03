// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const mapThemeToggle = document.getElementById('map-theme-toggle');
const mapLangToggle = document.getElementById('map-lang-toggle');
const sectionMap = document.getElementById('section-map');
const mapLinks = document.querySelectorAll('[data-map-link]');
const pageSections = document.querySelectorAll('main section[id]');
const themeToggles = [themeToggle, mapThemeToggle].filter(Boolean);
const langToggles = [langToggle, mapLangToggle].filter(Boolean);
let currentLanguage = 'es';
let heroTypingTimer = null;
let heroTypingRun = 0;

const i18n = {
    es: {
        siteTitle: 'JavierM - Portfolio',
        skipLink: 'Saltar al contenido principal',
        nav: {
            home: 'Inicio',
            about: 'Sobre Mí',
            skills: 'Habilidades',
            studies: 'Estudios',
            work: 'Trabajo',
            projects: 'Proyectos',
            contact: 'Contacto'
        },
        map: {
            home: 'Inicio',
            about: 'Sobre mí',
            skills: 'Habilidades',
            studies: 'Estudios',
            work: 'Trabajo',
            projects: 'Proyectos',
            contact: 'Contacto'
        },
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
            panelTitle: 'Perfil rápido',
            points: [
                '2º de DAW, mejorando cada semana con práctica constante.',
                'Me gusta entender arquitectura, lógica y cómo escalan los proyectos.',
                'Buen encaje en equipo, comunicación directa y ganas de aportar.'
            ],
            socialTitle: 'Social Skills',
            socialItems: [
                'Trabajo en equipo',
                'Resolución de problemas',
                'Responsabilidad en el equipo',
                'Buenas habilidades de comunicación',
                'Organización y puntualidad',
                'Liderazgo'
            ],
            focus: [
                'Objetivo: primer rol como dev junior',
                'Intereses: anime, gaming y música',
                'Extra: parkour y pádel'
            ]
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
            titles: [
                'Grado Medio TECO',
                'Grado Superior Enseñanza y Animación',
                'Grado Superior ADAITS Desarrollo de Aplicaciones Web',
                'Idiomas'
            ],
            descriptions: [
                '2017-09 - 2019-06 · CESUR, Sevilla.',
                '2019-09 - 2021-06 · CESUR, Sevilla.',
                '2024 - 2026 · ADAITS.',
                'Español nativo, Inglés B2.'
            ]
        },
        work: {
            dates: [
                '2023-02 - 2023-05 / 2018-09 - 2019-05',
                '2020-08 - 2023-01',
                '2023-04 - 2024-09',
                '2021-11 - Actualidad'
            ],
            titles: [
                'Monitor de tiempo libre - BOSQUE SUSPENDIDO, Sevilla',
                'Monitor de tiempo libre - Universo Parkour, Sevilla',
                'Carretillero - RHENUS LOGISTICS (EUROFIRMS), Sevilla',
                'Camarero - Asador Montequinto, Sevilla'
            ],
            descriptions: [
                'Montura y recogida de material de trabajo, supervisión durante las actividades, apoyo y orientación a participantes y planificación de contingencias.',
                'Orientación y apoyo en etapa deportiva, planificación de actividades, alimentación y retroalimentación, supervisión de emergencias, adaptación a nuevas situaciones y participación en proyectos de gran escala.',
                'Control de maquinaria, carga y descarga de camiones y uso de pistola de picking.',
                'Colocación y recogida de mesas, servicio de menús para 15-30 personas, bebidas y comidas en mesa, apoyo de limpieza en cocina y preparación de menús.'
            ]
        },
        projects: {
            badges: ['Web App', 'API', 'Diseño Web'],
            titles: ['Alquiler de Coches Programación', 'OnePiece API', 'Alquier de Coches Lenguaje De Marca'],
            descriptions: [
                'Trabajo de programación sobre alquileres de coches, centrado en la gestión básica de reservas y catálogo.',
                'API para consultar informacion del universo One Piece con endpoints dedicados a personajes, tripulaciones y busquedas.',
                'Proyecto final de Lenguaje de Marcas con foco en HTML y CSS, maquetación limpia y estructura semántica.'
            ],
            codeButton: 'Código'
        },
        contact: {
            heading: '¡Trabajemos juntos!',
            description: 'Estoy siempre interesado en nuevos proyectos y oportunidades. No dudes en contactarme.',
            location: 'Sevilla, España'
        },
        footer: '© 2025 Javier Manzano Oliveros. Todos los derechos reservados.',
        form: {
            name: 'Tu nombre',
            email: 'Tu email',
            subject: 'Asunto',
            message: 'Tu mensaje',
            submit: 'Enviar Mensaje',
            openMail: 'Abriendo correo...',
            empty: 'Por favor, completa todos los campos.',
            invalidEmail: 'Por favor, ingresa un email válido.',
            mailName: 'Nombre',
            mailEmail: 'Email'
        },
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
        nav: {
            home: 'Home',
            about: 'About',
            skills: 'Skills',
            studies: 'Studies',
            work: 'Work',
            projects: 'Projects',
            contact: 'Contact'
        },
        map: {
            home: 'Home',
            about: 'About',
            skills: 'Skills',
            studies: 'Studies',
            work: 'Work',
            projects: 'Projects',
            contact: 'Contact'
        },
        heroPrefix: 'Hi, I am ',
        heroHighlight: 'Manzano',
        heroSubtitle: 'Creative developer passionate about technology',
        heroDescription: 'Focused on building unique digital experiences and innovative solutions',
        heroPills: ['Junior Full Stack', 'Fast learner', 'Team player'],
        heroButtons: ['View Projects', 'Contact'],
        sectionTitles: ['About Me', 'Skills', 'Studies', 'Work', 'Featured Projects', 'Contact'],
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
            socialItems: [
                'Teamwork',
                'Problem solving',
                'Team responsibility',
                'Strong communication skills',
                'Organization and punctuality',
                'Leadership'
            ],
            focus: [
                'Goal: first junior developer role',
                'Interests: anime, gaming and music',
                'Extra: parkour and padel'
            ]
        },
        skills: {
            categoryTitles: ['Frontend', 'Backend and logic', 'Tools'],
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
            titles: [
                'Intermediate Vocational Degree TECO',
                'Higher Vocational Degree Sports Teaching and Animation',
                'Higher Vocational Degree ADAITS Web Application Development',
                'Languages'
            ],
            descriptions: [
                '2017-09 - 2019-06 · CESUR, Seville.',
                '2019-09 - 2021-06 · CESUR, Seville.',
                '2024 - 2026 · ADAITS.',
                'Native Spanish, English B2.'
            ]
        },
        work: {
            dates: [
                '2023-02 - 2023-05 / 2018-09 - 2019-05',
                '2020-08 - 2023-01',
                '2023-04 - 2024-09',
                '2021-11 - Present'
            ],
            titles: [
                'Leisure Activity Instructor - BOSQUE SUSPENDIDO, Seville',
                'Leisure Activity Instructor - Universo Parkour, Seville',
                'Forklift Operator - RHENUS LOGISTICS (EUROFIRMS), Seville',
                'Waiter - Asador Montequinto, Seville'
            ],
            descriptions: [
                'Work material setup and collection, activity supervision, participant support and contingency planning.',
                'Sports support and guidance, activity planning, nutrition and feedback, emergency supervision, adaptation support and participation in large-scale projects.',
                'Machinery control, truck loading/unloading and picking gun usage.',
                'Table setup and clearing, service for 15-30 person menus, food and drinks service, kitchen cleaning support and menu preparation.'
            ]
        },
        projects: {
            badges: ['Web App', 'API', 'Web Design'],
            titles: ['Car Rental Programming', 'OnePiece API', 'Car Rental Markup Language'],
            descriptions: [
                'Programming assignment about car rentals, focused on basic reservation and catalog management.',
                'API to explore the One Piece universe with dedicated endpoints for characters, crews and searches.',
                'Final Markup Language project focused on HTML and CSS, clean layout and semantic structure.'
            ],
            codeButton: 'Code'
        },
        contact: {
            heading: 'Let us work together!',
            description: 'I am always interested in new projects and opportunities. Feel free to contact me.',
            location: 'Seville, Spain'
        },
        footer: '© 2025 Javier Manzano Oliveros. All rights reserved.',
        form: {
            name: 'Your name',
            email: 'Your email',
            subject: 'Subject',
            message: 'Your message',
            submit: 'Send Message',
            openMail: 'Opening email...',
            empty: 'Please complete all fields.',
            invalidEmail: 'Please enter a valid email.',
            mailName: 'Name',
            mailEmail: 'Email'
        },
        navToggleLabel: 'Open navigation menu',
        navAria: 'Main navigation',
        mapAria: 'Section map',
        profileAlt: 'JManzanoO - Profile photo',
        themeToggleLight: 'Switch to light mode',
        themeToggleDark: 'Switch to dark mode',
        langToggleLabel: 'Cambiar idioma a español'
    }
};

function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

function setPlaceholder(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute('placeholder', value);
    }
}

function setTextList(selector, values) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        if (values[index] !== undefined) {
            element.textContent = values[index];
        }
    });
}

function setIconTextList(selector, values) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        if (values[index] === undefined) {
            return;
        }
        const icon = element.querySelector('i');
        if (!icon) {
            element.textContent = values[index];
            return;
        }
        element.innerHTML = `${icon.outerHTML} ${values[index]}`;
    });
}

function updateLanguageToggle() {
    if (!langToggles.length) {
        return;
    }
    const isEnglish = currentLanguage === 'en';
    langToggles.forEach((toggle) => {
        toggle.textContent = isEnglish ? 'ES' : 'EN';
        toggle.setAttribute('aria-label', i18n[currentLanguage].langToggleLabel);
    });
}

function applyLanguage(lang) {
    currentLanguage = lang === 'en' ? 'en' : 'es';
    document.documentElement.lang = currentLanguage;

    const t = i18n[currentLanguage];
    document.title = t.siteTitle;

    setText('.skip-link', t.skipLink);
    const navElement = document.querySelector('.navbar');
    if (navElement) {
        navElement.setAttribute('aria-label', t.navAria);
    }
    if (sectionMap) {
        sectionMap.setAttribute('aria-label', t.mapAria);
    }
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.setAttribute('alt', t.profileAlt);
    }

    setText('.nav-link[href="#home"]', t.nav.home);
    setText('.nav-link[href="#about"]', t.nav.about);
    setText('.nav-link[href="#skills"]', t.nav.skills);
    setText('.nav-link[href="#studies"]', t.nav.studies);
    setText('.nav-link[href="#work"]', t.nav.work);
    setText('.nav-link[href="#projects"]', t.nav.projects);
    setText('.nav-link[href="#contact"]', t.nav.contact);

    setText('[data-map-link="home"] .map-label', t.map.home);
    setText('[data-map-link="about"] .map-label', t.map.about);
    setText('[data-map-link="skills"] .map-label', t.map.skills);
    setText('[data-map-link="studies"] .map-label', t.map.studies);
    setText('[data-map-link="work"] .map-label', t.map.work);
    setText('[data-map-link="projects"] .map-label', t.map.projects);
    setText('[data-map-link="contact"] .map-label', t.map.contact);

    setText('.hero-subtitle', t.heroSubtitle);
    setText('.hero-description', t.heroDescription);

    const heroPills = document.querySelectorAll('.hero-pill');
    heroPills.forEach((pill, index) => {
        const icon = pill.querySelector('i');
        if (!icon || !t.heroPills[index]) {
            return;
        }
        pill.innerHTML = `${icon.outerHTML} ${t.heroPills[index]}`;
    });

    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((button, index) => {
        if (t.heroButtons[index]) {
            button.textContent = t.heroButtons[index];
        }
    });

    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title, index) => {
        if (t.sectionTitles[index]) {
            title.textContent = t.sectionTitles[index];
        }
    });

    setIconTextList('.profile-badge', [t.profileLocation]);
    setTextList('.about-text > p', t.about.paragraphs);
    setText('.about-panel h3', t.about.panelTitle);
    setIconTextList('.profile-points li', t.about.points);
    setText('.about-panel--skills h3', t.about.socialTitle);
    setIconTextList('.social-skills-list li', t.about.socialItems);
    setIconTextList('.about-focus span', t.about.focus);

    const skillCategoryTitles = document.querySelectorAll('.skill-category h3');
    skillCategoryTitles.forEach((title, index) => {
        if (t.skills.categoryTitles[index] === undefined) {
            return;
        }
        const icon = title.querySelector('i');
        if (!icon) {
            title.textContent = t.skills.categoryTitles[index];
            return;
        }
        title.innerHTML = `${icon.outerHTML} ${t.skills.categoryTitles[index]}`;
    });
    setIconTextList('.skill-info-item', t.skills.items);

    setTextList('#studies .milestone-card h3', t.studies.titles);
    setTextList('#studies .milestone-card p', t.studies.descriptions);

    setTextList('#work .timeline-date', t.work.dates);
    setTextList('#work .timeline-card h3', t.work.titles);
    setTextList('#work .timeline-description', t.work.descriptions);

    setTextList('.project-badge', t.projects.badges);
    setTextList('.project-content h3', t.projects.titles);
    setTextList('.project-content p', t.projects.descriptions);
    setTextList('.project-links .btn', [t.projects.codeButton, t.projects.codeButton, t.projects.codeButton]);

    setText('.contact-info h3', t.contact.heading);
    setText('.contact-info p', t.contact.description);
    const contactItems = document.querySelectorAll('.contact-item span');
    if (contactItems[2]) {
        contactItems[2].textContent = t.contact.location;
    }
    setText('.footer p', t.footer);

    setPlaceholder('#name', t.form.name);
    setPlaceholder('#email', t.form.email);
    setPlaceholder('#subject', t.form.subject);
    setPlaceholder('#message', t.form.message);
    setText('.contact-form button[type="submit"]', t.form.submit);

    if (navToggle) {
        navToggle.setAttribute('aria-label', t.navToggleLabel);
    }

    updateThemeToggle(document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    renderHeroTitle();
    updateLanguageToggle();
}

function setLanguage(lang, persist = true) {
    applyLanguage(lang);
    if (persist) {
        localStorage.setItem('language', currentLanguage);
    }
}

function setActiveSection(id) {
    document.querySelectorAll('.nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
    });
    mapLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('data-map-link') === id);
    });
}

function getCurrentSectionId() {
    const navHeightValue = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
    const navHeight = parseFloat(navHeightValue) || 70;
    const probeY = window.scrollY + navHeight + (window.innerHeight * 0.28);

    let activeId = pageSections[0] ? pageSections[0].id : 'home';

    pageSections.forEach((section, index) => {
        const currentTop = section.offsetTop;
        const nextTop = pageSections[index + 1] ? pageSections[index + 1].offsetTop : Number.POSITIVE_INFINITY;
        if (probeY >= currentTop && probeY < nextTop) {
            activeId = section.id;
        }
    });

    return activeId;
}

function updateThemeToggle(theme) {
    if (!themeToggles.length) {
        return;
    }

    const isLight = theme === 'light';
    themeToggles.forEach((toggle) => {
        toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        toggle.setAttribute('aria-label', isLight ? i18n[currentLanguage].themeToggleDark : i18n[currentLanguage].themeToggleLight);
        toggle.innerHTML = isLight
            ? '<i class="fas fa-moon" aria-hidden="true"></i>'
            : '<i class="fas fa-sun" aria-hidden="true"></i>';
    });
}

function setTheme(theme, persist = true) {
    document.body.setAttribute('data-theme', theme);
    updateThemeToggle(theme);
    if (persist) {
        localStorage.setItem('theme', theme);
    }
}

if (themeToggles.length) {
    const storedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
    const initialTheme = storedTheme || (prefersLight && prefersLight.matches ? 'light' : 'dark');

    setTheme(initialTheme, false);

    themeToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    });

    if (!storedTheme && prefersLight) {
        prefersLight.addEventListener('change', (event) => {
            setTheme(event.matches ? 'light' : 'dark', false);
        });
    }
}

const storedLanguage = localStorage.getItem('language');
setLanguage(storedLanguage || 'es', false);

if (langToggles.length) {
    langToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const nextLanguage = currentLanguage === 'es' ? 'en' : 'es';
            setLanguage(nextLanguage);
        });
    });
}

navToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.remove('is-hidden');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Navbar state on scroll
const updateNavbarState = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }
    const currentScrollY = window.scrollY;

    navbar.classList.toggle('is-scrolled', currentScrollY > 50);
    navbar.classList.toggle('is-hidden', currentScrollY > 0);

    if (sectionMap) {
        sectionMap.classList.toggle('is-visible', currentScrollY > 180);
    }

    setActiveSection(getCurrentSectionId());
};

window.addEventListener('scroll', updateNavbarState);
window.addEventListener('resize', updateNavbarState);
updateNavbarState();

setActiveSection(getCurrentSectionId());

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements for scroll reveal
    const animateElements = document.querySelectorAll('.skill-category, .skill-info-item, .project-card, .about-content, .about-panel, .about-focus, .timeline-item, .milestone-card, .contact-content');
    animateElements.forEach((el, index) => {
        el.classList.add('slide-up');
        if (index < 16) {
            el.style.transitionDelay = `${Math.min(index * 50, 320)}ms`;
        }
        observer.observe(el);
    });

});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !subject || !message) {
            alert(i18n[currentLanguage].form.empty);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert(i18n[currentLanguage].form.invalidEmail);
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = i18n[currentLanguage].form.openMail;
        submitBtn.disabled = true;

        const mailBody = `${i18n[currentLanguage].form.mailName}: ${name}\n${i18n[currentLanguage].form.mailEmail}: ${email}\n\n${message}`;
        const mailto = `mailto:jmanzano3010@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
        window.location.href = mailto;

        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        this.reset();
    });
}
// Typing animation for hero title
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
        const charSpan = document.createElement('span');
        charSpan.className = 'highlight-char';
        charSpan.textContent = char === ' ' ? '\u00A0' : char;
        charSpan.style.animationDelay = `${index * 80}ms`;
        highlight.appendChild(charSpan);
    });

    element.appendChild(highlight);
}

function typeWriterHeading(element, prefixText, highlightText, speed = 100) {
    heroTypingRun += 1;
    const runId = heroTypingRun;
    if (heroTypingTimer) {
        clearTimeout(heroTypingTimer);
        heroTypingTimer = null;
    }

    let i = 0;
    element.textContent = '';
    const textNode = document.createTextNode('');
    element.appendChild(textNode);

    function type() {
        if (runId !== heroTypingRun) {
            return;
        }
        if (i < prefixText.length) {
            textNode.textContent += prefixText.charAt(i);
            i++;
            heroTypingTimer = setTimeout(type, speed);
            return;
        }

        if (highlightText) {
            addAnimatedHighlight(element, highlightText);
        }
    }

    type();
}

function renderHeroTitle() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) {
        return;
    }
    typeWriterHeading(heroTitle, i18n[currentLanguage].heroPrefix, i18n[currentLanguage].heroHighlight, 50);
}

// Parallax effect for hero section (desktop only)
function updateHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) {
        return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.innerWidth >= 992;

    if (!isDesktop || reduceMotion) {
        hero.style.transform = 'none';
        return;
    }

    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    hero.style.transform = `translateY(${rate}px)`;
}

window.addEventListener('scroll', updateHeroParallax);
window.addEventListener('resize', updateHeroParallax);
updateHeroParallax();

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);
