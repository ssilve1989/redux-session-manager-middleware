import { expect, assert } from 'chai';
import sessionManagerMiddleware, { cleanse, deleteInPath } from '../src/index';

describe('Session Manager', () => {
	const doDispatch  = () => {};
	const doGetState  = () => {};
	const nextHandler = sessionManagerMiddleware()({ dispatch: doDispatch, getState: doGetState });

	it('must return a function to handle next', () => {
		assert.isFunction(nextHandler);
		assert.strictEqual(nextHandler.length, 1);
	});

	describe('handle next', () => {
		const actionHandler = nextHandler();
		assert.isFunction(actionHandler);
		assert.strictEqual(actionHandler.length, 1);
	});

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

			const newState = cleanse(state, {
				d: '*'
			});

			expect(newState).to.eql({ b: { c: 1 } });
		});

		it('deletes a specific nested entry', () => {
			const state = {
				b : {
					c : {
						d: 1
					}
				}
			};

			const newState = cleanse(state, {
				b : ['c', 'd']
			});
			expect(newState).to.eql({
				b : {
					c: {}
				}
			});
		});
	});
});