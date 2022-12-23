const assert = require("assert").strict;
const expect = require("chai").expect;
require("dotenv").config();
const { Stripe } = require("../");

describe("Better Stripe", () => {
	describe("Init", () => {
		it("Init default instance", async () => {
			// expect().to.be.an("object");
		});
		it("Init a store instance", () => {
			// expect(Stripe.store(process.env.STRIPE_API_SECRET)).to.be.an("object");
		});
	});
});
