//////////////////////
//Name: Keymy Aponte
//Date: 8/16/2026
//Purpose: Homepage Javascript
/////////////////////


const featuredProducts = [
  {image: "Vic Blanco-Deis, Ref.png", name: "Vic Blanco-Deis Standee", price: "$10"},
  {image: "Alejandro, King of Hearts, Ref.png", name:"Alejandro Standee", price: "$10"},
  {image: "Star Globe Theater Promo, Orpheus and Pierre.png", name: "Star Globe Theater Mystery Poster", price: "$25"},
  {image: "Vampire Hunter D, Patrick Nagel Inspo Art.png", name: "VHD Patrick Nagel Style Poster", price: "$20"},
]

document.querySelectorAll(".title-bar-controls").forEach((controls) => {
  controls.setAttribute("aria-hidden", "true");
  controls.querySelectorAll("button").forEach((button) => {
    button.tabIndex = -1;
  });
});

/* Render the featured product cards */
/* =========================================
  Display Products
========================================= */
const productsContainer = document.getElementById("productsContainer");

if (productsContainer) {
    let productIndex = 0;
    let html = "";

    while (productIndex < featuredProducts.length) {
        const product = featuredProducts[productIndex];

        html += `
            <article class="card">
            <div class="title-bar">
              <div class="title-bar-text">${product.name}</div>
              <div class="title-bar-controls" aria-label="window controls">
                <button type="button" aria-label="Minimize"></button>
                <button type="button" aria-label="Restore"></button>
                <button type="button" aria-label="Close"></button>
              </div>
            </div>
                <img src="Images/${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
            </article>
        `;

        productIndex++;
    }
    productsContainer.innerHTML = html;
    document.querySelectorAll(".title-bar-controls").forEach((controls) => {
      controls.setAttribute("aria-hidden", "true");
      controls.querySelectorAll("button").forEach((button) => {
        button.tabIndex = -1;
      });
    });
}


/* =========================================
  Detect Image Dimensions
========================================= */
document.querySelectorAll('.mySlides img').forEach(img => {
  img.onload = function() {
    if (this.naturalWidth === this.naturalHeight) {
      this.classList.add('square-image');
    } else {
      this.classList.add('rectangular-image');
    }
  };
  
  // If image is cached, trigger onload manually
  if (img.complete) {
    img.onload();
  }
});

/* Slideshow state and controls */
let slideIndex = 0;
let slideTimer;
const slides = document.getElementsByClassName("mySlides");
const dots = document.getElementsByClassName("dot");
const previousButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

const showSlide = (index) => {
  slideIndex = (index + slides.length) % slides.length;

  for (let slideNumber = 0; slideNumber < slides.length; slideNumber++) {
    slides[slideNumber].style.display = slideNumber === slideIndex ? "block" : "none";
    dots[slideNumber].classList.toggle("active", slideNumber === slideIndex);
    dots[slideNumber].setAttribute("aria-current", slideNumber === slideIndex ? "true" : "false");
  }
};

const scheduleSlides = () => {
  clearTimeout(slideTimer);
  slideTimer = setTimeout(() => {
    showSlide(slideIndex + 1);
    scheduleSlides();
  }, 10000);
};

const plusSlides = (step) => {
  showSlide(slideIndex + step);
  scheduleSlides();
};

const currentSlide = (slideNumber) => {
  showSlide(slideNumber - 1);
  scheduleSlides();
};

const animateControl = (control) => {
  const animationClass = control.classList.contains("slide-control")
    ? "control-clicked"
    : "dot-clicked";
  control.classList.remove(animationClass);
  void control.offsetWidth;
  control.classList.add(animationClass);
};

if (slides.length > 0) {
  showSlide(0);
  scheduleSlides();

  previousButton.addEventListener("click", () => {
    plusSlides(-1);
    animateControl(previousButton);
  });
  nextButton.addEventListener("click", () => {
    plusSlides(1);
    animateControl(nextButton);
  });
  Array.from(dots).forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide(index + 1);
      animateControl(dot);
    });
  });
}