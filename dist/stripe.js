require("@dulysse1/better-node");
const { Setup } = require("./setup");
const { errorHandlerHook } = require("./hook");

class StripeService extends Setup {
	getInstance() {
		return this._stripe;
	}

	listCustomers(params) {
		return this._stripe.customers.list(params);
	}

	createCheckout(prices, successUrl, cancelUrl, params = {}) {
		return this._stripe.checkout.sessions.create({
			success_url: successUrl,
			cancel_url: cancelUrl,
			line_items: prices,
			mode: "payment",
			...params,
		});
	}

	createProduct(data) {
		return this._stripe.products.create(data);
	}

	createCustomer(data) {
		return this._stripe.customers.create(data);
	}

	listProduct(params) {
		return this._stripe.products.list(params);
	}

	async uploadImage(data, name, type = "application.octet-stream") {
		const { id } = await this._stripe.files.create({
			file: { data, name, type },
			purpose: "dispute_evidence",
		});
		return this._stripe.fileLinks.create({ file: id });
	}

	getBalance() {
		return new Promise((resolve) => resolve(this._balance));
	}
}

// * HOOKS *
errorHandlerHook(StripeService);

exports.Stripe = {
	main: new StripeService(process.env.STRIPE_API_SECRET, false),
	store(stripeSecretKey, strictMode = true) {
		return new StripeService(stripeSecretKey, strictMode);
	},
};
