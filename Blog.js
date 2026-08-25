/* Blog search controls */
document.querySelectorAll(".title-bar-controls").forEach((controls) => {
	controls.setAttribute("aria-hidden", "true");
	controls.querySelectorAll("button").forEach((button) => {
		button.tabIndex = -1;
	});
});

const searchInput = document.getElementById("post-search");
const posts = document.querySelectorAll(".post-card");
const noResults = document.getElementById("no-results");

if (searchInput) {
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.trim().slice(0, 100).toLowerCase();
		searchInput.setCustomValidity("");
		let visiblePosts = 0;

		posts.forEach((post) => {
			const matches = post.dataset.search.includes(query);
			post.hidden = !matches;
			if (matches) visiblePosts++;
		});

		noResults.hidden = visiblePosts !== 0;
	});

	searchInput.addEventListener("invalid", () => {
		searchInput.setCustomValidity("Enter a search term or clear the search field.");
	});
}

/* Keep the footer year current */
document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});
