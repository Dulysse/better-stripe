const { Stripe } = require("stripe");

class Setup {
	/**
	 * @private
	 * @type {string}
	 */
	_secretKey;

	/**
	 * @protected
	 * @type {Stripe}
	 */
	_stripe;

	constructor(stripeSecretKey) {
		this._secretKey = stripeSecretKey;
		this._init();
	}

	/**
	 * @private
	 * @returns {void}
	 */
	_init() {
		if (!this._secretKey || typeof this._secretKey !== "string") {
			throw new Error(
				"\n❌ Incorrect Stripe private key: If you are using the default stripe, check your env variable 'STRIPE_API_SECRET', otherwise your Store secret key is incorrect.".red.bold
			);
		}
		this._stripe = Stripe(this._secretKey);
	}

	/**
	 * @protected
	 * @type {(err: Stripe.errors.StripeError) => never}
	 */
	_errorHandler(err) {
		switch (err.type) {
			case "StripeCardError":
				throw new Error(`\n❌ ${err.message}`.red.bold);
			case "StripeRateLimitError":
				throw new Error("\n⚠️ Keep calm and take a break.".red.bold);
			case "StripeInvalidRequestError":
				throw new Error(
					`\n⚠️ Invalid parameters were supplied to Stripe's API : ${err.message}`.red.bold
				);
			case "StripeAPIError":
				throw new Error(`\n❌ Internal stripe Error : ${err.message}`.red.bold);
			case "StripeConnectionError":
			case "StripeAuthenticationError":
				throw new Error(
					"\n❌ Incorrect Stripe private key: If you are using the default stripe, check your env variable 'STRIPE_API_SECRET', otherwise your Store secret key is incorrect.".red.bold
				);
			default:
				throw new Error(`\n❌ Unknown Stripe error: ${err.message}`.red.bold);
		}
	}
}

exports.Setup = Setup;
