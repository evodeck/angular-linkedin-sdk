import {
    getWindow
} from './window.helper';

describe('When using window helper', () => {
    describe('and we call getWindow()', () => {
        it('should return a defined object', () => {
            const window = getWindow();
            expect(window).toBeDefined();
        });

        it('should return a Window type object', () => {
            const window = getWindow();
            expect(window).toEqual(jasmine.any(Window));
        });
    });
});
