import {
    LinkedInService
} from './linkedinapi.service';
import {
    FluentApiCall
} from './fluent.api.call';
import {
    fakeAsync
} from '@angular/core/testing';

class TestHelper {

    /**
     * Removes the tag 'script' from the document
     */
    public static removeScriptTagFromDocument() {
        const scriptTag = 'script';
        document.head.querySelector(scriptTag).remove();
    }
}

describe('When using LinkedIn API Wrapper', () => {

    describe('And we provide apiKey', () => {

        /**
         * System Under Test with an api key
         */
        class SutWithApiKey {

            public static create(apiKey: string) {
                const dummyZoneHelper: any = new Object();
                const dummyWindow: any = new Object();
                const dummyAuthorize: boolean = false;
                return new LinkedInService(dummyZoneHelper, apiKey, dummyWindow, dummyAuthorize);
            }
        }

        describe('With different API keys', () => {

            ['xyz', 'abc', '123', '123abc'] // API Keys
                .forEach((apiKey) => {
                    it(`should contain API key ${apiKey}`, () => {
                        const sut = SutWithApiKey.create(apiKey.toString());
                        const scriptTag = 'script';
                        const scriptTagInnerText = document.head.querySelector(scriptTag).innerText;
                        const expectedApiKey = `\napi_key: ${apiKey}\n`;
                        expect(scriptTagInnerText).toMatch(expectedApiKey);
                        TestHelper.removeScriptTagFromDocument();
                    });
                });
        });
    });

    describe('And we provide authorize', () => {

        /**
         * System Under Test with an authorize value
         */
        class SutWithAuthorizeValue {

            public static create(authorize: boolean) {
                const dummyZoneHelper: any = new Object();
                const dummyApiKey = 'dummyApiKey';
                const dummyWindow = {};
                return new LinkedInService(dummyZoneHelper, dummyApiKey, dummyWindow, authorize);
            }
        }

        describe('With different authorize values', () => {

            [true, false]
                .forEach((authorize) => {
                    it(`should contain authorize value to ${authorize}`, () => {
                        const sut = SutWithAuthorizeValue.create(authorize);
                        const scriptTag = 'script';
                        const scriptTagInnerText = document.head.querySelector(scriptTag).innerText;
                        const expectedApiKey = `\nauthorize: ${authorize}\n`;
                        expect(scriptTagInnerText).toMatch(expectedApiKey);
                        TestHelper.removeScriptTagFromDocument();
                    });
                });
        });
    });

    // Tests with dummy dependencies
    {
        /**
         * System Under Test instantiated with dummy dependencies
         */
        class SutWithDummies {

            public static create(): LinkedInService {
                const dummyZoneHelper: any = new Object();
                const dummyApiKey: string = 'apiKey';
                const dummyWindow: any = new Object();
                const dummyAuthorize: boolean = false;
                return new LinkedInService(
                    dummyZoneHelper,
                    dummyApiKey,
                    dummyWindow,
                    dummyAuthorize);
            }

            private constructor() {
            }
        }

        describe('And we create a new instance', () => {

            it('should be defined', () => {
                const sut = SutWithDummies.create();
                expect(sut).toBeDefined();
                TestHelper.removeScriptTagFromDocument();
            });

            it('should write the LinkedIN API javascript library in the DOM', () => {
                const sut = SutWithDummies.create();
                let scriptTags = document.head.querySelector('script');
                expect(scriptTags.src).toContain('//platform.linkedin.com/in.js');
                TestHelper.removeScriptTagFromDocument();
            });
        });

        describe('And we make a RAW API call', () => {

            it('should return fluent api call', () => {
                const sut = SutWithDummies.create();
                const dummyUrl = 'dummyURL';
                const fluentApiCall = sut.raw(dummyUrl);
                expect(fluentApiCall instanceof FluentApiCall).toBeTruthy();
                TestHelper.removeScriptTagFromDocument();
            });

            // TODO testing if constructor of FluentApiCall gets calles -> but seems not easily possible
            // since let constructorSpy = spyOn(FluentApiCall.prototype, 'constructor').and.callThrough();
            // let fluentApiCall = sut.raw();
            // expect(fluentApiCall.constructor).toHaveBeenCalled(); doesnt works as expected
        });

        describe('And LinkedIN API is not loaded', () => {

            describe('And we perform login', () => {

                it('should not emit', fakeAsync(() => {
                    const sut = SutWithDummies.create();
                    let actual = false;
                    sut.login().subscribe({
                        next: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toBeFalsy();
                    TestHelper.removeScriptTagFromDocument();
                }));

                it('should not complete', fakeAsync(() => {
                    const sut = SutWithDummies.create();
                    let actual = false;
                    sut.login().subscribe({
                        complete: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toBeFalsy();
                    TestHelper.removeScriptTagFromDocument();
                }));
            });

            describe('And we observe the logged in state', () => {

                it('should emit undefined', fakeAsync(() => {
                    const sut = SutWithDummies.create();
                    let actual = false;
                    sut.isUserAuthenticated$.subscribe({
                        next: (state) => {
                            actual = state;
                        }
                    });
                    expect(actual).toBeUndefined();
                    TestHelper.removeScriptTagFromDocument();
                }));
            });

            describe('And we perform logout', () => {

                it('should not emit from the callback of the LinkedIN API', fakeAsync(() => {
                    const sut = SutWithDummies.create();
                    let actual = false;
                    sut.logout().subscribe({
                        next: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toEqual(false);
                    TestHelper.removeScriptTagFromDocument();
                }));

                it('should not complete from the callback of the LinkedIN API', fakeAsync(() => {
                    const sut = SutWithDummies.create();
                    let actual = false;
                    sut.logout().subscribe({
                        complete: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toEqual(false);
                    TestHelper.removeScriptTagFromDocument();
                }));

                it('should not change isUserAuthenticated$ state from undefined', fakeAsync(() => {
                    let actual = false;
                    const sut = SutWithDummies.create();
                    sut.logout().subscribe();
                    sut.isUserAuthenticated$.subscribe({
                        next: (data) => {
                            actual = data;
                        }
                    });
                    expect(actual).toEqual(undefined);
                    TestHelper.removeScriptTagFromDocument();
                }));
            });
        });
    }

    describe(`To call 'linkedInStateChangeRef'`, () => {

        class MockZoneHelper {
            public runZoneIfNotAlready(callback: any) {
                callback();
            };


        }

        class WindowStub {
            public constructor(public IN: INStub) {
            }
        }

        class INStub {
            public constructor(public User: UserStub) {
            }
        }

        class UserStub {
            public isAuthorized() {
            }
        }

        /**
         * System Under Test with ZoneHelper mock and Window stub
         */
        class SutWithMockZoneHelperAndStubWindow {

            public static create(mockZoneHelper: any, stubWindow: any): LinkedInService {
                const dummyApiKey: string = 'apiKey';
                const dummyAuthorize: boolean = false;
                return new LinkedInService(
                    mockZoneHelper,
                    dummyApiKey,
                    stubWindow,
                    dummyAuthorize);
            }

            private constructor() {
            }
        }

        it('should be called once', () => {
            const stubWindow = new WindowStub(new INStub(new UserStub()));
            const mockZoneHelper: any = new MockZoneHelper();
            const sut = SutWithMockZoneHelperAndStubWindow.create(mockZoneHelper, stubWindow);
            spyOn(mockZoneHelper, 'runZoneIfNotAlready').and.callFake(
                (callbackToCall) => {
                    callbackToCall();
                });
            stubWindow['linkedInStateChangeRef']();
            expect(mockZoneHelper.runZoneIfNotAlready).toHaveBeenCalled();
            TestHelper.removeScriptTagFromDocument();
        });
    });

    describe('And LinkedIN API is loaded', () => {

        class ZoneHelperStub {

            public runZoneIfNotAlready(callback: any) {
                callback();
            }
        }

        class WindowStub {

            public constructor(public IN: INStub) {
            }
        }

        class INStub {

            public constructor(public User: UserStub) {
            }
        }

        class UserStub { }

        /**
         * System Under Test with ZoneHelper stub and Window stub
         */
        class SutWithZoneHelperStubAndWindowStub {

            public static create(stubZoneHelper: any, stubWindow: any): LinkedInService {
                const dummyApiKey: string = 'apiKey';
                const dummyAuthorize: boolean = false;
                return new LinkedInService(
                    stubZoneHelper,
                    dummyApiKey,
                    stubWindow,
                    dummyAuthorize);
            }

            private constructor() {
            }
        }

        describe('And we perform login', () => {

            class UserStub {

                public authorize(callback) {
                    callback();
                }

                public isAuthorized() {
                    return true;
                }
            }

            it('should emit true', () => {
                const stubZoneHelper = new ZoneHelperStub();
                const stubWindow = new WindowStub(new INStub(new UserStub()));
                const sut = SutWithZoneHelperStubAndWindowStub.create(stubZoneHelper, stubWindow);
                let actual = false;
                stubWindow['linkedInStateChangeRef']();
                sut.login().subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBeTruthy();
                TestHelper.removeScriptTagFromDocument();
            });

            it('should complete', () => {
                const stubZoneHelper = new ZoneHelperStub();
                const stubWindow = new WindowStub(new INStub(new UserStub()));
                const sut = SutWithZoneHelperStubAndWindowStub.create(stubZoneHelper, stubWindow);
                stubWindow['linkedInStateChangeRef']();
                let calledComplete = false;
                sut.login().subscribe({
                    complete: () => {
                        calledComplete = !calledComplete;
                    }
                });
                expect(calledComplete).toBeTruthy();
                TestHelper.removeScriptTagFromDocument();
            });
        });

        describe('And we observe the logged in state', () => {

            class UserStub {

                public constructor(private _isAuthorized: boolean) {
                }

                public isAuthorized() {
                    return this._isAuthorized;
                }
            }

            it('should emit true when the user is logged in', fakeAsync(() => {
                const stubZoneHelper = new ZoneHelperStub();
                const isAuthorized = true;
                const stubWindow = new WindowStub(new INStub(new UserStub(isAuthorized)));
                const sut = SutWithZoneHelperStubAndWindowStub.create(stubZoneHelper, stubWindow);
                let actual = false;
                stubWindow['linkedInStateChangeRef']();
                sut.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBeTruthy();
                TestHelper.removeScriptTagFromDocument();
            }));

            it('should emit false when the user is not logged in', fakeAsync(() => {
                const stubZoneHelper = new ZoneHelperStub();
                const isAuthorized = false;
                const stubWindow = new WindowStub(new INStub(new UserStub(isAuthorized)));
                const sut = SutWithZoneHelperStubAndWindowStub.create(stubZoneHelper, stubWindow);
                let actual = true;
                stubWindow['linkedInStateChangeRef']();
                sut.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBeFalsy();
                TestHelper.removeScriptTagFromDocument();
            }));
        });

        describe('And we perform logout', () => {

            class UserStub {

                public isAuthorized() {
                    return true;
                }

                public logout(callback: any) {
                    callback();
                }
            }

            it('should emit when the logout callback is called', fakeAsync(() => {
                const stubZoneHelper = new ZoneHelperStub();
                const stubWindow = new WindowStub(new INStub(new UserStub()));
                const sut = SutWithZoneHelperStubAndWindowStub.create(stubZoneHelper, stubWindow);
                stubWindow['linkedInStateChangeRef']();
                let actual = false;
                sut.logout().subscribe({
                    next: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
                TestHelper.removeScriptTagFromDocument();
            }));

            it('should complete when the logout callback is called', fakeAsync(() => {
                const stubZoneHelper = new ZoneHelperStub();
                const stubWindow = new WindowStub(new INStub(new UserStub()));
                const sut = SutWithZoneHelperStubAndWindowStub.create(stubZoneHelper, stubWindow);
                stubWindow['linkedInStateChangeRef']();
                let actual = false;
                sut.logout().subscribe({
                    complete: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
                TestHelper.removeScriptTagFromDocument();
            }));

            it('should emit the isUserAuthenticated$ state when the logout callback is called', fakeAsync(() => {
                const stubZoneHelper = new ZoneHelperStub();
                const stubWindow = new WindowStub(new INStub(new UserStub()));
                const sut = SutWithZoneHelperStubAndWindowStub.create(stubZoneHelper, stubWindow);
                stubWindow['linkedInStateChangeRef']();
                let actual = false;
                sut.logout().subscribe();
                sut.isUserAuthenticated$.subscribe({
                    next: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
                TestHelper.removeScriptTagFromDocument();
            }));
        });
    });
});
