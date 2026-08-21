/* Gallery card references */
const galleryCards = document.querySelectorAll('.gallery-card');

galleryCards.forEach((card) => {
  const img = card.querySelector('img');

  if (!img) return;

  /* Match the card ratio to the loaded image */
  const applyRatioClass = () => {
	if (!img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;

    card.classList.remove('portrait', 'square', 'landscape');

    if (ratio >= 1.5) {
      card.classList.add('landscape');
    } else if (ratio >= 0.9 && ratio < 1.1) {
      card.classList.add('square');
    } else {
      card.classList.add('portrait');
    }
  };

  if (img.complete) {
    applyRatioClass();
  } else {
    img.addEventListener('load', applyRatioClass, { once: true });
  }

  /* Hide cards whose image cannot be loaded */
  img.addEventListener("error", () => {
    card.hidden = true;
  });
});
