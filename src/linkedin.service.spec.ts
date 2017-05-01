import { Observable } from 'rxjs';
import {
    LinkedInService
} from './linkedin.service';
import {
    FluentApiCall
} from './fluent.api.call';
import {
    DomHelper
} from './dom.helper';
import {
    fakeAsync
} from '@angular/core/testing';


describe('When using LinkedIn API Wrapper', () => {

    // Tests with dummy dependencies
    describe('', () => {
        let domHelperMock: DomHelper;
        let subject : LinkedInService;

        beforeEach(()=>{
            domHelperMock = jasmine.createSpyObj<DomHelper>("domHelperMock", ["insertLinkedInScriptElement"]);
            subject = new LinkedInService(domHelperMock, new Object(), "", false);
        });

        describe('And we make a RAW API call', () => {

            it('should return fluent api call', () => {
                const dummyUrl = 'dummyURL';
                const fluentApiCall = subject.raw(dummyUrl);
                expect(fluentApiCall instanceof FluentApiCall).toBeTruthy();
            });

            // TODO testing if constructor of FluentApiCall gets calles -> but seems not easily possible
            // since let constructorSpy = spyOn(FluentApiCall.prototype, 'constructor').and.callThrough();
            // let fluentApiCall = sut.raw();
            // expect(fluentApiCall.constructor).toHaveBeenCalled(); doesnt works as expected
        });

        describe('And LinkedIN API is not loaded', () => {

            describe('And we perform login', () => {

                it('should not emit', fakeAsync(() => {
                    let actual = false;
                    subject.login().subscribe({
                        next: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toBeFalsy();
                }));

                it('should not complete', fakeAsync(() => {
                    let actual = false;
                    subject.login().subscribe({
                        complete: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toBeFalsy();
                }));
            });

            describe('And we observe the isUserAuthenticated in state', () => {
                it('should emit undefined', fakeAsync(() => {
                    let actual = false;
                    subject.isUserAuthenticated$.subscribe({
                        next: (state) => {
                            actual = state;
                        }
                    });
                    expect(actual).toBeUndefined();
                }));
            });

            describe('And we perform logout', () => {

                it('should not emit from the callback of the LinkedIN API', fakeAsync(() => {
                    let actual = false;
                    subject.logout().subscribe({
                        next: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toEqual(false);
                }));

                it('should not complete from the callback of the LinkedIN API', fakeAsync(() => {
                    let actual = false;
                    subject.logout().subscribe({
                        complete: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toEqual(false);
                }));

                it('should not change isUserAuthenticated$ state from undefined', fakeAsync(() => {
                    let actual = false;
                    subject.logout().subscribe();
                    subject.isUserAuthenticated$.subscribe({
                        next: (data) => {
                            actual = data;
                        }
                    });
                    expect(actual).toEqual(undefined);
                }));
            });
        });
    });

    
    describe('And LinkedIN API is loaded', () => {

        class WindowStub {
            public constructor(public IN: INStub) {
            }
        }

        class INStub {
            public constructor(public User: UserStub) {
            }
        }

        class UserStub {
            public authorize(callback) {
                
            }
            public logout(callback) {
                
            }
            public isAuthorized() {
                
            }
            public refresh() {

            }
        }

        let inStub : INStub;
        let userStub : UserStub;
        let windowStub : WindowStub;

        let domHelperMock: DomHelper;
        let subject : LinkedInService;

        let initCallback : () => void;

        beforeEach(()=>{
            domHelperMock = jasmine.createSpyObj<DomHelper>("domHelperMock", ["insertLinkedInScriptElement"]);
            (<jasmine.Spy> domHelperMock.insertLinkedInScriptElement).and.callFake((callback)=> initCallback = callback);
            
            userStub = jasmine.createSpyObj<UserStub>("userStub", ["authorize", "logout", "isAuthorized", "refresh"]);
            (<jasmine.Spy> userStub.authorize).and.callFake((callback)=>callback());
            (<jasmine.Spy> userStub.logout).and.callFake((callback)=>callback());

            inStub = new INStub(userStub);
            windowStub = new WindowStub(inStub);
            subject = new LinkedInService(domHelperMock, windowStub, "", false);
        });


        
        describe('And we perform login', () => {

            it('should emit true', () => {
                (<jasmine.Spy> userStub.isAuthorized).and.returnValue(true);
                initCallback();

                let actual = false;
                subject.login().subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBeTruthy();
            });

            it('should complete', () => {
                initCallback();

                let calledComplete = false;
                subject.login().subscribe({
                    complete: () => {
                        calledComplete = !calledComplete;
                    }
                });
                expect(calledComplete).toBeTruthy();
            });
        });

        describe('And we observe the logged in state', () => {
            it('should emit true when the user is logged in', fakeAsync(() => {
                (<jasmine.Spy> userStub.isAuthorized).and.returnValue(true);
                initCallback();

                let actual = undefined;
                subject.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBeTruthy();
            }));

            it('should emit false when the user is not logged in', fakeAsync(() => {
                (<jasmine.Spy> userStub.isAuthorized).and.returnValue(false);
                initCallback();

                let actual = undefined;
                subject.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                
                expect(actual).toBeFalsy();
            }));
        });

        describe('And we perform logout', () => {

            it('should emit when the logout callback is called', fakeAsync(() => {
                initCallback();

                let actual = false;
                subject.logout().subscribe({
                    next: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));

            it('should complete when the logout callback is called', fakeAsync(() => {
                let actual = false;
                initCallback();

                subject.logout().subscribe({
                    complete: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));

            it('should emit the isUserAuthenticated$ state when the logout callback is called', fakeAsync(() => {
                initCallback();

                let actual = false;
                subject.logout().subscribe();
                subject.isUserAuthenticated$.subscribe({
                    next: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));
        });
        describe('when calling refresh()', ()=>{
            it('should return observable', ()=>{
                let result = subject.refresh();
                expect(result instanceof Observable).toBeTruthy();
            });

            it('should return observable', ()=>{
                let result = subject.refresh();
                expect(result instanceof Observable).toBeTruthy();
            });

            it('should always emit next', fakeAsync(() => {
                initCallback();

                let actual = false;
                subject.refresh().subscribe({
                    next: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));

            it('should always complete', fakeAsync(() => {
                let actual = false;
                initCallback();

                subject.refresh().subscribe({
                    complete: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));
        });
    });
});
