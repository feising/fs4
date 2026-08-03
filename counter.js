/* ========================================
   菲晟科技网站 - 数字计数动画
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initCounterAnimation();
});

/* ========================================
   数字计数动画
======================================== */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    if (statNumbers.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

function animateCounter(element, target) {
    const duration = 2000; // 动画持续时间（毫秒）
    const fps = 60; // 帧率
    const frameDuration = 1000 / fps;
    const totalFrames = Math.round(duration / frameDuration);
    const startTime = performance.now();
    let frame = 0;

    function updateCounter(currentTime) {
        frame++;
        const progress = frame / totalFrames;

        // 使用缓动函数
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.round(target * easeOutQuart);

        element.textContent = currentCount;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target; // 最终值
        }
    }

    requestAnimationFrame(updateCounter);
}
