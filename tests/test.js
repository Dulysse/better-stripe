require("dotenv").config();
const { Stripe } = require("../");

(async () => {
	try {
		console.log(await Stripe.main.listProduct());
		console.log(Stripe);
	} catch (err) {
		console.log(err);
	}
})();
