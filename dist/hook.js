exports.errorHandlerHook = (Instance) => {
	Object.getOwnPropertyNames(Instance.prototype).forEach((name) => {
		if (
			name.charAt(0) !== "_" &&
			typeof Instance.prototype[name] === "function" &&
			name !== "constructor"
		) {
			Instance.prototype[`#${name}`] = Instance.prototype[name];
			Instance.prototype[name] = function (...args) {
				// throw on missing key
				if (!this._secretKey || typeof this._secretKey !== "string") {
					this._throwMissingKey();
				}
				// if is Promise
				if (
					typeof this[`#${name}`](...args) === "object" &&
					typeof this[`#${name}`](...args).then === "function" &&
					typeof this[`#${name}`](...args).catch === "function"
				) {
					return new Promise((resolve) => {
						this._resolve().then((state) => {
							if (!state) {
								this._errorHandler(
									new Error(
										`Can't resolve your stripe private key "${this._secretKey}" !`
									)
								);
							}
							resolve(this[`#${name}`](...args).catch(this._errorHandler));
						});
					});
				} else {
					return this[`#${name}`](...args);
				}
			};
		}
	});
};
