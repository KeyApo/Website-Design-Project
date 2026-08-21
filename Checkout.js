/* Checkout product catalog and stored cart */
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
let cart;

try {
	cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
} catch {
	cart = [];
}

if (!Array.isArray(cart)) cart = [];
const checkoutItems = document.getElementById("checkout-items");
const summaryCount = document.getElementById("summary-count");
const summaryTotal = document.getElementById("summary-total");
const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");
const couponCode = document.getElementById("coupon-code");
const applyCouponButton = document.getElementById("apply-coupon");
const couponMessage = document.getElementById("coupon-message");

const formatPrice = (price) => `$${price}`;

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

	localStorage.removeItem(cartStorageKey);
	checkoutForm.hidden = true;
	orderMessage.hidden = false;
	orderMessage.textContent = "Thank you! Your demo order has been recorded locally.";
});

document.querySelectorAll("[data-current-year]").forEach((year) => {
	year.textContent = new Date().getFullYear();
});
