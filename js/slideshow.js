class Slideshow {
    constructor(container) {
        this.container = container;
        this.slidesContainer = container.querySelector('.slideshow-container');
        this.slides = container.querySelectorAll('.slide');
        this.navContainer = container.querySelector('.slide-nav');
        this.prevBtn = container.querySelector('.prev');
        this.nextBtn = container.querySelector('.next');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        if (this.slides.length <= 1) {
            if (this.prevBtn) this.prevBtn.style.display = 'none';
            if (this.nextBtn) this.nextBtn.style.display = 'none';
            if (this.navContainer) this.navContainer.style.display = 'none';
            return;
        }

        // Create navigation dots
        this.slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.navContainer.appendChild(dot);
        });

        // Add button listeners
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Add touch support
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        // Start autoplay
        this.startAutoplay();

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());

        // Pause autoplay on touch
        this.container.addEventListener('touchstart', () => this.stopAutoplay());
        this.container.addEventListener('touchend', () => this.startAutoplay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.matches(':hover')) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) this.nextSlide();
            else this.prevSlide();
        }
    }

    goToSlide(n) {
        this.currentSlide = n;
        this.slidesContainer.style.transform = `translateX(-${n * 100}%)`;
        this.updateDots();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(this.currentSlide);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(this.currentSlide);
    }

    updateDots() {
        const dots = this.navContainer.querySelectorAll('.slide-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }

    startAutoplay() {
        this.stopAutoplay();
        if (this.slides.length > 1) {
            this.autoplayInterval = setInterval(() => this.nextSlide(), 3000);
        }
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize all slideshows
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.slideshow').forEach(slideshow => {
        new Slideshow(slideshow);
    });
});
