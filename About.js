/* About page contact form validation */
document.querySelectorAll(".title-bar-controls").forEach((controls) => {
	controls.setAttribute("aria-hidden", "true");
	controls.querySelectorAll("button").forEach((button) => {
		button.tabIndex = -1;
	});
});

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