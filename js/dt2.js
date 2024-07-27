document.addEventListener("DOMContentLoaded", function () {
    const thumbnails = document.querySelectorAll(".thumbnail");
    const mainImage = document.getElementById("main-image");

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", function () {
            const activeThumbnail = document.querySelector(".thumbnail.active");
            if (activeThumbnail) {
                activeThumbnail.classList.remove("active");
            }
            thumbnail.classList.add("active");
            mainImage.src = thumbnail.src;
        });
    });
});
