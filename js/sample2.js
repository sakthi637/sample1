document.addEventListener('DOMContentLoaded', function () {
    const galleryImages = document.querySelector('.gallery-images');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');

    let currentIndex = 0;
    let intervalId;

    function updateGallery() {
        const totalItems = galleryItems.length;
        const visibleItems = Math.floor(galleryImages.clientWidth / galleryItems[0].clientWidth);
        const itemWidth = galleryItems[0].clientWidth;

        if (currentIndex < 0) {
            currentIndex = totalItems - visibleItems;
        }
        if (currentIndex >= totalItems - visibleItems + 1) {
            currentIndex = 0;
        }

        galleryImages.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    function startAutoScroll() {
        intervalId = setInterval(function () {
            currentIndex++;
            updateGallery();
        }, 3000); // Change image every 3 seconds
    }

    function stopAutoScroll() {
        clearInterval(intervalId);
    }

    prevButton.addEventListener('click', function () {
        currentIndex--;
        updateGallery();
        stopAutoScroll();
        startAutoScroll();
    });

    nextButton.addEventListener('click', function () {
        currentIndex++;
        updateGallery();
        stopAutoScroll();
        startAutoScroll();
    });

    galleryImages.addEventListener('mouseenter', stopAutoScroll);
    galleryImages.addEventListener('mouseleave', startAutoScroll);

    updateGallery();
    startAutoScroll();
});
