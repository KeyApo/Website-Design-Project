/* Product catalog and cart state */
const products = [
	{ id: "vic-standee", image: "Vic Blanco-Deis, Ref.png", name: "Vic Blanco-Deis Standee", price: 10 },
	{ id: "alejandro-standee", image: "Alejandro, King of Hearts, Ref.png", name: "Alejandro Standee", price: 10 },
	{ id: "star-globe-poster", image: "Star Globe Theater Promo, Orpheus and Pierre.png", name: "Star Globe Theater Mystery Poster", price: 25 },
	{ id: "vhd-poster", image: "Vampire Hunter D, Patrick Nagel Inspo Art.png", name: "VHD Patrick Nagel Style Poster", price: 20 },
	{ id: "holy-alucard", image: "Alucard, Holy Render.png", name: "Alucard in Holy Light Poster", price: 20 },
	{ id: "bbg-alucard-poster", image: "BBG Alucard Redraw 2025 (UPDATED).png", name: "First Meeting Poster", price: 25 },
	{ id: "d-pierre-poster", image: "D and Pierre, Humility COLORED.png", name: "Humility Poster", price: 20 },
	{ id: "neon-birthday-poster", image: "Neon 22 Birthday.png", name: "NeonReflections 22nd Birthday Poster", price: 20 },
	{ id: "pierre-render-standee", image: "Pierre, Reference + Render.png", name: "Pierre Penn Standee", price: 20 },
	{ id: "voz-enki-poster", image: "Voz, Enki Meeting.png", name: "Voz and Enki Meeting Poster", price: 20 },
	{ id: "voz-copy-poster", image: "Voz, Ref.png", name: "Voz Standee", price: 20 },
	{ id: "d-pierre-keepsake-poster", image: "D and Pierre, Keepsake, JULY UPDATE.png", name: "Keepsake Poster", price: 25 }
];

const cartStorageKey = "neonreflections-cart";
const productsGrid = document.getElementById("products-grid");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutLink = document.getElementById("checkout-link");
const clearCartButton = document.getElementById("clear-cart");

let cart;

try {
	cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
} catch {
	cart = [];
}

if (!Array.isArray(cart)) cart = [];

cart = cart.filter((item) => {
	const product = products.find((entry) => entry.id === item.id);
	return product && Number.isInteger(item.quantity) && item.quantity > 0;
});

const formatPrice = (price) => `$${price}`;

/* Persist the cart between pages */
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

/* Cart mutations */
const addToCart = (productId) => {
	const product = products.find((entry) => entry.id === productId);
	if (!product) return;

	const existingItem = cart.find((item) => item.id === productId);

	if (existingItem) {
		if (Number.isInteger(existingItem.quantity) && existingItem.quantity > 0) {
			existingItem.quantity += 1;
		} else {
			existingItem.quantity = 1;
		}
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

/* Render cart contents and totals */
const renderCart = () => {
	if (cart.length === 0) {
		cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
	} else {
		cartItems.innerHTML = cart.filter((item) => products.some((product) => product.id === item.id)).map((item) => {
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
		return product && Number.isInteger(item.quantity) && item.quantity > 0
			? sum + product.price * item.quantity
			: sum;
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

checkoutLink.addEventListener("click", (event) => {
	if (cart.length === 0) event.preventDefault();
});

document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});

renderProducts();
renderCart();
