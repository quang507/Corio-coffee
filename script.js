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

    // 4. Lead Modal Popup Logic
    const leadModal = document.getElementById('leadModal');
    const modalClose = document.getElementById('modalClose');
    const modalForm = document.getElementById('modalForm');
    const modalSuccess = document.getElementById('modalSuccess');
    const modalFormTitle = document.getElementById('modalFormTitle');
    const modalFormType = document.getElementById('modalFormType');
    const modalProductGroup = document.getElementById('modalProductGroup');

    // Select all CTA buttons that trigger popups
    // Includes: Hero buttons, Product cards, B2B catalogue buttons
    const orderButtons = document.querySelectorAll('a[href="#mua-ngay"]');

    const openModal = (type = 'order') => {
        if (!leadModal) return;
        
        // Reset form states
        modalForm.reset();
        modalForm.style.display = 'block';
        modalSuccess.style.display = 'none';
        modalSuccess.classList.remove('active');

        if (type === 'b2b') {
            modalFormTitle.innerText = "Yêu Cầu Mẫu Thử & Catalogue B2B";
            modalFormType.value = "b2b";
            if (modalProductGroup) modalProductGroup.style.display = 'none';
        } else {
            modalFormTitle.innerText = "Đăng Ký Đặt Hàng";
            modalFormType.value = "order";
            if (modalProductGroup) modalProductGroup.style.display = 'block';
        }

        leadModal.classList.add('active');
    };

    const closeModal = () => {
        if (leadModal) leadModal.classList.remove('active');
    };

    // Bind events for CTAs
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if it's the B2B sample request CTA
            if (btn.innerText.includes('Mẫu Thử') || btn.closest('.catalogue-section')) {
                openModal('b2b');
            } else {
                openModal('order');
            }
        });
    });

    // Also bind product card buttons directly
    const productCardButtons = document.querySelectorAll('.product-card .btn');
    productCardButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('order');
            // Pre-select product in dropdown based on index
            const selectEl = document.getElementById('modalProduct');
            if (selectEl && selectEl.options[index]) {
                selectEl.selectedIndex = index;
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (leadModal) {
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) closeModal();
        });
    }

    // 5. Form Submission Handling (Local + Web3Forms Backup)
    const handleFormSubmit = async (formElement, successElement, formData) => {
        // Visual feedback
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Đang xử lý...";
        submitBtn.disabled = true;

        console.log('Form submission payload:', formData);

        try {
            // Web3Forms service (Sends email notification instantly and free)
            // Replace with your Web3Forms access key from https://web3forms.com/
            const accessKey = "YOUR_WEB3FORMS_ACCESS_KEY_HERE"; 

            const payload = {
                access_key: accessKey,
                subject: formData.type === 'b2b' 
                    ? `[B2B CORIO] Yêu Cầu Mẫu Thử Từ: ${formData.name}`
                    : `[ĐƠN HÀNG CORIO] Đơn mới từ: ${formData.name}`,
                from_name: "CORIO Coffee Web",
                name: formData.name,
                phone: formData.phone,
                product: formData.product || "N/A (B2B Sample Kit)",
                address: formData.address,
                type: formData.type
            };

            // Attempt to send data to Web3Forms API
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('Submission api result:', result);
        } catch (error) {
            console.error('Submission background API failed, falling back to local success:', error);
        }

        // Always show success screen to user for seamless UX
        formElement.style.display = 'none';
        successElement.style.display = 'flex';
        successElement.classList.add('active');
        
        // Reset submit button state
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    };

    // Bottom static order form
    const orderForm = document.getElementById('orderForm');
    const formSuccess = document.getElementById('formSuccess');

    if (orderForm && formSuccess) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                product: document.getElementById('product').value,
                address: document.getElementById('address').value,
                type: 'order'
            };
            handleFormSubmit(orderForm, formSuccess, data);
            // Scroll to center success message
            document.getElementById('mua-ngay').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Modal popup form
    if (modalForm && modalSuccess) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('modalName').value,
                phone: document.getElementById('modalPhone').value,
                product: modalFormType.value === 'b2b' ? 'B2B Catalogue & Sample Kit' : document.getElementById('modalProduct').value,
                address: document.getElementById('modalAddress').value,
                type: modalFormType.value
            };
            handleFormSubmit(modalForm, modalSuccess, data);
        });
    }
});
