/* ========================================
   菲晟科技网站 - 主交互脚本
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initHamburgerMenu();
    initNavbarScroll();
    initSmoothScroll();
    initProductNav();
    initFaqAccordion();
    initContactForm();
    initScrollAnimations();
});

/* ========================================
   汉堡菜单功能
======================================== */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) return;

    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        navMenu.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = '-' + window.scrollY + 'px';
    }

    function closeMenu() {
        const scrollY = document.body.style.top;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navMenu.style.pointerEvents = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    // 点击汉堡菜单切换
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // 点击菜单链接后关闭菜单
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // 点击菜单外部区域关闭菜单
    navMenu.addEventListener('click', function(e) {
        if (e.target === navMenu) {
            closeMenu();
        }
    });

    // 窗口调整时，如果屏幕变大则关闭菜单
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ESC键关闭菜单
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ========================================
   导航栏滚动效果
======================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar || navbar.classList.contains('navbar-light')) return;

    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // 添加/移除滚动样式
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }

    // 使用节流
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // 初始检查
    handleScroll();
}

/* ========================================
   平滑滚动
======================================== */
function initSmoothScroll() {
    // 为所有带hash的链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const productNavHeight = document.querySelector('.product-nav-section')?.offsetHeight || 0;
                const totalOffset = navbarHeight + productNavHeight + 20;

                const targetPosition = targetElement.getBoundingClientRect().top
                    + window.scrollY
                    - totalOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 更新URL hash
                history.pushState(null, null, targetId);
            }
        });
    });

    // 页面加载时检查hash（处理跨页面锚点跳转）
    if (window.location.hash) {
        // 先跳到顶部，等待页面完全渲染后再定位
        window.scrollTo(0, 0);
        setTimeout(function() {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const productNavHeight = document.querySelector('.product-nav-section')?.offsetHeight || 0;
                const totalOffset = navbarHeight + productNavHeight + 20;

                window.scrollTo({
                    top: targetElement.offsetTop - totalOffset,
                    behavior: 'smooth'
                });
            }
        }, 300);
    }
}

/* ========================================
   产品导航高亮
======================================== */
function initProductNav() {
    const productNavItems = document.querySelectorAll('.product-nav-item');
    const productCategories = document.querySelectorAll('.product-category');

    if (productNavItems.length === 0 || productCategories.length === 0) return;

    let isClickScrolling = false;
    let clickScrollTimer = null;

    // 点击导航项
    productNavItems.forEach(item => {
        item.addEventListener('click', function() {
            productNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // 点击后暂停滚动高亮更新，等待平滑滚动完成
            isClickScrolling = true;
            clearTimeout(clickScrollTimer);
            clickScrollTimer = setTimeout(function() {
                isClickScrolling = false;
            }, 1200);
        });
    });

    // 滚动时高亮对应导航项
    function highlightNavOnScroll() {
        if (isClickScrolling) return;

        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const productNavHeight = document.querySelector('.product-nav-section')?.offsetHeight || 0;
        const scrollPosition = window.scrollY + navbarHeight + productNavHeight + 40;

        let activeCategory = null;

        productCategories.forEach(category => {
            const categoryTop = category.offsetTop;
            const categoryBottom = categoryTop + category.offsetHeight;

            if (scrollPosition >= categoryTop && scrollPosition < categoryBottom) {
                activeCategory = category.getAttribute('id');
            }
        });

        if (activeCategory) {
            productNavItems.forEach(nav => {
                nav.classList.remove('active');
                const navHash = nav.getAttribute('href').split('#')[1];
                if (navHash === activeCategory) {
                    nav.classList.add('active');
                }
            });
        }
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                highlightNavOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ========================================
   FAQ手风琴
======================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // 关闭其他FAQ项
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // 切换当前项
            item.classList.toggle('active');
        });
    });
}

/* ========================================
   联系表单处理
======================================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 获取表单数据
        const formData = new FormData(contactForm);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // 简单验证
        let isValid = true;
        const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];

        requiredFields.forEach(field => {
            const input = contactForm.querySelector(`[name="${field}"]`);
            if (!data[field] || data[field].trim() === '') {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailInput = contactForm.querySelector('[name="email"]');
        if (data.email && !emailRegex.test(data.email)) {
            emailInput.classList.add('error');
            isValid = false;
        }

        // 手机号简单验证
        const phoneRegex = /^[\d\s\-+()]{8,}$/;
        const phoneInput = contactForm.querySelector('[name="phone"]');
        if (data.phone && !phoneRegex.test(data.phone)) {
            phoneInput.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // 模拟提交
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            // 模拟API调用
            setTimeout(function() {
                submitBtn.textContent = '提交成功！';
                submitBtn.style.background = 'var(--success)';

                // 重置表单
                setTimeout(function() {
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;

                    alert('感谢您的咨询！我们会尽快与您联系。');
                }, 1500);
            }, 1000);
        } else {
            alert('请填写所有必填项，并确保格式正确。');
        }
    });

    // 输入时移除错误样式
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

/* ========================================
   滚动显示动画
======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .product-card, .stat-item, .process-item, ' +
        '.product-detail-card, .culture-card, .history-item, ' +
        '.cert-card, .team-card, .contact-card'
    );

    if (animatedElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 直接显示元素，不使用基于索引的延迟
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

/* ========================================
   工具函数
======================================== */

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}
