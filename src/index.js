const WILDCARD = '*';

/**
 * Deletes the reference to a value specified by the path
 * @param {object} obj - source object
 * @param {Array} path - the path of keys to the target of deletion
 */
export function deleteInPath(obj, path) {
	let ref = obj;
	for(let i = 0; i < path.length - 1; i++) {
		ref = ref[ path[ i ] ];
	}
	delete ref[ path[ path.length - 1 ] ];
	return obj;
}

/**
 *
 * @param {object} state
 * @param {object} exclusionMap
 */
export function cleanse(state = {}, exclusionMap = {}) {
	state        = Object.assign({}, state);
	exclusionMap = new Map(Object.entries(exclusionMap));
	exclusionMap.forEach((values, reducer) => {
		if(values === WILDCARD) {
			delete state[ reducer ];
		}
		else if(!Array.isArray(values)) {
			throw TypeError(`Expected ${values} to be an array`);
		}
		else {
			deleteInPath(state[ reducer ], values);
		}
	});
	return state;
}


/**
 *
 * @param {object} options
 * @property {string} options.name - The name of the property to set in sessionStorage
 * @property {object} [options.exclude={}] - An object representing parts of the state to exclude
 * @property {Array} [options.ignoreActions=[]]
 * @returns {function(*=): function(*=): function(*=)}
 */
export default (options={}) => {
	return store => next => action => {
		const { ignoreActions = [] } = options;
		if(!ignoreActions.includes(action.type)) {
			const state = cleanse(store.getState(), options.exclude);
			sessionStorage.setItem(options.name, JSON.stringify(state));
		}
		next(action);
	};
};
