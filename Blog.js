const searchInput = document.getElementById("post-search");
const posts = document.querySelectorAll(".post-card");
const noResults = document.getElementById("no-results");

if (searchInput) {
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.trim().toLowerCase();
		let visiblePosts = 0;

		posts.forEach((post) => {
			const matches = post.dataset.search.includes(query);
			post.hidden = !matches;
			if (matches) visiblePosts++;
		});

		noResults.hidden = visiblePosts !== 0;
	});
}

document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});
