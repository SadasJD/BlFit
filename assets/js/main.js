(function () {
    'use strict';

    const initCarousel = () => {
        const carousel = document.querySelector('.video-carousel');
        if (!carousel) {
            return;
        }

        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
        let currentIndex = 0;

        const playVideoSafely = (video) => {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    // Evita error si el navegador bloquea autoplay.
                });
            }
        };

        const updateCarousel = (newIndex) => {
            currentIndex = (newIndex + slides.length) % slides.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            slides.forEach((slide, index) => {
                const isActive = index === currentIndex;
                slide.classList.toggle('is-active', isActive);

                const video = slide.querySelector('video');
                if (!video) {
                    return;
                }

                if (isActive) {
                    playVideoSafely(video);
                } else {
                    video.pause();
                    video.currentTime = 0;
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('is-active', index === currentIndex);
            });
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));
        }

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = Number(dot.dataset.index);
                updateCarousel(index);
            });
        });

        updateCarousel(0);
    };

    const initWhatsAppModal = () => {
        const trigger = document.getElementById('join-now-trigger');
        const modal = document.getElementById('whatsapp-modal');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('modal-cancel');
        const confirmBtn = document.getElementById('modal-confirm');

        if (!trigger || !modal || !closeBtn || !cancelBtn || !confirmBtn) {
            return;
        }

        const whatsappUrl = trigger.dataset.whatsappUrl;

        const openModal = () => {
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            confirmBtn.focus();
        };

        const closeModal = () => {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            trigger.focus();
        };

        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            openModal();
        });

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        confirmBtn.addEventListener('click', () => {
            closeModal();
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    };

    initCarousel();
    initWhatsAppModal();
})();
