document.addEventListener('DOMContentLoaded', () => {

    // Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ==========================================================================
       Theme Toggle (Dark/Light Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Default to dark as requested in prompt
        html.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
        localStorage.setItem('theme', 'dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'ri-sun-line';
        } else {
            themeIcon.className = 'ri-moon-line';
        }
    }

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ==========================================================================
       Navbar Scroll Effect & Active Link Highlight
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       Typing Animation (Typed.js)
       ========================================================================== */
    if (document.querySelector('.role-typing')) {
        new Typed('.role-typing', {
            strings: [
                'Full-Stack Developer',
                'Angular Enthusiast',
                'Laravel Developer',
                'Micro Frontend Architect'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }

    /* ==========================================================================
       Scroll Animations (Intersection Observer)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left');
    const progressLines = document.querySelectorAll('.progress-line');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');

                // If it's a skill section, animate progress bars
                if (entry.target.classList.contains('skill-category')) {
                    const bars = entry.target.querySelectorAll('.progress-line');
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Contact Form handler moved to inline script in index.html to bypass browser caching issues.

    /* ==========================================================================
       Dynamic Stats Counter (Calculates directly from DOM HTML)
       ========================================================================== */
    function calculateExperienceYears() {
        const dates = document.querySelectorAll('#experience .timeline-date');
        if (!dates.length) return 1;

        const monthMap = {
            'januari': 0, 'jan': 0,
            'februari': 1, 'feb': 1,
            'maret': 2, 'mar': 2,
            'april': 3, 'apr': 3,
            'mei': 4,
            'juni': 5, 'jun': 5,
            'juli': 6, 'jul': 6,
            'agustus': 7, 'agu': 7, 'agt': 7,
            'september': 8, 'sep': 8,
            'oktober': 9, 'okt': 9,
            'november': 10, 'nov': 10,
            'desember': 11, 'des': 11
        };

        let totalMonths = 0;

        dates.forEach(el => {
            const text = el.textContent.toLowerCase().trim();
            const parts = text.split('-');
            if (parts.length === 2) {
                const startPart = parts[0].trim().split(/\s+/);
                const endPart = parts[1].trim().split(/\s+/);

                let startMonth = 0, startYear = 2025;
                let endMonth = new Date().getMonth(), endYear = new Date().getFullYear();

                if (startPart.length >= 2) {
                    startMonth = monthMap[startPart[0]] !== undefined ? monthMap[startPart[0]] : 0;
                    startYear = parseInt(startPart[1]) || 2025;
                }

                if (endPart[0] === 'sekarang' || endPart[0] === 'present') {
                    endMonth = new Date().getMonth();
                    endYear = new Date().getFullYear();
                } else if (endPart.length >= 2) {
                    endMonth = monthMap[endPart[0]] !== undefined ? monthMap[endPart[0]] : 11;
                    endYear = parseInt(endPart[1]) || 2026;
                }

                const months = (endYear * 12 + endMonth) - (startYear * 12 + startMonth) + 1;
                if (months > 0) totalMonths += months;
            }
        });

        return Math.max(1, Math.round(totalMonths / 12));
    }

    function initDynamicStats() {
        const statProjects = document.getElementById('stat-projects');
        const statExperience = document.getElementById('stat-experience');

        // 1. Hitung total proyek secara dinamis dari DOM #projects .project-card
        const projectCards = document.querySelectorAll('#projects .project-card');
        const totalProjects = projectCards.length > 0 ? projectCards.length : 7;

        // 2. Hitung tahun pengalaman secara dinamis dengan mengalkulasi durasi di #experience .timeline-date
        const totalExperience = calculateExperienceYears();

        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        let animated = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    if (statProjects) animateCounter(statProjects, totalProjects, '+');
                    if (statExperience) animateCounter(statExperience, totalExperience, '+');
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    function animateCounter(element, target, suffix = '') {
        let current = 0;
        const duration = 1200; // 1.2 detik
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                element.textContent = `${Math.floor(current)}${suffix}`;
                clearInterval(timer);
            } else {
                element.textContent = `${Math.floor(current)}${suffix}`;
            }
        }, stepTime);
    }

    initDynamicStats();
});
