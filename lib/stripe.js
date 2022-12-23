require("@dulysse1/better-node");
const Stripe = require("stripe");
const { Setup } = require("./setup");
const { errorHandlerHook } = require("./hook");

class StripeService extends Setup {
	/**
	 * ### Get Stripe instance
	 * @public
	 */
	getInstance() {
		return this._stripe;
	}

	/**
	 * ### Returns a list of your customers. The customers are returned sorted by creation date, with the most recent customers appearing first.
	 * @public
	 * @param {Stripe.Stripe.CustomerListParams} params Add parameters to your request
	 */
	listCustomers(params) {
		return this._stripe.customers.list(params);
	}

	/**
	 * ### Creates a Session object.
	 * @public
	 * @param {Stripe.Stripe.Checkout.SessionCreateParams.LineItem[]} prices
	 * @param {string} successUrl
	 * @param {string} cancelUrl
	 */
	createCheckout(prices, successUrl, cancelUrl) {
		return this._stripe.checkout.sessions.create({
			success_url: successUrl,
			cancel_url: cancelUrl,
			line_items: prices,
			mode: "payment",
		});
	}

	/**
	 * ### Creates a new product object.
	 * @public
	 * @param {{
	 *		default_price_data: {
	 *			currency: "USD" | "EUR";
	 *			unit_amount_decimal: number;
	 *		};
	 *		name: string;
	 *		description?: string;
	 *		images?: string[];
	 *}} data product creation data
	 */
	createProduct(data) {
		return this._stripe.products.create(data);
	}

	/**
	 * ### Creates a new customer object.
	 * @public
	 * @param {Stripe.Stripe.CustomerCreateParams} data customer creation data
	 */
	createCustomer(data) {
		return this._stripe.customers.create(data);
	}

	/**
	 * ### Returns a list of your products. The products are returned sorted by creation date, with the most recently created products appearing first.
	 * @param {Stripe.Stripe.ProductListParams} params list parameters for products
	 */
	listProduct(params) {
		return this._stripe.products.list(params);
	}

	/**
	 * ### Creates a new file link object.
	 * @public
	 * @param {Buffer} data Buffer of your file
	 * @param {string} name the name of your file
	 * @param {string} type File type
	 */
	async uploadImage(data, name, type = "application.octet-stream") {
		const { id } = await this._stripe.files.create({
			file: { data, name, type },
			purpose: "dispute_evidence",
		});
		return this._stripe.fileLinks.create({ file: id });
	}
}

// * HOOKS *
errorHandlerHook(StripeService);

/**
 * ## Stripe Service
 * @description init local instance & multi-instance of Stripe
 * @requires @dulysse1/better-node
 * @requires Stripe
 * @author Ulysse Dupont
 */
exports.Stripe = {
	/**
	 * ### Connection to default stripe set up with env variable `STRIPE_API_SECRET`
	 * @returns {StripeService} Your Stripe local instance
	 */
	default: new StripeService(process.env.STRIPE_API_SECRET),
	/**
	 * ### Connection to a specific Stripe store
	 * @param {string} stripeSecretKey The secret API key of the stripe store
	 * @returns {StripeService} Your Stripe specified instance
	 */
	store(stripeSecretKey) {
		return new StripeService(stripeSecretKey);
	},
};
