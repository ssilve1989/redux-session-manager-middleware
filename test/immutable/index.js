import { expect } from 'chai';
import Immutable from 'immutable';
import sampleState from '../state';
import { cleanse } from '../../src/immutable';

describe('ImmutableJS', () => {
	let state;
	beforeEach(() => {
		state = Immutable.fromJS(sampleState);
	});
	describe('Cleanse', () => {
		it('deletes an entire branch of an object', () => {
			const newState = cleanse(state, ['b']);
			expect(newState.toJS()).to.eql({});
		});

		it('deletes a specific nested entry', () => {
			const newState = cleanse(state, [
				['b', [
					['c', 'd'],
					'e',
					['f', 'h']
				]]
			]);

			expect(newState.toJS()).to.eql({
				b: {
					c: {},
					f: {}
				}
			});
		});
	});
});