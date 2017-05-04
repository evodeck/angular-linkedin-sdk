import {
    Observable
} from 'rxjs';
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
        let subject: LinkedInService;

        beforeEach(() => {
            const domHelperDummy = jasmine.createSpyObj<DomHelper>('domHelperDummy', ['insertLinkedInScriptElement']);
            const windowDummy = new Object();
            const apiKey = '';
            const authorize = false;
            subject = new LinkedInService(domHelperDummy, windowDummy, apiKey, authorize);
        });

        describe('And we make a RAW API call', () => {

            it('should return fluent api call', () => {
                const dummyUrl = 'dummyURL';
                const fluentApiCall = subject.raw(dummyUrl);
                expect(fluentApiCall instanceof FluentApiCall).toBeTruthy();
            });

            // TODO testing if constructor of FluentApiCall gets calls -> but seems not easily possible
            // since let constructorSpy = spyOn(FluentApiCall.prototype, 'constructor').and.callThrough();
            // let fluentApiCall = sut.raw();
            // expect(fluentApiCall.constructor).toHaveBeenCalled(); does not work as expected
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

            describe('And we refresh a user session', () => {
                it('should return an observable', () => {
                    let result = subject.refresh();
                    expect(result instanceof Observable).toBeTruthy();
                });

                it('should not emit', fakeAsync(() => {
                    let actual = false;
                    subject.refresh().subscribe({
                        next: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toBe(false);
                }));

                it('should not complete', fakeAsync(() => {
                    let actual = false;
                    subject.refresh().subscribe({
                        complete: () => {
                            actual = true;
                        }
                    });
                    expect(actual).toBe(false);
                }));
            });

            describe('And we request SDK IN', () => {
                it('should return undefined', () => {
                    const actual = subject.getSdkIN();
                    expect(actual).toBe(undefined);
                });
            });
        });
    });

    describe('And LinkedIN API is loaded', () => {

        class WindowStub {
            public constructor(public IN: INStub) {
            }
        }

        class INStub {
            public constructor(public User: UserStub, public Event: EventStub) {
            }
        }

        class EventStub {
            public on(inStub: INStub, eventName: string, callback) {
            }
        }

        class UserStub {
            public authorize(callback) {
                callback();
            }
            public logout(callback) {
                callback();
            }
            public isAuthorized() {
            }
            public refresh() {
            }
        }

        let inStub: INStub;
        let windowStub: WindowStub;
        let userStub: UserStub;
        let eventStub: EventStub;
        let subject: LinkedInService;
        let loadLibraryCallback: () => void;

        beforeEach(() => {
            const domHelperSpy = jasmine.createSpyObj<DomHelper>('domHelperSpy', ['insertLinkedInScriptElement']);
            (<jasmine.Spy>domHelperSpy.insertLinkedInScriptElement).and.callFake((callback) => {
                loadLibraryCallback = callback;
            });
            userStub = new UserStub();
            eventStub = new EventStub();
            inStub = new INStub(userStub, eventStub);
            windowStub = new WindowStub(inStub);
            const apiKey = '';
            const authorize = false;
            subject = new LinkedInService(domHelperSpy, windowStub, apiKey, authorize);
        });

        describe('And we perform login', () => {
            it('should emit true', () => {
                spyOn(userStub, 'isAuthorized').and.returnValue(true);
                loadLibraryCallback();
                let actual = false;
                subject.login().subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBeTruthy();
            });

            it('should complete', () => {
                loadLibraryCallback();
                let calledComplete = false;
                subject.login().subscribe({
                    complete: () => {
                        calledComplete = !calledComplete;
                    }
                });
                expect(calledComplete).toBeTruthy();
            });

            it('should emit true from isUserAuthenticated$', fakeAsync(() => {
                let actual = undefined;
                spyOn(eventStub, 'on').and.callFake((IN: any, eventName: string, callback) => {
                    if (eventName === 'auth') {
                        subject.login().subscribe({
                            complete: () => {
                                callback();
                            }
                        });
                    }
                });
                loadLibraryCallback();
                subject.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBe(true);
            }));
        });

        describe('And we observe the logged in state', () => {
            it('should emit true when the user is logged in', fakeAsync(() => {
                spyOn(userStub, 'isAuthorized').and.returnValue(true);
                loadLibraryCallback();
                let actual = undefined;
                subject.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBeTruthy();
            }));

            it('should emit false when the user is not logged in', fakeAsync(() => {
                spyOn(userStub, 'isAuthorized').and.returnValue(false);
                loadLibraryCallback();
                let actual = undefined;
                subject.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBe(false);
            }));
        });

        describe('And we perform logout', () => {
            it('should emit when the logout callback is called', fakeAsync(() => {
                loadLibraryCallback();
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
                loadLibraryCallback();
                subject.logout().subscribe({
                    complete: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));

            it('should emit false from isUserAuthenticated$', fakeAsync(() => {
                let actual = undefined;
                spyOn(eventStub, 'on').and.callFake((IN: any, eventName: string, callback) => {
                    if (eventName === 'logout') {
                        subject.logout().subscribe({
                            complete: () => {
                                callback();
                            }
                        });
                    }
                });
                loadLibraryCallback();
                subject.isUserAuthenticated$.subscribe({
                    next: (state) => {
                        actual = <boolean>state;
                    }
                });
                expect(actual).toBe(false);
            }));
        });

        describe('And we refresh a user session', () => {
            it('should return an observable', () => {
                let result = subject.refresh();
                expect(result instanceof Observable).toBeTruthy();
            });

            it('should emit', fakeAsync(() => {
                loadLibraryCallback();
                let actual = false;
                subject.refresh().subscribe({
                    next: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));

            it('should complete', fakeAsync(() => {
                let actual = false;
                loadLibraryCallback();
                subject.refresh().subscribe({
                    complete: () => {
                        actual = true;
                    }
                });
                expect(actual).toBeTruthy();
            }));
        });

        describe('And we request SDK IN', () => {
            it('should not return undefined', () => {
                loadLibraryCallback();
                const actual = subject.getSdkIN();
                expect(actual).not.toBe(undefined);
            });
        });
    });
});
