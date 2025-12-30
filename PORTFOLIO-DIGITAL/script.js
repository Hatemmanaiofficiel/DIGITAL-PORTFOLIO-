const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const filterButtons = document.querySelectorAll('.filter-btn');
const certificationCards = document.querySelectorAll('.cert-card');
const statsNumbers = document.querySelectorAll('.stat-number');
const currentYearSpan = document.getElementById('current-year');
const animateElements = document.querySelectorAll('.animate');
const skillBars = document.querySelectorAll('.skill-level');

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initMobileMenu();
    initCertificationFilter();
    initCounterAnimation();
    initSkillBarAnimation();
    updateCurrentYear();
    initScrollAnimations();
});

function initCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll(
        'a, button, .cert-card, .project-card, .contact-card, .highlight'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

function initMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    });
}

function initCertificationFilter() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            certificationCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statsNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.count);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        stat.textContent = Math.floor(current);
                    }, 16);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) observer.observe(statsSection);
}

function initSkillBarAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const aboutSection = document.querySelector('.about-skills');
    if (aboutSection) observer.observe(aboutSection);
}

function updateCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        history.pushState(null, null, targetId);
    });
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;

        if (scrollY >= (sectionTop - headerHeight - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    setTimeout(() => {
        document.querySelectorAll('.title-line').forEach((line, index) => {
            setTimeout(() => {
                line.style.transform = 'translateY(0)';
                line.style.opacity = '1';
            }, index * 200);
        });
    }, 500);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }

    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

if (document.querySelector('.parallax')) {
    initParallax();
}

function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Basculer le thème');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });

    const header = document.querySelector('.header .container');
    if (header) {
        header.appendChild(themeToggle);
    }
}
