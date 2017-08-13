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


export default (options={}) => {
	return store => next => action => {
		const { exclude = [] } = options;
		if(!exclude.includes(action.type)) {
			const state = cleanse(store.getState());
			sessionStorage.setItem(options.name, JSON.stringify(state));
		}
		console.log(next);
		next(action);
	};
};
