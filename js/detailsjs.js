document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            thumbnails.forEach(tn => tn.classList.remove('active'));
            thumbnail.classList.add('active');
            mainImage.src = thumbnail.src;
        });
    });
});
