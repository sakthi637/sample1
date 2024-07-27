document.addEventListener('DOMContentLoaded', () => {
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function showSlide(index) {
        const offset = -index * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        showSlide(currentIndex);
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showSlide(currentIndex);
    }

    document.querySelector('.carousel-next').addEventListener('click', showNextSlide);
    document.querySelector('.carousel-prev').addEventListener('click', showPrevSlide);
    dots.forEach((dot, index) => dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
    }));

    setInterval(showNextSlide, 3000); // Change image every 3 seconds
});
