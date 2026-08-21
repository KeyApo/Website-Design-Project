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
const slides = document.getElementsByClassName("mySlides");

if (slides.length > 0) showSlides();

function showSlides() {
  let i;
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1;}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 10000); // Change image every 10 seconds
}