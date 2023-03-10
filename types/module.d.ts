import { Stripe as S } from "stripe";
/**
 * Project: https://github.com/Dulysse/better-stripe
 * @author Ulysse Dupont <https://github.com/Dulysse>
 * @requires better-node
 * @requires stripe
 */
declare module "@dulysse1/better-stripe" {
	declare class StripeService {
		/**
		 * ### Get Stripe instance
		 * @public
		 */
		public getInstance(): S;

		/**
		 * ### Returns a list of your customers. The customers are returned sorted by creation date, with the most recent customers appearing first.
		 * @public
		 * @param {S.CustomerListParams} params Add parameters to your request
		 */
		public listCustomers(
			params?: S.CustomerListParams
		): S.ApiListPromise<S.Customer>;

		/**
		 * ### Creates a Session object.
		 * @public
		 * @param {S.Checkout.SessionCreateParams.LineItem[]} prices
		 * @param {string} successUrl
		 * @param {string} cancelUrl
		 */
		public createCheckout(
			prices: S.Checkout.SessionCreateParams.LineItem[],
			successUrl: string,
			cancelUrl: string,
			params?: Omit<
				S.Checkout.SessionCreateParams,
				"line_items" | "success_url" | "cancel_url"
			>
		): Promise<S.Response<S.Checkout.Session>>;

		/**
		 * ### Creates a new product object.
		 * @public
		 * @param data product creation data
		 */
		public createProduct(data: {
			default_price_data: {
				currency: "USD" | "EUR";
				unit_amount_decimal: number;
			};
			name: string;
			description?: string;
			images?: string[];
		}): Promise<S.Response<S.Product>>;

		/**
		 * ### Creates a new customer object.
		 * @public
		 * @param {S.CustomerCreateParams} data customer creation data
		 */
		public createCustomer(
			data: S.CustomerCreateParams
		): Promise<S.Response<S.Customer>>;

		/**
		 * ### Returns a list of your products. The products are returned sorted by creation date, with the most recently created products appearing first.
		 * @param {S.ProductListParams} params list parameters for products
		 */
		public listProduct(
			params?: S.ProductListParams
		): S.ApiListPromise<S.Product>;

		/**
		 * ### Creates a new file link object.
		 * @public
		 * @param {Buffer} data Buffer of your file
		 * @param {string} name the name of your file
		 * @param {string} type File type
		 * @default "application.octet-stream"
		 */
		public uploadImage(
			data: Buffer,
			name: string,
			type?: string
		): Promise<S.Response<S.FileLink>>;

		/**
		 * ### Get current Stripe Balance object.
		 * @public
		 */
		public getBalance(): Promise<S.Balance>;
	}
	export = {
		/**
		 * ## ???? Stripe Service ????
		 * @description init local instance & multi-instance of Stripe
		 * @requires better-node
		 * @requires stripe
		 * @author Ulysse Dupont
		 */
		Stripe: {
			/**
			 * ### Connection to main stripe set up with env variable `STRIPE_API_SECRET`
			 * @returns {StripeService} Your Stripe local instance
			 */
			main: new StripeService(),
			/**
			 * ### Connection to a specific Stripe store
			 * @param {string} stripeSecretKey The secret API key of the stripe store
			 * @param {boolean} strictMode allow strict secret key check @default true
			 * @returns {StripeService} Your Stripe specified instance
			 */
			store: (stripeSecretKey: string, strictMode?: boolean) =>
				new StripeService(),
		},
	};
}
// * Override Process env add STRIPE_API_SECRET *
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			/**
			 * @override process.env
			 * ### Your stripe API secret key
			 * @example STRIPE_API_SECRET="sk_test_..."
			 */
			STRIPE_API_SECRET: string;
		}
	}
}

export default {};
