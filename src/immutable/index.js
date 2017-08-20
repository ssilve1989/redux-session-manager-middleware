import * as log from 'loglevel';
import { DEBUG_PREFIX, FORMATTING } from '../constants';

export default (options = {}) => {
	return store => next => action => {
		log.setLevel(options.debug ? 'debug' : 'info');

		const { ignoreActions = [] } = options;

		if(!ignoreActions.includes(action.type)) {
			const state = cleanse(store.getState(), options.exclude);

			log.debug(DEBUG_PREFIX, FORMATTING, 'Saving state as: ', state);

			sessionStorage.setItem(options.name, JSON.stringify(state));
		}

		return next(action);
	};
};

/**
 *
 * @param {Immutable.Map} state
 * @param {object} exclude
 */
export function cleanse(state, exclude = []) {
	return state.withMutations(state => {
		exclude.forEach(exclusion => {
			if(Array.isArray(exclusion)) {
				const reducer  = exclusion[ 0 ];
				const keyPaths = exclusion[ 1 ];

				if(!Array.isArray(keyPaths)) {
					throw TypeError(`Expected value to be an array, instead received ${typeof keyPaths}`);
				}

				keyPaths.forEach(keyPath => {
					if(typeof keyPath === 'string') {
						state = state.deleteIn([ reducer, keyPath ]);
					}
					else if(Array.isArray(keyPath)) {
						state = state.deleteIn([ reducer, ...keyPath ]);
					}
				});
			}
			else if(typeof exclusion === 'string') {
				state = state.delete(exclusion);
			}
		});
	});
}