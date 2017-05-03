import {
    DomHelper
} from './dom.helper';

describe('When using DomHelper', () => {
    let callIsInZoneHelper: boolean;
    let window: any;
    let document: any;
    let zoneHelperSpy: any;
    let subject: DomHelper;

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
        // PLATFORM_ID values https://github.com/angular/angular/blob/master/packages/common/src/platform_id.ts
        const platformId = 'browser';
        callIsInZoneHelper = false;
        window = new Object();
        document = new DocumentMock();
        zoneHelperSpy = jasmine.createSpyObj('zoneHelper', ['runZoneIfNotAlready']);
        zoneHelperSpy.runZoneIfNotAlready.and.callFake((callback) => {
            callback();
        });
        subject = new DomHelper(zoneHelperSpy, document, window, platformId);
    });

    describe('to write to the DOM', () => {
        it('the initialization callback should be defined', () => {
            const initializationCallback = () => { };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            expect(window['linkedInStateChangeRef']).toBeDefined();
        });

        it('zoneHelper should be called when calling the initialization callback', () => {
            const initializationCallback = () => { };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            window['linkedInStateChangeRef']();
            expect(zoneHelperSpy.runZoneIfNotAlready).toHaveBeenCalled();
        });

        it('the initialization callback should not be called unless the library loads', () => {
            let initializationCallbackCalled = false;
            const initializationCallback = () => {
                initializationCallbackCalled = true;
            };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            expect(initializationCallbackCalled).toBeFalsy();
        });

        it('should not throw exception when the library loads without initialization callback', () => {
            const initializationCallback = undefined;
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            expect(() => window['linkedInStateChangeRef']()).not.toThrow();
        });

        it('initialization callback should be called when the library loads', () => {
            let initializationCallbackCalled = false;
            const initializationCallback = () => {
                initializationCallbackCalled = true;
            };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            window['linkedInStateChangeRef']();
            expect(initializationCallbackCalled).toBeTruthy();
        });

        it('initialization callback should be called within zoneHelper when the library loads', () => {
            const initializationCallback = () => {
                callIsInZoneHelper = true;
            };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            window['linkedInStateChangeRef']();
            expect(callIsInZoneHelper).toBeTruthy();
        });

        it('document should create a script element', () => {
            const createElementSpy = spyOn(document, 'createElement').and.callThrough();
            const initializationCallback = () => { };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            expect(createElementSpy).toHaveBeenCalledWith('script');
        });

        it('document head appendChild should be called', () => {
            const appendChildSpy = spyOn(document.head, 'appendChild').and.callThrough();
            const initializationCallback = () => { };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            expect(appendChildSpy).toHaveBeenCalled();
        });

        it('document head appendChild should be called with script element referencing linkedIn SDK library', () => {
            let element: ElementMock = undefined;
            spyOn(document.head, 'appendChild').and.callFake((paramElement) => {
                element = paramElement;
            });
            const initializationCallback = () => { };
            const apiKey = '';
            const authorize = true;
            subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
            const scriptElementLibrary = '//platform.linkedin.com/in.js';
            expect(element.src).toContain(scriptElementLibrary);
        });

        describe('the authorize parameter', () => {
            [true, false]
                .forEach((authorize) => {
                    it(`should contain authorize value to ${authorize}`, () => {
                        let element: ElementMock = undefined;
                        spyOn(document.head, 'appendChild').and.callFake((paramElement) => {
                            element = paramElement;
                        });
                        const expectedAuthorizeValue = `\nauthorize: ${authorize}\n`;
                        const initializationCallback = () => { };
                        const apiKey = '';
                        subject.insertLinkedInScriptElement(initializationCallback, apiKey, authorize);
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
                        const authorize = true;
                        subject.insertLinkedInScriptElement(initializationCallback, expectedApiKey, authorize);
                        expect(element.innerHTML).toMatch(expectedApiKey);
                    });
                });
        });
    });
});
