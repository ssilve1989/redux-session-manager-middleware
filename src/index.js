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
 * @param {array} exclude
 */
export function cleanse(state, exclude = []) {
	state = Object.assign({}, state);

	exclude.forEach(exclusion => {
		if(Array.isArray(exclusion)) {
			// It is a key-value pair representation.
			// Meaning the first value will be the reducer name
			// and the second value will be an array of key paths
			const reducer  = exclusion[ 0 ];
			const keyPaths = exclusion[ 1 ];

			// If its not an array, inform the caller
			if(!Array.isArray(keyPaths)) {
				throw TypeError(`Expected value to be an array, instead received ${typeof keyPaths}`);
			}

			keyPaths.forEach(keyPath => {
				// Each element in the array could either be a string representing a single property
				// or an array representing a path to the property
				if(typeof keyPath === 'string') {
					delete state[ reducer ][ keyPath ];
				}
				else if(Array.isArray(keyPath)) {
					deleteInPath(state[ reducer ], keyPath);
				}
			});
		}
		else if(typeof exclusion === 'string') {
			delete state[ exclusion ];
		}
	});

	// for(let [ reducer, keyPath ] of Object.entries(exclude)) {
	// 	if(keyPath === WILDCARD) {
	// 		delete state[ reducer ];
	// 	}
	// 	else if(!Array.isArray(keyPath)) {
	// 		throw TypeError(`Expected ${keyPath} to be an array`);
	// 	}
	// 	else {
	// 		deleteInPath(state[ reducer ], keyPath);
	// 	}
	// }
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
export default (options = {}) => {
	return store => next => action => {
		const { ignoreActions = [] } = options;
		if(!ignoreActions.includes(action.type)) {
			const state = cleanse(store.getState(), options.exclude);
			sessionStorage.setItem(options.name, JSON.stringify(state));
		}
		return next(action);
	};
};
