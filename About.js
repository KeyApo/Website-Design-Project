/* About page contact form validation */
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

if (contactForm && contactStatus) {
	contactForm.addEventListener("submit", (event) => {
		event.preventDefault();

		if (!contactForm.checkValidity()) {
			contactForm.reportValidity();
			contactStatus.textContent = "Please complete every field with valid information.";
			return;
		}

		contactStatus.textContent = "Thanks! Your message is ready to be sent.";
		contactForm.reset();
	});
}

/* Keep the footer year current */
document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});