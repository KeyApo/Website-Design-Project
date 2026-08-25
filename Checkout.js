/* Checkout product catalog and stored cart */
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
	{ id: "voz-copy-poster", image: "Voz, Ref.png", name: "Voz Standee", stock: 0, price: 20 },
	{ id: "d-pierre-keepsake-poster", image: "D and Pierre, Keepsake, JULY UPDATE.png", name: "Keepsake Poster", stock: 0, price: 25 }
];

const cartStorageKey = "neonreflections-cart";
const stockStorageKey = "neonreflections-stock";
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
const checkoutItems = document.getElementById("checkout-items");
const summaryCount = document.getElementById("summary-count");
const summaryTotal = document.getElementById("summary-total");
const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");
const couponCode = document.getElementById("coupon-code");
const applyCouponButton = document.getElementById("apply-coupon");
const couponMessage = document.getElementById("coupon-message");
const purchaseCookieKey = "neonreflections-purchases";

const formatPrice = (price) => `$${price}`;

const getPreviousPurchases = () => {
	const cookie = document.cookie.split("; ").find((entry) => entry.startsWith(`${purchaseCookieKey}=`));
	return cookie ? Number(cookie.split("=")[1]) || 0 : 0;
};

const recordPurchase = (quantity) => {
	const purchaseCount = getPreviousPurchases() + quantity;
	document.cookie = `${purchaseCookieKey}=${purchaseCount}; max-age=31536000; path=/; SameSite=Lax`;
};

/* Remove malformed or outdated cart entries */
const validCart = cart.filter((item) => {
	const product = products.find((entry) => entry.id === item.id);
	return product && Number.isInteger(item.quantity) && item.quantity > 0;
});

const totalItems = validCart.reduce((sum, item) => sum + item.quantity, 0);
const subtotal = validCart.reduce((sum, item) => {
	const product = products.find((entry) => entry.id === item.id);
	return sum + product.price * item.quantity;
}, 0);
let discount = 0;

/* Recalculate the displayed total after a coupon change */
const updateTotal = () => {
	const total = Math.max(0, subtotal - discount);
	summaryTotal.textContent = formatPrice(total);
};

if (validCart.length === 0) {
	checkoutItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add something from the store first.</p>';
} else {
	checkoutItems.innerHTML = validCart.map((item) => {
		const product = products.find((entry) => entry.id === item.id);
		return `<p><strong>${product.name}</strong><br>${item.quantity} x ${formatPrice(product.price)}</p>`;
	}).join("");
}

summaryCount.textContent = totalItems;
updateTotal();

/* Validate and apply supported coupon codes */
applyCouponButton.addEventListener("click", () => {
	const code = couponCode.value.trim().toUpperCase();

	if (code === "NEON10") {
		discount = subtotal * 0.1;
		couponMessage.textContent = "NEON10 applied: 10% off your order.";
	} else if (code === "ARTIST5") {
		discount = 5;
		couponMessage.textContent = "ARTIST5 applied: $5 off your order.";
	} else {
		discount = 0;
		couponMessage.textContent = code ? "That coupon code is not valid." : "Enter a coupon code to apply it.";
	}

	updateTotal();
});

/* Validate the complete order before recording the demo order */
checkoutForm.addEventListener("submit", (event) => {
	event.preventDefault();

	if (validCart.length === 0) {
		orderMessage.hidden = false;
		orderMessage.textContent = "Add a product to your cart before placing an order.";
		return;
	}

	if (!checkoutForm.checkValidity()) {
		checkoutForm.reportValidity();
		orderMessage.hidden = false;
		orderMessage.textContent = "Please complete all required shipping and payment fields.";
		return;
	}

	let currentStock = stock;
	try {
		currentStock = JSON.parse(localStorage.getItem(stockStorageKey) || "{}");
	} catch {
		currentStock = stock;
	}

	const outOfStock = validCart.find((item) => item.quantity > (currentStock[item.id] || 0));
	if (outOfStock) {
		orderMessage.hidden = false;
		orderMessage.textContent = "One or more items are no longer available in the requested quantity. Return to the store to update your cart.";
		return;
	}

	localStorage.removeItem(cartStorageKey);
	validCart.forEach((item) => {
		currentStock[item.id] -= item.quantity;
	});
	stock = currentStock;
	saveStock();
	recordPurchase(totalItems);
	checkoutForm.hidden = true;
	orderMessage.hidden = false;
	orderMessage.textContent = "Thank you! Your demo order has been recorded locally.";
});

document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});
