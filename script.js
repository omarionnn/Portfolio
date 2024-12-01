document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true
    });

    // Navigation
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const profileLink = document.querySelector('.profile-link');

    // Function to handle navigation
    const handleNavigation = (targetId) => {
        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${targetId}`) {
                link.classList.add('active');
            }
        });
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
                section.classList.add('fade-in');
            }
        });

        // Smooth scroll to section
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    };

    // Handle profile image click
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavigation('home');
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            navLinksContainer.classList.remove('active');
        }
    });

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            handleNavigation(targetId);

            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !menuBtn.contains(e.target)) {
            navLinksContainer.classList.remove('active');
        }
    });

    // Handle scroll events for navbar
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
});
