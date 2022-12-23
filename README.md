# 🔱 Better Stripe 🔱

## Stripe connector with instance selector

![https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png](https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png)

## **Prerequisites**

#### Environment variable:

`STRIPE_API_SECRET`="sk_stripe"

### Architecture 🏗

```
/better-stripe
  --/lib
      --/hook.js : Stripe hooks initialized here
      --/setup.js : private methods and set up
      --/stripe.js : file called to initialize stripe instance
			--/stripe.d.ts : type definition of stripe file for typescript
  --/index.js : initialization of stripe instance
```

## How to use ? 🤔

### With commonJS

```jsx
const { Stripe } = require("@dulysse1/better-stripe");
```

### With ES6 and more

```jsx
import { Stripe } from "@dulysse1/better-stripe";
```

## Documentation 🧗

### Choose instance:

#### Default instance 🔥

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

Stripe.main; // use Stripe secret key in .env file (STRIPE_API_SECRET)
```

#### Dynamic instance ⚡️

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

Stripe.store("sk_stripe"); // use specific Stripe secret key !
```

### Methods:

#### Get Stripe initialized 🔋

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

const stripe = Stripe.main.getInstance();
console.log(stripe);
```

```shell
> Stripe [object, Object]
```

#### Upload Image to Stripe 🌄

```jsx
const { Stripe } = require("@dulysse1/better-stripe");
const fs = require("fs");
const fileBuffer = fs.readFileSync("./file.png");

const { url } = await Stripe.store("sk_stripe").uploadImage(
	fileBuffer,
	"demo.png"
);
console.log(url);
```

```shell
> "https://url.of.stripe.image.demo.png"
```

#### List Stripe customers 🧑‍💻

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

const { data } = await Stripe.main.listCustomers();
console.log(data);
```

```shell
> [ ... ]
```

#### Create a new Stripe customer 🧑‍💻

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

const { id } = await Stripe.main.createCustomer({
	name: "customer_name",
	email: "customer_email",
	description: "customer_description",
	address: "customer_address",
});
console.log(id);
```

```shell
> "cus_MuMfCIj5KbYc6P"
```

#### List Stripe products 🥕

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

const { data } = await Stripe.store("sk_stripe").listProduct();
console.log(data);
```

```shell
> [ ... ]
```

#### Create a new Stripe product 🥕

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

const { id } = await Stripe.main.createProduct({
	name: "product_name",
	description: "product_description",
	images: ["stripe_file_url"],
	default_price_data: {
		currency: "EUR",
		unit_amount_decimal: 1000, // 10 €
	},
});
console.log(id);
```

```shell
> "prod_MuMepkWVBITkxl"
```

#### Create a new Stripe session checkout 🧾

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

const { url } = await Stripe.store("sk_stripe").createCheckout(
	[
		{
			quantity: 1,
			price: "price_id",
		},
	],
	"http://localhost:1337/callback/success",
	"http://localhost:1337/callback/error"
);
console.log(url);
```

```shell
> "https://stripe.com/checkout/session/dzedjeojferifozeji4dz5de4zed46"
```

#### Get balance of Stripe 💸

```jsx
const { Stripe } = require("@dulysse1/better-stripe");

const balance = await Stripe.main.getBalance();
console.log(balance);
```

```shell
> {
	object: 'balance',
	available: [Array],
	livemode: false,
	pending: [Array]
}
```

#### ...and more ! ✌️

## Information

Author: Ulysse Dupont @Ulysse

Contact: ulysse@euranov.com
