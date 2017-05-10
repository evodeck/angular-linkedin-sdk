import { browser, element, by } from 'protractor';

describe('When running the demo', () => {
    describe('And the login button is clicked', () => {
        it('should open the login pop up', async () => {
            browser.get('/');
            let popUpWindow: any;
            element(by.id('loginBtt')).click();
            await browser.getAllWindowHandles().then((handles) => {
                popUpWindow = handles[1];
            });
            expect(popUpWindow).toBeDefined();
        });
    });

    describe('The login button', () => {
        it('should show up on screen', () => {
            browser.get('/');
            const elem = element(by.id('loginBtt'));
            expect(elem.isPresent()).toBeTruthy();
        });

    });
});
