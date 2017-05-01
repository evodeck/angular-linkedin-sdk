import {
    DomHelper
} from './dom.helper';

describe('DomHelper', () => {
    let callIsInZoneHelper: boolean;

    let window : any;
    let document : any;
    let zoneHelper : any;

    let subject : DomHelper;


    class ElementMock {
        public src : string;

        public type : string;

        public innerHTML : string;
    }

    class DocumentHeadMock{
        public appendChild(element : ElementMock){
            
        }
    }

    class DocumentMock{
        constructor(){
            this.head = new DocumentHeadMock();
        }

        public createElement(name:string){
            return new ElementMock();
        }

        public head : DocumentHeadMock;
    }
    
    beforeEach(()=>{
        callIsInZoneHelper = false;

        window = new Object();
        document = new DocumentMock();

        document.createElement('scripts');

        zoneHelper = jasmine.createSpyObj('zoneHelper', ['runZoneIfNotAlready']);
        zoneHelper.runZoneIfNotAlready.and.callFake((callback)=>{
            callIsInZoneHelper = true;
            callback();
            callIsInZoneHelper = false;
        });

        subject = new DomHelper(zoneHelper, document, window);
    });


    describe('call insertLinkedInScriptElement(...)', () => {
        it('linkedInStateChangeRef callback should be defined', () => {
            subject.insertLinkedInScriptElement(() => {}, '', true);

            expect(window['linkedInStateChangeRef']).toBeDefined();
        });

        it('zoneHelper.runZoneIfNotAlready should be called when calling linkedInStateChangeRef callback', () => {
            subject.insertLinkedInScriptElement(() => {}, '', true);

            window['linkedInStateChangeRef']();

            expect(zoneHelper.runZoneIfNotAlready).toHaveBeenCalled();
        });

        it('initializationCallback should not be called unless calling linkedInStateChangeRef callback', () => {
            let initializationCallbackCalled = false;
            subject.insertLinkedInScriptElement(() => {initializationCallbackCalled}, '', true);

            expect(initializationCallbackCalled).toBeFalsy();
        });

        it('should not throw exception when calling linkedInStateChangeRef callback without defined initializationCallback', () => {
            subject.insertLinkedInScriptElement(undefined, '', true);
            
            expect(() => window['linkedInStateChangeRef']()).not.toThrow();
        });

        it('initializationCallback should be called when calling linkedInStateChangeRef callback', () => {
            let initializationCallbackCalled = false;
            subject.insertLinkedInScriptElement(() => {initializationCallbackCalled}, '', true);

            window['linkedInStateChangeRef']();

            expect(initializationCallbackCalled).toBeFalsy();
        });

        it('initializationCallback should be called within zoneHelper when calling linkedInStateChangeRef callback', () => {
            subject.insertLinkedInScriptElement(() => {expect(callIsInZoneHelper).toBeTruthy();}, '', true);

            window['linkedInStateChangeRef']();
        });

        it('createElement should be called', () => {
            let createElementSpy = spyOn(document, 'createElement').and.callThrough();

            subject.insertLinkedInScriptElement(() => {}, '', true);

            expect(createElementSpy).toHaveBeenCalledWith('script');
        });

        it('appendChild should be called', () => {
            let appendChildSpy = spyOn(document.head, 'appendChild').and.callThrough();

            subject.insertLinkedInScriptElement(() => {}, '', true);

            expect(appendChildSpy).toHaveBeenCalled();
        });

        it('appendChild should be called with script element referencing linkedIn SDK library', () => {
            let element : ElementMock;
            let appendChildSpy = spyOn(document.head, 'appendChild').and.callFake((paramElement)=>{
                element = paramElement;
            });

            subject.insertLinkedInScriptElement(() => {}, '', true);

            expect(element.src).toContain('//platform.linkedin.com/in.js');
        });

        it('appendChild should be called with script element referencing linkedIn SDK library', () => {
            let element : ElementMock;
            let appendChildSpy = spyOn(document.head, 'appendChild').and.callFake((paramElement)=>{
                element = paramElement;
            });

            subject.insertLinkedInScriptElement(() => {}, '', true);

            expect(element.src).toContain('//platform.linkedin.com/in.js');
        });

        describe('testing authorize parameter', () => {
            [true, false]
                .forEach((authorize) => {
                    it(`should contain authorize value to ${authorize}`, () => {
                        let element : ElementMock;
                        let appendChildSpy = spyOn(document.head, 'appendChild').and.callFake((paramElement)=>{
                            element = paramElement;
                        });
                        const expectedAuthorizeValue = `\nauthorize: ${authorize}\n`;

                        subject.insertLinkedInScriptElement(() => {}, '', authorize);

                        expect(element.innerHTML).toMatch(expectedAuthorizeValue);
                    });
                });
        });

        describe('testing api keys', () => {
            ['xyz', 'abc', '123', '123abc'] // valid API Keys
                .forEach((apiKey) => {
                    it(`should contain API key ${apiKey}`, () => {
                        let element : ElementMock;
                        let appendChildSpy = spyOn(document.head, 'appendChild').and.callFake((paramElement)=>{
                            element = paramElement;
                        });
                        const expectedApiKey = `\napi_key: ${apiKey}\n`;

                        subject.insertLinkedInScriptElement(() => {}, expectedApiKey, true);

                        expect(element.innerHTML).toMatch(expectedApiKey);
                    });
                });
        });
    });
});
