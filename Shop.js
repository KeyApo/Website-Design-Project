/* Product catalog and cart state */
document.querySelectorAll(".title-bar-controls").forEach((controls) => {
	controls.setAttribute("aria-hidden", "true");
	controls.querySelectorAll("button").forEach((button) => {
		button.tabIndex = -1;
	});
});

const products = [
	{ id: "vic-standee", image: "Vic Blanco-Deis, Ref.png", name: "Vic Blanco-Deis Standee", stock: 1, price: 10 },
	{ id: "alejandro-standee", image: "Alejandro, King of Hearts, Ref.png", name: "Alejandro Standee", stock: 2, price: 10 },
	{ id: "star-globe-poster", image: "Star Globe Theater Promo, Orpheus and Pierre.png", name: "Star Globe Theater Mystery Poster", stock: 0, price: 25 },
	{ id: "vhd-poster", image: "Vampire Hunter D, Patrick Nagel Inspo Art.png", name: "VHD Patrick Nagel Style Poster", stock: 5, price: 20 },
	{ id: "holy-alucard", image: "Alucard, Holy Render.png", name: "Alucard in Holy Light Poster", stock: 1, price: 20 },
	{ id: "bbg-alucard-poster", image: "BBG Alucard Redraw 2025 (UPDATED).png", name: "First Meeting Poster", stock: 10, price: 25 },
	{ id: "d-pierre-poster", image: "D and Pierre, Humility COLORED.png", name: "Humility Poster", stock: 1, price: 20 },
	{ id: "neon-birthday-poster", image: "Neon 22 Birthday.png", name: "NeonReflections 22nd Birthday Poster", stock: 10, price: 20 },
	{ id: "pierre-render-standee", image: "Pierre, Reference + Render.png", name: "Pierre Penn Standee", stock: 5, price: 20 },
	{ id: "voz-enki-poster", image: "Voz, Enki Meeting.png", name: "Voz and Enki Meeting Poster", stock: 3, price: 20 },
	{ id: "voz-copy-poster", image: "Voz, Ref.png", name: "Voz Standee", stock: 10, price: 20 },
	{ id: "d-pierre-keepsake-poster", image: "D and Pierre, Keepsake, JULY UPDATE.png", name: "Keepsake Poster", stock: 0, price: 25 }
];

const cartStorageKey = "neonreflections-cart";
const stockStorageKey = "neonreflections-stock";
const productsGrid = document.getElementById("products-grid");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutLink = document.getElementById("checkout-link");
const clearCartButton = document.getElementById("clear-cart");
const cartPanel = document.querySelector(".cart-panel");
const cartStatus = document.getElementById("cart-status");

const sessionAddedKey = "neonreflections-session-added";
const purchaseCookieKey = "neonreflections-purchases";

let cart;
let stock = {};

try {
	cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
} catch {
	cart = [];
}

if (!Array.isArray(cart)) cart = [];

try {
	stock = JSON.parse(localStorage.getItem(stockStorageKey) || "{}");
} catch {
	stock = {};
}

products.forEach((product) => {
	const savedStock = stock[product.id];
	stock[product.id] = Number.isInteger(savedStock) && savedStock >= 0
		? savedStock
		: (Number.isInteger(product.stock) && product.stock >= 0 ? product.stock : 0);
});

const saveStock = () => {
	localStorage.setItem(stockStorageKey, JSON.stringify(stock));
};

saveStock();

const getCartQuantity = (productId) => {
	const item = cart.find((entry) => entry.id === productId);
	return item && Number.isInteger(item.quantity) ? item.quantity : 0;
};

const getAvailableStock = (productId) => Math.max(0, stock[productId] - getCartQuantity(productId));

cart = cart.map((item) => ({
	...item,
	quantity: Math.min(item.quantity, stock[item.id] || 0)
})).filter((item) => {
	const product = products.find((entry) => entry.id === item.id);
	return product && Number.isInteger(item.quantity) && item.quantity > 0;
});

const formatPrice = (price) => `$${price}`;

const getSessionAdded = () => Number(sessionStorage.getItem(sessionAddedKey) || 0);

const setSessionAdded = (count) => {
	sessionStorage.setItem(sessionAddedKey, String(count));
};

const getPreviousPurchases = () => {
	const cookie = document.cookie.split("; ").find((entry) => entry.startsWith(`${purchaseCookieKey}=`));
	return cookie ? Number(cookie.split("=")[1]) || 0 : 0;
};

const updateCartStatus = () => {
	const previousPurchases = getPreviousPurchases();
	cartStatus.textContent = `${getSessionAdded()} item(s) added this session | ${previousPurchases} item(s) purchased previously`;
};

const animateCart = (productId) => {
	cartPanel.classList.remove("cart-bounce");
	void cartPanel.offsetWidth;
	cartPanel.classList.add("cart-bounce");

	const productButton = document.querySelector(`[data-product-id="${productId}"]`);
	productButton.classList.remove("item-added");
	void productButton.offsetWidth;
	productButton.classList.add("item-added");
};

/* Persist the cart between pages */
const saveCart = () => {
	localStorage.setItem(cartStorageKey, JSON.stringify(cart));
};

const renderProducts = () => {
	productsGrid.innerHTML = products.map((product) => `
		<article class="product-card${getAvailableStock(product.id) === 0 ? " sold-out" : ""}">
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
				<p class="stock-label">${getAvailableStock(product.id) === 0 ? "Sold out" : `${getAvailableStock(product.id)} available`}</p>
				<button class="add-button" type="button" data-product-id="${product.id}"${getAvailableStock(product.id) === 0 ? " disabled" : ""}>${getAvailableStock(product.id) === 0 ? "Sold out" : "Add to cart"}</button>
			</div>
		</article>
	`).join("");

	productsGrid.querySelectorAll("[data-product-id]").forEach((button) => {
		button.addEventListener("click", () => addToCart(button.dataset.productId));
	});

	productsGrid.querySelectorAll(".title-bar-controls").forEach((controls) => {
		controls.setAttribute("aria-hidden", "true");
		controls.querySelectorAll("button").forEach((button) => {
			button.tabIndex = -1;
		});
	});
};

/* Cart mutations */
const addToCart = (productId) => {
	const product = products.find((entry) => entry.id === productId);
	if (!product || getAvailableStock(productId) <= 0) return;

	const existingItem = cart.find((item) => item.id === productId);
	if (existingItem && getAvailableStock(productId) <= 0) {
		cartStatus.textContent = `${product.name} is limited to the ${stock[productId]} item(s) in stock.`;
		return;
	}

	if (existingItem) {
		if (Number.isInteger(existingItem.quantity) && existingItem.quantity > 0) {
			existingItem.quantity += 1;
		} else {
			existingItem.quantity = 1;
		}
	} else {
		cart.push({ id: productId, quantity: 1 });
	}

	setSessionAdded(getSessionAdded() + 1);
	saveCart();
	renderCart();
	renderProducts();
	updateCartStatus();
	animateCart(productId);
};

const removeFromCart = (productId) => {
	const item = cart.find((entry) => entry.id === productId);
	if (!item) return;

	if (item.quantity > 1) {
		item.quantity -= 1;
	} else {
		cart = cart.filter((entry) => entry.id !== productId);
	}

	saveCart();
	renderCart();
	renderProducts();
	updateCartStatus();
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
	const isEmpty = cart.length === 0;
	checkoutLink.classList.toggle("disabled", isEmpty);
	checkoutLink.setAttribute("aria-disabled", String(isEmpty));
};

clearCartButton.addEventListener("click", () => {
	cart = [];
	saveCart();
	renderCart();
	renderProducts();
	updateCartStatus();
});

checkoutLink.addEventListener("click", (event) => {
	if (cart.length === 0) event.preventDefault();
});

document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});

renderProducts();
renderCart();
updateCartStatus();
