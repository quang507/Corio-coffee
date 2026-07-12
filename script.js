/* --------------------------------------------------
   CORIO COFFEE - Interactive Logic
   -------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const icon = menuToggle.querySelector('i');
            mobileNav.classList.toggle('active');
            
            if (mobileNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                const icon = menuToggle.querySelector('i');
                mobileNav.classList.remove('active');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 2. Smooth Scrolling Active Link Spy
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 120; // offset for fixed header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // 3. Simple Form Submission Handling (Mock Checkout)
    const orderForm = document.getElementById('orderForm');
    const formSuccess = document.getElementById('formSuccess');

    if (orderForm && formSuccess) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data (for local testing/logging)
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const product = document.getElementById('product').value;
            const address = document.getElementById('address').value;

            console.log('Order received:', { name, phone, product, address });

            // Display success message and hide the form smoothly
            orderForm.style.display = 'none';
            formSuccess.classList.add('active');

            // Scroll to the checkout container to make sure success message is visible
            document.getElementById('mua-ngay').scrollIntoView({ behavior: 'smooth' });
        });
    }
});
