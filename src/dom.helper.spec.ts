import {
    DomHelper
} from './dom.helper';

describe('When using DomHelper', () => {
    describe('in the browser', () => {
        let callIsInZoneHelper: boolean;
        let window: any;
        let document: any;
        let zoneHelperSpy: any;
        let subject: DomHelper;
        let isServer: boolean;

        class ElementMock {
            public src: string;
            public type: string;
            public innerHTML: string;
        }

        class DocumentHeadMock {
            public appendChild(element: ElementMock) {
            }
        }

        class DocumentMock {
            public head: DocumentHeadMock;

            public constructor() {
                this.head = new DocumentHeadMock();
            }

            public createElement(name: string) {
                return new ElementMock();
            }
        }

        beforeEach(() => {
            isServer = false;
            callIsInZoneHelper = false;
            window = new Object();
            document = new DocumentMock();
            zoneHelperSpy = jasmine.createSpyObj('zoneHelper', ['runZoneIfNotAlready']);
            zoneHelperSpy.runZoneIfNotAlready.and.callFake((callback) => {
                callback();
            });
            subject = new DomHelper(zoneHelperSpy, document, window);
        });

        describe('to write to the DOM', () => {
            it('the initialization callback should be defined', () => {
                const initializationCallback = () => { };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                expect(window['linkedInStateChangeRef']).toBeDefined();
            });

            it('zoneHelper should be called when calling the initialization callback', () => {
                const initializationCallback = () => { };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                window['linkedInStateChangeRef']();
                expect(zoneHelperSpy.runZoneIfNotAlready).toHaveBeenCalled();
            });

            it('the initialization callback should not be called unless the library loads', () => {
                let initializationCallbackCalled = false;
                const initializationCallback = () => {
                    initializationCallbackCalled = true;
                };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                expect(initializationCallbackCalled).toBeFalsy();
            });

            it('should not throw exception when the library loads without initialization callback', () => {
                const initializationCallback = undefined;
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                expect(() => window['linkedInStateChangeRef']()).not.toThrow();
            });

            it('initialization callback should be called when the library loads', () => {
                let initializationCallbackCalled = false;
                const initializationCallback = () => {
                    initializationCallbackCalled = true;
                };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                window['linkedInStateChangeRef']();
                expect(initializationCallbackCalled).toBeTruthy();
            });

            it('initialization callback should be called within zoneHelper when the library loads', () => {
                const initializationCallback = () => {
                    callIsInZoneHelper = true;
                };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                window['linkedInStateChangeRef']();
                expect(callIsInZoneHelper).toBeTruthy();
            });

            it('document should create a script element', () => {
                const createElementSpy = spyOn(document, 'createElement').and.callThrough();
                const initializationCallback = () => { };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                expect(createElementSpy).toHaveBeenCalledWith('script');
            });

            it('document head appendChild should be called', () => {
                const appendChildSpy = spyOn(document.head, 'appendChild').and.callThrough();
                const initializationCallback = () => { };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                expect(appendChildSpy).toHaveBeenCalled();
            });

            it('document head appendChild should be called with script element referencing linkedIn SDK library', () => {
                let element: ElementMock = undefined;
                spyOn(document.head, 'appendChild').and.callFake((paramElement) => {
                    element = paramElement;
                });
                const initializationCallback = () => { };
                const apiKeyDummy = '';
                const authorizeDummy = true;
                subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
                const scriptElementLibrary = '//platform.linkedin.com/in.js';
                expect(element.src).toContain(scriptElementLibrary);
            });

            describe('the authorize value', () => {
                [true, false]
                    .forEach((authorize) => {
                        it(`should contain authorize value to ${authorize}`, () => {
                            let element: ElementMock = undefined;
                            spyOn(document.head, 'appendChild').and.callFake((paramElement) => {
                                element = paramElement;
                            });
                            const expectedAuthorizeValue = `\nauthorize: ${authorize}\n`;
                            const initializationCallback = () => { };
                            const apiKeyDummy = '';
                            subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorize, isServer);
                            expect(element.innerHTML).toMatch(expectedAuthorizeValue);
                        });
                    });
            });

            describe('the API key', () => {
                ['xyz', 'abc', '123', '123abc'] // API Keys
                    .forEach((apiKey) => {
                        it(`should contain API key ${apiKey}`, () => {
                            let element: ElementMock = undefined;
                            spyOn(document.head, 'appendChild').and.callFake((paramElement) => {
                                element = paramElement;
                            });
                            const expectedApiKey = `\napi_key: ${apiKey}\n`;
                            const initializationCallback = () => { };
                            const authorizeDummy = true;
                            subject.insertLinkedInScriptElement(initializationCallback, expectedApiKey, authorizeDummy, isServer);
                            expect(element.innerHTML).toMatch(expectedApiKey);
                        });
                    });
            });
        });
    });

    describe('in the server', () => {
        let subject: DomHelper;
        let window: any;
        let isServer: boolean;

        beforeEach(() => {
            isServer = true;
            window = new Object();
            const documentDummy: Object = new Object();
            const zoneHelperDummy: any = new Object();
            subject = new DomHelper(zoneHelperDummy, documentDummy, window);
        });

        it('the initialization callback should be undefined', () => {
            const initializationCallback = () => { };
            const apiKeyDummy = '';
            const authorizeDummy = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKeyDummy, authorizeDummy, isServer);
            expect(window['linkedInStateChangeRef']).toBe(undefined);
        });
    });
});
