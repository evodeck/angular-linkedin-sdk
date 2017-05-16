import {
} from 'jasmine';
import {
    browser,
    by,
    element
} from 'protractor';

describe('When running the demo', () => {
    const loginButtonId = 'loginBtn';

    it('the login button should be present', async () => {
        let isLoginButtonPresent = false;
        const root = '/';
        browser.get(root);
        const loginButton = element(by.id(loginButtonId));
        await loginButton.isPresent().then((value) => {
            isLoginButtonPresent = value;
        });
        expect(isLoginButtonPresent).toBeTruthy();
    });

    describe('The LinkedIN library', () => {
        const timeout = 5000;

        it('should be loaded', async () => {
            await browser.wait(
                () => {
                    return browser.findElement(by.name('isInitializedEmittedValue')).isDisplayed();
                }
                , timeout
                , 'LinkedIN library not loaded.');
        });

        describe('Is loaded and the login button is clicked', () => {
            const session_keyName = 'session_key';
            const session_passwordName = 'session_password';
            const authorizeName = 'authorize';

            it('should open the login pop up', async () => {
                element(by.id(loginButtonId)).click();
                await browser.getAllWindowHandles().then((handles) => {
                    browser.switchTo().window(handles[1]);
                    browser.ignoreSynchronization = true;
                    browser.wait(
                        () => {
                            return browser.isElementPresent(by.name(session_keyName))
                                && browser.isElementPresent(by.name(session_passwordName))
                                && browser.isElementPresent(by.name(authorizeName));
                        }
                        , timeout
                        , 'LinkedIN popup not loaded or not all elements found.');
                });
            });

            describe('To perform a login', () => {
                it('should login without timeout', async () => {
                    const logoutButtonId = 'logoutBtn';
                    const username = 'test.dummy.linkedin@gmail.com';
                    const password = 'linkedinapp';
                    browser.findElement(by.name(session_keyName)).sendKeys(username);
                    browser.findElement(by.name(session_passwordName)).sendKeys(password);
                    browser.findElement(by.name(authorizeName)).click();
                    await browser.getAllWindowHandles().then((handles) => {
                        browser.switchTo().window(handles[0]);
                    });
                    browser.wait(
                        () => {
                            return browser.findElement(by.id(logoutButtonId)).isDisplayed();
                        }
                        , timeout
                        , 'Login failed or not loaded in time.');
                });
            });
        });
    });
});
