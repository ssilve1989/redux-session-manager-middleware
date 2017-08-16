import { expect } from 'chai';
import { cleanse, deleteInPath } from '../src/index';

describe('Session Manager', () => {
	describe('deleteInPath', () => {
		it('deletes a nested property', () => {
			const a = { b: { c: { d: 1 } } };
			deleteInPath(a, [ 'b', 'c', 'd' ]);
			expect(a.b.c.d).to.not.exist;
		});
	});

	describe('Cleanse', () => {
		it('deletes an entire branch of an object', () => {
			const state = {
				b: {
					c: 1
				},
				d: {
					e: 2
				}
			};

			const newState = cleanse(state, [ 'd' ]);

			expect(newState).to.eql({ b: { c: 1 } });
		});

		it('deletes a specific nested entry', () => {
			const state = {
				b: {
					c: {
						d: 1
					},
					e: {
						x: 123
					},
					f: {
						h: 243
					}
				}
			};

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
