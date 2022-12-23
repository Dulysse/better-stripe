const { Stripe } = require("stripe");

class Setup {
	/**
	 * @private
	 * @type {string}
	 */
	_secretKey;

	/**
	 * @private
	 * @type {boolean}
	 */
	_strictMode;

	/**
	 * @protected
	 * @type {Stripe}
	 */
	_stripe;

	/**
	 * @protected
	 * @type {Stripe.Balance}
	 */
	_balance;

	/**
	 * @param {string} stripeSecretKey The secret API key of the stripe store
	 * @param {boolean} strictMode allow strict secret key check @default true
	 */
	constructor(stripeSecretKey, strictMode) {
		this._secretKey = stripeSecretKey;
		this._strictMode = strictMode;
		this._init();
	}

	/**
	 * @private
	 * @returns {void}
	 */
	_init() {
		if (
			this._strictMode &&
			(!this._secretKey || typeof this._secretKey !== "string")
		) {
			this._throwMissingKey();
		}
		this._stripe = Stripe(this._secretKey);
	}

	/**
	 * @private
	 * @returns {never}
	 */
	_throwMissingKey() {
		throw new Error(
			"\n❌ Incorrect Stripe private key: If you are using the default stripe, check your env variable 'STRIPE_API_SECRET', otherwise your Store secret key is incorrect.".red.bold
		);
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

	/**
	 * ### Check Stripe instance connection
	 * @public
	 * @returns {Promise<boolean>}
	 */
	_resolve() {
		return new Promise((resolve) => {
			this._stripe.balance
				.retrieve()
				.then((balance) => {
					this._balance = balance;
					resolve(true);
				})
				.catch(() => resolve(false));
		});
	}
}

exports.Setup = Setup;
