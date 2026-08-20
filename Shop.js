const products = [
	{ id: "vic-standee", image: "Vic Blanco-Deis, Ref.png", name: "Vic Blanco-Deis Standee", price: 10 },
	{ id: "alejandro-standee", image: "Alejandro, King of Hearts, Ref.png", name: "Alejandro Standee", price: 10 },
	{ id: "star-globe-poster", image: "Star Globe Theater Promo, Orpheus and Pierre.png", name: "Star Globe Theater Mystery Poster", price: 25 },
	{ id: "vhd-poster", image: "Vampire Hunter D, Patrick Nagel Inspo Art.png", name: "VHD Patrick Nagel Style Poster", price: 20 }
];

const cartStorageKey = "neonreflections-cart";
const productsGrid = document.getElementById("products-grid");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutLink = document.getElementById("checkout-link");
const clearCartButton = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");

const formatPrice = (price) => `$${price}`;

const saveCart = () => {
	localStorage.setItem(cartStorageKey, JSON.stringify(cart));
};

const renderProducts = () => {
	productsGrid.innerHTML = products.map((product) => `
		<article class="product-card">
			<div class="title-bar">
				<div class="title-bar-text">${product.name}</div>
				<div class="title-bar-controls" aria-label="window controls">
					<button type="button" aria-label="Minimize"></button>
					<button type="button" aria-label="Restore"></button>
					<button type="button" aria-label="Close"></button>
				</div>
			</div>
			<img src="Images/${product.image}" alt="${product.name}">
			<div class="product-content">
				<h3>${product.name}</h3>
				<p class="price">${formatPrice(product.price)}</p>
				<button class="add-button" type="button" data-product-id="${product.id}">Add to cart</button>
			</div>
		</article>
	`).join("");

	productsGrid.querySelectorAll("[data-product-id]").forEach((button) => {
		button.addEventListener("click", () => addToCart(button.dataset.productId));
	});
};

const addToCart = (productId) => {
	const existingItem = cart.find((item) => item.id === productId);

	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		cart.push({ id: productId, quantity: 1 });
	}

	saveCart();
	renderCart();
};

const removeFromCart = (productId) => {
	cart = cart.filter((item) => item.id !== productId);
	saveCart();
	renderCart();
};

const renderCart = () => {
	if (cart.length === 0) {
		cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
	} else {
		cartItems.innerHTML = cart.map((item) => {
			const product = products.find((entry) => entry.id === item.id);
			return `
				<div class="cart-item">
					<strong>${product.name}</strong>
					<small>${item.quantity} x ${formatPrice(product.price)}</small>
					<button class="remove-button" type="button" data-remove-id="${product.id}">Remove</button>
				</div>
			`;
		}).join("");

		cartItems.querySelectorAll("[data-remove-id]").forEach((button) => {
			button.addEventListener("click", () => removeFromCart(button.dataset.removeId));
		});
	}

	const total = cart.reduce((sum, item) => {
		const product = products.find((entry) => entry.id === item.id);
		return sum + product.price * item.quantity;
	}, 0);

	cartTotal.textContent = formatPrice(total);
	checkoutLink.classList.toggle("disabled", cart.length === 0);
	checkoutLink.setAttribute("aria-disabled", String(cart.length === 0));
};

clearCartButton.addEventListener("click", () => {
	cart = [];
	saveCart();
	renderCart();
});

document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});

renderProducts();
renderCart();
