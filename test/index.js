import { expect } from 'chai';
import sampleState from './state';
import { cleanse, deleteInPath } from '../src/index';

describe('Session Manager', () => {
	it('verifies sessionStorage mock works', () => {
		const a = { x : 1 };
		sessionStorage.setItem('test', JSON.stringify(a));
		const b = JSON.parse(sessionStorage.getItem('test'));
		expect(a).to.eql(b);
	});

	describe('deleteInPath', () => {
		it('deletes a nested property', () => {
			const a = { b: { c: { d: 1 } } };
			deleteInPath(a, [ 'b', 'c', 'd' ]);
			expect(a.b.c.d).to.not.exist;
		});
	});

	describe('Cleanse', () => {
		let state;
		beforeEach(() => {
			state = Object.assign({}, sampleState);
		});

		it('deletes an entire branch of an object', () => {
			const newState = cleanse(state, [ 'b' ]);
			expect(newState).to.eql({});
		});

		it('deletes a specific nested entry', () => {
			const newState = cleanse(state, [
				[ 'b', [
					[ 'c', 'd' ],
					'e',
					[ 'f', 'h' ]
				]]
			]);

			expect(newState).to.eql({
				b: {
					c: {},
					f: {}
				}
			});
		});
	});
});
