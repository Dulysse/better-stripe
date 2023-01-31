require("@dulysse1/better-node");
const assert = require("assert").strict;
const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const open = require("open");
require("dotenv").config();
const { Stripe } = require("../dist/stripe");
const { fetchUrl } = require("fetch");

/**
 *
 * @param {string} url
 * @returns {Promise<{ status: number; }>}
 */
function fetch(url) {
	return new Promise((resolve, reject) => {
		fetchUrl(url, {}, (err, result) => (err ? reject(err) : resolve(result)));
	});
}

describe("Better Stripe:", () => {
	const { main, store } = Stripe;
	let customerId, imageUrl, defaultPrice, checkoutUrl;
	describe("Init:", () => {
		it("Init default instance:", () => {
			expect(main.getInstance()).to.be.an("object");
		});
		it("Init a store instance:", () => {
			expect(store(process.env.STRIPE_API_SECRET).getInstance()).to.be.an(
				"object"
			);
		});
	});
	describe("Methods:", () => {
		it("List customers:", async () => {
			const { data } = await main.listCustomers();
			expect(data).to.be.an("array");
		});
		it("List products:", async () => {
			const { data } = await main.listProduct();
			expect(data).to.be.an("array");
		});
		it("Get current account balance:", async () => {
			const { available } = await main.getBalance();
			const { amount } = available.first();
			expect(amount).to.be.greaterThanOrEqual(0);
		});
		it("Create a customer:", async () => {
			const { id } = await main.createCustomer({
				email: "test@domain.com",
				name: "John Doe",
			});
			customerId = id;
			expect(id).to.be.a("string");
		});

		it("Upload an image:", async () => {
			const { url } = await main.uploadImage(
				fs.readFileSync(path.join(__dirname, "box.png")),
				"Pasta Box"
			);
			imageUrl = url;
			expect(url).to.be.a("string");
		});
		it("Upload a product:", async () => {
			const { default_price: price } = await main.createProduct({
				default_price_data: {
					currency: "EUR",
					unit_amount_decimal: 490,
				},
				description: "Very tasty !",
				name: "Pasta Box",
				images: [imageUrl],
			});
			defaultPrice = price;
			expect(price).to.be.a("string");
		});
		it("Create a checkout:", async () => {
			const { url } = await main.createCheckout(
				[
					{
						quantity: 1,
						price: defaultPrice,
					},
				],
				"http://localhost:3000/success",
				"http://localhost:3000/error"
			);
			checkoutUrl = url;
			expect(url).to.be.a("string");
		});
	});
	describe("Other:", () => {
		it("List charges:", async () => {
			const { data } = await main.getInstance().charges.list();
			expect(data).to.be.an("array");
		});
		it("Remove created customer:", async () => {
			const { id } = await main.getInstance().customers.del(customerId);
			expect(id).to.be.a("string");
		});
		it("Resolve checkout URL:", async () => {
			const { status } = await fetch(checkoutUrl);
			assert.equal(status, 200);
		});
		it("Open checkout on a browser:", async () => {
			const childProcess = await open(checkoutUrl);
			expect(childProcess).to.be.an("object");
		});
	});
});
