// const greeting = document.getElementById("greeting")
// greeting.style.textAlign = "center"
// greeting.style.marginTop = "50px"
// const username = window.prompt("Hello! What's your name?", "Your_Name")
// greeting.textContent = "Welcome to my website, "+ username + ".  I am so glad you are here!" 


// Stacylyn Love Burnett Website
document.addEventListener("DOMContentLoaded", function () {
    // Find all navigation links
    const navLinks = document.querySelectorAll("nav a");
    //Add a click event to each link
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            console.log("Navigation clicked:", link.textContent)
        })
    })
})

//   SHARED PHOTO GALLERY - VIEW ALL BUTTON
document.addEventListener("DOMContentLoaded", function () {
    const galleries = document.querySelectorAll(".lightbox-gallery");
    galleries.forEach(function (gallery) {
        const section = gallery.closest("section");
        const viewAllButton = section?.querySelector(".boheme-view-all");
        const extraPhotos = gallery.querySelectorAll(".extra-photo");

        if (!viewAllButton || extraPhotos.length === 0) {return;}
        viewAllButton.addEventListener("click", function () {
            const isExpanded =
                viewAllButton.getAttribute("aria-expanded") === "true";
            extraPhotos.forEach(function (photo) {
                photo.hidden = isExpanded;
            });
            viewAllButton.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );
            viewAllButton.textContent = isExpanded
                ? "View All Photographs"
                : "Show Fewer Photographs";
        });
    });
});

/* ===========================================
   SHARED PHOTO LIGHTBOX
=========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const galleries = document.querySelectorAll(".lightbox-gallery");
    if (galleries.length === 0) return;

    // Create the full-screen lightbox
    const lightbox = document.createElement("div");
    lightbox.className = "photo-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Photograph viewer");

    lightbox.innerHTML = `
        <button type="button" class="photo-lightbox-close"
                aria-label="Close photograph">&times;</button>

        <button type="button" class="photo-lightbox-prev"
                aria-label="Previous photograph">&#10094;</button>

        <img class="photo-lightbox-image" alt="">

        <button type="button" class="photo-lightbox-next"
                aria-label="Next photograph">&#10095;</button>

        <div class="photo-lightbox-caption"></div>
        <div class="photo-lightbox-counter"></div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".photo-lightbox-image");
    const caption = lightbox.querySelector(".photo-lightbox-caption");
    const counter = lightbox.querySelector(".photo-lightbox-counter");
    const closeButton = lightbox.querySelector(".photo-lightbox-close");
    const prevButton = lightbox.querySelector(".photo-lightbox-prev");
    const nextButton = lightbox.querySelector(".photo-lightbox-next");

    let currentPhotos = [];
    let currentIndex = 0;
    let lastFocusedElement = null;

    function showPhoto(index) {
        if (currentPhotos.length === 0) return;

        currentIndex =
            (index + currentPhotos.length) % currentPhotos.length;

        const photo = currentPhotos[currentIndex];
        const image = photo.querySelector("img");

        if (!image) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        caption.textContent =
            image.dataset.caption || image.alt || "";

        counter.textContent =
            `${currentIndex + 1} / ${currentPhotos.length}`;
    }

    function openLightbox(gallery, index) {
        currentPhotos = Array.from(
            gallery.querySelectorAll(".lightbox-trigger")
        );

        if (currentPhotos.length === 0) return;

        lastFocusedElement = document.activeElement;

        showPhoto(index);

        lightbox.classList.add("is-open");
        document.body.classList.add("lightbox-open");

        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        document.body.classList.remove("lightbox-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // Clicking a gallery thumbnail
    galleries.forEach(function (gallery) {
        const photos = gallery.querySelectorAll(".lightbox-trigger");

        photos.forEach(function (photo, index) {
            photo.addEventListener("click", function () {
                openLightbox(gallery, index);
            });
        });
    });

    // Previous and next arrows
    prevButton.addEventListener("click", function () {
        showPhoto(currentIndex - 1);
    });

    nextButton.addEventListener("click", function () {
        showPhoto(currentIndex + 1);
    });

    // Close button
    closeButton.addEventListener("click", closeLightbox);

    // Click outside the photograph to close
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            showPhoto(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            showPhoto(currentIndex + 1);
        }
    });

    // Photo references inside the Behind the Scenes article
    document.querySelectorAll(".photo-reference[data-photo]")
        .forEach(function (reference) {
            reference.addEventListener("click", function (event) {
                const gallery = document.querySelector(
                    reference.getAttribute("href")
                );

                if (!gallery) return;

                const photoNumber = Number(reference.dataset.photo);
                const totalPhotos =
                    gallery.querySelectorAll(".lightbox-trigger").length;

                if (!Number.isInteger(photoNumber) ||
                    photoNumber < 1 ||
                    photoNumber > totalPhotos) return;

                event.preventDefault();
                openLightbox(gallery, photoNumber - 1);
            });
        });

});

/* ===========================================
   LA BOHEME - PERFORMANCE VIDEO SELECTOR
   Hover to preview, click to select
   =========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Find the large video player and its title
    const videoPlayer = document.querySelector("#bohemeFeaturedVideo");
    const videoTitle = document.querySelector("#bohemeVideoTitle");

    // Find the three video thumbnails
    const videoChoices = document.querySelectorAll(".boheme-video-choice");

    // Only run this code on pages with a video gallery
    if (!videoPlayer || !videoTitle || videoChoices.length === 0) {
        return;
    }

    // Change the video shown in the large player
    function selectVideo(choice) {

        const videoURL = choice.dataset.video;
        const title = choice.dataset.title;

        if (!videoURL) return;

        // Only reload the player when changing videos
        if (videoPlayer.getAttribute("src") !== videoURL) {
            videoPlayer.src = videoURL;
        }

        // Update the title beneath the player
        videoTitle.textContent = title;

        // Highlight the selected thumbnail
        videoChoices.forEach(function (button) {
            button.classList.remove("active");
        });

        choice.classList.add("active");
    }

    // Connect each thumbnail to the large player
    videoChoices.forEach(function (choice) {

        // Desktop: hovering changes the featured video
        choice.addEventListener("mouseenter", function () {
            selectVideo(choice);
        });

        // Desktop and mobile: clicking selects the video
        choice.addEventListener("click", function () {
            selectVideo(choice);
        });
    });
});

