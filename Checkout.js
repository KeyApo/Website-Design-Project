const products = [
	{ id: "vic-standee", name: "Vic Blanco-Deis Standee", price: 10 },
	{ id: "alejandro-standee", name: "Alejandro Standee", price: 10 },
	{ id: "star-globe-poster", name: "Star Globe Theater Mystery Poster", price: 25 },
	{ id: "vhd-poster", name: "VHD Patrick Nagel Style Poster", price: 20 }
];

const cartStorageKey = "neonreflections-cart";
const cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
const checkoutItems = document.getElementById("checkout-items");
const summaryCount = document.getElementById("summary-count");
const summaryTotal = document.getElementById("summary-total");
const checkoutForm = document.getElementById("checkout-form");
const orderMessage = document.getElementById("order-message");

const formatPrice = (price) => `$${price}`;

const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
const totalPrice = cart.reduce((sum, item) => {
	const product = products.find((entry) => entry.id === item.id);
	return sum + product.price * item.quantity;
}, 0);

if (cart.length === 0) {
	checkoutItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add something from the store first.</p>';
} else {
	checkoutItems.innerHTML = cart.map((item) => {
		const product = products.find((entry) => entry.id === item.id);
		return `<p><strong>${product.name}</strong><br>${item.quantity} x ${formatPrice(product.price)}</p>`;
	}).join("");
}

summaryCount.textContent = totalItems;
summaryTotal.textContent = formatPrice(totalPrice);

checkoutForm.addEventListener("submit", (event) => {
	event.preventDefault();

	if (cart.length === 0) {
		orderMessage.hidden = false;
		orderMessage.textContent = "Add a product to your cart before placing an order.";
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
