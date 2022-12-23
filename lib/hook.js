exports.errorHandlerHook = (Instance) => {
	Object.getOwnPropertyNames(Instance.prototype).forEach((name) => {
		if (
			name.charAt(0) !== "_" &&
			typeof Instance.prototype[name] === "function"
		) {
			Instance.prototype[`#${name}`] = Instance.prototype[name];
			Instance.prototype[name] = function (...args) {
				// if is Promise
				if (
					typeof this[`#${name}`](...args) === "object" &&
					typeof this[`#${name}`](...args).then === "function" &&
					typeof this[`#${name}`](...args).catch === "function"
				) {
					return this[`#${name}`](...args).catch(this._errorHandler);
				} else {
					return this[`#${name}`](...args);
				}
			};
		}
	});
};
